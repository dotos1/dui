/**
 * @fileoverview Module `src/form/date/datefield.component.ts` providing datefield component definitions and implementation.
 * @zh 模块文件 `src/form/date/datefield.component.ts`，提供datefield组件相关的定义与实现。
 */

import {
  Component, ViewChild, ChangeDetectionStrategy, ViewEncapsulation, Input, SimpleChanges,
  ChangeDetectorRef, AfterContentInit, OnChanges, OnDestroy,  EventEmitter,
  forwardRef, Inject, Optional, Output
} from '@angular/core';
import { merge, of as observableOf, Subscription } from "rxjs";
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from "@angular/material-moment-adapter";
import { MatDatepickerIntl } from "@angular/material/datepicker";
import {  coerceBooleanProperty  } from '@angular/cdk/coercion';
import { DOWN_ARROW } from "@angular/cdk/keycodes";
import {
  AbstractControl, ControlValueAccessor, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors,
  Validator, ValidatorFn, Validators
} from "@angular/forms";
import {  MAT_INPUT_VALUE_ACCESSOR } from "@angular/material/input";

import { Dui } from '@dotos/dui/core';
import { TranslateService } from '@dotos/dui/translator';
import { DatetimeAdapter, MAT_DATETIME_FORMATS, MatDatetimeFormats } from "@dotos/dui/form/date/adapter";
import { MomentDatetimeAdapter } from '@dotos/dui/form/date/moment';

import { MatDatetimepickerFilterType } from "@dotos/dui/form/date/picker";
import { MatDatetimepicker,createMissingDateImplError } from "@dotos/dui/form/date/picker";
import { MatField } from '@dotos/dui/form';

/**
 * Constant/variable `MAT_DATETIMEPICKER_VALUE_ACCESSOR` defining mat datetimepicker value accessor in `src/form/date`.
 * @zh 常量/变量 `MAT_DATETIMEPICKER_VALUE_ACCESSOR`，定义 `src/form/date` 中的Material日期时间选择器值访问器。
 */
export const MAT_DATETIMEPICKER_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => DateFieldComponent),
  multi: true
};

/**
 * Constant/variable `MAT_DATETIMEPICKER_VALIDATORS` defining mat datetimepicker validators in `src/form/date`.
 * @zh 常量/变量 `MAT_DATETIMEPICKER_VALIDATORS`，定义 `src/form/date` 中的Material日期时间选择器校验器列表。
 */
export const MAT_DATETIMEPICKER_VALIDATORS = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => DateFieldComponent),
  multi: true
};


/**
 * Class `MatDatetimepickerInputEvent` encapsulating mat datetimepicker input event data structures and logic in `src/form/date`.
 * @zh 类 `MatDatetimepickerInputEvent`，封装 `src/form/date` 中的Material日期时间选择器输入属性事件数据结构与处理逻辑。
 */
export class MatDatetimepickerInputEvent<D> {
  /**
   * The new value for the target datepicker input.
   * @zh 属性 `value`（类型：`D | null`），用于存储或配置值。
   */
  value: D | null;
  /**
   * Creates an instance of `MatDatetimepickerInputEvent` and initializes its dependencies and internal state.
   * @zh 创建 `MatDatetimepickerInputEvent` 实例，并初始化其依赖项与内部状态。
   * @param target - Injected or initial target (`DateFieldComponent<D>`) / 注入或传入的目标（`DateFieldComponent<D>`）
   */
  constructor(public target: DateFieldComponent<D>) {
    this.value = this.target.value;
  }
}
/**
 * Angular component `DateFieldComponent` (selector: 'date-field') providing date field component presentation and interaction in `src/form/date`.
 * @zh Angular 组件 `DateFieldComponent`（selector: 'date-field'），提供日期字段组件的视图渲染与交互逻辑（位于 `src/form/date`）。
 */
