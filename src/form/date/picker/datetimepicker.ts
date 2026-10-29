/**
 * @fileoverview Module `src/form/date/picker/datetimepicker.ts` providing datetimepicker definitions and implementation.
 * @zh 模块文件 `src/form/date/picker/datetimepicker.ts`，提供日期时间选择器相关的定义与实现。
 */

import {Directionality} from "@angular/cdk/bidi";
import {coerceBooleanProperty} from "@angular/cdk/coercion";
import {ESCAPE} from "@angular/cdk/keycodes";
import {NoopScrollStrategy, Overlay, OverlayConfig, OverlayRef, PositionStrategy} from "@angular/cdk/overlay";
import {ComponentPortal} from "@angular/cdk/portal";
import {DOCUMENT} from "@angular/common";
import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ComponentRef,
  EventEmitter,
  Inject,
  Input,
  NgZone,
  OnDestroy,
  Optional,
  Output,
  ViewChild,
  ViewContainerRef,
  ViewEncapsulation
} from "@angular/core";
// import {MAT_DATEPICKER_SCROLL_STRATEGY} from "@angular/material/datepicker";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {Subject, Subscription} from "rxjs";
import {first} from "rxjs/operators";
import {DatetimeAdapter} from "@dotos/dui/form/date/adapter";

import {MatCalendarView, MatDatetimepickerCalendar} from "./calendar";
import {createMissingDateImplError} from "./datetimepicker-errors";
import {MatDatetimepickerFilterType} from "./datetimepicker-filtertype";
import {MatDatetimepickerInput} from "./datetimepicker-input";

/**
 * Type alias `MatDatetimepickerType` representing mat datetimepicker type (`"date" | "time" | "month" | "year" | "datetime"`).
 * @zh 类型别名 `MatDatetimepickerType`，表示Material日期时间选择器类型（`"date" | "time" | "month" | "year" | "datetime"`）。
 */
export type MatDatetimepickerType = "date" | "time" | "month" | "year" | "datetime";
/**
 * Type alias `MatDatetimepickerMode` representing mat datetimepicker mode (`"auto" | "portrait" | "landscape"`).
 * @zh 类型别名 `MatDatetimepickerMode`，表示Material日期时间选择器模式（`"auto" | "portrait" | "landscape"`）。
 */
export type MatDatetimepickerMode = "auto" | "portrait" | "landscape";

/**
 * Used to generate a unique ID for each datepicker instance.
 * @zh 常量/变量 `datetimepickerUid`，定义 `src/form/date/picker` 中的日期时间选择器Uid。
 */
let datetimepickerUid = 0;

/**
 * Component used as the content for the datepicker dialog and popup. We use this instead of using
 * MatCalendar directly as the content so we can control the initial focus. This also gives us a
 * place to put additional features of the popup that are not part of the calendar itself in the
 * future. (e.g. confirmation buttons).
 * @docs-private

 * @zh Angular 组件 `MatDatetimepickerContent`（selector: 'mat-datetimepicker-content'），提供Material日期时间选择器内容的视图渲染与交互逻辑（位于 `src/form/date/picker`）。
 */
