/**
 * @fileoverview Module `src/data/datatable/body/body.component.ts` providing body component definitions and implementation.
 * @zh 模块文件 `src/data/datatable/body/body.component.ts`，提供主体组件相关的定义与实现。
 */

import {
  Component, Output, EventEmitter, Input, HostBinding, ChangeDetectorRef,
  ViewChild, OnInit, OnDestroy, ChangeDetectionStrategy
} from '@angular/core';
import { translateXY} from '../utils/translate';
import { columnsByPin, columnGroupWidths } from '../utils/column';
import { RowHeightCache } from '../utils/row-height-cache';
import { SelectionType } from '../types/selection.type';
import { ScrollerComponent } from './scroller.component';
import { Subscription } from 'rxjs';

/**
 * Angular component `DataTableBodyComponent` (selector: 'datatable-body') providing data table body component presentation and interaction in `src/data/datatable/body`.
 * @zh Angular 组件 `DataTableBodyComponent`（selector: 'datatable-body'），提供数据表格主体组件的视图渲染与交互逻辑（位于 `src/data/datatable/body`）。
 */
@Component({
  selector: 'datatable-body',
  templateUrl: 'body.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'datatable-body'
  },
  standalone: false
})

export class DataTableBodyComponent implements OnInit, OnDestroy {
  /**
   * Input property `scrollbarV` (`boolean`) configuring scrollbar v.
   * @zh 输入属性 `scrollbarV`（类型：`boolean`），用于配置滚动条V。
   */
  @Input() scrollbarV: boolean;
  /**
   * Input property `scrollbarH` (`boolean`) configuring scrollbar h.
   * @zh 输入属性 `scrollbarH`（类型：`boolean`），用于配置滚动条H。
   */
  @Input() scrollbarH: boolean;
  /**
   * Input property `loadingIndicator` (`boolean`) configuring loading indicator.
   * @zh 输入属性 `loadingIndicator`（类型：`boolean`），用于配置加载中指示器。
   */
  @Input() loadingIndicator: boolean;
  /**
   * Input property `externalPaging` (`boolean`) configuring external paging.
   * @zh 输入属性 `externalPaging`（类型：`boolean`），用于配置外部页面。
   */
  @Input() externalPaging: boolean;
  /**
   * Input property `rowHeight` (`any`) configuring row height.
   * @zh 输入属性 `rowHeight`（类型：`any`），用于配置行高度。
   */
  @Input() rowHeight;
  /**
   * Input property `offsetX` (`number`) configuring offset x.
   * @zh 输入属性 `offsetX`（类型：`number`），用于配置偏移量X坐标。
   */
  @Input() offsetX: number;
  /**
   * Input property `emptyMessage` (`string`) configuring empty message.
   * @zh 输入属性 `emptyMessage`（类型：`string`），用于配置空消息。
   */
  @Input() emptyMessage: string;
  /**
   * Input property `selectionType` (`SelectionType`) configuring selection type.
   * @zh 输入属性 `selectionType`（类型：`SelectionType`），用于配置selection类型。
   */
  @Input() selectionType: SelectionType;
  /**
   * Input property `selected` (`any[]`) configuring selected (default: `[]`).
   * @zh 输入属性 `selected`（类型：`any[]`），用于配置已选中（默认值：`[]`）。
   */
  @Input() selected = [];
  /**
   * Input property `rowIdentity` (`any`) configuring row identity.
   * @zh 输入属性 `rowIdentity`（类型：`any`），用于配置行Identity。
   */
  @Input() rowIdentity;
  /**
   * Input property `rowDetail` (`any`) configuring row detail.
   * @zh 输入属性 `rowDetail`（类型：`any`），用于配置行详情。
   */
  @Input() rowDetail;
  /**
   * Input property `groupHeader` (`any`) configuring group header.
   * @zh 输入属性 `groupHeader`（类型：`any`），用于配置分组表头。
   */
  @Input() groupHeader;
  /**
   * Input property `selectCheck` (`any`) configuring select check.
   * @zh 输入属性 `selectCheck`（类型：`any`），用于配置下拉选择检查。
   */
  @Input() selectCheck;
  /**
   * Input property `displayCheck` (`any`) configuring display check.
   * @zh 输入属性 `displayCheck`（类型：`any`），用于配置display检查。
   */
  @Input() displayCheck;
  /**
   * Input property `trackByProp` (`string`) configuring track by prop.
   * @zh 输入属性 `trackByProp`（类型：`string`），用于配置track按属性。
   */
  @Input() trackByProp: string;
  /**
   * Input property `rowClass` (`any`) configuring row class.
   * @zh 输入属性 `rowClass`（类型：`any`），用于配置行类名。
   */
  @Input() rowClass;
  /**
   * Input property `groupedRows` (`any`) configuring grouped rows.
   * @zh 输入属性 `groupedRows`（类型：`any`），用于配置已分组行列表。
   */
  @Input() groupedRows;
  /**
   * Input property `groupExpansionDefault` (`boolean`) configuring group expansion default.
   * @zh 输入属性 `groupExpansionDefault`（类型：`boolean`），用于配置分组展开面板默认。
   */
  @Input() groupExpansionDefault: boolean;
  /**
   * Input property `innerWidth` (`number`) configuring inner width.
   * @zh 输入属性 `innerWidth`（类型：`number`），用于配置内部宽度。
   */
  @Input() innerWidth: number;
  /**
   * Input property `groupRowsBy` (`string`) configuring group rows by.
   * @zh 输入属性 `groupRowsBy`（类型：`string`），用于配置分组行列表按。
   */
  @Input() groupRowsBy: string;
  /**
   * Input property `virtualization` (`boolean`) configuring virtualization.
   * @zh 输入属性 `virtualization`（类型：`boolean`），用于配置virtualization。
   */
  @Input() virtualization: boolean;
  /**
   * Input property `summaryRow` (`boolean`) configuring summary row.
   * @zh 输入属性 `summaryRow`（类型：`boolean`），用于配置汇总行。
   */
  @Input() summaryRow: boolean;
  /**
   * Input property `summaryPosition` (`string`) configuring summary position.
   * @zh 输入属性 `summaryPosition`（类型：`string`），用于配置汇总位置。
   */
  @Input() summaryPosition: string;
  /**
   * Input property `summaryHeight` (`number`) configuring summary height.
   * @zh 输入属性 `summaryHeight`（类型：`number`），用于配置汇总高度。
   */
  @Input() summaryHeight: number;
  /**
   * Input property `allowDrag` (`boolean`) configuring allow drag (default: `false`).
   * @zh 输入属性 `allowDrag`（类型：`boolean`），用于配置允许拖拽（默认值：`false`）。
   */
  @Input() allowDrag: boolean=false;

