/**
 * @fileoverview Module `src/data/datatable/header/group-header-template.directive.ts` providing group header template directive definitions and implementation.
 * @zh 模块文件 `src/data/datatable/header/group-header-template.directive.ts`，提供分组表头模板指令相关的定义与实现。
 */

import { Directive, TemplateRef } from '@angular/core';

/**
 * Angular directive `DatatableGroupHeaderTemplateDirective` (selector: '[dui-datatable-group-header-template]') attaching datatable group header template directive behavior to host DOM elements.
 * @zh Angular 指令 `DatatableGroupHeaderTemplateDirective`（selector: '[dui-datatable-group-header-template]'），为宿主 DOM 元素附加数据表格分组表头模板指令行为。
 */
@Directive({
  selector: '[dui-datatable-group-header-template]'
})
export class DatatableGroupHeaderTemplateDirective {
  /**
   * Creates an instance of `DatatableGroupHeaderTemplateDirective` and initializes its dependencies and internal state.
   * @zh 创建 `DatatableGroupHeaderTemplateDirective` 实例，并初始化其依赖项与内部状态。
   * @param template - Injected or initial template (`TemplateRef<any>`) / 注入或传入的模板（`TemplateRef<any>`）
   */
  constructor(public template: TemplateRef<unknown>) { }
}

