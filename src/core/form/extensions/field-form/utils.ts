/**
 * @fileoverview Module `src/core/form/extensions/field-form/utils.ts` providing utils definitions and implementation.
 * @zh 模块文件 `src/core/form/extensions/field-form/utils.ts`，提供工具集相关的定义与实现。
 */

import { EventEmitter } from '@angular/core';
import { FormArray, FormGroup, FormControl, AbstractControl } from '@angular/forms';
import { FieldConfig ,FieldConfigCache} from '../../models';
import {
  getKeyPath,
  getFieldValue,
  isNil,
  defineHiddenProp,
  observe
} from '../../utils';

/**
 * Executes `unregisterControl` to handle unregister control.
 * @zh 执行 `unregisterControl`，用于注销表单控件。
 * @param field - field parameter (`FieldConfig`) / 字段参数（`FieldConfig`）
 * @param emitEvent - emit event parameter (`boolean`) / 发出事件参数（`boolean`）
 */
export function unregisterControl(field: FieldConfig, emitEvent = false) {
  const form = field.formControl.parent as FormArray | FormGroup;
  if (!form) {
    return;
  }
  const control = field.formControl;
  const opts = { emitEvent };
  if (form instanceof FormArray) {
    const key = form.controls.findIndex((c) => c === control);
    if (key !== -1) {
      updateControl(form, opts, () => form.removeAt(key));
    }
  } else if (form instanceof FormGroup) {
    const paths = getKeyPath(field);
    const key = paths[paths.length - 1];
    if (form.get([key]) === control) {
      updateControl(form, opts, () => form.removeControl(key));
    }
  }
  control.setParent(null);
}

/**
 * Executes `findControl` to handle find control.
 * @zh 执行 `findControl`，用于查找表单控件。
 * @param field - field parameter (`FieldConfig`) / 字段参数（`FieldConfig`）
 * @returns Result of type `AbstractControl<any, any, any>` / 类型为 `AbstractControl<any, any, any>` 的返回值
 */
export function findControl(field: FieldConfig): AbstractControl {
  if (field.formControl) {
    return field.formControl;
  }
  if (field['shareFormControl'] === false) {
    return null;
  }
  let form ;
  if(field.parent){
    form= field.parent.formControl as FormGroup;
  }else if(field.form){
    form= field.form as FormGroup;
  }
  return form ? form.get(getKeyPath(field)) : null;
}

/**
 * Executes `registerControl` to handle register control.
 * @zh 执行 `registerControl`，用于注册表单控件。
 * @param field - field parameter (`FieldConfigCache`) / 字段参数（`FieldConfigCache`）
 * @param control - control parameter (`any`) / 表单控件参数（`any`）
 * @param emitEvent - emit event parameter (`boolean`) / 发出事件参数（`boolean`）
 */
export function registerControl(field: FieldConfigCache, control?, emitEvent = false) {
  control = control || field.formControl;
  if (!control['_fields']) {
    defineHiddenProp(control, '_fields', []);
  }
  if (control['_fields'].indexOf(field) === -1) {
    control['_fields'].push(field);
  }
  if (!field.formControl && control) {
    defineHiddenProp(field, 'formControl', control);
    field.disabled = !!field.disabled;
    const disabledObserver = observe(field, [ 'disabled'], ({ firstChange, currentValue }) => {
      if (!firstChange) {
        currentValue ? field.formControl.disable() : field.formControl.enable();
      }
    });
    if (control.registerOnDisabledChange) {
      control.registerOnDisabledChange(disabledObserver.setValue);
    }
  }
  if (!field.form || !field.name) {
    return;
  }
  let form = field.form;
  const paths = getKeyPath(field);
  const value = getFieldValue(field);
  if (!(isNil(control.value) && isNil(value)) && control.value !== value && control instanceof FormControl) {
    control.patchValue(value, { emitEvent: false });
  }
  for (let i = 0; i < paths.length - 1; i++) {
    const path = paths[i];
    if (!form.get([path])) {
      updateControl(form, { emitEvent }, () => (form as FormGroup).setControl(path, new FormGroup({})));
    }
    form = <FormGroup>form.get([path]);
  }
  const key = paths[paths.length - 1];
  if (!field._hide && form.get([key]) !== control) {
    updateControl(form, { emitEvent }, () => (form as FormGroup).setControl(key, control));
  }
}
/**
 * Executes `updateValidity` to handle update validity.
 * @zh 执行 `updateValidity`，用于更新Validity。
 * @param c - c parameter (`AbstractControl<any, any, any>`) / c参数（`AbstractControl<any, any, any>`）
 */
export function updateValidity(c: AbstractControl) {
  const status = c.status;
  c.updateValueAndValidity({ emitEvent: false });
  if (status !== c.status) {
    (c.statusChanges as EventEmitter<string>).emit(c.status);
  }
}
/**
 * Executes `updateControl` to handle update control.
 * @zh 执行 `updateControl`，用于更新表单控件。
 * @param form - form parameter (`FormGroup<any> | FormArray<any>`) / 表单参数（`FormGroup<any> | FormArray<any>`）
 * @param opts - opts parameter (`{ emitEvent: boolean; }`) / 选项列表参数（`{ emitEvent: boolean; }`）
 * @param action - action parameter (`Function`) / 动作参数（`Function`）
 */
function updateControl(form: FormGroup | FormArray, opts: { emitEvent: boolean }, action: Function) {
  if (form instanceof FormGroup && !form['__patchForEachChild']) {
    defineHiddenProp(form, '__patchForEachChild', true);
    (form as unknown as { _forEachChild? })._forEachChild = (cb: Function) => {
      Object.keys(form.controls).forEach((k) => form.controls[k] && cb(form.controls[k], k));
    };
  }
  const updateValueAndValidity = form.updateValueAndValidity.bind(form);
  if (opts.emitEvent === false) {
    form.updateValueAndValidity = (opts) => {
      updateValueAndValidity({ ...(opts || {}), emitEvent: false });
    };
  }
  action();
  if (opts.emitEvent === false) {
    form.updateValueAndValidity = updateValueAndValidity;
  }
}

/**
 * Executes `clearControl` to handle clear control.
 * @zh 执行 `clearControl`，用于清空表单控件。
 * @param form - form parameter (`AbstractControl<any, any, any>`) / 表单参数（`AbstractControl<any, any, any>`）
 */
export function clearControl(form: AbstractControl) {
  form['_fields'] && delete form['_fields'];
  form.setValidators(null);
  form.setAsyncValidators(null);
  if (form instanceof FormGroup || form instanceof FormArray) {
    Object.keys(form.controls).forEach((k) => clearControl(form.controls[k]));
  }
}
