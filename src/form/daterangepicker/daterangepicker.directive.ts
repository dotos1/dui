/**
 * @fileoverview Module `src/form/daterangepicker/daterangepicker.directive.ts` providing daterangepicker directive definitions and implementation.
 * @zh 模块文件 `src/form/daterangepicker/daterangepicker.directive.ts`，提供daterangepicker指令相关的定义与实现。
 */

import {
  Directive,
  ViewContainerRef,
  ElementRef,
  HostListener,
  forwardRef,
  ChangeDetectorRef,
  OnInit,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  Input,
  DoCheck,
  KeyValueDiffer,
  KeyValueDiffers,
  Output,
  EventEmitter,
  Renderer2,
  HostBinding,
  ComponentRef
} from '@angular/core';
import { Subscription } from 'rxjs';
import { ChosenDate, DateRange, DaterangepickerComponent, DateRanges, EndDate, StartDate, TimePeriod } from './daterangepicker.component';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import dayjs from 'dayjs/esm';
import { LocaleConfig } from './daterangepicker.config';
import { LocaleService } from './locale.service';

/**
 * Angular directive `DaterangepickerDirective` (selector: 'input[ngxDaterangepickerMd]') attaching daterangepicker directive behavior to host DOM elements.
 * @zh Angular 指令 `DaterangepickerDirective`（selector: 'input[ngxDaterangepickerMd]'），为宿主 DOM 元素附加Daterangepicker指令行为。
 */
@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'input[ngxDaterangepickerMd]',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DaterangepickerDirective),
      multi: true
    }
  ],
  standalone: false
})
// eslint-disable-next-line @angular-eslint/no-conflicting-lifecycle
export class DaterangepickerDirective implements OnInit, OnChanges, DoCheck, OnDestroy {
  // eslint-disable-next-line @angular-eslint/no-output-on-prefix,@angular-eslint/no-output-native,@angular-eslint/no-output-rename
  /**
   * Output event emitter `change` (`EventEmitter<TimePeriod | null>`) firing when on change occurs.
   * @zh 输出事件 `change`（类型：`EventEmitter<TimePeriod | null>`），当触发当变更时向外发出事件。
   */
  @Output('change') onChange: EventEmitter<TimePeriod | null> = new EventEmitter();
  // eslint-disable-next-line @angular-eslint/no-output-rename
  /**
   * Output event emitter `rangeClicked` (`EventEmitter<DateRange>`) firing when range clicked occurs.
   * @zh 输出事件 `rangeClicked`（类型：`EventEmitter<DateRange>`），当触发范围点击时向外发出事件。
   */
  @Output('rangeClicked') rangeClicked: EventEmitter<DateRange> = new EventEmitter();
  // eslint-disable-next-line @angular-eslint/no-output-rename
  /**
   * Output event emitter `datesUpdated` (`EventEmitter<TimePeriod>`) firing when dates updated occurs.
   * @zh 输出事件 `datesUpdated`（类型：`EventEmitter<TimePeriod>`），当触发日期已更新时向外发出事件。
   */
  @Output('datesUpdated') datesUpdated: EventEmitter<TimePeriod> = new EventEmitter();
  /**
   * Output event emitter `startDateChanged` (`EventEmitter<StartDate>`) firing when start date changed occurs.
   * @zh 输出事件 `startDateChanged`（类型：`EventEmitter<StartDate>`），当触发开始日期已变更时向外发出事件。
   */
  @Output() startDateChanged: EventEmitter<StartDate> = new EventEmitter();
  /**
   * Output event emitter `endDateChanged` (`EventEmitter<EndDate>`) firing when end date changed occurs.
   * @zh 输出事件 `endDateChanged`（类型：`EventEmitter<EndDate>`），当触发结束日期已变更时向外发出事件。
   */
  @Output() endDateChanged: EventEmitter<EndDate> = new EventEmitter();
  /**
   * Output event emitter `clearClicked` (`EventEmitter<void>`) firing when clear clicked occurs.
   * @zh 输出事件 `clearClicked`（类型：`EventEmitter<void>`），当触发清空点击时向外发出事件。
   */
  @Output() clearClicked: EventEmitter<void> = new EventEmitter();

