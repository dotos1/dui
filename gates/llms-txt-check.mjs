#!/usr/bin/env node
/**
 * G-LLMS (`gates/llms-txt-check.mjs`) —— `src/llms.txt` 与真实源码 / `ng-package.json` / TypeScript AST 契约一致性门禁
 *
 * 检查项：
 *   1. 二级入口真实性：双向校验 `src/llms.txt` 中所有 `@dotos/dui/<entry>` 章节及 TS 代码块导入路径，
 *      必须 1:1 对应 `src/<entry>/ng-package.json`（杜绝幽灵子入口如 `@dotos/dui/i18n`、`@dotos/dui/theming`）。
 *   2. 示例代码可编译性：将第 2 节全部 TypeScript 代码块放入真实 `ts.Program` 进行类型检查，确保 0 编译错误。
 *   3. 导出符号、选择器与公开绑定名一致性：
 *      - 每个列出的 Component / Directive / NgModule / Service / Pipe / Export 均由对应子入口真实导出；
 *      - Component / Directive 选择器与装饰器 `selector`（含常量引用与模板字面量）严格一致；
 *      - 所有 `[input]` / `(output)` 必须匹配真实公开绑定名（正确解析 `@Input('alias')`、`@Output('alias')`、
 *        装饰器 `inputs`/`outputs` 元数据及父类继承链），严禁把私有属性名误写为模板绑定名；
 *      - 严禁签名截断（括号/花括号/方括号/引号配平，禁止尾部悬挂 `=>`、`|`、`:` 等截断残留）。
 *
 * 用法：
 *   node gates/llms-txt-check.mjs [--selftest] [--dump-fixes]
 */

import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, '..');
const SRC_DIR = path.join(REPO_ROOT, 'src');
const LLMS_PATH = path.join(SRC_DIR, 'llms.txt');

const require = createRequire(import.meta.url);
const ts = require(path.join(REPO_ROOT, 'node_modules', 'typescript'));

/**
 * 递归查找所有二级入口 `ng-package.json`（排除根 `src/ng-package.json`）。
 */
function discoverSecondaryEntries(dir, result = new Map()) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    if (ent.name === 'node_modules' || ent.name.startsWith('.')) continue;
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      discoverSecondaryEntries(full, result);
    } else if (ent.name === 'ng-package.json') {
      const pkgDir = path.dirname(full);
      if (path.resolve(pkgDir) === path.resolve(SRC_DIR)) continue;
      const rel = path.relative(SRC_DIR, pkgDir).split(path.sep).join('/');
      const raw = JSON.parse(fs.readFileSync(full, 'utf8'));
      const entryFile = path.join(pkgDir, raw?.lib?.entryFile ?? 'index.ts');
      result.set(`@dotos/dui/${rel}`, { rel, pkgDir, entryFile });
    }
  }
  return result;
}

/**
 * 规范化选择器空白以便与 `llms.txt` 比对（去除换行并规范化逗号后单空格或原样比对）。
 */
function normalizeSelector(sel) {
  return sel
    .replace(/\s+/g, ' ')
    .replace(/\s*,\s*/g, ', ')
    .trim();
}

/**
 * 从表达式节点求取静态字符串常量值（支持字符串字面量、无插值模板字面量、同模块/跨模块 const 字符串标识符）。
 */
function resolveStaticString(expr, checker) {
  if (!expr) return null;
  if (ts.isStringLiteral(expr) || ts.isNoSubstitutionTemplateLiteral(expr)) {
    return expr.text;
  }
  if (ts.isIdentifier(expr) && checker) {
    let sym = checker.getSymbolAtLocation(expr);
    if (sym && sym.flags & ts.SymbolFlags.Alias) {
      sym = checker.getAliasedSymbol(sym);
    }
    if (sym) {
      const decl = sym.valueDeclaration || (sym.declarations && sym.declarations[0]);
      if (decl && ts.isVariableDeclaration(decl) && decl.initializer) {
        return resolveStaticString(decl.initializer, checker);
      }
    }
    const t = checker.getTypeAtLocation(expr);
    if (t && t.isStringLiteral()) {
      return t.value;
    }
  }
  return null;
}

/**
 * 提取类声明（含基类继承链）的装饰器 selector、公开 inputs 映射、公开 outputs 映射及真实属性类型文本。
 */
