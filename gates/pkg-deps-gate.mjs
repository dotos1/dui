#!/usr/bin/env node
/**
 * G-PKG-DEPS —— `@dotos1/dui` 发布产物依赖闭环与 `ngx-flexible-layout` 禁回流门禁
 *
 * 校验项：
 *   1. 零幽灵依赖：`dist/dui` 下所有 `.mjs` / `.js` / `.d.ts` 通过 TypeScript AST 提取的外部模块导入，
 *      必须 100% 声明在 `dist/dui/package.json` 的 `dependencies` 或 `peerDependencies` 中；
 *   2. 零死依赖：`dist/dui/package.json` 的 `dependencies` 与 `peerDependencies` 中的每个包必须在产物 AST 导入中至少命中 1 次，
 *      且 `peerDependenciesMeta` 的键必须是 `peerDependencies` 的子集；
 *   3. 禁 `ngx-flexible-layout` 回流：
 *      - `src/` 下 `.ts` 源码 0 处导入 `ngx-flexible-layout`；
 *      - `src/` 下 `.html` 模板与 `.ts` 内联模板 0 处使用 `fxLayout` / `fxFlex` / `fxLayoutAlign` / `fxFlexFill` / `fxHide` / `fxShow` / `gdAreas` 等指令属性；
 *      - 根 `package.json`、`src/package.json`、`dist/dui/package.json`、`yarn.lock` 中 0 处残留 `ngx-flexible-layout`。
 *
 * 用法：
 *   node gates/pkg-deps-gate.mjs --selftest
 *   node gates/pkg-deps-gate.mjs [--root <dir>]
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SELF_SCOPES = new Set(['@dotos1/dui', '@dotos/dui']);

const BANNED_FX_ATTRS = new Set([
  'fxlayout',
  'fxflex',
  'fxlayoutalign',
  'fxlayoutgap',
  'fxflexorder',
  'fxflexoffset',
  'fxflexalign',
  'fxflexfill',
  'fxfill',
  'fxhide',
  'fxshow',
  'gdareas',
  'gdcolumns',
  'gdrows',
  'gdgap',
  'gdauto',
  'gdaligncolumns',
  'gdalignrows',
  'gdarea',
  'gdcolumn',
  'gdrow',
]);

/**
 * 将模块说明符归一化为 npm 包名；相对/绝对路径或自身包返回 null。
 */
export function normalizeExternalPackageName(specifier) {
  if (!specifier || typeof specifier !== 'string') return null;
  const trimmed = specifier.trim();
  if (!trimmed || trimmed.startsWith('.') || trimmed.startsWith('/')) {
    return null;
  }
  let pkgName;
  if (trimmed.startsWith('@')) {
    const parts = trimmed.split('/');
    if (parts.length < 2) return null;
    pkgName = `${parts[0]}/${parts[1]}`;
  } else {
    pkgName = trimmed.split('/')[0];
  }
  if (SELF_SCOPES.has(pkgName)) {
    return null;
  }
  return pkgName;
}

/**
 * 使用 TypeScript AST 精确提取源码中的模块导入说明符（忽略注释与普通字符串字面量）。
 */