  /**
   * Input property `minDate` (`dayjs.Dayjs`) configuring min date.
   * @zh 输入属性 `minDate`（类型：`dayjs.Dayjs`），用于配置最小值日期。
   */
  @Input()
  minDate: dayjs.Dayjs;

  /**
   * Input property `maxDate` (`dayjs.Dayjs`) configuring max date.
   * @zh 输入属性 `maxDate`（类型：`dayjs.Dayjs`），用于配置最大值日期。
   */
  @Input()
  maxDate: dayjs.Dayjs;

  /**
   * Input property `autoApply` (`boolean`) configuring auto apply.
   * @zh 输入属性 `autoApply`（类型：`boolean`），用于配置自动应用。
   */
  @Input()
  autoApply: boolean;

  /**
   * Input property `alwaysShowCalendars` (`boolean`) configuring always show calendars.
   * @zh 输入属性 `alwaysShowCalendars`（类型：`boolean`），用于配置always显示日历。
   */
  @Input()
  alwaysShowCalendars: boolean;

  /**
   * Input property `showCustomRangeLabel` (`boolean`) configuring show custom range label.
   * @zh 输入属性 `showCustomRangeLabel`（类型：`boolean`），用于配置显示自定义范围标签。
   */
  @Input()
  showCustomRangeLabel: boolean;

  /**
   * Input property `linkedCalendars` (`boolean`) configuring linked calendars.
   * @zh 输入属性 `linkedCalendars`（类型：`boolean`），用于配置已链接日历。
   */
  @Input()
  linkedCalendars: boolean;

  /**
   * Input property `dateLimit` (`number`) configuring date limit (default: `null`).
   * @zh 输入属性 `dateLimit`（类型：`number`），用于配置日期限制（默认值：`null`）。
   */
  @Input()
  dateLimit: number = null;

  /**
   * Input property `singleDatePicker` (`boolean`) configuring single date picker.
   * @zh 输入属性 `singleDatePicker`（类型：`boolean`），用于配置单个日期选择器。
   */
  @Input()
  singleDatePicker: boolean;

  /**
   * Input property `showWeekNumbers` (`boolean`) configuring show week numbers.
   * @zh 输入属性 `showWeekNumbers`（类型：`boolean`），用于配置显示周数字。
   */
  @Input()
  showWeekNumbers: boolean;

  /**
   * Input property `showISOWeekNumbers` (`boolean`) configuring show iso week numbers.
   * @zh 输入属性 `showISOWeekNumbers`（类型：`boolean`），用于配置显示ISO周数字。
   */
  @Input()
  showISOWeekNumbers: boolean;

  /**
   * Input property `showDropdowns` (`boolean`) configuring show dropdowns.
   * @zh 输入属性 `showDropdowns`（类型：`boolean`），用于配置显示下拉框。
   */
  @Input()
  showDropdowns: boolean;

  /**
   * Input property `isInvalidDate` (`(Dayjs: any) => boolean`) configuring is invalid date.
   * @zh 输入属性 `isInvalidDate`（类型：`(Dayjs: any) => boolean`），用于配置是否为无效日期。
   */
  @Input()
  isInvalidDate: (Dayjs) => boolean;

  /**
   * Input property `isCustomDate` (`(Dayjs: any) => string | boolean`) configuring is custom date.
   * @zh 输入属性 `isCustomDate`（类型：`(Dayjs: any) => string | boolean`），用于配置是否为自定义日期。
   */
  @Input()
  isCustomDate: (Dayjs) => string | boolean;

  /**
   * Input property `isTooltipDate` (`(Dayjs: any) => string | boolean | null`) configuring is tooltip date.
   * @zh 输入属性 `isTooltipDate`（类型：`(Dayjs: any) => string | boolean | null`），用于配置是否为悬浮提示日期。
   */
  @Input()
  isTooltipDate: (Dayjs) => string | boolean | null;

