/**
 * @fileoverview Module `src/data/cardview/models/card-view-arrayitem.model.ts` providing card view arrayitem model definitions and implementation.
 * @zh 模块文件 `src/data/cardview/models/card-view-arrayitem.model.ts`，提供卡片视图arrayitem模型相关的定义与实现。
 */



import { Observable } from 'rxjs';
import { DynamicComponentModel } from '@dotos/dui/core/services';
import { CardViewBaseItemModel } from './card-view-baseitem.model';
import { CardViewItem,CardViewArrayItemProperties } from '../interfaces';

/**
 * Interface `CardViewArrayItem` defining the contract and properties for card view array item.
 * @zh 接口 `CardViewArrayItem`，定义卡片视图数组条目的数据结构契约与属性规范。
 */
export interface CardViewArrayItem {
  /**
   * Property `icon` (`string`) storing icon.
   * @zh 属性 `icon`（类型：`string`），用于存储或配置图标。
   */
  icon: string;
  /**
   * Property `value` (`string`) storing value.
   * @zh 属性 `value`（类型：`string`），用于存储或配置值。
   */
  value: string;
}

/**
 * Class `CardViewArrayItemModel` encapsulating card view array item model data structures and logic in `src/data/cardview/models`.
 * @zh 类 `CardViewArrayItemModel`，封装 `src/data/cardview/models` 中的卡片视图数组条目模型数据结构与处理逻辑。
 */
export class CardViewArrayItemModel extends CardViewBaseItemModel implements CardViewItem, DynamicComponentModel {

  /**
   * Property `type` (`string`) storing type (default: `'array'`).
   * @zh 属性 `type`（类型：`string`），用于存储或配置类型（默认值：`'array'`）。
   */
  type: string = 'array';
  /**
   * Property `value` (`Observable<CardViewArrayItem[]>`) storing value.
   * @zh 属性 `value`（类型：`Observable<CardViewArrayItem[]>`），用于存储或配置值。
   */
  declare value: Observable<CardViewArrayItem[]>;
  /**
   * Property `noOfItemsToDisplay` (`number`) storing no of items to display.
   * @zh 属性 `noOfItemsToDisplay`（类型：`number`），用于存储或配置no的条目列表转换为Display。
   */
  noOfItemsToDisplay: number;

  /**
   * Creates an instance of `CardViewArrayItemModel` and initializes its dependencies and internal state.
   * @zh 创建 `CardViewArrayItemModel` 实例，并初始化其依赖项与内部状态。
   * @param cardViewArrayItemProperties - Injected or initial card view array item properties (`CardViewArrayItemProperties`) / 注入或传入的卡片视图数组条目属性列表（`CardViewArrayItemProperties`）
   */
  constructor(cardViewArrayItemProperties: CardViewArrayItemProperties) {
    super(cardViewArrayItemProperties);
    this.noOfItemsToDisplay = cardViewArrayItemProperties.noOfItemsToDisplay;
  }

  /**
   * Gets the current display value (`displayValue: Observable<CardViewArrayItem[]>`).
   * @zh 获取当前display值（`displayValue: Observable<CardViewArrayItem[]>`）。
   */
  get displayValue(): Observable<CardViewArrayItem[]> {
    return this.value;
  }
}
