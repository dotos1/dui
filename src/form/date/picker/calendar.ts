/**
 * @fileoverview Module `src/form/date/picker/calendar.ts` providing calendar definitions and implementation.
 * @zh 模块文件 `src/form/date/picker/calendar.ts`，提供日历相关的定义与实现。
 */

import {DOWN_ARROW, END, ENTER, HOME, LEFT_ARROW, PAGE_DOWN, PAGE_UP, RIGHT_ARROW, UP_ARROW} from "@angular/cdk/keycodes";
import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  NgZone,
  OnDestroy,
  Optional,
  Output,
  ViewEncapsulation
} from "@angular/core";
import {MatDatepickerIntl} from "@angular/material/datepicker";
import {Subscription} from "rxjs";
import {first} from "rxjs/operators";
import {DatetimeAdapter,MAT_DATETIME_FORMATS, MatDatetimeFormats} from "@dotos/dui/form/date/adapter";
import {MatClockView} from "./clock";
import {MatDatetimepickerType} from "./datetimepicker";
import {slideCalendar} from "./datetimepicker-animations";
import {createMissingDateImplError} from "./datetimepicker-errors";
import {MatDatetimepickerFilterType} from "./datetimepicker-filtertype";
import {getActiveOffset, isSameMultiYearView, yearsPerPage, yearsPerRow} from "./multi-year-view";

/**
 * Type alias `MatCalendarView` representing mat calendar view (`"clock" | "month" | "year" | "multi-year"`).
 * @zh 类型别名 `MatCalendarView`，表示Material日历视图（`"clock" | "month" | "year" | "multi-year"`）。
 */
export type MatCalendarView = "clock" | "month" | "year" | "multi-year";

/**
 * A calendar that is used as part of the datepicker.
 * @docs-private

 * @zh Angular 组件 `MatDatetimepickerCalendar`（selector: 'mat-datetimepicker-calendar'），提供Material日期时间选择器日历的视图渲染与交互逻辑（位于 `src/form/date/picker`）。
 */