  /**
   * Input property `showClearButton` (`boolean`) configuring show clear button.
   * @zh 输入属性 `showClearButton`（类型：`boolean`），用于配置显示清空按钮。
   */
  @Input()
  showClearButton: boolean;

  /**
   * Input property `customRangeDirection` (`boolean`) configuring custom range direction.
   * @zh 输入属性 `customRangeDirection`（类型：`boolean`），用于配置自定义范围方向。
   */
  @Input()
  customRangeDirection: boolean;

  /**
   * Input property `ranges` (`DateRanges`) configuring ranges.
   * @zh 输入属性 `ranges`（类型：`DateRanges`），用于配置范围列表。
   */
  @Input()
  ranges: DateRanges;

  /**
   * Input property `opens` (`string`) configuring opens.
   * @zh 输入属性 `opens`（类型：`string`），用于配置打开。
   */
  @Input()
  opens: string;

  /**
   * Input property `drops` (`string`) configuring drops.
   * @zh 输入属性 `drops`（类型：`string`），用于配置放置。
   */
  @Input()
  drops: string;

  /**
   * Input property `firstMonthDayClass` (`string`) configuring first month day class.
   * @zh 输入属性 `firstMonthDayClass`（类型：`string`），用于配置首个月日类名。
   */
  @Input()
  firstMonthDayClass: string;

  /**
   * Input property `lastMonthDayClass` (`string`) configuring last month day class.
   * @zh 输入属性 `lastMonthDayClass`（类型：`string`），用于配置末尾月日类名。
   */
  @Input()
  lastMonthDayClass: string;

  /**
   * Input property `emptyWeekRowClass` (`string`) configuring empty week row class.
   * @zh 输入属性 `emptyWeekRowClass`（类型：`string`），用于配置空周行类名。
   */
  @Input()
  emptyWeekRowClass: string;

  /**
   * Input property `emptyWeekColumnClass` (`string`) configuring empty week column class.
   * @zh 输入属性 `emptyWeekColumnClass`（类型：`string`），用于配置空周列类名。
   */
  @Input()
  emptyWeekColumnClass: string;

  /**
   * Input property `firstDayOfNextMonthClass` (`string`) configuring first day of next month class.
   * @zh 输入属性 `firstDayOfNextMonthClass`（类型：`string`），用于配置首个日的下一个月类名。
   */
  @Input()
  firstDayOfNextMonthClass: string;

  /**
   * Input property `lastDayOfPreviousMonthClass` (`string`) configuring last day of previous month class.
   * @zh 输入属性 `lastDayOfPreviousMonthClass`（类型：`string`），用于配置末尾日的上一个月类名。
   */
  @Input()
  lastDayOfPreviousMonthClass: string;

  /**
   * Input property `keepCalendarOpeningWithRange` (`boolean`) configuring keep calendar opening with range.
   * @zh 输入属性 `keepCalendarOpeningWithRange`（类型：`boolean`），用于配置keep日历打开带有范围。
   */
  @Input()
  keepCalendarOpeningWithRange: boolean;

  /**
   * Input property `showRangeLabelOnInput` (`boolean`) configuring show range label on input.
   * @zh 输入属性 `showRangeLabelOnInput`（类型：`boolean`），用于配置显示范围标签当输入属性。
   */
  @Input()
  showRangeLabelOnInput: boolean;

  /**
   * Input property `showCancel` (`boolean`) configuring show cancel (default: `false`).
   * @zh 输入属性 `showCancel`（类型：`boolean`），用于配置显示取消（默认值：`false`）。
   */
  @Input()
  showCancel = false;

  /**
   * Input property `lockStartDate` (`boolean`) configuring lock start date (default: `false`).
   * @zh 输入属性 `lockStartDate`（类型：`boolean`），用于配置锁定开始日期（默认值：`false`）。
   */
  @Input()
  lockStartDate = false;

  // timepicker variables
  /**
   * Input property `timePicker` (`boolean`) configuring time picker (default: `false`).
   * @zh 输入属性 `timePicker`（类型：`boolean`），用于配置时间选择器（默认值：`false`）。
   */
  @Input()
  timePicker = false;

