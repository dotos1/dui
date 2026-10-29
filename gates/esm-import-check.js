#!/usr/bin/env node
/**
 * G-ESM —— 禁止 dui 源码引入 CommonJS 的 lodash（'lodash'、'lodash/fp' 等）。
 *
 * 已发布的 dui 是 ESM 包；'lodash/fp' 是目录导入，Node 22 的 ESM 解析不了，
 * duix 的 olap-unit 门就因此失败过。一律用 lodash-es。
 *
 * 用法：node gates/esm-import-check.js [--selftest]
 */
'use strict';
const fs = require('fs');
const path = require('path');

const SRC = path.resolve(__dirname, '..', 'src');
const BAD = /\bfrom\s+['"](lodash(?:\/[^'"]*)?)['"]|\brequire\(\s*['"](lodash(?:\/[^'"]*)?)['"]\s*\)/g;

function scan(text) {
  const hits = [];
  let m;
  BAD.lastIndex = 0;
  while ((m = BAD.exec(text))) hits.push(m[1] || m[2]);
  return hits;
}

if (process.argv.includes('--selftest')) {
  const cases = [
    ["import { mergeWith } from 'lodash/fp';", 1],
    ["import { get } from 'lodash';", 1],
    ["import { get } from 'lodash-es';", 0],
    ["const x = require('lodash/merge');", 1],
  ];
  let bad = 0;
  for (const [src, want] of cases) {
    const n = scan(src).length;
    console.log(`${n === want ? '✓' : '✗'} ${src}（${n}/${want}）`);
    if (n !== want) bad++;
  }
  process.exit(bad ? 1 : 0);
}

function walk(dir, acc) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name === 'node_modules') continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, acc);
    else if (/\.ts$/.test(e.name) && !/\.spec\.ts$/.test(e.name)) acc.push(p);
  }
  return acc;
}

const problems = [];
for (const f of walk(SRC, [])) {
  for (const spec of scan(fs.readFileSync(f, 'utf8'))) problems.push(`${path.relative(SRC, f)}：${spec}`);
}
if (problems.length) {
  console.error('✗ G-ESM：以下文件引入了 CommonJS 的 lodash，请改用 lodash-es：');
  problems.forEach((p) => console.error('    ' + p));
  process.exit(1);
}
console.log('✓ G-ESM：src 下没有 CommonJS lodash 导入');
