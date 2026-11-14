/**
 * @fileoverview Module `src/data/cardview/models/card-view-boolitem.model.ts` providing card view boolitem model definitions and implementation.
 * @zh 模块文件 `src/data/cardview/models/card-view-boolitem.model.ts`，提供卡片视图boolitem模型相关的定义与实现。
 */


import { DynamicComponentModel } from '@dotos/dui/core/services';
import { CardViewBaseItemModel } from './card-view-baseitem.model';
import { CardViewItem,CardViewBoolItemProperties } from '../interfaces';

/**
 * Class `CardViewBoolItemModel` encapsulating card view bool item model data structures and logic in `src/data/cardview/models`.
 * @zh 类 `CardViewBoolItemModel`，封装 `src/data/cardview/models` 中的卡片视图Bool条目模型数据结构与处理逻辑。
 */
export class CardViewBoolItemModel extends CardViewBaseItemModel implements CardViewItem, DynamicComponentModel {
  /**
   * Property `type` (`string`) storing type (default: `'bool'`).
   * @zh 属性 `type`（类型：`string`），用于存储或配置类型（默认值：`'bool'`）。
   */
  type: string = 'bool';
  /**
   * Property `value` (`boolean`) storing value (default: `false`).
   * @zh 属性 `value`（类型：`boolean`），用于存储或配置值（默认值：`false`）。
   */
  override value: boolean = false;
  /**
   * Property `default` (`boolean`) storing default.
   * @zh 属性 `default`（类型：`boolean`），用于存储或配置默认。
   */
  declare default: boolean;

  /**
   * Creates an instance of `CardViewBoolItemModel` and initializes its dependencies and internal state.
   * @zh 创建 `CardViewBoolItemModel` 实例，并初始化其依赖项与内部状态。
   * @param cardViewBoolItemProperties - Injected or initial card view bool item properties (`CardViewBoolItemProperties`) / 注入或传入的卡片视图Bool条目属性列表（`CardViewBoolItemProperties`）
   */
  constructor(cardViewBoolItemProperties: CardViewBoolItemProperties) {
    super(cardViewBoolItemProperties);

    if (cardViewBoolItemProperties.value !== undefined) {
      this.value = !!JSON.parse(cardViewBoolItemProperties.value);
    }
  }

  /**
   * Gets the current display value (`displayValue: any`).
   * @zh 获取当前display值（`displayValue: any`）。
   */
  get displayValue() {
    if (this.isEmpty()) {
      return this.default;
    } else {
      return this.value;
    }
  }
}