  /**
   * Input property `timePicker24Hour` (`boolean`) configuring time picker24 hour (default: `false`).
   * @zh 输入属性 `timePicker24Hour`（类型：`boolean`），用于配置时间Picker24小时（默认值：`false`）。
   */
  @Input()
  timePicker24Hour = false;

  /**
   * Input property `timePickerIncrement` (`number`) configuring time picker increment (default: `1`).
   * @zh 输入属性 `timePickerIncrement`（类型：`number`），用于配置时间选择器Increment（默认值：`1`）。
   */
  @Input()
  timePickerIncrement = 1;

  /**
   * Input property `timePickerSeconds` (`boolean`) configuring time picker seconds (default: `false`).
   * @zh 输入属性 `timePickerSeconds`（类型：`boolean`），用于配置时间选择器秒数（默认值：`false`）。
   */
  @Input()
  timePickerSeconds = false;

  /**
   * Input property `initialDates` (`[string | dayjs.Dayjs, string | dayjs.Dayjs]`) configuring initial dates.
   * @zh 输入属性 `initialDates`（类型：`[string | dayjs.Dayjs, string | dayjs.Dayjs]`），用于配置初始日期。
   */
  @Input()
  initialDates: [string | dayjs.Dayjs, string | dayjs.Dayjs];

  /**
   * Input property `closeOnAutoApply` (`boolean`) configuring close on auto apply (default: `true`).
   * @zh 输入属性 `closeOnAutoApply`（类型：`boolean`），用于配置关闭当自动应用（默认值：`true`）。
   */
  @Input() closeOnAutoApply = true;
  /**
   * Input property `endKeyHolder` (`string`) configuring end key holder.
   * @zh 输入属性 `endKeyHolder`（类型：`string`），用于配置结束键Holder。
   */
  @Input()
  private endKeyHolder: string;

  /**
   * Property `picker` (`DaterangepickerComponent`) storing picker.
   * @zh 属性 `picker`（类型：`DaterangepickerComponent`），用于存储或配置选择器。
   */
  public picker: DaterangepickerComponent;
  /**
   * Property `startKeyHolder` (`string`) storing start key holder.
   * @zh 属性 `startKeyHolder`（类型：`string`），用于存储或配置开始键Holder。
   */
  private startKeyHolder: string;
  /**
   * Property `notForChangesProperty` (`string[]`) storing not for changes property.
   * @zh 属性 `notForChangesProperty`（类型：`string[]`），用于存储或配置not用于变更集合属性。
   */
  private notForChangesProperty: Array<string> = ['locale', 'endKey', 'startKey', 'initialDates'];
  /**
   * Property `onChangeFn` (`Function`) storing on change fn (default: `Function.prototype`).
   * @zh 属性 `onChangeFn`（类型：`Function`），用于存储或配置当变更函数（默认值：`Function.prototype`）。
   */
  private onChangeFn = Function.prototype;
  /**
   * Property `onTouched` (`Function`) storing on touched (default: `Function.prototype`).
   * @zh 属性 `onTouched`（类型：`Function`），用于存储或配置当是否已触碰（默认值：`Function.prototype`）。
   */
  private onTouched = Function.prototype;
  /**
   * Property `validatorChange` (`Function`) storing validator change (default: `Function.prototype`).
   * @zh 属性 `validatorChange`（类型：`Function`），用于存储或配置校验器变更（默认值：`Function.prototype`）。
   */
  private validatorChange = Function.prototype;
  /**
   * Property `disabledHolder` (`boolean`) storing disabled holder.
   * @zh 属性 `disabledHolder`（类型：`boolean`），用于存储或配置已禁用Holder。
   */
  private disabledHolder: boolean;
  /**
   * Property `valueHolder` (`TimePeriod`) storing value holder.
   * @zh 属性 `valueHolder`（类型：`TimePeriod`），用于存储或配置值Holder。
   */
  private valueHolder: TimePeriod | null;
  /**
   * Property `localeDiffer` (`any`) storing locale differ.
   * @zh 属性 `localeDiffer`（类型：`any`），用于存储或配置语言区域Differ。
   */
  private localeDiffer;
  /**
   * Property `localeHolder` (`LocaleConfig`) storing locale holder (default: `{}`).
   * @zh 属性 `localeHolder`（类型：`LocaleConfig`），用于存储或配置语言区域Holder（默认值：`{}`）。
   */
  private localeHolder: LocaleConfig = {};
  /**
   * Property `componentRef` (`ComponentRef<DaterangepickerComponent>`) storing component ref.
   * @zh 属性 `componentRef`（类型：`ComponentRef<DaterangepickerComponent>`），用于存储或配置组件引用。
   */
  private componentRef: ComponentRef<DaterangepickerComponent>;
  /**
   * Property `subscriptions` (`Subscription`) storing subscriptions (default: `new Subscription()`).
   * @zh 属性 `subscriptions`（类型：`Subscription`），用于存储或配置订阅集合（默认值：`new Subscription()`）。
   */
  private readonly subscriptions = new Subscription();

