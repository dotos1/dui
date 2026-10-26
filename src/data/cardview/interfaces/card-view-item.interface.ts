/**
 * @fileoverview Module `src/data/cardview/interfaces/card-view-item.interface.ts` providing card view item interface definitions and implementation.
 * @zh 模块文件 `src/data/cardview/interfaces/card-view-item.interface.ts`，提供卡片视图条目interface相关的定义与实现。
 */


/**
 * Interface `CardViewItem` defining the contract and properties for card view item.
 * @zh 接口 `CardViewItem`，定义卡片视图条目的数据结构契约与属性规范。
 */
export interface CardViewItem {
  /**
   * Property `label` (`string`) storing label.
   * @zh 属性 `label`（类型：`string`），用于存储或配置标签。
   */
  label?: string;
  /**
   * Property `value` (`any`) storing value.
   * @zh 属性 `value`（类型：`any`），用于存储或配置值。
   */
  value?;
  /**
   * Property `key` (`string`) storing key.
   * @zh 属性 `key`（类型：`string`），用于存储或配置键。
   */
  key?: string;
  /**
   * Property `default` (`any`) storing default.
   * @zh 属性 `default`（类型：`any`），用于存储或配置默认。
   */
  default?;
  /**
   * Property `type` (`string`) storing type.
   * @zh 属性 `type`（类型：`string`），用于存储或配置类型。
   */
  type: string;
  /**
   * Property `displayValue` (`any`) storing display value.
   * @zh 属性 `displayValue`（类型：`any`），用于存储或配置display值。
   */
  displayValue?;
  /**
   * Property `editable` (`boolean`) storing editable.
   * @zh 属性 `editable`（类型：`boolean`），用于存储或配置是否可编辑。
   */
  editable?: boolean;
  /**
   * Property `icon` (`string`) storing icon.
   * @zh 属性 `icon`（类型：`string`），用于存储或配置图标。
   */
  icon?: string;
}
