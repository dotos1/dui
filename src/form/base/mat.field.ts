import { AfterViewInit, Directive, OnDestroy, OnInit, TemplateRef, Type, ViewChild } from '@angular/core';
import { MatFormField, MatFormFieldControl } from '@angular/material/form-field';
import { Dui } from '@dotos/dui/core';
import { FieldType as CoreFieldType, ExtErrorStateMatcher, FieldConfig } from '@dotos/dui/core/form';
import { TranslateService } from '@dotos/dui/translator';
import {isUndefined}  from 'lodash-es';
import { Subject } from 'rxjs';

@Directive()
export abstract class MatField<F extends FieldConfig = FieldConfig> extends CoreFieldType<F> implements OnInit, AfterViewInit, OnDestroy, MatFormFieldControl<any>  {
  @ViewChild('matPrefix', { static: true }) matPrefix!: TemplateRef<any>;
  @ViewChild('matSuffix', { static: true }) matSuffix!: TemplateRef<any>;

  get formFieldControl() { return this._control || this; }
  set formFieldControl(control: MatFormFieldControl<any>) {
    this._control = control;
    if (this.formField && control !== this.formField._control) {
      this.formField._control = control;
    }
  }

  private _control!: MatFormFieldControl<any>;
  errorStateMatcher = new ExtErrorStateMatcher(this);
  stateChanges = new Subject<void>();
  _errorState = false;

  invalidText: string = 'The value in this field is invalid';

  public toolTip: string;

  constructor(
    protected translate: TranslateService,
  ) {
    super();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public override init(config?: any): void {
    let blankErrorText = this.translate.instant("FORM.BLANKTEXT");
    if (this.field.validation) {
      if (isUndefined(this.field.validation.messages)) {
        this.field.validation.messages = {};
      }
      this.field.validation.messages['required'] = this.field.blankText ?
      this.translate.instant(this.field.blankText) : blankErrorText;
    } else {
      this.field.validation = {
        messages: {
          'required': this.field.blankText ? this.translate.instant(this.field.blankText)  : blankErrorText
        },
        show: false
      };
    }
    if (this.field.qtip !== 'under' && this.field.description) {
      this.toolTip = this.field.description;
    }
  }

  ngOnInit() {
    if (this.formField) {
      this.formField._control = this.formFieldControl;
    }
  }

  ngAfterViewInit() {
    if (this.matPrefix || this.matSuffix) {
      setTimeout(() => {
        Dui.defineHiddenProp(this.field, '_matPrefix', this.matPrefix);
        Dui.defineHiddenProp(this.field, '_matSuffix', this.matSuffix);
        (<any>this.option)._markForCheck(this.field);
      });
    }
  }

  ngOnDestroy() {
    if (this.formField) {
      delete this.formField._control;
    }
    this.stateChanges.complete();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setDescribedByIds(ids: string[]): void { }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onContainerClick(event: MouseEvent): void {
    this.field.focused = true;
    this.stateChanges.next();
  }

  get errorState() {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const showError = this.option!.showError!(this);
    if (showError !== this._errorState) {
      this._errorState = showError;
      this.stateChanges.next();
    }
    return showError;
  }

  get controlType() {
    if (this.field.type) {
      return this.field.type;
    }
    if ((<any>this.field.type) instanceof Type) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return this.field.type!.constructor.name;
    }
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return this.field.type!;
  }
  get focused() { return !!this.field.focused && !this.disabled; }
  get disabled() { return !!this.field.disabled; }
  get required() { return !!this.field.required; }
  get placeholder() { return this.field.placeholder || ''; }
  get shouldPlaceholderFloat() { return this.shouldLabelFloat; }
  get value() { return this.formControl.value; }
  set value(value) {
    this.formControl.patchValue(value);
  }
  get ngControl() { return this.formControl as any; }
  get empty() { return this.value === undefined || this.value === null || this.value === ''; }
  get shouldLabelFloat() { return this.focused || !this.empty; }
  get formField(): MatFormField { return this.field ? (<any>this.field)['__formField__'] : null; }
}
