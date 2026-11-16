/**
 * @fileoverview Module `src/data/datatable/row/cell.component.ts` providing cell component definitions and implementation.
 * @zh 模块文件 `src/data/datatable/row/cell.component.ts`，提供单元格组件相关的定义与实现。
 */

import {
  Component, Input, PipeTransform, HostBinding, ViewChild, ChangeDetectorRef,
  Output, EventEmitter, HostListener, ElementRef, ViewContainerRef, OnDestroy, DoCheck,
  ChangeDetectionStrategy
} from '@angular/core';

import { Keys } from '../utils/keys';
import { SortDirection } from '../types/sort-direction.type';
import { TableColumn } from '../types/table-column.type';
import { TranslatePipe } from '@dotos1/dui/translator';

/**
 * Type alias `TreeStatus` representing tree status (`'collapsed' | 'expanded' | 'loading' | 'disabled'`).
 * @zh 类型别名 `TreeStatus`，表示树形控件状态（`'collapsed' | 'expanded' | 'loading' | 'disabled'`）。
 */
export type TreeStatus = 'collapsed' | 'expanded' | 'loading' | 'disabled';

/**
 * Angular component `DataTableBodyCellComponent` (selector: 'datatable-body-cell') providing data table body cell component presentation and interaction in `src/data/datatable/row`.
 * @zh Angular 组件 `DataTableBodyCellComponent`（selector: 'datatable-body-cell'），提供数据表格主体单元格组件的视图渲染与交互逻辑（位于 `src/data/datatable/row`）。
 */
@Component({
  selector: 'datatable-body-cell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'cell.component.html',
  providers:[TranslatePipe],
  standalone: false
})

export class DataTableBodyCellComponent implements DoCheck, OnDestroy {
  /**
   * Input setter `displayCheck` updating display check.
   * @zh 输入属性 `displayCheck` 的设置器，用于更新display检查。
   * @param f - New display check value (`boolean | Function`) / 新的display检查值（`boolean | Function`）
   */
  @Input() set  displayCheck(f){
    this._displayCheck= f;
  }

  /**
   * Gets the current display check (`displayCheck: any`).
   * @zh 获取当前display检查（`displayCheck: any`）。
   */
  get displayCheck() {
    return this._displayCheck;
  }

