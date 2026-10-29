/**
 * @fileoverview Module `src/form/date/picker/datetimepicker-input.ts` providing datetimepicker input definitions and implementation.
 * @zh 模块文件 `src/form/date/picker/datetimepicker-input.ts`，提供日期时间选择器输入属性相关的定义与实现。
 */

import {coerceBooleanProperty} from "@angular/cdk/coercion";
import {DOWN_ARROW} from "@angular/cdk/keycodes";
import {AfterContentInit, Directive, ElementRef, EventEmitter, forwardRef, Inject, Input, OnDestroy, Optional, Output} from "@angular/core";
import {
  AbstractControl,
  ControlValueAccessor,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator,
  ValidatorFn,
  Validators
} from "@angular/forms";
import {MAT_INPUT_VALUE_ACCESSOR} from "@angular/material/input";
import {MatFormField} from "@angular/material/form-field";
import {Subscription} from "rxjs";
import {DatetimeAdapter,MAT_DATETIME_FORMATS, MatDatetimeFormats} from "@dotos/dui/form/date/adapter";

import {MatDatetimepicker} from "./datetimepicker";
import {createMissingDateImplError} from "./datetimepicker-errors";
import {MatDatetimepickerFilterType} from "./datetimepicker-filtertype";

// tslint:disable no-use-before-declare

/**
 * Constant/variable `MAT_DATETIMEPICKER_VALUE_ACCESSOR` defining mat datetimepicker value accessor in `src/form/date/picker`.
 * @zh 常量/变量 `MAT_DATETIMEPICKER_VALUE_ACCESSOR`，定义 `src/form/date/picker` 中的Material日期时间选择器值访问器。
 */
export const MAT_DATETIMEPICKER_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => MatDatetimepickerInput),
  multi: true
};

/**
 * Constant/variable `MAT_DATETIMEPICKER_VALIDATORS` defining mat datetimepicker validators in `src/form/date/picker`.
 * @zh 常量/变量 `MAT_DATETIMEPICKER_VALIDATORS`，定义 `src/form/date/picker` 中的Material日期时间选择器校验器列表。
 */
export const MAT_DATETIMEPICKER_VALIDATORS = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => MatDatetimepickerInput),
  multi: true
};

/**
 * An event used for datepicker input and change events. We don't always have access to a native
 * input or change event because the event may have been triggered by the user clicking on the
 * calendar popup. For consistency, we always use MatDatepickerInputEvent instead.

 * @zh 类 `MatDatetimepickerInputEvent`，封装 `src/form/date/picker` 中的Material日期时间选择器输入属性事件数据结构与处理逻辑。
 */
export class MatDatetimepickerInputEvent<D> {
  /**
   * The new value for the target datepicker input.
   * @zh 属性 `value`（类型：`D`），用于存储或配置值。
   */
  value: D | null;

  /**
   * Creates an instance of `MatDatetimepickerInputEvent` and initializes its dependencies and internal state.
   * @zh 创建 `MatDatetimepickerInputEvent` 实例，并初始化其依赖项与内部状态。
   * @param target - Injected or initial target (`MatDatetimepickerInput<D>`) / 注入或传入的目标（`MatDatetimepickerInput<D>`）
   * @param targetElement - Injected or initial target element (`HTMLElement`) / 注入或传入的目标元素（`HTMLElement`）
   */
  constructor(public target: MatDatetimepickerInput<D>, public targetElement: HTMLElement) {
    this.value = this.target.value;
  }
}

/**
 * Directive used to connect an input to a MatDatepicker.
 * @zh Angular 指令 `MatDatetimepickerInput`（selector: 'input[matDatetimepicker]'），为宿主 DOM 元素附加Material日期时间选择器输入属性行为。
 */