  /**
   * Input setter `pageSize` updating page size.
   * @zh 输入属性 `pageSize` 的设置器，用于更新页面尺寸。
   * @param val - New page size value (`number`) / 新的页面尺寸值（`number`）
   */
  @Input() set pageSize(val: number) {
    this._pageSize = val;
    this.recalcLayout();
  }

  /**
   * Gets the current page size (`pageSize: number`).
   * @zh 获取当前页面尺寸（`pageSize: number`）。
   */
  get pageSize(): number {
    return this._pageSize;
  }

  /**
   * Input setter `rows` updating rows.
   * @zh 输入属性 `rows` 的设置器，用于更新行列表。
   * @param val - New rows value (`any`) / 新的行列表值（`any`）
   */
  @Input() set rows(val) {
    this._rows = val;
    this.recalcLayout();
  }

  /**
   * Gets the current rows (`rows: any[]`).
   * @zh 获取当前行列表（`rows: any[]`）。
   */
  get rows() {
    return this._rows;
  }

  /**
   * Input setter `columns` updating columns.
   * @zh 输入属性 `columns` 的设置器，用于更新列集合。
   * @param val - New columns value (`any`) / 新的列集合值（`any`）
   */
  @Input() set columns(val) {
    this._columns = val;
    const colsByPin = columnsByPin(val);
    this.columnGroupWidths = columnGroupWidths(colsByPin, val);
    this.cd.detectChanges();
  }

  /**
   * Gets the current columns (`columns: any[]`).
   * @zh 获取当前列集合（`columns: any[]`）。
   */
  get columns() {
    return this._columns;
  }

  /**
   * Input setter `offset` updating offset.
   * @zh 输入属性 `offset` 的设置器，用于更新偏移量。
   * @param val - New offset value (`number`) / 新的偏移量值（`number`）
   */
  @Input() set offset(val: number) {
    this._offset = val;
    this.recalcLayout();
  }

