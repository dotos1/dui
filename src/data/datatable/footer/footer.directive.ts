/**
 * @fileoverview Module `src/data/datatable/footer/footer.directive.ts` providing footer directive definitions and implementation.
 * @zh 模块文件 `src/data/datatable/footer/footer.directive.ts`，提供表尾指令相关的定义与实现。
 */

import { Input, Directive, TemplateRef, ContentChild } from '@angular/core';
import { DataTableFooterTemplateDirective } from './footer-template.directive';

/**
 * Angular directive `DatatableFooterDirective` (selector: 'dui-datatable-footer') attaching datatable footer directive behavior to host DOM elements.
 * @zh Angular 指令 `DatatableFooterDirective`（selector: 'dui-datatable-footer'），为宿主 DOM 元素附加数据表格表尾指令行为。
 */
@Directive({ selector: 'dui-datatable-footer' })
export class DatatableFooterDirective {
  /**
   * Input property `footerHeight` (`number`) configuring footer height.
   * @zh 输入属性 `footerHeight`（类型：`number`），用于配置表尾高度。
   */
  @Input() footerHeight: number;
  /**
   * Input property `totalMessage` (`string`) configuring total message.
   * @zh 输入属性 `totalMessage`（类型：`string`），用于配置总计消息。
   */
  @Input() totalMessage: string;
  /**
   * Input property `selectedMessage` (`string | boolean`) configuring selected message.
   * @zh 输入属性 `selectedMessage`（类型：`string | boolean`），用于配置已选中消息。
   */
  @Input() selectedMessage: string | boolean;

  /**
   * Input property `template` (`TemplateRef<any>`) configuring template input.
   * @zh 输入属性 `template`（类型：`TemplateRef<any>`），用于配置模板输入属性。
   */
  @Input('template')
  _templateInput: TemplateRef<unknown>;

  /**
   * Template/content query reference `_templateQuery` (`TemplateRef<unknown>`) targeting template query.
   * @zh 模板/内容视图查询引用 `_templateQuery`（`@ContentChild`），指向模板查询。
   */
  @ContentChild(DataTableFooterTemplateDirective, { read: TemplateRef })
  _templateQuery: TemplateRef<unknown>;

  /**
   * Gets the current template (`template: TemplateRef<any>`).
   * @zh 获取当前模板（`template: TemplateRef<any>`）。
   */
  get template(): TemplateRef<unknown> {
    return this._templateInput || this._templateQuery;
  }
}
