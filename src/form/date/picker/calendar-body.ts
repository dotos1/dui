/**
 * @fileoverview Module `src/form/date/picker/calendar-body.ts` providing calendar body definitions and implementation.
 * @zh 模块文件 `src/form/date/picker/calendar-body.ts`，提供日历主体相关的定义与实现。
 */

import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewEncapsulation} from "@angular/core";


/**
 * Class `MatDatetimepickerCalendarCell` encapsulating mat datetimepicker calendar cell data structures and logic in `src/form/date/picker`.
 * @zh 类 `MatDatetimepickerCalendarCell`，封装 `src/form/date/picker` 中的Material日期时间选择器日历单元格数据结构与处理逻辑。
 */
export class MatDatetimepickerCalendarCell {
  /**
   * Creates an instance of `MatDatetimepickerCalendarCell` and initializes its dependencies and internal state.
   * @zh 创建 `MatDatetimepickerCalendarCell` 实例，并初始化其依赖项与内部状态。
   * @param value - Injected or initial value (`number`) / 注入或传入的值（`number`）
   * @param displayValue - Injected or initial display value (`string`) / 注入或传入的display值（`string`）
   * @param ariaLabel - Injected or initial aria label (`string`) / 注入或传入的aria标签（`string`）
   * @param enabled - Injected or initial enabled (`boolean`) / 注入或传入的已启用（`boolean`）
   */
  constructor(public value: number,
              public displayValue: string,
              public ariaLabel: string,
              public enabled: boolean) {
  }
}


/**
 * Angular component `MatDatetimepickerCalendarBody` (selector: '[mat-datetimepicker-calendar-body]') providing mat datetimepicker calendar body presentation and interaction in `src/form/date/picker`.
 * @zh Angular 组件 `MatDatetimepickerCalendarBody`（selector: '[mat-datetimepicker-calendar-body]'），提供Material日期时间选择器日历主体的视图渲染与交互逻辑（位于 `src/form/date/picker`）。
 */
@Component({
  // tslint:disable-next-line:component-selector
  selector: "[mat-datetimepicker-calendar-body]",
  templateUrl: "calendar-body.html",
  styleUrls: ["calendar-body.scss"],
  host: {
    "class": "mat-datetimepicker-calendar-body",
    hostID: "mat-datetimepicker-calendar-body" + Math.random().toString(36).substring(2, 15),
  },
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MatDatetimepickerCalendarBody {
  /**
   * The label for the table. (e.g. "Jan 2017").
   * @zh 输入属性 `label`（类型：`string`），用于配置标签。
   */
  @Input() label: string;

  /**
   * The cells to display in the table.
   * @zh 输入属性 `rows`（类型：`MatDatetimepickerCalendarCell[][]`），用于配置行列表。
   */
  @Input() rows: MatDatetimepickerCalendarCell[][];

  /**
   * The value in the table that corresponds to today.
   * @zh 输入属性 `todayValue`（类型：`number`），用于配置today值。
   */
  @Input() todayValue: number;

  /**
   * The value in the table that is currently selected.
   * @zh 输入属性 `selectedValue`（类型：`number`），用于配置已选中值。
   */
  @Input() selectedValue: number;

  /**
   * The minimum number of free cells needed to fit the label in the first row.
   * @zh 输入属性 `labelMinRequiredCells`（类型：`number`），用于配置标签最小值必填单元格集合。
   */
  @Input() labelMinRequiredCells: number;

  /**
   * The number of columns in the table.
   * @zh 输入属性 `numCols`（类型：`number`），用于配置数值列列表（默认值：`7`）。
   */
  @Input() numCols = 7;

  /**
   * Whether to allow selection of disabled cells.
   * @zh 输入属性 `allowDisabledSelection`（类型：`boolean`），用于配置允许已禁用Selection（默认值：`false`）。
   */
  @Input() allowDisabledSelection = false;

  /**
   * The cell number of the active cell in the table.
   * @zh 输入属性 `activeCell`（类型：`number`），用于配置激活单元格（默认值：`0`）。
   */
  @Input() activeCell = 0;

  /**
   * Emits when a new value is selected.
   * @zh 输出事件 `selectedValueChange`（类型：`EventEmitter<number>`），当触发已选中值变更时向外发出事件。
   */
  @Output() selectedValueChange = new EventEmitter<number>();

  /**
   * The number of blank cells to put at the beginning for the first row.
   * @zh 获取当前首个行偏移量（`_firstRowOffset: number`）。
   */
  get _firstRowOffset(): number {
    return this.rows && this.rows.length && this.rows[0].length ?
      this.numCols - this.rows[0].length : 0;
  }

  /**
   * Executes `_cellClicked` to handle cell clicked.
   * @zh 执行 `_cellClicked`，用于单元格点击。
   * @param cell - cell parameter (`MatDatetimepickerCalendarCell`) / 单元格参数（`MatDatetimepickerCalendarCell`）
   */
  _cellClicked(cell: MatDatetimepickerCalendarCell): void {
    if (!this.allowDisabledSelection && !cell.enabled) {
      return;
    }
    this.selectedValueChange.emit(cell.value);
  }

  /**
   * Executes `_isActiveCell` to handle is active cell.
   * @zh 执行 `_isActiveCell`，用于是否为激活单元格。
   * @param rowIndex - row index parameter (`number`) / 行索引参数（`number`）
   * @param colIndex - col index parameter (`number`) / 列索引参数（`number`）
   * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
   */
  _isActiveCell(rowIndex: number, colIndex: number): boolean {
    let cellNumber = rowIndex * this.numCols + colIndex;

    // Account for the fact that the first row may not have as many cells.
    if (rowIndex) {
      cellNumber -= this._firstRowOffset;
    }

    return cellNumber === this.activeCell;
  }
}
