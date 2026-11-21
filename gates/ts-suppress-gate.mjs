#!/usr/bin/env node
// 类型检查压制「只减不增」门（2026-11-14 平台负责人定：@ts-ignore 必须清除，先加门禁）。
//
// 统计两类写法，按「文件」登记在被扫仓库根的 .ts-suppress-baseline.json：
//   ts-comment  ：@ts-ignore、@ts-nocheck、@ts-expect-error
//   type-escape ：as any、as unknown as、<any> 前缀断言、eslint-disable（换个形式压制，同样不许新增）
//   any-annotation：`: any` 类型标注、`<any…>` 泛型实参（清零 as any 时防止改写成 `const x: any = y` 绕过）
//   以上三类 2026-11-14 平台负责人定都要清零；门禁先保证只减不增。
//   基线里没有登记的类别暂不检查（兼容旧基线），执行 --update 即登记当前值。
//
// 规则（没有任何注释豁免，也不认「临时」「TODO」之类的说法）：
//   1. 任一文件任一类的数量不得超过基线（新文件基线为 0）——把压制挪到别的文件也算新增。
//   2. 数量减少后必须同步调低基线（--update），否则也判红：不给以后再加回来留余量。
//   3. --update 只在没有任何文件增加时才写；基线只能变小。
//
// 用法：
//   node ts-suppress-gate.mjs --root <仓库目录>            检查（CI 用）
//   node ts-suppress-gate.mjs --root <仓库目录> --update   清理后调低基线
//   node ts-suppress-gate.mjs --root <仓库目录> --init     首次建立基线（已有基线时拒绝）
//   node ts-suppress-gate.mjs --selftest                    区分力自测（正例必红、反例必绿）
//
// 只读源码、不执行被扫仓库里的任何代码；零依赖，Node ≥ 18。

import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

export const BASELINE_FILE = '.ts-suppress-baseline.json';
const EXT = /\.(ts|tsx|mts|cts)$/;
const SKIP_DIR = /(^|\/)(node_modules|dist|\.angular|\.nx|coverage|tmp)\//;

