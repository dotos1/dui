/**
 * @fileoverview Module `src/data/cardview/models/card-view-baseitem.model.ts` providing card view baseitem model definitions and implementation.
 * @zh 模块文件 `src/data/cardview/models/card-view-baseitem.model.ts`，提供卡片视图baseitem模型相关的定义与实现。
 */



import { CardViewItemProperties, CardViewItemValidator } from '../interfaces';

/**
 * Class `CardViewBaseItemModel` encapsulating card view base item model data structures and logic in `src/data/cardview/models`.
 * @zh 类 `CardViewBaseItemModel`，封装 `src/data/cardview/models` 中的卡片视图基础条目模型数据结构与处理逻辑。
 */
export abstract class CardViewBaseItemModel {
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
  default;
  /**
   * Property `editable` (`boolean`) storing editable.
   * @zh 属性 `editable`（类型：`boolean`），用于存储或配置是否可编辑。
   */
  editable: boolean;
  /**
   * Property `clickable` (`boolean`) storing clickable.
   * @zh 属性 `clickable`（类型：`boolean`），用于存储或配置是否可点击。
   */
  clickable: boolean;
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

  /**
   * Creates an instance of `CardViewBaseItemModel` and initializes its dependencies and internal state.
   * @zh 创建 `CardViewBaseItemModel` 实例，并初始化其依赖项与内部状态。
   * @param cardViewItemProperties - Injected or initial card view item properties (`CardViewItemProperties`) / 注入或传入的卡片视图条目属性列表（`CardViewItemProperties`）
   */
  constructor(cardViewItemProperties: CardViewItemProperties) {
    this.label = cardViewItemProperties.label || '';
    this.value = cardViewItemProperties.value && cardViewItemProperties.value.displayName || cardViewItemProperties.value;
    this.key = cardViewItemProperties.key;
    this.default = cardViewItemProperties.default;
    this.editable = !!cardViewItemProperties.editable;
    this.clickable = !!cardViewItemProperties.clickable;
    this.icon = cardViewItemProperties.icon || '';
    this.validators = cardViewItemProperties.validators || [];
    this.data = cardViewItemProperties.data || null;
  }

  /**
   * Executes `isEmpty` to handle is empty.
   * @zh 执行 `isEmpty`，用于是否为空。
   * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
   */
  isEmpty(): boolean {
    return this.value === undefined || this.value === null || this.value === '';
  }

  /**
   * Executes `isValid` to handle is valid.
   * @zh 执行 `isValid`，用于是否为有效。
   * @param newValue - new value parameter (`any`) / 新值参数（`any`）
   * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
   */
  isValid(newValue): boolean {
    if (!this.validators.length) {
      return true;
    }

    return this.validators
      .map((validator) => validator.isValid(newValue))
      .reduce((isValidUntilNow, isValid) => isValidUntilNow && isValid, true);
  }

  /**
   * Executes `getValidationErrors` to handle get validation errors.
   * @zh 执行 `getValidationErrors`，用于获取校验错误列表。
   * @param value - value parameter (`any`) / 值参数（`any`）
   * @returns Result of type `string[]` / 类型为 `string[]` 的返回值
   */
  getValidationErrors(value): string[] {
    if (!this.validators.length) {
      return [];
    }

    return this.validators.filter((validator) => !validator.isValid(value)).map((validator) => validator.message);
  }
}
