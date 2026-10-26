/**
 * @fileoverview Module `src/core/models/window.ts` providing window definitions and implementation.
 * @zh 模块文件 `src/core/models/window.ts`，提供窗口相关的定义与实现。
 */

/**
 * Interface `Window` defining the contract and properties for window.
 * @zh 接口 `Window`，定义窗口的数据结构契约与属性规范。
 */
export interface Window {
  /**
   * Property `navigator` (`any`) storing navigator.
   * @zh 属性 `navigator`（类型：`any`），用于存储或配置navigator。
   */
  navigator;
  /**
   * Property `location` (`any`) storing location.
   * @zh 属性 `location`（类型：`any`），用于存储或配置location。
   */
  location;
  /**
   * Executes `alert` to handle alert.
   * @zh 执行 `alert`，用于警告框。
   * @param msg - msg parameter (`string`) / msg参数（`string`）
   */
  alert(msg: string): void;
  /**
   * Executes `confirm` to handle confirm.
   * @zh 执行 `confirm`，用于confirm。
   * @param msg - msg parameter (`string`) / msg参数（`string`）
   */
  confirm(msg: string): void;
}
