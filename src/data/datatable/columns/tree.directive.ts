/**
 * @fileoverview Module `src/data/datatable/columns/tree.directive.ts` providing tree directive definitions and implementation.
 * @zh 模块文件 `src/data/datatable/columns/tree.directive.ts`，提供树形控件指令相关的定义与实现。
 */

import { Directive, TemplateRef } from '@angular/core';

/**
 * Angular directive `DataTableColumnCellTreeToggle` (selector: '[dui-datatable-tree-toggle]') attaching data table column cell tree toggle behavior to host DOM elements.
 * @zh Angular 指令 `DataTableColumnCellTreeToggle`（selector: '[dui-datatable-tree-toggle]'），为宿主 DOM 元素附加数据表格列单元格树形控件开关行为。
 */
@Directive({ selector: '[dui-datatable-tree-toggle]' })
export class DataTableColumnCellTreeToggle {
  /**
   * Creates an instance of `DataTableColumnCellTreeToggle` and initializes its dependencies and internal state.
   * @zh 创建 `DataTableColumnCellTreeToggle` 实例，并初始化其依赖项与内部状态。
   * @param template - Injected or initial template (`TemplateRef<unknown>`) / 注入或传入的模板（`TemplateRef<unknown>`）
   */
  constructor(public template: TemplateRef<unknown>) { }
}
