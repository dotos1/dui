/**
 * @fileoverview Module `src/ux/query-builder/query-switch-group.directive.ts` providing query switch group directive definitions and implementation.
 * @zh 模块文件 `src/ux/query-builder/query-switch-group.directive.ts`，提供查询切换开关分组指令相关的定义与实现。
 */

import { Directive, TemplateRef } from '@angular/core';

/**
 * Angular directive `QuerySwitchGroupDirective` (selector: '[querySwitchGroup]') attaching query switch group directive behavior to host DOM elements.
 * @zh Angular 指令 `QuerySwitchGroupDirective`（selector: '[querySwitchGroup]'），为宿主 DOM 元素附加查询切换开关分组指令行为。
 */
@Directive({selector: '[querySwitchGroup]'})
export class QuerySwitchGroupDirective {
  /**
   * Creates an instance of `QuerySwitchGroupDirective` and initializes its dependencies and internal state.
   * @zh 创建 `QuerySwitchGroupDirective` 实例，并初始化其依赖项与内部状态。
   * @param template - Injected or initial template (`TemplateRef<unknown>`) / 注入或传入的模板（`TemplateRef<unknown>`）
   */
  constructor(public template: TemplateRef<unknown>) {}
}
