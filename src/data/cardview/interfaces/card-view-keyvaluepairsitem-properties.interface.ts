/**
 * @fileoverview Module `src/data/cardview/interfaces/card-view-keyvaluepairsitem-properties.interface.ts` providing card view keyvaluepairsitem properties interface definitions and implementation.
 * @zh 模块文件 `src/data/cardview/interfaces/card-view-keyvaluepairsitem-properties.interface.ts`，提供卡片视图keyvaluepairsitem属性列表interface相关的定义与实现。
 */


import { CardViewItemProperties } from './card-view-item-properties.interface';

/**
 * Interface `CardViewKeyValuePairsItemType` defining the contract and properties for card view key value pairs item type.
 * @zh 接口 `CardViewKeyValuePairsItemType`，定义卡片视图键值Pairs条目类型的数据结构契约与属性规范。
 */
export interface CardViewKeyValuePairsItemType {
  /**
   * Property `name` (`string`) storing name.
   * @zh 属性 `name`（类型：`string`），用于存储或配置名称。
   */
  name: string;
  /**
   * Property `value` (`string`) storing value.
   * @zh 属性 `value`（类型：`string`），用于存储或配置值。
   */
  value: string;
}

/**
 * Interface `CardViewKeyValuePairsItemProperties` defining the contract and properties for card view key value pairs item properties.
 * @zh 接口 `CardViewKeyValuePairsItemProperties`，定义卡片视图键值Pairs条目属性列表的数据结构契约与属性规范。
 */
export interface CardViewKeyValuePairsItemProperties extends CardViewItemProperties {
  /**
   * Property `value` (`CardViewKeyValuePairsItemType[]`) storing value.
   * @zh 属性 `value`（类型：`CardViewKeyValuePairsItemType[]`），用于存储或配置值。
   */
  value: CardViewKeyValuePairsItemType[];
}
