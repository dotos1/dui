#!/usr/bin/env node
/**
 * G-ANY —— dui 的 `any` 棘轮门。
 *
 * 按文件计数(剥注释后的 `any` 关键字,含 `: any` / `as any` / `<any>` / `any[]`)
 *   - 任何文件的计数超过基线 → 不通过;基线里没有的新文件必须是 0
 *   - 降了就提示 --freeze 收紧
 *
 * 用法:node gates/any-count.js [--list | --check | --freeze | --selftest]
 * 退出码:0 通过 / 1 不通过 / 2 用法或环境错误
 */
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SRC = path.join(ROOT, 'src');
const BASELINE_FILE = path.join(__dirname, 'any-baseline.json');
const SKIP_DIRS = new Set(['node_modules', 'dist', '__tests__', '.git', '.angular', 'vendor']);

let ts;
try {
  ts = require(path.join(ROOT, 'node_modules', 'typescript'));
} catch (e) {
  console.error('G-ANY 需要 node_modules/typescript(剥注释用):' + e.message);
  process.exit(2);
}

/**
 * 只数**类型位置**上的 any:扫 AST 里的 AnyKeyword 节点。
 */
function countAny(text) {
  const sf = ts.createSourceFile('x.ts', text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
  let n = 0;
  const visit = (node) => {
    if (node.kind === ts.SyntaxKind.AnyKeyword) n++;
    ts.forEachChild(node, visit);
  };
  visit(sf);
  return n;
}

function walk(dir, acc) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.isDirectory()) {
      if (!SKIP_DIRS.has(e.name)) walk(path.join(dir, e.name), acc);
    } else if (/\.ts$/.test(e.name) && !/\.(spec|d)\.ts$/.test(e.name)) {
      acc.push(path.join(dir, e.name));
    }
  }
  return acc;
}

function scanAll() {
  const counts = {};
  for (const f of walk(SRC, [])) {
    const n = countAny(fs.readFileSync(f, 'utf8'));
    if (n) counts[path.relative(ROOT, f).split(path.sep).join('/')] = n;
  }
  return counts;
}

function selftest() {
  const cases = [
    ['类型注解要计', 'let a: any = 1;', 1],
    ['as any 要计', 'const b = (x as any).y;', 1],
    ['泛型参数与数组要计', 'const c: Array<any> = []; const d: any[] = [];', 2],
    ['注释里的不计', '// let a: any\n/* as any */ const x = 1;', 0],
    ['字符串与标识符不计', "const any_ = 'any'; const company = { any: 1 };", 0],
    ['unknown 不计', 'let u: unknown;', 0],
  ];
  let fails = 0;
  for (const [desc, src, want] of cases) {
    const n = countAny(src);
    const ok = n === want;
    console.log(`${ok ? '✓' : '✗'} ${desc}(计数 ${n},期望 ${want})`);
    if (!ok) fails++;
  }
  return fails === 0;
}

const mode = process.argv[2] || '';
if (mode === '--selftest') process.exit(selftest() ? 0 : 1);
if (mode === '--check' || mode === '--freeze') {
  const log = console.log;
  console.log = () => undefined;
  const ok = selftest();
  console.log = log;
  if (!ok) {
    console.error('✗ G-ANY 自检未通过:计数器的区分力已失效。运行 --selftest 查看。');
    process.exit(1);
  }
}

const counts = scanAll();
const total = Object.values(counts).reduce((a, b) => a + b, 0);

if (mode === '--list') {
  Object.entries(counts).sort((a, b) => b[1] - a[1]).forEach(([f, n]) => console.log(`${String(n).padStart(4)}  ${f}`));
  console.log(`合计 ${total} 处,${Object.keys(counts).length} 个文件`);
} else if (mode === '--freeze') {
  fs.writeFileSync(BASELINE_FILE, JSON.stringify({ total, files: counts }, null, 2) + '\n');
  console.log(`已冻结基线 gates/any-baseline.json:${total} 处,${Object.keys(counts).length} 个文件`);
} else if (mode === '--check') {
  if (!fs.existsSync(BASELINE_FILE)) {
    console.error('基线 gates/any-baseline.json 不存在,先运行 --freeze');
    process.exit(2);
  }
  const base = JSON.parse(fs.readFileSync(BASELINE_FILE, 'utf8'));
  const over = Object.entries(counts).filter(([f, n]) => n > (base.files[f] || 0));
  if (over.length) {
    console.log(`✗ 各文件的 any 都不超过基线(实际 ${over.length} 个文件超出):`);
    over.forEach(([f, n]) => console.log(`    ${f}:${n} > 基线 ${base.files[f] || 0}`));
    console.log('  新代码请写出具体类型;确需逃生口用 unknown 再收窄。');
    process.exit(1);
  }
  console.log(`✓ 各文件的 any 都不超过基线(合计 ${total} / 基线 ${base.total}${total < base.total ? ',已下降,记得 --freeze 收紧' : ''})`);
} else {
  console.log(`dui any:${total} 处,${Object.keys(counts).length} 个文件(--list 查看)`);
}