function extractClassBindings(classDecl, checker, visited = new Set()) {
  if (!classDecl || visited.has(classDecl)) {
    return {
      selector: null,
      decoratorKind: null,
      publicInputs: new Map(), // publicName -> { propName, typeText }
      propToInputAlias: new Map(), // propName -> publicName
      publicOutputs: new Map(), // publicName -> { propName, typeText }
      propToOutputAlias: new Map(), // propName -> publicName
    };
  }
  visited.add(classDecl);

  const info = {
    selector: null,
    decoratorKind: null,
    publicInputs: new Map(),
    propToInputAlias: new Map(),
    publicOutputs: new Map(),
    propToOutputAlias: new Map(),
  };

  // 1. 先合并基类（子类同名绑定覆盖基类）
  if (classDecl.heritageClauses) {
    for (const clause of classDecl.heritageClauses) {
      if (clause.token !== ts.SyntaxKind.ExtendsKeyword) continue;
      for (const typeNode of clause.types) {
        const baseType = checker.getTypeAtLocation(typeNode.expression);
        const baseSym = baseType && baseType.getSymbol();
        if (!baseSym) continue;
        for (const bDecl of baseSym.getDeclarations() || []) {
          if (ts.isClassDeclaration(bDecl)) {
            const baseInfo = extractClassBindings(bDecl, checker, visited);
            for (const [k, v] of baseInfo.publicInputs) info.publicInputs.set(k, v);
            for (const [k, v] of baseInfo.propToInputAlias) info.propToInputAlias.set(k, v);
            for (const [k, v] of baseInfo.publicOutputs) info.publicOutputs.set(k, v);
            for (const [k, v] of baseInfo.propToOutputAlias) info.propToOutputAlias.set(k, v);
          }
        }
      }
    }
  }

  // 辅助获取成员属性在源码中的简明类型文本
  const getMemberTypeText = (memberName) => {
    for (const m of classDecl.members) {
      const mName = m.name && (ts.isIdentifier(m.name) || ts.isStringLiteral(m.name)) ? m.name.text : null;
      if (mName !== memberName) continue;
      if ((ts.isPropertyDeclaration(m) || ts.isGetAccessorDeclaration(m)) && m.type) {
        return m.type.getText().replace(/\s+/g, ' ').trim();
      }
      if (ts.isSetAccessorDeclaration(m) && m.parameters.length > 0 && m.parameters[0].type) {
        return m.parameters[0].type.getText().replace(/\s+/g, ' ').trim();
      }
      const t = checker.getTypeAtLocation(m);
      return checker.typeToString(t, m, ts.TypeFormatFlags.NoTruncation);
    }
    return 'any';
  };

  // 2. 解析类级 `@Component({...})` / `@Directive({...})`
  const decorators = ts.canHaveDecorators(classDecl) ? ts.getDecorators(classDecl) || [] : [];
  for (const dec of decorators) {
    if (!ts.isCallExpression(dec.expression)) continue;
    const decName = ts.isIdentifier(dec.expression.expression)
      ? dec.expression.expression.text
      : '';
    if (decName !== 'Component' && decName !== 'Directive') continue;
    info.decoratorKind = decName;
    const arg0 = dec.expression.arguments[0];
    if (!arg0 || !ts.isObjectLiteralExpression(arg0)) continue;

    for (const prop of arg0.properties) {
      if (!ts.isPropertyAssignment(prop)) continue;
      const pName = ts.isIdentifier(prop.name) || ts.isStringLiteral(prop.name) ? prop.name.text : '';
      if (pName === 'selector') {
        const sel = resolveStaticString(prop.initializer, checker);
        if (sel !== null) {
          info.selector = sel;
        }
      } else if (pName === 'inputs' && ts.isArrayLiteralExpression(prop.initializer)) {
        for (const el of prop.initializer.elements) {
          const str = resolveStaticString(el, checker);
          if (str) {
            const parts = str.split(':').map((s) => s.trim());
            const propName = parts[0];
            const publicName = parts[1] || parts[0];
            info.publicInputs.set(publicName, { propName, typeText: getMemberTypeText(propName) });
            info.propToInputAlias.set(propName, publicName);
          } else if (ts.isObjectLiteralExpression(el)) {
            let propName = '';
            let alias = '';
            for (const sub of el.properties) {
              if (!ts.isPropertyAssignment(sub)) continue;
              const sk = ts.isIdentifier(sub.name) ? sub.name.text : '';
              const sv = resolveStaticString(sub.initializer, checker);
              if (sk === 'name' && sv) propName = sv;
              if (sk === 'alias' && sv) alias = sv;
            }
            if (propName) {
              const publicName = alias || propName;
              info.publicInputs.set(publicName, { propName, typeText: getMemberTypeText(propName) });
              info.propToInputAlias.set(propName, publicName);
            }
          }
        }
      } else if (pName === 'outputs' && ts.isArrayLiteralExpression(prop.initializer)) {
        for (const el of prop.initializer.elements) {
          const str = resolveStaticString(el, checker);
          if (str) {
            const parts = str.split(':').map((s) => s.trim());
            const propName = parts[0];
            const publicName = parts[1] || parts[0];
            info.publicOutputs.set(publicName, { propName, typeText: 'any' });
            info.propToOutputAlias.set(propName, publicName);
          }
        }
      }
    }
  }

  // 3. 解析成员级 `@Input(...)` 与 `@Output(...)`
  for (const member of classDecl.members) {
    const mDecs = ts.canHaveDecorators(member) ? ts.getDecorators(member) || [] : [];
    if (mDecs.length === 0) continue;
    const memberName =
      member.name && (ts.isIdentifier(member.name) || ts.isStringLiteral(member.name))
        ? member.name.text
        : null;
    if (!memberName) continue;

    for (const dec of mDecs) {
      if (!ts.isCallExpression(dec.expression)) continue;
      const dName = ts.isIdentifier(dec.expression.expression)
        ? dec.expression.expression.text
        : '';
      if (dName !== 'Input' && dName !== 'Output') continue;

      let alias = null;
      const firstArg = dec.expression.arguments[0];
      if (firstArg) {
        const directStr = resolveStaticString(firstArg, checker);
        if (directStr) {
          alias = directStr;
        } else if (ts.isObjectLiteralExpression(firstArg)) {
          for (const p of firstArg.properties) {
            if (ts.isPropertyAssignment(p) && ts.isIdentifier(p.name) && p.name.text === 'alias') {
              alias = resolveStaticString(p.initializer, checker);
            }
          }
        }
      }

      const publicName = alias || memberName;
      if (dName === 'Input') {
        // 如果子类曾从基类继承旧名字而子类重命名了 alias，补充最新映射
        const prevAlias = info.propToInputAlias.get(memberName);
        if (prevAlias && prevAlias !== publicName) {
          info.publicInputs.delete(prevAlias);
        }
        info.publicInputs.set(publicName, {
          propName: memberName,
          typeText: getMemberTypeText(memberName),
        });
        info.propToInputAlias.set(memberName, publicName);
      } else {
        const prevAlias = info.propToOutputAlias.get(memberName);
        if (prevAlias && prevAlias !== publicName) {
          info.publicOutputs.delete(prevAlias);
        }
        let outType = 'any';
        if (ts.isPropertyDeclaration(member) && member.type && ts.isTypeReferenceNode(member.type)) {
          if (member.type.typeArguments && member.type.typeArguments.length === 1) {
            outType = member.type.typeArguments[0].getText().replace(/\s+/g, ' ').trim();
          }
        }
        info.publicOutputs.set(publicName, { propName: memberName, typeText: outType });
        info.propToOutputAlias.set(memberName, publicName);
      }
    }
  }

  // 4. 解析 Angular Signal `input()` / `input.required()` / `model()` / `output()` / `outputFromObservable()`
  for (const member of classDecl.members) {
    if (!ts.isPropertyDeclaration(member) || !member.initializer || !ts.isCallExpression(member.initializer)) {
      continue;
    }
    const memberName =
      member.name && (ts.isIdentifier(member.name) || ts.isStringLiteral(member.name))
        ? member.name.text
        : null;
    if (!memberName) continue;

    const call = member.initializer;
    let signalKind = null; // 'input' | 'model' | 'output'
    let isRequired = false;
    if (ts.isIdentifier(call.expression)) {
      const fnName = call.expression.text;
      if (fnName === 'input') signalKind = 'input';
      else if (fnName === 'model') signalKind = 'model';
      else if (fnName === 'output' || fnName === 'outputFromObservable') signalKind = 'output';
    } else if (
      ts.isPropertyAccessExpression(call.expression) &&
      ts.isIdentifier(call.expression.expression) &&
      call.expression.name.text === 'required'
    ) {
      const baseFn = call.expression.expression.text;
      if (baseFn === 'input') {
        signalKind = 'input';
        isRequired = true;
      } else if (baseFn === 'model') {
        signalKind = 'model';
        isRequired = true;
      }
    }
    if (!signalKind) continue;

    let alias = null;
    for (const arg of call.arguments) {
      if (ts.isObjectLiteralExpression(arg)) {
        for (const p of arg.properties) {
          if (ts.isPropertyAssignment(p) && ts.isIdentifier(p.name) && p.name.text === 'alias') {
            alias = resolveStaticString(p.initializer, checker);
          }
        }
      }
    }
    const publicName = alias || memberName;
    if (signalKind === 'input' || signalKind === 'model') {
      info.publicInputs.set(publicName, {
        propName: memberName,
        typeText: getMemberTypeText(memberName),
        isRequired,
      });
      info.propToInputAlias.set(memberName, publicName);
      if (signalKind === 'model') {
        info.publicOutputs.set(`${publicName}Change`, { propName: memberName, typeText: 'any' });
      }
    } else {
      info.publicOutputs.set(publicName, { propName: memberName, typeText: 'any' });
      info.propToOutputAlias.set(memberName, publicName);
    }
  }

  return info;
}

