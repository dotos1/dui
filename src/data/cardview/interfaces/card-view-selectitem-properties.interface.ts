/**
 * @fileoverview Module `src/data/cardview/interfaces/card-view-selectitem-properties.interface.ts` providing card view selectitem properties interface definitions and implementation.
 * @zh 模块文件 `src/data/cardview/interfaces/card-view-selectitem-properties.interface.ts`，提供卡片视图selectitem属性列表interface相关的定义与实现。
 */


import { CardViewItemProperties } from './card-view-item-properties.interface';
import { Observable } from 'rxjs';

/**
 * Interface `CardViewSelectItemOption` defining the contract and properties for card view select item option.
 * @zh 接口 `CardViewSelectItemOption`，定义卡片视图下拉选择条目选项的数据结构契约与属性规范。
 */
export interface CardViewSelectItemOption<T> {
  /**
   * Property `label` (`string`) storing label.
   * @zh 属性 `label`（类型：`string`），用于存储或配置标签。
   */
  label: string;
  /**
   * Property `key` (`T`) storing key.
   * @zh 属性 `key`（类型：`T`），用于存储或配置键。
   */
  key: T;
}

/**
 * Interface `CardViewSelectItemProperties` defining the contract and properties for card view select item properties.
 * @zh 接口 `CardViewSelectItemProperties`，定义卡片视图下拉选择条目属性列表的数据结构契约与属性规范。
 */
export interface CardViewSelectItemProperties<T> extends CardViewItemProperties {
  /**
   * Property `value` (`string`) storing value.
   * @zh 属性 `value`（类型：`string`），用于存储或配置值。
   */
  value: string;
  /**
   * Property `options$` (`Observable<CardViewSelectItemOption<T>[]>`) storing options.
   * @zh 属性 `options$`（类型：`Observable<CardViewSelectItemOption<T>[]>`），用于存储或配置配置选项。
   */
  options$: Observable<CardViewSelectItemOption<T>[]>;
}
