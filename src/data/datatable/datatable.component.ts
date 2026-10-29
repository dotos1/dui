/**
 * @fileoverview Module `src/data/datatable/datatable.component.ts` providing datatable component definitions and implementation.
 * @zh 模块文件 `src/data/datatable/datatable.component.ts`，提供数据表格组件相关的定义与实现。
 */

import { DuiConfig } from '@dotos/dui/base';
import {
  Component, Input, Output, ElementRef, EventEmitter, ViewChild,
  HostListener, ContentChildren, OnInit, QueryList, AfterViewInit,
  HostBinding, ContentChild, SimpleChanges,
  DoCheck, KeyValueDiffers, KeyValueDiffer, ViewEncapsulation,
  ChangeDetectionStrategy, ChangeDetectorRef, SkipSelf, AfterContentInit, OnChanges, OnDestroy,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  forceFillColumnWidths, adjustColumnWidths, sortRows,
  setColumnDefaults, translateTemplates,
  groupRowsByParents, optionalGetterForProp
} from './utils/index';
import { ScrollbarHelper, DimensionsHelper, ColumnChangesService } from './services/index';
import { ColumnMode, SortType, SelectionType, TableColumn, ContextmenuType } from './types/index';
import { DataTableBodyComponent } from './body/body.component';
import { DatatableGroupHeaderDirective } from './header/group-header.directive';
import { DataTableColumnDirective } from './columns/column.directive';
import { DatatableRowDetailDirective } from './row/row-detail.directive';
import { DatatableFooterDirective } from './footer/footer.directive';
import { DataTableHeaderComponent } from './header/header.component';
import { DatatableCardComponent } from './datatable.card';
import { BehaviorSubject, Subscription } from 'rxjs';
import { TranslateService } from '@dotos/dui/translator';
import { Dui } from '@dotos/dui/core';
import { throttleable } from './utils/throttle';

/**
 * Angular component `DatatableComponent` (selector: 'dui-datatable') providing datatable component presentation and interaction in `src/data/datatable`.
 * @zh Angular 组件 `DatatableComponent`（selector: 'dui-datatable'），提供数据表格组件的视图渲染与交互逻辑（位于 `src/data/datatable`）。
 */
@Component({
  selector: 'dui-datatable',
  templateUrl: 'datatable.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./datatable.component.scss'],
  host: {
    class: 'dui-datatable'
  }
})


export class DatatableComponent implements OnInit, DoCheck,AfterContentInit,OnDestroy,OnChanges, AfterViewInit {

  /**
   * Input property `config` (`any`) configuring config (default: `{}`).
   * @zh 输入属性 `config`（类型：`any`），用于配置配置（默认值：`{}`）。
   */
  @Input() config: DuiConfig = {};
  /**
   * Template for the target marker of drag target columns.

   * @zh 输入属性 `targetMarkerTemplate`（类型：`any`），用于配置目标标记点模板。
   */
  @Input() targetMarkerTemplate;

  /**
   * Rows that are displayed in the table.

   * @zh 输入属性 `rows` 的设置器，用于更新行列表。
   */
  @Input() set rows(val) {
    this._rows = val;
    if (val) {
      this._internalRows = [...val];
    }
    // auto sort on new updates
    if (!this.externalSorting) {
      this.sortInternalRows();
    }
    this._internalRows = groupRowsByParents(
      this._internalRows,
      optionalGetterForProp(this.treeFromRelation),
      optionalGetterForProp(this.treeToRelation)
    );
    this.recalculate();
    if (this._rows && this._groupRowsBy) {
      // If a column has been specified in _groupRowsBy created a new array with the data grouped by that row
      this.groupedRows = this.groupArrayBy(this._rows, this._groupRowsBy);
    }
    this.cd.markForCheck();
  }

  /**
   * Gets the rows.

   * @zh 获取当前行列表（`rows: any`）。
   */
  get rows() {
    return this._rows;
  }


  /**
   * Input property `apiBase` (`string`) configuring api base.
   * @zh 输入属性 `apiBase`（类型：`string`），用于配置API接口基础。
   */
  @Input() apiBase: string;
  /**
   * This attribute allows the user to set the name of the column to group the data with

   * @zh 输入属性 `groupRowsBy` 的设置器，用于更新分组行列表按。
   */
  @Input() set groupRowsBy(val: string) {
    if (val) {
      this._groupRowsBy = val;
      if (this._rows && this._groupRowsBy) {
        // cretes a new array with the data grouped
        this.groupedRows = this.groupArrayBy(this._rows, this._groupRowsBy);
      }
    }
  }

  /**
   * Gets the current group rows by (`groupRowsBy: any`).
   * @zh 获取当前分组行列表按（`groupRowsBy: any`）。
   */
  get groupRowsBy() {
    return this._groupRowsBy;
  }

  /**
   * This attribute allows the user to set a grouped array in the following format:
   *  [
   *    {groupid=1} [
   *      {id=1 name="test1"},
   *      {id=2 name="test2"},
   *      {id=3 name="test3"}
   *    ]},
   *    {groupid=2>[
   *      {id=4 name="test4"},
   *      {id=5 name="test5"},
   *      {id=6 name="test6"}
   *    ]}
   *  ]

   * @zh 输入属性 `groupedRows`（类型：`any[]`），用于配置已分组行列表。
   */
  @Input() groupedRows;

  /**
   * Columns to be displayed.

   * @zh 输入属性 `columns` 的设置器，用于更新列集合。
   */
  @Input() set columns(val: TableColumn[]) {
    if (val) {
      this._internalColumns = [...val];
      setColumnDefaults(this._internalColumns);
      this.recalculateColumns();
    }
    this._columns = val;
  }

  /**
   * Get the columns.

   * @zh 获取当前列集合（`columns: TableColumn[]`）。
   */
  get columns(): TableColumn[] {
    return this._columns;
  }

  /**
   * List of row objects that should be
   * represented as selected in the grid.
   * Default value: `[]`

   * @zh 输入属性 `selected`（类型：`any[]`），用于配置已选中（默认值：`[]`）。
   */
  @Input() selected = [];

