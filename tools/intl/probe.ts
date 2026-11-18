/**
 * 探针:用**旧实现**跑一遍输入矩阵,把结果打成 JSON。
 *
 * <p>期望值不是我写的,是旧实现算出来的 —— 与
 * `duix/grid/tools/legacy-util/gate.mjs` 同一条路子。自己写期望的话,
 * 「新旧不一致」和「我以为该是这样」会混成一件事。
 */
import { Internationalization } from '@dotos1/dui/translator';

/**
 * Constant/variable `矩阵` defining 矩阵 in `tools/intl`.
 * @zh 常量/变量 `矩阵`，定义 `tools/intl` 中的矩阵。
 */
// @ts-ignore  由 gate.mjs 用 --define 注入
declare const 矩阵: any;

/**
 * Constant/variable `intl` defining intl in `tools/intl`.
 * @zh 常量/变量 `intl`，定义 `tools/intl` 中的intl。
 */
const intl = new Internationalization();
/**
 * Constant/variable `out` defining out in `tools/intl`.
 * @zh 常量/变量 `out`，定义 `tools/intl` 中的输出。
 */
const out: Record<string, string> = {};

for (const f of 矩阵.日期格式) {
  let fmt: (d: Date) => string;
  try { fmt = intl.getDateFormat(f) as any; }
  catch (e) { out['DATE|' + JSON.stringify(f)] = 'THROW:' + (e as Error).message; continue; }
  for (const d of 矩阵.日期用例.map((s: string) => new Date(s))) {
    const k = 'DATE|' + JSON.stringify(f) + '|' + d.toISOString();
    try { out[k] = String(fmt(d)); } catch (e) { out[k] = 'THROW:' + (e as Error).message; }
  }
}

for (const f of 矩阵.数值格式) {
  const opt = typeof f === 'string' ? { format: f } : f;
  let fmt: (n: number) => string;
  try { fmt = intl.getNumberFormat(opt) as any; }
  catch (e) { out['NUM|' + JSON.stringify(f)] = 'THROW:' + (e as Error).message; continue; }
  for (const n of 矩阵.数值用例) {
    const k = 'NUM|' + JSON.stringify(f) + '|' + n;
    try { out[k] = String(fmt(n)); } catch (e) { out[k] = 'THROW:' + (e as Error).message; }
  }
}

console.log(JSON.stringify(out, null, 1));
