/**
 * The bounding rectangle of the resized element

 * @zh 接口 `BoundingRectangle`，定义包围边界矩形的数据结构契约与属性规范。
 */
export interface BoundingRectangle {
  /**
   * Property `top` (`number`) storing top.
   * @zh 属性 `top`（类型：`number`），用于存储或配置顶部位置。
   */
  top: number;
  /**
   * Property `bottom` (`number`) storing bottom.
   * @zh 属性 `bottom`（类型：`number`），用于存储或配置底部位置。
   */
  bottom: number;
  /**
   * Property `left` (`number`) storing left.
   * @zh 属性 `left`（类型：`number`），用于存储或配置左侧位置。
   */
  left: number;
  /**
   * Property `right` (`number`) storing right.
   * @zh 属性 `right`（类型：`number`），用于存储或配置右侧位置。
   */
  right: number;
  /**
   * Property `height` (`number`) storing height.
   * @zh 属性 `height`（类型：`number`），用于存储或配置高度。
   */
  height?: number;
  /**
   * Property `width` (`number`) storing width.
   * @zh 属性 `width`（类型：`number`），用于存储或配置宽度。
   */
  width?: number;
  /**
   * Property `scrollTop` (`number`) storing scroll top.
   * @zh 属性 `scrollTop`（类型：`number`），用于存储或配置滚动顶部位置。
   */
  scrollTop?: number;
  /**
   * Property `scrollLeft` (`number`) storing scroll left.
   * @zh 属性 `scrollLeft`（类型：`number`），用于存储或配置滚动左侧位置。
   */
  scrollLeft?: number;
  [key: string]: number | undefined;
}
