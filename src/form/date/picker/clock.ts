/**
 * @fileoverview Module `src/form/date/picker/clock.ts` providing clock definitions and implementation.
 * @zh 模块文件 `src/form/date/picker/clock.ts`，提供时钟相关的定义与实现。
 */

/* tslint:disable */
import {AfterContentInit, Component, ElementRef, EventEmitter, Input, Output} from "@angular/core";
import {DatetimeAdapter} from "@dotos/dui/form/date/adapter";
import {MatDatetimepickerFilterType} from "./datetimepicker-filtertype";

/**
 * Constant/variable `CLOCK_RADIUS` defining clock radius in `src/form/date/picker`.
 * @zh 常量/变量 `CLOCK_RADIUS`，定义 `src/form/date/picker` 中的时钟半径。
 */
export const CLOCK_RADIUS = 50;
/**
 * Constant/variable `CLOCK_INNER_RADIUS` defining clock inner radius in `src/form/date/picker`.
 * @zh 常量/变量 `CLOCK_INNER_RADIUS`，定义 `src/form/date/picker` 中的时钟内部半径。
 */
export const CLOCK_INNER_RADIUS = 27.5;
/**
 * Constant/variable `CLOCK_OUTER_RADIUS` defining clock outer radius in `src/form/date/picker`.
 * @zh 常量/变量 `CLOCK_OUTER_RADIUS`，定义 `src/form/date/picker` 中的时钟外部半径。
 */
export const CLOCK_OUTER_RADIUS = 41.25;
/**
 * Constant/variable `CLOCK_TICK_RADIUS` defining clock tick radius in `src/form/date/picker`.
 * @zh 常量/变量 `CLOCK_TICK_RADIUS`，定义 `src/form/date/picker` 中的时钟刻度半径。
 */
export const CLOCK_TICK_RADIUS = 7.0833;

/**
 * Type alias `MatClockView` representing mat clock view (`"hour" | "minute"`).
 * @zh 类型别名 `MatClockView`，表示Material时钟视图（`"hour" | "minute"`）。
 */
export type MatClockView = "hour" | "minute";

/**
 * A clock that is used as part of the datepicker.
 * @docs-private

 * @zh Angular 组件 `MatDatetimepickerClock`（selector: 'mat-datetimepicker-clock'），提供Material日期时间选择器时钟的视图渲染与交互逻辑（位于 `src/form/date/picker`）。
 */
@Component({
  selector: "mat-datetimepicker-clock",
  templateUrl: "clock.html",
  styleUrls: ["clock.scss"],
  host: {
    "role": "clock",
    "(mousedown)": "_handleMousedown($event)",
    hostID: "mat-datetimepicker-clock" + Math.random().toString(36).substring(2, 15),
  }
})
export class MatDatetimepickerClock<D> implements AfterContentInit {

  /**
   * Output event emitter `_userSelection` (`EventEmitter`) firing when user selection occurs.
   * @zh 输出事件 `_userSelection`（类型：`EventEmitter`），当触发用户Selection时向外发出事件。
   */
  @Output() _userSelection = new EventEmitter<void>();
  /**
   * A function used to filter which dates are selectable.
   * @zh 输入属性 `dateFilter`（类型：`(date: D, type: MatDatetimepickerFilterType) => boolean`），用于配置日期过滤。
   */
  @Input() dateFilter: (date: D, type: MatDatetimepickerFilterType) => boolean;
  /**
   * Input property `interval` (`number`) configuring interval (default: `1`).
   * @zh 输入属性 `interval`（类型：`number`），用于配置间隔定时器（默认值：`1`）。
   */
  @Input() interval: number = 1;
  /**
   * Input property `twelvehour` (`boolean`) configuring twelvehour (default: `false`).
   * @zh 输入属性 `twelvehour`（类型：`boolean`），用于配置twelvehour（默认值：`false`）。
   */
  @Input() twelvehour: boolean = false;
  /**
   * Emits when the currently selected date changes.
   * @zh 输出事件 `selectedChange`（类型：`EventEmitter`），当触发已选中变更时向外发出事件。
   */
  @Output() selectedChange = new EventEmitter<D>();
  /**
   * Output event emitter `activeDateChange` (`EventEmitter`) firing when active date change occurs.
   * @zh 输出事件 `activeDateChange`（类型：`EventEmitter`），当触发激活日期变更时向外发出事件。
   */
  @Output() activeDateChange = new EventEmitter<D>();
  /**
   * Hours and Minutes representing the clock view.
   * @zh 属性 `_hours`（类型：`Array<any>`），用于存储或配置小时数（默认值：`[]`）。
   */
  _hours = [];
  /**
   * Property `_minutes` (`Array<any>`) storing minutes (default: `[]`).
   * @zh 属性 `_minutes`（类型：`Array<any>`），用于存储或配置分钟数（默认值：`[]`）。
   */
  _minutes = [];
  /**
   * Whether the clock is in hour view.
   * @zh 属性 `_hourView`（类型：`boolean`），用于存储或配置小时视图（默认值：`true`）。
   */
  _hourView: boolean = true;
  /**
   * Property `_selectedHour` (`number`) storing selected hour.
   * @zh 属性 `_selectedHour`（类型：`number`），用于存储或配置已选中小时。
   */
  _selectedHour: number;
  /**
   * Property `_selectedMinute` (`number`) storing selected minute.
   * @zh 属性 `_selectedMinute`（类型：`number`），用于存储或配置已选中分钟。
   */
  _selectedMinute: number;
  /**
   * Property `_timeChanged` (`boolean`) storing time changed (default: `false`).
   * @zh 属性 `_timeChanged`（类型：`boolean`），用于存储或配置时间已变更（默认值：`false`）。
   */
  private _timeChanged = false;
  /**
   * Property `mouseMoveListener` (`any`) storing mouse move listener.
   * @zh 属性 `mouseMoveListener`（类型：`any`），用于存储或配置鼠标移动监听器。
   */
  private mouseMoveListener;
  /**
   * Property `mouseUpListener` (`any`) storing mouse up listener.
   * @zh 属性 `mouseUpListener`（类型：`any`），用于存储或配置鼠标向上监听器。
   */
  private mouseUpListener;

