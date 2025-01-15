import { Component, Input, ChangeDetectionStrategy, OnChanges } from '@angular/core';
import { FormConfig } from '../services/form.config';
import {  FieldConfig } from '../models/field.config';
import { isObject } from '../utils';
import { Observable, isObservable, of } from 'rxjs';
import { startWith, switchMap } from 'rxjs/operators';
import { TranslateService } from '@dotos/dui/translator';


@Component({
  selector: 'validation-message',
  template: `{{ errorMessage$ | async }}`,
  changeDetection: ChangeDetectionStrategy.Default,
  host: { 'hostID': crypto.randomUUID().toString()}
})
export class ValidationMessage implements OnChanges {
  @Input() field: FieldConfig;
  errorMessage$: Observable<any>;

  constructor(private formConfig: FormConfig,
    protected translate: TranslateService) {}

  ngOnChanges() {
    this.errorMessage$ = this.field.formControl.statusChanges.pipe(
      startWith(null),
      switchMap(() => (isObservable(this.errorMessage) ? this.errorMessage : of(this.errorMessage))),
    );
  }

  // eslint-disable-next-line getter-return
  get errorMessage() :any{
    const fieldForm = this.field.formControl;
    for (const error in fieldForm.errors) {
      if (fieldForm.errors.hasOwnProperty(error)) {
        let message:any = this.formConfig.getValidatorMessage(error);
        if (isObject(fieldForm.errors[error])) {
          if (fieldForm.errors[error].errorPath) {
            // eslint-disable-next-line getter-return
            return ;
          }
          if (fieldForm.errors[error].message) {
            message = fieldForm.errors[error].message;
          }
        }

        if (this.field.validation && this.field.validation.messages && this.field.validation.messages[error]) {
          message = this.field.validation.messages[error];
        }

        if (this.field.validators && this.field.validators[error] && this.field.validators[error].message) {
          message = this.field.validators[error].message;
        }

        if (
          this.field.asyncValidators &&
          this.field.asyncValidators[error] &&
          this.field.asyncValidators[error].message
        ) {
          message = this.field.asyncValidators[error].message;
        }
        if (typeof message === 'function') {
          return message(fieldForm.errors[error], this.field);
        }
        return message?this.translate.instant(message):'';
      }
    }
  }
}
