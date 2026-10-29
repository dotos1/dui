/**
 * @fileoverview Module `src/form/date/picker/month-view.ts` providing month view definitions and implementation.
 * @zh 模块文件 `src/form/date/picker/month-view.ts`，提供月视图相关的定义与实现。
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

import {MatDatetimepickerCalendarCell} from "./calendar-body";
import {MatDatetimepickerType} from "./datetimepicker";
import {slideCalendar} from "./datetimepicker-animations";
import {createMissingDateImplError} from "./datetimepicker-errors";

/**
 * Constant/variable `DAYS_PER_WEEK` defining days per week in `src/form/date/picker`.
 * @zh 常量/变量 `DAYS_PER_WEEK`，定义 `src/form/date/picker` 中的天数PER周。
 */
const DAYS_PER_WEEK = 7;

/**
 * An internal component used to display a single month in the datepicker.
 * @docs-private

 * @zh Angular 组件 `MatDatetimepickerMonthView`（selector: 'mat-datetimepicker-month-view'），提供Material日期时间选择器月视图的视图渲染与交互逻辑（位于 `src/form/date/picker`）。
 */
@Component({
  selector: "mat-datetimepicker-month-view",
  templateUrl: "month-view.html",
  animations: [slideCalendar],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {hostID: "mat-datetimepicker-month-view" + Math.random().toString(36).substring(2, 15) }
})
export class MatDatetimepickerMonthView<D> implements AfterContentInit {

  /**
   * Input property `type` (`MatDatetimepickerType`) configuring type (default: `"date"`).
   * @zh 输入属性 `type`（类型：`MatDatetimepickerType`），用于配置类型（默认值：`"date"`）。
   */
  @Input() type: MatDatetimepickerType = "date";

  /**
   * Output event emitter `_userSelection` (`EventEmitter<void>`) firing when user selection occurs.
   * @zh 输出事件 `_userSelection`（类型：`EventEmitter<void>`），当触发用户Selection时向外发出事件。
   */
  @Output() _userSelection = new EventEmitter<void>();
  /**
   * A function used to filter which dates are selectable.
   * @zh 输入属性 `dateFilter`（类型：`(date: D) => boolean`），用于配置日期过滤。
   */
  @Input() dateFilter: (date: D) => boolean;
  /**
   * Emits when a new date is selected.
   * @zh 输出事件 `selectedChange`（类型：`EventEmitter<D>`），当触发已选中变更时向外发出事件。
   */
  @Output() selectedChange = new EventEmitter<D>();
  /**
   * Grid of calendar cells representing the dates of the month.
   * @zh 属性 `_weeks`（类型：`MatDatetimepickerCalendarCell[][]`），用于存储或配置周。
   */
  _weeks: MatDatetimepickerCalendarCell[][];
  /**
   * The number of blank cells in the first row before the 1st of the month.
   * @zh 属性 `_firstWeekOffset`（类型：`number`），用于存储或配置首个周偏移量。
   */
  _firstWeekOffset: number;
  /**
   * The date of the month that the currently selected Date falls on.
   * Null if the currently selected Date is in another month.

   * @zh 属性 `_selectedDate`（类型：`number`），用于存储或配置已选中日期。
   */
  _selectedDate: number;
  /**
   * The date of the month that today falls on. Null if today is in another month.
   * @zh 属性 `_todayDate`（类型：`number`），用于存储或配置today日期。
   */
  _todayDate: number;
  /**
   * The names of the weekdays.
   * @zh 属性 `_weekdays`（类型：`{ long: string; narrow: string; }[]`），用于存储或配置weekdays。
   */
  _weekdays: { long: string, narrow: string }[];
  /**
   * Property `_calendarState` (`string`) storing calendar state.
   * @zh 属性 `_calendarState`（类型：`string`），用于存储或配置日历状态。
   */
  _calendarState: string;

