/**
 * @fileoverview Module `src/data/cardview/interfaces/card-view-textitem-properties.interface.ts` providing card view textitem properties interface definitions and implementation.
 * @zh 模块文件 `src/data/cardview/interfaces/card-view-textitem-properties.interface.ts`，提供卡片视图textitem属性列表interface相关的定义与实现。
 */



import { CardViewItemProperties } from './card-view-item-properties.interface';
import { CardViewTextItemPipeProperty } from './card-view-textitem-pipe-property.interface';

/**
 * Interface `CardViewTextItemProperties` defining the contract and properties for card view text item properties.
 * @zh 接口 `CardViewTextItemProperties`，定义卡片视图文本条目属性列表的数据结构契约与属性规范。
 */
export interface CardViewTextItemProperties extends CardViewItemProperties {
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
}
