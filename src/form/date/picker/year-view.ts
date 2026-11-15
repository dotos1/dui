/**
 * @fileoverview Module `src/form/date/picker/year-view.ts` providing year view definitions and implementation.
 * @zh 模块文件 `src/form/date/picker/year-view.ts`，提供年视图相关的定义与实现。
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
import {MAT_DATETIME_FORMATS, MatDatetimeFormats,DatetimeAdapter} from "@dotos/dui/form/date/adapter";

import {MatDatetimepickerType} from "./datetimepicker-type";
import {createMissingDateImplError} from "./datetimepicker-errors";
import {MatDatetimepickerCalendarCell} from "./calendar-body";
import {slideCalendar} from "./datetimepicker-animations";

/**
 * An internal component used to display a single year in the datepicker.
 * @docs-private

 * @zh Angular 组件 `MatDatetimepickerYearView`（selector: 'mat-datetimepicker-year-view'），提供Material日期时间选择器年视图的视图渲染与交互逻辑（位于 `src/form/date/picker`）。
 */
@Component({
  selector: "mat-datetimepicker-year-view",
  templateUrl: "year-view.html",
  animations: [slideCalendar],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    hostID: "mat-datetimepicker-year-view" + Math.random().toString(36).substring(2, 15),
  },
  standalone: false
})
export class MatDatetimepickerYearView<D> implements AfterContentInit {

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
   * Grid of calendar cells representing the months of the year.
   * @zh 属性 `_months`（类型：`MatDatetimepickerCalendarCell[][]`），用于存储或配置月。
   */
  _months: MatDatetimepickerCalendarCell[][];
  /**
   * The label for this year (e.g. "2017").
   * @zh 属性 `_yearLabel`（类型：`string`），用于存储或配置年标签。
   */
  _yearLabel: string;
  /**
   * The month in this year that today falls on. Null if today is in a different year.
   * @zh 属性 `_todayMonth`（类型：`number`），用于存储或配置today月。
   */
  _todayMonth: number;
  /**
   * The month in this year that the selected Date falls on.
   * Null if the selected Date is in a different year.

   * @zh 属性 `_selectedMonth`（类型：`number`），用于存储或配置已选中月。
   */
  _selectedMonth: number;
  /**
   * Property `_calendarState` (`string`) storing calendar state.
   * @zh 属性 `_calendarState`（类型：`string`），用于存储或配置日历状态。
   */
  _calendarState: string;

  /**
   * Creates an instance of `MatDatetimepickerYearView` and initializes its dependencies and internal state.
   * @zh 创建 `MatDatetimepickerYearView` 实例，并初始化其依赖项与内部状态。
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
   * The date to display in this year view (everything other than the year is ignored).
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
      !this._adapter.sameYear(oldActiveDate, this._activeDate)) {
      this._init();
      // if (oldActiveDate < this._activeDate) {
      //  this.calendarState('right');
      // } else {
      //  this.calendarState('left');
      // }
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
    this._selectedMonth = this._getMonthInCurrentYear(this.selected);
  }

  /**
   * Angular lifecycle hook invoked once after projected content (`ng-content`) is initialized.
   * @zh Angular 生命周期钩子：在投影内容（`ng-content`）初始化完成后调用一次。
   */
  ngAfterContentInit() {
    this._init();
  }

  /**
   * Handles when a new month is selected.
   * @zh 执行 `_monthSelected`，用于月已选中。
   */
  _monthSelected(month: number) {
    const normalizedDate = this._adapter.createDatetime(this._adapter.getYear(this.activeDate), month, 1, 0, 0);

    this.selectedChange.emit(this._adapter.createDatetime(
      this._adapter.getYear(this.activeDate), month,
      Math.min(this._adapter.getDate(this.activeDate), this._adapter.getNumDaysInMonth(normalizedDate)),
      this._adapter.getHour(this.activeDate),
      this._adapter.getMinute(this.activeDate)));
    if (this.type === "month") {
      this._userSelection.emit();
    }
  }

  /**
   * Executes `_calendarStateDone` to handle calendar state done.
   * @zh 执行 `_calendarStateDone`，用于日历状态完成。
   */
  _calendarStateDone() {
    this._calendarState = "";
  }

  /**
   * Initializes this month view.
   * @zh 执行 `_init`，用于初始化。
   */
  private _init() {
    this._selectedMonth = this._getMonthInCurrentYear(this.selected);
    this._todayMonth = this._getMonthInCurrentYear(this._adapter.today());
    this._yearLabel = this._adapter.getYearName(this.activeDate);

    let monthNames = this._adapter.getMonthNames("short");
    // First row of months only contains 5 elements so we can fit the year label on the same row.
    this._months = [[0, 1, 2, 3, 4], [5, 6, 7, 8, 9, 10, 11]].map(row => row.map(
      month => this._createCellForMonth(month, monthNames[month])));
  }

  /**
   * Gets the month in this year that the given Date falls on.
   * Returns null if the given Date is in another year.

   * @zh 执行 `_getMonthInCurrentYear`，用于获取月在当前年。
   */
  private _getMonthInCurrentYear(date: D) {
    return this._adapter.sameYear(date, this.activeDate) ?
      this._adapter.getMonth(date) : null;
  }

  /**
   * Creates an MdCalendarCell for the given month.
   * @zh 执行 `_createCellForMonth`，用于创建单元格用于月。
   */
  private _createCellForMonth(month: number, monthName: string) {
    let ariaLabel = this._adapter.format(
      this._adapter.createDatetime(this._adapter.getYear(this.activeDate), month, 1,
        this._adapter.getHour(this.activeDate),
        this._adapter.getMinute(this.activeDate)),
      this._dateFormats.display.monthYearA11yLabel);
    return new MatDatetimepickerCalendarCell(
      month, monthName.toLocaleUpperCase(), ariaLabel, this._isMonthEnabled(month));
  }

  // private calendarState(direction: string): void {
  //   this._calendarState = direction;
  // }

  /**
   * Whether the given month is enabled.
   * @zh 执行 `_isMonthEnabled`，用于是否为月已启用。
   */
  private _isMonthEnabled(month: number) {
    if (!this.dateFilter) {
      return true;
    }

    let firstOfMonth = this._adapter.createDatetime(
      this._adapter.getYear(this.activeDate), month, 1,
      this._adapter.getHour(this.activeDate),
      this._adapter.getMinute(this.activeDate));

    // If any date in the month is enabled count the month as enabled.
    for (let date = firstOfMonth; this._adapter.getMonth(date) == month;
         date = this._adapter.addCalendarDays(date, 1)) {
      if (this.dateFilter(date)) {
        return true;
      }
    }

    return false;
  }
}
