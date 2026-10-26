/**
 * @fileoverview Module `src/ux/query-builder/query-arrow-icon.directive.ts` providing query arrow icon directive definitions and implementation.
 * @zh 模块文件 `src/ux/query-builder/query-arrow-icon.directive.ts`，提供查询箭头图标指令相关的定义与实现。
 */

import { Directive, TemplateRef } from '@angular/core';

/**
 * Angular directive `QueryArrowIconDirective` (selector: '[queryArrowIcon]') attaching query arrow icon directive behavior to host DOM elements.
 * @zh Angular 指令 `QueryArrowIconDirective`（selector: '[queryArrowIcon]'），为宿主 DOM 元素附加查询箭头图标指令行为。
 */
@Directive({selector: '[queryArrowIcon]'})
export class QueryArrowIconDirective {
  /**
   * Creates an instance of `QueryArrowIconDirective` and initializes its dependencies and internal state.
   * @zh 创建 `QueryArrowIconDirective` 实例，并初始化其依赖项与内部状态。
   * @param template - Injected or initial template (`TemplateRef<any>`) / 注入或传入的模板（`TemplateRef<any>`）
   */
  constructor(public template: TemplateRef<unknown>) {}
}