@Component({
  selector: 'date-field',
  templateUrl: './datefield.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  preserveWhitespaces: false,
  providers: [
    MAT_DATETIMEPICKER_VALUE_ACCESSOR,
    MAT_DATETIMEPICKER_VALIDATORS,
    { provide: MAT_INPUT_VALUE_ACCESSOR, useExisting: DateFieldComponent },
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter
    },
    {
      provide: DatetimeAdapter,
      useClass: MomentDatetimeAdapter
    },
    {
      provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS,
      useValue: {
        useUtc: true
      }
    },
    {
      provide: MAT_DATETIME_FORMATS,
      useValue: {
        parse: {
          dateInput: "YYYY-MM-DD",
          monthInput: "YYYY MMMM",
          timeInput: "LT",
          datetimeInput: "L LT"
        },
        display: {
          dateInput: "YYYY/MM/DD",
          monthInput: "YYYY MMMM",
          datetimeInput: "YYYY/MM/DD LT",
          timeInput: "LT",
          monthYearLabel: "MMM YYYY",
          dateA11yLabel: "LL",
          monthYearA11yLabel: "MMMM YYYY",
          popupHeaderDateLabel: "ddd, DD MMM"
        }
      }
    },
    { provide: MAT_DATE_LOCALE, useValue: 'zh-CN' }
  ],
  host: {
    "[attr.aria-haspopup]": "true",
    "[attr.aria-owns]": "(datetimepicker?.opened && datetimepicker.id) || null",
    "[attr.min]": "min ? _dateAdapter.toIso8601(min) : null",
    "[attr.max]": "max ? _dateAdapter.toIso8601(max) : null",
    "(focus)": "datetimepicker._handleFocus()",
    "(input)": "_onInput($event.target.value)",
    "(change)": "_onChange()",
    "(blur)": "_onBlur()",
    "(keydown)": "_onKeydown($event)",
    hostID: "date-field" + Math.random().toString(36).substring(2, 15),
  },
})

export class DateFieldComponent<D> extends MatField implements AfterContentInit, OnChanges, ControlValueAccessor, OnDestroy, Validator {

  /**
   * Template/content query reference `datetimepicker` (`@ViewChild`) targeting datetimepicker.
   * @zh 模板/内容视图查询引用 `datetimepicker`（`@ViewChild`），指向日期时间选择器。
   */
  @ViewChild(MatDatetimepicker, { static: false }) datetimepicker: MatDatetimepicker<D>;


  /**
   * Input setter `matDatepickerFilter` updating mat datepicker filter.
   * @zh 输入属性 `matDatepickerFilter` 的设置器，用于更新Material日期选择器过滤。
   * @param filter - New mat datepicker filter value (`(date: D | null, type: MatDatetimepickerFilterType) => boole...`) / 新的Material日期选择器过滤值（`(date: D | null, type: MatDatetimepickerFilterType) => boole...`）
   */
  @Input() set matDatepickerFilter(filter: (date: D | null, type: MatDatetimepickerFilterType) => boolean) {
    this._dateFilter = filter;
    this._validatorOnChange();
  }
  /**
   * Property `_dateFilter` (`(date: D | null, type: MatDatetimepickerFilterType) => boolean`) storing date filter.
   * @zh 属性 `_dateFilter`（类型：`(date: D | null, type: MatDatetimepickerFilterType) => boolean`），用于存储或配置日期过滤。
   */
  _dateFilter: (date: D | null, type: MatDatetimepickerFilterType) => boolean;


  /**
   * The minimum valid date.
   * @zh 输入属性 `min`（类型：`D | null`）的读取器，返回当前最小值。
   */
  @Input()
  get min(): D | null {
    return this._min;
  }
  /**
   * Sets the min (`min`).
   * @zh 设置最小值（`min`）。
   * @param value - New min value (`D | null`) / 新的最小值值（`D | null`）
   */
  set min(value: D | null) {
    this._min = this._dateAdapter.getValidDateOrNull(this._dateAdapter.deserialize(value));
    this._validatorOnChange();
  }
  /**
   * Property `_min` (`D | null`) storing min.
   * @zh 属性 `_min`（类型：`D | null`），用于存储或配置最小值。
   */
  private _min: D | null;

