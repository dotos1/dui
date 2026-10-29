#!/usr/bin/env node
/**
 * 复核 F6：259e4e5 机器生成的 JSDoc 里写死了类型（`any`、`Array<any>` 等），
 * 删注解 / 补类型之后与代码不一致。本工具用 TypeScript checker 取每个声明的真实类型，
 * 改写 JSDoc 中这几种生成格式里的类型：
 *
 *   Property `x` (`T`) …            @zh 属性 `x`（类型：`T`）…
 *   Input property `x` (`T`) …      @zh 输入属性 `x`（类型：`T`）…
 *   @param p - p parameter (`T`) / 中文（`T`）
 *   @returns Result of type `T` / 类型为 `T` 的返回值
 *
 * 用法：node tools/jsdoc-sync-types.js [--check]
 *   --check  只检查，有不一致就列出并以 1 退出（可接 CI）
 */
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const ts = require(path.join(ROOT, 'node_modules', 'typescript'));
const check = process.argv.includes('--check');

const cfgPath = path.join(ROOT, 'src/tsconfig.lib.json');
const raw = ts.readConfigFile(cfgPath, ts.sys.readFile);
const parsed = ts.parseJsonConfigFileContent(raw.config, ts.sys, path.dirname(cfgPath));
const program = ts.createProgram({ rootNames: parsed.fileNames, options: { ...parsed.options, noEmit: true } });
const checker = program.getTypeChecker();
const SRC = path.join(ROOT, 'src') + path.sep;

const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const FLAGS = ts.TypeFormatFlags.NoTruncation | ts.TypeFormatFlags.UseAliasDefinedOutsideCurrentScope;

/** 类型文字：过长的结构类型压成简短说明，避免把整个对象字面量塞进注释 */
function typeText(t, node) {
  let s = checker.typeToString(t, node, FLAGS);
  if (s.length > 80) s = s.replace(/\{[^]*\}/, '{…}');
  return s.replace(/`/g, "'");
}

let changedFiles = 0;
let changedSites = 0;
const report = [];

for (const sf of program.getSourceFiles()) {
  if (sf.isDeclarationFile || !sf.fileName.startsWith(SRC) || /\.spec\.ts$/.test(sf.fileName)) continue;
  const text = sf.getFullText();
  const edits = []; // [start, end, newText]

  const docRanges = (node) => (node.jsDoc || []).map((d) => [d.getStart(sf), d.getEnd()]);

  function patch(node, pattern, replacer) {
    for (const [s, e] of docRanges(node)) {
      const doc = text.slice(s, e);
      const next = doc.replace(pattern, replacer);
      if (next !== doc) edits.push([s, e, next]);
    }
  }

  function visit(node) {
    const name = node.name && ts.isIdentifier(node.name) ? node.name.text : null;
    if (name && (ts.isPropertyDeclaration(node) || ts.isPropertySignature(node) || ts.isGetAccessorDeclaration(node) || ts.isVariableDeclaration(node))) {
      const t = typeText(checker.getTypeAtLocation(node.name), node);
      const host = ts.isVariableDeclaration(node) ? node.parent.parent : node;
      patch(host, new RegExp('(`' + esc(name) + '` \\(`)[^`]*(`\\))', 'g'), (m, a, b) => a + t + b);
      patch(host, new RegExp('(`' + esc(name) + '`（类型：`)[^`]*(`）)', 'g'), (m, a, b) => a + t + b);
    }
    if (ts.isFunctionLike(node) && node.parameters) {
      for (const p of node.parameters) {
        if (!ts.isIdentifier(p.name)) continue;
        const t = typeText(checker.getTypeAtLocation(p.name), p);
        const pn = esc(p.name.text);
        patch(node, new RegExp('(@param ' + pn + '\\b[^\\n]*?\\(`)[^`]*(`\\)[^\\n]*?（`)[^`]*(`）)', 'g'), (m, a, b, c) => a + t + b + t + c);
        patch(node, new RegExp('(@param ' + pn + '\\b[^\\n]*?\\(`)[^`]*(`\\))', 'g'), (m, a, b) => a + t + b);
      }
      const sig = checker.getSignatureFromDeclaration(node);
      if (sig) {
        const rt = typeText(checker.getReturnTypeOfSignature(sig), node);
        patch(node, /(Result of type `)[^`]*(` \/ 类型为 `)[^`]*(` 的返回值)/g, (m, a, b, c) => a + rt + b + rt + c);
      }
    }
    ts.forEachChild(node, visit);
  }
  visit(sf);
  if (!edits.length) continue;

  // 同一段 JSDoc 可能被多条规则改写：按起点合并，后一条在前一条结果上继续
  const byRange = new Map();
  for (const [s, e, next] of edits) {
    const key = s + ':' + e;
    if (!byRange.has(key)) byRange.set(key, { s, e, orig: text.slice(s, e), cur: text.slice(s, e), fns: [] });
    byRange.get(key).fns.push(next);
  }
  // 重新逐条应用（各条 replace 都针对原文本，不同规则改的是不同片段，这里取逐段差异合并）
  let out = text;
  const ranges = [...byRange.values()].sort((a, b) => b.s - a.s);
  for (const r of ranges) {
    let cur = r.orig;
    for (const n of r.fns) {
      // 把 n 相对 orig 的改动套到 cur 上：逐行合并
      const ol = r.orig.split('\n');
      const nl = n.split('\n');
      const cl = cur.split('\n');
      for (let i = 0; i < ol.length; i++) if (nl[i] !== ol[i]) cl[i] = nl[i];
      cur = cl.join('\n');
    }
    if (cur !== r.orig) {
      changedSites++;
      out = out.slice(0, r.s) + cur + out.slice(r.e);
    }
  }
  if (out !== text) {
    changedFiles++;
    report.push(path.relative(ROOT, sf.fileName));
    if (!check) fs.writeFileSync(sf.fileName, out);
  }
}

if (check) {
  if (changedSites) {
    console.error(`✗ JSDoc 类型与代码不一致：${changedSites} 段，${changedFiles} 个文件（运行 node tools/jsdoc-sync-types.js 同步）`);
    report.slice(0, 30).forEach((f) => console.error('    ' + f));
    process.exit(1);
  }
  console.log('✓ JSDoc 里的类型说明与代码一致');
} else {
  console.log(`已同步 JSDoc 类型：${changedSites} 段，${changedFiles} 个文件`);
}
