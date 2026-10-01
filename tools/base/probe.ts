/**
 * 探针:用**旧实现**跑一遍 `dui/src/base` 的行为矩阵,产出 golden。
 *
 * <p>与 `tools/intl/probe.ts` 同一条路子:期望值由旧实现算出,不是我写的。
 * 重写的是 `util.ts` / `dom.ts` / `observer.ts` / `event-handler.ts` / `base.ts`
 * 这五个 LEGACY 衍生文件,所以矩阵只覆盖它们的对外行为。
 * `object-utils.ts` 与 `duibase.ts` 是自研的,不动,也就不比。
 */
import { getValue, setValue, extend, isNullOrUndefined, isUndefined, isObject, isBlankString, queryParams } from '../../src/base/util';
import { Observer } from '../../src/base/observer';

const out: Record<string, unknown> = {};
const 记 = (k: string, fn: () => unknown) => {
  try { out[k] = fn(); } catch (e) { out[k] = 'THROW:' + (e as Error).message; }
};

/* ── getValue:路径取值 ─────────────────────────────────────────────────── */
const 样本 = { a: { b: { c: 1 } }, arr: [10, 20], n: null, u: undefined, zero: 0, s: '', f: false };
for (const p of ['a', 'a.b', 'a.b.c', 'a.b.c.d', 'a.x.y', 'arr', 'arr.0', 'arr.1', 'n', 'n.x',
                 'u', 'zero', 's', 'f', '', 'nope']) {
  记('getValue|' + p, () => JSON.stringify(getValue(p, 样本) ?? null));
}
记('getValue|null目标', () => JSON.stringify(getValue('a.b', null as never) ?? null));

/* ── setValue:路径赋值(含中途建对象) ──────────────────────────────────── */
for (const [p, v] of [['x', 1], ['y.z', 2], ['deep.a.b.c', 3], ['a.b.c', 9]] as [string, number][]) {
  记('setValue|' + p, () => { const o: Record<string, unknown> = { a: { b: { c: 1 } } }; setValue(p, v, o); return JSON.stringify(o); });
}

/* ── extend:浅/深 ─────────────────────────────────────────────────────── */
记('extend|浅', () => JSON.stringify(extend({}, { a: 1, b: { c: 2 } }, { b: { d: 3 } })));
记('extend|深', () => JSON.stringify(extend({}, { a: 1, b: { c: 2 } }, { b: { d: 3 } }, true)));
记('extend|数组', () => JSON.stringify(extend({}, { a: [1, 2] }, { a: [3] })));
记('extend|数组深', () => JSON.stringify(extend({}, { a: [1, 2] }, { a: [3] }, true)));
记('extend|覆盖undefined', () => JSON.stringify(extend({ a: 1 }, { a: undefined })));

/* ── 谓词 ─────────────────────────────────────────────────────────────── */
for (const [n, v] of Object.entries({ null: null, undefined: undefined, zero: 0, 空串: '',
    空白串: '   ', false: false, 空对象: {}, 空数组: [], 数字: 1, 串: 'x', 日期: new Date(0),
    函数: () => 0 })) {
  记('isNullOrUndefined|' + n, () => isNullOrUndefined(v as never));
  记('isUndefined|' + n, () => isUndefined(v as never));
  记('isObject|' + n, () => isObject(v as never));
  记('isBlankString|' + n, () => isBlankString(v as never));
}

/* ── queryParams ──────────────────────────────────────────────────────── */
记('queryParams|基本', () => queryParams({ a: 1, b: 'x y', c: '中&文' }));
记('queryParams|空', () => queryParams({}));
记('queryParams|null值', () => queryParams({ a: null, b: undefined }));

/* ── Observer:注册/触发/顺序/摘除 ─────────────────────────────────────── */
记('Observer|顺序与返回', () => {
  const 序: string[] = [];
  const ob = new Observer({});
  const h1 = (a: { v: number }) => { 序.push('h1:' + a.v); };
  const h2 = (a: { v: number }) => { 序.push('h2:' + a.v); a.v = 99; };
  ob.on('e', h1); ob.on('e', h2);
  const arg = { v: 1 };
  ob.notify('e', arg);
  ob.off('e', h1);
  ob.notify('e', { v: 2 });
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
  const ob = new Observer({}); let 见 = '';
  const ctx = { 名: 'ctx' };
  ob.on('e', function (this: typeof ctx) { 见 = this && this.名; }, ctx);
  ob.notify('e', {});
  return 见;
});

console.log(JSON.stringify(out, null, 1));