  /**
   * Enable vertical scrollbars

   * @zh 输入属性 `scrollbarV`（类型：`boolean`），用于配置滚动条V（默认值：`false`）。
   */
  @Input() scrollbarV: boolean = false;

  /**
   * Enable horz scrollbars

   * @zh 输入属性 `scrollbarH`（类型：`boolean`），用于配置滚动条H（默认值：`false`）。
   */
  @Input() scrollbarH: boolean = false;

  /**
   * The row height; which is necessary
   * to calculate the height for the lazy rendering.

   * @zh 输入属性 `rowHeight`（类型：`number | 'auto' | ((row?: any) => number)`），用于配置行高度（默认值：`30`）。
   */
  @Input() rowHeight: number | 'auto' | ((row?) => number) = 30;

  /**
   * Type of column width distribution formula.
   * Example: flex, force, standard

   * @zh 输入属性 `columnMode`（类型：`ColumnMode`），用于配置列模式（默认值：`ColumnMode.standard`）。
   */
  @Input() columnMode: ColumnMode = ColumnMode.standard;

  /**
   * The minimum header height in pixels.
   * Pass a falsey for no header

   * @zh 输入属性 `headerHeight`（类型：`any`），用于配置表头高度（默认值：`30`）。
   */
  @Input() headerHeight = 30;

  /**
   * The minimum footer height in pixels.
   * Pass falsey for no footer

   * @zh 输入属性 `footerHeight`（类型：`number`），用于配置表尾高度（默认值：`0`）。
   */
  @Input() footerHeight: number = 0;

  /**
   * If the table should use external paging
   * otherwise its assumed that all data is preloaded.

   * @zh 输入属性 `externalPaging`（类型：`boolean`），用于配置外部页面（默认值：`false`）。
   */
  @Input() externalPaging: boolean = false;

  /**
   * If the table should use external sorting or
   * the built-in basic sorting.

   * @zh 输入属性 `externalSorting`（类型：`boolean`），用于配置外部排序中（默认值：`false`）。
   */
  @Input() externalSorting: boolean = false;

  /**
   * The page size to be shown.
   * Default value: `undefined`

   * @zh 输入属性 `limit` 的设置器，用于更新限制。
   */
  @Input() set limit(val: number | undefined) {
    this._limit = val;

    // recalculate sizes/etc
    this.recalculate();
  }

  /**
   * Gets the limit.

   * @zh 获取当前限制（`limit: number | undefined`）。
   */
  get limit(): number | undefined {
    return this._limit;
  }


  /**
   * Input setter `count` updating count.
   * @zh 输入属性 `count` 的设置器，用于更新计数。
   * @param val - New count value (`number`) / 新的计数值（`number`）
   */
  @Input() set count(val: number) {
    this._count = val;
    this.recalculate();
  }


  /**
   * Gets the current count (`count: number`).
   * @zh 获取当前计数（`count: number`）。
   */
  get count(): number {
    return this._count;
  }

  /**
   * The current offset ( page - 1 ) shown.
   * Default value: `0`

   * @zh 输入属性 `offset` 的设置器，用于更新偏移量。
   */
  @Input() set offset(val: number) {
    this._offset = val;
  }
  /**
   * Gets the current offset (`offset: number`).
   * @zh 获取当前偏移量（`offset: number`）。
   */
  get offset(): number {
    return Math.max(Math.min(this._offset, Math.ceil(this.rowCount / this.pageSize) - 1), 0);
  }

  /**
   * Show the linear loading bar.
   * Default value: `false`

   * @zh 输入属性 `loadingIndicator`（类型：`boolean`），用于配置加载中指示器（默认值：`false`）。
   */
  @Input() loadingIndicator: boolean = false;

  /**
   * Type of row selection. Options are:
   *
   *  - `single`
   *  - `multi`
   *  - `checkbox`
   *  - `multiClick`
   *  - `cell`
   *
   * For no selection pass a `falsey`.
   * Default value: `undefined`

   * @zh 输入属性 `selectionType`（类型：`SelectionType`），用于配置selection类型。
   */
  @Input() selectionType: SelectionType;

  /**
   * Enable/Disable ability to re-order columns
   * by dragging them.

   * @zh 输入属性 `reorderable`（类型：`boolean`），用于配置reorderable（默认值：`true`）。
   */
  @Input() reorderable: boolean = true;

  /**
   * Swap columns on re-order columns or
   * move them.

   * @zh 输入属性 `swapColumns`（类型：`boolean`），用于配置swap列集合（默认值：`true`）。
   */
  @Input() swapColumns: boolean = true;

  /**
   * The type of sorting

   * @zh 输入属性 `sortType`（类型：`SortType`），用于配置排序类型（默认值：`SortType.single`）。
   */
  @Input() sortType: SortType = SortType.single;

  /**
   * Array of sorted columns by property and type.
   * Default value: `[]`

   * @zh 输入属性 `sorts`（类型：`any[]`），用于配置排序集合（默认值：`[]`）。
   */
  @Input() sorts = [];

  /**
   * Css class overrides

   * @zh 输入属性 `cssClasses`（类型：`any`），用于配置CSS样式类名集合。
   */
  @Input() cssClasses = {
    sortAscending: 'datatable-icon-up',
    sortDescending: 'datatable-icon-down',
  };

  /**
   * Message overrides for localization
   *
   * emptyMessage     [default] = 'No data to display'
   * totalMessage     [default] = 'total'
   * selectedMessage  [default] = 'selected'

   * @zh 输入属性 `messages`（类型：`any`），用于配置消息列表。
   */
  @Input() messages = {
    // Message to show when array is presented
    // but contains no values
    emptyMessage: this.translateService.instant('DATATABLE.EMPTYMESSAGE'),

    // Footer total message
    totalMessage: this.translateService.instant('DATATABLE.TOTAL'),

    // Footer selected message
    selectedMessage: this.translateService.instant('DATATABLE.SELECTED'),
  };
  /**
   * This will be used when displaying or selecting rows.
   * when tracking/comparing them, we'll use the value of this fn,
   *
   * (`fn(x) === fn(y)` instead of `x === y`)

   * @zh 输入属性 `rowIdentity`（类型：`(x: any) => any`），用于配置行Identity（默认值：`((x: any) => x)`）。
   */
  @Input() rowIdentity: { (x) } = ((x) => x);

