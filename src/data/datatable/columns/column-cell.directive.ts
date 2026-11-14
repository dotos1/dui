/**
 * @fileoverview Module `src/data/datatable/columns/column-cell.directive.ts` providing column cell directive definitions and implementation.
 * @zh 模块文件 `src/data/datatable/columns/column-cell.directive.ts`，提供列单元格指令相关的定义与实现。
 */

import { Directive, TemplateRef } from '@angular/core';

/**
 * Angular directive `DataTableColumnCellDirective` (selector: '[dui-datatable-cell-template]') attaching data table column cell directive behavior to host DOM elements.
 * @zh Angular 指令 `DataTableColumnCellDirective`（selector: '[dui-datatable-cell-template]'），为宿主 DOM 元素附加数据表格列单元格指令行为。
 */
@Directive({ selector: '[dui-datatable-cell-template]', standalone: false })
export class DataTableColumnCellDirective {
  /**
   * Creates an instance of `DataTableColumnCellDirective` and initializes its dependencies and internal state.
   * @zh 创建 `DataTableColumnCellDirective` 实例，并初始化其依赖项与内部状态。
   * @param template - Injected or initial template (`TemplateRef<unknown>`) / 注入或传入的模板（`TemplateRef<unknown>`）
   */
  constructor(public template: TemplateRef<unknown>) { }
}