  /**
   * Creates an instance of `MatDatetimepickerMonthView` and initializes its dependencies and internal state.
   * @zh 创建 `MatDatetimepickerMonthView` 实例，并初始化其依赖项与内部状态。
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

    const firstDayOfWeek = this._adapter.getFirstDayOfWeek();
    const narrowWeekdays = this._adapter.getDayOfWeekNames("narrow");
    const longWeekdays = this._adapter.getDayOfWeekNames("long");

    // Rotate the labels for days of the week based on the configured first day of the week.
    let weekdays = longWeekdays.map((long, i) => {
      return {long, narrow: narrowWeekdays[i]};
    });
    this._weekdays = weekdays.slice(firstDayOfWeek).concat(weekdays.slice(0, firstDayOfWeek));

    this._activeDate = this._adapter.today();
  }

  /**
   * Property `_activeDate` (`D`) storing active date.
   * @zh 属性 `_activeDate`（类型：`D`），用于存储或配置激活日期。
   */
  private _activeDate: D;

  /**
   * The date to display in this month view (everything other than the month and year is ignored).

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
      !this._adapter.sameMonthAndYear(oldActiveDate, this._activeDate)) {
      this._init();
      if (this._adapter.isInNextMonth(oldActiveDate, this._activeDate)) {
        this.calendarState("right");
      } else {
        this.calendarState("left");
      }
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
    this._selectedDate = this._getDateInCurrentMonth(this.selected);
  }

  /**
   * Angular lifecycle hook invoked once after projected content (`ng-content`) is initialized.
   * @zh Angular 生命周期钩子：在投影内容（`ng-content`）初始化完成后调用一次。
   */
  ngAfterContentInit(): void {
    this._init();
  }

  /**
   * Handles when a new date is selected.
   * @zh 执行 `_dateSelected`，用于日期已选中。
   */
  _dateSelected(date: number) {
    this.selectedChange.emit(this._adapter.createDatetime(
      this._adapter.getYear(this.activeDate), this._adapter.getMonth(this.activeDate),
      date, this._adapter.getHour(this.activeDate),
      this._adapter.getMinute(this.activeDate)));
    if (this.type === "date") {
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
    this._selectedDate = this._getDateInCurrentMonth(this.selected);
    this._todayDate = this._getDateInCurrentMonth(this._adapter.today());

    let firstOfMonth = this._adapter.createDatetime(this._adapter.getYear(this.activeDate),
      this._adapter.getMonth(this.activeDate), 1,
      this._adapter.getHour(this.activeDate),
      this._adapter.getMinute(this.activeDate));
    this._firstWeekOffset =
      (DAYS_PER_WEEK + this._adapter.getDayOfWeek(firstOfMonth) -
        this._adapter.getFirstDayOfWeek()) % DAYS_PER_WEEK;

    this._createWeekCells();
  }

  /**
   * Creates MdCalendarCells for the dates in this month.
   * @zh 执行 `_createWeekCells`，用于创建周单元格集合。
   */
  private _createWeekCells() {
    let daysInMonth = this._adapter.getNumDaysInMonth(this.activeDate);
    let dateNames = this._adapter.getDateNames();
    this._weeks = [[]];
    for (let i = 0, cell = this._firstWeekOffset; i < daysInMonth; i++ , cell++) {
      if (cell == DAYS_PER_WEEK) {
        this._weeks.push([]);
        cell = 0;
      }
      let date = this._adapter.createDatetime(
        this._adapter.getYear(this.activeDate),
        this._adapter.getMonth(this.activeDate), i + 1,
        this._adapter.getHour(this.activeDate),
        this._adapter.getMinute(this.activeDate));
      let enabled = !this.dateFilter ||
        this.dateFilter(date);
      let ariaLabel = this._adapter.format(date, this._dateFormats.display.dateA11yLabel);
      this._weeks[this._weeks.length - 1]
        .push(new MatDatetimepickerCalendarCell(i + 1, dateNames[i], ariaLabel, enabled));
    }
  }

  /**
   * Gets the date in this month that the given Date falls on.
   * Returns null if the given Date is in another month.

   * @zh 执行 `_getDateInCurrentMonth`，用于获取日期在当前月。
   */
  private _getDateInCurrentMonth(date: D): number {
    return this._adapter.sameMonthAndYear(date, this.activeDate) ?
      this._adapter.getDate(date) : null;
  }

  /**
   * Executes `calendarState` to handle calendar state.
   * @zh 执行 `calendarState`，用于日历状态。
   * @param direction - direction parameter (`string`) / 方向参数（`string`）
   */
  private calendarState(direction: string): void {
    this._calendarState = direction;
  }

}