/**
 * 顶层字符切分（忽略括号 `()`、花括号 `{}`、方括号 `[]`、泛型 `<>` 及引号内部的分隔符）。
 */
export function splitTopLevel(text, delimiterChar) {
  const parts = [];
  let depthParen = 0;
  let depthBrace = 0;
  let depthBracket = 0;
  let depthAngle = 0;
  let quote = null;
  let start = 0;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (quote) {
      if (ch === '\\') {
        i++;
      } else if (ch === quote) {
        quote = null;
      }
      continue;
    }
    if (ch === "'" || ch === '"' || ch === '`') {
      quote = ch;
      continue;
    }
    // 跳过箭头 `=>` 中的 `>`
    if (ch === '=' && text[i + 1] === '>') {
      i++;
      continue;
    }
    if (ch === '(') depthParen++;
    else if (ch === ')') depthParen = Math.max(0, depthParen - 1);
    else if (ch === '{') depthBrace++;
    else if (ch === '}') depthBrace = Math.max(0, depthBrace - 1);
    else if (ch === '[') depthBracket++;
    else if (ch === ']') depthBracket = Math.max(0, depthBracket - 1);
    else if (ch === '<') depthAngle++;
    else if (ch === '>' && depthAngle > 0) depthAngle--;
    else if (
      ch === delimiterChar &&
      depthParen === 0 &&
      depthBrace === 0 &&
      depthBracket === 0 &&
      depthAngle === 0
    ) {
      parts.push(text.slice(start, i).trim());
      start = i + 1;
    }
  }
  const tail = text.slice(start).trim();
  if (tail) parts.push(tail);
  return parts;
}

