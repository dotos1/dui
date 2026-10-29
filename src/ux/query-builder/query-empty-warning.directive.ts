/**
 * @fileoverview Module `src/ux/query-builder/query-empty-warning.directive.ts` providing query empty warning directive definitions and implementation.
 * @zh 模块文件 `src/ux/query-builder/query-empty-warning.directive.ts`，提供查询空警告指令相关的定义与实现。
 */

import { Directive, TemplateRef } from '@angular/core';

/**
 * Angular directive `QueryEmptyWarningDirective` (selector: '[queryEmptyWarning]') attaching query empty warning directive behavior to host DOM elements.
 * @zh Angular 指令 `QueryEmptyWarningDirective`（selector: '[queryEmptyWarning]'），为宿主 DOM 元素附加查询空警告指令行为。
 */
@Directive({selector: '[queryEmptyWarning]'})
export class QueryEmptyWarningDirective {
  /**
   * Creates an instance of `QueryEmptyWarningDirective` and initializes its dependencies and internal state.
   * @zh 创建 `QueryEmptyWarningDirective` 实例，并初始化其依赖项与内部状态。
   * @param template - Injected or initial template (`TemplateRef<unknown>`) / 注入或传入的模板（`TemplateRef<unknown>`）
   */
  constructor(public template: TemplateRef<unknown>) {}
}