  /**
   * Row specific classes.
   * Similar implementation to ngClass.
   *
   *  [rowClass]="'first second'"
   *  [rowClass]="{ 'first': true, 'second': true, 'third': false }"

   * @zh 输入属性 `rowClass`（类型：`any`），用于配置行类名。
   */
  @Input() rowClass;

  /**
   * A boolean/function you can use to check whether you want
   * to select a particular row based on a criteria. Example:
   *
   *    (selection) => {
   *      return selection !== 'Ethel Price';
   *    }

   * @zh 输入属性 `selectCheck`（类型：`any`），用于配置下拉选择检查。
   */
  @Input() selectCheck;

  /**
   * A function you can use to check whether you want
   * to show the checkbox for a particular row based on a criteria. Example:
   *
   *    (row, column, value) => {
   *      return row.name !== 'Ethel Price';
   *    }

   * @zh 输入属性 `displayCheck`（类型：`(row: any, column?: any, value?: any) => boolean|boolean`），用于配置display检查。
   */
  @Input() displayCheck: (row, column?, value?) => boolean|boolean;

  /**
   * A boolean you can use to set the detault behaviour of rows and groups
   * whether they will start expanded or not. If ommited the default is NOT expanded.
   *

   * @zh 输入属性 `groupExpansionDefault`（类型：`boolean`），用于配置分组展开面板默认（默认值：`false`）。
   */
  @Input() groupExpansionDefault: boolean = false;

  /**
   * Property to which you can use for custom tracking of rows.
   * Example: 'name'

   * @zh 输入属性 `trackByProp`（类型：`string`），用于配置track按属性。
   */
  @Input() trackByProp: string;

  /**
   * Property to which you can use for determining select all
   * rows on current page or not.
   *
   * @memberOf DatatableComponent

   * @zh 输入属性 `selectAllRowsOnPage`（类型：`boolean`），用于配置下拉选择全部行列表当页面（默认值：`false`）。
   */
  @Input() selectAllRowsOnPage = false;

  /**
   * A flag for row virtualization on / off

   * @zh 输入属性 `virtualization`（类型：`boolean`），用于配置virtualization（默认值：`true`）。
   */
  @Input() virtualization: boolean = true;

  /**
   * Tree from relation

   * @zh 输入属性 `treeFromRelation`（类型：`string`），用于配置树形控件从Relation。
   */
  @Input() treeFromRelation: string;

  /**
   * Tree to relation

   * @zh 输入属性 `treeToRelation`（类型：`string`），用于配置树形控件转换为Relation。
   */
  @Input() treeToRelation: string;

  /**
   * A flag for switching summary row on / off

   * @zh 输入属性 `summaryRow`（类型：`boolean`），用于配置汇总行（默认值：`false`）。
   */
  @Input() summaryRow: boolean = false;

  /**
   * A height of summary row

   * @zh 输入属性 `summaryHeight`（类型：`number`），用于配置汇总高度（默认值：`30`）。
   */
  @Input() summaryHeight: number = 30;

  /**
   * A property holds a summary row position: top/bottom

   * @zh 输入属性 `summaryPosition`（类型：`string`），用于配置汇总位置（默认值：`'top'`）。
   */
  @Input() summaryPosition: string = 'top';

  /**
   * Input property `allowDrag` (`boolean`) configuring allow drag (default: `false`).
   * @zh 输入属性 `allowDrag`（类型：`boolean`），用于配置允许拖拽（默认值：`false`）。
   */
  @Input() allowDrag = false;

  /**
   * Body was scrolled typically in a `scrollbarV:true` scenario.

   * @zh 输出事件 `scroll`（类型：`EventEmitter<any>`），当触发滚动时向外发出事件。
   */
  @Output() scroll = new EventEmitter();

  /**
   * A cell or row was focused via keyboard or mouse click.

   * @zh 输出事件 `activate`（类型：`EventEmitter<any>`），当触发激活时向外发出事件。
   */
  @Output() activate = new EventEmitter();

  /**
   * A cell or row was selected.

   * @zh 输出事件 `select`（类型：`EventEmitter<any>`），当触发下拉选择时向外发出事件。
   */
  @Output() select = new EventEmitter();

  /**
   * Column sort was invoked.

   * @zh 输出事件 `sort`（类型：`EventEmitter<any>`），当触发排序时向外发出事件。
   */
  @Output() sort = new EventEmitter();

  /**
   * The table was paged either triggered by the pager or the body scroll.

   * @zh 输出事件 `page`（类型：`EventEmitter<any>`），当触发页面时向外发出事件。
   */
  @Output() page = new EventEmitter();

  /**
   * Columns were re-ordered.

   * @zh 输出事件 `reorder`（类型：`EventEmitter<any>`），当触发重排时向外发出事件。
   */
  @Output() reorder = new EventEmitter();

  /**
   * Column was resized.

   * @zh 输出事件 `resize`（类型：`EventEmitter<any>`），当触发调整尺寸时向外发出事件。
   */
  @Output() resize = new EventEmitter();

  /**
   * The context menu was invoked on the table.
   * type indicates whether the header or the body was clicked.
   * content contains either the column or the row that was clicked.

   * @zh 输出事件 `tableContextmenu`（类型：`EventEmitter`），当触发表格Contextmenu时向外发出事件。
   */
  @Output() tableContextmenu = new EventEmitter<{ event: MouseEvent; type: ContextmenuType; content }>(false);

  /**
   * A row was expanded ot collapsed for tree

   * @zh 输出事件 `treeAction`（类型：`EventEmitter<any>`），当触发树形控件动作时向外发出事件。
   */
  @Output() treeAction = new EventEmitter();