  /**
   * Creates an instance of `DaterangepickerDirective` and initializes its dependencies and internal state.
   * @zh 创建 `DaterangepickerDirective` 实例，并初始化其依赖项与内部状态。
   * @param viewContainerRef - Injected or initial view container ref (`ViewContainerRef`) / 注入或传入的视图容器引用（`ViewContainerRef`）
   * @param ref - Injected or initial ref (`ChangeDetectorRef`) / 注入或传入的引用（`ChangeDetectorRef`）
   * @param el - Injected or initial el (`ElementRef<any>`) / 注入或传入的DOM元素（`ElementRef<any>`）
   * @param renderer - Injected or initial renderer (`Renderer2`) / 注入或传入的渲染器（`Renderer2`）
   * @param differs - Injected or initial differs (`KeyValueDiffers`) / 注入或传入的differs（`KeyValueDiffers`）
   * @param localeHolderService - Injected or initial locale holder service (`LocaleService`) / 注入或传入的语言区域Holder服务（`LocaleService`）
   * @param elementRef - Injected or initial element ref (`ElementRef<any>`) / 注入或传入的元素引用（`ElementRef<any>`）
   */
  constructor(
    public viewContainerRef: ViewContainerRef,
    public ref: ChangeDetectorRef,
    private el: ElementRef,
    private renderer: Renderer2,
    private differs: KeyValueDiffers,
    private localeHolderService: LocaleService,
    private elementRef: ElementRef
  ) {
    this.endKey = 'endDate';
    this.startKey = 'startDate';
    this.drops = 'down';
    this.opens = 'auto';
    // picker 必须在构造期就绪：ngOnChanges 早于 ngOnInit 触发，且会直接写 this.picker[...]，
    // 因此不能把创建动作推迟到 ngOnInit。
    viewContainerRef.clear();
    this.componentRef = viewContainerRef.createComponent(DaterangepickerComponent);
    this.picker = this.componentRef.instance as DaterangepickerComponent;
    this.picker.inline = false; // set inline to false for all directive usage
  }

  /**
   * Host-bound getter `disabled` (`boolean`) computing disabled.
   * @zh 宿主绑定读取器 `disabled`（绑定至 `disabled`），计算并返回已禁用。
   */
  @HostBinding('disabled') get disabled(): boolean {
    return this.disabledHolder;
  }

  /**
   * Input setter `startKey` updating start key.
   * @zh 输入属性 `startKey` 的设置器，用于更新开始键。
   * @param value - New start key value (`string`) / 新的开始键值（`string`）
   */
  @Input() set startKey(value: string) {
    if (value !== null) {
      this.startKeyHolder = value;
    } else {
      this.startKeyHolder = 'startDate';
    }
  }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  /**
   * Gets the current locale (`locale: LocaleConfig`).
   * @zh 获取当前语言区域（`locale: LocaleConfig`）。
   */
  get locale(): LocaleConfig {
    return this.localeHolder;
  }

