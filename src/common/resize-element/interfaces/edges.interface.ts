/**
 * The edges that the resize event were triggered on

 * @zh 接口 `Edges`，定义边/连线列表的数据结构契约与属性规范。
 */
export interface Edges {
  /**
   * Property `top` (`boolean | number`) storing top.
   * @zh 属性 `top`（类型：`boolean | number`），用于存储或配置顶部位置。
   */
  top?: boolean | number;
  /**
   * Property `bottom` (`boolean | number`) storing bottom.
   * @zh 属性 `bottom`（类型：`boolean | number`），用于存储或配置底部位置。
   */
  bottom?: boolean | number;
  /**
   * Property `left` (`boolean | number`) storing left.
   * @zh 属性 `left`（类型：`boolean | number`），用于存储或配置左侧位置。
   */
  left?: boolean | number;
  /**
   * Property `right` (`boolean | number`) storing right.
   * @zh 属性 `right`（类型：`boolean | number`），用于存储或配置右侧位置。
   */
  right?: boolean | number;
  [key: string]: boolean | number | undefined;
}