  /**
   * CSS class applied if the header height if fixed height.

   * @zh 宿主绑定读取器 `isFixedHeader`（绑定至 `class.fixed-header`），计算并返回是否为固定表头。
   */
  @HostBinding('class.fixed-header')
  get isFixedHeader(): boolean {
    const headerHeight: number | string = this.headerHeight;
    return typeof headerHeight === 'string' ? <string>headerHeight !== 'auto' : true;
  }

  /**
   * CSS class applied to the root element if
   * the row heights are fixed heights.

   * @zh 宿主绑定读取器 `isFixedRow`（绑定至 `class.fixed-row`），计算并返回是否为固定行。
   */
  @HostBinding('class.fixed-row')
  get isFixedRow(): boolean {
    return this.rowHeight !== 'auto';
  }

  /**
   * CSS class applied to root element if
   * vertical scrolling is enabled.

   * @zh 宿主绑定读取器 `isVertScroll`（绑定至 `class.scroll-vertical`），计算并返回是否为Vert滚动。
   */
  @HostBinding('class.scroll-vertical')
  get isVertScroll(): boolean {
    return this.scrollbarV;
  }

  /**
   * CSS class applied to root element if
   * virtualization is enabled.

   * @zh 宿主绑定读取器 `isVirtualized`（绑定至 `class.virtualized`），计算并返回是否为Virtualized。
   */
  @HostBinding('class.virtualized')
  get isVirtualized(): boolean {
    return this.virtualization;
  }

  /**
   * CSS class applied to the root element
   * if the horziontal scrolling is enabled.

   * @zh 宿主绑定读取器 `isHorScroll`（绑定至 `class.scroll-horz`），计算并返回是否为Hor滚动。
   */
  @HostBinding('class.scroll-horz')
  get isHorScroll(): boolean {
    return this.scrollbarH;
  }

  /**
   * CSS class applied to root element is selectable.

   * @zh 宿主绑定读取器 `isSelectable`（绑定至 `class.selectable`），计算并返回是否为是否可选中。
   */
  @HostBinding('class.selectable')
  get isSelectable(): boolean {
    return this.selectionType !== undefined;
  }

  /**
   * CSS class applied to root is checkbox selection.

   * @zh 宿主绑定读取器 `isCheckboxSelection`（绑定至 `class.checkbox-selection`），计算并返回是否为复选框Selection。
   */
  @HostBinding('class.checkbox-selection')
  get isCheckboxSelection(): boolean {
    return this.selectionType === SelectionType.checkbox;
  }

  /**
   * CSS class applied to root if cell selection.

   * @zh 宿主绑定读取器 `isCellSelection`（绑定至 `class.cell-selection`），计算并返回是否为单元格Selection。
   */
  @HostBinding('class.cell-selection')
  get isCellSelection(): boolean {
    return this.selectionType === SelectionType.cell;
  }

  /**
   * CSS class applied to root if single select.

   * @zh 宿主绑定读取器 `isSingleSelection`（绑定至 `class.single-selection`），计算并返回是否为单个Selection。
   */
  @HostBinding('class.single-selection')
  get isSingleSelection(): boolean {
    return this.selectionType === SelectionType.single;
  }

  /**
   * CSS class added to root element if mulit select

   * @zh 宿主绑定读取器 `isMultiSelection`（绑定至 `class.multi-selection`），计算并返回是否为多Selection。
   */
  @HostBinding('class.multi-selection')
  get isMultiSelection(): boolean {
    return this.selectionType === SelectionType.multi;
  }

  /**
   * CSS class added to root element if mulit click select

   * @zh 宿主绑定读取器 `isMultiClickSelection`（绑定至 `class.multi-click-selection`），计算并返回是否为多点击Selection。
   */
  @HostBinding('class.multi-click-selection')
  get isMultiClickSelection(): boolean {
    return this.selectionType === SelectionType.multiClick;
  }

  /**
   * Column templates gathered from `ContentChildren`
   * if described in your markup.

   * @zh 设置列模板（`columnTemplates`）。
   */
  @ContentChildren(DataTableColumnDirective)
  set columnTemplates(val: QueryList<DataTableColumnDirective>) {
    this._columnTemplates = val;
    this.translateColumns(val);
  }

  /**
   * Returns the column templates.

   * @zh 获取当前列模板（`columnTemplates: QueryList<DataTableColumnDirective>`）。
   */
  get columnTemplates(): QueryList<DataTableColumnDirective> {
    return this._columnTemplates;
  }

  /**
   * Row Detail templates gathered from the ContentChild

   * @zh 模板/内容视图查询引用 `rowDetail`（`@ContentChild`），指向行详情。
   */
  @ContentChild(DatatableRowDetailDirective)
  rowDetail: DatatableRowDetailDirective;

  /**
   * Group Header templates gathered from the ContentChild

   * @zh 模板/内容视图查询引用 `groupHeader`（`@ContentChild`），指向分组表头。
   */
  @ContentChild(DatatableGroupHeaderDirective)
  groupHeader: DatatableGroupHeaderDirective;

  /**
   * Footer template gathered from the ContentChild

   * @zh 模板/内容视图查询引用 `footer`（`@ContentChild`），指向表尾。
   */
  @ContentChild(DatatableFooterDirective)
  footer: DatatableFooterDirective;

  /**
   * Reference to the body component for manually
   * invoking functions on the body.

   * @zh 模板/内容视图查询引用 `bodyComponent`（`@ViewChild`），指向主体组件。
   */
  @ViewChild(DataTableBodyComponent)
  bodyComponent: DataTableBodyComponent;

  /**
   * Reference to the header component for manually
   * invoking functions on the header.
   *
   * @memberOf DatatableComponent

   * @zh 模板/内容视图查询引用 `headerComponent`（`@ViewChild`），指向表头组件。
   */
  @ViewChild(DataTableHeaderComponent)
  headerComponent: DataTableHeaderComponent;

