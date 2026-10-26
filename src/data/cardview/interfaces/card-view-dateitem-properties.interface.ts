/**
 * @fileoverview Module `src/data/cardview/interfaces/card-view-dateitem-properties.interface.ts` providing card view dateitem properties interface definitions and implementation.
 * @zh 模块文件 `src/data/cardview/interfaces/card-view-dateitem-properties.interface.ts`，提供卡片视图dateitem属性列表interface相关的定义与实现。
 */


import { CardViewItemProperties } from './card-view-item-properties.interface';

/**
 * Interface `CardViewDateItemProperties` defining the contract and properties for card view date item properties.
 * @zh 接口 `CardViewDateItemProperties`，定义卡片视图日期条目属性列表的数据结构契约与属性规范。
 */
export interface CardViewDateItemProperties extends CardViewItemProperties {
  /**
   * Property `format` (`string`) storing format.
   * @zh 属性 `format`（类型：`string`），用于存储或配置格式化。
   */
  format?: string;
  /**
   * Property `locale` (`string`) storing locale.
   * @zh 属性 `locale`（类型：`string`），用于存储或配置语言区域。
   */
  locale?: string;
}