  /**
   * Creates an instance of `MatDatetimepickerClock` and initializes its dependencies and internal state.
   * @zh 创建 `MatDatetimepickerClock` 实例，并初始化其依赖项与内部状态。
   * @param _element - Injected or initial element (`ElementRef`) / 注入或传入的元素（`ElementRef`）
   * @param _adapter - Injected or initial adapter (`DatetimeAdapter<D>`) / 注入或传入的适配器（`DatetimeAdapter<D>`）
   */
  constructor(private _element: ElementRef,
              private _adapter: DatetimeAdapter<D>) {
    this.mouseMoveListener = (event) => {
      this._handleMousemove(event);
    };
    this.mouseUpListener = () => {
      this._handleMouseup();
    };
  }

  /**
   * Property `_activeDate` (`D`) storing active date.
   * @zh 属性 `_activeDate`（类型：`D`），用于存储或配置激活日期。
   */
  private _activeDate: D;

  /**
   * The date to display in this clock view.

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
    this._activeDate = this._adapter.clampDate(value, this.minDate, this.maxDate);
    if (!this._adapter.sameMinute(oldActiveDate, this._activeDate)) {
      this._init();
    }
  }

  /**
   * Property `_selected` (`D | null`) storing selected.
   * @zh 属性 `_selected`（类型：`D | null`），用于存储或配置已选中。
   */
  private _selected: D | null;

  /**
   * The currently selected date.
   * @zh 输入属性 `selected`（类型：`D | null`）的读取器，返回当前已选中。
   */
  @Input()
  get selected(): D | null {
    return this._selected;
  }

  /**
   * Sets the selected (`selected`).
   * @zh 设置已选中（`selected`）。
   * @param value - New selected value (`D | null`) / 新的已选中值（`D | null`）
   */
  set selected(value: D | null) {
    this._selected = this._adapter.getValidDateOrNull(this._adapter.deserialize(value));
    if (this._selected) {
      this.activeDate = this._selected;
    }
  }

  /**
   * Property `_minDate` (`D | null`) storing min date.
   * @zh 属性 `_minDate`（类型：`D | null`），用于存储或配置最小值日期。
   */
  private _minDate: D | null;

  /**
   * The minimum selectable date.
   * @zh 输入属性 `minDate`（类型：`D | null`）的读取器，返回当前最小值日期。
   */
  @Input()
  get minDate(): D | null {
    return this._minDate;
  }

  /**
   * Sets the min date (`minDate`).
   * @zh 设置最小值日期（`minDate`）。
   * @param value - New min date value (`D | null`) / 新的最小值日期值（`D | null`）
   */
  set minDate(value: D | null) {
    this._minDate = this._adapter.getValidDateOrNull(this._adapter.deserialize(value));
  }

  /**
   * Property `_maxDate` (`D | null`) storing max date.
   * @zh 属性 `_maxDate`（类型：`D | null`），用于存储或配置最大值日期。
   */
  private _maxDate: D | null;

  /**
   * The maximum selectable date.
   * @zh 输入属性 `maxDate`（类型：`D | null`）的读取器，返回当前最大值日期。
   */
  @Input()
  get maxDate(): D | null {
    return this._maxDate;
  }

