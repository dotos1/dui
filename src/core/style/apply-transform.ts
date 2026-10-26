/**
 * @fileoverview Module `src/core/style/apply-transform.ts` providing apply transform definitions and implementation.
 * @zh 模块文件 `src/core/style/apply-transform.ts`，提供应用转换相关的定义与实现。
 */


/**
 * Executes `applyCssTransform` to handle apply css transform.
 * @zh 执行 `applyCssTransform`，用于应用CSS样式转换。
 * @param element - element parameter (`HTMLElement`) / 元素参数（`HTMLElement`）
 * @param transformValue - transform value parameter (`string`) / 转换值参数（`string`）
 */
export function applyCssTransform(element: HTMLElement, transformValue: string) {
  const value = transformValue.trim();

  element.style.transform = value;
  element.style.webkitTransform = value;
}
