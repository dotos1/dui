/**
 * @fileoverview Module `src/data/cardview/interfaces/card-view-boolitem-properties.interface.ts` providing card view boolitem properties interface definitions and implementation.
 * @zh 模块文件 `src/data/cardview/interfaces/card-view-boolitem-properties.interface.ts`，提供卡片视图boolitem属性列表interface相关的定义与实现。
 */



import { CardViewItemProperties } from './card-view-item-properties.interface';

/**
 * Interface `CardViewBoolItemProperties` defining the contract and properties for card view bool item properties.
 * @zh 接口 `CardViewBoolItemProperties`，定义卡片视图Bool条目属性列表的数据结构契约与属性规范。
 */
export interface CardViewBoolItemProperties extends CardViewItemProperties {
  /**
   * Property `value` (`any`) storing value.
   * @zh 属性 `value`（类型：`any`），用于存储或配置值。
   */
  value;
  /**
   * Property `default` (`boolean`) storing default.
   * @zh 属性 `default`（类型：`boolean`），用于存储或配置默认。
   */
  default?: boolean;
}