  /**
   * Gets the current offset (`offset: number`).
   * @zh 获取当前偏移量（`offset: number`）。
   */
  get offset(): number {
    return this._offset;
  }

  /**
   * Input setter `rowCount` updating row count.
   * @zh 输入属性 `rowCount` 的设置器，用于更新行计数。
   * @param val - New row count value (`number`) / 新的行计数值（`number`）
   */
  @Input() set rowCount(val: number) {
    this._rowCount = val;
    this.recalcLayout();
  }

  /**
   * Gets the current row count (`rowCount: number`).
   * @zh 获取当前行计数（`rowCount: number`）。
   */
  get rowCount(): number {
    return this._rowCount;
  }

  /**
   * Host-bound getter `bodyWidth` (`string`) computing body width.
   * @zh 宿主绑定读取器 `bodyWidth`（绑定至 `style.width`），计算并返回主体宽度。
   */
  @HostBinding('style.width')
  get bodyWidth(): string {
    if (this.scrollbarH) {
      return this.innerWidth + 'px';
    } else {
      return '100%';
    }
  }

  /**
   * Input setter `bodyHeight` updating body height.
   * @zh 输入属性 `bodyHeight` 的设置器，用于更新主体高度。
   * @param val - New body height value (`any`) / 新的主体高度值（`any`）
   */
  @Input()
  @HostBinding('style.height')
  set bodyHeight(val) {
    if (this.scrollbarV) {
      this._bodyHeight = val + 'px';
    } else {
      this._bodyHeight = 'auto';
    }

    this.recalcLayout();
  }

  /**
   * Gets the current body height (`bodyHeight: any`).
   * @zh 获取当前主体高度（`bodyHeight: any`）。
   */
  get bodyHeight() {
    return this._bodyHeight;
  }

  /**
   * Output event emitter `scroll` (`EventEmitter<any>`) firing when scroll occurs.
   * @zh 输出事件 `scroll`（类型：`EventEmitter<any>`），当触发滚动时向外发出事件。
   */
  @Output() scroll = new EventEmitter();
  /**
   * Output event emitter `page` (`EventEmitter<any>`) firing when page occurs.
   * @zh 输出事件 `page`（类型：`EventEmitter<any>`），当触发页面时向外发出事件。
   */
  @Output() page = new EventEmitter();
  /**
   * Output event emitter `activate` (`EventEmitter<any>`) firing when activate occurs.
   * @zh 输出事件 `activate`（类型：`EventEmitter<any>`），当触发激活时向外发出事件。
   */
  @Output() activate = new EventEmitter();
  /**
   * Output event emitter `select` (`EventEmitter<any>`) firing when select occurs.
   * @zh 输出事件 `select`（类型：`EventEmitter<any>`），当触发下拉选择时向外发出事件。
   */
  @Output() select = new EventEmitter();
  /**
   * Output event emitter `detailToggle` (`EventEmitter<any>`) firing when detail toggle occurs.
   * @zh 输出事件 `detailToggle`（类型：`EventEmitter<any>`），当触发详情开关时向外发出事件。
   */
  @Output() detailToggle = new EventEmitter();
  /**
   * Output event emitter `rowContextmenu` (`EventEmitter<{ event: MouseEvent; row: any; }>`) firing when row contextmenu occurs.
   * @zh 输出事件 `rowContextmenu`（类型：`EventEmitter<{ event: MouseEvent; row: any; }>`），当触发行Contextmenu时向外发出事件。
   */
  @Output() rowContextmenu = new EventEmitter<{ event: MouseEvent; row }>(false);
  /**
   * Output event emitter `treeAction` (`EventEmitter<any>`) firing when tree action occurs.
   * @zh 输出事件 `treeAction`（类型：`EventEmitter<any>`），当触发树形控件动作时向外发出事件。
   */
  @Output() treeAction = new EventEmitter();

  /**
   * Template/content query reference `scroller` (`ScrollerComponent`) targeting scroller.
   * @zh 模板/内容视图查询引用 `scroller`（`@ViewChild`），指向滚动容器。
   */
  @ViewChild(ScrollerComponent) scroller: ScrollerComponent;

  /**
   * Returns if selection is enabled.

   * @zh 获取当前下拉选择已启用（`selectEnabled: boolean`）。
   */
  get selectEnabled(): boolean {
    return !!this.selectionType;
  }

