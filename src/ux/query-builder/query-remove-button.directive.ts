/**
 * @fileoverview Module `src/ux/query-builder/query-remove-button.directive.ts` providing query remove button directive definitions and implementation.
 * @zh 模块文件 `src/ux/query-builder/query-remove-button.directive.ts`，提供查询移除按钮指令相关的定义与实现。
 */

import { Directive, TemplateRef } from '@angular/core';

/**
 * Angular directive `QueryRemoveButtonDirective` (selector: '[queryRemoveButton]') attaching query remove button directive behavior to host DOM elements.
 * @zh Angular 指令 `QueryRemoveButtonDirective`（selector: '[queryRemoveButton]'），为宿主 DOM 元素附加查询移除按钮指令行为。
 */
@Directive({selector: '[queryRemoveButton]'})
export class QueryRemoveButtonDirective {
  /**
   * Creates an instance of `QueryRemoveButtonDirective` and initializes its dependencies and internal state.
   * @zh 创建 `QueryRemoveButtonDirective` 实例，并初始化其依赖项与内部状态。
   * @param template - Injected or initial template (`TemplateRef<any>`) / 注入或传入的模板（`TemplateRef<any>`）
   */
  constructor(public template: TemplateRef<unknown>) {}
}
