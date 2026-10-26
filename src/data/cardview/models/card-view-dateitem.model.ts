/**
 * @fileoverview Module `src/data/cardview/models/card-view-dateitem.model.ts` providing card view dateitem model definitions and implementation.
 * @zh 模块文件 `src/data/cardview/models/card-view-dateitem.model.ts`，提供卡片视图dateitem模型相关的定义与实现。
 */


import { DynamicComponentModel } from '@dotos/dui/core/services';
import { LocalizedDatePipe } from '@dotos/dui/util/pipes';
import { TranslationService } from '@dotos/dui/translator';
import { CardViewBaseItemModel } from './card-view-baseitem.model';
import { CardViewItem,CardViewDateItemProperties } from '../interfaces';


/**
 * Class `CardViewDateItemModel` encapsulating card view date item model data structures and logic in `src/data/cardview/models`.
 * @zh 类 `CardViewDateItemModel`，封装 `src/data/cardview/models` 中的卡片视图日期条目模型数据结构与处理逻辑。
 */
export class CardViewDateItemModel extends CardViewBaseItemModel implements CardViewItem, DynamicComponentModel {
  /**
   * Property `type` (`string`) storing type (default: `'date'`).
   * @zh 属性 `type`（类型：`string`），用于存储或配置类型（默认值：`'date'`）。
   */
  type: string = 'date';
  /**
   * Property `format` (`string`) storing format.
   * @zh 属性 `format`（类型：`string`），用于存储或配置格式化。
   */
  format: string;
  /**
   * Property `locale` (`string`) storing locale.
   * @zh 属性 `locale`（类型：`string`），用于存储或配置语言区域。
   */
  locale: string;

  /**
   * Property `localizedDatePipe` (`LocalizedDatePipe`) storing localized date pipe.
   * @zh 属性 `localizedDatePipe`（类型：`LocalizedDatePipe`），用于存储或配置localized日期管道。
   */
  localizedDatePipe: LocalizedDatePipe;

  /**
   * Creates an instance of `CardViewDateItemModel` and initializes its dependencies and internal state.
   * @zh 创建 `CardViewDateItemModel` 实例，并初始化其依赖项与内部状态。
   * @param cardViewDateItemProperties - Injected or initial card view date item properties (`CardViewDateItemProperties`) / 注入或传入的卡片视图日期条目属性列表（`CardViewDateItemProperties`）
   * @param translateService - Injected or initial translate service (`TranslationService`) / 注入或传入的翻译服务（`TranslationService`）
   */
  constructor(
    cardViewDateItemProperties: CardViewDateItemProperties,
    public translateService: TranslationService) {
    super(cardViewDateItemProperties);

    if (cardViewDateItemProperties.format) {
      this.format = cardViewDateItemProperties.format;
    }

    if (cardViewDateItemProperties.locale) {
      this.locale = cardViewDateItemProperties.locale;
    }

  }

  /**
   * Gets the current display value (`displayValue: any`).
   * @zh 获取当前display值（`displayValue: any`）。
   */
  get displayValue() {
    if (!this.value) {
      return this.default;
    } else {
      this.localizedDatePipe = new LocalizedDatePipe(this.translateService);
      return this.localizedDatePipe.transform(this.value, this.format, this.locale);
    }
  }
}
