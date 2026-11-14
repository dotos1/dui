/**
 * @fileoverview Module `src/data/datatable/row/row-detail-template.directive.ts` providing row detail template directive definitions and implementation.
 * @zh 模块文件 `src/data/datatable/row/row-detail-template.directive.ts`，提供行详情模板指令相关的定义与实现。
 */

import { Directive, TemplateRef } from '@angular/core';

/**
 * Angular directive `DatatableRowDetailTemplateDirective` (selector: '[dui-datatable-row-detail-template]') attaching datatable row detail template directive behavior to host DOM elements.
 * @zh Angular 指令 `DatatableRowDetailTemplateDirective`（selector: '[dui-datatable-row-detail-template]'），为宿主 DOM 元素附加数据表格行详情模板指令行为。
 */
@Directive({
  selector: '[dui-datatable-row-detail-template]',
  standalone: false
})
export class DatatableRowDetailTemplateDirective {
  /**
   * Creates an instance of `DatatableRowDetailTemplateDirective` and initializes its dependencies and internal state.
   * @zh 创建 `DatatableRowDetailTemplateDirective` 实例，并初始化其依赖项与内部状态。
   * @param template - Injected or initial template (`TemplateRef<unknown>`) / 注入或传入的模板（`TemplateRef<unknown>`）
   */
  constructor(public template: TemplateRef<unknown>) { }
}