  /**
   * Sets the max date (`maxDate`).
   * @zh 设置最大值日期（`maxDate`）。
   * @param value - New max date value (`D | null`) / 新的最大值日期值（`D | null`）
   */
  set maxDate(value: D | null) {
    this._maxDate = this._adapter.getValidDateOrNull(this._adapter.deserialize(value));
  }

  /**
   * Whether the clock should be started in hour or minute view.
   * @zh 输入属性 `startView` 的设置器，用于更新开始视图。
   */
  @Input()
  set startView(value: MatClockView) {
    this._hourView = value != "minute";
  }

  /**
   * Gets the current hand (`_hand: any`).
   * @zh 获取当前hand（`_hand: any`）。
   */
  get _hand() {
    let hour = this._adapter.getHour(this.activeDate);
    if (this.twelvehour) {
      if (hour === 0) {
        hour = 24;
      }
      this._selectedHour = hour > 12 ? (hour - 12) : hour;
    } else {
      this._selectedHour = hour;
    }
    this._selectedMinute = this._adapter.getMinute(this.activeDate);
    let deg = 0;
    let radius = CLOCK_OUTER_RADIUS;
    if (this._hourView) {
      let outer = this._selectedHour > 0 && this._selectedHour < 13;
      radius = outer ? CLOCK_OUTER_RADIUS : CLOCK_INNER_RADIUS;
      if (this.twelvehour) {
        radius = CLOCK_OUTER_RADIUS;
      }
      deg = Math.round(this._selectedHour * (360 / (24 / 2)));
    } else {
      deg = Math.round(this._selectedMinute * (360 / 60));
    }
    return {
      "transform": `rotate(${deg}deg)`,
      "height": `${radius}%`,
      "margin-top": `${50 - radius}%`
    };
  }

  /**
   * Angular lifecycle hook invoked once after projected content (`ng-content`) is initialized.
   * @zh Angular 生命周期钩子：在投影内容（`ng-content`）初始化完成后调用一次。
   */
  ngAfterContentInit() {
    this.activeDate = this._activeDate || this._adapter.today();
    this._init();
  }

  /**
   * Handles mousedown events on the clock body.
   * @zh 执行 `_handleMousedown`，用于连接手柄鼠标按下。
   */
  _handleMousedown(event) {
    this._timeChanged = false;
    this.setTime(event);
    document.addEventListener("mousemove", this.mouseMoveListener);
    document.addEventListener("touchmove", this.mouseMoveListener);
    document.addEventListener("mouseup", this.mouseUpListener);
    document.addEventListener("touchend", this.mouseUpListener);
  }

  /**
   * Executes `_handleMousemove` to handle handle mousemove.
   * @zh 执行 `_handleMousemove`，用于连接手柄鼠标移动。
   * @param event - event parameter (`any`) / 事件参数（`any`）
   */
  _handleMousemove(event) {
    event.preventDefault();
    this.setTime(event);
  }

  /**
   * Executes `_handleMouseup` to handle handle mouseup.
   * @zh 执行 `_handleMouseup`，用于连接手柄鼠标抬起。
   */
  _handleMouseup() {
    document.removeEventListener("mousemove", this.mouseMoveListener);
    document.removeEventListener("touchmove", this.mouseMoveListener);
    document.removeEventListener("mouseup", this.mouseUpListener);
    document.removeEventListener("touchend", this.mouseUpListener);
    if (this._timeChanged) {
      this.selectedChange.emit(this.activeDate);
      if (!this._hourView) {
        this._userSelection.emit();
      }
    }
  }