  /**
   * Getter for input property `max` (`D | null`) returning max.
   * @zh 输入属性 `max`（类型：`D | null`）的读取器，返回当前最大值。
   */
  @Input()
  get max(): D | null {
    return this._max;
  }
  /**
   * Sets the max (`max`).
   * @zh 设置最大值（`max`）。
   * @param value - New max value (`D | null`) / 新的最大值值（`D | null`）
   */
  set max(value: D | null) {
    this._max = this._dateAdapter.getValidDateOrNull(this._dateAdapter.deserialize(value));
    this._validatorOnChange();
  }
  /**
   * Property `_max` (`D | null`) storing max.
   * @zh 属性 `_max`（类型：`D | null`），用于存储或配置最大值。
   */
  private _max: D | null;

  /**
   * Getter for input property `disabled` (`boolean`) returning disabled.
   * @zh 输入属性 `disabled`（类型：`boolean`）的读取器，返回当前已禁用。
   */
  @Input()
  override get disabled(): boolean {
    return this._disabled === undefined ? this.datetimepicker.disabled : !!this._disabled;
  }
  /**
   * Sets the disabled (`disabled`).
   * @zh 设置已禁用（`disabled`）。
   * @param value - New disabled value (`boolean`) / 新的已禁用值（`boolean`）
   */
  override set disabled(value: boolean) {
    const newValue =  coerceBooleanProperty (value);
    if (this._disabled !== newValue) {
      this._disabled = newValue;
      this._disabledChange.emit(newValue);
    }
  }
  /**
   * Property `_disabled` (`boolean`) storing disabled.
   * @zh 属性 `_disabled`（类型：`boolean`），用于存储或配置已禁用。
   */
  private _disabled: boolean;

  /**
   * Emits when a `change` event is fired on this `<input>`.
   * @zh 输出事件 `dateChange`（类型：`EventEmitter`），当触发日期变更时向外发出事件。
   */
  @Output() dateChange = new EventEmitter<MatDatetimepickerInputEvent<D>>();

  /**
   * Emits when an `input` event is fired on this `<input>`.
   * @zh 输出事件 `dateInput`（类型：`EventEmitter`），当触发日期输入属性时向外发出事件。
   */
  @Output() dateInput = new EventEmitter<MatDatetimepickerInputEvent<D>>();

  /**
   * Property `_stateChanges` (`any`) storing state changes (default: `Subscription.EMPTY`).
   * @zh 属性 `_stateChanges`（类型：`any`），用于存储或配置状态变更集合（默认值：`Subscription.EMPTY`）。
   */
  private _stateChanges = Subscription.EMPTY;

  /**
   * Property `type` (`string`) storing type (default: `'date'`).
   * @zh 属性 `type`（类型：`string`），用于存储或配置类型（默认值：`'date'`）。
   */
  type: string = 'date';


  /**
   * Emits when the value changes (either due to user input or programmatic change).
   * @zh 属性 `_valueChange`（类型：`EventEmitter`），用于存储或配置值变更（默认值：`new EventEmitter<D | null>()`）。
   */
  _valueChange = new EventEmitter<D | null>();

  /**
   * Emits when the disabled state has changed
   * @zh 属性 `_disabledChange`（类型：`EventEmitter`），用于存储或配置已禁用变更（默认值：`new EventEmitter<boolean>()`）。
   */
  _disabledChange = new EventEmitter<boolean>();

  /**
   * Property `_datepickerSubscription` (`any`) storing datepicker subscription (default: `Subscription.EMPTY`).
   * @zh 属性 `_datepickerSubscription`（类型：`any`），用于存储或配置日期选择器订阅对象（默认值：`Subscription.EMPTY`）。
   */
  private _datepickerSubscription = Subscription.EMPTY;

  /**
   * Property `_localeSubscription` (`any`) storing locale subscription (default: `Subscription.EMPTY`).
   * @zh 属性 `_localeSubscription`（类型：`any`），用于存储或配置语言区域订阅对象（默认值：`Subscription.EMPTY`）。
   */
  private _localeSubscription = Subscription.EMPTY;

