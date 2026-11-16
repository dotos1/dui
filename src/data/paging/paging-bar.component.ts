/**
 * @fileoverview Module `src/data/paging/paging-bar.component.ts` providing paging bar component definitions and implementation.
 * @zh 模块文件 `src/data/paging/paging-bar.component.ts`，提供页面条组件相关的定义与实现。
 */

import { Component, Input, Output, EventEmitter, Optional, Injector } from '@angular/core';
import { ChangeDetectionStrategy } from '@angular/core'
import { coerceNumberProperty } from '@angular/cdk/coercion';
import { Dir } from '@angular/cdk/bidi';
import { MediaService } from '@dotos1/dui/common/media';

/**
 * Interface `IPageChangeEvent` defining the contract and properties for i page change event.
 * @zh 接口 `IPageChangeEvent`，定义I页面变更事件的数据结构契约与属性规范。
 */
export interface IPageChangeEvent {
  /**
   * Property `page` (`number`) storing page.
   * @zh 属性 `page`（类型：`number`），用于存储或配置页面。
   */
  page: number;
  /**
   * Property `maxPage` (`number`) storing max page.
   * @zh 属性 `maxPage`（类型：`number`），用于存储或配置最大值页面。
   */
  maxPage: number;
  /**
   * Property `pageSize` (`number`) storing page size.
   * @zh 属性 `pageSize`（类型：`number`），用于存储或配置页面尺寸。
   */
  pageSize: number;
  /**
   * Property `total` (`number`) storing total.
   * @zh 属性 `total`（类型：`number`），用于存储或配置总计。
   */
  total: number;
  /**
   * Property `fromRow` (`number`) storing from row.
   * @zh 属性 `fromRow`（类型：`number`），用于存储或配置从行。
   */
  fromRow: number;
  /**
   * Property `toRow` (`number`) storing to row.
   * @zh 属性 `toRow`（类型：`number`），用于存储或配置转换为行。
   */
  toRow: number;
}

/**
 * Angular component `DuiPagingBarComponent` (selector: 'dui-paging-bar') providing dui paging bar component presentation and interaction in `src/data/paging`.
 * @zh Angular 组件 `DuiPagingBarComponent`（selector: 'dui-paging-bar'），提供DUI页面条组件的视图渲染与交互逻辑（位于 `src/data/paging`）。
 */