  /**
   * Input setter `locale` updating locale.
   * @zh 输入属性 `locale` 的设置器，用于更新语言区域。
   * @param value - New locale value (`LocaleConfig`) / 新的语言区域值（`LocaleConfig`）
   */
  @Input() set locale(value: LocaleConfig) {
    this.localeHolder = { ...this.localeHolderService.config, ...value };
  }

  /**
   * Input setter `endKey` updating end key.
   * @zh 输入属性 `endKey` 的设置器，用于更新结束键。
   * @param value - New end key value (`string`) / 新的结束键值（`string`）
   */
  @Input() set endKey(value: string) {
    if (value !== null) {
      this.endKeyHolder = value;
    } else {
      this.endKeyHolder = 'endDate';
    }
  }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  /**
   * Gets the current value (`value: TimePeriod | null`).
   * @zh 获取当前值（`value: TimePeriod | null`）。
   */
  get value(): TimePeriod | null {
    return this.valueHolder || null;
  }

  /**
   * Sets the value (`value`).
   * @zh 设置值（`value`）。
   * @param val - New value value (`TimePeriod`) / 新的值值（`TimePeriod`）
   */
  set value(val: TimePeriod | null) {
    this.valueHolder = val;
    this.onChangeFn(val);
    this.ref.markForCheck();
  }