  /**
   * Gets the current value (`value: any`).
   * @zh 获取当前值（`value: any`）。
   */
  override get value() {
    return this.formControl.value;
  }
  /**
   * Sets the value (`value`).
   * @zh 设置值（`value`）。
   * @param value - New value value (`any`) / 新的值值（`any`）
   */
  override set value(value) {
    if(value==null) value=undefined;
    value = this._dateAdapter.deserialize(value);
    this._lastValueValid = !value || this._dateAdapter.isValid(value);
    value = this._dateAdapter.getValidDateOrNull(value);
    const oldDate = this._dateAdapter.deserialize(this.value);
    this.formControl.patchValue(value);
    setTimeout(() => {
      if (!this._dateAdapter.sameDatetime(oldDate, value)) {
        this._valueChange.emit(value);
      }
    });
  }

  /**
   * Creates an instance of `DateFieldComponent` and initializes its dependencies and internal state.
   * @zh 创建 `DateFieldComponent` 实例，并初始化其依赖项与内部状态。
   * @param _dateAdapter - Injected or initial date adapter (`DatetimeAdapter<D>`) / 注入或传入的日期适配器（`DatetimeAdapter<D>`）
   * @param _dateFormats - Injected or initial date formats (`MatDatetimeFormats`) / 注入或传入的日期格式列表（`MatDatetimeFormats`）
   * @param _intl - Injected or initial intl (`MatDatepickerIntl`) / 注入或传入的intl（`MatDatepickerIntl`）
   * @param translate - Injected or initial translate (`TranslateService`) / 注入或传入的翻译（`TranslateService`）
   * @param _changeDetectorRef - Injected or initial change detector ref (`ChangeDetectorRef`) / 注入或传入的变更检测器引用（`ChangeDetectorRef`）
   */
  constructor(
    @Optional() public _dateAdapter: DatetimeAdapter<D>,
    @Optional() @Inject(MAT_DATETIME_FORMATS) private _dateFormats: MatDatetimeFormats,
    public _intl: MatDatepickerIntl,
    protected override translate: TranslateService,
    private _changeDetectorRef: ChangeDetectorRef) {
    super(translate);
    if (!this._dateAdapter) {
      throw createMissingDateImplError("DatetimeAdapter");
    }
    if (!this._dateFormats) {
      throw createMissingDateImplError("MAT_DATETIME_FORMATS");
    }
    this._localeSubscription = _dateAdapter.localeChanges.subscribe(() => {
      // eslint-disable-next-line no-self-assign
      this.value = this.value;
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  /**
   * Executes `init` to handle init.
   * @zh 执行 `init`，用于初始化。
   * @param field - field parameter (`any`) / 字段参数（`any`）
   */
  override init(field?): void {
    super.init();
    if (this.field.min != undefined) {
      let minErrorText= this.field.minText?this.translate.instant(this.field.minText):this.translate.instant("FORM.MINDATETEXT");
      this.field.validation.messages['matDatepickerMin'] = Dui.format(minErrorText, this.field.min);
    }
    if (this.field.max != undefined) {
      let maxErrorText= this.field.maxText?this.translate.instant(this.field.maxText):this.translate.instant("FORM.MAXDATETEXT");
      this.field.validation.messages['matDatepickerMax'] = Dui.format(maxErrorText, this.field.max);
    }
    if (this.field.parseText != undefined) {
      let maxErrorText= this.field.parseText?this.translate.instant(this.field.parseText):this.translate.instant("FORM.PARSEDATETEXT");
      this.field.validation.messages['matDatepickerParse'] = maxErrorText;
    }
  }

  /**
   * Angular lifecycle hook invoked when data-bound input properties change.
   * @zh Angular 生命周期钩子：当数据绑定的输入属性发生变更时调用。
   * @param changes - changes parameter (`SimpleChanges`) / 变更集合参数（`SimpleChanges`）
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes['datetimepicker'] || changes['datepicker']) {
      this._watchStateChanges();
    }
  }

  /**
   * Angular lifecycle hook invoked just before the component, directive, or service is destroyed to release subscriptions and resources.
   * @zh Angular 生命周期钩子：在组件、指令或服务销毁前调用，用于释放订阅与清理资源。
   */
  override ngOnDestroy() {
    super.ngOnDestroy();
    this._datepickerSubscription.unsubscribe();
    this._localeSubscription.unsubscribe();
    this._valueChange.complete();
    this._disabledChange.complete();
    this._stateChanges.unsubscribe();
  }

  /**
   * Angular lifecycle hook invoked once after projected content (`ng-content`) is initialized.
   * @zh Angular 生命周期钩子：在投影内容（`ng-content`）初始化完成后调用一次。
   */
  ngAfterContentInit() {
    this._watchStateChanges();
    if (this.datetimepicker) {
      this.registerDatepicker(this.datetimepicker);
      this._datepickerSubscription = this.datetimepicker.selectedChanged.subscribe((selected: D) => {
        this.value = selected;
        this._cvaOnChange(selected);
        this._onTouched();
        this.dateInput.emit(new MatDatetimepickerInputEvent(this));
        this.dateChange.emit(new MatDatetimepickerInputEvent(this));
      });
    }
  }

  /**
   * Executes `_open` to handle open.
   * @zh 执行 `_open`，用于打开。
   * @param event - event parameter (`Event`) / 事件参数（`Event`）
   */
  _open(event: Event): void {
    if (this.datetimepicker && !this.disabled) {
      event.stopPropagation();
      this.datetimepicker.open();
    }
  }

  /**
   * Executes `change` to handle change.
   * @zh 执行 `change`，用于变更。
   * @param v - v parameter (`any`) / v参数（`any`）
   */
  change(v) {
    this.field.inputValue = v.format(this.getDisplayFormat());
    this.value=v;
    if (this.field.change) {
      this.field.change(this.field, v.format('YYYY-MM-DD'));
    }
  }

  /**
   * Executes `_watchStateChanges` to handle watch state changes.
   * @zh 执行 `_watchStateChanges`，用于watch状态变更集合。
   */
  private _watchStateChanges() {
    const datepickerDisabled = this.datetimepicker ? this.datetimepicker._disabledChange : observableOf();
    const inputDisabled = this.datetimepicker && this.datetimepicker._datepickerInput ?
      this.datetimepicker._datepickerInput._disabledChange : observableOf();
    this._stateChanges.unsubscribe();
    //@ts-ignore
    this._stateChanges = merge(this._intl.changes, datepickerDisabled, inputDisabled)
      .subscribe(() => this._changeDetectorRef.markForCheck());
  }

  /**
   * Executes `registerDatepicker` to handle register datepicker.
   * @zh 执行 `registerDatepicker`，用于注册日期选择器。
   * @param value - value parameter (`MatDatetimepicker<D>`) / 值参数（`MatDatetimepicker<D>`）
   */
  private registerDatepicker(value: MatDatetimepicker<D>) {
    if (value) {
      this.datetimepicker._registerInput(this);
    }
  }

  /**
   * Executes `getDisplayFormat` to handle get display format.
   * @zh 执行 `getDisplayFormat`，用于获取Display格式化。
   */
  public getDisplayFormat() {
    switch (this.datetimepicker.type) {
      case "date":
        return this._dateFormats.display.dateInput;
      case "datetime":
        return this._dateFormats.display.datetimeInput;
      case "time":
        return this._dateFormats.display.timeInput;
      case "month":
        return this._dateFormats.display.monthInput;
    }
  }

  /**
   * Executes `getParseFormat` to handle get parse format.
   * @zh 执行 `getParseFormat`，用于获取解析格式化。
   */
  public getParseFormat() {
    let parseFormat;

    switch (this.datetimepicker.type) {
      case "date":
        parseFormat = this._dateFormats.parse.dateInput;
        break;
      case "datetime":
        parseFormat = this._dateFormats.parse.datetimeInput;
        break;
      case "time":
        parseFormat = this._dateFormats.parse.timeInput;
        break;
      case "month":
        parseFormat = this._dateFormats.parse.monthInput;
        break;
    }
    if (!parseFormat) {
      parseFormat = this._dateFormats.parse.dateInput;
    }
    return parseFormat;
  }


  /**
   * Property `_onTouched` (`any`) storing on touched (default: `() => { }`).
   * @zh 属性 `_onTouched`（类型：`any`），用于存储或配置当是否已触碰（默认值：`() => { }`）。
   */
  _onTouched = () => {
  }

  /**
   * Property `_cvaOnChange` (`(value: any) => void`) storing cva on change (default: `() => { }`).
   * @zh 属性 `_cvaOnChange`（类型：`(value: any) => void`），用于存储或配置cva当变更（默认值：`() => { }`）。
   */
  private _cvaOnChange: (value) => void = () => {
  }

  /**
   * Property `_validatorOnChange` (`any`) storing validator on change (default: `() => { }`).
   * @zh 属性 `_validatorOnChange`（类型：`any`），用于存储或配置校验器当变更（默认值：`() => { }`）。
   */
  private _validatorOnChange = () => {
  }

  /**
   * The form control validator for whether the input parses.
   * @zh 属性 `_parseValidator`（类型：`ValidatorFn`），用于存储或配置解析校验器。
   */
  private _parseValidator: ValidatorFn = (): ValidationErrors | null => {
    return this._lastValueValid ?
      null : { "matDatepickerParse": { "text": this.field.inputValue } };
  }

  /**
   * The form control validator for the min date.
   * @zh 属性 `_minValidator`（类型：`ValidatorFn`），用于存储或配置最小值校验器。
   */
  private _minValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const controlValue = this._dateAdapter.getValidDateOrNull(this._dateAdapter.deserialize(control.value));
    return (!this.min || !controlValue ||
      this._dateAdapter.compareDatetime(this.min, controlValue) <= 0) ?
      null : { "matDatepickerMin": { "min": this.min, "actual": controlValue } };
  }

  /**
   * The form control validator for the max date.
   * @zh 属性 `_maxValidator`（类型：`ValidatorFn`），用于存储或配置最大值校验器。
   */
  private _maxValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const controlValue = this._dateAdapter.getValidDateOrNull(this._dateAdapter.deserialize(control.value));
    return (!this.max || !controlValue ||
      this._dateAdapter.compareDatetime(this.max, controlValue) >= 0) ?
      null : { "matDatepickerMax": { "max": this.max, "actual": controlValue } };
  }

  /**
   * The form control validator for the date filter.
   * @zh 属性 `_filterValidator`（类型：`ValidatorFn`），用于存储或配置过滤校验器。
   */
  private _filterValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const controlValue = this._dateAdapter.getValidDateOrNull(this._dateAdapter.deserialize(control.value));
    return !this._dateFilter || !controlValue || this._dateFilter(controlValue, MatDatetimepickerFilterType.DATE) ?
      null : { "matDatepickerFilter": true };
  }

