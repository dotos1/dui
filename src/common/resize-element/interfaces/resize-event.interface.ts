/**
 * @fileoverview Module `src/common/resize-element/interfaces/resize-event.interface.ts` providing resize event interface definitions and implementation.
 * @zh 模块文件 `src/common/resize-element/interfaces/resize-event.interface.ts`，提供调整尺寸事件interface相关的定义与实现。
 */

import { BoundingRectangle } from './bounding-rectangle.interface';
import { Edges } from './edges.interface';

/**
 * The `$event` object that is passed to the resize events

 * @zh 接口 `ResizeEvent`，定义调整尺寸事件的数据结构契约与属性规范。
 */
export interface ResizeEvent {
  /**
   * Property `rectangle` (`BoundingRectangle`) storing rectangle.
   * @zh 属性 `rectangle`（类型：`BoundingRectangle`），用于存储或配置矩形。
   */
  rectangle: BoundingRectangle;
  /**
   * Property `edges` (`Edges`) storing edges.
   * @zh 属性 `edges`（类型：`Edges`），用于存储或配置边/连线列表。
   */
  edges: Edges;
}