@Directive({
  selector: "input[matDatetimepicker]",
  providers: [
    MAT_DATETIMEPICKER_VALUE_ACCESSOR,
    MAT_DATETIMEPICKER_VALIDATORS,
    {provide: MAT_INPUT_VALUE_ACCESSOR, useExisting: MatDatetimepickerInput},
  ],
  host: {
    "[attr.aria-haspopup]": "true",
    "[attr.aria-owns]": "(_datepicker?.opened && _datepicker.id) || null",
    "[attr.min]": "min ? _dateAdapter.toIso8601(min) : null",
    "[attr.max]": "max ? _dateAdapter.toIso8601(max) : null",
    "[disabled]": "disabled",
    "(focus)": "_datepicker._handleFocus()",
    "(input)": "_onInput($event.target.value)",
    "(change)": "_onChange()",
    "(blur)": "_onBlur()",
    "(keydown)": "_onKeydown($event)"
  },
  exportAs: "matDatepickerInput"
})
export class MatDatetimepickerInput<D> implements AfterContentInit, ControlValueAccessor, OnDestroy,
  Validator {
  /**
   * Property `_datepicker` (`MatDatetimepicker<D>`) storing datepicker.
   * @zh 属性 `_datepicker`（类型：`MatDatetimepicker<D>`），用于存储或配置日期选择器。
   */
  _datepicker: MatDatetimepicker<D>;
  /**
   * Property `_dateFilter` (`(date: D | null, type: MatDatetimepickerFilterType) => boolean`) storing date filter.
   * @zh 属性 `_dateFilter`（类型：`(date: D | null, type: MatDatetimepickerFilterType) => boolean`），用于存储或配置日期过滤。
   */
  _dateFilter: (date: D | null, type: MatDatetimepickerFilterType) => boolean;
  /**
   * Emits when a `change` event is fired on this `<input>`.
   * @zh 输出事件 `dateChange`（类型：`EventEmitter<MatDatetimepickerInputEvent<D>>`），当触发日期变更时向外发出事件。
   */
  @Output() dateChange = new EventEmitter<MatDatetimepickerInputEvent<D>>();
  /**
   * Emits when an `input` event is fired on this `<input>`.
   * @zh 输出事件 `dateInput`（类型：`EventEmitter<MatDatetimepickerInputEvent<D>>`），当触发日期输入属性时向外发出事件。
   */
  @Output() dateInput = new EventEmitter<MatDatetimepickerInputEvent<D>>();
  /**
   * Emits when the value changes (either due to user input or programmatic change).
   * @zh 属性 `_valueChange`（类型：`EventEmitter<D>`），用于存储或配置值变更（默认值：`new EventEmitter<D | null>()`）。
   */
  _valueChange = new EventEmitter<D | null>();
  /**
   * Emits when the disabled state has changed
   * @zh 属性 `_disabledChange`（类型：`EventEmitter<boolean>`），用于存储或配置已禁用变更（默认值：`new EventEmitter<boolean>()`）。
   */
  _disabledChange = new EventEmitter<boolean>();
  /**
   * Property `_datepickerSubscription` (`Subscription`) storing datepicker subscription (default: `Subscription.EMPTY`).
   * @zh 属性 `_datepickerSubscription`（类型：`Subscription`），用于存储或配置日期选择器订阅对象（默认值：`Subscription.EMPTY`）。
   */
  private _datepickerSubscription = Subscription.EMPTY;
  /**
   * Property `_localeSubscription` (`Subscription`) storing locale subscription (default: `Subscription.EMPTY`).
   * @zh 属性 `_localeSubscription`（类型：`Subscription`），用于存储或配置语言区域订阅对象（默认值：`Subscription.EMPTY`）。
   */
  private _localeSubscription = Subscription.EMPTY;
  /**
   * Whether the last value set on the input was valid.
   * @zh 属性 `_lastValueValid`（类型：`boolean`），用于存储或配置末尾值有效（默认值：`false`）。
   */
  private _lastValueValid = false;

  /**
   * Creates an instance of `MatDatetimepickerInput` and initializes its dependencies and internal state.
   * @zh 创建 `MatDatetimepickerInput` 实例，并初始化其依赖项与内部状态。
   * @param _elementRef - Injected or initial element ref (`ElementRef<any>`) / 注入或传入的元素引用（`ElementRef<any>`）
   * @param _dateAdapter - Injected or initial date adapter (`DatetimeAdapter<D>`) / 注入或传入的日期适配器（`DatetimeAdapter<D>`）
   * @param _dateFormats - Injected or initial date formats (`MatDatetimeFormats`) / 注入或传入的日期格式列表（`MatDatetimeFormats`）
   * @param _formField - Injected or initial form field (`MatFormField`) / 注入或传入的表单字段（`MatFormField`）
   */
  constructor(private _elementRef: ElementRef,
              @Optional() public _dateAdapter: DatetimeAdapter<D>,
              @Optional() @Inject(MAT_DATETIME_FORMATS) private _dateFormats: MatDatetimeFormats,
              @Optional() private _formField: MatFormField) {
    if (!this._dateAdapter) {
      throw createMissingDateImplError("DatetimeAdapter");
    }
    if (!this._dateFormats) {
      throw createMissingDateImplError("MAT_DATETIME_FORMATS");
    }

    // Update the displayed date when the locale changes.
    this._localeSubscription = _dateAdapter.localeChanges.subscribe(() => {
     // this.value = this.value;
    });
  }

  /**
   * The datepicker that this input is associated with.
   * @zh 输入属性 `matDatetimepicker` 的设置器，用于更新Material日期时间选择器。
   */
  @Input()
  set matDatetimepicker(value: MatDatetimepicker<D>) {
    this.registerDatepicker(value);
  }

  /**
   * Input setter `matDatepickerFilter` updating mat datepicker filter.
   * @zh 输入属性 `matDatepickerFilter` 的设置器，用于更新Material日期选择器过滤。
   * @param filter - New mat datepicker filter value (`(date: D | null, type: MatDatetimepickerFilterType) => boolean`) / 新的Material日期选择器过滤值（`(date: D | null, type: MatDatetimepickerFilterType) => boolean`）
   */
  @Input() set matDatepickerFilter(filter: (date: D | null, type: MatDatetimepickerFilterType) => boolean) {
    this._dateFilter = filter;
    this._validatorOnChange();
  }

  /**
   * Property `_value` (`D`) storing value.
   * @zh 属性 `_value`（类型：`D`），用于存储或配置值。
   */
  private _value: D | null;

  /**
   * The value of the input.
   * @zh 输入属性 `value`（类型：`D`）的读取器，返回当前值。
   */
  @Input()
  get value(): D | null {
    return this._value;
  }

  /**
   * Sets the value (`value`).
   * @zh 设置值（`value`）。
   * @param value - New value value (`D`) / 新的值值（`D`）
   */
  set value(value: D | null) {
    value = this._dateAdapter.deserialize(value);
    this._lastValueValid = !value || this._dateAdapter.isValid(value);
    value = this._dateAdapter.getValidDateOrNull(value);
    const oldDate = this.value;
    this._value = value;
    this._formatValue(value);

    // use timeout to ensure the datetimepicker is instantiated and we get the correct format
    setTimeout(() => {
      if (!this._dateAdapter.sameDatetime(oldDate, value)) {
        this._valueChange.emit(value);
      }
    });
  }

  /**
   * Property `_min` (`D`) storing min.
   * @zh 属性 `_min`（类型：`D`），用于存储或配置最小值。
   */
  private _min: D | null;

  /**
   * The minimum valid date.
   * @zh 输入属性 `min`（类型：`D`）的读取器，返回当前最小值。
   */
  @Input()
  get min(): D | null {
    return this._min;
  }

  /**
   * Sets the min (`min`).
   * @zh 设置最小值（`min`）。
   * @param value - New min value (`D`) / 新的最小值值（`D`）
   */
  set min(value: D | null) {
    this._min = this._dateAdapter.getValidDateOrNull(this._dateAdapter.deserialize(value));
    this._validatorOnChange();
  }

  /**
   * Property `_max` (`D`) storing max.
   * @zh 属性 `_max`（类型：`D`），用于存储或配置最大值。
   */
  private _max: D | null;

  /**
   * The maximum valid date.
   * @zh 输入属性 `max`（类型：`D`）的读取器，返回当前最大值。
   */
  @Input()
  get max(): D | null {
    return this._max;
  }

  /**
   * Sets the max (`max`).
   * @zh 设置最大值（`max`）。
   * @param value - New max value (`D`) / 新的最大值值（`D`）
   */
  set max(value: D | null) {
    this._max = this._dateAdapter.getValidDateOrNull(this._dateAdapter.deserialize(value));
    this._validatorOnChange();
  }

  /**
   * Property `_disabled` (`boolean`) storing disabled.
   * @zh 属性 `_disabled`（类型：`boolean`），用于存储或配置已禁用。
   */
  private _disabled: boolean;

  /**
   * Whether the datepicker-input is disabled.
   * @zh 输入属性 `disabled`（类型：`boolean`）的读取器，返回当前已禁用。
   */
  @Input()
  get disabled() {
    return !!this._disabled;
  }

  /**
   * Sets the disabled (`disabled`).
   * @zh 设置已禁用（`disabled`）。
   * @param value - New disabled value (`boolean`) / 新的已禁用值（`boolean`）
   */
  set disabled(value) {
    const newValue = coerceBooleanProperty(value);

    if (this._disabled !== newValue) {
      this._disabled = newValue;
      this._disabledChange.emit(newValue);
    }
  }

  /**
   * Property `_onTouched` (`() => void`) storing on touched (default: `() => { }`).
   * @zh 属性 `_onTouched`（类型：`() => void`），用于存储或配置当是否已触碰（默认值：`() => { }`）。
   */
  _onTouched = () => {
  }

  /**
   * Angular lifecycle hook invoked once after projected content (`ng-content`) is initialized.
   * @zh Angular 生命周期钩子：在投影内容（`ng-content`）初始化完成后调用一次。
   */
  ngAfterContentInit() {
    if (this._datepicker) {
      // tslint:disable-next-line deprecation
      this._datepickerSubscription = this._datepicker.selectedChanged.subscribe((selected: D) => {
        this.value = selected;
        this._cvaOnChange(selected);
        this._onTouched();
        this.dateInput.emit(new MatDatetimepickerInputEvent(this, this._elementRef.nativeElement));
        this.dateChange.emit(new MatDatetimepickerInputEvent(this, this._elementRef.nativeElement));
      });
    }
  }

  /**
   * Angular lifecycle hook invoked just before the component, directive, or service is destroyed to release subscriptions and resources.
   * @zh Angular 生命周期钩子：在组件、指令或服务销毁前调用，用于释放订阅与清理资源。
   */
  ngOnDestroy() {
    this._datepickerSubscription.unsubscribe();
    this._localeSubscription.unsubscribe();
    this._valueChange.complete();
    this._disabledChange.complete();
  }

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
   * @param c - c parameter (`AbstractControl<any, any>`) / c参数（`AbstractControl<any, any>`）
   * @returns Result of type `ValidationErrors` / 类型为 `ValidationErrors` 的返回值
   */
  validate(c: AbstractControl): ValidationErrors | null {
    return this._validator ? this._validator(c) : null;
  }

  /**
   * Gets the element that the datepicker popup should be connected to.
   * @return The element to connect the popup to.

   * @zh 执行 `getConnectedOverlayOrigin`，用于获取已连接浮层Origin。
   */
  getConnectedOverlayOrigin(): ElementRef {
    return this._formField ? this._formField.getConnectedOverlayOrigin() : this._elementRef;
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
      this._datepicker.open();
      event.preventDefault();
    }
  }

  /**
   * Executes `_onInput` to handle on input.
   * @zh 执行 `_onInput`，用于当输入属性。
   * @param value - value parameter (`string`) / 值参数（`string`）
   */
  _onInput(value: string) {
    let date = this._dateAdapter.parse(value, this.getParseFormat());
    this._lastValueValid = !date || this._dateAdapter.isValid(date);
    date = this._dateAdapter.getValidDateOrNull(date);
    this._value = date;
    this._cvaOnChange(date);
    this._valueChange.emit(date);
    this.dateInput.emit(new MatDatetimepickerInputEvent(this, this._elementRef.nativeElement));
  }

  /**
   * Executes `_onChange` to handle on change.
   * @zh 执行 `_onChange`，用于当变更。
   */
  _onChange() {
    this.dateChange.emit(new MatDatetimepickerInputEvent(this, this._elementRef.nativeElement));
  }

  /**
   * Handles blur events on the input.
   * @zh 执行 `_onBlur`，用于当失焦。
   */
  _onBlur() {
    // Reformat the input only if we have a valid value.
    if (this.value) {
      this._formatValue(this.value);
    }

    this._onTouched();
  }

  /**
   * Executes `registerDatepicker` to handle register datepicker.
   * @zh 执行 `registerDatepicker`，用于注册日期选择器。
   * @param value - value parameter (`MatDatetimepicker<D>`) / 值参数（`MatDatetimepicker<D>`）
   */
  private registerDatepicker(value: MatDatetimepicker<D>) {
    if (value) {
      this._datepicker = value;
      this._datepicker._registerInput(this);
    }
  }

  /**
   * Executes `getDisplayFormat` to handle get display format.
   * @zh 执行 `getDisplayFormat`，用于获取Display格式化。
   */
  private getDisplayFormat() {
    switch (this._datepicker.type) {
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
  private getParseFormat() {
    let parseFormat;

    switch (this._datepicker.type) {
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
   * Property `_cvaOnChange` (`(value: any) => void`) storing cva on change (default: `() => { }`).
   * @zh 属性 `_cvaOnChange`（类型：`(value: any) => void`），用于存储或配置cva当变更（默认值：`() => { }`）。
   */
  private _cvaOnChange: (value) => void = () => {
  }

  /**
   * Property `_validatorOnChange` (`() => void`) storing validator on change (default: `() => { }`).
   * @zh 属性 `_validatorOnChange`（类型：`() => void`），用于存储或配置校验器当变更（默认值：`() => { }`）。
   */
  private _validatorOnChange = () => {
  }

  /**
   * The form control validator for whether the input parses.
   * @zh 属性 `_parseValidator`（类型：`ValidatorFn`），用于存储或配置解析校验器。
   */
  private _parseValidator: ValidatorFn = (): ValidationErrors | null => {
    return this._lastValueValid ?
      null : {"matDatepickerParse": {"text": this._elementRef.nativeElement.value}};
  }

  /**
   * The form control validator for the min date.
   * @zh 属性 `_minValidator`（类型：`ValidatorFn`），用于存储或配置最小值校验器。
   */
  private _minValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const controlValue = this._dateAdapter.getValidDateOrNull(this._dateAdapter.deserialize(control.value));
    return (!this.min || !controlValue ||
      this._dateAdapter.compareDatetime(this.min, controlValue) <= 0) ?
      null : {"matDatepickerMin": {"min": this.min, "actual": controlValue}};
  }

  /**
   * The form control validator for the max date.
   * @zh 属性 `_maxValidator`（类型：`ValidatorFn`），用于存储或配置最大值校验器。
   */
  private _maxValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const controlValue = this._dateAdapter.getValidDateOrNull(this._dateAdapter.deserialize(control.value));
    return (!this.max || !controlValue ||
      this._dateAdapter.compareDatetime(this.max, controlValue) >= 0) ?
      null : {"matDatepickerMax": {"max": this.max, "actual": controlValue}};
  }

  /**
   * The form control validator for the date filter.
   * @zh 属性 `_filterValidator`（类型：`ValidatorFn`），用于存储或配置过滤校验器。
   */
  private _filterValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const controlValue = this._dateAdapter.getValidDateOrNull(this._dateAdapter.deserialize(control.value));
    return !this._dateFilter || !controlValue || this._dateFilter(controlValue, MatDatetimepickerFilterType.DATE) ?
      null : {"matDatepickerFilter": true};
  }

  /**
   * The combined form control validator for this input.
   * @zh 属性 `_validator`（类型：`ValidatorFn`），用于存储或配置校验器。
   */
  private _validator: ValidatorFn | null =
    Validators.compose(
      [this._parseValidator, this._minValidator, this._maxValidator, this._filterValidator]);

  /**
   * Formats a value and sets it on the input element.
   * @zh 执行 `_formatValue`，用于格式化值。
   */
  private _formatValue(value: D | null) {
    this._elementRef.nativeElement.value =
      value ? this._dateAdapter.format(value, this.getDisplayFormat()) : "";
  }
}