@Component({
  selector: "mat-datetimepicker-calendar",
  templateUrl: "calendar.html",
  styleUrls: ["calendar.scss"],
  host: {
    "[class.mat-datetimepicker-calendar]": "true",
    "[attr.aria-label]": "ariaLabel",
    "role": "dialog",
    "tabindex": "0",
    "(keydown)": "_handleCalendarBodyKeydown($event)",
    hostID: "mat-datetimepicker-calendar" + Math.random().toString(36).substring(2, 15)
  },
  animations: [slideCalendar],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MatDatetimepickerCalendar<D> implements AfterContentInit, OnDestroy {

  /**
   * Output event emitter `_userSelection` (`EventEmitter<void>`) firing when user selection occurs.
   * @zh 输出事件 `_userSelection`（类型：`EventEmitter<void>`），当触发用户Selection时向外发出事件。
   */
  @Output() _userSelection = new EventEmitter<void>();
  /**
   * Active multi year view when click on year.
   * @zh 输入属性 `multiYearSelector`（类型：`boolean`），用于配置多年选择器（默认值：`false`）。
   */
  @Input() multiYearSelector: boolean = false;
  /**
   * Whether the calendar should be started in month or year view.
   * @zh 输入属性 `startView`（类型：`MatCalendarView`），用于配置开始视图（默认值：`"month"`）。
   */
  @Input() startView: MatCalendarView = "month";
  /**
   * Input property `twelvehour` (`boolean`) configuring twelvehour (default: `false`).
   * @zh 输入属性 `twelvehour`（类型：`boolean`），用于配置twelvehour（默认值：`false`）。
   */
  @Input() twelvehour: boolean = false;
  /**
   * Input property `timeInterval` (`number`) configuring time interval (default: `1`).
   * @zh 输入属性 `timeInterval`（类型：`number`），用于配置时间间隔定时器（默认值：`1`）。
   */
  @Input() timeInterval: number = 1;
  /**
   * A function used to filter which dates are selectable.
   * @zh 输入属性 `dateFilter`（类型：`(date: D, type: MatDatetimepickerFilterType) => boolean`），用于配置日期过滤。
   */
  @Input() dateFilter: (date: D, type: MatDatetimepickerFilterType) => boolean;
  /**
   * Input property `ariaLabel` (`string`) configuring aria label (default: `"Use arrow keys to navigate"`).
   * @zh 输入属性 `ariaLabel`（类型：`string`），用于配置aria标签（默认值：`"Use arrow keys to navigate"`）。
   */
  @Input() ariaLabel = "Use arrow keys to navigate";
  /**
   * Input property `ariaNextMonthLabel` (`string`) configuring aria next month label (default: `"Next month"`).
   * @zh 输入属性 `ariaNextMonthLabel`（类型：`string`），用于配置aria下一个月标签（默认值：`"Next month"`）。
   */
  @Input() ariaNextMonthLabel = "Next month";
  /**
   * Input property `ariaPrevMonthLabel` (`string`) configuring aria prev month label (default: `"Previous month"`).
   * @zh 输入属性 `ariaPrevMonthLabel`（类型：`string`），用于配置aria前一个月标签（默认值：`"Previous month"`）。
   */
  @Input() ariaPrevMonthLabel = "Previous month";
  /**
   * Input property `ariaNextYearLabel` (`string`) configuring aria next year label (default: `"Next year"`).
   * @zh 输入属性 `ariaNextYearLabel`（类型：`string`），用于配置aria下一个年标签（默认值：`"Next year"`）。
   */
  @Input() ariaNextYearLabel = "Next year";
  /**
   * Input property `ariaPrevYearLabel` (`string`) configuring aria prev year label (default: `"Previous year"`).
   * @zh 输入属性 `ariaPrevYearLabel`（类型：`string`），用于配置aria前一个年标签（默认值：`"Previous year"`）。
   */
  @Input() ariaPrevYearLabel = "Previous year";
  /**
   * Input property `ariaNextMultiYearLabel` (`string`) configuring aria next multi year label (default: `"Next year range"`).
   * @zh 输入属性 `ariaNextMultiYearLabel`（类型：`string`），用于配置aria下一个多年标签（默认值：`"Next year range"`）。
   */
  @Input() ariaNextMultiYearLabel = "Next year range";
  /**
   * Input property `ariaPrevMultiYearLabel` (`string`) configuring aria prev multi year label (default: `"Previous year range"`).
   * @zh 输入属性 `ariaPrevMultiYearLabel`（类型：`string`），用于配置aria前一个多年标签（默认值：`"Previous year range"`）。
   */
  @Input() ariaPrevMultiYearLabel = "Previous year range";
  /**
   * Prevent user to select same date time
   * @zh 输入属性 `preventSameDateTimeSelection`（类型：`boolean`），用于配置阻止默认相同日期时间Selection（默认值：`false`）。
   */
  @Input() preventSameDateTimeSelection = false;
  /**
   * Emits when the currently selected date changes.
   * @zh 输出事件 `selectedChange`（类型：`EventEmitter<D>`），当触发已选中变更时向外发出事件。
   */
  @Output() selectedChange: EventEmitter<D> = new EventEmitter<D>();
  /**
   * Emits when the view has been changed. *
   * @zh 输出事件 `viewChanged`（类型：`EventEmitter<MatCalendarView>`），当触发视图已变更时向外发出事件。
   */
  @Output() viewChanged: EventEmitter<MatCalendarView> = new EventEmitter<MatCalendarView>();
  /**
   * Property `_AMPM` (`string`) storing ampm.
   * @zh 属性 `_AMPM`（类型：`string`），用于存储或配置AMPM。
   */
  _AMPM: string;
  /**
   * Property `_clockView` (`MatClockView`) storing clock view (default: `"hour"`).
   * @zh 属性 `_clockView`（类型：`MatClockView`），用于存储或配置时钟视图（默认值：`"hour"`）。
   */
  _clockView: MatClockView = "hour";
  /**
   * Property `_calendarState` (`string`) storing calendar state.
   * @zh 属性 `_calendarState`（类型：`string`），用于存储或配置日历状态。
   */
  _calendarState: string;
  /**
   * Property `_intlChanges` (`Subscription`) storing intl changes.
   * @zh 属性 `_intlChanges`（类型：`Subscription`），用于存储或配置intl变更集合。
   */
  private _intlChanges: Subscription;
  /**
   * Property `_clampedActiveDate` (`D`) storing clamped active date.
   * @zh 属性 `_clampedActiveDate`（类型：`D`），用于存储或配置已限制范围激活日期。
   */
  private _clampedActiveDate: D;

  /**
   * Creates an instance of `MatDatetimepickerCalendar` and initializes its dependencies and internal state.
   * @zh 创建 `MatDatetimepickerCalendar` 实例，并初始化其依赖项与内部状态。
   * @param _elementRef - Injected or initial element ref (`ElementRef<any>`) / 注入或传入的元素引用（`ElementRef<any>`）
   * @param _intl - Injected or initial intl (`MatDatepickerIntl`) / 注入或传入的intl（`MatDatepickerIntl`）
   * @param _ngZone - Injected or initial ng zone (`NgZone`) / 注入或传入的Angular区域(NgZone)（`NgZone`）
   * @param _adapter - Injected or initial adapter (`DatetimeAdapter<D>`) / 注入或传入的适配器（`DatetimeAdapter<D>`）
   * @param _dateFormats - Injected or initial date formats (`MatDatetimeFormats`) / 注入或传入的日期格式列表（`MatDatetimeFormats`）
   * @param changeDetectorRef - Injected or initial change detector ref (`ChangeDetectorRef`) / 注入或传入的变更检测器引用（`ChangeDetectorRef`）
   */
  constructor(private _elementRef: ElementRef,
              private _intl: MatDatepickerIntl,
              private _ngZone: NgZone,
              @Optional() private _adapter: DatetimeAdapter<D>,
              @Optional() @Inject(MAT_DATETIME_FORMATS) private _dateFormats: MatDatetimeFormats,
              changeDetectorRef: ChangeDetectorRef) {
    if (!this._adapter) {
      throw createMissingDateImplError("DatetimeAdapter");
    }

    if (!this._dateFormats) {
      throw createMissingDateImplError("MAT_DATETIME_FORMATS");
    }

    this._intlChanges = _intl.changes.subscribe(() => changeDetectorRef.markForCheck());
  }

  /**
   * Property `_type` (`MatDatetimepickerType`) storing type (default: `"date"`).
   * @zh 属性 `_type`（类型：`MatDatetimepickerType`），用于存储或配置类型（默认值：`"date"`）。
   */
  private _type: MatDatetimepickerType = "date";

  /**
   * Getter for input property `type` (`MatDatetimepickerType`) returning type.
   * @zh 输入属性 `type`（类型：`MatDatetimepickerType`）的读取器，返回当前类型。
   */
  @Input()
  get type(): MatDatetimepickerType {
    return this._type;
  }

  /**
   * Sets the type (`type`).
   * @zh 设置类型（`type`）。
   * @param value - New type value (`MatDatetimepickerType`) / 新的类型值（`MatDatetimepickerType`）
   */
  set type(value: MatDatetimepickerType) {
    this._type = value || "date";
    if (this.type === "year") {
      this.multiYearSelector = true;
    }
  }

  /**
   * Property `_startAt` (`D`) storing start at.
   * @zh 属性 `_startAt`（类型：`D`），用于存储或配置开始位于。
   */
  private _startAt: D | null;

  /**
   * A date representing the period (month or year) to start the calendar in.
   * @zh 输入属性 `startAt`（类型：`D`）的读取器，返回当前开始位于。
   */
  @Input()
  get startAt(): D | null {
    return this._startAt;
  }

  /**
   * Sets the start at (`startAt`).
   * @zh 设置开始位于（`startAt`）。
   * @param value - New start at value (`D`) / 新的开始位于值（`D`）
   */
  set startAt(value: D | null) {
    this._startAt = this._adapter.getValidDateOrNull(value);
  }

  /**
   * Property `_selected` (`D`) storing selected.
   * @zh 属性 `_selected`（类型：`D`），用于存储或配置已选中。
   */
  private _selected: D | null;

  /**
   * The currently selected date.
   * @zh 输入属性 `selected`（类型：`D`）的读取器，返回当前已选中。
   */
  @Input()
  get selected(): D | null {
    return this._selected;
  }

  /**
   * Sets the selected (`selected`).
   * @zh 设置已选中（`selected`）。
   * @param value - New selected value (`D`) / 新的已选中值（`D`）
   */
  set selected(value: D | null) {
    this._selected = this._adapter.getValidDateOrNull(value);
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
    this._minDate = this._adapter.getValidDateOrNull(value);
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
    this._maxDate = this._adapter.getValidDateOrNull(value);
  }

  /**
   * The current active date. This determines which time period is shown and which date is
   * highlighted when using keyboard navigation.

   * @zh 获取当前激活日期（`_activeDate: D`）。
   */
  get _activeDate(): D {
    return this._clampedActiveDate;
  }

  /**
   * Sets the active date (`_activeDate`).
   * @zh 设置激活日期（`_activeDate`）。
   * @param value - New active date value (`D`) / 新的激活日期值（`D`）
   */
  set _activeDate(value: D) {
    const oldActiveDate = this._clampedActiveDate;
    this._clampedActiveDate = this._adapter.clampDate(value, this.minDate, this.maxDate);
    if (oldActiveDate && this._clampedActiveDate && this.currentView === "month" &&
      !this._adapter.sameMonthAndYear(oldActiveDate, this._clampedActiveDate)) {
      if (this._adapter.isInNextMonth(oldActiveDate, this._clampedActiveDate)) {
        this.calendarState("right");
      } else {
        this.calendarState("left");
      }
    }
  }

  /**
   * Whether the calendar is in month view.
   * @zh 属性 `_currentView`（类型：`MatCalendarView`），用于存储或配置当前视图。
   */
  _currentView: MatCalendarView;

  /**
   * Gets the current current view (`currentView: MatCalendarView`).
   * @zh 获取当前当前视图（`currentView: MatCalendarView`）。
   */
  get currentView(): MatCalendarView {
    return this._currentView;
  }

  /**
   * Sets the current view (`currentView`).
   * @zh 设置当前视图（`currentView`）。
   * @param view - New current view value (`MatCalendarView`) / 新的当前视图值（`MatCalendarView`）
   */
  set currentView(view: MatCalendarView) {
    this._currentView = view;
    this.viewChanged.emit(view);
  }

  /**
   * The label for the current calendar view.
   * @zh 获取当前年标签（`_yearLabel: string`）。
   */
  get _yearLabel(): string {
    return this._adapter.getYearName(this._activeDate);
  }

  /**
   * Gets the current month year label (`_monthYearLabel: string`).
   * @zh 获取当前月年标签（`_monthYearLabel: string`）。
   */
  get _monthYearLabel(): string {

    if (this.currentView === "multi-year") {
      // The offset from the active year to the "slot" for the starting year is the
      // *actual* first rendered year in the multi-year view, and the last year is
      // just yearsPerPage - 1 away.
      const activeYear = this._adapter.getYear(this._activeDate);
      const minYearOfPage = activeYear - getActiveOffset(
        this._adapter, this._activeDate, this.minDate, this.maxDate);
      const maxYearOfPage = minYearOfPage + yearsPerPage - 1;
      const minYearName =
        this._adapter.getYearName(this._adapter.createDate(minYearOfPage, 0, 1));
      const maxYearName =
        this._adapter.getYearName(this._adapter.createDate(maxYearOfPage, 0, 1));
      return this._intl.formatYearRange(minYearName, maxYearName);
    }

    return this.currentView === "month" ? this._adapter.getMonthNames("long")[this._adapter.getMonth(this._activeDate)] :
      this._adapter.getYearName(this._activeDate);
  }

  /**
   * Gets the current date label (`_dateLabel: string`).
   * @zh 获取当前日期标签（`_dateLabel: string`）。
   */
  get _dateLabel(): string {
    switch (this.type) {
      case "month":
        return this._adapter.getMonthNames("long")[this._adapter.getMonth(this._activeDate)];
      default:
        return this._adapter.format(this._activeDate, this._dateFormats.display.popupHeaderDateLabel);
    }
  }

  /**
   * Gets the current hours label (`_hoursLabel: string`).
   * @zh 获取当前小时数标签（`_hoursLabel: string`）。
   */
  get _hoursLabel(): string {
    let hour = this._adapter.getHour(this._activeDate);
    if (this.twelvehour) {
      if (hour === 0) {
        hour = 24;
      }
      hour = hour > 12 ? (hour - 12) : hour;
    }
    return this._2digit(hour);
  }

  /**
   * Gets the current minutes label (`_minutesLabel: string`).
   * @zh 获取当前分钟数标签（`_minutesLabel: string`）。
   */
  get _minutesLabel(): string {
    return this._2digit(this._adapter.getMinute(this._activeDate));
  }

  /**
   * Gets the current aria label next (`_ariaLabelNext: string`).
   * @zh 获取当前aria标签下一个（`_ariaLabelNext: string`）。
   */
  get _ariaLabelNext(): string {
    switch (this._currentView) {
      case "month":
        return this.ariaNextMonthLabel;
      case "year":
        return this.ariaNextYearLabel;
      case "multi-year":
        return this.ariaNextMultiYearLabel;
      default:
        return "";
    }
  }

  /**
   * Gets the current aria label prev (`_ariaLabelPrev: string`).
   * @zh 获取当前aria标签前一个（`_ariaLabelPrev: string`）。
   */
  get _ariaLabelPrev(): string {
    switch (this._currentView) {
      case "month":
        return this.ariaPrevMonthLabel;
      case "year":
        return this.ariaPrevYearLabel;
      case "multi-year":
        return this.ariaPrevMultiYearLabel;
      default:
        return "";
    }
  }

  /**
   * Date filter for the month and year views.
   * @zh 属性 `_dateFilterForViews`（类型：`(date: D) => boolean`），用于存储或配置日期过滤用于视图。
   */
  _dateFilterForViews = (date: D) => {
    return !!date &&
      (!this.dateFilter || this.dateFilter(date, MatDatetimepickerFilterType.DATE)) &&
      (!this.minDate || this._adapter.compareDate(date, this.minDate) >= 0) &&
      (!this.maxDate || this._adapter.compareDate(date, this.maxDate) <= 0);
  }

  /**
   * Executes `_userSelected` to handle user selected.
   * @zh 执行 `_userSelected`，用于用户已选中。
   */
  _userSelected(): void {
    this._userSelection.emit();
  }

  /**
   * Angular lifecycle hook invoked once after projected content (`ng-content`) is initialized.
   * @zh Angular 生命周期钩子：在投影内容（`ng-content`）初始化完成后调用一次。
   */
  ngAfterContentInit() {
    this._activeDate = this.startAt || this._adapter.today();
    this._selectAMPM(this._activeDate);
    this._focusActiveCell();
    if (this.type === "year") {
      this.currentView = "multi-year";
    } else if (this.type === "month") {
      this.currentView = "year";
    } else if (this.type === "time") {
      this.currentView = "clock";
    } else {
      this.currentView = this.startView || "month";
    }
  }

  /**
   * Angular lifecycle hook invoked just before the component, directive, or service is destroyed to release subscriptions and resources.
   * @zh Angular 生命周期钩子：在组件、指令或服务销毁前调用，用于释放订阅与清理资源。
   */
  ngOnDestroy() {
    this._intlChanges.unsubscribe();
  }

  /**
   * Handles date selection in the month view.
   * @zh 执行 `_dateSelected`，用于日期已选中。
   */
  _dateSelected(date: D): void {
    if (this.type === "date") {
      if (!this._adapter.sameDate(date, this.selected) || !this.preventSameDateTimeSelection) {
        this.selectedChange.emit(date);
      }
    } else {
      this._activeDate = date;
      this.currentView = "clock";
    }
  }

  /**
   * Handles month selection in the year view.
   * @zh 执行 `_monthSelected`，用于月已选中。
   */
  _monthSelected(month: D): void {
    if (this.type === "month") {
      if (!this._adapter.sameMonthAndYear(month, this.selected) || !this.preventSameDateTimeSelection) {
        this.selectedChange.emit(this._adapter.getFirstDateOfMonth(month));
      }
    } else {
      this._activeDate = month;
      this.currentView = "month";
      this._clockView = "hour";
    }
  }

  /**
   * Handles year selection in the multi year view.
   * @zh 执行 `_yearSelected`，用于年已选中。
   */
  _yearSelected(year: D): void {
    if (this.type === "year") {
      if (!this._adapter.sameYear(year, this.selected)  || !this.preventSameDateTimeSelection) {
        const normalizedDate = this._adapter.createDatetime(this._adapter.getYear(year), 0, 1, 0, 0);
        this.selectedChange.emit(normalizedDate);
      }
    } else {
      this._activeDate = year;
      this.currentView = "year";
    }
  }

  /**
   * Executes `_timeSelected` to handle time selected.
   * @zh 执行 `_timeSelected`，用于时间已选中。
   * @param date - date parameter (`D`) / 日期参数（`D`）
   */
  _timeSelected(date: D): void {
    if (this._clockView !== "minute") {
      this._activeDate = this._updateDate(date);
      this._clockView = "minute";
    } else {
      if (!this._adapter.sameDatetime(date, this.selected) || !this.preventSameDateTimeSelection) {
        this.selectedChange.emit(date);
      }
    }
  }

  /**
   * Executes `_onActiveDateChange` to handle on active date change.
   * @zh 执行 `_onActiveDateChange`，用于当激活日期变更。
   * @param date - date parameter (`D`) / 日期参数（`D`）
   */
  _onActiveDateChange(date: D) {
    this._activeDate = date;
  }

  /**
   * Executes `_updateDate` to handle update date.
   * @zh 执行 `_updateDate`，用于更新日期。
   * @param date - date parameter (`D`) / 日期参数（`D`）
   * @returns Result of type `D` / 类型为 `D` 的返回值
   */
  _updateDate(date: D): D {
    if (this.twelvehour) {
      const HOUR = this._adapter.getHour(date);
      if (HOUR === 12) {
        if (this._AMPM === "AM") {
          return this._adapter.addCalendarHours(date, -12);
        }
      } else if (this._AMPM === "PM") {
        return this._adapter.addCalendarHours(date, 12);
      }
    }
    return date;
  }

  /**
   * Executes `_selectAMPM` to handle select ampm.
   * @zh 执行 `_selectAMPM`，用于下拉选择AMPM。
   * @param date - date parameter (`D`) / 日期参数（`D`）
   */
  _selectAMPM(date: D) {
    if (this._adapter.getHour(date) > 11) {
      this._AMPM = "PM";
    } else {
      this._AMPM = "AM";
    }
  }

  /**
   * Executes `_ampmClicked` to handle ampm clicked.
   * @zh 执行 `_ampmClicked`，用于ampm点击。
   * @param source - source parameter (`string`) / 源参数（`string`）
   */
  _ampmClicked(source: string): void {
    if (source === this._AMPM) {
      return;
    }
    this._AMPM = source;
    if (this._AMPM === "AM") {
      this._activeDate = this._adapter.addCalendarHours(this._activeDate, -12);
    } else {
      this._activeDate = this._adapter.addCalendarHours(this._activeDate, 12);
    }

  }

  /**
   * Executes `_yearClicked` to handle year clicked.
   * @zh 执行 `_yearClicked`，用于年点击。
   */
  _yearClicked(): void {
    if (this.type === "year" || this.multiYearSelector) {
      this.currentView = "multi-year";
      return;
    }
    this.currentView = "year";
  }

  /**
   * Executes `_dateClicked` to handle date clicked.
   * @zh 执行 `_dateClicked`，用于日期点击。
   */
  _dateClicked(): void {
    if (this.type !== "month") {
      this.currentView = "month";
    }
  }

  /**
   * Executes `_hoursClicked` to handle hours clicked.
   * @zh 执行 `_hoursClicked`，用于小时数点击。
   */
  _hoursClicked(): void {
    this.currentView = "clock";
    this._clockView = "hour";
  }

  /**
   * Executes `_minutesClicked` to handle minutes clicked.
   * @zh 执行 `_minutesClicked`，用于分钟数点击。
   */
  _minutesClicked(): void {
    this.currentView = "clock";
    this._clockView = "minute";
  }

  /**
   * Handles user clicks on the previous button.
   * @zh 执行 `_previousClicked`，用于上一个点击。
   */
  _previousClicked(): void {
    this._activeDate = this.currentView === "month" ?
      this._adapter.addCalendarMonths(this._activeDate, -1) :
      this._adapter.addCalendarYears(
        this._activeDate, this.currentView === "year" ? -1 : -yearsPerPage
      );
  }

  /**
   * Handles user clicks on the next button.
   * @zh 执行 `_nextClicked`，用于下一个点击。
   */
  _nextClicked(): void {
    this._activeDate = this.currentView === "month" ?
      this._adapter.addCalendarMonths(this._activeDate, 1) :
      this._adapter.addCalendarYears(
        this._activeDate, this.currentView === "year" ? 1 : yearsPerPage
      );
  }

  /**
   * Whether the previous period button is enabled.
   * @zh 执行 `_previousEnabled`，用于上一个已启用。
   */
  _previousEnabled(): boolean {
    if (!this.minDate) {
      return true;
    }
    return !this.minDate || !this._isSameView(this._activeDate, this.minDate);
  }

  /**
   * Whether the next period button is enabled.
   * @zh 执行 `_nextEnabled`，用于下一个已启用。
   */
  _nextEnabled(): boolean {
    return !this.maxDate || !this._isSameView(this._activeDate, this.maxDate);
  }

  /**
   * Handles keydown events on the calendar body.
   * @zh 执行 `_handleCalendarBodyKeydown`，用于连接手柄日历主体按键按下。
   */
  _handleCalendarBodyKeydown(event: KeyboardEvent): void {

    if (this.currentView === "month") {
      this._handleCalendarBodyKeydownInMonthView(event);
    } else if (this.currentView === "year") {
      this._handleCalendarBodyKeydownInYearView(event);
    } else if (this.currentView === "multi-year") {
      this._handleCalendarBodyKeydownInMultiYearView(event);
    } else {
      this._handleCalendarBodyKeydownInClockView(event);
    }
  }

  /**
   * Executes `_focusActiveCell` to handle focus active cell.
   * @zh 执行 `_focusActiveCell`，用于聚焦激活单元格。
   */
  _focusActiveCell() {
    this._ngZone.runOutsideAngular(() => {
      this._ngZone.onStable.asObservable().pipe(first()).subscribe(() => {
        this._elementRef.nativeElement.focus();
      });
    });
  }

  /**
   * Executes `_calendarStateDone` to handle calendar state done.
   * @zh 执行 `_calendarStateDone`，用于日历状态完成。
   */
  _calendarStateDone() {
    this._calendarState = "";
  }

  /**
   * Whether the two dates represent the same view in the current view mode (month or year).
   * @zh 执行 `_isSameView`，用于是否为相同视图。
   */
  private _isSameView(date1: D, date2: D): boolean {
    if (this.currentView === "month") {
      return this._adapter.getYear(date1) === this._adapter.getYear(date2) &&
        this._adapter.getMonth(date1) === this._adapter.getMonth(date2);
    }
    if (this.currentView === "year") {
      return this._adapter.getYear(date1) === this._adapter.getYear(date2);
    }
    // Otherwise we are in 'multi-year' view.
    return isSameMultiYearView(
      this._adapter, date1, date2, this.minDate, this.maxDate);
  }

  /**
   * Handles keydown events on the calendar body when calendar is in month view.
   * @zh 执行 `_handleCalendarBodyKeydownInMonthView`，用于连接手柄日历主体按键按下在月视图。
   */
  private _handleCalendarBodyKeydownInMonthView(event: KeyboardEvent): void {
    // tslint:disable-next-line:deprecation
    switch (event.keyCode) {
      case LEFT_ARROW:
        this._activeDate = this._adapter.addCalendarDays(this._activeDate, -1);
        break;
      case RIGHT_ARROW:
        this._activeDate = this._adapter.addCalendarDays(this._activeDate, 1);
        break;
      case UP_ARROW:
        this._activeDate = this._adapter.addCalendarDays(this._activeDate, -7);
        break;
      case DOWN_ARROW:
        this._activeDate = this._adapter.addCalendarDays(this._activeDate, 7);
        break;
      case HOME:
        this._activeDate = this._adapter.addCalendarDays(this._activeDate,
          1 - this._adapter.getDate(this._activeDate));
        break;
      case END:
        this._activeDate = this._adapter.addCalendarDays(this._activeDate,
          (this._adapter.getNumDaysInMonth(this._activeDate) -
            this._adapter.getDate(this._activeDate)));
        break;
      case PAGE_UP:
        this._activeDate = event.altKey ?
          this._adapter.addCalendarYears(this._activeDate, -1) :
          this._adapter.addCalendarMonths(this._activeDate, -1);
        break;
      case PAGE_DOWN:
        this._activeDate = event.altKey ?
          this._adapter.addCalendarYears(this._activeDate, 1) :
          this._adapter.addCalendarMonths(this._activeDate, 1);
        break;
      case ENTER:
        if (this._dateFilterForViews(this._activeDate)) {
          this._dateSelected(this._activeDate);
          // Prevent unexpected default actions such as form submission.
          event.preventDefault();
        }
        return;
      default:
        // Don't prevent default or focus active cell on keys that we don't explicitly handle.
        return;
    }

    // Prevent unexpected default actions such as form submission.
    event.preventDefault();
  }

  /**
   * Handles keydown events on the calendar body when calendar is in year view.
   * @zh 执行 `_handleCalendarBodyKeydownInYearView`，用于连接手柄日历主体按键按下在年视图。
   */
  private _handleCalendarBodyKeydownInYearView(event: KeyboardEvent): void {
    // tslint:disable-next-line:deprecation
    switch (event.keyCode) {
      case LEFT_ARROW:
        this._activeDate = this._adapter.addCalendarMonths(this._activeDate, -1);
        break;
      case RIGHT_ARROW:
        this._activeDate = this._adapter.addCalendarMonths(this._activeDate, 1);
        break;
      case UP_ARROW:
        this._activeDate = this._prevMonthInSameCol(this._activeDate);
        break;
      case DOWN_ARROW:
        this._activeDate = this._nextMonthInSameCol(this._activeDate);
        break;
      case HOME:
        this._activeDate = this._adapter.addCalendarMonths(this._activeDate,
          -this._adapter.getMonth(this._activeDate));
        break;
      case END:
        this._activeDate = this._adapter.addCalendarMonths(this._activeDate,
          11 - this._adapter.getMonth(this._activeDate));
        break;
      case PAGE_UP:
        this._activeDate =
          this._adapter.addCalendarYears(this._activeDate, event.altKey ? -10 : -1);
        break;
      case PAGE_DOWN:
        this._activeDate =
          this._adapter.addCalendarYears(this._activeDate, event.altKey ? 10 : 1);
        break;
      case ENTER:
        this._monthSelected(this._activeDate);
        break;
      default:
        // Don't prevent default or focus active cell on keys that we don't explicitly handle.
        return;
    }

    // Prevent unexpected default actions such as form submission.
    event.preventDefault();
  }

  /**
   * Handles keydown events on the calendar body when calendar is in multi-year view.
   * @zh 执行 `_handleCalendarBodyKeydownInMultiYearView`，用于连接手柄日历主体按键按下在多年视图。
   */
  private _handleCalendarBodyKeydownInMultiYearView(event: KeyboardEvent): void {
    // tslint:disable-next-line:deprecation
    switch (event.keyCode) {
      case LEFT_ARROW:
        this._activeDate = this._adapter.addCalendarYears(this._activeDate, -1);
        break;
      case RIGHT_ARROW:
        this._activeDate = this._adapter.addCalendarYears(this._activeDate, 1);
        break;
      case UP_ARROW:
        this._activeDate = this._adapter.addCalendarYears(this._activeDate, -yearsPerRow);
        break;
      case DOWN_ARROW:
        this._activeDate = this._adapter.addCalendarYears(this._activeDate, yearsPerRow);
        break;
      case HOME:
        this._activeDate = this._adapter.addCalendarYears(this._activeDate,
          -getActiveOffset(this._adapter, this._activeDate, this.minDate, this.maxDate));
        break;
      case END:
        this._activeDate = this._adapter.addCalendarYears(this._activeDate,
          yearsPerPage - getActiveOffset(
          this._adapter, this._activeDate, this.minDate, this.maxDate) - 1);
        break;
      case PAGE_UP:
        this._activeDate =
          this._adapter.addCalendarYears(
            this._activeDate, event.altKey ? -yearsPerPage * 10 : -yearsPerPage);
        break;
      case PAGE_DOWN:
        this._activeDate =
          this._adapter.addCalendarYears(
            this._activeDate, event.altKey ? yearsPerPage * 10 : yearsPerPage);
        break;
      case ENTER:
        this._yearSelected(this._activeDate);
        break;
      default:
        // Don't prevent default or focus active cell on keys that we don't explicitly handle.
        return;
    }
  }

  /**
   * Handles keydown events on the calendar body when calendar is in month view.
   * @zh 执行 `_handleCalendarBodyKeydownInClockView`，用于连接手柄日历主体按键按下在时钟视图。
   */
  private _handleCalendarBodyKeydownInClockView(event: KeyboardEvent): void {
    // tslint:disable-next-line:deprecation
    switch (event.keyCode) {
      case UP_ARROW:
        this._activeDate = this._clockView === "hour" ?
          this._adapter.addCalendarHours(this._activeDate, 1) :
          this._adapter.addCalendarMinutes(this._activeDate, 1);
        break;
      case DOWN_ARROW:
        this._activeDate = this._clockView === "hour" ?
          this._adapter.addCalendarHours(this._activeDate, -1) :
          this._adapter.addCalendarMinutes(this._activeDate, -1);
        break;
      case ENTER:
        this._timeSelected(this._activeDate);
        return;
      default:
        // Don't prevent default or focus active cell on keys that we don't explicitly handle.
        return;
    }

    // Prevent unexpected default actions such as form submission.
    event.preventDefault();
  }

  /**
   * Determine the date for the month that comes before the given month in the same column in the
   * calendar table.

   * @zh 执行 `_prevMonthInSameCol`，用于前一个月在相同列。
   */
  private _prevMonthInSameCol(date: D): D {
    // Determine how many months to jump forward given that there are 2 empty slots at the beginning
    // of each year.
    const increment = this._adapter.getMonth(date) <= 4 ? -5 :
      (this._adapter.getMonth(date) >= 7 ? -7 : -12);
    return this._adapter.addCalendarMonths(date, increment);
  }

  /**
   * Determine the date for the month that comes after the given month in the same column in the
   * calendar table.

   * @zh 执行 `_nextMonthInSameCol`，用于下一个月在相同列。
   */
  private _nextMonthInSameCol(date: D): D {
    // Determine how many months to jump forward given that there are 2 empty slots at the beginning
    // of each year.
    const increment = this._adapter.getMonth(date) <= 4 ? 7 :
      (this._adapter.getMonth(date) >= 7 ? 5 : 12);
    return this._adapter.addCalendarMonths(date, increment);
  }

  /**
   * Executes `calendarState` to handle calendar state.
   * @zh 执行 `calendarState`，用于日历状态。
   * @param direction - direction parameter (`string`) / 方向参数（`string`）
   */
  private calendarState(direction: string): void {
    this._calendarState = direction;
  }

  /**
   * Executes `_2digit` to handle 2digit.
   * @zh 执行 `_2digit`，用于2digit。
   * @param n - n parameter (`number`) / n参数（`number`）
   */
  private _2digit(n: number) {
    return ("00" + n).slice(-2);
  }
}
