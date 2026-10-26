/**
 * @fileoverview Module `src/data/cardview/models/card-view-floatitem.model.ts` providing card view floatitem model definitions and implementation.
 * @zh 模块文件 `src/data/cardview/models/card-view-floatitem.model.ts`，提供卡片视图floatitem模型相关的定义与实现。
 */


import { DynamicComponentModel } from '@dotos/dui/core/services';
import { CardViewTextItemModel } from './card-view-textitem.model';
import { CardViewItem,CardViewTextItemProperties } from '../interfaces';
import { CardViewItemFloatValidator } from '../validators';

/**
 * Class `CardViewFloatItemModel` encapsulating card view float item model data structures and logic in `src/data/cardview/models`.
 * @zh 类 `CardViewFloatItemModel`，封装 `src/data/cardview/models` 中的卡片视图Float条目模型数据结构与处理逻辑。
 */
export class CardViewFloatItemModel extends CardViewTextItemModel implements CardViewItem, DynamicComponentModel {
  /**
   * Property `type` (`string`) storing type (default: `'float'`).
   * @zh 属性 `type`（类型：`string`），用于存储或配置类型（默认值：`'float'`）。
   */
  override type: string = 'float';
  /**
   * Property `inputType` (`string`) storing input type (default: `'number'`).
   * @zh 属性 `inputType`（类型：`string`），用于存储或配置输入属性类型（默认值：`'number'`）。
   */
  override inputType: string = 'number';

  /**
   * Creates an instance of `CardViewFloatItemModel` and initializes its dependencies and internal state.
   * @zh 创建 `CardViewFloatItemModel` 实例，并初始化其依赖项与内部状态。
   * @param cardViewTextItemProperties - Injected or initial card view text item properties (`CardViewTextItemProperties`) / 注入或传入的卡片视图文本条目属性列表（`CardViewTextItemProperties`）
   */
  constructor(cardViewTextItemProperties: CardViewTextItemProperties) {
    super(cardViewTextItemProperties);

    this.validators.push(new CardViewItemFloatValidator());
    if (cardViewTextItemProperties.value) {
      this.value = parseFloat(cardViewTextItemProperties.value);
    }
  }
}
