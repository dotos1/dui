/**
 * @fileoverview Module `src/data/datatable/row/row-detail.directive.ts` providing row detail directive definitions and implementation.
 * @zh 模块文件 `src/data/datatable/row/row-detail.directive.ts`，提供行详情指令相关的定义与实现。
 */

import { Input, Output, EventEmitter, Directive, TemplateRef, ContentChild } from '@angular/core';
import { DatatableRowDetailTemplateDirective } from './row-detail-template.directive';

/**
 * Angular directive `DatatableRowDetailDirective` (selector: 'dui-datatable-row-detail') attaching datatable row detail directive behavior to host DOM elements.
 * @zh Angular 指令 `DatatableRowDetailDirective`（selector: 'dui-datatable-row-detail'），为宿主 DOM 元素附加数据表格行详情指令行为。
 */
@Directive({ selector: 'dui-datatable-row-detail' })
export class DatatableRowDetailDirective {

  /**
   * Input property `rowHeight` (`number | ((row?: any, index?: number) => number)`) configuring row height (default: `0`).
   * @zh 输入属性 `rowHeight`（类型：`number | ((row?: any, index?: number) => number)`），用于配置行高度（默认值：`0`）。
   */
  @Input() rowHeight = 0;

  /**
   * Input property `template` (`TemplateRef<any>`) configuring template input.
   * @zh 输入属性 `template`（类型：`TemplateRef<any>`），用于配置模板输入属性。
   */
  @Input('template')
  _templateInput: TemplateRef<unknown>;

  /**
   * Template/content query reference `_templateQuery` (`@ContentChild`) targeting template query.
   * @zh 模板/内容视图查询引用 `_templateQuery`（`@ContentChild`），指向模板查询。
   */
  @ContentChild(DatatableRowDetailTemplateDirective, { read: TemplateRef, static: true })
  _templateQuery: TemplateRef<unknown>;

  /**
   * Gets the current template (`template: TemplateRef<any>`).
   * @zh 获取当前模板（`template: TemplateRef<any>`）。
   */
  get template(): TemplateRef<unknown> {
    return this._templateInput || this._templateQuery;
  }

  /**
   * Row detail row visbility was toggled.

   * @zh 输出事件 `toggle`（类型：`EventEmitter<any>`），当触发开关时向外发出事件。
   */
  @Output() toggle = new EventEmitter();

  /**
   * Toggle the expansion of the row

   * @zh 执行 `toggleExpandRow`，用于开关展开行。
   */
  toggleExpandRow(row): void {
    this.toggle.emit({
      type: 'row',
      value: row
    });
  }

  /**
   * API method to expand all the rows.

   * @zh 执行 `expandAllRows`，用于展开全部行列表。
   */
  expandAllRows(): void {
    this.toggle.emit({
      type: 'all',
      value: true
    });
  }

  /**
   * API method to collapse all the rows.

   * @zh 执行 `collapseAllRows`，用于折叠全部行列表。
   */
  collapseAllRows(): void {
    this.toggle.emit({
      type: 'all',
      value: false
    });
  }
}