export function extractModuleSpecifiersFromAst(code, fileName = 'file.mjs') {
  const sf = ts.createSourceFile(fileName, code, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
  const specifiers = [];

  function visit(node) {
    if ((ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) && node.moduleSpecifier) {
      if (ts.isStringLiteralLike(node.moduleSpecifier)) {
        specifiers.push(node.moduleSpecifier.text);
      }
    } else if (ts.isCallExpression(node)) {
      const isDynamicImport = node.expression.kind === ts.SyntaxKind.ImportKeyword;
      const isRequireCall = ts.isIdentifier(node.expression) && node.expression.text === 'require';
      if ((isDynamicImport || isRequireCall) && node.arguments.length > 0 && ts.isStringLiteralLike(node.arguments[0])) {
        specifiers.push(node.arguments[0].text);
      }
    } else if (ts.isImportTypeNode(node)) {
      if (ts.isLiteralTypeNode(node.argument) && ts.isStringLiteralLike(node.argument.literal)) {
        specifiers.push(node.argument.literal.text);
      }
    }
    ts.forEachChild(node, visit);
  }

  visit(sf);
  return specifiers;
}

/**
 * 剥除 HTML 注释后扫描所有元素起始标签上的属性名，检测是否存在禁用 flex-layout 指令属性。
 * 注意：仅检查属性名（如 `fxLayout`、`[fxFlex]`、`fxLayout.gt-xs`），不误伤属性值表达式（如 `[direction]="fxLayout"`）。
 */
export function scanHtmlBannedDirectives(html) {
  const withoutComments = html.replace(/<!--[\s\S]*?-->/g, '');
  const hits = [];
  const tagRegex = /<[a-zA-Z][\w:-]*\b((?:[^>"']|"[^"]*"|'[^']*')*)>/g;
  let tagMatch;
  while ((tagMatch = tagRegex.exec(withoutComments)) !== null) {
    const attrsChunk = tagMatch[1];
    const attrRegex = /([^\s=/>"'`]+)(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>"']+))?/g;
    let attrMatch;
    while ((attrMatch = attrRegex.exec(attrsChunk)) !== null) {
      const rawAttr = attrMatch[1];
      // 剥除 Angular 绑定括号 [attr] / (attr) / [(attr)] / *attr，但忽略 [style.xxx] / [class.xxx] / [attr.xxx]
      const unwrapped = rawAttr.replace(/^\[\(|\)\]$/g, '').replace(/^[\[(]|[\])]$/g, '').replace(/^\*/, '');
      const lower = unwrapped.toLowerCase();
      if (lower.startsWith('style.') || lower.startsWith('class.') || lower.startsWith('attr.')) {
        continue;
      }
      const baseDirective = lower.split('.')[0];
      if (BANNED_FX_ATTRS.has(baseDirective)) {
        hits.push(rawAttr);
      }
    }
  }
  return hits;
}

/**
 * 校验给定产物导入集合与 package.json 声明之间的双向闭环。
 */
export function validateManifestDeps(pkgJson, importedPkgSet) {
  const errors = [];
  const deps = Object.keys(pkgJson.dependencies || {});
  const peers = Object.keys(pkgJson.peerDependencies || {});
  const peerMeta = Object.keys(pkgJson.peerDependenciesMeta || {});

  const depSet = new Set(deps);
  const peerSet = new Set(peers);
  const declaredSet = new Set([...deps, ...peers]);

  for (const d of deps) {
    if (peerSet.has(d)) {
      errors.push(`[重复声明] 包 "${d}" 同时出现在 dependencies 与 peerDependencies 中`);
    }
  }

  for (const usedPkg of [...importedPkgSet].sort()) {
    if (!declaredSet.has(usedPkg)) {
      errors.push(`[幽灵依赖] 产物导入了 "${usedPkg}"，但未在 dist/dui/package.json 的 dependencies 或 peerDependencies 中声明`);
    }
  }

  for (const declaredPkg of [...declaredSet].sort()) {
    if (!importedPkgSet.has(declaredPkg)) {
      errors.push(`[死依赖] dist/dui/package.json 声明了 "${declaredPkg}"，但产物 AST 中 0 处导入`);
    }
  }

  for (const metaKey of peerMeta.sort()) {
    if (!peerSet.has(metaKey)) {
      errors.push(`[孤儿元数据] peerDependenciesMeta 中的 "${metaKey}" 未在 peerDependencies 中声明`);
    }
  }

  return errors;
}

function runSelftest() {
  const cases = [
    {
      name: 'AST 提取静态/动态/类型导入并忽略注释与字符串字面量',
      fn: () => {
        const sample = `
          // import 'commented-pkg';
          const fake = "import { a } from 'string-literal-pkg'";
          import { Component } from '@angular/core';
          export { merge } from 'lodash-es/merge';
          const lazy = () => import('monaco-editor/esm/vs/editor/editor.api');
          export type View = import('prosemirror-view').EditorView;
          import { Dui } from '@dotos1/dui/core';
          import { helper } from './local-helper';
        `;
        const pkgs = new Set(
          extractModuleSpecifiersFromAst(sample, 'sample.d.ts')
            .map(normalizeExternalPackageName)
            .filter(Boolean)
        );
        const expected = ['@angular/core', 'lodash-es', 'monaco-editor', 'prosemirror-view'];
        return JSON.stringify([...pkgs].sort()) === JSON.stringify(expected);
      },
    },
    {
      name: '幽灵依赖、死依赖与孤儿 peerDependenciesMeta 精准检出',
      fn: () => {
        const manifest = {
          dependencies: { tslib: '^2.3.1', 'dead-pkg': '^1.0.0' },
          peerDependencies: { '@angular/core': '^22.0.0' },
          peerDependenciesMeta: { 'orphan-peer': { optional: true } },
        };
        const imported = new Set(['tslib', '@angular/core', 'ghost-pkg']);
        const errs = validateManifestDeps(manifest, imported);
        return (
          errs.length === 3 &&
          errs.some((e) => e.includes('ghost-pkg')) &&
          errs.some((e) => e.includes('dead-pkg')) &&
          errs.some((e) => e.includes('orphan-peer'))
        );
      },
    },
    {
      name: 'HTML 模板指令扫描区分真实 fx 指令与合法同名属性表达式',
      fn: () => {
        const badHtml = `
          <div fxLayout="row" fxLayoutAlign="start center">
            <span [fxFlex]="flexOf(item)" fxLayout.gt-xs="column" [fxHide]="hidden"></span>
            <section gdAreas="header | content"></section>
          </div>
        `;
        const goodHtml = `
          <!-- <div fxLayout="row" fxFlex></div> -->
          <div [style.flex-direction]="fxLayout === 'column' ? 'column' : 'row'">
            <split-gutter [direction]="fxLayout" data-note="fxFlex"></split-gutter>
          </div>
        `;
        const badHits = scanHtmlBannedDirectives(badHtml);
        const goodHits = scanHtmlBannedDirectives(goodHtml);
        return badHits.length === 6 && goodHits.length === 0;
      },
    },
  ];

  let failed = 0;
  for (const c of cases) {
    const ok = c.fn();
    console.log(`${ok ? '✓' : '✗'} [G-PKG-DEPS selftest] ${c.name}`);
    if (!ok) failed++;
  }
  if (failed > 0) {
    process.exit(1);
  }
}

function walkFiles(dir, predicate, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name === '.git' || entry.name === '.angular') continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkFiles(fullPath, predicate, out);
    } else if (entry.isFile() && predicate(entry.name, fullPath)) {
      out.push(fullPath);
    }
  }
  return out;
}

function extractInlineTemplatesFromTs(code, fileName) {
  const sf = ts.createSourceFile(fileName, code, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
  const templates = [];
  function visit(node) {
    if (
      ts.isPropertyAssignment(node) &&
      ((ts.isIdentifier(node.name) && node.name.text === 'template') ||
        (ts.isStringLiteralLike(node.name) && node.name.text === 'template')) &&
      ts.isStringLiteralLike(node.initializer)
    ) {
      templates.push(node.initializer.text);
    }
    ts.forEachChild(node, visit);
  }
  visit(sf);
  return templates;
}

function runGate(repoRoot) {
  const distDir = path.join(repoRoot, 'dist/dui');
  const distPkgPath = path.join(distDir, 'package.json');
  const srcDir = path.join(repoRoot, 'src');
  const srcPkgPath = path.join(srcDir, 'package.json');
  const rootPkgPath = path.join(repoRoot, 'package.json');
  const yarnLockPath = path.join(repoRoot, 'yarn.lock');

  if (!fs.existsSync(distPkgPath)) {
    console.error(`✗ [G-PKG-DEPS] 未找到 ${distPkgPath}，请先执行 npm run build-dui`);
    process.exit(1);
  }

  const problems = [];

  // 1 & 2. 扫描 dist/dui 产物 AST 导入并校验 package.json 双向闭环
  const distFiles = walkFiles(distDir, (name) => /\.(mjs|js|d\.ts)$/.test(name));
  const importedPkgs = new Map(); // pkg -> first file
  for (const f of distFiles) {
    const code = fs.readFileSync(f, 'utf8');
    const specs = extractModuleSpecifiersFromAst(code, f);
    for (const s of specs) {
      const pkg = normalizeExternalPackageName(s);
      if (pkg && !importedPkgs.has(pkg)) {
        importedPkgs.set(pkg, path.relative(repoRoot, f));
      }
    }
  }

  const distPkg = JSON.parse(fs.readFileSync(distPkgPath, 'utf8'));
  for (const err of validateManifestDeps(distPkg, new Set(importedPkgs.keys()))) {
    problems.push(err);
  }

  // 3. 禁止 ngx-flexible-layout 回流检查
  const srcTsFiles = walkFiles(srcDir, (name) => name.endsWith('.ts'));
  for (const f of srcTsFiles) {
    const code = fs.readFileSync(f, 'utf8');
    const rel = path.relative(repoRoot, f);
    for (const s of extractModuleSpecifiersFromAst(code, f)) {
      if (normalizeExternalPackageName(s) === 'ngx-flexible-layout') {
        problems.push(`[禁回流] ${rel} 导入了已清退的 ngx-flexible-layout (${s})`);
      }
    }
    for (const tpl of extractInlineTemplatesFromTs(code, f)) {
      const hits = scanHtmlBannedDirectives(tpl);
      if (hits.length > 0) {
        problems.push(`[禁回流] ${rel} 内联模板使用了已废弃布局指令: ${hits.join(', ')}`);
      }
    }
  }

  const srcHtmlFiles = walkFiles(srcDir, (name) => name.endsWith('.html'));
  for (const f of srcHtmlFiles) {
    const html = fs.readFileSync(f, 'utf8');
    const hits = scanHtmlBannedDirectives(html);
    if (hits.length > 0) {
      problems.push(`[禁回流] ${path.relative(repoRoot, f)} 使用了已废弃布局指令: ${hits.join(', ')}`);
    }
  }

  for (const manifestPath of [rootPkgPath, srcPkgPath, distPkgPath]) {
    if (fs.existsSync(manifestPath)) {
      const raw = fs.readFileSync(manifestPath, 'utf8');
      if (raw.includes('ngx-flexible-layout')) {
        problems.push(`[禁回流] ${path.relative(repoRoot, manifestPath)} 仍残留 ngx-flexible-layout 依赖声明`);
      }
    }
  }

  if (fs.existsSync(yarnLockPath)) {
    const lockRaw = fs.readFileSync(yarnLockPath, 'utf8');
    if (lockRaw.includes('ngx-flexible-layout')) {
      problems.push(`[禁回流] yarn.lock 仍残留 ngx-flexible-layout 条目`);
    }
  }

  if (problems.length > 0) {
    console.error(`✗ [G-PKG-DEPS] 失败（共 ${problems.length} 项违规）：`);
    for (const p of problems) {
      console.error(`  - ${p}`);
    }
    process.exit(1);
  }

  const depCount = Object.keys(distPkg.dependencies || {}).length;
  const peerCount = Object.keys(distPkg.peerDependencies || {}).length;
  const optPeerCount = Object.keys(distPkg.peerDependenciesMeta || {}).length;
  console.log(
    `✓ [G-PKG-DEPS] 通过：扫描产物 ${distFiles.length} 个文件、外部包 ${importedPkgs.size} 个（dependencies=${depCount}, peerDependencies=${peerCount}, optional=${optPeerCount}），源码 ${srcTsFiles.length} 个 .ts + ${srcHtmlFiles.length} 个 .html 零 ngx-flexible-layout 残留`
  );
}

const argv = process.argv.slice(2);
if (argv.includes('--selftest')) {
  runSelftest();
} else {
  let repoRoot = path.resolve(__dirname, '..');
  const rootIdx = argv.indexOf('--root');
  if (rootIdx !== -1 && argv[rootIdx + 1]) {
    repoRoot = path.resolve(argv[rootIdx + 1]);
  }
  runGate(repoRoot);
}
