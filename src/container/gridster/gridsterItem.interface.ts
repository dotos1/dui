/**
 * @fileoverview Module `src/container/gridster/gridsterItem.interface.ts` providing gridster item interface definitions and implementation.
 * @zh 模块文件 `src/container/gridster/gridsterItem.interface.ts`，提供网格拖拽布局条目interface相关的定义与实现。
 */

import {GridsterItemComponentInterface} from './gridsterItemComponent.interface';

/**
 * Interface `GridsterItem` defining the contract and properties for gridster item.
 * @zh 接口 `GridsterItem`，定义网格拖拽布局条目的数据结构契约与属性规范。
 */
export interface GridsterItem {
  /**
   * Property `x` (`number`) storing x.
   * @zh 属性 `x`（类型：`number`），用于存储或配置X坐标。
   */
  x: number;
  /**
   * Property `y` (`number`) storing y.
   * @zh 属性 `y`（类型：`number`），用于存储或配置Y坐标。
   */
  y: number;
  /**
   * Property `rows` (`number`) storing rows.
   * @zh 属性 `rows`（类型：`number`），用于存储或配置行列表。
   */
  rows: number;
  /**
   * Property `cols` (`number`) storing cols.
   * @zh 属性 `cols`（类型：`number`），用于存储或配置列列表。
   */
  cols: number;
  /**
   * Property `layerIndex` (`number`) storing layer index.
   * @zh 属性 `layerIndex`（类型：`number`），用于存储或配置图层索引。
   */
  layerIndex?: number;
  /**
   * Property `initCallback` (`(item: GridsterItem, itemComponent: GridsterItemComponentInterface) => void`) storing init callback.
   * @zh 属性 `initCallback`（类型：`(item: GridsterItem, itemComponent: GridsterItemComponentInterface) => void`），用于存储或配置初始化回调函数。
   */
  initCallback?: (item: GridsterItem, itemComponent: GridsterItemComponentInterface) => void;
  /**
   * Property `dragEnabled` (`boolean`) storing drag enabled.
   * @zh 属性 `dragEnabled`（类型：`boolean`），用于存储或配置拖拽已启用。
   */
  dragEnabled?: boolean;
  /**
   * Property `resizeEnabled` (`boolean`) storing resize enabled.
   * @zh 属性 `resizeEnabled`（类型：`boolean`），用于存储或配置调整尺寸已启用。
   */
  resizeEnabled?: boolean;
  /**
   * Property `compactEnabled` (`boolean`) storing compact enabled.
   * @zh 属性 `compactEnabled`（类型：`boolean`），用于存储或配置紧凑已启用。
   */
  compactEnabled?: boolean;
  /**
   * Property `maxItemRows` (`number`) storing max item rows.
   * @zh 属性 `maxItemRows`（类型：`number`），用于存储或配置最大值条目行列表。
   */
  maxItemRows?: number;
  /**
   * Property `minItemRows` (`number`) storing min item rows.
   * @zh 属性 `minItemRows`（类型：`number`），用于存储或配置最小值条目行列表。
   */
  minItemRows?: number;
  /**
   * Property `maxItemCols` (`number`) storing max item cols.
   * @zh 属性 `maxItemCols`（类型：`number`），用于存储或配置最大值条目列列表。
   */
  maxItemCols?: number;
  /**
   * Property `minItemCols` (`number`) storing min item cols.
   * @zh 属性 `minItemCols`（类型：`number`），用于存储或配置最小值条目列列表。
   */
  minItemCols?: number;
  /**
   * Property `minItemArea` (`number`) storing min item area.
   * @zh 属性 `minItemArea`（类型：`number`），用于存储或配置最小值条目区域。
   */
  minItemArea?: number;
  /**
   * Property `maxItemArea` (`number`) storing max item area.
   * @zh 属性 `maxItemArea`（类型：`number`），用于存储或配置最大值条目区域。
   */
  maxItemArea?: number;

  [propName: string]: unknown;
}
