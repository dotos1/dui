/**
 * @fileoverview Module `src/form/date/picker/multi-year-view.ts` providing multi year view definitions and implementation.
 * @zh 模块文件 `src/form/date/picker/multi-year-view.ts`，提供多年视图相关的定义与实现。
 */

/* tslint:disable */
import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Inject,
  Input,
  Optional,
  Output,
  ViewEncapsulation
} from "@angular/core";
import {MAT_DATETIME_FORMATS, MatDatetimeFormats,DatetimeAdapter} from "@dotos1/dui/form/date/adapter";

import {MatDatetimepickerType} from "./datetimepicker-type";
import {createMissingDateImplError} from "./datetimepicker-errors";
import {MatDatetimepickerCalendarCell} from "./calendar-body";
import {slideCalendar} from "./datetimepicker-animations";


/**
 * Constant/variable `yearsPerPage` defining years per page in `src/form/date/picker`.
 * @zh 常量/变量 `yearsPerPage`，定义 `src/form/date/picker` 中的年Per页面。
 */
export const yearsPerPage = 24;

/**
 * Constant/variable `yearsPerRow` defining years per row in `src/form/date/picker`.
 * @zh 常量/变量 `yearsPerRow`，定义 `src/form/date/picker` 中的年Per行。
 */
export const yearsPerRow = 4;

/**
 * An internal component used to display multiple years in the datepicker.
 * @docs-private

 * @zh Angular 组件 `MatDatetimepickerMultiYearView`（selector: 'mat-datetimepicker-multi-year-view'），提供Material日期时间选择器多年视图的视图渲染与交互逻辑（位于 `src/form/date/picker`）。
 */
@Component({
  selector: "mat-datetimepicker-multi-year-view",
  templateUrl: "multi-year-view.html",
  animations: [slideCalendar],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    hostID: "mat-datetimepicker-multi-year-view" + Math.random().toString(36).substring(2, 15),
  },
  standalone: false
})
export class MatDatetimepickerMultiYearView<D> implements AfterContentInit {

  /**
   * Output event emitter `_userSelection` (`EventEmitter<void>`) firing when user selection occurs.
   * @zh 输出事件 `_userSelection`（类型：`EventEmitter<void>`），当触发用户Selection时向外发出事件。
   */
  @Output() _userSelection = new EventEmitter<void>();

  /**
   * Input property `type` (`MatDatetimepickerType`) configuring type (default: `"date"`).
   * @zh 输入属性 `type`（类型：`MatDatetimepickerType`），用于配置类型（默认值：`"date"`）。
   */
  @Input() type: MatDatetimepickerType = "date";
  /**
   * A function used to filter which dates are selectable.
   * @zh 输入属性 `dateFilter`（类型：`(date: D) => boolean`），用于配置日期过滤。
   */
  @Input() dateFilter: (date: D) => boolean;
  /**
   * Emits when a new month is selected.
   * @zh 输出事件 `selectedChange`（类型：`EventEmitter<D>`），当触发已选中变更时向外发出事件。
   */
  @Output() selectedChange = new EventEmitter<D>();
  /**
   * Grid of calendar cells representing the years in the range.
   * @zh 属性 `_years`（类型：`MatDatetimepickerCalendarCell[][]`），用于存储或配置年。
   */
  _years: MatDatetimepickerCalendarCell[][];
  /**
   * The label for this year range (e.g. "2000-2020").
   * @zh 属性 `_yearLabel`（类型：`string`），用于存储或配置年标签。
   */
  _yearLabel: string;
  /**
   * The year in this range that today falls on. Null if today is in a different range.
   * @zh 属性 `_todayYear`（类型：`number`），用于存储或配置today年。
   */
  _todayYear: number;
  /**
   * The year in this range that the selected Date falls on.
   * Null if the selected Date is in a different range.

   * @zh 属性 `_selectedYear`（类型：`number`），用于存储或配置已选中年。
   */
  _selectedYear: number | null;
  /**
   * Property `_calendarState` (`string`) storing calendar state.
   * @zh 属性 `_calendarState`（类型：`string`），用于存储或配置日历状态。
   */
  _calendarState: string;

  /**
   * Creates an instance of `MatDatetimepickerMultiYearView` and initializes its dependencies and internal state.
   * @zh 创建 `MatDatetimepickerMultiYearView` 实例，并初始化其依赖项与内部状态。
   * @param _adapter - Injected or initial adapter (`DatetimeAdapter<D>`) / 注入或传入的适配器（`DatetimeAdapter<D>`）
   * @param _dateFormats - Injected or initial date formats (`MatDatetimeFormats`) / 注入或传入的日期格式列表（`MatDatetimeFormats`）
   */
  constructor(@Optional() public _adapter: DatetimeAdapter<D>,
              @Optional() @Inject(MAT_DATETIME_FORMATS) private _dateFormats: MatDatetimeFormats) {
    if (!this._adapter) {
      throw createMissingDateImplError("DatetimeAdapter");
    }

    if (!this._dateFormats) {
      throw createMissingDateImplError("MAT_DATETIME_FORMATS");
    }

    this._activeDate = this._adapter.today();
  }