/**
 * 检查单个类型签名文本是否存在截断或括号/引号失衡。
 */
export function validateTypeSignatureSyntax(typeStr) {
  const t = typeStr.trim();
  if (!t) {
    return '类型签名完全为空';
  }
  if (/(?:=>|\||&|:|,|\{|<|\(|\[)$/.test(t)) {
    return `类型签名疑似尾部截断: "${t}"`;
  }

  let paren = 0;
  let brace = 0;
  let bracket = 0;
  let angle = 0;
  let quote = null;

  for (let i = 0; i < t.length; i++) {
    const ch = t[i];
    if (quote) {
      if (ch === '\\') i++;
      else if (ch === quote) quote = null;
      continue;
    }
    if (ch === "'" || ch === '"' || ch === '`') {
      quote = ch;
      continue;
    }
    if (ch === '=' && t[i + 1] === '>') {
      i++;
      continue;
    }
    if (ch === '(') paren++;
    else if (ch === ')') {
      paren--;
      if (paren < 0) return `多余的右圆括号 ')': "${t}"`;
    } else if (ch === '{') brace++;
    else if (ch === '}') {
      brace--;
      if (brace < 0) return `多余的右花括号 '}': "${t}"`;
    } else if (ch === '[') bracket++;
    else if (ch === ']') {
      bracket--;
      if (bracket < 0) return `多余的右方括号 ']': "${t}"`;
    } else if (ch === '<') angle++;
    else if (ch === '>' && angle > 0) angle--;
  }

  if (quote) return `引号未闭合 (${quote}): "${t}"`;
  if (paren !== 0) return `圆括号未闭合: "${t}"`;
  if (brace !== 0) return `花括号未闭合: "${t}"`;
  if (bracket !== 0) return `方括号未闭合: "${t}"`;
  if (angle !== 0) return `尖括号泛型未闭合: "${t}"`;

  // 用 TypeScript 解析器校验 `type __Check = <typeStr>;` 语法合法性
  const sf = ts.createSourceFile(
    '__type_check__.ts',
    `type __Check = ${t};`,
    ts.ScriptTarget.ES2022,
    true
  );
  if (sf.parseDiagnostics && sf.parseDiagnostics.length > 0) {
    const msg = ts.flattenDiagnosticMessageText(sf.parseDiagnostics[0].messageText, ' ');
    return `TypeScript 类型语法错误 (${msg}): "${t}"`;
  }
  return null;
}

/**
 * 解析 `llms.txt` 文本并针对给定的入口元数据表返回错误列表（同时供 `--selftest` 复用）。
 */
export function verifyLlmsMarkdown(markdown, entryMetaMap, options = {}) {
  const errors = [];
  const fixes = [];
  const lines = markdown.split(/\r?\n/);

  const documentedEntries = new Set();
  let currentEntry = null;
  let inCodeFence = false;
  let fenceLang = '';
  let fenceLines = [];
  let fenceStartLine = 0;
  const tsSnippets = [];

  for (let idx = 0; idx < lines.length; idx++) {
    const lineNo = idx + 1;
    const line = lines[idx];

    if (line.startsWith('```')) {
      if (!inCodeFence) {
        inCodeFence = true;
        fenceLang = line.slice(3).trim().toLowerCase();
        fenceLines = [];
        fenceStartLine = lineNo;
      } else {
        if (fenceLang === 'typescript' || fenceLang === 'ts') {
          tsSnippets.push({ startLine: fenceStartLine, code: fenceLines.join('\n') });
        }
        inCodeFence = false;
        fenceLang = '';
      }
      continue;
    }

    if (inCodeFence) {
      fenceLines.push(line);
      continue;
    }

    // 匹配 `### \`@dotos/dui/<subpath>\``
    const headerMatch = line.match(/^###\s+`(@dotos\/dui\/[^`]+)`/);
    if (headerMatch) {
      const entryName = headerMatch[1];
      currentEntry = entryName;
      if (documentedEntries.has(entryName)) {
        errors.push(`L${lineNo}: 重复的二级入口章节 "${entryName}"`);
      }
      documentedEntries.add(entryName);
      if (!entryMetaMap.has(entryName)) {
        errors.push(`L${lineNo}: 虚构的二级入口 "${entryName}"（src 下不存在对应的 ng-package.json）`);
      }
      continue;
    }

    if (!currentEntry || !entryMetaMap.has(currentEntry)) continue;
    const entryMeta = entryMetaMap.get(currentEntry);

    // 匹配 `- **Component** \`ClassName\` (\`selector\`) — [in]: type; (out): type`
    const compOrDirMatch = line.match(
      /^-\s+\*\*(Component|Directive)\*\*\s+`([^`]+)`(?:\s+\(`([^`]+)`\))?(?:\s+—\s+(.+))?$/
    );
    if (compOrDirMatch) {
      const kindLabel = compOrDirMatch[1];
      const className = compOrDirMatch[2];
      const docSelector = compOrDirMatch[3] ?? null;
      const bindingsTail = compOrDirMatch[4] ?? '';

      if (!entryMeta.exports.has(className)) {
        errors.push(`L${lineNo} [${currentEntry}]: ${kindLabel} "${className}" 未从该入口公开导出`);
        continue;
      }

      const clsInfo = entryMeta.classes.get(className);
      if (!clsInfo) {
        errors.push(`L${lineNo} [${currentEntry}]: "${className}" 不是导出的类声明`);
        continue;
      }

      // 1. 选择器校验
      const realSel = clsInfo.selector ? normalizeSelector(clsInfo.selector) : null;
      const normDocSel = docSelector ? normalizeSelector(docSelector) : null;
      if (realSel && !normDocSel) {
        errors.push(
          `L${lineNo} [${currentEntry}] ${className}: 缺失组件/指令选择器，源码实际为 (\`${clsInfo.selector}\`)`
        );
        fixes.push({ lineNo, entry: currentEntry, className, kind: 'missing-selector', realSelector: clsInfo.selector });
      } else if (!realSel && normDocSel) {
        errors.push(
          `L${lineNo} [${currentEntry}] ${className}: 源码无 selector，但文档写出了 (\`${docSelector}\`)`
        );
      } else if (realSel && normDocSel && realSel !== normDocSel) {
        errors.push(
          `L${lineNo} [${currentEntry}] ${className}: 选择器不一致，文档为 (\`${docSelector}\`)，源码为 (\`${clsInfo.selector}\`)`
        );
      }

      // 2. 输入 / 输出与截断校验
      if (bindingsTail) {
        // 先检查整条绑定尾部是否因截断导致顶层括号失衡而无法安全切分
        const sections = splitTopLevel(bindingsTail, ';');
        for (const sec of sections) {
          const items = splitTopLevel(sec, ',');
          for (const item of items) {
            const inputMatch = item.match(/^\[([^\]]+)\]:\s*([\s\S]*)$/);
            const outputMatch = !inputMatch ? item.match(/^\(([^)]+)\):\s*([\s\S]*)$/) : null;

            if (inputMatch) {
              const inName = inputMatch[1].trim();
              const inType = inputMatch[2].trim();
              const syntaxErr = validateTypeSignatureSyntax(inType);
              if (syntaxErr) {
                const realBinding =
                  clsInfo.publicInputs.get(inName) ||
                  clsInfo.publicInputs.get(clsInfo.propToInputAlias.get(inName));
                errors.push(`L${lineNo} [${currentEntry}] ${className} [${inName}]: ${syntaxErr}`);
                fixes.push({
                  lineNo,
                  entry: currentEntry,
                  className,
                  kind: 'truncated-type',
                  binding: `[${inName}]`,
                  oldType: inType,
                  realType: realBinding?.typeText ?? 'unknown',
                });
              } else {
                // 检查尾部的自定义类型标识符是否在源码真实类型中只是前缀（如 `MatDatetimepickerFilterTy` / `LoadingStrategy.Replac`）
                const realBinding =
                  clsInfo.publicInputs.get(inName) ||
                  clsInfo.publicInputs.get(clsInfo.propToInputAlias.get(inName));
                if (realBinding && realBinding.typeText) {
                  const normReal = realBinding.typeText.replace(/\s+/g, ' ').trim();
                  const normDoc = inType.replace(/\s+/g, ' ').trim();
                  if (
                    normReal.length > normDoc.length &&
                    normReal.startsWith(normDoc) &&
                    /[A-Za-z0-9_]$/.test(normDoc) &&
                    /[A-Za-z0-9_]/.test(normReal[normDoc.length])
                  ) {
                    errors.push(
                      `L${lineNo} [${currentEntry}] ${className} [${inName}]: 类型名被截断为 "${inType}"，源码完整类型为 "${normReal}"`
                    );
                    fixes.push({
                      lineNo,
                      entry: currentEntry,
                      className,
                      kind: 'truncated-ident',
                      binding: `[${inName}]`,
                      oldType: inType,
                      realType: normReal,
                    });
                  }
                }
              }

              if (!clsInfo.publicInputs.has(inName)) {
                const alias = clsInfo.propToInputAlias.get(inName);
                if (alias) {
                  errors.push(
                    `L${lineNo} [${currentEntry}] ${className}: 使用了内部属性名 [${inName}]，应为公开 @Input 别名 [${alias}]`
                  );
                  fixes.push({
                    lineNo,
                    entry: currentEntry,
                    className,
                    kind: 'input-alias',
                    wrong: `[${inName}]`,
                    right: `[${alias}]`,
                  });
                } else {
                  errors.push(
                    `L${lineNo} [${currentEntry}] ${className}: 不存在公开 @Input 绑定 [${inName}]（可用: ${
                      [...clsInfo.publicInputs.keys()].map((k) => `[${k}]`).join(', ') || '无'
                    }）`
                  );
                }
              }
            } else if (outputMatch) {
              const outName = outputMatch[1].trim();
              const outType = outputMatch[2].trim();
              const syntaxErr = validateTypeSignatureSyntax(outType);
              if (syntaxErr) {
                errors.push(`L${lineNo} [${currentEntry}] ${className} (${outName}): ${syntaxErr}`);
              }
              if (!clsInfo.publicOutputs.has(outName)) {
                const alias = clsInfo.propToOutputAlias.get(outName);
                if (alias) {
                  errors.push(
                    `L${lineNo} [${currentEntry}] ${className}: 使用了内部属性名 (${outName})，应为公开 @Output 别名 (${alias})`
                  );
                  fixes.push({
                    lineNo,
                    entry: currentEntry,
                    className,
                    kind: 'output-alias',
                    wrong: `(${outName})`,
                    right: `(${alias})`,
                  });
                } else {
                  errors.push(
                    `L${lineNo} [${currentEntry}] ${className}: 不存在公开 @Output 事件 (${outName})（可用: ${
                      [...clsInfo.publicOutputs.keys()].map((k) => `(${k})`).join(', ') || '无'
                    }）`
                  );
                }
              }
            } else {
              errors.push(
                `L${lineNo} [${currentEntry}] ${className}: 无法解析的绑定片段（可能因类型截断破坏了分隔符）: "${item}"`
              );
              fixes.push({
                lineNo,
                entry: currentEntry,
                className,
                kind: 'broken-tail',
                raw: item,
                allInputs: [...clsInfo.publicInputs.entries()],
              });
            }
          }
        }
      }
      continue;
    }

    // 校验 `- **NgModules**: ...` / `- **Services**: ...` / `- **Pipes**: ...` / `- **Exports**: ...`
    const symbolListMatch = line.match(/^-\s+\*\*(NgModules|Services|Pipes|Exports)\*\*:\s+(.+)$/);
    if (symbolListMatch) {
      const groupName = symbolListMatch[1];
      const rawList = symbolListMatch[2];
      const backtickNames = [...rawList.matchAll(/`([^`]+)`/g)].map((m) => m[1]);
      for (const symName of backtickNames) {
        if (!entryMeta.exports.has(symName)) {
          errors.push(
            `L${lineNo} [${currentEntry}] ${groupName}: 符号 "${symName}" 未从该子入口公开导出`
          );
        }
      }
    }
  }

  // 检查是否漏掉真实的 `ng-package.json` 二级入口
  if (!options.skipMissingEntryCheck) {
    for (const realKey of entryMetaMap.keys()) {
      if (!documentedEntries.has(realKey)) {
        errors.push(`缺失真实二级入口章节: "${realKey}"（存在于 src/**/ng-package.json 但未写入 llms.txt）`);
      }
    }
  }

  // 检查代码块中的 `@dotos/dui/<entry>` 导入路径真实性
  for (const snippet of tsSnippets) {
    for (const m of snippet.code.matchAll(/from\s+['"](@dotos\/dui\/[^'"]+)['"]/g)) {
      const imp = m[1];
      if (!entryMetaMap.has(imp)) {
        errors.push(`L${snippet.startLine} TS 示例导入了不存在的二级入口: "${imp}"`);
      }
    }
  }

  return { errors, fixes, tsSnippets, documentedCount: documentedEntries.size };
}

/**
 * 在真实 `tsconfig.json` Program 上对第 2 节 TypeScript 代码片段做零错误编译检查。
 */
function typeCheckSnippets(tsSnippets, parsedConfig, rootEntryFiles) {
  if (tsSnippets.length === 0) return [];
  const snippetErrors = [];
  const virtualFiles = new Map();

  tsSnippets.forEach((s, idx) => {
    const vName = path.join(REPO_ROOT, `__llms_snippet_${idx + 1}__.ts`);
    const rewritten = s.code.replace(/@dotos\/dui\//g, '@dotos1/dui/');
    virtualFiles.set(path.resolve(vName), { startLine: s.startLine, text: rewritten, fileName: vName });
  });

  const options = {
    ...parsedConfig.options,
    noEmit: true,
    strictNullChecks: true,
  };
  const baseHost = ts.createCompilerHost(options);
  const origGetSourceFile = baseHost.getSourceFile.bind(baseHost);
  baseHost.getSourceFile = (fileName, languageVersion) => {
    const hit = virtualFiles.get(path.resolve(fileName));
    if (hit) {
      return ts.createSourceFile(fileName, hit.text, languageVersion, true);
    }
    return origGetSourceFile(fileName, languageVersion);
  };
  const origFileExists = baseHost.fileExists.bind(baseHost);
  baseHost.fileExists = (fileName) =>
    virtualFiles.has(path.resolve(fileName)) || origFileExists(fileName);
  const origReadFile = baseHost.readFile.bind(baseHost);
  baseHost.readFile = (fileName) => {
    const hit = virtualFiles.get(path.resolve(fileName));
    return hit ? hit.text : origReadFile(fileName);
  };

  const prog = ts.createProgram({
    rootNames: [...rootEntryFiles, ...[...virtualFiles.values()].map((v) => v.fileName)],
    options,
    host: baseHost,
  });

  for (const v of virtualFiles.values()) {
    const sf = prog.getSourceFile(v.fileName);
    if (!sf) continue;
    const diags = ts.getPreEmitDiagnostics(prog, sf);
    for (const d of diags) {
      const msg = ts.flattenDiagnosticMessageText(d.messageText, ' ');
      const pos = d.start !== undefined ? sf.getLineAndCharacterOfPosition(d.start) : { line: 0 };
      snippetErrors.push(
        `L${v.startLine + pos.line + 1} TS 示例编译错误 (TS${d.code}): ${msg}`
      );
    }
  }
  return snippetErrors;
}

/**
 * 自检模式：验证门禁能准确揪出全部五类典型幻觉 / 截断错误。
 */
function runSelftest() {
  const mockEntryMap = new Map([
    [
      '@dotos/dui/mock',
      {
        exports: new Set(['MockModule', 'MockDir']),
        classes: new Map([
          [
            'MockDir',
            {
              selector: '[duiMock]',
              decoratorKind: 'Directive',
              publicInputs: new Map([
                ['duiMock', { propName: 'internalTarget', typeText: 'string' }],
                ['filterFn', { propName: 'filterFn', typeText: '(a: number, b: string) => boolean' }],
              ]),
              propToInputAlias: new Map([
                ['internalTarget', 'duiMock'],
                ['filterFn', 'filterFn'],
              ]),
              publicOutputs: new Map([['mockClosed', { propName: 'onClosed', typeText: 'void' }]]),
              propToOutputAlias: new Map([['onClosed', 'mockClosed']]),
            },
          ],
        ]),
      },
    ],
  ]);

  const cases = [
    {
      name: '正确契约通过',
      md: '### `@dotos/dui/mock`\n- **NgModules**: `MockModule`\n- **Directive** `MockDir` (`[duiMock]`) — [duiMock]: string, [filterFn]: (a: number, b: string) => boolean; (mockClosed): void',
      wantPass: true,
    },
    {
      name: '拦截虚构二级入口',
      md: '### `@dotos/dui/i18n`\n- **Exports**: `DUI_LOCALE_BUNDLES`',
      wantPass: false,
    },
    {
      name: '拦截缺失 selector',
      md: '### `@dotos/dui/mock`\n- **Directive** `MockDir` — [duiMock]: string',
      wantPass: false,
    },
    {
      name: '拦截 50 字符签名截断',
      md: '### `@dotos/dui/mock`\n- **Directive** `MockDir` (`[duiMock]`) — [filterFn]: (a: number, b: strin',
      wantPass: false,
    },
    {
      name: '拦截 @Input 内部属性名误当公开绑定名',
      md: '### `@dotos/dui/mock`\n- **Directive** `MockDir` (`[duiMock]`) — [internalTarget]: string',
      wantPass: false,
    },
    {
      name: '拦截 @Output 内部属性名误当公开事件名',
      md: '### `@dotos/dui/mock`\n- **Directive** `MockDir` (`[duiMock]`) — (onClosed): void',
      wantPass: false,
    },
  ];

  let failed = 0;
  for (const c of cases) {
    const res = verifyLlmsMarkdown(c.md, mockEntryMap, { skipMissingEntryCheck: true });
    const passed = res.errors.length === 0;
    const ok = passed === c.wantPass;
    console.log(`${ok ? '✓' : '✗'} [G-LLMS selftest] ${c.name}`);
    if (!ok) {
      failed++;
      console.error('  期望 pass=' + c.wantPass + '，实际 errors=', res.errors);
    }
  }
  return failed === 0;
}

function main() {
  const argv = process.argv.slice(2);
  if (argv.includes('--selftest')) {
    process.exit(runSelftest() ? 0 : 1);
  }

  // 先静默执行自检，确保门禁判定力未退化
  const origLog = console.log;
  console.log = () => {};
  const selfOk = runSelftest();
  console.log = origLog;
  if (!selfOk) {
    console.error('✗ G-LLMS 自检未通过');
    process.exit(1);
  }

  if (!fs.existsSync(LLMS_PATH)) {
    console.error(`✗ G-LLMS: 未找到 ${LLMS_PATH}`);
    process.exit(1);
  }

  const discovered = discoverSecondaryEntries(SRC_DIR);
  const rootEntryFiles = [...discovered.values()]
    .map((e) => e.entryFile)
    .filter((f) => fs.existsSync(f));

  const cfgRaw = ts.readConfigFile(path.join(REPO_ROOT, 'tsconfig.json'), ts.sys.readFile);
  const parsedCfg = ts.parseJsonConfigFileContent(cfgRaw.config, ts.sys, REPO_ROOT);
  const program = ts.createProgram({
    rootNames: rootEntryFiles,
    options: { ...parsedCfg.options, noEmit: true },
  });
  const checker = program.getTypeChecker();

  const entryMetaMap = new Map();
  for (const [entryKey, entryInfo] of discovered.entries()) {
    const sf = program.getSourceFile(entryInfo.entryFile);
    const exportsSet = new Set();
    const classesMap = new Map();

    if (sf) {
      const modSym = checker.getSymbolAtLocation(sf);
      const modExports = modSym ? checker.getExportsOfModule(modSym) : [];
      for (const expSym of modExports) {
        const exportedName = expSym.getName();
        exportsSet.add(exportedName);
        const targetSym =
          expSym.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(expSym) : expSym;
        for (const decl of targetSym.getDeclarations() || []) {
          if (ts.isClassDeclaration(decl)) {
            classesMap.set(exportedName, extractClassBindings(decl, checker));
            break;
          }
        }
      }
    }
    entryMetaMap.set(entryKey, { exports: exportsSet, classes: classesMap });
  }

  const markdown = fs.readFileSync(LLMS_PATH, 'utf8');
  const { errors, fixes, tsSnippets, documentedCount } = verifyLlmsMarkdown(markdown, entryMetaMap);
  const snippetErrors = typeCheckSnippets(tsSnippets, parsedCfg, rootEntryFiles);
  const allErrors = [...errors, ...snippetErrors];

  if (argv.includes('--dump-fixes')) {
    console.log(JSON.stringify({ errorCount: allErrors.length, errors: allErrors, fixes }, null, 2));
    process.exit(allErrors.length ? 1 : 0);
  }

  if (allErrors.length > 0) {
    console.error(`✗ G-LLMS 不通过（共发现 ${allErrors.length} 处契约失配）：`);
    for (const err of allErrors) {
      console.error(`  - ${err}`);
    }
    process.exit(1);
  }

  console.log(
    `✓ G-LLMS 通过：${documentedCount}/${entryMetaMap.size} 个二级入口、${tsSnippets.length} 段 TS 示例与全部组件/指令公开绑定 100% 匹配 AST`
  );
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === __filename;
if (isMain) {
  main();
}
