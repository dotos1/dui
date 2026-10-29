/**
 * @fileoverview Module `src/core/form/extensions/field-validation/field-validation.ts` providing field validation definitions and implementation.
 * @zh 模块文件 `src/core/form/extensions/field-validation/field-validation.ts`，提供字段校验相关的定义与实现。
 */

import { FormConfig } from '../../services/form.config';
import { FormExtension, ValidatorOption, FieldConfigCache } from '../../models';
import { AbstractControl, Validators, ValidatorFn } from '@angular/forms';
import { FORM_VALIDATORS, defineHiddenProp, isPromise, observe, clone, isObject } from '../../utils';
import { updateValidity } from '../field-form/utils';
import { isObservable } from 'rxjs';
import { map } from 'rxjs/operators';
/**
 * Class `FieldValidationExtension` encapsulating field validation extension data structures and logic in `src/core/form/extensions/field-validation`.
 * @zh 类 `FieldValidationExtension`，封装 `src/core/form/extensions/field-validation` 中的字段校验Extension数据结构与处理逻辑。
 */
export class FieldValidationExtension implements FormExtension {
  /**
   * Creates an instance of `FieldValidationExtension` and initializes its dependencies and internal state.
   * @zh 创建 `FieldValidationExtension` 实例，并初始化其依赖项与内部状态。
   * @param config - Injected or initial config (`FormConfig`) / 注入或传入的配置（`FormConfig`）
   */
  constructor(private config: FormConfig) {}

  /**
   * Executes `onPopulate` to handle on populate.
   * @zh 执行 `onPopulate`，用于当Populate。
   * @param field - field parameter (`FieldConfigCache`) / 字段参数（`FieldConfigCache`）
   */
  onPopulate(field: FieldConfigCache) {
    this.initFieldValidation(field, 'validators');
    this.initFieldValidation(field, 'asyncValidators');
  }

  /**
   * Executes `initFieldValidation` to handle init field validation.
   * @zh 执行 `initFieldValidation`，用于初始化字段校验。
   * @param field - field parameter (`FieldConfigCache`) / 字段参数（`FieldConfigCache`）
   * @param type - type parameter (`"validators" | "asyncValidators"`) / 类型参数（`"validators" | "asyncValidators"`）
   */
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

  /**
   * Executes `getPredefinedFieldValidation` to handle get predefined field validation.
   * @zh 执行 `getPredefinedFieldValidation`，用于获取Predefined字段校验。
   * @param field - field parameter (`FieldConfigCache`) / 字段参数（`FieldConfigCache`）
   * @returns Result of type `ValidatorFn` / 类型为 `ValidatorFn` 的返回值
   */
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
          const value = field[opt] as never;
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

  /**
   * Executes `wrapNgValidatorFn` to handle wrap ng validator fn.
   * @zh 执行 `wrapNgValidatorFn`，用于包裹Angular校验器函数。
   * @param field - field parameter (`FieldConfigCache`) / 字段参数（`FieldConfigCache`）
   * @param validator - validator parameter (`any`) / 校验器参数（`any`）
   * @param validatorName - validator name parameter (`string`) / 校验器名称参数（`string`）
   */
  private wrapNgValidatorFn(field: FieldConfigCache, validator, validatorName?: string) {
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
      const errors = validatorOption.validation(control, field, validatorOption.options);
      if (isPromise(errors)) {
        return errors['then']((v) => this.handleAsyncResult(field, validatorName ? !!v : v, validatorOption));
      }
      if (isObservable(errors)) {
        return errors.pipe(map((v) => this.handleAsyncResult(field, validatorName ? !!v : v, validatorOption)));
      }
      return this.handleResult(field, validatorName ? !!errors : errors, validatorOption);
    };
  }

  /**
   * Executes `handleAsyncResult` to handle handle async result.
   * @zh 执行 `handleAsyncResult`，用于连接手柄Async结果。
   * @param field - field parameter (`FieldConfigCache`) / 字段参数（`FieldConfigCache`）
   * @param errors - errors parameter (`any`) / 错误列表参数（`any`）
   * @param options - options parameter (`ValidatorOption`) / 配置选项参数（`ValidatorOption`）
   */
  private handleAsyncResult(field: FieldConfigCache, errors, options: ValidatorOption) {
    field.option.detectChanges(field);
    return this.handleResult(field, errors, options);
  }

  /**
   * Executes `handleResult` to handle handle result.
   * @zh 执行 `handleResult`，用于连接手柄结果。
   * @param field - field parameter (`FieldConfigCache`) / 字段参数（`FieldConfigCache`）
   * @param errors - errors parameter (`any`) / 错误列表参数（`any`）
   * @param options - { name, options } parameter (`ValidatorOption`) / {name,配置选项}参数（`ValidatorOption`）
   */
  private handleResult(field: FieldConfigCache, errors, { name, options }: ValidatorOption) {
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
