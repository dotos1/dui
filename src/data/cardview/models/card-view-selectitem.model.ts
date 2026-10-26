/**
 * @fileoverview Module `src/data/cardview/models/card-view-selectitem.model.ts` providing card view selectitem model definitions and implementation.
 * @zh 模块文件 `src/data/cardview/models/card-view-selectitem.model.ts`，提供卡片视图selectitem模型相关的定义与实现。
 */


import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { DynamicComponentModel } from '@dotos/dui/core/services';
import { CardViewBaseItemModel } from './card-view-baseitem.model';
import { CardViewItem,CardViewSelectItemProperties, CardViewSelectItemOption } from '../interfaces';


/**
 * Class `CardViewSelectItemModel` encapsulating card view select item model data structures and logic in `src/data/cardview/models`.
 * @zh 类 `CardViewSelectItemModel`，封装 `src/data/cardview/models` 中的卡片视图下拉选择条目模型数据结构与处理逻辑。
 */
export class CardViewSelectItemModel<T> extends CardViewBaseItemModel implements CardViewItem, DynamicComponentModel {
  /**
   * Property `type` (`string`) storing type (default: `'select'`).
   * @zh 属性 `type`（类型：`string`），用于存储或配置类型（默认值：`'select'`）。
   */
  type: string = 'select';
  /**
   * Property `options$` (`Observable<CardViewSelectItemOption<T>[]>`) storing options.
   * @zh 属性 `options$`（类型：`Observable<CardViewSelectItemOption<T>[]>`），用于存储或配置配置选项。
   */
  options$: Observable<CardViewSelectItemOption<T>[]>;

  /**
   * Creates an instance of `CardViewSelectItemModel` and initializes its dependencies and internal state.
   * @zh 创建 `CardViewSelectItemModel` 实例，并初始化其依赖项与内部状态。
   * @param cardViewSelectItemProperties - Injected or initial card view select item properties (`CardViewSelectItemProperties<T>`) / 注入或传入的卡片视图下拉选择条目属性列表（`CardViewSelectItemProperties<T>`）
   */
  constructor(cardViewSelectItemProperties: CardViewSelectItemProperties<T>) {
    super(cardViewSelectItemProperties);
    this.options$ = cardViewSelectItemProperties.options$;
  }

  /**
   * Gets the current display value (`displayValue: any`).
   * @zh 获取当前display值（`displayValue: any`）。
   */
  get displayValue() {
    return this.options$.pipe(
      switchMap((options) => {
        const option = options.find((o) => o.key === this.value);
        return of(option ? option.label : '');
      })
    );
  }
}