  /**
   * Executes `isDisplayCheck` to handle is display check.
   * @zh 执行 `isDisplayCheck`，用于是否为Display检查。
   * @param row - row parameter (`any`) / 行参数（`any`）
   * @param column - column parameter (`any`) / 列参数（`any`）
   * @param value - value parameter (`any`) / 值参数（`any`）
   */
  isDisplayCheck(row, column, value) {
    if(typeof this._displayCheck=='function'){
      return this._displayCheck(row, column, value)
    }else{
      return this._displayCheck;
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  /**
   * Property `_displayCheck` (`boolean | Function`) storing display check.
   * @zh 属性 `_displayCheck`（类型：`boolean | Function`），用于存储或配置display检查。
   */
  _displayCheck:Function|boolean= (row, column?: TableColumn, value?)=>{return false};
  /**
   * Input setter `group` updating group.
   * @zh 输入属性 `group` 的设置器，用于更新分组。
   * @param group - New group value (`any`) / 新的分组值（`any`）
   */
  @Input() set group(group) {
    this._group = group;
    this.cellContext.group = group;
    this.checkValueUpdates();
    this.cd.markForCheck();
  }

  /**
   * Gets the current group (`group: any`).
   * @zh 获取当前分组（`group: any`）。
   */
  get group() {
    return this._group;
  }

  /**
   * Input setter `rowHeight` updating row height.
   * @zh 输入属性 `rowHeight` 的设置器，用于更新行高度。
   * @param val - New row height value (`number`) / 新的行高度值（`number`）
   */
  @Input() set rowHeight(val: number) {
    this._rowHeight = val;
    this.cellContext.rowHeight = val;
    this.checkValueUpdates();
    this.cd.markForCheck();
  }

  /**
   * Gets the current row height (`rowHeight: any`).
   * @zh 获取当前行高度（`rowHeight: any`）。
   */
  get rowHeight() {
    return this._rowHeight;
  }

  /**
   * Input setter `isSelected` updating is selected.
   * @zh 输入属性 `isSelected` 的设置器，用于更新是否为已选中。
   * @param val - New is selected value (`boolean`) / 新的是否为已选中值（`boolean`）
   */
  @Input() set isSelected(val: boolean) {
    this._isSelected = val;
    this.cellContext.isSelected = val;
    this.cd.markForCheck();
  }

  /**
   * Gets the current is selected (`isSelected: boolean`).
   * @zh 获取当前是否为已选中（`isSelected: boolean`）。
   */
  get isSelected(): boolean {
    return this._isSelected;
  }

  /**
   * Input setter `expanded` updating expanded.
   * @zh 输入属性 `expanded` 的设置器，用于更新已展开。
   * @param val - New expanded value (`boolean`) / 新的已展开值（`boolean`）
   */
  @Input() set expanded(val: boolean) {
    this._expanded = val;
    this.cellContext.expanded = val;
    this.cd.markForCheck();
  }

  /**
   * Gets the current expanded (`expanded: boolean`).
   * @zh 获取当前已展开（`expanded: boolean`）。
   */
  get expanded(): boolean {
    return this._expanded;
  }

  /**
   * Input setter `rowIndex` updating row index.
   * @zh 输入属性 `rowIndex` 的设置器，用于更新行索引。
   * @param val - New row index value (`number`) / 新的行索引值（`number`）
   */
  @Input() set rowIndex(val: number) {
    this._rowIndex = val;
    this.cellContext.rowIndex = val;
    this.checkValueUpdates();
    this.cd.markForCheck();
  }

  /**
   * Gets the current row index (`rowIndex: number`).
   * @zh 获取当前行索引（`rowIndex: number`）。
   */
  get rowIndex(): number {
    return this._rowIndex;
  }

  /**
   * Input setter `column` updating column.
   * @zh 输入属性 `column` 的设置器，用于更新列。
   * @param column - New column value (`TableColumn`) / 新的列值（`TableColumn`）
   */
  @Input() set column(column: TableColumn) {
    this._column = column;
    this.cellContext.column = column;
    this.checkValueUpdates();
    this.cd.markForCheck();
  }

  /**
   * Gets the current column (`column: TableColumn`).
   * @zh 获取当前列（`column: TableColumn`）。
   */
  get column(): TableColumn {
    return this._column;
  }

  /**
   * Input setter `row` updating row.
   * @zh 输入属性 `row` 的设置器，用于更新行。
   * @param row - New row value (`any`) / 新的行值（`any`）
   */
  @Input() set row(row) {
    this._row = row;
    this.cellContext.row = row;
    this.checkValueUpdates();
    this.cd.markForCheck();
  }

  /**
   * Gets the current row (`row: any`).
   * @zh 获取当前行（`row: any`）。
   */
  get row() {
    return this._row;
  }

  /**
   * Input setter `sorts` updating sorts.
   * @zh 输入属性 `sorts` 的设置器，用于更新排序集合。
   * @param val - New sorts value (`any`) / 新的排序集合值（`any`）
   */
  @Input() set sorts(val) {
    this._sorts = val;
    this.sortDir = this.calcSortDir(val);
  }

  /**
   * Gets the current sorts (`sorts: any[]`).
   * @zh 获取当前排序集合（`sorts: any[]`）。
   */
  get sorts() {
    return this._sorts;
  }

  /**
   * Input setter `treeStatus` updating tree status.
   * @zh 输入属性 `treeStatus` 的设置器，用于更新树形控件状态。
   * @param status - New tree status value (`TreeStatus`) / 新的树形控件状态值（`TreeStatus`）
   */
  @Input() set treeStatus(status: TreeStatus) {
    if (status !== 'collapsed' && status !== 'expanded' && status !== 'loading' && status !== 'disabled') {
      this._treeStatus = 'collapsed';
    } else {
      this._treeStatus = status;
    }
    this.cellContext.treeStatus = this._treeStatus;
    this.checkValueUpdates();
    this.cd.markForCheck();
  }

  /**
   * Gets the current tree status (`treeStatus: TreeStatus`).
   * @zh 获取当前树形控件状态（`treeStatus: TreeStatus`）。
   */
  get treeStatus(): TreeStatus {
    return this._treeStatus;
  }

  /**
   * Output event emitter `activate` (`EventEmitter<any>`) firing when activate occurs.
   * @zh 输出事件 `activate`（类型：`EventEmitter<any>`），当触发激活时向外发出事件。
   */
  @Output() activate = new EventEmitter();

  /**
   * Output event emitter `treeAction` (`EventEmitter<any>`) firing when tree action occurs.
   * @zh 输出事件 `treeAction`（类型：`EventEmitter<any>`），当触发树形控件动作时向外发出事件。
   */
  @Output() treeAction = new EventEmitter();

  /**
   * Template/content query reference `cellTemplate` (`ViewContainerRef`) targeting cell template.
   * @zh 模板/内容视图查询引用 `cellTemplate`（`@ViewChild`），指向单元格模板。
   */
  @ViewChild('cellTemplate', { read: ViewContainerRef, static: true })
  cellTemplate: ViewContainerRef;

  /**
   * Host-bound getter `columnCssClasses` (`string`) computing column css classes.
   * @zh 宿主绑定读取器 `columnCssClasses`（绑定至 `class`），计算并返回列CSS样式类名集合。
   */
  @HostBinding('class')
  get columnCssClasses() {
    let cls = 'datatable-body-cell';
    if (this.column.cellClass) {
      if (typeof this.column.cellClass === 'string') {
        cls += ' ' + this.column.cellClass;
      } else if (typeof this.column.cellClass === 'function') {
        const res = this.column.cellClass({
          row: this.row,
          group: this.group,
          column: this.column,
          value: this.value,
          rowHeight: this.rowHeight
        });

        if (typeof res === 'string') {
          cls += res;
        } else if (typeof res === 'object') {
          const keys = Object.keys(res);
          for (const k of keys) {
            if (res[k] === true) {
              cls += ` ${k}`;
            }
          }
        }
      }
    }
    if (!this.sortDir) {
      cls += ' sort-active';
    }
    if (this.isFocused) {
      cls += ' active';
    }
    if (this.sortDir === SortDirection.asc) {
      cls += ' sort-asc';
    }
    if (this.sortDir === SortDirection.desc) {
      cls += ' sort-desc';
    }

    return cls;
  }

  /**
   * Host-bound getter `width` (`number`) computing width.
   * @zh 宿主绑定读取器 `width`（绑定至 `style.width.px`），计算并返回宽度。
   */
  @HostBinding('style.width.px')
  get width(): number {
    return this.column.width;
  }

  /**
   * Host-bound getter `minWidth` (`number`) computing min width.
   * @zh 宿主绑定读取器 `minWidth`（绑定至 `style.minWidth.px`），计算并返回最小值宽度。
   */
  @HostBinding('style.minWidth.px')
  get minWidth(): number {
    return this.column.minWidth;
  }

  /**
   * Host-bound getter `maxWidth` (`number`) computing max width.
   * @zh 宿主绑定读取器 `maxWidth`（绑定至 `style.maxWidth.px`），计算并返回最大值宽度。
   */
  @HostBinding('style.maxWidth.px')
  get maxWidth(): number {
    return this.column.maxWidth;
  }

  /**
   * Host-bound getter `height` (`string | number`) computing height.
   * @zh 宿主绑定读取器 `height`（绑定至 `style.height`），计算并返回高度。
   */
  @HostBinding('style.height')
  get height(): string | number {
    const height = this.rowHeight;
    if (isNaN(height)) {
      return height;
    }
    return height + 'px';
  }

  /**
   * Property `sanitizedValue` (`any`) storing sanitized value.
   * @zh 属性 `sanitizedValue`（类型：`any`），用于存储或配置sanitized值。
   */
  sanitizedValue;
  /**
   * Property `value` (`any`) storing value (default: `undefined`).
   * @zh 属性 `value`（类型：`any`），用于存储或配置值（默认值：`undefined`）。
   */
  value=undefined;
  /**
   * Property `sortDir` (`SortDirection`) storing sort dir.
   * @zh 属性 `sortDir`（类型：`SortDirection`），用于存储或配置排序目录。
   */
  sortDir: SortDirection;
  /**
   * Property `isFocused` (`boolean`) storing is focused (default: `false`).
   * @zh 属性 `isFocused`（类型：`boolean`），用于存储或配置是否为已聚焦（默认值：`false`）。
   */
  isFocused = false;
  /**
   * Property `onCheckboxChangeFn` (`any`) storing on checkbox change fn (default: `this.onCheckboxChange.bind(this)`).
   * @zh 属性 `onCheckboxChangeFn`（类型：`any`），用于存储或配置当复选框变更函数（默认值：`this.onCheckboxChange.bind(this)`）。
   */
  onCheckboxChangeFn = this.onCheckboxChange.bind(this);
  /**
   * Property `activateFn` (`any`) storing activate fn (default: `this.activate.emit.bind(this.activate)`).
   * @zh 属性 `activateFn`（类型：`any`），用于存储或配置激活函数（默认值：`this.activate.emit.bind(this.activate)`）。
   */
  activateFn = this.activate.emit.bind(this.activate);

  /**
   * Property `cellContext` (`{…}`) storing cell context.
   * @zh 属性 `cellContext`（类型：`{…}`），用于存储或配置单元格上下文。
   */
  cellContext = {
    onCheckboxChangeFn: this.onCheckboxChangeFn,
    activateFn: this.activateFn,
    row: this.row,
    group: this.group,
    value: this.value,
    column: this.column,
    rowHeight: this.rowHeight,
    isSelected: this.isSelected,
    rowIndex: this.rowIndex,
    treeStatus: this.treeStatus,
    expanded: this.expanded,
    onTreeAction: this.onTreeAction.bind(this)
  };

  /**
   * Property `_isSelected` (`boolean`) storing is selected.
   * @zh 属性 `_isSelected`（类型：`boolean`），用于存储或配置是否为已选中。
   */
  private _isSelected: boolean;
  /**
   * Property `_sorts` (`any`) storing sorts.
   * @zh 属性 `_sorts`（类型：`any`），用于存储或配置排序集合。
   */
  private _sorts;
  /**
   * Property `_column` (`TableColumn`) storing column.
   * @zh 属性 `_column`（类型：`TableColumn`），用于存储或配置列。
   */
  private _column: TableColumn;
  /**
   * Property `_row` (`any`) storing row.
   * @zh 属性 `_row`（类型：`any`），用于存储或配置行。
   */
  private _row;
  /**
   * Property `_group` (`any`) storing group.
   * @zh 属性 `_group`（类型：`any`），用于存储或配置分组。
   */
  private _group;
  /**
   * Property `_rowHeight` (`number`) storing row height.
   * @zh 属性 `_rowHeight`（类型：`number`），用于存储或配置行高度。
   */
  private _rowHeight: number;
  /**
   * Property `_rowIndex` (`number`) storing row index.
   * @zh 属性 `_rowIndex`（类型：`number`），用于存储或配置行索引。
   */
  private _rowIndex: number;
  /**
   * Property `_expanded` (`boolean`) storing expanded.
   * @zh 属性 `_expanded`（类型：`boolean`），用于存储或配置已展开。
   */
  private _expanded: boolean;
  /**
   * Property `_element` (`any`) storing element.
   * @zh 属性 `_element`（类型：`any`），用于存储或配置元素。
   */
  private _element;
  /**
   * Property `_treeStatus` (`TreeStatus`) storing tree status.
   * @zh 属性 `_treeStatus`（类型：`TreeStatus`），用于存储或配置树形控件状态。
   */
  private _treeStatus: TreeStatus;

  /**
   * Creates an instance of `DataTableBodyCellComponent` and initializes its dependencies and internal state.
   * @zh 创建 `DataTableBodyCellComponent` 实例，并初始化其依赖项与内部状态。
   * @param element - Injected or initial element (`ElementRef<any>`) / 注入或传入的元素（`ElementRef<any>`）
   * @param cd - Injected or initial cd (`ChangeDetectorRef`) / 注入或传入的cd（`ChangeDetectorRef`）
   */
  constructor(element: ElementRef, private cd: ChangeDetectorRef) {
    this._element = element.nativeElement;
  }

  /**
   * Angular lifecycle hook invoked during every change-detection run for custom change detection.
   * @zh Angular 生命周期钩子：在每次变更检测周期中调用，用于执行自定义变更检测。
   */
  ngDoCheck(): void {
    this.checkValueUpdates();
  }

  /**
   * Angular lifecycle hook invoked just before the component, directive, or service is destroyed to release subscriptions and resources.
   * @zh Angular 生命周期钩子：在组件、指令或服务销毁前调用，用于释放订阅与清理资源。
   */
  ngOnDestroy(): void {
    if (this.cellTemplate) {
      this.cellTemplate.clear();
    }
  }

  /**
   * Executes `checkValueUpdates` to handle check value updates.
   * @zh 执行 `checkValueUpdates`，用于检查值更新。
   */
  checkValueUpdates(): void {
    let value = '';

    if (!this.row || !this.column) {
      value = '';
    } else {
      const val = this.column.$$valueGetter(this.row, this.column.prop);
      const userPipe: PipeTransform = this.column.pipe;

      if (userPipe) {
        value = userPipe.transform(val);
      } else if (value !== undefined) {
        value = val;
      }
    }

    if (this.value !== value) {
      this.value = value;
      this.cellContext.value = value;
      this.sanitizedValue = value !== null && value !== undefined ? this.stripHtml(value) : value;
      this.cd.markForCheck();
    }
  }

  /**
   * Host event listener `onFocus` handling `focus` events for on focus.
   * @zh 宿主事件监听方法 `onFocus`，响应 `focus` 事件以处理当聚焦。
   */
  @HostListener('focus')
  onFocus(): void {
    this.isFocused = true;
  }

  /**
   * Host event listener `onBlur` handling `blur` events for on blur.
   * @zh 宿主事件监听方法 `onBlur`，响应 `blur` 事件以处理当失焦。
   */
  @HostListener('blur')
  onBlur(): void {
    this.isFocused = false;
  }

  /**
   * Host event listener `onClick` handling `click` events for on click.
   * @zh 宿主事件监听方法 `onClick`，响应 `click` 事件以处理当点击。
   * @param event - event parameter (`MouseEvent`) / 事件参数（`MouseEvent`）
   */
  @HostListener('click', ['$event'])
  onClick(event: MouseEvent): void {
    this.activate.emit({
      type: 'click',
      event,
      row: this.row,
      group: this.group,
      rowHeight: this.rowHeight,
      column: this.column,
      value: this.value,
      cellElement: this._element
    });
  }

  /**
   * Host event listener `onDblClick` handling `dblclick` events for on dbl click.
   * @zh 宿主事件监听方法 `onDblClick`，响应 `dblclick` 事件以处理当Dbl点击。
   * @param event - event parameter (`MouseEvent`) / 事件参数（`MouseEvent`）
   */
  @HostListener('dblclick', ['$event'])
  onDblClick(event: MouseEvent): void {
    this.activate.emit({
      type: 'dblclick',
      event,
      row: this.row,
      group: this.group,
      rowHeight: this.rowHeight,
      column: this.column,
      value: this.value,
      cellElement: this._element
    });
  }

  /**
   * Host event listener `onKeyDown` handling `keydown` events for on key down.
   * @zh 宿主事件监听方法 `onKeyDown`，响应 `keydown` 事件以处理当键向下。
   * @param event - event parameter (`KeyboardEvent`) / 事件参数（`KeyboardEvent`）
   */
  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    const keyCode = event.keyCode;
    const isTargetCell = event.target === this._element;

    const isAction =
      keyCode === Keys.return ||
      keyCode === Keys.down ||
      keyCode === Keys.up ||
      keyCode === Keys.left ||
      keyCode === Keys.right;

    if (isAction && isTargetCell) {
      event.preventDefault();
      event.stopPropagation();

      this.activate.emit({
        type: 'keydown',
        event,
        row: this.row,
        group: this.group,
        rowHeight: this.rowHeight,
        column: this.column,
        value: this.value,
        cellElement: this._element
      });
    }
  }

  /**
   * Executes `onCheckboxChange` to handle on checkbox change.
   * @zh 执行 `onCheckboxChange`，用于当复选框变更。
   * @param event - event parameter (`any`) / 事件参数（`any`）
   */
  onCheckboxChange(event): void {
    this.activate.emit({
      type: 'checkbox',
      event,
      row: this.row,
      group: this.group,
      rowHeight: this.rowHeight,
      column: this.column,
      value: this.value,
      cellElement: this._element,
      treeStatus: 'collapsed'
    });
  }

  /**
   * Executes `calcSortDir` to handle calc sort dir.
   * @zh 执行 `calcSortDir`，用于计算排序目录。
   * @param sorts - sorts parameter (`any`) / 排序集合参数（`any`）
   * @returns Result of type `any` / 类型为 `any` 的返回值
   */
  calcSortDir(sorts) {
    if (!sorts) {
      return;
    }

    const sort = sorts.find((s: { prop? }) => {
      return s.prop === this.column.prop;
    });

    if (sort) {
      return sort.dir;
    }
  }

  /**
   * Executes `stripHtml` to handle strip html.
   * @zh 执行 `stripHtml`，用于stripHTML内容。
   * @param html - html parameter (`string`) / HTML内容参数（`string`）
   * @returns Result of type `string` / 类型为 `string` 的返回值
   */
  stripHtml(html: string): string {
    if (!html.replace) {
      return html;
    }
    return html.replace(/<\/?[^>]+(>|$)/g, '');
  }

  /**
   * Executes `onTreeAction` to handle on tree action.
   * @zh 执行 `onTreeAction`，用于当树形控件动作。
   */
  onTreeAction() {
    this.treeAction.emit(this.row);
  }

  /**
   * Executes `calcLeftMargin` to handle calc left margin.
   * @zh 执行 `calcLeftMargin`，用于计算左侧位置外边距。
   * @param column - column parameter (`any`) / 列参数（`any`）
   * @param row - row parameter (`any`) / 行参数（`any`）
   */
  calcLeftMargin(column, row) {
    const levelIndent = column.treeLevelIndent != null ? column.treeLevelIndent : 50;
    return column.isTreeColumn ? row.level * levelIndent : 0;
  }
}