@Component({
  selector: "mat-datetimepicker-content",
  templateUrl: "datetimepicker-content.html",
  styleUrls: ["datetimepicker-content.scss"],
  host: {
    "class": "mat-datetimepicker-content",
    "[class.mat-datetimepicker-content-touch]": "datetimepicker?.touchUi",
    "(keydown)": "_handleKeydown($event)",
    hostID: "mat-datetimepicker-content" + Math.random().toString(36).substring(2, 15)
  },
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MatDatetimepickerContent<D> implements AfterContentInit {
  /**
   * Property `datetimepicker` (`MatDatetimepicker<D>`) storing datetimepicker.
   * @zh 属性 `datetimepicker`（类型：`MatDatetimepicker<D>`），用于存储或配置日期时间选择器。
   */
  datetimepicker: MatDatetimepicker<D>;

  /**
   * Template/content query reference `_calendar` (`MatDatetimepickerCalendar<D>`) targeting calendar.
   * @zh 模板/内容视图查询引用 `_calendar`（`@ViewChild`），指向日历。
   */
  @ViewChild(MatDatetimepickerCalendar, {static: true}) _calendar: MatDatetimepickerCalendar<D>;

  /**
   * Angular lifecycle hook invoked once after projected content (`ng-content`) is initialized.
   * @zh Angular 生命周期钩子：在投影内容（`ng-content`）初始化完成后调用一次。
   */
  ngAfterContentInit() {
    this._calendar._focusActiveCell();
  }

  /**
   * Executes `onSelectionChange` to handle on selection change.
   * @zh 执行 `onSelectionChange`，用于当Selection变更。
   * @param date - date parameter (`D`) / 日期参数（`D`）
   */
  onSelectionChange(date: D) {
    this.datetimepicker._select(date);
    this.datetimepicker.close();
  }

  /**
   * Handles keydown event on datepicker content.
   * @param event The event.

   * @zh 执行 `_handleKeydown`，用于连接手柄按键按下。
   */
  _handleKeydown(event: KeyboardEvent): void {
    // tslint:disable-next-line:deprecation
    if (event.keyCode === ESCAPE) {
      this.datetimepicker.close();
      event.preventDefault();
      event.stopPropagation();
    }
  }
}

/**
 * Angular component `MatDatetimepicker` (selector: 'mat-datetimepicker') providing mat datetimepicker presentation and interaction in `src/form/date/picker`.
 * @zh Angular 组件 `MatDatetimepicker`（selector: 'mat-datetimepicker'），提供Material日期时间选择器的视图渲染与交互逻辑（位于 `src/form/date/picker`）。
 */
@Component({
  selector: "mat-datetimepicker",
  exportAs: "matDatetimepicker",
  template: "",
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  preserveWhitespaces: false,
  host: {hostID: "mat-datetimepicker" + Math.random().toString(36).substring(2, 15)
  },
})
export class MatDatetimepicker<D> implements OnDestroy {
  /**
   * Active multi year view when click on year.
   * @zh 输入属性 `multiYearSelector`（类型：`boolean`），用于配置多年选择器（默认值：`false`）。
   */
  @Input() multiYearSelector: boolean = false;
  /**
   * if true change the clock to 12 hour format.
   * @zh 输入属性 `twelvehour`（类型：`boolean`），用于配置twelvehour（默认值：`false`）。
   */
  @Input() twelvehour: boolean = false;
  /**
   * The view that the calendar should start in.
   * @zh 输入属性 `startView`（类型：`MatCalendarView`），用于配置开始视图（默认值：`"month"`）。
   */
  @Input() startView: MatCalendarView = "month";
  /**
   * Input property `mode` (`MatDatetimepickerMode`) configuring mode (default: `"auto"`).
   * @zh 输入属性 `mode`（类型：`MatDatetimepickerMode`），用于配置模式（默认值：`"auto"`）。
   */
  @Input() mode: MatDatetimepickerMode = "auto";
  /**
   * Input property `timeInterval` (`number`) configuring time interval (default: `1`).
   * @zh 输入属性 `timeInterval`（类型：`number`），用于配置时间间隔定时器（默认值：`1`）。
   */
  @Input() timeInterval: number = 1;
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
   * Prevent user to select same date time
   * @zh 输入属性 `preventSameDateTimeSelection`（类型：`boolean`），用于配置阻止默认相同日期时间Selection（默认值：`false`）。
   */
  @Input() preventSameDateTimeSelection = false;
  /**
   * Emits new selected date when selected date changes.
   * @deprecated Switch to the `dateChange` and `dateInput` binding on the input element.

   * @zh 输出事件 `selectedChanged`（类型：`EventEmitter<D>`），当触发已选中已变更时向外发出事件。
   */
  @Output() selectedChanged = new EventEmitter<D>();
  /**
   * Classes to be passed to the date picker panel. Supports the same syntax as `ngClass`.
   * @zh 输入属性 `panelClass`（类型：`string | string[]`），用于配置面板类名。
   */
  @Input() panelClass: string | string[];
  /**
   * Emits when the datepicker has been opened.
   * @zh 输出事件 `opened`（类型：`EventEmitter<void>`），当触发是否展开流时向外发出事件。
   */
    // tslint:disable-next-line:no-output-rename
  @Output("opened") openedStream: EventEmitter<void> = new EventEmitter<void>();
  /**
   * Emits when the datepicker has been closed.
   * @zh 输出事件 `closed`（类型：`EventEmitter<void>`），当触发是否关闭流时向外发出事件。
   */
    // tslint:disable-next-line:no-output-rename
  @Output("closed") closedStream: EventEmitter<void> = new EventEmitter<void>();
  /**
   * Emits when the view has been changed. *
   * @zh 输出事件 `viewChanged`（类型：`EventEmitter<MatCalendarView>`），当触发视图已变更时向外发出事件。
   */
  @Output() viewChanged: EventEmitter<MatCalendarView> = new EventEmitter<MatCalendarView>();
  /**
   * Whether the calendar is open.
   * @zh 属性 `opened`（类型：`boolean`），用于存储或配置是否展开（默认值：`false`）。
   */
  opened = false;
  /**
   * The id for the datepicker calendar.
   * @zh 属性 `id`（类型：`string`），用于存储或配置唯一标识。
   */
  id = `mat-datetimepicker-${datetimepickerUid++}`;
  /**
   * The input element this datepicker is associated with.
   * @zh 属性 `_datepickerInput`（类型：`MatDatetimepickerInput<D>`），用于存储或配置日期选择器输入属性。
   */
  _datepickerInput: MatDatetimepickerInput<D>;
  /**
   * Emits when the datepicker is disabled.
   * @zh 属性 `_disabledChange`（类型：`Subject<boolean>`），用于存储或配置已禁用变更（默认值：`new Subject<boolean>()`）。
   */
  _disabledChange = new Subject<boolean>();
  /**
   * Property `_validSelected` (`D`) storing valid selected (default: `null`).
   * @zh 属性 `_validSelected`（类型：`D`），用于存储或配置有效已选中（默认值：`null`）。
   */
  private _validSelected: D | null = null;
  /**
   * A reference to the overlay when the calendar is opened as a popup.
   * @zh 属性 `_popupRef`（类型：`OverlayRef`），用于存储或配置弹窗引用。
   */
  private _popupRef: OverlayRef;
  /**
   * A reference to the dialog when the calendar is opened as a dialog.
   * @zh 属性 `_dialogRef`（类型：`any`），用于存储或配置对话框引用。
   */
  private _dialogRef;
  /**
   * A portal containing the calendar for this datepicker.
   * @zh 属性 `_calendarPortal`（类型：`ComponentPortal<MatDatetimepickerContent<D>>`），用于存储或配置日历传送门容器。
   */
  private _calendarPortal: ComponentPortal<MatDatetimepickerContent<D>>;
  /**
   * The element that was focused before the datepicker was opened.
   * @zh 属性 `_focusedElementBeforeOpen`（类型：`HTMLElement`），用于存储或配置已聚焦元素之前打开（默认值：`null`）。
   */
  private _focusedElementBeforeOpen: HTMLElement | null = null;
  /**
   * Property `_inputSubscription` (`Subscription`) storing input subscription (default: `Subscription.EMPTY`).
   * @zh 属性 `_inputSubscription`（类型：`Subscription`），用于存储或配置输入属性订阅对象（默认值：`Subscription.EMPTY`）。
   */
  private _inputSubscription = Subscription.EMPTY;

  /**
   * Creates an instance of `MatDatetimepicker` and initializes its dependencies and internal state.
   * @zh 创建 `MatDatetimepicker` 实例，并初始化其依赖项与内部状态。
   * @param _dialog - Injected or initial dialog (`MatDialog`) / 注入或传入的对话框（`MatDialog`）
   * @param _overlay - Injected or initial overlay (`Overlay`) / 注入或传入的浮层（`Overlay`）
   * @param _ngZone - Injected or initial ng zone (`NgZone`) / 注入或传入的Angular区域(NgZone)（`NgZone`）
   * @param _viewContainerRef - Injected or initial view container ref (`ViewContainerRef`) / 注入或传入的视图容器引用（`ViewContainerRef`）
   * @param _dateAdapter - Injected or initial date adapter (`DatetimeAdapter<D>`) / 注入或传入的日期适配器（`DatetimeAdapter<D>`）
   * @param _dir - Injected or initial dir (`Directionality`) / 注入或传入的目录（`Directionality`）
   * @param _document - Injected or initial document (`any`) / 注入或传入的文档对象（`any`）
   */
  constructor(private _dialog: MatDialog,
              private _overlay: Overlay,
              private _ngZone: NgZone,
              private _viewContainerRef: ViewContainerRef,
              // @Inject(MAT_DATEPICKER_SCROLL_STRATEGY) private _scrollStrategy,
              @Optional() private _dateAdapter: DatetimeAdapter<D>,
              @Optional() private _dir: Directionality,
              @Optional() @Inject(DOCUMENT) private _document) {
    if (!this._dateAdapter) {
      throw createMissingDateImplError("DateAdapter");
    }
  }

  /**
   * Property `_startAt` (`D`) storing start at.
   * @zh 属性 `_startAt`（类型：`D`），用于存储或配置开始位于。
   */
  private _startAt: D | null;

  /**
   * The date to open the calendar to initially.
   * @zh 输入属性 `startAt`（类型：`D`）的读取器，返回当前开始位于。
   */
  @Input()
  get startAt(): D | null {
    // If an explicit startAt is set we start there, otherwise we start at whatever the currently
    // selected value is.
    return this._startAt || (this._datepickerInput ? this._datepickerInput.value : null);
  }

  /**
   * Sets the start at (`startAt`).
   * @zh 设置开始位于（`startAt`）。
   * @param date - New start at value (`D`) / 新的开始位于值（`D`）
   */
  set startAt(date: D | null) {
    this._startAt = this._dateAdapter.getValidDateOrNull(date);
  }

  /**
   * Property `_openOnFocus` (`boolean`) storing open on focus.
   * @zh 属性 `_openOnFocus`（类型：`boolean`），用于存储或配置打开当聚焦。
   */
  private _openOnFocus: boolean;

  /**
   * Getter for input property `openOnFocus` (`boolean`) returning open on focus.
   * @zh 输入属性 `openOnFocus`（类型：`boolean`）的读取器，返回当前打开当聚焦。
   */
  @Input()
  get openOnFocus(): boolean {
    return this._openOnFocus;
  }

  /**
   * Sets the open on focus (`openOnFocus`).
   * @zh 设置打开当聚焦（`openOnFocus`）。
   * @param value - New open on focus value (`boolean`) / 新的打开当聚焦值（`boolean`）
   */
  set openOnFocus(value: boolean) {
    this._openOnFocus = coerceBooleanProperty(value);
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
  get type() {
    return this._type;
  }

  /**
   * Sets the type (`type`).
   * @zh 设置类型（`type`）。
   * @param value - New type value (`MatDatetimepickerType`) / 新的类型值（`MatDatetimepickerType`）
   */
  set type(value: MatDatetimepickerType) {
    this._type = value || "date";
  }

  /**
   * Property `_touchUi` (`boolean`) storing touch ui (default: `false`).
   * @zh 属性 `_touchUi`（类型：`boolean`），用于存储或配置触摸界面（默认值：`false`）。
   */
  private _touchUi = false;

  /**
   * Whether the calendar UI is in touch mode. In touch mode the calendar opens in a dialog rather
   * than a popup and elements have more padding to allow for bigger touch targets.

   * @zh 输入属性 `touchUi`（类型：`boolean`）的读取器，返回当前触摸界面。
   */
  @Input()
  get touchUi(): boolean {
    return this._touchUi;
  }

  /**
   * Sets the touch ui (`touchUi`).
   * @zh 设置触摸界面（`touchUi`）。
   * @param value - New touch ui value (`boolean`) / 新的触摸界面值（`boolean`）
   */
  set touchUi(value: boolean) {
    this._touchUi = coerceBooleanProperty(value);
  }

  /**
   * Property `_disabled` (`boolean`) storing disabled.
   * @zh 属性 `_disabled`（类型：`boolean`），用于存储或配置已禁用。
   */
  private _disabled: boolean;

  /**
   * Whether the datepicker pop-up should be disabled.
   * @zh 输入属性 `disabled`（类型：`boolean`）的读取器，返回当前已禁用。
   */
  @Input()
  get disabled(): boolean {
    return this._disabled === undefined && this._datepickerInput ?
      this._datepickerInput.disabled : !!this._disabled;
  }

  /**
   * Sets the disabled (`disabled`).
   * @zh 设置已禁用（`disabled`）。
   * @param value - New disabled value (`boolean`) / 新的已禁用值（`boolean`）
   */
  set disabled(value: boolean) {
    const newValue = coerceBooleanProperty(value);

    if (newValue !== this._disabled) {
      this._disabled = newValue;
      this._disabledChange.next(newValue);
    }
  }

  /**
   * The currently selected date.
   * @zh 获取当前已选中（`_selected: D | null`）。
   */
  get _selected(): D | null {
    return this._validSelected;
  }

  /**
   * Sets the selected (`_selected`).
   * @zh 设置已选中（`_selected`）。
   * @param value - New selected value (`D`) / 新的已选中值（`D`）
   */
  set _selected(value: D | null) {
    this._validSelected = value;
  }

  /**
   * The minimum selectable date.
   * @zh 获取当前最小值日期（`_minDate: D | null`）。
   */
  get _minDate(): D | null {
    return this._datepickerInput && this._datepickerInput.min;
  }

  /**
   * The maximum selectable date.
   * @zh 获取当前最大值日期（`_maxDate: D | null`）。
   */
  get _maxDate(): D | null {
    return this._datepickerInput && this._datepickerInput.max;
  }

  /**
   * Gets the current date filter (`_dateFilter: (date: D | null, type: MatDatetimepickerFilterType) => boolean`).
   * @zh 获取当前日期过滤（`_dateFilter: (date: D | null, type: MatDatetimepickerFilterType) => boolean`）。
   */
  get _dateFilter(): (date: D | null, type: MatDatetimepickerFilterType) => boolean {
    return this._datepickerInput && this._datepickerInput._dateFilter;
  }

  /**
   * Executes `_handleFocus` to handle handle focus.
   * @zh 执行 `_handleFocus`，用于连接手柄聚焦。
   */
  _handleFocus() {
    if (!this.opened && this.openOnFocus) {
      this.open();
    }
  }

  /**
   * Executes `_viewChanged` to handle view changed.
   * @zh 执行 `_viewChanged`，用于视图已变更。
   * @param type - type parameter (`MatCalendarView`) / 类型参数（`MatCalendarView`）
   */
  _viewChanged(type: MatCalendarView): void {
    this.viewChanged.emit(type);
  }

  /**
   * Angular lifecycle hook invoked just before the component, directive, or service is destroyed to release subscriptions and resources.
   * @zh Angular 生命周期钩子：在组件、指令或服务销毁前调用，用于释放订阅与清理资源。
   */
  ngOnDestroy() {
    this.close();
    this._inputSubscription.unsubscribe();
    this._disabledChange.complete();

    if (this._popupRef) {
      this._popupRef.dispose();
    }
  }

  /**
   * Selects the given date
   * @zh 执行 `_select`，用于下拉选择。
   */
  _select(date: D): void {
    const oldValue = this._selected;
    this._selected = date;
    if (!this._dateAdapter.sameDatetime(oldValue, this._selected)) {
      // tslint:disable-next-line deprecation
      this.selectedChanged.emit(date);
    }
  }

  /**
   * Register an input with this datepicker.
   * @param input The datepicker input to register with this datepicker.

   * @zh 执行 `_registerInput`，用于注册输入属性。
   */
  _registerInput(input): void {
    if (this._datepickerInput) {
      throw Error("A MatDatepicker can only be associated with a single input.");
    }
    this._datepickerInput = input;
    this._inputSubscription =
      this._datepickerInput._valueChange.subscribe((value: D | null) => this._selected = value);
  }

  /**
   * Open the calendar.
   * @zh 执行 `open`，用于打开。
   */
  open(): void {
    if (this.opened || this.disabled) {
      return;
    }
    if (!this._datepickerInput) {
      throw Error("Attempted to open an MatDatepicker with no associated input.");
    }
    if (this._document) {
      this._focusedElementBeforeOpen = this._document.activeElement;
    }

    this.touchUi ? this._openAsDialog() : this._openAsPopup();
    this.opened = true;
    this.openedStream.emit();
  }

  /**
   * Close the calendar.
   * @zh 执行 `close`，用于关闭。
   */
  close(): void {
    if (!this.opened) {
      return;
    }
    if (this._popupRef && this._popupRef.hasAttached()) {
      this._popupRef.detach();
    }
    if (this._dialogRef) {
      this._dialogRef.close();
      this._dialogRef = null;
    }
    if (this._calendarPortal && this._calendarPortal.isAttached) {
      this._calendarPortal.detach();
    }

    const completeClose = () => {
      // The `_opened` could've been reset already if
      // we got two events in quick succession.
      if (this.opened) {
        this.opened = false;
        this.closedStream.emit();
        this._focusedElementBeforeOpen = null;
      }
    };

    if (this._focusedElementBeforeOpen &&
      typeof this._focusedElementBeforeOpen.focus === "function") {
      // Because IE moves focus asynchronously, we can't count on it being restored before we've
      // marked the datepicker as closed. If the event fires out of sequence and the element that
      // we're refocusing opens the datepicker on focus, the user could be stuck with not being
      // able to close the calendar at all. We work around it by making the logic, that marks
      // the datepicker as closed, async as well.
      this._focusedElementBeforeOpen.focus();
      setTimeout(completeClose);
    } else {
      completeClose();
    }
  }

  /**
   * Open the calendar as a dialog.
   * @zh 执行 `_openAsDialog`，用于打开As对话框。
   */
  private _openAsDialog(): void {
    this._dialogRef = this._dialog.open(MatDatetimepickerContent, {
      direction: this._dir ? this._dir.value : "ltr",
      viewContainerRef: this._viewContainerRef,
      panelClass: "mat-datetimepicker-dialog"
    });
    this._dialogRef.afterClosed().subscribe(() => this.close());
    this._dialogRef.componentInstance.datetimepicker = this;
  }

  /**
   * Open the calendar as a popup.
   * @zh 执行 `_openAsPopup`，用于打开As弹窗。
   */
  private _openAsPopup(): void {
    if (!this._calendarPortal) {
      this._calendarPortal = new ComponentPortal<MatDatetimepickerContent<D>>(MatDatetimepickerContent, this._viewContainerRef);
    }

    if (!this._popupRef) {
      this._createPopup();
    }

    if (!this._popupRef.hasAttached()) {
      const componentRef: ComponentRef<MatDatetimepickerContent<D>> =
        this._popupRef.attach(this._calendarPortal);
      componentRef.instance.datetimepicker = this;

      // Update the position once the calendar has rendered.
      this._ngZone.onStable.asObservable().pipe(first()).subscribe(() => {
        this._popupRef.updatePosition();
      });
    }
  }

  /**
   * Create the popup.
   * @zh 执行 `_createPopup`，用于创建弹窗。
   */
  private _createPopup(): void {
    const overlayConfig = new OverlayConfig({
      positionStrategy: this._createPopupPositionStrategy(),
      hasBackdrop: true,
      backdropClass: "mat-overlay-transparent-backdrop",
      direction: this._dir ? this._dir.value : "ltr",
      scrollStrategy:new NoopScrollStrategy(),
      panelClass: "mat-datetimepicker-popup"
    });

    this._popupRef = this._overlay.create(overlayConfig);
    this._popupRef.backdropClick().subscribe(() => this.close());
  }

  /**
   * Create the popup PositionStrategy.
   * @zh 执行 `_createPopupPositionStrategy`，用于创建弹窗位置策略。
   */
  private _createPopupPositionStrategy(): PositionStrategy {
    return this._overlay.position()
      .flexibleConnectedTo(this._datepickerInput.getConnectedOverlayOrigin())
      .withTransformOriginOn(".mat-datetimepicker-content")
      .withFlexibleDimensions(false)
      .withViewportMargin(8)
      .withLockedPosition()
      .withPositions([
        {
          originX: "start",
          originY: "bottom",
          overlayX: "start",
          overlayY: "top"
        },
        {
          originX: "start",
          originY: "top",
          overlayX: "start",
          overlayY: "bottom"
        },
        {
          originX: "end",
          originY: "bottom",
          overlayX: "end",
          overlayY: "top"
        },
        {
          originX: "end",
          originY: "top",
          overlayX: "end",
          overlayY: "bottom"
        }
      ]);
  }
}
