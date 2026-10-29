/**
 * @fileoverview Module `src/ux/query-builder/query-field.directive.ts` providing query field directive definitions and implementation.
 * @zh 模块文件 `src/ux/query-builder/query-field.directive.ts`，提供查询字段指令相关的定义与实现。
 */

import { Directive, TemplateRef } from '@angular/core';

/**
 * Angular directive `QueryFieldDirective` (selector: '[queryField]') attaching query field directive behavior to host DOM elements.
 * @zh Angular 指令 `QueryFieldDirective`（selector: '[queryField]'），为宿主 DOM 元素附加查询字段指令行为。
 */
@Directive({selector: '[queryField]'})
export class QueryFieldDirective {
  /**
   * Creates an instance of `QueryFieldDirective` and initializes its dependencies and internal state.
   * @zh 创建 `QueryFieldDirective` 实例，并初始化其依赖项与内部状态。
   * @param template - Injected or initial template (`TemplateRef<unknown>`) / 注入或传入的模板（`TemplateRef<unknown>`）
   */
  constructor(public template: TemplateRef<unknown>) {}
}
