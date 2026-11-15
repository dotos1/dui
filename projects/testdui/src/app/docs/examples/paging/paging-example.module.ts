/**
 * @fileoverview Module `projects/testdui/src/app/docs/examples/paging/paging-example.module.ts` providing paging bar example module definitions and implementation.
 * @zh 模块文件 `projects/testdui/src/app/docs/examples/paging/paging-example.module.ts`，提供分页工具栏（`DuiPagingModule`）可交互示例模块相关的定义与实现。
 */

import { CommonModule } from '@angular/common';
import { Component, NgModule, ChangeDetectionStrategy } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DuiPagingModule, IPageChangeEvent } from '@dotos1/dui/data/paging';
import { HighlightModule } from '@dotos1/dui/ux/highlight';

/**
 * Angular component `PagingExampleComponent` (selector: 'app-paging-example') providing paging bar presentation and interaction.
 * @zh Angular 组件 `PagingExampleComponent`（selector: 'app-paging-example'），提供分页工具栏示例组件的视图渲染与交互逻辑。
 */
@Component({
  selector: 'app-paging-example',
  template: `
    <h2>分页工具栏示例 (dui-paging-bar)</h2>
    <div style="padding:12px 16px; border:1px solid rgba(128,128,128,0.25); border-radius:6px; margin-bottom:12px;">
      <dui-paging-bar
        [firstLast]="true"
        [pageLinkCount]="5"
        [pageSize]="pageSize"
        [total]="total"
        (onChange)="onPageChange($event)">
      </dui-paging-bar>
    </div>
    <p>
      当前页码：<strong>{{ currentEvent?.page || 1 }}</strong> / {{ currentEvent?.maxPage || 10 }}，
      显示行范围：<code>{{ currentEvent?.fromRow || 1 }} - {{ currentEvent?.toRow || pageSize }}</code>（共 {{ total }} 条）
    </p>

    <h3>示例代码</h3>
    <dui-highlight [content]="exampleSource" [codeLang]="'html'" [copyCodeToClipboard]="true"></dui-highlight>
  `,
  standalone: false,
  changeDetection: ChangeDetectionStrategy.Default,
})
export class PagingExampleComponent {
  /**
   * Property `pageSize` (`number`) storing rows per page.
   * @zh 属性 `pageSize`（类型：`number`），用于存储每页记录条数。
   */
  pageSize = 20;

  /**
   * Property `total` (`number`) storing total row count.
   * @zh 属性 `total`（类型：`number`），用于存储总记录条数。
   */
  total = 195;

  /**
   * Property `currentEvent` (`IPageChangeEvent | null`) storing latest pagination event payload.
   * @zh 属性 `currentEvent`（类型：`IPageChangeEvent | null`），用于存储最近一次分页变更事件数据。
   */
  currentEvent: IPageChangeEvent | null = null;

  /**
   * Property `exampleSource` (`string`) storing example source code snippet.
   * @zh 属性 `exampleSource`（类型：`string`），用于存储或配置示例代码片段。
   */
  readonly exampleSource = `<dui-paging-bar
  [firstLast]="true"
  [pageLinkCount]="5"
  [pageSize]="20"
  [total]="195"
  (onChange)="onPageChange($event)">
</dui-paging-bar>`;

  /**
   * Handles page navigation events from `dui-paging-bar`.
   * @zh 处理分页栏发出的页码变更事件。
   * @param event - Pagination change event (`IPageChangeEvent`) / 分页变更事件对象（`IPageChangeEvent`）
   */
  onPageChange(event: IPageChangeEvent): void {
    this.currentEvent = event;
  }
}

/**
 * Constant `routes` defining child routes for the paging example module.
 * @zh 常量 `routes`，定义分页工具栏示例模块的子路由。
 */
const routes: Routes = [{ path: '', component: PagingExampleComponent }];

/**
 * Angular module `PagingExampleModule` declaring and exporting the paging interactive example.
 * @zh Angular 模块 `PagingExampleModule`，声明并导出分页工具栏可交互示例组件。
 */
@NgModule({
  declarations: [PagingExampleComponent],
  imports: [CommonModule, DuiPagingModule, HighlightModule, RouterModule.forChild(routes)],
})
export class PagingExampleModule {}
