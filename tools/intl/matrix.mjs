/**
 * 格式化门的**输入矩阵**。
 *
 * <p>旧实现(LEGACY 衍生的 `translator/` intl 半边)与新实现(原生 `Intl`)
 * 都跑这一份,逐值比对。矩阵不是编的 —— 每一条都来自实测枚举:
 *
 * <ul>
 *   <li>后端 `AbstractList.java` 等处 `put("format", …)` 下发的六种;</li>
 *   <li>应用配置里字面写死的五种(`C2` / `mediumDate` / `y/M/d` /
 *       `y/M/d H:m:s` / `MMM dd, y`);</li>
 *   <li>`grid/core/format.ts` 四条分支各自的入口形状。</li>
 * </ul>
 *
 * <p>加新用例只往下加,别改已有的 —— 改了就等于把期望值挪到新实现那边,
 * 门就不再是对照,而是自证。
 */

/** 日期用例。取固定时刻,不依赖运行时区之外的东西。 */
export const 日期用例 = [
  new Date(2026, 7, 22, 14, 5, 9),    // 2026-08-22 14:05:09
  new Date(2026, 0, 1, 0, 0, 0),      // 跨年边界
  new Date(2026, 11, 31, 23, 59, 59),
  new Date(1999, 4, 7, 9, 3, 4),      // 一位数的月/日/时/分/秒
];

/** 日期格式:后端下发的六种 + 应用里写死的三种。 */
export const 日期格式 = [
  { type: 'date', format: 'yyyy/MM/dd' },
  { type: 'date', format: 'yyyy/MM/dd HH:mm:ss' },
  { type: 'date', format: 'yyyy/MM/dd HH:mm' },
  { type: 'date', format: 'yyyy/MM' },
  { type: 'date', format: 'yyyy' },
  { type: 'date', skeleton: 'yMd' },
  { type: 'date', skeleton: 'yMd', format: 'y/M/d' },
  { type: 'datetime', skeleton: 'y/M/d H:m:s', format: 'y/M/d H:m:s' },
  { type: 'date', skeleton: 'MMM dd, y', format: 'MMM dd, y' },
  { type: 'date', skeleton: 'short' },
  { type: 'date', skeleton: 'medium' },
  { type: 'datetime', skeleton: 'short' },
];

export const 数值用例 = [0, 1, -1, 3.14159, 1234.5, -1234.5, 1234567.891, 0.005, 215, 1e6];

/** 数值格式:应用里出现过的 + `grid/core/format.ts` 分支 1 的对象形态。 */
export const 数值格式 = [
  'C2', 'N2', 'P2', 'N', 'C', 'P', '#,##0.00', '0.00',
  { minimumFractionDigits: 4 },
  { maximumFractionDigits: 1 },
  { format: 'C2' },
];