  /**
   * Returns if all rows are selected.

   * @zh 获取当前全部行列表已选中（`allRowsSelected: boolean`）。
   */
  get allRowsSelected(): boolean {
    let allRowsSelected = this.rows && this.selected && this.selected.length === this.rows.length;

    if (this.selectAllRowsOnPage) {
      const indexes = this.bodyComponent.indexes;
      const rowsOnPage = indexes.last - indexes.first;
      allRowsSelected = this.selected.length === rowsOnPage;
    }

    return this.selected && this.rows && this.rows.length !== 0 && allRowsSelected;
  }

  /**
   * Gets the current partial rows selected (`partialRowsSelected: boolean`).
   * @zh 获取当前partial行列表已选中（`partialRowsSelected: boolean`）。
   */
  get partialRowsSelected(): boolean {
    let partialRowsSelected = (this.rows && this.selected && this.selected.length !== 0 && this.selected.length < this.rows.length);
    if (this.selectAllRowsOnPage) {
      const indexes = this.bodyComponent.indexes;
      const rowsOnPage = indexes.last - indexes.first;
      partialRowsSelected = (this.selected.length !== 0 && this.selected.length < rowsOnPage);
    }
    return this.selected && this.rows &&
      this.rows.length !== 0 && this.selected.length !== 0 && partialRowsSelected;
  }

  /**
   * Property `element` (`HTMLElement`) storing element.
   * @zh 属性 `element`（类型：`HTMLElement`），用于存储或配置元素。
   */
  element: HTMLElement;
  /**
   * Property `_innerWidth` (`number`) storing inner width.
   * @zh 属性 `_innerWidth`（类型：`number`），用于存储或配置内部宽度。
   */
  _innerWidth: number;
  /**
   * Property `pageSize` (`number`) storing page size.
   * @zh 属性 `pageSize`（类型：`number`），用于存储或配置页面尺寸。
   */
  pageSize: number;
  /**
   * Property `bodyHeight` (`number`) storing body height.
   * @zh 属性 `bodyHeight`（类型：`number`），用于存储或配置主体高度。
   */
  bodyHeight: number;
  /**
   * Property `rowCount` (`number`) storing row count (default: `0`).
   * @zh 属性 `rowCount`（类型：`number`），用于存储或配置行计数（默认值：`0`）。
   */
  rowCount: number = 0;
  /**
   * Property `rowDiffer` (`KeyValueDiffer<{}, {}>`) storing row differ.
   * @zh 属性 `rowDiffer`（类型：`KeyValueDiffer<{}, {}>`），用于存储或配置行Differ。
   */
  rowDiffer: KeyValueDiffer<{}, {}>;

  /**
   * Property `_offsetX` (`BehaviorSubject`) storing offset x (default: `new BehaviorSubject(0)`).
   * @zh 属性 `_offsetX`（类型：`BehaviorSubject`），用于存储或配置偏移量X坐标（默认值：`new BehaviorSubject(0)`）。
   */
  _offsetX = new BehaviorSubject(0);
  /**
   * Property `_limit` (`number | undefined`) storing limit.
   * @zh 属性 `_limit`（类型：`number | undefined`），用于存储或配置限制。
   */
  _limit: number | undefined;
  /**
   * Property `_count` (`number`) storing count (default: `0`).
   * @zh 属性 `_count`（类型：`number`），用于存储或配置计数（默认值：`0`）。
   */
  _count: number = 0;
  /**
   * Property `_offset` (`number`) storing offset (default: `0`).
   * @zh 属性 `_offset`（类型：`number`），用于存储或配置偏移量（默认值：`0`）。
   */
  _offset: number = 0;
  /**
   * Property `_rows` (`any[]`) storing rows.
   * @zh 属性 `_rows`（类型：`any[]`），用于存储或配置行列表。
   */
  _rows;
  /**
   * Property `_groupRowsBy` (`string`) storing group rows by.
   * @zh 属性 `_groupRowsBy`（类型：`string`），用于存储或配置分组行列表按。
   */
  _groupRowsBy: string;
  /**
   * Property `_internalRows` (`any[]`) storing internal rows.
   * @zh 属性 `_internalRows`（类型：`any[]`），用于存储或配置内部行列表。
   */
  _internalRows;
  /**
   * Property `_internalColumns` (`TableColumn[]`) storing internal columns.
   * @zh 属性 `_internalColumns`（类型：`TableColumn[]`），用于存储或配置内部列集合。
   */
  _internalColumns: TableColumn[];
  /**
   * Property `_columns` (`TableColumn[]`) storing columns.
   * @zh 属性 `_columns`（类型：`TableColumn[]`），用于存储或配置列集合。
   */
  _columns: TableColumn[];
  /**
   * Property `_columnTemplates` (`QueryList<DataTableColumnDirective>`) storing column templates.
   * @zh 属性 `_columnTemplates`（类型：`QueryList<DataTableColumnDirective>`），用于存储或配置列模板。
   */
  _columnTemplates: QueryList<DataTableColumnDirective>;
  /**
   * Property `_subscriptions` (`Subscription[]`) storing subscriptions (default: `[]`).
   * @zh 属性 `_subscriptions`（类型：`Subscription[]`），用于存储或配置订阅集合（默认值：`[]`）。
   */
  _subscriptions: Subscription[] = [];

  /**
   * Property `_grid` (`DatatableCardComponent`) storing grid.
   * @zh 属性 `_grid`（类型：`DatatableCardComponent`），用于存储或配置网格表格。
   */
  _grid: DatatableCardComponent;

