/**
 * @fileoverview Module `src/data/cardview/models/card-view-intitem.model.ts` providing card view intitem model definitions and implementation.
 * @zh 模块文件 `src/data/cardview/models/card-view-intitem.model.ts`，提供卡片视图intitem模型相关的定义与实现。
 */


import { DynamicComponentModel } from '@dotos1/dui/core/services';
import { CardViewTextItemModel } from './card-view-textitem.model';
import { CardViewItem,CardViewTextItemProperties } from '../interfaces';
import { CardViewItemIntValidator } from '../validators';

/**
 * Class `CardViewIntItemModel` encapsulating card view int item model data structures and logic in `src/data/cardview/models`.
 * @zh 类 `CardViewIntItemModel`，封装 `src/data/cardview/models` 中的卡片视图Int条目模型数据结构与处理逻辑。
 */
export class CardViewIntItemModel extends CardViewTextItemModel implements CardViewItem, DynamicComponentModel {
  /**
   * Property `type` (`string`) storing type (default: `'int'`).
   * @zh 属性 `type`（类型：`string`），用于存储或配置类型（默认值：`'int'`）。
   */
  override type: string = 'int';
  /**
   * Property `inputType` (`string`) storing input type (default: `'number'`).
   * @zh 属性 `inputType`（类型：`string`），用于存储或配置输入属性类型（默认值：`'number'`）。
   */
  override inputType: string = 'number';

  /**
   * Creates an instance of `CardViewIntItemModel` and initializes its dependencies and internal state.
   * @zh 创建 `CardViewIntItemModel` 实例，并初始化其依赖项与内部状态。
   * @param cardViewTextItemProperties - Injected or initial card view text item properties (`CardViewTextItemProperties`) / 注入或传入的卡片视图文本条目属性列表（`CardViewTextItemProperties`）
   */
  constructor(cardViewTextItemProperties: CardViewTextItemProperties) {
    super(cardViewTextItemProperties);

    this.validators.push(new CardViewItemIntValidator());
    if (cardViewTextItemProperties.value) {
      this.value = parseInt(cardViewTextItemProperties.value, 10);
    }
  }
}
