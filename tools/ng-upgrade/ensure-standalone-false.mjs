#!/usr/bin/env node
/**
 * Angular 18 -> 22 显式补齐 `standalone: false` 幂等 AST 工具（ensure-standalone-false.mjs）
 *
 * 背景：Angular 19 起 @Component / @Directive / @Pipe 的 standalone 默认值由 false 变为 true。
 * 本脚本使用 TypeScript 官方 AST 解析器扫描源码中的 @Component / @Directive / @Pipe 装饰器：
 * - 若对象字面量中已显式声明 standalone（true 或 false），保持原样不动；
 * - 若未声明 standalone，则幂等插入 `standalone: false`；
 * - 支持 `--check`（只检查不修改，未显式声明则退出码为 1）与 `--exclude a.ts,b.ts`（跳过在途 PR 文件）。
 */
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const args = process.argv.slice(2);
let repoDir = process.cwd();
let checkOnly = false;
const excludeSet = new Set();

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--repo' && args[i + 1]) {
    repoDir = path.resolve(args[++i]);
  } else if (args[i] === '--check') {
    checkOnly = true;
  } else if (args[i] === '--exclude' && args[i + 1]) {
    for (const item of args[++i].split(',')) {
      const trimmed = item.trim().replace(/\\/g, '/');
      if (trimmed) excludeSet.add(trimmed);
    }
  }
}

let ts;
try {
  const requireFromRepo = createRequire(path.join(repoDir, 'package.json'));
  ts = requireFromRepo('typescript');
} catch {
  const fallbackRequire = createRequire('/home/dotos/ts/dotos/package.json');
  ts = fallbackRequire('typescript');
}

const IGNORE_DIRS = new Set([
  'node_modules',
  'dist',
  'out-tsc',
  'build',
  '.git',
  '.angular',
  '.nx',
  '.claude',
  '.worktrees',
  '.cache',
  'tmp',
  'coverage',
  'tools',
  'gates',
]);

function walkTsFiles(dir) {
  const out = [];
  if (!fs.existsSync(dir)) return out;
  const stack = [dir];
  while (stack.length > 0) {
    const cur = stack.pop();
    for (const ent of fs.readdirSync(cur, { withFileTypes: true })) {
      if (ent.isDirectory()) {
        if (!IGNORE_DIRS.has(ent.name)) {
          stack.push(path.join(cur, ent.name));
        }
      } else if (
        ent.isFile() &&
        ent.name.endsWith('.ts') &&
        !ent.name.endsWith('.d.ts') &&
        !ent.name.endsWith('.spec.ts') &&
        !ent.name.endsWith('.test.ts')
      ) {
        out.push(path.join(cur, ent.name));
      }
    }
  }
  return out.sort();
}

const TARGET_DECORATORS = new Set(['Component', 'Directive', 'Pipe']);

function getAngularDecoratorImports(sourceFile) {
  const localToKind = new Map();
  let hasNamespaceImport = null;
  for (const stmt of sourceFile.statements) {
    if (!ts.isImportDeclaration(stmt) || !ts.isStringLiteral(stmt.moduleSpecifier)) continue;
    if (stmt.moduleSpecifier.text !== '@angular/core') continue;
    const clause = stmt.importClause;
    if (!clause || clause.isTypeOnly) continue;
    if (clause.namedBindings) {
      if (ts.isNamedImports(clause.namedBindings)) {
        for (const el of clause.namedBindings.elements) {
          if (el.isTypeOnly) continue;
          const importedName = el.propertyName ? el.propertyName.text : el.name.text;
          if (TARGET_DECORATORS.has(importedName)) {
            localToKind.set(el.name.text, importedName);
          }
        }
      } else if (ts.isNamespaceImport(clause.namedBindings)) {
        hasNamespaceImport = clause.namedBindings.name.text;
      }
    }
  }
  return { localToKind, hasNamespaceImport };
}