  /**
   * Creates an instance of `DatatableComponent` and initializes its dependencies and internal state.
   * @zh 创建 `DatatableComponent` 实例，并初始化其依赖项与内部状态。
   * @param scrollbarHelper - Injected or initial scrollbar helper (`ScrollbarHelper`) / 注入或传入的滚动条辅助工具（`ScrollbarHelper`）
   * @param dimensionsHelper - Injected or initial dimensions helper (`DimensionsHelper`) / 注入或传入的维度列表辅助工具（`DimensionsHelper`）
   * @param cd - Injected or initial cd (`ChangeDetectorRef`) / 注入或传入的cd（`ChangeDetectorRef`）
   * @param elementRef - Injected or initial element ref (`ElementRef`) / 注入或传入的元素引用（`ElementRef`）
   * @param differs - Injected or initial differs (`KeyValueDiffers`) / 注入或传入的differs（`KeyValueDiffers`）
   * @param http - Injected or initial http (`HttpClient`) / 注入或传入的HTTP（`HttpClient`）
   * @param columnChangesService - Injected or initial column changes service (`ColumnChangesService`) / 注入或传入的列变更集合服务（`ColumnChangesService`）
   * @param translateService - Injected or initial translate service (`TranslateService`) / 注入或传入的翻译服务（`TranslateService`）
   */
  constructor(
    @SkipSelf() private scrollbarHelper: ScrollbarHelper,
    @SkipSelf() private dimensionsHelper: DimensionsHelper,
    private cd: ChangeDetectorRef,
    elementRef: ElementRef,
    differs: KeyValueDiffers,
    protected http: HttpClient,
    private columnChangesService: ColumnChangesService,
    private readonly translateService: TranslateService,
    // @Optional() @Inject('configuration') private configuration: INgxDatatableConfig
  ) {
    // get ref to elm for measuring
    this.element = elementRef.nativeElement;
    this.rowDiffer = differs.find({}).create();

    // apply global settings from Module.forRoot
    // if (this.configuration && this.configuration.messages) {
    //   this.messages = { ...this.configuration.messages };
    // }
  }

  /**
   * Lifecycle hook that is called after data-bound
   * properties of a directive are initialized.

   * @zh Angular 生命周期钩子：在组件或指令的输入属性初始化完成后调用一次。
   */
  ngOnInit(): void {


    // need to call this immediatly to size
    // if the table is hidden the visibility
    // listener will invoke this itself upon show
    this.recalculate();
  }

  /**
   * Lifecycle hook that is called after a component's
   * view has been fully initialized.

   * @zh Angular 生命周期钩子：在组件视图及其子视图初始化完成后调用一次。
   */
  ngAfterViewInit(): void {
    if (!this.externalSorting) {
      this.sortInternalRows();
    }

    // this has to be done to prevent the change detection
    // tree from freaking out because we are readjusting
    if (typeof requestAnimationFrame === 'undefined') {
      return;
    }

    requestAnimationFrame(() => {
      this.recalculate();
      if (this.externalPaging && this.scrollbarV) {
        this.page.emit({
          count: this.count,
          pageSize: this.pageSize,
          limit: this.limit,
          offset: 0
        });
      }
    });
  }

  /**
   * Angular lifecycle hook invoked when data-bound input properties change.
   * @zh Angular 生命周期钩子：当数据绑定的输入属性发生变更时调用。
   * @param changes - changes parameter (`SimpleChanges`) / 变更集合参数（`SimpleChanges`）
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes['config']) {
      this.init(this.config);
    }

    this.messages.emptyMessage = this.translateService.instant('DATATABLE.EMPTYMESSAGE');
    this.messages.totalMessage = this.translateService.instant('DATATABLE.TOTAL');
    this.messages.selectedMessage = this.translateService.instant('DATATABLE.SELECTED');
  }
  /**
   * Lifecycle hook that is called after a component's
   * content has been fully initialized.

   * @zh Angular 生命周期钩子：在投影内容（`ng-content`）初始化完成后调用一次。
   */
  ngAfterContentInit() {
    this._subscriptions.push(this.columnTemplates.changes.subscribe(v => this.translateColumns(v)));
    this.listenForColumnInputChanges();
  }


  /**
   * Translates the templates to the column objects

   * @zh 执行 `translateColumns`，用于翻译列集合。
   */
  translateColumns(val) {
    if (val) {
      const arr = val.toArray();
      if (arr.length) {
        this._internalColumns = translateTemplates(arr);
        setColumnDefaults(this._internalColumns);
        this.recalculateColumns();
        this.sortInternalRows();
        this.cd.markForCheck();
      }
    }
  }

  /**
   * Creates a map with the data grouped by the user choice of grouping index
   *
   * @param originalArray the original array passed via parameter
   * @param groupByIndex  the index of the column to group the data by

   * @zh 执行 `groupArrayBy`，用于分组数组按。
   */
  groupArrayBy(originalArray, groupBy) {
    // create a map to hold groups with their corresponding results
    const map = new Map();

    originalArray.forEach((item) => {
      const key = item[groupBy];
      if (!map.has(key)) {
        map.set(key, [item]);
      } else {
        map.get(key).push(item);
      }
    });

    const addGroup = (key, value) => {
      return { key, value };
    };

    // convert map back to a simple array of objects
    return Array.from(map, x => addGroup(x[0], x[1]));
  }

  /*
   * Lifecycle hook that is called when Angular dirty checks a directive.
   */
  /**
   * Angular lifecycle hook invoked during every change-detection run for custom change detection.
   * @zh Angular 生命周期钩子：在每次变更检测周期中调用，用于执行自定义变更检测。
   */
  ngDoCheck(): void {
    if (this.rowDiffer.diff(this.rows)) {
      if (!this.externalSorting) {
        this.sortInternalRows();
      } else {
        this._internalRows = [...this.rows];
      }

      // auto group by parent on new update
      this._internalRows = groupRowsByParents(
        this._internalRows,
        optionalGetterForProp(this.treeFromRelation),
        optionalGetterForProp(this.treeToRelation)
      );

      this.recalculatePages();
      this.cd.markForCheck();
    }
  }

  /**
   * Recalc's the sizes of the grid.
   *
   * Updated automatically on changes to:
   *
   *  - Columns
   *  - Rows
   *  - Paging related
   *
   * Also can be manually invoked or upon window resize.

   * @zh 执行 `recalculate`，用于recalculate。
   */
  recalculate(): void {
    this.recalculateDims();
    this.recalculateColumns();
    this.cd.detectChanges();
  }

  /**
   * Executes `recalculate1` to handle recalculate1.
   * @zh 执行 `recalculate1`，用于recalculate1。
   */
  recalculate1(): void {
    setTimeout(() => {
      this.recalculate();
    }, 200);
  }

