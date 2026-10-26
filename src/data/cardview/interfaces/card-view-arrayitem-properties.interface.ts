/**
 * @fileoverview Module `src/data/cardview/interfaces/card-view-arrayitem-properties.interface.ts` providing card view arrayitem properties interface definitions and implementation.
 * @zh 模块文件 `src/data/cardview/interfaces/card-view-arrayitem-properties.interface.ts`，提供卡片视图arrayitem属性列表interface相关的定义与实现。
 */


import { CardViewItemProperties } from './card-view-item-properties.interface';

/**
 * Interface `CardViewArrayItemProperties` defining the contract and properties for card view array item properties.
 * @zh 接口 `CardViewArrayItemProperties`，定义卡片视图数组条目属性列表的数据结构契约与属性规范。
 */
export interface CardViewArrayItemProperties extends CardViewItemProperties {
  /**
   * Property `noOfItemsToDisplay` (`number`) storing no of items to display.
   * @zh 属性 `noOfItemsToDisplay`（类型：`number`），用于存储或配置no的条目列表转换为Display。
   */
  noOfItemsToDisplay?: number;
}
