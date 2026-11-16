/**
 * @fileoverview Module `src/data/cardview/models/card-view-datetimeitem.model.ts` providing card view datetimeitem model definitions and implementation.
 * @zh 模块文件 `src/data/cardview/models/card-view-datetimeitem.model.ts`，提供卡片视图datetimeitem模型相关的定义与实现。
 */


import { TranslationService } from '@dotos1/dui/translator';
import { DynamicComponentModel } from '@dotos1/dui/core/services';
import { CardViewDateItemModel } from './card-view-dateitem.model';
import { CardViewItem,CardViewDateItemProperties } from '../interfaces';

/**
 * Class `CardViewDatetimeItemModel` encapsulating card view datetime item model data structures and logic in `src/data/cardview/models`.
 * @zh 类 `CardViewDatetimeItemModel`，封装 `src/data/cardview/models` 中的卡片视图日期时间条目模型数据结构与处理逻辑。
 */
export class CardViewDatetimeItemModel extends CardViewDateItemModel implements CardViewItem, DynamicComponentModel {
  /**
   * Property `type` (`string`) storing type (default: `'datetime'`).
   * @zh 属性 `type`（类型：`string`），用于存储或配置类型（默认值：`'datetime'`）。
   */
  override type: string = 'datetime';
  /**
   * Property `format` (`string`) storing format (default: `'MMM d, y, H:mm'`).
   * @zh 属性 `format`（类型：`string`），用于存储或配置格式化（默认值：`'MMM d, y, H:mm'`）。
   */
  override format: string = 'MMM d, y, H:mm';

  /**
   * Creates an instance of `CardViewDatetimeItemModel` and initializes its dependencies and internal state.
   * @zh 创建 `CardViewDatetimeItemModel` 实例，并初始化其依赖项与内部状态。
   * @param cardViewDateItemProperties - Injected or initial card view date item properties (`CardViewDateItemProperties`) / 注入或传入的卡片视图日期条目属性列表（`CardViewDateItemProperties`）
   * @param translateService - Injected or initial translate service (`TranslationService`) / 注入或传入的翻译服务（`TranslationService`）
   */
  constructor(
    cardViewDateItemProperties: CardViewDateItemProperties,
    public override translateService: TranslationService) {
    super(cardViewDateItemProperties, translateService);

    if (cardViewDateItemProperties.format) {
      this.format = cardViewDateItemProperties.format;
    }
  }
}
