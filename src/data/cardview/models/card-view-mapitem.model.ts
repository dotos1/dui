/**
 * @fileoverview Module `src/data/cardview/models/card-view-mapitem.model.ts` providing card view mapitem model definitions and implementation.
 * @zh 模块文件 `src/data/cardview/models/card-view-mapitem.model.ts`，提供卡片视图mapitem模型相关的定义与实现。
 */



import { DynamicComponentModel } from '@dotos/dui/core/services';
import { CardViewBaseItemModel } from './card-view-baseitem.model';
import { CardViewItem } from '../interfaces';

/**
 * Class `CardViewMapItemModel` encapsulating card view map item model data structures and logic in `src/data/cardview/models`.
 * @zh 类 `CardViewMapItemModel`，封装 `src/data/cardview/models` 中的卡片视图映射表条目模型数据结构与处理逻辑。
 */
export class CardViewMapItemModel extends CardViewBaseItemModel implements CardViewItem, DynamicComponentModel {
  /**
   * Property `type` (`string`) storing type (default: `'map'`).
   * @zh 属性 `type`（类型：`string`），用于存储或配置类型（默认值：`'map'`）。
   */
  type: string = 'map';
  /**
   * Property `value` (`Map<string, string>`) storing value.
   * @zh 属性 `value`（类型：`Map<string, string>`），用于存储或配置值。
   */
  override value: Map<string, string>;

  /**
   * Gets the current display value (`displayValue: any`).
   * @zh 获取当前display值（`displayValue: any`）。
   */
  get displayValue() {
    if (this.value && this.value.size > 0) {
      return this.value.values().next().value;
    } else {
      return this.default;
    }
  }
}