  /**
   * Property that would calculate the height of scroll bar
   * based on the row heights cache for virtual scroll and virtualization. Other scenarios
   * calculate scroll height automatically (as height will be undefined).

   * @zh 获取当前滚动高度（`scrollHeight: number | undefined`）。
   */
  get scrollHeight(): number | undefined {
    if (this.scrollbarV && this.virtualization && this.rowCount) {
      return this.rowHeightsCache.query(this.rowCount - 1);
    }
    // avoid TS7030: Not all code paths return a value.
    return undefined;
  }

  /**
   * Property `rowHeightsCache` (`RowHeightCache`) storing row heights cache (default: `new RowHeightCache()`).
   * @zh 属性 `rowHeightsCache`（类型：`RowHeightCache`），用于存储或配置行高度缓存（默认值：`new RowHeightCache()`）。
   */
  rowHeightsCache: RowHeightCache = new RowHeightCache();
  /**
   * Property `temp` (`any[]`) storing temp (default: `[]`).
   * @zh 属性 `temp`（类型：`any[]`），用于存储或配置临时（默认值：`[]`）。
   */
  temp = [];
  /**
   * Property `offsetY` (`number`) storing offset y (default: `0`).
   * @zh 属性 `offsetY`（类型：`number`），用于存储或配置偏移量Y坐标（默认值：`0`）。
   */
  offsetY = 0;
  /**
   * Property `indexes` (`{ first?: number; last?: number; }`) storing indexes (default: `{}`).
   * @zh 属性 `indexes`（类型：`{ first?: number; last?: number; }`），用于存储或配置索引列表（默认值：`{}`）。
   */
  indexes: { first?: number; last?: number } = {};
  /**
   * Property `columnGroupWidths` (`any`) storing column group widths.
   * @zh 属性 `columnGroupWidths`（类型：`any`），用于存储或配置列分组宽度。
   */
  columnGroupWidths;
  /**
   * Property `columnGroupWidthsWithoutGroup` (`any`) storing column group widths without group.
   * @zh 属性 `columnGroupWidthsWithoutGroup`（类型：`any`），用于存储或配置列分组宽度不含分组。
   */
  columnGroupWidthsWithoutGroup;
  /**
   * Property `rowTrackingFn` (`any`) storing row tracking fn.
   * @zh 属性 `rowTrackingFn`（类型：`any`），用于存储或配置行Tracking函数。
   */
  rowTrackingFn;
  /**
   * 聚合 rowDetail / groupHeader 两路订阅，二者可同时启用。
   * @zh 聚合 rowDetail / groupHeader 两路订阅，二者可同时启用。
   */
  listener = new Subscription();
  /**
   * Property `rowIndexes` (`Map<any, any>`) storing row indexes (default: `new Map()`).
   * @zh 属性 `rowIndexes`（类型：`Map<any, any>`），用于存储或配置行索引列表（默认值：`new Map()`）。
   */
  rowIndexes = new Map();
  /**
   * Property `rowExpansions` (`any[]`) storing row expansions (default: `[]`).
   * @zh 属性 `rowExpansions`（类型：`any[]`），用于存储或配置行展开面板（默认值：`[]`）。
   */
  rowExpansions = [];

  /**
   * Property `_rows` (`any`) storing rows.
   * @zh 属性 `_rows`（类型：`any`），用于存储或配置行列表。
   */
  _rows;
  /**
   * Property `_bodyHeight` (`any`) storing body height.
   * @zh 属性 `_bodyHeight`（类型：`any`），用于存储或配置主体高度。
   */
  _bodyHeight;
  /**
   * Property `_columns` (`any`) storing columns.
   * @zh 属性 `_columns`（类型：`any`），用于存储或配置列集合。
   */
  _columns;
  /**
   * Property `_rowCount` (`number`) storing row count.
   * @zh 属性 `_rowCount`（类型：`number`），用于存储或配置行计数。
   */
  _rowCount: number;
  /**
   * Property `_offset` (`number`) storing offset.
   * @zh 属性 `_offset`（类型：`number`），用于存储或配置偏移量。
   */
  _offset: number;
  /**
   * Property `_pageSize` (`number`) storing page size.
   * @zh 属性 `_pageSize`（类型：`number`），用于存储或配置页面尺寸。
   */
  _pageSize: number;