  /**
   * The combined form control validator for this input.
   * @zh 属性 `_validator`（类型：`ValidatorFn | null`），用于存储或配置校验器。
   */
  private _validator: ValidatorFn | null =
    Validators.compose(
      [this._parseValidator, this._minValidator, this._maxValidator, this._filterValidator]);

  /**
   * Whether the last value set on the input was valid.
   * @zh 属性 `_lastValueValid`（类型：`boolean`），用于存储或配置末尾值有效（默认值：`false`）。
   */
  private _lastValueValid = false;



  /**
   * Executes `registerOnValidatorChange` to handle register on validator change.
   * @zh 执行 `registerOnValidatorChange`，用于注册当校验器变更。
   * @param fn - fn parameter (`() => void`) / 函数参数（`() => void`）
   */
  registerOnValidatorChange(fn: () => void): void {
    this._validatorOnChange = fn;
  }

  /**
   * Executes `validate` to handle validate.
   * @zh 执行 `validate`，用于校验。
   * @param c - c parameter (`AbstractControl`) / c参数（`AbstractControl`）
   * @returns Result of type `ValidationErrors | null` / 类型为 `ValidationErrors | null` 的返回值
   */
  validate(c: AbstractControl): ValidationErrors | null {
    return this._validator ? this._validator(c) : null;
  }

