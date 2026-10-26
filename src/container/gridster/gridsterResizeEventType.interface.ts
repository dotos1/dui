/**
 * @fileoverview Module `src/container/gridster/gridsterResizeEventType.interface.ts` providing gridster resize event type interface definitions and implementation.
 * @zh 模块文件 `src/container/gridster/gridsterResizeEventType.interface.ts`，提供网格拖拽布局调整尺寸事件类型interface相关的定义与实现。
 */

/**
 * Interface `GridsterResizeEventType` defining the contract and properties for gridster resize event type.
 * @zh 接口 `GridsterResizeEventType`，定义网格拖拽布局调整尺寸事件类型的数据结构契约与属性规范。
 */
export interface GridsterResizeEventType {
  /**
   * Property `n` (`boolean`) storing n.
   * @zh 属性 `n`（类型：`boolean`），用于存储或配置n。
   */
  n: boolean;
  /**
   * Property `s` (`boolean`) storing s.
   * @zh 属性 `s`（类型：`boolean`），用于存储或配置s。
   */
  s: boolean;
  /**
   * Property `w` (`boolean`) storing w.
   * @zh 属性 `w`（类型：`boolean`），用于存储或配置w。
   */
  w: boolean;
  /**
   * Property `e` (`boolean`) storing e.
   * @zh 属性 `e`（类型：`boolean`），用于存储或配置e。
   */
  e: boolean;
}
