/**
 * @fileoverview Module `src/data/datatable/footer/footer-template.directive.ts` providing footer template directive definitions and implementation.
 * @zh 模块文件 `src/data/datatable/footer/footer-template.directive.ts`，提供表尾模板指令相关的定义与实现。
 */

import { Directive, TemplateRef } from '@angular/core';

/**
 * Angular directive `DataTableFooterTemplateDirective` (selector: '[dui-datatable-footer-template]') attaching data table footer template directive behavior to host DOM elements.
 * @zh Angular 指令 `DataTableFooterTemplateDirective`（selector: '[dui-datatable-footer-template]'），为宿主 DOM 元素附加数据表格表尾模板指令行为。
 */
@Directive({ selector: '[dui-datatable-footer-template]', standalone: false })
export class DataTableFooterTemplateDirective {
  /**
   * Creates an instance of `DataTableFooterTemplateDirective` and initializes its dependencies and internal state.
   * @zh 创建 `DataTableFooterTemplateDirective` 实例，并初始化其依赖项与内部状态。
   * @param template - Injected or initial template (`TemplateRef<unknown>`) / 注入或传入的模板（`TemplateRef<unknown>`）
   */
  constructor(public template: TemplateRef<unknown>) { }
}
