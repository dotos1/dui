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

export const MAT_DATETIMEPICKER_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => DateFieldComponent),
  multi: true
};

export const MAT_DATETIMEPICKER_VALIDATORS: any = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => DateFieldComponent),
  multi: true
};


export class MatDatetimepickerInputEvent<D> {
  /** The new value for the target datepicker input. */
  value: D | null;
  constructor(public target: DateFieldComponent<D>) {
    this.value = this.target.value;
  }
}
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
    "(keydown)": "_onKeydown($event)"
  },
})

export class DateFieldComponent<D> extends MatField implements AfterContentInit, OnChanges, ControlValueAccessor, OnDestroy, Validator {

  @ViewChild(MatDatetimepicker, { static: false }) datetimepicker: MatDatetimepicker<D>;


  @Input() set matDatepickerFilter(filter: (date: D | null, type: MatDatetimepickerFilterType) => boolean) {
    this._dateFilter = filter;
    this._validatorOnChange();
  }
  _dateFilter: (date: D | null, type: MatDatetimepickerFilterType) => boolean;


  /** The minimum valid date. */
  @Input()
  get min(): D | null {
    return this._min;
  }
  set min(value: D | null) {
    this._min = this._dateAdapter.getValidDateOrNull(this._dateAdapter.deserialize(value));
    this._validatorOnChange();
  }
  private _min: D | null;

  @Input()
  get max(): D | null {
    return this._max;
  }
  set max(value: D | null) {
    this._max = this._dateAdapter.getValidDateOrNull(this._dateAdapter.deserialize(value));
    this._validatorOnChange();
  }
  private _max: D | null;

  @Input()
  override get disabled(): boolean {
    return this._disabled === undefined ? this.datetimepicker.disabled : !!this._disabled;
  }
  override set disabled(value: boolean) {
    const newValue =  coerceBooleanProperty (value);
    if (this._disabled !== newValue) {
      this._disabled = newValue;
      this._disabledChange.emit(newValue);
    }
  }
  private _disabled: boolean;

  /** Emits when a `change` event is fired on this `<input>`. */
  @Output() dateChange = new EventEmitter<MatDatetimepickerInputEvent<D>>();

  /** Emits when an `input` event is fired on this `<input>`. */
  @Output() dateInput = new EventEmitter<MatDatetimepickerInputEvent<D>>();

  private _stateChanges = Subscription.EMPTY;

  type: string = 'date';


  /** Emits when the value changes (either due to user input or programmatic change). */
  _valueChange = new EventEmitter<D | null>();

  /** Emits when the disabled state has changed */
  _disabledChange = new EventEmitter<boolean>();

  private _datepickerSubscription = Subscription.EMPTY;

  private _localeSubscription = Subscription.EMPTY;

  override get value() {
    return this.formControl.value;
  }
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

  ngOnChanges(changes: SimpleChanges) {
    if (changes['datepicker']) {
      this._watchStateChanges();
    }
  }

  override ngOnDestroy() {
    super.ngOnDestroy();
    this._datepickerSubscription.unsubscribe();
    this._localeSubscription.unsubscribe();
    this._valueChange.complete();
    this._disabledChange.complete();
    this._stateChanges.unsubscribe();
  }

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

  _open(event: Event): void {
    if (this.datetimepicker && !this.disabled) {
      event.stopPropagation();
      this.datetimepicker.open();
    }
  }

  change(v) {
    this.field.inputValue = v.format(this.getDisplayFormat());
    this.value=v;
    if (this.field.change) {
      this.field.change(this.field, v.format('YYYY-MM-DD'));
    }
  }

  private _watchStateChanges() {
    const datepickerDisabled = this.datetimepicker ? this.datetimepicker._disabledChange : observableOf();
    const inputDisabled = this.datetimepicker && this.datetimepicker._datepickerInput ?
      this.datetimepicker._datepickerInput._disabledChange : observableOf();
    this._stateChanges.unsubscribe();
    //@ts-ignore
    this._stateChanges = merge(this._intl.changes, datepickerDisabled, inputDisabled)
      .subscribe(() => this._changeDetectorRef.markForCheck());
  }

  private registerDatepicker(value: MatDatetimepicker<D>) {
    if (value) {
      this.datetimepicker._registerInput(this);
    }
  }

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


  _onTouched = () => {
  }

  private _cvaOnChange: (value: any) => void = () => {
  }

  private _validatorOnChange = () => {
  }

  /** The form control validator for whether the input parses. */
  private _parseValidator: ValidatorFn = (): ValidationErrors | null => {
    return this._lastValueValid ?
      null : { "matDatepickerParse": { "text": this.field.inputValue } };
  }

  /** The form control validator for the min date. */
  private _minValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const controlValue = this._dateAdapter.getValidDateOrNull(this._dateAdapter.deserialize(control.value));
    return (!this.min || !controlValue ||
      this._dateAdapter.compareDatetime(this.min, controlValue) <= 0) ?
      null : { "matDatepickerMin": { "min": this.min, "actual": controlValue } };
  }

  /** The form control validator for the max date. */
  private _maxValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const controlValue = this._dateAdapter.getValidDateOrNull(this._dateAdapter.deserialize(control.value));
    return (!this.max || !controlValue ||
      this._dateAdapter.compareDatetime(this.max, controlValue) >= 0) ?
      null : { "matDatepickerMax": { "max": this.max, "actual": controlValue } };
  }

  /** The form control validator for the date filter. */
  private _filterValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const controlValue = this._dateAdapter.getValidDateOrNull(this._dateAdapter.deserialize(control.value));
    return !this._dateFilter || !controlValue || this._dateFilter(controlValue, MatDatetimepickerFilterType.DATE) ?
      null : { "matDatepickerFilter": true };
  }

  /** The combined form control validator for this input. */
  private _validator: ValidatorFn | null =
    Validators.compose(
      [this._parseValidator, this._minValidator, this._maxValidator, this._filterValidator]);

  /** Whether the last value set on the input was valid. */
  private _lastValueValid = false;



  registerOnValidatorChange(fn: () => void): void {
    this._validatorOnChange = fn;
  }

  validate(c: AbstractControl): ValidationErrors | null {
    return this._validator ? this._validator(c) : null;
  }

  // Implemented as part of ControlValueAccessor
  writeValue(value: D): void {
    this.value = value;
  }

  // Implemented as part of ControlValueAccessor
  registerOnChange(fn: (value: any) => void): void {
    this._cvaOnChange = fn;
  }

  // Implemented as part of ControlValueAccessor
  registerOnTouched(fn: () => void): void {
    this._onTouched = fn;
  }

  // Implemented as part of ControlValueAccessor
  setDisabledState(disabled: boolean): void {
    this.disabled = disabled;
  }

  _onKeydown(event: KeyboardEvent) {
    // tslint:disable-next-line:deprecation
    if (event.altKey && event.keyCode === DOWN_ARROW) {
      this.datetimepicker.open();
      event.preventDefault();
    }
  }

  _onInput(value: string) {

    if(value==null) value=undefined;
    let date = this._dateAdapter.parse(value, this.getParseFormat());
    this._lastValueValid = !date || this._dateAdapter.isValid(date);
    date = this._dateAdapter.getValidDateOrNull(date);
    this.formControl.value = date;
    this._cvaOnChange(date);
    this._valueChange.emit(date);
    this.dateInput.emit(new MatDatetimepickerInputEvent(this));
  }

  _onChange() {
    this.dateChange.emit(new MatDatetimepickerInputEvent(this));
  }

  _onBlur() {
    if (this.value) {
      // this.formatValue(this.value);
    }
    this._onTouched();
  }
}