  // Implemented as part of ControlValueAccessor
  /**
   * Writes a new value from the Angular form model into the view (`ControlValueAccessor`).
   * @zh 将 Angular 表单模型中的新值写入视图（`ControlValueAccessor` 接口实现）。
   * @param value - value parameter (`D`) / 值参数（`D`）
   */
  writeValue(value: D): void {
    this.value = value;
  }

  // Implemented as part of ControlValueAccessor
  /**
   * Registers a callback function invoked when the control value changes in the UI (`ControlValueAccessor`).
   * @zh 注册当界面控件值发生变化时触发的回调函数（`ControlValueAccessor` 接口实现）。
   * @param fn - fn parameter (`(value: any) => void`) / 函数参数（`(value: any) => void`）
   */
  registerOnChange(fn: (value) => void): void {
    this._cvaOnChange = fn;
  }

  // Implemented as part of ControlValueAccessor
  /**
   * Registers a callback function invoked when the control receives a blur/touched event (`ControlValueAccessor`).
   * @zh 注册当控件失焦或被触碰时触发的回调函数（`ControlValueAccessor` 接口实现）。
   * @param fn - fn parameter (`() => void`) / 函数参数（`() => void`）
   */
  registerOnTouched(fn: () => void): void {
    this._onTouched = fn;
  }