export const CATEGORIES = {
  'ts-comment': [/@ts-(?:ignore|nocheck|expect-error)\b/g],
  'type-escape': [
    /\bas\s+any\b/g,
    /\bas\s+unknown\s+as\b/g,
    /(?:^|[^\w$.\])>])<any>(?=\s*[\w$(\[{])/g,
    /eslint-disable/g,
  ],
  'any-annotation': [
    /:\s*any\b/g,
    /<\s*any\s*(?=[>,\[|])/g,
    /,\s*any\s*(?=[>,\[|])/g,
  ],
};

function listFiles(root) {
  let files;
  try {
    files = execFileSync('git', ['-C', root, 'ls-files', '-z'], { encoding: 'utf8', maxBuffer: 1 << 28 })
      .split('\0').filter(Boolean);
  } catch {
    files = [];
    const walk = (dir, rel) => {
      for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
        const r = rel ? `${rel}/${e.name}` : e.name;
        if (e.isDirectory()) { if (e.name !== '.git') walk(path.join(dir, e.name), r); }
        else files.push(r);
      }
    };
    walk(root, '');
  }
  return files.filter(f => EXT.test(f) && !SKIP_DIR.test(f)).sort();
}

export function scan(root) {
  const result = {};
  for (const f of listFiles(root)) {
    const p = path.join(root, f);
    if (!fs.existsSync(p)) continue;
    const lines = fs.readFileSync(p, 'utf8').split(/\r?\n/);
    const entry = {};
    for (const [cat, regs] of Object.entries(CATEGORIES)) {
      const hits = [];
      lines.forEach((line, i) => {
        for (const re of regs) {
          re.lastIndex = 0;
          const n = (line.match(re) || []).length;
          for (let k = 0; k < n; k++) hits.push(i + 1);
        }
      });
      if (hits.length) entry[cat] = hits;
    }
    if (Object.keys(entry).length) result[f] = entry;
  }
  return result;
}

function toBaseline(scanned) {
  const files = {};
  const totals = Object.fromEntries(Object.keys(CATEGORIES).map(c => [c, 0]));
  for (const [f, entry] of Object.entries(scanned)) {
    files[f] = {};
    for (const [cat, hits] of Object.entries(entry)) {
      files[f][cat] = hits.length;
      totals[cat] += hits.length;
    }
  }
  return {
    schema: 1,
    note: '由 gates/ts-suppress-gate.mjs 生成。只能变小：清理后用 --update 调低，不要手工调高。',
    totals,
    files,
  };
}

export function trackedCategories(baseline) {
  return Object.keys(CATEGORIES).filter(c => baseline.totals && c in baseline.totals);
}

export function compare(baseline, scanned) {
  const increases = [];
  const decreases = [];
  const all = new Set([...Object.keys(baseline.files || {}), ...Object.keys(scanned)]);
  const cats = trackedCategories(baseline);
  for (const f of [...all].sort()) {
    for (const cat of cats) {
      const base = baseline.files?.[f]?.[cat] ?? 0;
      const hits = scanned[f]?.[cat] ?? [];
      if (hits.length > base) increases.push({ file: f, cat, base, now: hits.length, lines: hits });
      else if (hits.length < base) decreases.push({ file: f, cat, base, now: hits.length });
    }
  }
  return { increases, decreases };
}

function readBaseline(root) {
  const p = path.join(root, BASELINE_FILE);
  if (!fs.existsSync(p)) return null;
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function writeBaseline(root, scanned) {
  const b = toBaseline(scanned);
  fs.writeFileSync(path.join(root, BASELINE_FILE), JSON.stringify(b, null, 2) + '\n');
  return b;
}

export function run(root, mode, log = console.log) {
  const scanned = scan(root);
  const baseline = readBaseline(root);
  if (mode === 'init') {
    if (baseline) { log(`✗ 已有 ${BASELINE_FILE}，--init 只用于首次建立；清理后请用 --update。`); return 2; }
    const b = writeBaseline(root, scanned);
    log('✓ 已建立基线：' + Object.keys(CATEGORIES).map(c => `${c} ${b.totals[c]}`).join('，'));
    return 0;
  }
  if (!baseline) { log(`✗ 缺少 ${BASELINE_FILE}（门禁基线）。`); return 2; }
  const { increases, decreases } = compare(baseline, scanned);
  if (increases.length) {
    log('✗ 类型检查压制新增（不许新增，也不许挪到别的文件）：');
    for (const x of increases) {
      log(`  ${x.file}  [${x.cat}] 基线 ${x.base} → 现在 ${x.now}，所在行：${x.lines.join(', ')}`);
    }
    log('  处理：真正修好类型或调整代码结构；不要改成 as any / as unknown as / @ts-expect-error / eslint-disable。');
    return 1;
  }
  const untracked = Object.keys(CATEGORIES).filter(c => !trackedCategories(baseline).includes(c));
  if (untracked.length && mode !== 'update') {
    log(`… 基线未登记的类别暂不检查：${untracked.join('、')}（执行 --update 登记）`);
  }
  if (mode === 'update') {
    const b = writeBaseline(root, scanned);
    log('✓ 基线已更新：' + Object.keys(CATEGORIES).map(c =>
      `${c} ${baseline.totals?.[c] ?? '（新登记）'} → ${b.totals[c]}`).join('，'));
    return 0;
  }
  if (decreases.length) {
    log('✗ 压制已减少，但基线没有同步调低（留着余量，以后会被再加回来）：');
    for (const x of decreases) log(`  ${x.file}  [${x.cat}] 基线 ${x.base} → 现在 ${x.now}`);
    log(`  处理：在仓库根执行 node gates/ts-suppress-gate.mjs --root . --update，并把 ${BASELINE_FILE} 一起提交。`);
    return 1;
  }
  const t = toBaseline(scanned).totals;
  log('✓ 未新增类型检查压制（当前 ' + trackedCategories(baseline).map(c => `${c} ${t[c]}`).join('，') + '；目标都是 0）');
  return 0;
}

// ---------------- 区分力自测 ----------------
function selftest() {
  const cases = [];
  const dirs = [];
  const mk = () => {
    const d = fs.mkdtempSync(path.join(os.tmpdir(), 'ts-suppress-'));
    dirs.push(d);
    execFileSync('git', ['init', '-q', d]);
    return d;
  };
  const put = (d, f, s) => {
    fs.mkdirSync(path.dirname(path.join(d, f)), { recursive: true });
    fs.writeFileSync(path.join(d, f), s);
    execFileSync('git', ['-C', d, 'add', '-A']);
  };
  const quiet = () => {};
  const expect = (name, got, want) => cases.push({ name, ok: got === want, got, want });

  // 基线：a.ts 有 1 个 @ts-ignore、1 个 as any
  const base = 'const x = 1;\n// @ts-ignore\nfoo();\nconst y = z as any;\nconst ok: Array<any> = [];\nbar<any>(1);\n';
  const fresh = () => { const d = mk(); put(d, 'src/a.ts', base); put(d, 'src/b.ts', 'export {};\n'); run(d, 'init', quiet); return d; };

  { const d = fresh(); expect('无变化 → 绿', run(d, 'check', quiet), 0); }
  for (const [label, add] of [
    ['新增 @ts-ignore', '// @ts-ignore\n'],
    ['新增 @ts-nocheck', '// @ts-nocheck\n'],
    ['新增 @ts-expect-error', '// @ts-expect-error\n'],
    ['新增 as any', 'const q = w as any;\n'],
    ['新增 as unknown as', 'const q = w as unknown as Foo;\n'],
    ['新增 <any> 断言', 'const q = <any>w;\n'],
    ['新增 eslint-disable', '// eslint-disable-next-line\n'],
    ['同一行再加一个 as any', ''],
  ]) {
    const d = fresh();
    if (add) put(d, 'src/a.ts', base + add);
    else put(d, 'src/a.ts', base.replace('z as any;', 'z as any as any;'));
    expect(`${label} → 红`, run(d, 'check', quiet), 1);
  }
  { const d = fresh(); put(d, 'src/a.ts', base.replace('// @ts-ignore\n', '')); put(d, 'src/b.ts', '// @ts-ignore\nexport {};\n');
    expect('挪到别的文件 → 红', run(d, 'check', quiet), 1); }
  { const d = fresh(); put(d, 'src/new.ts', '// @ts-ignore\n');
    expect('新文件带压制 → 红', run(d, 'check', quiet), 1); }
  { const d = fresh(); put(d, 'src/a.ts', base.replace('// @ts-ignore\n', ''));
    expect('减少但未调低基线 → 红', run(d, 'check', quiet), 1);
    expect('--update 调低 → 绿', run(d, 'update', quiet), 0);
    expect('调低后检查 → 绿', run(d, 'check', quiet), 0);
    put(d, 'src/a.ts', base);
    expect('调低后再加回来 → 红', run(d, 'check', quiet), 1); }
  { const d = fresh(); put(d, 'src/a.ts', base + '// @ts-ignore\n');
    expect('有新增时 --update 拒绝', run(d, 'update', quiet), 1); }
  { const d = fresh(); put(d, 'src/x.js', '// @ts-ignore\n'); put(d, 'README.md', '@ts-ignore as any\n');
    expect('非 TS 文件不计 → 绿', run(d, 'check', quiet), 0); }
  for (const [label, add] of [
    ['新增 : any 标注', 'const q: any = w;\n'],
    ['新增参数 : any', 'function f(a: any) {}\n'],
    ['新增 Array<any>', 'const a: Array<number> = []; const b = new Array<any>();\n'],
    ['新增 Map<string, any>', 'const m = new Map<string, any>();\n'],
    ['新增 any[]', 'let xs: any[] = [];\n'],
  ]) { const d = fresh(); put(d, 'src/a.ts', base + add); expect(`${label} → 红`, run(d, 'check', quiet), 1); }
  { const d = fresh(); put(d, 'src/c.ts', 'const company = 1;\nconst anyway = 2;\nconst o = { many: 1 };\n');
    expect('含 any 字样的标识符不计 → 绿', run(d, 'check', quiet), 0); }
  { const d = mk(); put(d, 'src/a.ts', base);
    fs.writeFileSync(path.join(d, BASELINE_FILE), JSON.stringify({ schema: 1, totals: { 'ts-comment': 1, 'type-escape': 1 },
      files: { 'src/a.ts': { 'ts-comment': 1, 'type-escape': 1 } } }));
    expect('旧基线（未登记新类别）→ 绿', run(d, 'check', quiet), 0);
    expect('旧基线 --update 登记新类别', run(d, 'update', quiet), 0);
    put(d, 'src/a.ts', base + 'const q: any = 1;\n');
    expect('登记后新增 : any → 红', run(d, 'check', quiet), 1); }
  { const d = fresh(); expect('已有基线时 --init 拒绝', run(d, 'init', quiet), 2); }
  { const d = mk(); put(d, 'src/a.ts', base); expect('缺基线 → 红', run(d, 'check', quiet), 2); }

  for (const d of dirs) fs.rmSync(d, { recursive: true, force: true });
  let failed = 0;
  for (const c of cases) {
    console.log(`${c.ok ? '✓' : '✗'} ${c.name}${c.ok ? '' : `（期望 ${c.want}，实际 ${c.got}）`}`);
    if (!c.ok) failed++;
  }
  console.log(failed ? `✗ 自测失败 ${failed}/${cases.length}` : `✓ 自测通过 ${cases.length}/${cases.length}`);
  return failed ? 1 : 0;
}

// ---------------- 入口 ----------------
const isMain = process.argv[1] && path.resolve(process.argv[1]) === path.resolve(new URL(import.meta.url).pathname);
if (isMain) {
  const args = process.argv.slice(2);
  if (args.includes('--selftest')) process.exit(selftest());
  const i = args.indexOf('--root');
  const root = path.resolve(i >= 0 ? args[i + 1] : '.');
  const mode = args.includes('--init') ? 'init' : args.includes('--update') ? 'update' : 'check';
  process.exit(run(root, mode));
}