  /**
   * For click outside the calendar's container
   *
   * @param event event object

   * @zh 宿主事件监听方法 `outsideClick`，响应 `document:click` 事件以处理外部点击。
   */
  @HostListener('document:click', ['$event'])
  outsideClick(event: Event): void {
    if (!event.target) {
      return;
    }

    if ((event.target as HTMLElement).classList.contains('ngx-daterangepicker-action')) {
      return;
    }

    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.hide();
    }
  }

  /**
   * Host event listener `hide` handling `keyup.esc` events for hide.
   * @zh 宿主事件监听方法 `hide`，响应 `keyup.esc` 事件以处理隐藏。
   * @param e - e parameter (`Event`) / e参数（`Event`）
   */
  @HostListener('keyup.esc', ['$event'])
  hide(e?: Event): void {
    this.picker.hide(e);
  }

  /**
   * Host event listener `onBlur` handling `blur` events for on blur.
   * @zh 宿主事件监听方法 `onBlur`，响应 `blur` 事件以处理当失焦。
   */
  @HostListener('blur')
  onBlur(): void {
    this.onTouched();
  }

  /**
   * Host event listener `inputChanged` handling `keyup` events for input changed.
   * @zh 宿主事件监听方法 `inputChanged`，响应 `keyup` 事件以处理输入属性已变更。
   * @param e - e parameter (`KeyboardEvent`) / e参数（`KeyboardEvent`）
   */
  @HostListener('keyup', ['$event'])
  inputChanged(e: KeyboardEvent): void {
    if ((e.target as HTMLElement).tagName.toLowerCase() !== 'input') {
      return;
    }
    if (!(e.target as HTMLInputElement).value.length) {
      return;
    }
    const dateString = (e.target as HTMLInputElement).value.split(this.picker.locale.separator);
    let start = null;
    let end = null;
    if (dateString.length === 2) {
      start = dayjs(dateString[0], this.picker.locale.format);
      end = dayjs(dateString[1], this.picker.locale.format);
    }
    if (this.singleDatePicker || start === null || end === null) {
      start = dayjs((e.target as HTMLInputElement).value, this.picker.locale.format);
      end = start;
    }
    if (!start.isValid() || !end.isValid()) {
      return;
    }
    this.picker.setStartDate(start);
    this.picker.setEndDate(end);
    this.picker.updateView();
  }

  /**
   * Host event listener `open` handling `click` events for open.
   * @zh 宿主事件监听方法 `open`，响应 `click` 事件以处理打开。
   * @param event - event parameter (`Event`) / 事件参数（`Event`）
   */
  @HostListener('click', ['$event'])
  open(event?: Event): void {
    if (this.disabled) {
      return;
    }
    this.picker.show(event);
    setTimeout(() => {
      this.setPosition();
    });
  }

  // eslint-disable-next-line @angular-eslint/no-conflicting-lifecycle
  /**
   * Angular lifecycle hook invoked once after component or directive inputs are initialized.
   * @zh Angular 生命周期钩子：在组件或指令的输入属性初始化完成后调用一次。
   */
  ngOnInit(): void {
    if (this.initialDates) {
      this.picker.initialDates = this.initialDates;
    }
    this.subscriptions.add(this.picker.startDateChanged.subscribe((itemChanged: StartDate) => {
      this.startDateChanged.emit(itemChanged);
    }));
    this.subscriptions.add(this.picker.endDateChanged.subscribe((itemChanged: EndDate) => {
      this.endDateChanged.emit(itemChanged);
    }));
    this.subscriptions.add(this.picker.rangeClicked.subscribe((range: DateRange) => {
      this.rangeClicked.emit(range);
    }));
    this.subscriptions.add(this.picker.datesUpdated.subscribe((range: TimePeriod) => {
      this.datesUpdated.emit(range);
    }));
    this.subscriptions.add(this.picker.clearClicked.subscribe(() => {
      this.clearClicked.emit();
    }));
    this.subscriptions.add(this.picker.choosedDate.subscribe((change: ChosenDate) => {
      if (change) {
        const value = {
          [this.startKeyHolder]: change.startDate,
          [this.endKeyHolder]: change.endDate
        };
        this.value = value as TimePeriod;
        this.onChange.emit(value as TimePeriod);
        if (typeof change.chosenLabel === 'string') {
          this.el.nativeElement.value = change.chosenLabel;
        }
      }
    }));
    this.picker.firstMonthDayClass = this.firstMonthDayClass;
    this.picker.lastMonthDayClass = this.lastMonthDayClass;
    this.picker.emptyWeekRowClass = this.emptyWeekRowClass;
    this.picker.emptyWeekColumnClass = this.emptyWeekColumnClass;
    this.picker.firstDayOfNextMonthClass = this.firstDayOfNextMonthClass;
    this.picker.lastDayOfPreviousMonthClass = this.lastDayOfPreviousMonthClass;
    this.picker.drops = this.drops;
    this.picker.opens = this.opens;
    this.localeDiffer = this.differs.find(this.locale).create();
    this.picker.closeOnAutoApply = this.closeOnAutoApply;
  }

  /**
   * Angular lifecycle hook invoked just before the component, directive, or service is destroyed to release subscriptions and resources.
   * @zh Angular 生命周期钩子：在组件、指令或服务销毁前调用，用于释放订阅与清理资源。
   */
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    this.componentRef?.destroy();
  }

  // eslint-disable-next-line @angular-eslint/no-conflicting-lifecycle
  /**
   * Angular lifecycle hook invoked when data-bound input properties change.
   * @zh Angular 生命周期钩子：当数据绑定的输入属性发生变更时调用。
   * @param changes - changes parameter (`SimpleChanges`) / 变更集合参数（`SimpleChanges`）
   */
  ngOnChanges(changes: SimpleChanges): void {
    for (const change in changes) {
      if (Object.prototype.hasOwnProperty.call(changes, change)) {
        if (this.notForChangesProperty.indexOf(change) === -1) {
          this.picker[change] = changes[change].currentValue;
        }
      }
    }
  }

  // eslint-disable-next-line @angular-eslint/no-conflicting-lifecycle
  /**
   * Angular lifecycle hook invoked during every change-detection run for custom change detection.
   * @zh Angular 生命周期钩子：在每次变更检测周期中调用，用于执行自定义变更检测。
   */
  ngDoCheck(): void {
    if (this.localeDiffer) {
      const changes = this.localeDiffer.diff(this.locale);
      if (changes) {
        this.picker.updateLocale(this.locale);
      }
    }
  }

  /**
   * Executes `toggle` to handle toggle.
   * @zh 执行 `toggle`，用于开关。
   * @param e - e parameter (`Event`) / e参数（`Event`）
   */
  toggle(e?: Event): void {
    if (this.picker.isShown) {
      this.hide(e);
    } else {
      this.open(e);
    }
  }

  /**
   * Executes `clear` to handle clear.
   * @zh 执行 `clear`，用于清空。
   */
  clear(): void {
    this.picker.clear();
  }

  /**
   * Writes a new value from the Angular form model into the view (`ControlValueAccessor`).
   * @zh 将 Angular 表单模型中的新值写入视图（`ControlValueAccessor` 接口实现）。
   * @param value - value parameter (`TimePeriod`) / 值参数（`TimePeriod`）
   */
  writeValue(value: TimePeriod): void {
    this.setValue(value);
  }

  /**
   * Registers a callback function invoked when the control value changes in the UI (`ControlValueAccessor`).
   * @zh 注册当界面控件值发生变化时触发的回调函数（`ControlValueAccessor` 接口实现）。
   * @param fn - fn parameter (`() => TimePeriod | null`) / 函数参数（`() => TimePeriod | null`）
   */
  registerOnChange(fn: () => TimePeriod | null): void {
    this.onChangeFn = fn;
  }

  /**
   * Registers a callback function invoked when the control receives a blur/touched event (`ControlValueAccessor`).
   * @zh 注册当控件失焦或被触碰时触发的回调函数（`ControlValueAccessor` 接口实现）。
   * @param fn - fn parameter (`() => void`) / 函数参数（`() => void`）
   */
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  /**
   * Enables or disables the UI control when the form control disabled status changes (`ControlValueAccessor`).
   * @zh 当表单控件的禁用状态变更时启用或禁用界面控件（`ControlValueAccessor` 接口实现）。
   * @param state - state parameter (`boolean`) / 状态参数（`boolean`）
   */
  setDisabledState(state: boolean): void {
    this.disabledHolder = state;
  }

  /**
   * Set position of the calendar

   * @zh 执行 `setPosition`，用于集合位置。
   */
  setPosition(): void {
    let style;
    let containerTop;
    const container = this.picker.pickerContainer.nativeElement;
    const element = this.el.nativeElement;
    if (this.drops && this.drops === 'up') {
      containerTop = element.offsetTop - container.clientHeight + 'px';
    } else {
      containerTop = 'auto';
    }
    if (this.opens === 'left') {
      style = {
        top: containerTop,
        left: element.offsetLeft - container.clientWidth + element.clientWidth + 'px',
        right: 'auto'
      };
    } else if (this.opens === 'center') {
      style = {
        top: containerTop,
        left: element.offsetLeft + element.clientWidth / 2 - container.clientWidth / 2 + 'px',
        right: 'auto'
      };
    } else if (this.opens === 'right') {
      style = {
        top: containerTop,
        left: element.offsetLeft + 'px',
        right: 'auto'
      };
    } else {
      const position = element.offsetLeft + element.clientWidth / 2 - container.clientWidth / 2;
      if (position < 0) {
        style = {
          top: containerTop,
          left: element.offsetLeft + 'px',
          right: 'auto'
        };
      } else {
        style = {
          top: containerTop,
          left: position + 'px',
          right: 'auto'
        };
      }
    }
    if (style) {
      this.renderer.setStyle(container, 'top', style.top);
      this.renderer.setStyle(container, 'left', style.left);
      this.renderer.setStyle(container, 'right', style.right);
    }
  }

  /**
   * Executes `setValue` to handle set value.
   * @zh 执行 `setValue`，用于集合值。
   * @param val - val parameter (`TimePeriod`) / 值参数（`TimePeriod`）
   */
  private setValue(val: TimePeriod) {
    if (val) {
      this.value = val;
      if (val[this.startKeyHolder]) {
        this.picker.setStartDate(val[this.startKeyHolder]);
      }
      if (val[this.endKeyHolder]) {
        this.picker.setEndDate(val[this.endKeyHolder]);
      }
      this.picker.calculateChosenLabel();
      if (this.picker.chosenLabel) {
        this.el.nativeElement.value = this.picker.chosenLabel;
      }
    } else {
      this.picker.clear();
    }
  }
}
