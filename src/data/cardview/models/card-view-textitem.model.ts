/**
 * @fileoverview Module `src/data/cardview/models/card-view-textitem.model.ts` providing card view textitem model definitions and implementation.
 * @zh 模块文件 `src/data/cardview/models/card-view-textitem.model.ts`，提供卡片视图textitem模型相关的定义与实现。
 */


import { DynamicComponentModel } from '@dotos1/dui/core/services';
import { CardViewBaseItemModel } from './card-view-baseitem.model';
import { CardViewItem,CardViewTextItemPipeProperty, CardViewTextItemProperties } from '../interfaces';

/**
 * Class `CardViewTextItemModel` encapsulating card view text item model data structures and logic in `src/data/cardview/models`.
 * @zh 类 `CardViewTextItemModel`，封装 `src/data/cardview/models` 中的卡片视图文本条目模型数据结构与处理逻辑。
 */
export class CardViewTextItemModel extends CardViewBaseItemModel implements CardViewItem, DynamicComponentModel {
  /**
   * Property `type` (`string`) storing type (default: `'text'`).
   * @zh 属性 `type`（类型：`string`），用于存储或配置类型（默认值：`'text'`）。
   */
  type: string = 'text';
  /**
   * Property `inputType` (`string`) storing input type (default: `'text'`).
   * @zh 属性 `inputType`（类型：`string`），用于存储或配置输入属性类型（默认值：`'text'`）。
   */
  inputType: string = 'text';
  /**
   * Property `multiline` (`boolean`) storing multiline.
   * @zh 属性 `multiline`（类型：`boolean`），用于存储或配置multiline。
   */
  multiline?: boolean;
  /**
   * Property `multivalued` (`boolean`) storing multivalued.
   * @zh 属性 `multivalued`（类型：`boolean`），用于存储或配置multivalued。
   */
  multivalued?: boolean;
  /**
   * Property `pipes` (`CardViewTextItemPipeProperty[]`) storing pipes.
   * @zh 属性 `pipes`（类型：`CardViewTextItemPipeProperty[]`），用于存储或配置管道。
   */
  pipes?: CardViewTextItemPipeProperty[];
  /**
   * Property `clickCallBack` (`any`) storing click call back.
   * @zh 属性 `clickCallBack`（类型：`any`），用于存储或配置点击调用返回。
   */
  clickCallBack?;

  /**
   * Creates an instance of `CardViewTextItemModel` and initializes its dependencies and internal state.
   * @zh 创建 `CardViewTextItemModel` 实例，并初始化其依赖项与内部状态。
   * @param cardViewTextItemProperties - Injected or initial card view text item properties (`CardViewTextItemProperties`) / 注入或传入的卡片视图文本条目属性列表（`CardViewTextItemProperties`）
   */
  constructor(cardViewTextItemProperties: CardViewTextItemProperties) {
    super(cardViewTextItemProperties);
    this.multiline = !!cardViewTextItemProperties.multiline;
    this.multivalued = !!cardViewTextItemProperties.multivalued;
    this.pipes = cardViewTextItemProperties.pipes || [];
    this.clickCallBack = cardViewTextItemProperties.clickCallBack ? cardViewTextItemProperties.clickCallBack : null;

    if (this.default && this.isEmpty()) {
      this.value = this.default;
    }
  }

  /**
   * Gets the current display value (`displayValue: string`).
   * @zh 获取当前display值（`displayValue: string`）。
   */
  get displayValue(): string {
    return this.applyPipes(this.value);
  }

  /**
   * Executes `applyPipes` to handle apply pipes.
   * @zh 执行 `applyPipes`，用于应用管道。
   * @param displayValue - display value parameter (`any`) / display值参数（`any`）
   */
  private applyPipes(displayValue) {
    if (this.pipes.length) {
      displayValue = this.pipes.reduce((accumulator, { pipe, params = [] }) => {
        return pipe.transform(accumulator, ...params);
      }, displayValue);
    }

    return displayValue;
  }
}
