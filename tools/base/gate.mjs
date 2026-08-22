#!/usr/bin/env node
/**
 * <b>`dui/src/base` 行为对照门</b>。
 *
 * <p>新实现(自研)与旧实现(LEGACY 衍生)逐值比对。期望值不是我写的,
 * 是旧实现算出来的 —— 删除前由 `probe.ts` 跑出来冻结在 `golden.json`。
 *
 * <p><b>抛错只比"抛不抛",不比错误文案。</b>golden 里带着 V8 的原话
 * (`Cannot read properties of null (reading 'x')`),而那句话跟实现细节
 * 绑得太死:同样是"访问 null 的属性",换一个等价写法文案就变了。
 * 门要盯的性质是<u>「这里会抛」</u>,不是「抛出来的句子长什么样」。
 *
 * <pre>
 *   node tools/base/gate.mjs
 * </pre>
 */
import { readFileSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { tmpdir } from 'node:os';

const 门目录 = resolve(fileURLToPath(new URL('.', import.meta.url)));
const DUI = resolve(门目录, '../..');
const golden = JSON.parse(readFileSync(join(门目录, 'golden.json'), 'utf8'));

const 归一 = (v) => (typeof v === 'string' && v.startsWith('THROW:') ? 'THROW' : v);

const 临时 = mkdtempSync(join(tmpdir(), 'dui-base-gate-'));
try {
  const 入口 = join(临时, 'entry.ts');
  writeFileSync(入口, `
    export * from '${join(DUI, 'src/base/util.ts')}';
    export { Observer } from '${join(DUI, 'src/base/observer.ts')}';
  `);
  const 产物 = join(临时, 'entry.cjs');
  execFileSync(join(DUI, 'node_modules/.bin/esbuild'),
    [入口, '--bundle', '--platform=node', '--format=cjs', '--outfile=' + 产物, '--log-level=warning'],
    { stdio: 'inherit' });

  const m = await import(产物);
  const { getValue, setValue, extend, isNullOrUndefined, isUndefined, isObject, isBlankString, queryParams, Observer } = m;

  const 实际 = {};
  const 记 = (k, fn) => { try { 实际[k] = fn(); } catch (e) { 实际[k] = 'THROW:' + e.message; } };

  const 样本 = () => ({ a: { b: { c: 1 } }, arr: [10, 20], n: null, u: undefined, zero: 0, s: '', f: false });
  for (const p of ['a', 'a.b', 'a.b.c', 'a.b.c.d', 'a.x.y', 'arr', 'arr.0', 'arr.1', 'n', 'n.x',
                   'u', 'zero', 's', 'f', '', 'nope']) {
    记('getValue|' + p, () => JSON.stringify(getValue(p, 样本()) ?? null));
  }
  记('getValue|null目标', () => JSON.stringify(getValue('a.b', null) ?? null));

  for (const [p, v] of [['x', 1], ['y.z', 2], ['deep.a.b.c', 3], ['a.b.c', 9]]) {
    记('setValue|' + p, () => { const o = { a: { b: { c: 1 } } }; setValue(p, v, o); return JSON.stringify(o); });
  }

  记('extend|浅', () => JSON.stringify(extend({}, { a: 1, b: { c: 2 } }, { b: { d: 3 } })));
  记('extend|深', () => JSON.stringify(extend({}, { a: 1, b: { c: 2 } }, { b: { d: 3 } }, true)));
  记('extend|数组', () => JSON.stringify(extend({}, { a: [1, 2] }, { a: [3] })));
  记('extend|数组深', () => JSON.stringify(extend({}, { a: [1, 2] }, { a: [3] }, true)));
  记('extend|覆盖undefined', () => JSON.stringify(extend({ a: 1 }, { a: undefined })));

  for (const [n, v] of Object.entries({ null: null, undefined: undefined, zero: 0, 空串: '',
      空白串: '   ', false: false, 空对象: {}, 空数组: [], 数字: 1, 串: 'x', 日期: new Date(0),
      函数: () => 0 })) {
    记('isNullOrUndefined|' + n, () => isNullOrUndefined(v));
    记('isUndefined|' + n, () => isUndefined(v));
    记('isObject|' + n, () => isObject(v));
    记('isBlankString|' + n, () => isBlankString(v));
  }

  记('queryParams|基本', () => queryParams({ a: 1, b: 'x y', c: '中&文' }));
  记('queryParams|空', () => queryParams({}));
  记('queryParams|null值', () => queryParams({ a: null, b: undefined }));

  记('Observer|顺序与返回', () => {
    const 序 = []; const ob = new Observer({});
    const h1 = (a) => { 序.push('h1:' + a.v); };
    const h2 = (a) => { 序.push('h2:' + a.v); a.v = 99; };
    ob.on('e', h1); ob.on('e', h2);
    const arg = { v: 1 };
    ob.notify('e', arg); ob.off('e', h1); ob.notify('e', { v: 2 });
    return 序.join(',') + '|' + arg.v;
  });
  记('Observer|重复注册同函数', () => {
    let n = 0; const ob = new Observer({}); const h = () => { n++; };
    ob.on('e', h); ob.on('e', h); ob.notify('e', {}); return n;
  });
  记('Observer|未注册事件', () => { const ob = new Observer({}); return String(ob.notify('无', {})); });
  记('Observer|destroy后', () => {
    let n = 0; const ob = new Observer({}); ob.on('e', () => { n++; });
    ob.destroy(); ob.notify('e', {}); return n;
  });
  记('Observer|context', () => {
    const ob = new Observer({}); let 见 = ''; const ctx = { 名: 'ctx' };
    ob.on('e', function () { 见 = this && this.名; }, ctx);
    ob.notify('e', {});
    return 见;
  });

  const 缺 = Object.keys(golden).filter((k) => !(k in 实际));
  if (缺.length) {
    // 门必须覆盖 golden 的全部条目 —— 少跑几条比跑错更难发现(§门 4o)。
    console.error(`✗ 门少跑了 ${缺.length} 条 golden 用例:\n  ` + 缺.join('\n  '));
    process.exit(2);
  }

  const 不一致 = [];
  let 通过 = 0;
  for (const [k, 期望] of Object.entries(golden)) {
    if (归一(实际[k]) === 归一(期望)) { 通过++; continue; }
    不一致.push(`  ${k}\n      期望(旧) ${JSON.stringify(期望)}\n      实际(新) ${JSON.stringify(实际[k])}`);
  }

  if (不一致.length) {
    console.error(`✗ ${不一致.length} 条与旧实现不一致(共 ${通过 + 不一致.length} 条):\n`);
    console.error(不一致.join('\n'));
    process.exit(1);
  }
  console.log(`✓ dui/base 行为对照:${通过} 条一致。`);
} finally {
  rmSync(临时, { recursive: true, force: true });
}
