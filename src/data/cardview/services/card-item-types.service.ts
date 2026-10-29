/**
 * @fileoverview Module `src/data/cardview/services/card-item-types.service.ts` providing card item types service definitions and implementation.
 * @zh 模块文件 `src/data/cardview/services/card-item-types.service.ts`，提供卡片条目类型列表服务相关的定义与实现。
 */


import { Injectable, Type } from '@angular/core';
import { DynamicComponentMapper, DynamicComponentResolveFunction, DynamicComponentResolver } from '@dotos/dui/core/services';
import { 
  CardViewDateItemComponent,CardViewMapItemComponent,CardViewTextItemComponent,
  CardViewSelectItemComponent,CardViewBoolItemComponent,CardViewKeyValuePairsItemComponent,
  CardViewArrayItemComponent
 } from '../components';
 
/**
 * Injectable Angular service `CardItemTypeService` managing card item type service state and operations in `src/data/cardview/services`.
 * @zh 可注入的 Angular 服务 `CardItemTypeService`，管理 `src/data/cardview/services` 中的卡片条目类型服务状态与业务操作。
 */
@Injectable({
  providedIn: 'root'
})
export class CardItemTypeService extends DynamicComponentMapper {

  /**
   * Property `defaultValue` (`Type<{}>`) storing default value (default: `CardViewTextItemComponent`).
   * @zh 属性 `defaultValue`（类型：`Type<{}>`），用于存储或配置默认值（默认值：`CardViewTextItemComponent`）。
   */
  protected override defaultValue: Type<{}> = CardViewTextItemComponent;

  /**
   * Property `types` (`{ [key: string]: DynamicComponentResolveFunction; }`) storing types.
   * @zh 属性 `types`（类型：`{ [key: string]: DynamicComponentResolveFunction; }`），用于存储或配置类型列表。
   */
  protected override types: { [key: string]: DynamicComponentResolveFunction } = {
    'text': DynamicComponentResolver.fromType(CardViewTextItemComponent),
    'select': DynamicComponentResolver.fromType(CardViewSelectItemComponent),
    'int': DynamicComponentResolver.fromType(CardViewTextItemComponent),
    'float': DynamicComponentResolver.fromType(CardViewTextItemComponent),
    'date': DynamicComponentResolver.fromType(CardViewDateItemComponent),
    'datetime': DynamicComponentResolver.fromType(CardViewDateItemComponent),
    'bool': DynamicComponentResolver.fromType(CardViewBoolItemComponent),
    'map': DynamicComponentResolver.fromType(CardViewMapItemComponent),
    'keyvaluepairs': DynamicComponentResolver.fromType(CardViewKeyValuePairsItemComponent),
    'array': DynamicComponentResolver.fromType(CardViewArrayItemComponent)
  };
}
