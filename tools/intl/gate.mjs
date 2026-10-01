#!/usr/bin/env node
/**
 * <b>格式化对照门</b>。
 *
 * <p>新实现(`src/translator/intl.ts`,原生 `Intl`)与旧实现
 * (LEGACY 衍生的 intl 半边)逐值比对。
 *
 * <p><b>期望值不是我写的,是旧实现算出来的。</b>与
 * `duix/grid/tools/legacy-util/gate.mjs` 同一条路子 —— 自己写期望的话,
 * 「新旧不一致」和「我以为该是这样」会混成一件事。
 *
 * <p>旧实现<u>已经删了</u>,所以 golden 值冻结在 `golden.json` 里,
 * 由删除前的探针(`probe.ts`)跑出来。文件里带着生成日期与来源说明。
 *
 * <pre>
 *   node tools/intl/gate.mjs
 * </pre>
 */
import { readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';

const 门目录 = resolve(fileURLToPath(new URL('.', import.meta.url)));
const DUI = resolve(门目录, '../..');

const golden = JSON.parse(readFileSync(join(门目录, 'golden.json'), 'utf8'));

/*
 * 已知且**接受**的差异。
 *
 * 每一条都要写清楚"为什么接受" —— 空着的豁免等于把门关掉。
 */
const 豁免 = [
  {
    键: 'NUM|{"maximumFractionDigits":1,"currency":"USD"}|0.005',
    因为: '旧实现自己做四舍五入再补位,给出 "0.0";原生 Intl 给 "0"。' +
      '只有 maximumFractionDigits 单独出现且值恰好舍到 0 时才有差别,' +
      '而本仓库实际用到的对象形态是 { minimumFractionDigits },不走这条路。',
  },
];

// 新实现编译成 CJS 再跑 —— 与被测源码同一份,不另抄。
const 临时 = mkdtempSync(join(tmpdir(), 'dui-intl-gate-'));
try {
  const 入口 = join(临时, 'entry.ts');
  const fs = await import('node:fs');
  fs.writeFileSync(入口, `
    export { Internationalization } from '${join(DUI, 'src/translator/intl.ts')}';
  `);
  const 产物 = join(临时, 'entry.cjs');
  execFileSync(join(DUI, 'node_modules/.bin/esbuild'),
    [入口, '--bundle', '--platform=node', '--format=cjs', '--outfile=' + 产物, '--log-level=warning'],
    { stdio: 'inherit' });

  const { Internationalization } = await import(产物);
  const intl = new Internationalization();

  const 缓存 = new Map();
  const 取格式化 = (类, spec) => {
    const k = 类 + JSON.stringify(spec);
    if (!缓存.has(k)) {
      缓存.set(k, 类 === 'DATE'
        ? intl.getDateFormat(spec)
        : intl.getNumberFormat(typeof spec === 'string' ? { format: spec } : spec));
    }
    return 缓存.get(k);
  };

  let 通过 = 0;
  const 不一致 = [];
  const 豁免命中 = new Set();

  for (const [k, 期望] of Object.entries(golden)) {
    const p = k.split('|');
    if (p.length < 3) { continue; }        // 整条 THROW 的记录,不比
    const [类, specJson, 入参] = p;
    const spec = JSON.parse(specJson);
    let 实际;
    try {
      实际 = String(取格式化(类, spec)(类 === 'DATE' ? new Date(入参) : Number(入参)));
    } catch (e) {
      实际 = 'THROW:' + e.message;
    }
    if (实际 === 期望) { 通过++; continue; }
    const ex = 豁免.find((x) => x.键 === k);
    if (ex) { 豁免命中.add(k); continue; }
    不一致.push(`  ${k}\n      期望(旧) ${期望}\n      实际(新) ${实际}`);
  }

  const 未命中豁免 = 豁免.filter((x) => !豁免命中.has(x.键));
  if (未命中豁免.length) {
    // 豁免必须真的命中 —— 否则它就是一条永远为真的挡箭牌(§门 4u)。
    console.error(`✗ 有 ${未命中豁免.length} 条豁免没有对应的差异,说明它已经过时:`);
    for (const x of 未命中豁免) { console.error('    ' + x.键); }
    process.exit(1);
  }

  if (不一致.length) {
    console.error(`✗ ${不一致.length} 条与旧实现不一致(共 ${通过 + 不一致.length + 豁免命中.size} 条):\n`);
    console.error(不一致.join('\n'));
    process.exit(1);
  }

  console.log(`✓ 格式化对照:${通过} 条逐字一致,${豁免命中.size} 条已知差异(已记录理由)。`);
} finally {
  rmSync(临时, { recursive: true, force: true });
}