  /**
   * Creates an instance of DataTableBodyComponent.

   * @zh 创建 `DataTableBodyComponent` 实例，并初始化其依赖项与内部状态。
   */
  constructor(private cd: ChangeDetectorRef) {
    // declare fn here so we can get access to the `this` property
    this.rowTrackingFn = (index: number, row) => {
      const idx = this.getRowIndex(row);
      if (this.trackByProp) {
        return row[this.trackByProp];
      } else {
        return idx;
      }
    };
  }

  /**
   * Called after the constructor, initializing input properties

   * @zh Angular 生命周期钩子：在组件或指令的输入属性初始化完成后调用一次。
   */
  ngOnInit(): void {
    if (this.rowDetail) {
      this.listener.add(this.rowDetail.toggle.subscribe(({ type, value }: { type: string; value }) => {
        if (type === 'row') {
          this.toggleRowExpansion(value);
        }
        if (type === 'all') {
          this.toggleAllRows(value);
        }

        // Refresh rows after toggle
        // Fixes #883
        this.updateIndexes();
        this.updateRows();
        this.cd.markForCheck();
      }));
    }

    if (this.groupHeader) {
      this.listener.add(this.groupHeader.toggle.subscribe(({ type, value }: { type: string; value }) => {
        if (type === 'group') {
          this.toggleRowExpansion(value);
        }
        if (type === 'all') {
          this.toggleAllRows(value);
        }

        // Refresh rows after toggle
        // Fixes #883
        this.updateIndexes();
        this.updateRows();
        this.cd.markForCheck();
      }));
    }
  }

  /**
   * Called once, before the instance is destroyed.

   * @zh Angular 生命周期钩子：在组件、指令或服务销毁前调用，用于释放订阅与清理资源。
   */
  ngOnDestroy(): void {
    this.listener.unsubscribe();
  }

  /**
   * Updates the Y offset given a new offset.

   * @zh 执行 `updateOffsetY`，用于更新偏移量Y坐标。
   */
  updateOffsetY(offset?: number): void {
    // scroller is missing on empty table
    if (!this.scroller) {
      return;
    }

    if (this.scrollbarV && this.virtualization && offset) {
      // First get the row Index that we need to move to.
      const rowIndex = this.pageSize * offset;
      offset = this.rowHeightsCache.query(rowIndex - 1);
    } else if (this.scrollbarV && !this.virtualization) {
      offset = 0;
    }

    this.scroller.setOffset(offset || 0);
  }

  /**
   * Body was scrolled, this is mainly useful for
   * when a user is server-side pagination via virtual scroll.

   * @zh 执行 `onBodyScroll`，用于当主体滚动。
   */
  onBodyScroll(event): void {
    const scrollYPos: number = event.scrollYPos;
    const scrollXPos: number = event.scrollXPos;

    // if scroll change, trigger update
    // this is mainly used for header cell positions
    if (this.offsetY !== scrollYPos || this.offsetX !== scrollXPos) {
      this.scroll.emit({
        offsetY: scrollYPos,
        offsetX: scrollXPos
      });
    }

    this.offsetY = scrollYPos;
    this.offsetX = scrollXPos;

    this.updateIndexes();
    this.updatePage(event.direction);
    this.updateRows();
  }

  /**
   * Updates the page given a direction.

   * @zh 执行 `updatePage`，用于更新页面。
   */
  updatePage(direction: string): void {
    let offset = this.indexes.first / this.pageSize;

    if (direction === 'up') {
      offset = Math.ceil(offset);
    } else if (direction === 'down') {
      offset = Math.floor(offset);
    }

    if (direction !== undefined && !isNaN(offset)) {
      this.page.emit({ offset });
    }
  }

  /**
   * Updates the rows in the view port

   * @zh 执行 `updateRows`，用于更新行列表。
   */
  updateRows(): void {
    const { first, last } = this.indexes;
    let rowIndex = first;
    let idx = 0;
    const temp = [];

    this.rowIndexes.clear();

    // if grouprowsby has been specified treat row paging
    // parameters as group paging parameters ie if limit 10 has been
    // specified treat it as 10 groups rather than 10 rows
    if (this.groupedRows) {
      let maxRowsPerGroup = 3;
      // if there is only one group set the maximum number of
      // rows per group the same as the total number of rows
      if (this.groupedRows.length === 1) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        maxRowsPerGroup = this.groupedRows[0].value.length;
      }

      while (rowIndex < last && rowIndex < this.groupedRows.length) {
        // Add the groups into this page
        const group = this.groupedRows[rowIndex];
        temp[idx] = group;
        // rowIndexes was only ever populated in the non-grouped branch below; every
        // group row looked up via getRowIndex() fell through to its `|| 0` default,
        // so *ngFor's trackBy saw every visible row/group claim identity 0.
        this.rowIndexes.set(group, rowIndex);
        idx++;

        // Group index in this context
        rowIndex++;
      }
    } else {
      while (rowIndex < last && rowIndex < this.rowCount) {
        const row = this.rows[rowIndex];

        if (row) {
          this.rowIndexes.set(row, rowIndex);
          temp[idx] = row;
        }

        idx++;
        rowIndex++;
      }
    }