  /**
   * Initializes this clock view.
   * @zh 执行 `_init`，用于初始化。
   */
  private _init() {
    this._hours.length = 0;
    this._minutes.length = 0;

    let hourNames = this._adapter.getHourNames();
    let minuteNames = this._adapter.getMinuteNames();

    if (this.twelvehour) {
      for (let i = 1; i < (hourNames.length / 2) + 1; i++) {
        let radian = i / 6 * Math.PI;
        let radius = CLOCK_OUTER_RADIUS;
        const date = this._adapter.createDatetime(
          this._adapter.getYear(this.activeDate),
          this._adapter.getMonth(this.activeDate),
          this._adapter.getDate(this.activeDate), i + 1, 0);
        let enabled =
          (!this.minDate || this._adapter.compareDatetime(date, this.minDate) >= 0) &&
          (!this.maxDate || this._adapter.compareDatetime(date, this.maxDate) <= 0);
        this._hours.push({
          value: i,
          displayValue: i === 0 ? "00" : hourNames[i],
          enabled: enabled,
          top: CLOCK_RADIUS - Math.cos(radian) * radius - CLOCK_TICK_RADIUS,
          left: CLOCK_RADIUS + Math.sin(radian) * radius - CLOCK_TICK_RADIUS
        });
      }
    } else {
      for (let i = 0; i < hourNames.length; i++) {
        let radian = i / 6 * Math.PI;
        let outer = i > 0 && i < 13,
          radius = outer ? CLOCK_OUTER_RADIUS : CLOCK_INNER_RADIUS;
        const date = this._adapter.createDatetime(
          this._adapter.getYear(this.activeDate),
          this._adapter.getMonth(this.activeDate),
          this._adapter.getDate(this.activeDate), i, 0);
        let enabled =
          (!this.minDate || this._adapter.compareDatetime(date, this.minDate, false) >= 0) &&
          (!this.maxDate || this._adapter.compareDatetime(date, this.maxDate, false) <= 0) &&
          (!this.dateFilter || this.dateFilter(date, MatDatetimepickerFilterType.HOUR));
        this._hours.push({
          value: i,
          displayValue: i === 0 ? "00" : hourNames[i],
          enabled: enabled,
          top: CLOCK_RADIUS - Math.cos(radian) * radius - CLOCK_TICK_RADIUS,
          left: CLOCK_RADIUS + Math.sin(radian) * radius - CLOCK_TICK_RADIUS,
          fontSize: i > 0 && i < 13 ? "" : "80%"
        });
      }
    }

    for (let i = 0; i < minuteNames.length; i += 5) {
      let radian = i / 30 * Math.PI;
      const date = this._adapter.createDatetime(
        this._adapter.getYear(this.activeDate),
        this._adapter.getMonth(this.activeDate),
        this._adapter.getDate(this.activeDate), this._adapter.getHour(this.activeDate), i);
      let enabled =
        (!this.minDate || this._adapter.compareDatetime(date, this.minDate) >= 0) &&
        (!this.maxDate || this._adapter.compareDatetime(date, this.maxDate) <= 0) &&
        (!this.dateFilter || this.dateFilter(date, MatDatetimepickerFilterType.MINUTE));
      this._minutes.push({
        value: i,
        displayValue: i === 0 ? "00" : minuteNames[i],
        enabled: enabled,
        top: CLOCK_RADIUS - Math.cos(radian) * CLOCK_OUTER_RADIUS - CLOCK_TICK_RADIUS,
        left: CLOCK_RADIUS + Math.sin(radian) * CLOCK_OUTER_RADIUS - CLOCK_TICK_RADIUS
      });
    }
  }

  /**
   * Set Time
   * @param event

   * @zh 执行 `setTime`，用于集合时间。
   */
  private setTime(event) {
    let trigger = this._element.nativeElement;
    let triggerRect = trigger.getBoundingClientRect();
    let width = trigger.offsetWidth;
    let height = trigger.offsetHeight;
    let pageX = event.pageX !== undefined ? event.pageX : event.touches[0].pageX;
    let pageY = event.pageY !== undefined ? event.pageY : event.touches[0].pageY;
    let x = (width / 2) - (pageX - triggerRect.left - window.pageXOffset);
    let y = (height / 2) - (pageY - triggerRect.top - window.pageYOffset);
    let radian = Math.atan2(-x, y);
    let unit = Math.PI / (this._hourView ? 6 : (this.interval ? (30 / this.interval) : 30));
    let z = Math.sqrt(x * x + y * y);
    let outer = this._hourView && z > ((width * (CLOCK_OUTER_RADIUS / 100)) +
      (width * (CLOCK_INNER_RADIUS / 100))) / 2;

    if (radian < 0) {
      radian = Math.PI * 2 + radian;
    }
    let value = Math.round(radian / unit);

    let date;
    if (this._hourView) {
      if (this.twelvehour) {
        value = value === 0 ? 12 : value;
      } else {
        if (value === 12) {
          value = 0;
        }
        value = outer ? (value === 0 ? 12 : value) : value === 0 ? 0 : value + 12;
      }
      date = this._adapter.createDatetime(
        this._adapter.getYear(this.activeDate),
        this._adapter.getMonth(this.activeDate),
        this._adapter.getDate(this.activeDate), value, this._adapter.getMinute(this.activeDate));
    } else {
      if (this.interval) {
        value *= this.interval;
      }
      if (value === 60) {
        value = 0;
      }
      date = this._adapter.createDatetime(
        this._adapter.getYear(this.activeDate),
        this._adapter.getMonth(this.activeDate),
        this._adapter.getDate(this.activeDate), this._adapter.getHour(this.activeDate), value);
    }

    this._timeChanged = true;
    this.activeDate = date;
    this.activeDateChange.emit(this.activeDate);
  }
}