  /**
   * Window resize handler to update sizes.

   * @zh 宿主事件监听方法 `onWindowResize`，响应 `window:resize` 事件以处理当窗口调整尺寸。
   */
  @HostListener('window:resize')
  // 原来被注释掉，导致 resize 期间每个事件都同步触发一次完整的
  // recalculate() + detectChanges()；拖动浏览器窗口边缘调整大小时
  // 会连续触发多次全表格重算
  @throttleable(100)
  onWindowResize(): void {
    this.recalculate();
  }

  /**
   * Executes `init` to handle init.
   * @zh 执行 `init`，用于初始化。
   * @param config - config parameter (`any`) / 配置参数（`any`）
   */
  init(config) {
    Dui.apply(this, config);
  }


  /**
   * Executes `recalculateColumns` to handle recalculate columns.
   * @zh 执行 `recalculateColumns`，用于recalculate列集合。
   * @param columns - columns parameter (`any[]`) / 列集合参数（`any[]`）
   * @param forceIdx - force idx parameter (`number`) / force索引参数（`number`）
   * @param allowBleed - allow bleed parameter (`boolean`) / 允许Bleed参数（`boolean`）
   * @returns Result of type `any[] | undefined` / 类型为 `any[] | undefined` 的返回值
   */
  recalculateColumns(
    columns = this._internalColumns,
    forceIdx: number = -1,
    allowBleed: boolean = this.scrollbarH
  ) {
    if (!columns) return undefined;

    let width = this._innerWidth;
    if (this.scrollbarV) {
      width = width - this.scrollbarHelper.width;
    }

    if (this.columnMode === ColumnMode.force) {
      forceFillColumnWidths(columns, width, forceIdx, allowBleed);
    } else if (this.columnMode === ColumnMode.flex) {
      adjustColumnWidths(columns, width);
    }

    return columns;
  }

  /**
   * Recalculates the dimensions of the table size.
   * Internally calls the page size and row count calcs too.
   *

   * @zh 执行 `recalculateDims`，用于recalculateDims。
   */
  recalculateDims(): void {
    const dims = this.dimensionsHelper.getDimensions(this.element);
    this._innerWidth = Math.floor(dims.width);

    if (this.scrollbarV) {
      let height = dims.height;
      if (this.headerHeight) height = height - this.headerHeight;
      if (this.footerHeight) height = height - this.footerHeight;
      this.bodyHeight = height;
    }

    this.recalculatePages();
  }

  /**
   * Recalculates the pages after a update.

   * @zh 执行 `recalculatePages`，用于recalculate页面列表。
   */
  recalculatePages(): void {
    this.pageSize = this.calcPageSize();
    this.rowCount = this.calcRowCount();
  }

  /**
   * Body triggered a page event.

   * @zh 执行 `onBodyPage`，用于当主体页面。
   */
  onBodyPage({ offset }): void {
    // Avoid pagination caming from body events like scroll when the table
    // has no virtualization and the external paging is enable.
    // This means, let's the developer handle pagination by my him(her) self
    if (this.externalPaging || !this.virtualization) {
      return;
    }

    this.offset = offset;

    this.page.emit({
      count: this.count,
      pageSize: this.pageSize,
      limit: this.limit,
      offset: this.offset
    });
  }

  /**
   * The body triggered a scroll event.

   * @zh 属性 `_scrollDetectChangesFrame`（类型：`number`），用于存储或配置滚动检测变更集合框架。
   */
  private _scrollDetectChangesFrame: number;

  /**
   * Executes `onBodyScroll` to handle on body scroll.
   * @zh 执行 `onBodyScroll`，用于当主体滚动。
   * @param event - event parameter (`MouseEvent`) / 事件参数（`MouseEvent`）
   */
  onBodyScroll(event: MouseEvent): void {
    this._offsetX.next(event.offsetX);
    this.scroll.emit(event);
    // 原来每个滚动事件都同步触发一次完整变更检测（含 O(已选行数) 的
    // 每行选中态扫描），滚动时每秒可触发几十次；按帧合并，滚动过程中
    // 最多每帧一次
    if (this._scrollDetectChangesFrame !== undefined) {
      return;
    }
    this._scrollDetectChangesFrame = requestAnimationFrame(() => {
      this._scrollDetectChangesFrame = undefined;
      this.cd.detectChanges();
    });
  }

  /**
   * The footer triggered a page event.

   * @zh 执行 `onFooterPage`，用于当表尾页面。
   */
  onFooterPage(event) {
    this.offset = event.page - 1;
    this.bodyComponent.updateOffsetY(this.offset);

    this.page.emit({
      count: this.count,
      pageSize: this.pageSize,
      limit: this.limit,
      offset: this.offset,
      maxPage: event.page,
      fromRow: event.fromRow,
      toRow: event.toRow
    });

    if (this.selectAllRowsOnPage) {
      this.selected = [];
      this.select.emit({
        selected: this.selected
      });
    }
  }

  /**
   * Recalculates the sizes of the page

   * @zh 执行 `calcPageSize`，用于计算页面尺寸。
   */
  calcPageSize(val = this.rows): number {
    // Keep the page size constant even if the row has been expanded.
    // This is because an expanded row is still considered to be a child of
    // the original row.  Hence calculation would use rowHeight only.
    if (this.scrollbarV && this.virtualization) {
      const size = Math.ceil(this.bodyHeight / (this.rowHeight as number));
      return Math.max(size, 0);
    }

    // if limit is passed, we are paging
    if (this.limit !== undefined) {
      return this.limit;
    }

    // otherwise use row length
    if (val) {
      return val.length;
    }

    // other empty :(
    return 0;
  }

  /**
   * Calculates the row count.

   * @zh 执行 `calcRowCount`，用于计算行计数。
   */
  calcRowCount(val = this.rows): number {
    if (!this.externalPaging) {
      if (!val) return 0;
      if (this.groupedRows) {
        return this.groupedRows.length;
      } else if (this.treeFromRelation != null && this.treeToRelation != null) {
        return this._internalRows.length;
      } else {
        return val.length;
      }
    }

    return this.count;
  }

