/**
 * @fileoverview Module `src/data/datatable/header/header-cell.component.ts` providing header cell component definitions and implementation.
 * @zh 模块文件 `src/data/datatable/header/header-cell.component.ts`，提供表头单元格组件相关的定义与实现。
 */

import {
  Component, Input, EventEmitter, Output, HostBinding,
  HostListener, ChangeDetectionStrategy, ChangeDetectorRef
} from '@angular/core';
import { SortDirection} from '../types/sort-direction.type';
import { SortType} from '../types/sort.type';
import { SelectionType } from '../types/selection.type';
import { TableColumn } from '../types/table-column.type';
import { nextSortDir } from '../utils/sort';

/**
 * Angular component `DataTableHeaderCellComponent` (selector: 'datatable-header-cell') providing data table header cell component presentation and interaction in `src/data/datatable/header`.
 * @zh Angular 组件 `DataTableHeaderCellComponent`（selector: 'datatable-header-cell'），提供数据表格表头单元格组件的视图渲染与交互逻辑（位于 `src/data/datatable/header`）。
 */
@Component({
  selector: 'datatable-header-cell',
  templateUrl: 'header-cell.component.html',
  host: {
    class: 'datatable-header-cell'
  },
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class DataTableHeaderCellComponent {
  /**
   * Input property `sortType` (`SortType`) configuring sort type.
   * @zh 输入属性 `sortType`（类型：`SortType`），用于配置排序类型。
   */
  @Input() sortType: SortType;
  /**
   * Input property `sortAscendingIcon` (`string`) configuring sort ascending icon.
   * @zh 输入属性 `sortAscendingIcon`（类型：`string`），用于配置排序Ascending图标。
   */
  @Input() sortAscendingIcon: string;
  /**
   * Input property `sortDescendingIcon` (`string`) configuring sort descending icon.
   * @zh 输入属性 `sortDescendingIcon`（类型：`string`），用于配置排序Descending图标。
   */
  @Input() sortDescendingIcon: string;

  /**
   * Input property `isTarget` (`boolean`) configuring is target.
   * @zh 输入属性 `isTarget`（类型：`boolean`），用于配置是否为目标。
   */
  @Input() isTarget: boolean;
  /**
   * Input property `targetMarkerTemplate` (`any`) configuring target marker template.
   * @zh 输入属性 `targetMarkerTemplate`（类型：`any`），用于配置目标标记点模板。
   */
  @Input() targetMarkerTemplate;
  /**
   * Input property `targetMarkerContext` (`any`) configuring target marker context.
   * @zh 输入属性 `targetMarkerContext`（类型：`any`），用于配置目标标记点上下文。
   */
  @Input() targetMarkerContext;

  /**
   * Property `_allRowsSelected` (`boolean`) storing all rows selected.
   * @zh 属性 `_allRowsSelected`（类型：`boolean`），用于存储或配置全部行列表已选中。
   */
  _allRowsSelected: boolean;

  /**
   * Input setter `allRowsSelected` updating all rows selected.
   * @zh 输入属性 `allRowsSelected` 的设置器，用于更新全部行列表已选中。
   * @param value - New all rows selected value (`boolean`) / 新的全部行列表已选中值（`boolean`）
   */
  @Input() set allRowsSelected(value) {
    this._allRowsSelected = value;
    this.cellContext.allRowsSelected = value;
  }
  /**
   * Gets the current all rows selected (`allRowsSelected: any`).
   * @zh 获取当前全部行列表已选中（`allRowsSelected: any`）。
   */
  get allRowsSelected() {
    return this._allRowsSelected;
  }

  /**
   * Property `_partialRowsSelected` (`boolean`) storing partial rows selected.
   * @zh 属性 `_partialRowsSelected`（类型：`boolean`），用于存储或配置partial行列表已选中。
   */
  _partialRowsSelected: boolean;

  /**
   * Input setter `partialRowsSelected` updating partial rows selected.
   * @zh 输入属性 `partialRowsSelected` 的设置器，用于更新partial行列表已选中。
   * @param value - New partial rows selected value (`boolean`) / 新的partial行列表已选中值（`boolean`）
   */
  @Input() set partialRowsSelected(value) {
    this._partialRowsSelected = value;
    this.cellContext.partialRowsSelected = value;
  }
  /**
   * Gets the current partial rows selected (`partialRowsSelected: any`).
   * @zh 获取当前partial行列表已选中（`partialRowsSelected: any`）。
   */
  get partialRowsSelected() {
    return this._partialRowsSelected;
  }

  /**
   * Input property `selectionType` (`SelectionType`) configuring selection type.
   * @zh 输入属性 `selectionType`（类型：`SelectionType`），用于配置selection类型。
   */
  @Input() selectionType: SelectionType;

  /**
   * Input setter `column` updating column.
   * @zh 输入属性 `column` 的设置器，用于更新列。
   * @param column - New column value (`TableColumn`) / 新的列值（`TableColumn`）
   */
  @Input() set column(column: TableColumn) {
    this._column = column;
    this.cellContext.column = column;
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
   * Input property `headerHeight` (`number`) configuring header height.
   * @zh 输入属性 `headerHeight`（类型：`number`），用于配置表头高度。
   */
  @HostBinding('style.height.px')
  @Input()  headerHeight: number;

  /**
   * Input setter `sorts` updating sorts.
   * @zh 输入属性 `sorts` 的设置器，用于更新排序集合。
   * @param val - New sorts value (`any`) / 新的排序集合值（`any`）
   */
  @Input() set sorts(val) {
    this._sorts = val;
    this.sortDir = this.calcSortDir(val);
    this.cellContext.sortDir = this.sortDir;
    this.sortClass = this.calcSortClass(this.sortDir);
    this.cd.markForCheck();
  }

  /**
   * Gets the current sorts (`sorts: any[]`).
   * @zh 获取当前排序集合（`sorts: any[]`）。
   */
  get sorts() {
    return this._sorts;
  }

  /**
   * Output event emitter `sort` (`EventEmitter<any>`) firing when sort occurs.
   * @zh 输出事件 `sort`（类型：`EventEmitter<any>`），当触发排序时向外发出事件。
   */
  @Output() sort = new EventEmitter();
  /**
   * Output event emitter `select` (`EventEmitter<any>`) firing when select occurs.
   * @zh 输出事件 `select`（类型：`EventEmitter<any>`），当触发下拉选择时向外发出事件。
   */
  @Output() select = new EventEmitter();
  /**
   * Output event emitter `columnContextmenu` (`EventEmitter<{ event: MouseEvent; column: any; }>`) firing when column contextmenu occurs.
   * @zh 输出事件 `columnContextmenu`（类型：`EventEmitter<{ event: MouseEvent; column: any; }>`），当触发列Contextmenu时向外发出事件。
   */
  @Output() columnContextmenu = new EventEmitter<{ event: MouseEvent; column }>(false);

  /**
   * Host-bound getter `columnCssClasses` (`string`) computing column css classes.
   * @zh 宿主绑定读取器 `columnCssClasses`（绑定至 `class`），计算并返回列CSS样式类名集合。
   */
  @HostBinding('class')
  get columnCssClasses() {
    let cls = 'datatable-header-cell';

    if (this.column.sortable) cls += ' sortable';
    if (this.column.resizeable) cls += ' resizeable';
    if (this.column.headerClass) {
      if (typeof this.column.headerClass === 'string') {
        cls += ' ' + this.column.headerClass;
      } else if (typeof this.column.headerClass === 'function') {
        const res = this.column.headerClass({
          column: this.column
        });

        if (typeof res === 'string') {
          cls += res;
        } else if (typeof res === 'object') {
          const keys = Object.keys(res);
          for (const k of keys) {
            if (res[k] === true) cls += ` ${k}`;
          }
        }
      }
    }

    const sortDir = this.sortDir;
    if (sortDir) {
      cls += ` sort-active sort-${sortDir}`;
    }

    return cls;
  }

  /**
   * Host-bound getter `name` (`string`) computing name.
   * @zh 宿主绑定读取器 `name`（绑定至 `attr.title`），计算并返回名称。
   */
  @HostBinding('attr.title')
  get name(): string {
    // guaranteed to have a value by setColumnDefaults() in column-helper.ts
    return this.column.headerTemplate === undefined ? this.column.name : undefined;
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
   * Host-bound getter `width` (`number`) computing width.
   * @zh 宿主绑定读取器 `width`（绑定至 `style.width.px`），计算并返回宽度。
   */
  @HostBinding('style.width.px')
  get width(): number {
    return this.column.width;
  }

  /**
   * Gets the current is checkboxable (`isCheckboxable: boolean`).
   * @zh 获取当前是否为Checkboxable（`isCheckboxable: boolean`）。
   */
  get isCheckboxable(): boolean {
    return this.column.checkboxable && 
    this.column.headerCheckboxable && 
    this.selectionType === SelectionType.checkbox;
  }

  /**
   * Property `sortFn` (`any`) storing sort fn (default: `this.onSort.bind(this)`).
   * @zh 属性 `sortFn`（类型：`any`），用于存储或配置排序函数（默认值：`this.onSort.bind(this)`）。
   */
  sortFn = this.onSort.bind(this);
  /**
   * Property `sortClass` (`string`) storing sort class.
   * @zh 属性 `sortClass`（类型：`string`），用于存储或配置排序类名。
   */
  sortClass: string;
  /**
   * Property `sortDir` (`SortDirection`) storing sort dir (default: `SortDirection.desc`).
   * @zh 属性 `sortDir`（类型：`SortDirection`），用于存储或配置排序目录（默认值：`SortDirection.desc`）。
   */
  sortDir: SortDirection=SortDirection.desc;
  /**
   * Property `selectFn` (`any`) storing select fn (default: `this.select.emit.bind(this.select)`).
   * @zh 属性 `selectFn`（类型：`any`），用于存储或配置下拉选择函数（默认值：`this.select.emit.bind(this.select)`）。
   */
  selectFn = this.select.emit.bind(this.select);

  /**
   * Property `cellContext` (`{…}`) storing cell context.
   * @zh 属性 `cellContext`（类型：`{…}`），用于存储或配置单元格上下文。
   */
  cellContext = {
    column: this.column,
    sortDir: this.sortDir,
    sortFn: this.sortFn,
    allRowsSelected: this.allRowsSelected,
    partialRowsSelected: this.partialRowsSelected,
    selectFn: this.selectFn
  };

  /**
   * Property `_column` (`TableColumn`) storing column.
   * @zh 属性 `_column`（类型：`TableColumn`），用于存储或配置列。
   */
  private _column: TableColumn;
  /**
   * Property `_sorts` (`any`) storing sorts.
   * @zh 属性 `_sorts`（类型：`any`），用于存储或配置排序集合。
   */
  private _sorts;

  /**
   * Creates an instance of `DataTableHeaderCellComponent` and initializes its dependencies and internal state.
   * @zh 创建 `DataTableHeaderCellComponent` 实例，并初始化其依赖项与内部状态。
   * @param cd - Injected or initial cd (`ChangeDetectorRef`) / 注入或传入的cd（`ChangeDetectorRef`）
   */
  constructor(private cd: ChangeDetectorRef) {}

  /**
   * Host event listener `onContextmenu` handling `contextmenu` events for on contextmenu.
   * @zh 宿主事件监听方法 `onContextmenu`，响应 `contextmenu` 事件以处理当Contextmenu。
   * @param $event - event parameter (`MouseEvent`) / 事件参数（`MouseEvent`）
   */
  @HostListener('contextmenu', ['$event'])
  onContextmenu($event: MouseEvent): void {
    this.columnContextmenu.emit({ event: $event, column: this.column });
  }

  /**
   * Executes `calcSortDir` to handle calc sort dir.
   * @zh 执行 `calcSortDir`，用于计算排序目录。
   * @param sorts - sorts parameter (`any`) / 排序集合参数（`any`）
   * @returns Result of type `any` / 类型为 `any` 的返回值
   */
  calcSortDir(sorts) {
    if (sorts && this.column) {
      const sort = sorts.find((s: { prop? }) => {
        return s.prop === this.column.prop;
      });

      if (sort) return sort.dir;
    }
  }

  /**
   * Executes `onSort` to handle on sort.
   * @zh 执行 `onSort`，用于当排序。
   */
  onSort(): void {
    if (!this.column.sortable) return;

    const newValue = nextSortDir(this.sortType, this.sortDir);
    this.sort.emit({
      column: this.column,
      prevValue: this.sortDir,
      newValue
    });
  }

  /**
   * Executes `calcSortClass` to handle calc sort class.
   * @zh 执行 `calcSortClass`，用于计算排序类名。
   * @param sortDir - sort dir parameter (`SortDirection`) / 排序目录参数（`SortDirection`）
   * @returns Result of type `string` / 类型为 `string` 的返回值
   */
  calcSortClass(sortDir: SortDirection): string {
    if (sortDir === SortDirection.asc) {
      return `sort-btn sort-asc ${this.sortAscendingIcon}`;
    } else if (sortDir === SortDirection.desc) {
      return `sort-btn sort-desc ${this.sortDescendingIcon}`;
    } else {
      return `sort-btn`;
    }
  }
}