@Component({
  selector: 'dui-paging-bar',
  templateUrl: './paging-bar.component.html',
  styleUrls: ['./paging-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})
export class DuiPagingBarComponent {


  /**
   * Property `_pageSize` (`number`) storing page size (default: `50`).
   * @zh 属性 `_pageSize`（类型：`number`），用于存储或配置页面尺寸（默认值：`50`）。
   */
  private _pageSize: number = 50;
  /**
   * Property `_total` (`number`) storing total (default: `0`).
   * @zh 属性 `_total`（类型：`number`），用于存储或配置总计（默认值：`0`）。
   */
  private _total: number = 0;
  /**
   * Property `_page` (`number`) storing page (default: `1`).
   * @zh 属性 `_page`（类型：`number`），用于存储或配置页面（默认值：`1`）。
   */
  private _page: number = 1;
  /**
   * Property `_fromRow` (`number`) storing from row (default: `1`).
   * @zh 属性 `_fromRow`（类型：`number`），用于存储或配置从行（默认值：`1`）。
   */
  private _fromRow: number = 1;
  /**
   * Property `_toRow` (`number`) storing to row (default: `1`).
   * @zh 属性 `_toRow`（类型：`number`），用于存储或配置转换为行（默认值：`1`）。
   */
  private _toRow: number = 1;
  /**
   * Property `_initialized` (`boolean`) storing initialized (default: `false`).
   * @zh 属性 `_initialized`（类型：`boolean`），用于存储或配置已初始化（默认值：`false`）。
   */
  private _initialized: boolean = false;
  /**
   * Property `_pageLinks` (`number[]`) storing page links (default: `[]`).
   * @zh 属性 `_pageLinks`（类型：`number[]`），用于存储或配置页面链接（默认值：`[]`）。
   */
  private _pageLinks: number[] = [];
  /**
   * Property `_pageLinkCount` (`number`) storing page link count (default: `0`).
   * @zh 属性 `_pageLinkCount`（类型：`number`），用于存储或配置页面链接计数（默认值：`0`）。
   */
  private _pageLinkCount: number = 0;
  // special case when 2 pageLinks, detect when hit end of pages so can lead in correct direction
  /**
   * Property `_hitEnd` (`boolean`) storing hit end (default: `false`).
   * @zh 属性 `_hitEnd`（类型：`boolean`），用于存储或配置hit结束（默认值：`false`）。
   */
  private _hitEnd: boolean = false;

  /**
   * Property `_hitStart` (`boolean`) storing hit start (default: `false`).
   * @zh 属性 `_hitStart`（类型：`boolean`），用于存储或配置hit开始（默认值：`false`）。
   */
  private _hitStart: boolean = false;

  /**
   * @cfg {String} displayMsg
   * The paging status message to display (defaults to <tt>'Displaying {0} - {1} of {2}'</tt>).
   * Note that this string is formatted using the braced numbers <tt>{0}-{2}</tt> as tokens
   * that are replaced by the values for start, end and total respectively. These tokens should
   * be preserved when overriding this string if showing those values is desired.

   * @zh 属性 `displayMsg`（类型：`string`），用于存储或配置displayMsg（默认值：`'Displaying {0} - {1} of {2}'`）。
   */
  public displayMsg = 'Displaying {0} - {1} of {2}';
  /**
   * @cfg {String} emptyMsg
   * The message to display when no records are found (defaults to 'No data to display')

   * @zh 属性 `emptyMsg`（类型：`string`），用于存储或配置空Msg（默认值：`'No data to display'`）。
   */
  public emptyMsg = 'No data to display';
  /**
   * @cfg {String} beforePageText
   * The text displayed before the input item (defaults to <tt>'Page'</tt>).

   * @zh 属性 `beforePageText`（类型：`string`），用于存储或配置之前页面文本（默认值：`'Page'`）。
   */
  public beforePageText = 'Page';
  /**
   * @cfg {String} afterPageText
   * Customizable piece of the default paging text (defaults to <tt>'of {0}'</tt>). Note that
   * this string is formatted using <tt>{0}</tt> as a token that is replaced by the number of
   * total pages. This token should be preserved when overriding this string if showing the
   * total page count is desired.

   * @zh 属性 `afterPageText`（类型：`"of {0}"`），用于存储或配置之后页面文本。
   */
  public afterPageText: 'of {0}';


  /**
   * Property `freshDisable` (`boolean`) storing fresh disable (default: `false`).
   * @zh 属性 `freshDisable`（类型：`boolean`），用于存储或配置fresh禁用（默认值：`false`）。
   */
  public freshDisable: boolean = false;
  /**
   * firstLast?: boolean
   * Shows or hides the first and last page buttons of the paging bar. Defaults to 'false'

   * @zh 输入属性 `firstLast`（类型：`boolean`），用于配置首个末尾（默认值：`true`）。
   */
  @Input('firstLast') firstLast: boolean = true;

  /**
   * initialPage?: number
   * Sets starting page for the paging bar. Defaults to '1'

   * @zh 输入属性 `initialPage`（类型：`number`），用于配置初始页面（默认值：`1`）。
   */
  @Input('initialPage') initialPage: number = 1;

  /**
   * pageLinkCount?: number
   * Amount of page navigation links for the paging bar. Defaults to '0'

   * @zh 输入属性 `pageLinkCount` 的设置器，用于更新页面链接计数。
   */
  @Input('pageLinkCount')
  set pageLinkCount(pageLinkCount: number) {
    this._pageLinkCount = coerceNumberProperty(pageLinkCount);
    this._calculatePageLinks();
  }
  /**
   * Gets the current page link count (`pageLinkCount: number`).
   * @zh 获取当前页面链接计数（`pageLinkCount: number`）。
   */
  get pageLinkCount(): number {
    return this._pageLinkCount;
  }

  /**
   * pageSize?: number
   * Selected page size for the pagination. Defaults 50.

   * @zh 输入属性 `pageSize` 的设置器，用于更新页面尺寸。
   */
  @Input('pageSize')
  set pageSize(pageSize: number) {
    this._pageSize = coerceNumberProperty(pageSize);
    this._page = 1;
    if (this._initialized) {
      this._handleOnChange();
    }
  }
  /**
   * Gets the current page size (`pageSize: number`).
   * @zh 获取当前页面尺寸（`pageSize: number`）。
   */
  get pageSize(): number {
    return this._pageSize;
  }

  /**
   * total: number
   * Total rows for the pagination.

   * @zh 输入属性 `total` 的设置器，用于更新总计。
   */
  @Input('total')
  set total(total: number) {
    this._total = coerceNumberProperty(total);
    this._calculateRows();
    this._calculatePageLinks();
  }
  /**
   * Gets the current total (`total: number`).
   * @zh 获取当前总计（`total: number`）。
   */
  get total(): number {
    return this._total;
  }

  /**
   * pageLinks: number[]
   * Returns the pageLinks in an array

   * @zh 获取当前页面链接（`pageLinks: number[]`）。
   */
  get pageLinks(): number[] {
    return this._pageLinks;
  }

  /**
   * range: string
   * Returns the range of the rows.

   * @zh 获取当前范围（`range: string`）。
   */
  get range(): string {
    return `${!this._toRow ? 0 : this._fromRow}-${this._toRow}`;
  }

  /**
   * Sets the page (`page`).
   * @zh 设置页面（`page`）。
   * @param page - New page value (`number`) / 新的页面值（`number`）
   */
  set page(page: number) {
    this._page = page;
  }

  /**
   * page: number
   * Returns the current page.

   * @zh 获取当前页面（`page: number`）。
   */
  get page(): number {
    return this._page;
  }

  /**
   * page: number
   * Returns the max page for the current pageSize and total.

   * @zh 获取当前最大值页面（`maxPage: number`）。
   */
  get maxPage(): number {
    return Math.ceil(this._total / this._pageSize);
  }

  /**
   * change?: function
   * Method to be executed when page size changes or any button is clicked in the paging bar.
   * Emits an [IPageChangeEvent] implemented object.

   * @zh 输出事件 `change`（类型：`EventEmitter<IPageChangeEvent>`），当触发当变更时向外发出事件。
   */
  @Output('change') onChange: EventEmitter<IPageChangeEvent> = new EventEmitter<IPageChangeEvent>();

  /**
   * Gets the current is rtl (`isRTL: boolean`).
   * @zh 获取当前是否为RTL（`isRTL: boolean`）。
   */
  get isRTL(): boolean {
    if (this._dir) {
      return this._dir.dir === 'rtl';
    }
    return false;
  }


  /**
   * Creates an instance of `DuiPagingBarComponent` and initializes its dependencies and internal state.
   * @zh 创建 `DuiPagingBarComponent` 实例，并初始化其依赖项与内部状态。
   * @param resolver - Injected or initial resolver (`ComponentFactoryResolver`) / 注入或传入的解析器（`ComponentFactoryResolver`）
   * @param injector - Injected or initial injector (`Injector`) / 注入或传入的注入器（`Injector`）
   * @param media - Injected or initial media (`MediaService`) / 注入或传入的媒体（`MediaService`）
   * @param _dir - Injected or initial dir (`Dir`) / 注入或传入的目录（`Dir`）
   */
  constructor(
    public injector: Injector,
    public media: MediaService,
    @Optional() private _dir: Dir) {
  }

  /**
   * Angular lifecycle hook invoked once after component or directive inputs are initialized.
   * @zh Angular 生命周期钩子：在组件或指令的输入属性初始化完成后调用一次。
   */
  ngOnInit(): void {
    this._page = coerceNumberProperty(this.initialPage);
    this._calculateRows();
    this._calculatePageLinks();
    this._initialized = true;
  }



  /**
   * Executes `navigateToPage` to handle navigate to page.
   * @zh 执行 `navigateToPage`，用于导航转换为页面。
   * @param page - page parameter (`number`) / 页面参数（`number`）
   * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
   */
  navigateToPage(page: number): boolean {
    if (page === 1 || (page >= 1 && page <= this.maxPage)) {
      this._page = coerceNumberProperty(Math.floor(page));
      this._handleOnChange();
      return true;
    }
    return false;
  }


  /**
   * Executes `firstPage` to handle first page.
   * @zh 执行 `firstPage`，用于首个页面。
   * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
   */
  firstPage(): boolean {
    return this.navigateToPage(1);
  }

  /**
   * Executes `prevPage` to handle prev page.
   * @zh 执行 `prevPage`，用于前一个页面。
   * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
   */
  prevPage(): boolean {
    return this.navigateToPage(this._page - 1);
  }

  /**
   * Executes `nextPage` to handle next page.
   * @zh 执行 `nextPage`，用于下一个页面。
   * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
   */
  nextPage(): boolean {
    return this.navigateToPage(this._page + 1);
  }

  /**
   * Executes `lastPage` to handle last page.
   * @zh 执行 `lastPage`，用于末尾页面。
   * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
   */
  lastPage(): boolean {
    return this.navigateToPage(this.maxPage);
  }

  /**
   * Executes `isMinPage` to handle is min page.
   * @zh 执行 `isMinPage`，用于是否为最小值页面。
   * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
   */
  isMinPage(): boolean {
    return this._page <= 1;
  }

  /**
   * Executes `isMaxPage` to handle is max page.
   * @zh 执行 `isMaxPage`，用于是否为最大值页面。
   * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
   */
  isMaxPage(): boolean {
    return this._page >= this.maxPage;
  }

  /**
   * Refresh the current page, has the same effect as clicking the 'refresh' button.

   * @zh 执行 `doRefresh`，用于执行刷新。
   */
  public doRefresh() {
    this.navigateToPage(this._page);
  };


  /**
   * Executes `_calculateRows` to handle calculate rows.
   * @zh 执行 `_calculateRows`，用于计算行列表。
   */
  private _calculateRows(): void {
    let top: number = (this._pageSize * this._page);
    this._fromRow = (this._pageSize * (this._page - 1));
    this._toRow = this._total > top ? top : this._total;
  }
  /**
   * _calculatePageLinks?: function
   * Calculates the page links that should be shown to the user based on the current state of the paginator

   * @zh 执行 `_calculatePageLinks`，用于计算页面链接。
   */
  private _calculatePageLinks(): void {
    // special case when 2 pageLinks, detect when hit end of pages so can lead in correct direction
    if (this.isMaxPage()) {
      this._hitEnd = true;
      this._hitStart = false;
    }
    // special case when 2 pageLinks, detect when hit start of pages so can lead in correct direction
    if (this.isMinPage()) {
      this._hitEnd = false;
      this._hitStart = true;
    }
    // If the pageLinkCount goes above max possible pages based on perpage setting then reset it to maxPage
    let actualPageLinkCount: number = this.pageLinkCount;
    if (this.pageLinkCount > this.maxPage) {
      actualPageLinkCount = this.maxPage;
    }
    // reset the pageLinks array
    this._pageLinks = [];
    // fill in the array with the pageLinks based on the current selected page
    let middlePageLinks: number = Math.floor(actualPageLinkCount / 2);
    for (let x: number = 0; x < actualPageLinkCount; x++) {
      // don't go past the maxPage in the pageLinks
      // have to handle even and odd pageLinkCounts differently so can still lead to the next numbers
      if ((actualPageLinkCount % 2 === 0 && (this.page + middlePageLinks > this.maxPage)) ||
        (actualPageLinkCount % 2 !== 0 && (this.page + middlePageLinks >= this.maxPage))) {
        this._pageLinks[x] = this.maxPage - (actualPageLinkCount - (x + 1));
      } else if ((actualPageLinkCount > 2 || actualPageLinkCount <= 2 && this._hitEnd) && (this.page - middlePageLinks) > 0) {
        this._pageLinks[x] = (this.page - middlePageLinks) + x;
      } else if ((this.page - middlePageLinks) <= 0) {
        this._pageLinks[x] = x + 1;
        // other wise just set the array in order starting from the selected page
      } else {
        this._pageLinks[x] = this.page + x;
      }
    }
  }

  /**
   * Executes `_handleOnChange` to handle handle on change.
   * @zh 执行 `_handleOnChange`，用于连接手柄当变更。
   */
  private _handleOnChange(): void {
    this._calculateRows();
    this._calculatePageLinks();
    let event: IPageChangeEvent = {
      page: this._page,
      maxPage: this.maxPage,
      pageSize: this._pageSize,
      total: this._total,
      fromRow: this._fromRow,
      toRow: this._toRow,
    };
    this.onChange.emit(event);
  }
}
