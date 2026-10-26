/**
 * @fileoverview Module `src/data/cardview/interfaces/card-view-textitem-pipe-property.interface.ts` providing card view textitem pipe property interface definitions and implementation.
 * @zh 模块文件 `src/data/cardview/interfaces/card-view-textitem-pipe-property.interface.ts`，提供卡片视图textitem管道属性interface相关的定义与实现。
 */



import { PipeTransform } from '@angular/core';

/**
 * Interface `CardViewTextItemPipeProperty` defining the contract and properties for card view text item pipe property.
 * @zh 接口 `CardViewTextItemPipeProperty`，定义卡片视图文本条目管道属性的数据结构契约与属性规范。
 */
export interface CardViewTextItemPipeProperty {
  /**
   * Property `pipe` (`PipeTransform`) storing pipe.
   * @zh 属性 `pipe`（类型：`PipeTransform`），用于存储或配置管道。
   */
  pipe: PipeTransform;
  /**
   * Property `params` (`any[]`) storing params.
   * @zh 属性 `params`（类型：`any[]`），用于存储或配置参数集合。
   */
  params?;
}
