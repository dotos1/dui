/**
 * @fileoverview Module `src/ux/query-builder/query-entity.directive.ts` providing query entity directive definitions and implementation.
 * @zh 模块文件 `src/ux/query-builder/query-entity.directive.ts`，提供查询实体指令相关的定义与实现。
 */

import { Directive, TemplateRef } from '@angular/core';

/**
 * Angular directive `QueryEntityDirective` (selector: '[queryEntity]') attaching query entity directive behavior to host DOM elements.
 * @zh Angular 指令 `QueryEntityDirective`（selector: '[queryEntity]'），为宿主 DOM 元素附加查询实体指令行为。
 */
@Directive({selector: '[queryEntity]'})
export class QueryEntityDirective {
  /**
   * Creates an instance of `QueryEntityDirective` and initializes its dependencies and internal state.
   * @zh 创建 `QueryEntityDirective` 实例，并初始化其依赖项与内部状态。
   * @param template - Injected or initial template (`TemplateRef<unknown>`) / 注入或传入的模板（`TemplateRef<unknown>`）
   */
  constructor(public template: TemplateRef<unknown>) {}
}