  // Implemented as part of ControlValueAccessor
  /**
   * Enables or disables the UI control when the form control disabled status changes (`ControlValueAccessor`).
   * @zh 当表单控件的禁用状态变更时启用或禁用界面控件（`ControlValueAccessor` 接口实现）。
   * @param disabled - disabled parameter (`boolean`) / 已禁用参数（`boolean`）
   */
  setDisabledState(disabled: boolean): void {
    this.disabled = disabled;
  }

  /**
   * Executes `_onKeydown` to handle on keydown.
   * @zh 执行 `_onKeydown`，用于当按键按下。
   * @param event - event parameter (`KeyboardEvent`) / 事件参数（`KeyboardEvent`）
   */
  _onKeydown(event: KeyboardEvent) {
    // tslint:disable-next-line:deprecation
    if (event.altKey && event.keyCode === DOWN_ARROW) {
      this.datetimepicker.open();
      event.preventDefault();
    }
  }

  /**
   * Executes `_onInput` to handle on input.
   * @zh 执行 `_onInput`，用于当输入属性。
   * @param value - value parameter (`string`) / 值参数（`string`）
   */
  _onInput(value: string) {

    if(value==null) value=undefined;
    let date = this._dateAdapter.parse(value, this.getParseFormat());
    this._lastValueValid = !date || this._dateAdapter.isValid(date);
    date = this._dateAdapter.getValidDateOrNull(date);
    // 这里不写 formControl(b8c5e5c 复核)。这个 (input) 是从内层
    // <input matDatetimepicker [formControl]> 冒泡上来的,内层
    // MatDatetimepickerInput._onInput 已经通过它的 _cvaOnChange 把 date 写进了
    // 同一个 formControl(@angular/forms updateControl:
    // setValue(v, { emitModelToViewChange: false }),不回写视图)。
    // 再 setValue(date) 一次会走 model→view,经 MatDatetimepickerInput.writeValue
    // 把输入框改写成格式化后的日期:用户敲下 "2" 立刻变成 0002/01/01,没法往下输。
    this._cvaOnChange(date);
    this._valueChange.emit(date);
    this.dateInput.emit(new MatDatetimepickerInputEvent(this));
  }

  /**
   * Executes `_onChange` to handle on change.
   * @zh 执行 `_onChange`，用于当变更。
   */
  _onChange() {
    this.dateChange.emit(new MatDatetimepickerInputEvent(this));
  }

  /**
   * Executes `_onBlur` to handle on blur.
   * @zh 执行 `_onBlur`，用于当失焦。
   */
  _onBlur() {
    if (this.value) {
      // this.formatValue(this.value);
    }
    this._onTouched();
  }
}
