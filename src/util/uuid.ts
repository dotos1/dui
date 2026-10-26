/**
 * @fileoverview Module `src/util/uuid.ts` providing uuid definitions and implementation.
 * @zh 模块文件 `src/util/uuid.ts`，提供唯一标识符相关的定义与实现。
 */

/**
 * Executes `S4` to handle s4.
 * @zh 执行 `S4`，用于S4。
 */
export function S4() {
  // tslint:disable-next-line: no-bitwise
  return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
}

/**
 * Executes `uuid` to handle uuid.
 * @zh 执行 `uuid`，用于唯一标识符。
 */
export function uuid() {
  const id = `${S4()}${S4()}-${S4()}-${S4()}-${S4()}-${S4()}${S4()}${S4()}`;
  return id.toLowerCase();
}