  /**
   * Property `_activeDate` (`D`) storing active date.
   * @zh 属性 `_activeDate`（类型：`D`），用于存储或配置激活日期。
   */
  private _activeDate: D;

  /**
   * The date to display in this multi year view
   * @zh 输入属性 `activeDate`（类型：`D`）的读取器，返回当前激活日期。
   */
  @Input()
  get activeDate(): D {
    return this._activeDate;
  }

  /**
   * Sets the active date (`activeDate`).
   * @zh 设置激活日期（`activeDate`）。
   * @param value - New active date value (`D`) / 新的激活日期值（`D`）
   */
  set activeDate(value: D) {
    let oldActiveDate = this._activeDate;
    this._activeDate = value || this._adapter.today();
    if (oldActiveDate && this._activeDate &&
      !isSameMultiYearView(this._adapter, oldActiveDate, this._activeDate, this.minDate, this.maxDate)) {
      this._init();
    }
  }

  /**
   * Property `_selected` (`D`) storing selected.
   * @zh 属性 `_selected`（类型：`D`），用于存储或配置已选中。
   */
  private _selected: D;

  /**
   * The currently selected date.
   * @zh 输入属性 `selected`（类型：`D`）的读取器，返回当前已选中。
   */
  @Input()
  get selected(): D {
    return this._selected;
  }

  /**
   * Sets the selected (`selected`).
   * @zh 设置已选中（`selected`）。
   * @param value - New selected value (`D`) / 新的已选中值（`D`）
   */
  set selected(value: D) {
    this._selected = value;
    this._selectedYear = this._selected && this._adapter.getYear(this._selected);
  }

  /**
   * Property `_minDate` (`D`) storing min date.
   * @zh 属性 `_minDate`（类型：`D`），用于存储或配置最小值日期。
   */
  private _minDate: D | null;

  /**
   * The minimum selectable date.
   * @zh 输入属性 `minDate`（类型：`D`）的读取器，返回当前最小值日期。
   */
  @Input()
  get minDate(): D | null {
    return this._minDate;
  }

  /**
   * Sets the min date (`minDate`).
   * @zh 设置最小值日期（`minDate`）。
   * @param value - New min date value (`D`) / 新的最小值日期值（`D`）
   */
  set minDate(value: D | null) {
    this._minDate = this._getValidDateOrNull(this._adapter.deserialize(value));
  }

  /**
   * Property `_maxDate` (`D`) storing max date.
   * @zh 属性 `_maxDate`（类型：`D`），用于存储或配置最大值日期。
   */
  private _maxDate: D | null;

  /**
   * The maximum selectable date.
   * @zh 输入属性 `maxDate`（类型：`D`）的读取器，返回当前最大值日期。
   */
  @Input()
  get maxDate(): D | null {
    return this._maxDate;
  }

  /**
   * Sets the max date (`maxDate`).
   * @zh 设置最大值日期（`maxDate`）。
   * @param value - New max date value (`D`) / 新的最大值日期值（`D`）
   */
  set maxDate(value: D | null) {
    this._maxDate = this._getValidDateOrNull(this._adapter.deserialize(value));
  }

  /**
   * Angular lifecycle hook invoked once after projected content (`ng-content`) is initialized.
   * @zh Angular 生命周期钩子：在投影内容（`ng-content`）初始化完成后调用一次。
   */
  ngAfterContentInit() {
    this._init();
  }

  /**
   * Handles when a new year is selected.
   * @zh 执行 `_yearSelected`，用于年已选中。
   */
  _yearSelected(year: number) {
    const month = this._adapter.getMonth(this.activeDate);
    const normalizedDate = this._adapter.createDatetime(year, month, 1, 0, 0);

    this.selectedChange.emit(this._adapter.createDatetime(
      year,
      month,
      Math.min(this._adapter.getDate(this.activeDate),
        this._adapter.getNumDaysInMonth(normalizedDate)),
      this._adapter.getHour(this.activeDate),
      this._adapter.getMinute(this.activeDate)));

    if (this.type === "year") {
      this._userSelection.emit();
    }
  }

  /**
   * Executes `_getActiveCell` to handle get active cell.
   * @zh 执行 `_getActiveCell`，用于获取激活单元格。
   * @returns Result of type `number` / 类型为 `number` 的返回值
   */
  _getActiveCell(): number {
    return getActiveOffset(this._adapter, this.activeDate, this.minDate, this.maxDate);
  }

  /**
   * Executes `_calendarStateDone` to handle calendar state done.
   * @zh 执行 `_calendarStateDone`，用于日历状态完成。
   */
  _calendarStateDone() {
    this._calendarState = "";
  }

  /**
   * Initializes this year view.
   * @zh 执行 `_init`，用于初始化。
   */
  private _init() {

    this._todayYear = this._adapter.getYear(this._adapter.today());
    this._yearLabel = this._adapter.getYearName(this.activeDate);


    const activeYear = this._adapter.getYear(this.activeDate);

    const minYearOfPage = activeYear - getActiveOffset(
      this._adapter, this.activeDate, this.minDate, this.maxDate);

    this._years = [];
    for (let i = 0, row: number[] = []; i < yearsPerPage; i++) {
      row.push(minYearOfPage + i);
      if (row.length == yearsPerRow) {
        this._years.push(row.map(year => this._createCellForYear(year)));
        row = [];
      }
    }
  }

