/**
 * @fileoverview Module `src/ux/query-builder/query-button-group.directive.ts` providing query button group directive definitions and implementation.
 * @zh 模块文件 `src/ux/query-builder/query-button-group.directive.ts`，提供查询按钮分组指令相关的定义与实现。
 */

import { Directive, TemplateRef } from '@angular/core';

/**
 * Angular directive `QueryButtonGroupDirective` (selector: '[queryButtonGroup]') attaching query button group directive behavior to host DOM elements.
 * @zh Angular 指令 `QueryButtonGroupDirective`（selector: '[queryButtonGroup]'），为宿主 DOM 元素附加查询按钮分组指令行为。
 */
@Directive({selector: '[queryButtonGroup]'})
export class QueryButtonGroupDirective {
  /**
   * Creates an instance of `QueryButtonGroupDirective` and initializes its dependencies and internal state.
   * @zh 创建 `QueryButtonGroupDirective` 实例，并初始化其依赖项与内部状态。
   * @param template - Injected or initial template (`TemplateRef<unknown>`) / 注入或传入的模板（`TemplateRef<unknown>`）
   */
  constructor(public template: TemplateRef<unknown>) {}
}
