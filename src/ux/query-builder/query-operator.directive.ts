/**
 * @fileoverview Module `src/ux/query-builder/query-operator.directive.ts` providing query operator directive definitions and implementation.
 * @zh 模块文件 `src/ux/query-builder/query-operator.directive.ts`，提供查询操作符指令相关的定义与实现。
 */

import { Directive, TemplateRef } from '@angular/core';

/**
 * Angular directive `QueryOperatorDirective` (selector: '[queryOperator]') attaching query operator directive behavior to host DOM elements.
 * @zh Angular 指令 `QueryOperatorDirective`（selector: '[queryOperator]'），为宿主 DOM 元素附加查询操作符指令行为。
 */
@Directive({selector: '[queryOperator]'})
export class QueryOperatorDirective {
  /**
   * Creates an instance of `QueryOperatorDirective` and initializes its dependencies and internal state.
   * @zh 创建 `QueryOperatorDirective` 实例，并初始化其依赖项与内部状态。
   * @param template - Injected or initial template (`TemplateRef<any>`) / 注入或传入的模板（`TemplateRef<any>`）
   */
  constructor(public template: TemplateRef<unknown>) {}
}
