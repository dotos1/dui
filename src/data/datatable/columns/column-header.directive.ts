/**
 * @fileoverview Module `src/data/datatable/columns/column-header.directive.ts` providing column header directive definitions and implementation.
 * @zh 模块文件 `src/data/datatable/columns/column-header.directive.ts`，提供列表头指令相关的定义与实现。
 */

import { Directive, TemplateRef } from '@angular/core';

/**
 * Angular directive `DataTableColumnHeaderDirective` (selector: '[dui-datatable-header-template]') attaching data table column header directive behavior to host DOM elements.
 * @zh Angular 指令 `DataTableColumnHeaderDirective`（selector: '[dui-datatable-header-template]'），为宿主 DOM 元素附加数据表格列表头指令行为。
 */
@Directive({ selector: '[dui-datatable-header-template]', standalone: false })
export class DataTableColumnHeaderDirective {
  /**
   * Creates an instance of `DataTableColumnHeaderDirective` and initializes its dependencies and internal state.
   * @zh 创建 `DataTableColumnHeaderDirective` 实例，并初始化其依赖项与内部状态。
   * @param template - Injected or initial template (`TemplateRef<unknown>`) / 注入或传入的模板（`TemplateRef<unknown>`）
   */
  constructor(public template: TemplateRef<unknown>) { }
}