function getDecoratorObjectLiteral(dec, localToKind, hasNamespaceImport) {
  const expr = dec.expression;
  if (!ts.isCallExpression(expr)) return null;
  let isTarget = false;
  if (ts.isIdentifier(expr.expression) && localToKind.has(expr.expression.text)) {
    isTarget = true;
  } else if (
    hasNamespaceImport &&
    ts.isPropertyAccessExpression(expr.expression) &&
    ts.isIdentifier(expr.expression.expression) &&
    expr.expression.expression.text === hasNamespaceImport &&
    TARGET_DECORATORS.has(expr.expression.name.text)
  ) {
    isTarget = true;
  }
  if (!isTarget) return null;
  const firstArg = expr.arguments[0];
  if (!firstArg) return { emptyCall: expr };
  if (!ts.isObjectLiteralExpression(firstArg)) return null;
  // Skip if spread assignment exists (cannot statically know standalone)
  for (const prop of firstArg.properties) {
    if (ts.isSpreadAssignment(prop)) return null;
    if (
      (ts.isPropertyAssignment(prop) || ts.isShorthandPropertyAssignment(prop)) &&
      prop.name &&
      ((ts.isIdentifier(prop.name) && prop.name.text === 'standalone') ||
        (ts.isStringLiteral(prop.name) && prop.name.text === 'standalone'))
    ) {
      return null; // Already explicitly specified
    }
  }
  return { obj: firstArg };
}

let modifiedFiles = 0;
let modifiedDecorators = 0;
const missingList = [];

for (const file of walkTsFiles(repoDir)) {
  const rel = path.relative(repoDir, file).replace(/\\/g, '/');
  if (excludeSet.has(rel)) continue;
  const content = fs.readFileSync(file, 'utf8');
  if (!content.includes('@angular/core')) continue;

  const sf = ts.createSourceFile(file, content, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
  const { localToKind, hasNamespaceImport } = getAngularDecoratorImports(sf);
  if (localToKind.size === 0 && !hasNamespaceImport) continue;

  const edits = [];
  const visit = (node) => {
    if (ts.canHaveDecorators(node)) {
      const decs = ts.getDecorators(node);
      if (decs) {
        for (const dec of decs) {
          const hit = getDecoratorObjectLiteral(dec, localToKind, hasNamespaceImport);
          if (!hit) continue;
          if (hit.emptyCall) {
            const closeParenPos = hit.emptyCall.getEnd() - 1;
            edits.push({ start: closeParenPos, end: closeParenPos, text: '{ standalone: false }' });
          } else if (hit.obj) {
            const obj = hit.obj;
            if (obj.properties.length === 0) {
              const insertPos = obj.getEnd() - 1;
              edits.push({ start: insertPos, end: insertPos, text: ' standalone: false ' });
            } else {
              const objText = content.slice(obj.getStart(sf), obj.getEnd());
              const isMultiline = objText.includes('\n');
              const lastProp = obj.properties[obj.properties.length - 1];
              const insertPos = lastProp.getEnd();
              if (!isMultiline) {
                edits.push({ start: insertPos, end: insertPos, text: `, standalone: false` });
              } else {
                // Match indentation of first property; note lastProp.getEnd() is BEFORE any trailing comma
                const firstProp = obj.properties[0];
                const lineStart = content.lastIndexOf('\n', firstProp.getStart(sf)) + 1;
                const indentMatch = content.slice(lineStart, firstProp.getStart(sf)).match(/^[ \t]*/);
                const indent = indentMatch ? indentMatch[0] : '  ';
                const eol = content.includes('\r\n') ? '\r\n' : '\n';
                edits.push({
                  start: insertPos,
                  end: insertPos,
                  text: `,${eol}${indent}standalone: false`,
                });
              }
            }
          }
        }
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(sf);

  if (edits.length > 0) {
    modifiedFiles++;
    modifiedDecorators += edits.length;
    if (checkOnly) {
      missingList.push(`${rel} (${edits.length})`);
    } else {
      edits.sort((a, b) => b.start - a.start);
      let next = content;
      for (const e of edits) {
        next = next.slice(0, e.start) + e.text + next.slice(e.end);
      }
      fs.writeFileSync(file, next, 'utf8');
    }
  }
}

if (checkOnly) {
  if (missingList.length > 0) {
    console.error(`[standalone-check] FAIL (${modifiedDecorators} 个装饰器未显式声明 standalone，涉及 ${modifiedFiles} 个文件):`);
    for (const item of missingList.slice(0, 30)) {
      console.error(`  - ${item}`);
    }
    process.exit(1);
  }
  console.log(`[standalone-check] PASS (${path.basename(repoDir)})`);
} else {
  console.log(
    `[ensure-standalone-false] ${path.basename(repoDir)}: 已幂等补齐 ${modifiedDecorators} 个装饰器（涉及 ${modifiedFiles} 个文件）`
  );
}