  /**
   * The header triggered a contextmenu event.

   * @zh 执行 `onColumnContextmenu`，用于当列Contextmenu。
   */
  onColumnContextmenu({ event, column }): void {
    this.tableContextmenu.emit({ event, type: ContextmenuType.header, content: column });
  }

  /**
   * The body triggered a contextmenu event.

   * @zh 执行 `onRowContextmenu`，用于当行Contextmenu。
   */
  onRowContextmenu({ event, row }): void {
    this.tableContextmenu.emit({ event, type: ContextmenuType.body, content: row });
  }

  /**
   * The header triggered a column resize event.

   * @zh 执行 `onColumnResize`，用于当列调整尺寸。
   */
  onColumnResize({ column, newValue }): void {
    /* Safari/iOS 10.2 workaround */
    if (column === undefined) {
      return;
    }

    let idx: number;
    const cols = this._internalColumns.map((c, i) => {
      c = { ...c };

      if (c.$$id === column.$$id) {
        idx = i;
        c.width = newValue;

        // set this so we can force the column
        // width distribution to be to this value
        c.$$oldWidth = newValue;
      }

      return c;
    });

    this.recalculateColumns(cols, idx);
    this._internalColumns = cols;

    this.resize.emit({
      column,
      newValue
    });
  }

  /**
   * The header triggered a column re-order event.

   * @zh 执行 `onColumnReorder`，用于当列重排。
   */
  onColumnReorder({ column, newValue, prevValue }): void {
    const cols = this._internalColumns.map(c => {
      return { ...c };
    });

    if (this.swapColumns) {
      const prevCol = cols[newValue];
      cols[newValue] = column;
      cols[prevValue] = prevCol;
    } else {
      if (newValue > prevValue) {
        const movedCol = cols[prevValue];
        for (let i = prevValue; i < newValue; i++) {
          cols[i] = cols[i + 1];
        }
        cols[newValue] = movedCol;
      } else {
        const movedCol = cols[prevValue];
        for (let i = prevValue; i > newValue; i--) {
          cols[i] = cols[i - 1];
        }
        cols[newValue] = movedCol;
      }
    }

    this._internalColumns = cols;

    this.reorder.emit({
      column,
      newValue,
      prevValue
    });
  }

  /**
   * The header triggered a column sort event.

   * @zh 执行 `onColumnSort`，用于当列排序。
   */
  onColumnSort(event): void {
    // clean selected rows
    if (this.selectAllRowsOnPage) {
      this.selected = [];
      this.select.emit({
        selected: this.selected
      });
    }

    this.sorts = event.sorts;

    // this could be optimized better since it will resort
    // the rows again on the 'push' detection...
    if (this.externalSorting === false) {
      // don't use normal setter so we don't resort
      this.sortInternalRows();
    }

    // auto group by parent on new update
    this._internalRows = groupRowsByParents(
      this._internalRows,
      optionalGetterForProp(this.treeFromRelation),
      optionalGetterForProp(this.treeToRelation)
    );

    // Always go to first page when sorting to see the newly sorted data
    this.offset = 0;
    this.bodyComponent.updateOffsetY(this.offset);
    this.sort.emit(event);
  }

  /**
   * Toggle all row selection

   * @zh 执行 `onHeaderSelect`，用于当表头下拉选择。
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onHeaderSelect(event): void {
    if (this.selectAllRowsOnPage) {
      // before we splice, chk if we currently have all selected
      const first = this.bodyComponent.indexes.first;
      const last = this.bodyComponent.indexes.last;
      const allSelected = this.selected.length === last - first;

      // remove all existing either way
      this.selected = [];

      // do the opposite here
      if (!allSelected) {
        this.selected.push(...this._internalRows.slice(first, last));
      }
    } else {
      // before we splice, chk if we currently have all selected
      const allSelected = this.selected.length === this.rows.length;
      // remove all existing either way
      this.selected = [];
      // do the opposite here
      if (!allSelected) {
        this.selected.push(...this.rows);
      }
    }

    this.select.emit({
      selected: this.selected
    });
  }

  /**
   * Executes `resetSelection` to handle reset selection.
   * @zh 执行 `resetSelection`，用于重置Selection。
   */
  resetSelection() {
    this.selected = [];
    this.select.emit({});
  }

  /**
   * A row was selected from body

   * @zh 执行 `onBodySelect`，用于当主体下拉选择。
   */
  onBodySelect(event): void {
    this.select.emit(event);
  }

  /**
   * A row was expanded or collapsed for tree

   * @zh 执行 `onTreeAction`，用于当树形控件动作。
   */
  onTreeAction(event) {
    const row = event.row;
    // TODO: For duplicated items this will not work
    const rowIndex = this._rows.findIndex(r => r[this.treeToRelation] === event.row[this.treeToRelation]);
    this.treeAction.emit({ row, rowIndex });
  }

  /**
   * Angular lifecycle hook invoked just before the component, directive, or service is destroyed to release subscriptions and resources.
   * @zh Angular 生命周期钩子：在组件、指令或服务销毁前调用，用于释放订阅与清理资源。
   */
  ngOnDestroy() {
    this._subscriptions.forEach(subscription => subscription.unsubscribe());
    if (this._scrollDetectChangesFrame !== undefined) {
      cancelAnimationFrame(this._scrollDetectChangesFrame);
    }
  }

  /**
   * listen for changes to input bindings of all DataTableColumnDirective and
   * trigger the columnTemplates.changes observable to emit

   * @zh 执行 `listenForColumnInputChanges`，用于监听用于列输入属性变更集合。
   */
  private listenForColumnInputChanges(): void {
    this._subscriptions.push(
      this.columnChangesService.columnInputChanges$.subscribe(() => {
        if (this.columnTemplates) {
          this.columnTemplates.notifyOnChanges();
        }
      })
    );
  }

  /**
   * Executes `sortInternalRows` to handle sort internal rows.
   * @zh 执行 `sortInternalRows`，用于排序内部行列表。
   */
  private sortInternalRows(): void {
    this._internalRows = sortRows(this._internalRows, this._internalColumns, this.sorts);
  }
}
