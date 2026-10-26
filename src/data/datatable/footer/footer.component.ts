/**
 * @fileoverview Module `src/data/datatable/footer/footer.component.ts` providing footer component definitions and implementation.
 * @zh 模块文件 `src/data/datatable/footer/footer.component.ts`，提供表尾组件相关的定义与实现。
 */

import { Component, Output, EventEmitter, ChangeDetectionStrategy, Input, ViewChild } from '@angular/core';
import { DatatableFooterDirective } from './footer.directive';
import { DuiPagingBarComponent } from '@dotos/dui/data/paging';
import { MediaService } from '@dotos/dui/common/media';

/**
 * Angular component `DataTableFooterComponent` (selector: 'datatable-footer') providing data table footer component presentation and interaction in `src/data/datatable/footer`.
 * @zh Angular 组件 `DataTableFooterComponent`（selector: 'datatable-footer'），提供数据表格表尾组件的视图渲染与交互逻辑（位于 `src/data/datatable/footer`）。
 */
@Component({
  selector: 'datatable-footer',
  templateUrl: 'footer.component.html',
  host: {
    class: 'datatable-footer'
  },
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DataTableFooterComponent {
  /**
   * Input property `footerHeight` (`number`) configuring footer height.
   * @zh 输入属性 `footerHeight`（类型：`number`），用于配置表尾高度。
   */
  @Input() footerHeight: number;
  /**
   * Input property `rowCount` (`number`) configuring row count.
   * @zh 输入属性 `rowCount`（类型：`number`），用于配置行计数。
   */
  @Input() rowCount: number;
  /**
   * Input property `pageSize` (`number`) configuring page size.
   * @zh 输入属性 `pageSize`（类型：`number`），用于配置页面尺寸。
   */
  @Input() pageSize: number;
  /**
   * Input property `offset` (`number`) configuring offset.
   * @zh 输入属性 `offset`（类型：`number`），用于配置偏移量。
   */
  @Input() offset: number;
  /**
   * Input property `totalMessage` (`string`) configuring total message.
   * @zh 输入属性 `totalMessage`（类型：`string`），用于配置总计消息。
   */
  @Input() totalMessage: string;
  /**
   * Input property `footerTemplate` (`DatatableFooterDirective`) configuring footer template.
   * @zh 输入属性 `footerTemplate`（类型：`DatatableFooterDirective`），用于配置表尾模板。
   */
  @Input() footerTemplate: DatatableFooterDirective;
  /**
   * Input property `pagingConfig` (`any`) configuring paging config.
   * @zh 输入属性 `pagingConfig`（类型：`any`），用于配置页面配置。
   */
  @Input() pagingConfig;
  /**
   * Input property `selectedCount` (`number`) configuring selected count (default: `0`).
   * @zh 输入属性 `selectedCount`（类型：`number`），用于配置已选中计数（默认值：`0`）。
   */
  @Input() selectedCount: number = 0;
  /**
   * Input property `selectedMessage` (`string | boolean`) configuring selected message.
   * @zh 输入属性 `selectedMessage`（类型：`string | boolean`），用于配置已选中消息。
   */
  @Input() selectedMessage: string | boolean;

  /**
   * Output event emitter `page` (`EventEmitter<any>`) firing when page occurs.
   * @zh 输出事件 `page`（类型：`EventEmitter<any>`），当触发页面时向外发出事件。
   */
  @Output() page = new EventEmitter();


  /**
   * Template/content query reference `paging` (`@ViewChild`) targeting paging.
   * @zh 模板/内容视图查询引用 `paging`（`@ViewChild`），指向页面。
   */
  @ViewChild(DuiPagingBarComponent)
  paging: DuiPagingBarComponent;

  /**
   * Creates an instance of `DataTableFooterComponent` and initializes its dependencies and internal state.
   * @zh 创建 `DataTableFooterComponent` 实例，并初始化其依赖项与内部状态。
   * @param media - Injected or initial media (`MediaService`) / 注入或传入的媒体（`MediaService`）
   */
  constructor(
    public media: MediaService) {
  }

  /**
   * Gets the current is visible (`isVisible: boolean`).
   * @zh 获取当前是否为可见（`isVisible: boolean`）。
   */
  get isVisible(): boolean {
    return this.rowCount / this.pageSize > 1;
  }

  /**
   * Gets the current cur page (`curPage: number`).
   * @zh 获取当前当前页面（`curPage: number`）。
   */
  get curPage(): number {
    return this.offset + 1;
  }
}
