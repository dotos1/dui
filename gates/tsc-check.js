#!/usr/bin/env node
/**
 * G-TSC —— dui 全部 96 个 ng-package.json 入口点（1 根入口 + 95 二级入口）的 TypeScript 类型检查门。
 */
'use strict';

const fs = require('fs');
const path = require('path');

const REPO = path.resolve(__dirname, '..');
const SRC = path.join(REPO, 'src');
const ts = require(path.join(REPO, 'node_modules', 'typescript'));

function findNgPackage(dir, res = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name === 'node_modules' || e.name.startsWith('.')) continue;
    const full = path.join(dir, e.name);
    if (e.isDirectory()) findNgPackage(full, res);
    else if (e.name === 'ng-package.json') res.push(full);
  }
  return res;
}

const entries = findNgPackage(SRC)
  .map((p) => {
    const d = path.dirname(p);
    const raw = JSON.parse(fs.readFileSync(p, 'utf8'));
    return path.join(d, raw?.lib?.entryFile ?? 'index.ts');
  })
  .filter((f) => fs.existsSync(f));

const cfg = ts.readConfigFile(path.join(REPO, 'tsconfig.json'), ts.sys.readFile);
const parsed = ts.parseJsonConfigFileContent(cfg.config, ts.sys, REPO);
const prog = ts.createProgram({
  rootNames: entries,
  options: { ...parsed.options, noEmit: true },
});
const diags = ts.getPreEmitDiagnostics(prog);

if (diags.length === 0) {
  console.log(`✓ G-TSC 通过:${entries.length} 个入口点,0 个类型错误`);
  process.exit(0);
}

console.error(`✗ G-TSC 不通过:共 ${diags.length} 个类型错误:`);
for (const d of diags.slice(0, 30)) {
  const msg = ts.flattenDiagnosticMessageText(d.messageText, '\n');
  if (d.file && d.start !== undefined) {
    const pos = d.file.getLineAndCharacterOfPosition(d.start);
    const rel = path.relative(REPO, d.file.fileName);
    console.error(`  ${rel}:${pos.line + 1}:${pos.character + 1} - error TS${d.code}: ${msg}`);
  } else {
    console.error(`  error TS${d.code}: ${msg}`);
  }
}
process.exit(1);
