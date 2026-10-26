/**
 * @fileoverview Module `src/data/cardview/interfaces/card-view-item-properties.interface.ts` providing card view item properties interface definitions and implementation.
 * @zh 模块文件 `src/data/cardview/interfaces/card-view-item-properties.interface.ts`，提供卡片视图条目属性列表interface相关的定义与实现。
 */


import { CardViewItemValidator } from './card-view-item-validator.interface';

/**
 * Interface `CardViewItemProperties` defining the contract and properties for card view item properties.
 * @zh 接口 `CardViewItemProperties`，定义卡片视图条目属性列表的数据结构契约与属性规范。
 */
export interface CardViewItemProperties {
  /**
   * Property `label` (`string`) storing label.
   * @zh 属性 `label`（类型：`string`），用于存储或配置标签。
   */
  label: string;
  /**
   * Property `value` (`any`) storing value.
   * @zh 属性 `value`（类型：`any`），用于存储或配置值。
   */
  value;
  /**
   * Property `key` (`any`) storing key.
   * @zh 属性 `key`（类型：`any`），用于存储或配置键。
   */
  key;
  /**
   * Property `default` (`any`) storing default.
   * @zh 属性 `default`（类型：`any`），用于存储或配置默认。
   */
  default?;
  /**
   * Property `editable` (`boolean`) storing editable.
   * @zh 属性 `editable`（类型：`boolean`），用于存储或配置是否可编辑。
   */
  editable?: boolean;
  /**
   * Property `clickable` (`any`) storing clickable.
   * @zh 属性 `clickable`（类型：`any`），用于存储或配置是否可点击。
   */
  clickable?;
  /**
   * Property `icon` (`string`) storing icon.
   * @zh 属性 `icon`（类型：`string`），用于存储或配置图标。
   */
  icon?: string;
  /**
   * Property `validators` (`CardViewItemValidator[]`) storing validators.
   * @zh 属性 `validators`（类型：`CardViewItemValidator[]`），用于存储或配置校验器列表。
   */
  validators?: CardViewItemValidator[];
  /**
   * Property `data` (`any`) storing data.
   * @zh 属性 `data`（类型：`any`），用于存储或配置数据。
   */
  data?;
}
