/**
 * @fileoverview Module `src/data/datatable/utils/id.ts` providing id definitions and implementation.
 * @zh 模块文件 `src/data/datatable/utils/id.ts`，提供唯一标识相关的定义与实现。
 */


/**
 * Executes `id` to handle id.
 * @zh 执行 `id`，用于唯一标识。
 */
export function id() {
  return ('0000' + ((Math.random() * Math.pow(36, 4)) << 0).toString(36)).slice(-4);
}
