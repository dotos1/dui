/**
 * @fileoverview Module `src/data/datatable/header/group-header.directive.ts` providing group header directive definitions and implementation.
 * @zh 模块文件 `src/data/datatable/header/group-header.directive.ts`，提供分组表头指令相关的定义与实现。
 */

import { Input, Output, EventEmitter, Directive, TemplateRef, ContentChild } from '@angular/core';
import { DatatableGroupHeaderTemplateDirective } from './group-header-template.directive';

/**
 * Angular directive `DatatableGroupHeaderDirective` (selector: 'dui-datatable-group-header') attaching datatable group header directive behavior to host DOM elements.
 * @zh Angular 指令 `DatatableGroupHeaderDirective`（selector: 'dui-datatable-group-header'），为宿主 DOM 元素附加数据表格分组表头指令行为。
 */
@Directive({ selector: 'dui-datatable-group-header' })
export class DatatableGroupHeaderDirective {

  /**
   * Input property `rowHeight` (`number`) configuring row height (default: `0`).
   * @zh 输入属性 `rowHeight`（类型：`number`），用于配置行高度（默认值：`0`）。
   */
  @Input() rowHeight = 0;

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
  @ContentChild(DatatableGroupHeaderTemplateDirective, { read: TemplateRef, static: true })
  _templateQuery: TemplateRef<unknown>;

  /**
   * Gets the current template (`template: TemplateRef<any>`).
   * @zh 获取当前模板（`template: TemplateRef<any>`）。
   */
  get template(): TemplateRef<unknown> {
    return this._templateInput || this._templateQuery;
  }

  /**
   * Track toggling of group visibility

   * @zh 输出事件 `toggle`（类型：`EventEmitter<any>`），当触发开关时向外发出事件。
   */
  @Output() toggle = new EventEmitter();

  /**
   * Toggle the expansion of a group

   * @zh 执行 `toggleExpandGroup`，用于开关展开分组。
   */
  toggleExpandGroup(group): void {
    this.toggle.emit({
      type: 'group',
      value: group
    });
  }

  /**
   * Expand all groups

   * @zh 执行 `expandAllGroups`，用于展开全部分组。
   */
  expandAllGroups(): void {
    this.toggle.emit({
      type: 'all',
      value: true
    });
  }

  /**
   * Collapse all groups

   * @zh 执行 `collapseAllGroups`，用于折叠全部分组。
   */
  collapseAllGroups(): void {
    this.toggle.emit({
      type: 'all',
      value: false
    });
  }
}
