#!/usr/bin/env node
// 旧商业组件库痕迹零容忍门。
//
// 背景：平台已用自研实现替换旧商业组件库，代码与依赖早已删除。残留的注释、方法名、
// 资源文件会让人误以为还有依赖、还要对照旧实现，并带来授权口径上的歧义。
// 本门扫描所有被 git 跟踪的文本文件，任一行出现旧库指纹即失败，没有基线、没有豁免。
//
// 用法：
//   node tools/gates/no-legacy-vendor-gate.mjs [--root <目录>]   扫描（CI 用）
//   node tools/gates/no-legacy-vendor-gate.mjs --selftest          区分力自测
// 退出码：0 通过；1 有命中；3 环境错误（不在 git 仓库、读不了文件）。
//
// 指纹由片段拼接而成，门源码自身不含完整词，所以不会命中自己。

import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const j = (...p) => p.join('');
const B = '(?<![a-z0-9])'; // 词首边界：避免命中 base64 / 哈希里的偶然子串
const PATTERNS = [
  j('sync', 'fusion'),
  B + j('e', 'j', '2'),
  j('essential', ' ', 'js'),
  B + j('sf', 'dt'),
  j('metro', ' ', 'studio'),
  j('document', 'editor'),
  j('get', 'Module', 'Name'),
  j('Child', 'Property'),
  j('Notify', 'Property', 'Changes'),
  B + j('e-', 'de-'),
  '\\b' + j('document', 'Helper') + '\\b', // 旧编辑器对象模型特征词
];
const RE = new RegExp(PATTERNS.join('|'), 'i');

export function scan(root) {
  let files;
  try {
    files = execFileSync('git', ['-C', root, 'ls-files', '-z'], { maxBuffer: 1 << 28 })
      .toString('utf8').split('\0').filter(Boolean);
  } catch (e) {
    return { env: `无法列出 ${root} 下被跟踪的文件：${e.message}` };
  }
  const hits = [];
  for (const rel of files) {
    const abs = path.join(root, rel);
    let buf;
    try {
      if (!fs.existsSync(abs)) continue; // 已删除未提交
      buf = fs.readFileSync(abs);
    } catch (e) {
      return { env: `读取 ${rel} 失败：${e.message}` };
    }
    if (buf.includes(0)) continue; // 二进制文件不扫
    const lines = buf.toString('utf8').split('\n');
    for (let i = 0; i < lines.length; i++) if (RE.test(lines[i])) hits.push(`${rel}:${i + 1}`);
    if (RE.test(rel)) hits.push(`${rel} (路径)`);
  }
  return { hits };
}

function selftest() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'vendor-gate-'));
  const git = (...a) => execFileSync('git', ['-C', dir, ...a], { stdio: 'pipe' });
  git('init', '-q');
  const write = (name, text) => fs.writeFileSync(path.join(dir, name), text);
  write('clean.ts', 'export const a = 1; // 哈希 sha512-xEj2uYg 不算\n');
  git('add', '.');
  let r = scan(dir);
  if (r.env || r.hits.length) { console.error('自测失败：干净样例不应命中'); return 3; }
  write('bad.ts', `// 旧实现来自 ${j('Sync', 'fusion')}\n`);
  write('bad2.ts', `const x = '${j('e', 'j', '2')}-grid';\n`);
  write('bad3.ts', `x.${j('sf', 'dt')} = 1;\n`);
  write('bad4.ts', `fetch('/api/${j('document', 'editor')}/open');\n`);
  write('bad5.ts', `// 原实现遍历 ${j('document', 'Helper')}.bookmarks\n`);
  git('add', '.');
  r = scan(dir);
  fs.rmSync(dir, { recursive: true, force: true });
  if (r.env || r.hits.length !== 5) { console.error('自测失败：命中样例应恰好命中 5 处'); return 3; }
  console.log('自测通过：干净样例 0 命中，构造样例 5 命中');
  return 0;
}

const args = process.argv.slice(2);
if (args.includes('--selftest')) process.exit(selftest());
const ri = args.indexOf('--root');
const root = ri >= 0 ? args[ri + 1] : '.';
const r = scan(root);
if (r.env) { console.error(`环境错误：${r.env}`); process.exit(3); }
if (r.hits.length) {
  console.error(`发现 ${r.hits.length} 处旧组件库痕迹，请改写为只描述现行实现：`);
  for (const h of r.hits) console.error(`  ${h}`);
  process.exit(1);
}
console.log('通过：被跟踪文本文件中没有旧组件库痕迹');
process.exit(0);