  /**
   * Creates an MatDatetimepickerCalendarCell for the given year.
   * @zh 执行 `_createCellForYear`，用于创建单元格用于年。
   */
  private _createCellForYear(year: number) {
    let yearName = this._adapter.getYearName(this._adapter.createDate(year, 0, 1));
    return new MatDatetimepickerCalendarCell(year, yearName, yearName, this._shouldEnableYear(year));
  }

  /**
   * Whether the given year is enabled.
   * @zh 执行 `_shouldEnableYear`，用于是否应当启用年。
   */
  private _shouldEnableYear(year: number) {
    // disable if the year is greater than maxDate lower than minDate
    if (year === undefined || year === null ||
      (this.maxDate && year > this._adapter.getYear(this.maxDate)) ||
      (this.minDate && year < this._adapter.getYear(this.minDate))) {
      return false;
    }

    // enable if it reaches here and there's no filter defined
    if (!this.dateFilter) {
      return true;
    }

    const firstOfYear = this._adapter.createDate(year, 0, 1);

    // If any date in the year is enabled count the year as enabled.
    for (let date = firstOfYear; this._adapter.getYear(date) == year;
         date = this._adapter.addCalendarDays(date, 1)) {
      if (this.dateFilter(date)) {
        return true;
      }
    }

    return false;
  }

  /**
   * Gets the year in this years range that the given Date falls on.
   * Returns null if the given Date is not in this range.

   * @zh 执行 `_getYearInCurrentRange`，用于获取年在当前范围。
   */
  private _getYearInCurrentRange(date: D) {
    const year = this._adapter.getYear(date);
    return this._isInRange(year) ?
      year : null;
  }

  /**
   * Validate if the current year is in the current range
   * Returns true if is in range else returns false

   * @zh 执行 `_isInRange`，用于是否为在范围。
   */
  private _isInRange(year: number): boolean {

    return true;
  }

  /**
   * @param obj The object to check.
   * @returns The given object if it is both a date instance and valid, otherwise null.

   * @zh 执行 `_getValidDateOrNull`，用于获取有效日期Or空值。
   */
  private _getValidDateOrNull(obj): D | null {
    return (this._adapter.isDateInstance(obj) && this._adapter.isValid(obj)) ? obj : null;
  }
}

/**
 * Executes `isSameMultiYearView` to handle is same multi year view.
 * @zh 执行 `isSameMultiYearView`，用于是否为相同多年视图。
 * @param dateAdapter - date adapter parameter (`DatetimeAdapter<D>`) / 日期适配器参数（`DatetimeAdapter<D>`）
 * @param date1 - date1 parameter (`D`) / date1参数（`D`）
 * @param date2 - date2 parameter (`D`) / date2参数（`D`）
 * @param minDate - min date parameter (`D`) / 最小值日期参数（`D`）
 * @param maxDate - max date parameter (`D`) / 最大值日期参数（`D`）
 * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
 */
export function isSameMultiYearView<D>(
  dateAdapter: DatetimeAdapter<D>, date1: D, date2: D, minDate: D | null, maxDate: D | null): boolean {
  const year1 = dateAdapter.getYear(date1);
  const year2 = dateAdapter.getYear(date2);
  const startingYear = getStartingYear(dateAdapter, minDate, maxDate);
  return Math.floor((year1 - startingYear) / yearsPerPage) ===
    Math.floor((year2 - startingYear) / yearsPerPage);
}

/**
 * When the multi-year view is first opened, the active year will be in view.
 * So we compute how many years are between the active year and the *slot* where our
 * "startingYear" will render when paged into view.

 * @zh 执行 `getActiveOffset`，用于获取激活偏移量。
 */
export function getActiveOffset<D>(
  dateAdapter: DatetimeAdapter<D>, activeDate: D, minDate: D | null, maxDate: D | null): number {
  const activeYear = dateAdapter.getYear(activeDate);
  return euclideanModulo((activeYear - getStartingYear(dateAdapter, minDate, maxDate)),
    yearsPerPage);
}

/**
 * We pick a "starting" year such that either the maximum year would be at the end
 * or the minimum year would be at the beginning of a page.

 * @zh 执行 `getStartingYear`，用于获取开始年。
 */
function getStartingYear<D>(
  dateAdapter: DatetimeAdapter<D>, minDate: D | null, maxDate: D | null): number {
  let startingYear = 0;
  if (maxDate) {
    const maxYear = dateAdapter.getYear(maxDate);
    startingYear = maxYear - yearsPerPage + 1;
  } else if (minDate) {
    startingYear = dateAdapter.getYear(minDate);
  }
  return startingYear;
}

/**
 * Gets remainder that is non-negative, even if first number is negative
 * @zh 执行 `euclideanModulo`，用于euclideanModulo。
 */
function euclideanModulo(a: number, b: number): number {
  return (a % b + b) % b;
}
