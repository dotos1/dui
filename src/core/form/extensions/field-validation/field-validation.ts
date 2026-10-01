import { FormConfig } from '../../services/form.config';
import { FormExtension, ValidatorOption, FieldConfigCache } from '../../models';
import { AbstractControl, Validators, ValidatorFn } from '@angular/forms';
import { FORM_VALIDATORS, defineHiddenProp, isPromise, observe, clone, isObject } from '../../utils';
import { updateValidity } from '../field-form/utils';
import { isObservable } from 'rxjs';
import { map } from 'rxjs/operators';
export class FieldValidationExtension implements FormExtension {
  constructor(private config: FormConfig) {}

  onPopulate(field: FieldConfigCache) {
    this.initFieldValidation(field, 'validators');
    this.initFieldValidation(field, 'asyncValidators');
  }

  private initFieldValidation(field: FieldConfigCache, type: 'validators' | 'asyncValidators') {
    const validators: ValidatorFn[] = [];
    if (type === 'validators' && !(field.hasOwnProperty('fieldGroup') && !field.name)) {
      validators.push(this.getPredefinedFieldValidation(field));
    }
    if (field[type]) {
      for (const validatorName of Object.keys(field[type])) {
        validatorName === 'validation'
          ? validators.push(...field[type].validation.map((v) => this.wrapNgValidatorFn(field, v)))
          : validators.push(this.wrapNgValidatorFn(field, field[type][validatorName], validatorName));
      }
    }
    defineHiddenProp(field, '_' + type, validators);
  }

  private getPredefinedFieldValidation(field: FieldConfigCache): ValidatorFn {
    let VALIDATORS = [];
    FORM_VALIDATORS.forEach((opt) =>
      observe(field, [ opt], ({ currentValue, firstChange }) => {
        VALIDATORS = VALIDATORS.filter((o) => o !== opt);
        if (currentValue != null && currentValue !== false) {
          VALIDATORS.push(opt);
        }
        if (!firstChange && field.formControl) {
          updateValidity(field.formControl);
        }
      }),
    );
    return (control: AbstractControl) => {
      if (VALIDATORS.length === 0) {
        return null;
      }
      return Validators.compose(
        VALIDATORS.map((opt) => () => {
          const value = field[opt];
          switch (opt) {
            case 'required':
              return Validators.required(control);
            case 'pattern':
              return Validators.pattern(value)(control);
            case 'minLength':
              return Validators.minLength(value)(control);
            case 'maxLength':
              return Validators.maxLength(value)(control);
            case 'min':
              return Validators.min(value)(control);
            case 'max':
              return Validators.max(value)(control);
          }
          return undefined;
        }),
      )(control);
    };
  }

  private wrapNgValidatorFn(field: FieldConfigCache, validator: any, validatorName?: string) {
    let validatorOption: ValidatorOption = null;
    if (typeof validator === 'string') {
      validatorOption = clone(this.config.getValidator(validator));
    }
    if (typeof validator === 'object' && validator.name) {
      validatorOption = clone(this.config.getValidator(validator.name));
      if (validator.options) {
        validatorOption.options = validator.options;
      }
    }
    if (typeof validator === 'object' && validator.expression) {
      const { expression, ...options } = validator;
      validatorOption = {
        name: validatorName,
        validation: expression,
        options: Object.keys(options).length > 0 ? options : null,
      };
    }
    if (typeof validator === 'function') {
      validatorOption = {
        name: validatorName,
        validation: validator,
      };
    }
    return (control: AbstractControl) => {
      const errors: any = validatorOption.validation(control, field, validatorOption.options);
      if (isPromise(errors)) {
        return errors.then((v) => this.handleAsyncResult(field, validatorName ? !!v : v, validatorOption));
      }
      if (isObservable(errors)) {
        return errors.pipe(map((v) => this.handleAsyncResult(field, validatorName ? !!v : v, validatorOption)));
      }
      return this.handleResult(field, validatorName ? !!errors : errors, validatorOption);
    };
  }

  private handleAsyncResult(field: FieldConfigCache, errors: any, options: ValidatorOption) {
    field.option.detectChanges(field);
    return this.handleResult(field, errors, options);
  }

  private handleResult(field: FieldConfigCache, errors: any, { name, options }: ValidatorOption) {
    if (typeof errors === 'boolean') {
      errors = errors ? null : { [name]: options ? options : true };
    }
    const ctrl = field.formControl;
    ctrl && ctrl['_childrenErrors'] && ctrl['_childrenErrors'][name] && ctrl['_childrenErrors'][name]();
    if (isObject(errors)) {
      Object.keys(errors).forEach((name) => {
        const errorPath = errors[name].errorPath ? errors[name].errorPath : (options || {})['errorPath'];
        const childCtrl = errorPath ? field.formControl.get(errorPath) : null;
        if (childCtrl) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { errorPath, ...opts } = errors[name];
          childCtrl.setErrors({ ...(childCtrl.errors || {}), [name]: opts });
          !ctrl['_childrenErrors'] && defineHiddenProp(ctrl, '_childrenErrors', {});
          ctrl['_childrenErrors'][name] = () => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { [name]: toDelete, ...childErrors } = childCtrl.errors || {};
            childCtrl.setErrors(Object.keys(childErrors).length === 0 ? null : childErrors);
          };
        }
      });
    }
    return errors;
  }
}
