/**
 * @fileoverview Module `src/data/cardview/models/card-view-keyvaluepairs.model.ts` providing card view keyvaluepairs model definitions and implementation.
 * @zh 模块文件 `src/data/cardview/models/card-view-keyvaluepairs.model.ts`，提供卡片视图keyvaluepairs模型相关的定义与实现。
 */


import { DynamicComponentModel } from '@dotos1/dui/core/services';
import { CardViewBaseItemModel } from './card-view-baseitem.model';
import { CardViewItem,CardViewKeyValuePairsItemProperties } from '../interfaces';

/**
 * Class `CardViewKeyValuePairsItemModel` encapsulating card view key value pairs item model data structures and logic in `src/data/cardview/models`.
 * @zh 类 `CardViewKeyValuePairsItemModel`，封装 `src/data/cardview/models` 中的卡片视图键值Pairs条目模型数据结构与处理逻辑。
 */
export class CardViewKeyValuePairsItemModel extends CardViewBaseItemModel implements CardViewItem, DynamicComponentModel {
  /**
   * Property `type` (`string`) storing type (default: `'keyvaluepairs'`).
   * @zh 属性 `type`（类型：`string`），用于存储或配置类型（默认值：`'keyvaluepairs'`）。
   */
  type: string = 'keyvaluepairs';

  /**
   * Creates an instance of `CardViewKeyValuePairsItemModel` and initializes its dependencies and internal state.
   * @zh 创建 `CardViewKeyValuePairsItemModel` 实例，并初始化其依赖项与内部状态。
   * @param cardViewKeyValuePairsItemPrope... - Injected or initial card view key value pairs item prope (`CardViewKeyValuePairsItemProperties`) / 注入或传入的卡片视图键值Pairs条目Prope（`CardViewKeyValuePairsItemProperties`）
   */
  constructor(cardViewKeyValuePairsItemProperties: CardViewKeyValuePairsItemProperties) {
    super(cardViewKeyValuePairsItemProperties);
  }

  /**
   * Gets the current display value (`displayValue: any`).
   * @zh 获取当前display值（`displayValue: any`）。
   */
  get displayValue() {
    return this.value;
  }
}