    this.temp = temp;
  }

  /**
   * Get the row height

   * @zh 执行 `getRowHeight`，用于获取行高度。
   */
  getRowHeight(row): number {
    // if its a function return it
    if (typeof this.rowHeight === 'function') {
      return this.rowHeight(row);
    }

    return this.rowHeight as number;
  }

  /**
   * @param group the group with all rows

   * @zh 执行 `getGroupHeight`，用于获取分组高度。
   */
  getGroupHeight(group): number {
    let rowHeight = 0;

    if (group.value) {
      for (let index = 0; index < group.value.length; index++) {
        rowHeight += this.getRowAndDetailHeight(group.value[index]);
      }
    }

    return rowHeight;
  }

  /**
   * Calculate row height based on the expanded state of the row.

   * @zh 执行 `getRowAndDetailHeight`，用于获取行And详情高度。
   */
  getRowAndDetailHeight(row): number {
    let rowHeight = this.getRowHeight(row);
    const expanded = this.getRowExpanded(row);

    // Adding detail row height if its expanded.
    if (expanded) {
      rowHeight += this.getDetailRowHeight(row);
    }

    return rowHeight;
  }

  /**
   * Get the height of the detail row.

   * @zh 属性 `getDetailRowHeight`（类型：`(row?: any, index?: any) => number`），用于存储或配置获取详情行高度。
   */
  getDetailRowHeight = (row?, index?): number => {
    if (!this.rowDetail) {
      return 0;
    }
    const rowHeight = this.rowDetail.rowHeight;
    return typeof rowHeight === 'function' ? rowHeight(row, index) : (rowHeight as number);
  };

  /**
   * Calculates the styles for the row so that the rows can be moved in 2D space
   * during virtual scroll inside the DOM.   In the below case the Y position is
   * manipulated.   As an example, if the height of row 0 is 30 px and row 1 is
   * 100 px then following styles are generated:
   *
   * transform: translate3d(0px, 0px, 0px);    ->  row0
   * transform: translate3d(0px, 30px, 0px);   ->  row1
   * transform: translate3d(0px, 130px, 0px);  ->  row2
   *
   * Row heights have to be calculated based on the row heights cache as we wont
   * be able to determine which row is of what height before hand.  In the above
   * case the positionY of the translate3d for row2 would be the sum of all the
   * heights of the rows before it (i.e. row0 and row1).
   *
   * @param rows the row that needs to be placed in the 2D space.
   * @returns the CSS3 style to be applied
   *
   * @memberOf DataTableBodyComponent

   * @zh 执行 `getRowsStyles`，用于获取行列表样式集合。
   */
  getRowsStyles(rows) {
    const styles: { width? } = {};

    // only add styles for the group if there is a group
    if (this.groupedRows) {
      styles.width = this.columnGroupWidths.total;
    }

    if (this.scrollbarV && this.virtualization) {
      let idx = 0;

      if (this.groupedRows) {
        // Get the latest row rowindex in a group
        const row = rows[rows.length - 1];
        idx = row ? this.getRowIndex(row) : 0;
      } else {
        idx = this.getRowIndex(rows);
      }

      // const pos = idx * rowHeight;
      // The position of this row would be the sum of all row heights
      // until the previous row position.
      const pos = this.rowHeightsCache.query(idx - 1);

      translateXY(styles, 0, pos);
    }
    return styles;
  }

  /**
   * Calculate bottom summary row offset for scrollbar mode.
   * For more information about cache and offset calculation
   * see description for `getRowsStyles` method
   *
   * @returns the CSS3 style to be applied
   *
   * @memberOf DataTableBodyComponent

   * @zh 执行 `getBottomSummaryRowStyles`，用于获取底部位置汇总行样式集合。
   */
  getBottomSummaryRowStyles() {
    if (!this.scrollbarV || !this.rows || !this.rows.length) {
      return null;
    }

    const styles = { position: 'absolute' };
    const pos = this.rowHeightsCache.query(this.rows.length - 1);

    translateXY(styles, 0, pos);

    return styles;
  }

  /**
   * Hides the loading indicator

   * @zh 执行 `hideIndicator`，用于隐藏指示器。
   */
  hideIndicator(): void {
    setTimeout(() => (this.loadingIndicator = false), 500);
  }

  /**
   * Updates the index of the rows in the viewport

   * @zh 执行 `updateIndexes`，用于更新索引列表。
   */
  updateIndexes(): void {
    let first = 0;
    let last = 0;

    if (this.scrollbarV) {
      if (this.virtualization) {
        // Calculation of the first and last indexes will be based on where the
        // scrollY position would be at.  The last index would be the one
        // that shows up inside the view port the last.
        const height = parseInt(this.bodyHeight, 0);
        first = this.rowHeightsCache.getRowIndex(this.offsetY);
        last = this.rowHeightsCache.getRowIndex(height + this.offsetY) + 1;
      } else {
        // If virtual rows are not needed
        // We render all in one go
        first = 0;
        last = this.rowCount;
      }
    } else {
      // The server is handling paging and will pass an array that begins with the
      // element at a specified offset.  first should always be 0 with external paging.
      if (!this.externalPaging) {
        first = Math.max(this.offset * this.pageSize, 0);
      }
      last = Math.min(first + this.pageSize, this.rowCount);
    }

    this.indexes = { first, last };
  }

  /**
   * Refreshes the full Row Height cache.  Should be used
   * when the entire row array state has changed.

   * @zh 执行 `refreshRowHeightCache`，用于刷新行高度缓存。
   */
  refreshRowHeightCache(): void {
    if (!this.scrollbarV || (this.scrollbarV && !this.virtualization)) {
      return;
    }

    // clear the previous row height cache if already present.
    // this is useful during sorts, filters where the state of the
    // rows array is changed.
    this.rowHeightsCache.clearCache();

    // Initialize the tree only if there are rows inside the tree.
    if (this.rows && this.rows.length) {
      const rowExpansions = new Set();
      for (const row of this.rows) {
        if (this.getRowExpanded(row)) {
          rowExpansions.add(row);
        }
      }

      this.rowHeightsCache.initCache({
        rows: this.rows,
        rowHeight: this.rowHeight,
        detailRowHeight: this.getDetailRowHeight,
        externalVirtual: this.scrollbarV && this.externalPaging,
        rowCount: this.rowCount,
        rowIndexes: this.rowIndexes,
        rowExpansions
      });
    }
  }

  /**
   * Gets the index for the view port

   * @zh 执行 `getAdjustedViewPortIndex`，用于获取Adjusted视图Port索引。
   */
  getAdjustedViewPortIndex(): number {
    // Capture the row index of the first row that is visible on the viewport.
    // If the scroll bar is just below the row which is highlighted then make that as the
    // first index.
    const viewPortFirstRowIndex = this.indexes.first;

    if (this.scrollbarV && this.virtualization) {
      const offsetScroll = this.rowHeightsCache.query(viewPortFirstRowIndex - 1);
      return offsetScroll <= this.offsetY ? viewPortFirstRowIndex - 1 : viewPortFirstRowIndex;
    }

    return viewPortFirstRowIndex;
  }

  /**
   * Toggle the Expansion of the row i.e. if the row is expanded then it will
   * collapse and vice versa.   Note that the expanded status is stored as
   * a part of the row object itself as we have to preserve the expanded row
   * status in case of sorting and filtering of the row set.

   * @zh 执行 `toggleRowExpansion`，用于开关行展开面板。
   */
  toggleRowExpansion(row): void {
    // Capture the row index of the first row that is visible on the viewport.
    const viewPortFirstRowIndex = this.getAdjustedViewPortIndex();
    const rowExpandedIdx = this.getRowExpandedIdx(row, this.rowExpansions);
    const expanded = rowExpandedIdx > -1;

    // If the detailRowHeight is auto --> only in case of non-virtualized scroll
    if (this.scrollbarV && this.virtualization) {
      const detailRowHeight = this.getDetailRowHeight(row) * (expanded ? -1 : 1);
      // const idx = this.rowIndexes.get(row) || 0;
      const idx = this.getRowIndex(row);
      this.rowHeightsCache.update(idx, detailRowHeight);
    }

    // Update the toggled row and update thive nevere heights in the cache.
    if (expanded) {
      this.rowExpansions.splice(rowExpandedIdx, 1);
    } else {
      this.rowExpansions.push(row);
    }

    this.detailToggle.emit({
      rows: [row],
      currentIndex: viewPortFirstRowIndex
    });
  }

  /**
   * Expand/Collapse all the rows no matter what their state is.

   * @zh 执行 `toggleAllRows`，用于开关全部行列表。
   */
  toggleAllRows(expanded: boolean): void {
    // clear prev expansions
    this.rowExpansions = [];

    // Capture the row index of the first row that is visible on the viewport.
    const viewPortFirstRowIndex = this.getAdjustedViewPortIndex();

    if (expanded) {
      for (const row of this.rows) {
        this.rowExpansions.push(row);
      }
    }

    if (this.scrollbarV) {
      // Refresh the full row heights cache since every row was affected.
      this.recalcLayout();
    }

    // Emit all rows that have been expanded.
    this.detailToggle.emit({
      rows: this.rows,
      currentIndex: viewPortFirstRowIndex
    });
  }

  /**
   * Recalculates the table

   * @zh 执行 `recalcLayout`，用于recalc布局。
   */
  recalcLayout(): void {
    this.refreshRowHeightCache();
    this.updateIndexes();
    this.updateRows();
  }

  /**
   * Tracks the column

   * @zh 执行 `columnTrackingFn`，用于列Tracking函数。
   */
  columnTrackingFn(index: number, column) {
    return column.$$id;
  }

  /**
   * Gets the row pinning group styles

   * @zh 执行 `stylesByGroup`，用于样式集合按分组。
   */
  stylesByGroup(group: string) {
    const widths = this.columnGroupWidths;
    const offsetX = this.offsetX;

    const styles = {
      width: `${widths[group]}px`
    };

    if (group === 'left') {
      translateXY(styles, offsetX, 0);
    } else if (group === 'right') {
      const bodyWidth = parseInt(this.innerWidth + '', 0);
      const totalDiff = widths.total - bodyWidth;
      const offsetDiff = totalDiff - offsetX;
      const offset = offsetDiff * -1;
      translateXY(styles, offset, 0);
    }

    return styles;
  }

  /**
   * Returns if the row was expanded and set default row expansion when row expansion is empty

   * @zh 执行 `getRowExpanded`，用于获取行已展开。
   */
  getRowExpanded(row): boolean {
    if (this.rowExpansions.length === 0 && this.groupExpansionDefault && this.groupedRows) {
      for (const group of this.groupedRows) {
        this.rowExpansions.push(group);
      }
    }

    return this.getRowExpandedIdx(row, this.rowExpansions) > -1;
  }

  /**
   * Executes `getRowExpandedIdx` to handle get row expanded idx.
   * @zh 执行 `getRowExpandedIdx`，用于获取行已展开索引。
   * @param row - row parameter (`any`) / 行参数（`any`）
   * @param expanded - expanded parameter (`any`) / 已展开参数（`any`）
   * @returns Result of type `number` / 类型为 `number` 的返回值
   */
  getRowExpandedIdx(row, expanded): number {
    if (!expanded || !expanded.length) return -1;

    const rowId = this.rowIdentity(row);
    return expanded.findIndex((r) => {
      const id = this.rowIdentity(r);
      return id === rowId;
    });
  }

  /**
   * Gets the row index given a row

   * @zh 执行 `getRowIndex`，用于获取行索引。
   */
  getRowIndex(row): number {
    // `|| 0` treated "not found" the same as "found at index 0", which is exactly the
    // sentinel value that made the grouped-rows trackBy bug invisible -- use a value
    // that can never collide with a legitimate index instead.
    const idx = this.rowIndexes.get(row);
    return idx === undefined ? -1 : idx;
  }

  /**
   * Executes `onTreeAction` to handle on tree action.
   * @zh 执行 `onTreeAction`，用于当树形控件动作。
   * @param row - row parameter (`any`) / 行参数（`any`）
   */
  onTreeAction(row) {
    this.treeAction.emit({ row });
  }
}
