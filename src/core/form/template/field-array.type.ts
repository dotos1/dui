/**
 * @fileoverview Module `src/core/form/template/field-array.type.ts` providing field array type definitions and implementation.
 * @zh 模块文件 `src/core/form/template/field-array.type.ts`，提供字段数组类型相关的定义与实现。
 */

import { FormArray } from '@angular/forms';
import { DuiBase } from '@dotos1/dui/base';
import {filter}  from 'lodash-es';
import { findControl, registerControl, unregisterControl } from '../extensions/field-form/utils';
import { FieldConfig, FormExtension } from '../models';
import { assignFieldValue, clone, getFieldValue } from '../utils';
import { FieldType } from './field.type';

/**
 * Class `FieldArrayType` encapsulating field array type data structures and logic in `src/core/form/template`.
 * @zh 类 `FieldArrayType`，封装 `src/core/form/template` 中的字段数组类型数据结构与处理逻辑。
 */
export abstract class FieldArrayType<F extends FieldConfig = FieldConfig> extends FieldType<F> implements FormExtension {

  /**
   * Gets the current form control (`formControl: any`).
   * @zh 获取当前表单表单控件（`formControl: any`）。
   */
  override get formControl() {
    return this.field.formControl as FormArray;
  }

  /**
   * Executes `onPopulate` to handle on populate.
   * @zh 执行 `onPopulate`，用于当Populate。
   * @param field - field parameter (`FieldConfig`) / 字段参数（`FieldConfig`）
   */
  onPopulate(field: FieldConfig) {
    if (!field.formControl && field.name) {
      const control = findControl(field);
      registerControl(field, control ? control : new FormArray([], { updateOn: field.modelOptions.updateOn }));
    }
    field.fieldGroup = field.fieldGroup || [];
    const length = field.model ? field.model.length : 0;
    if (field.fieldGroup.length > length) {
      for (let i = field.fieldGroup.length - 1; i >= length; --i) {
        unregisterControl(field.fieldGroup[i]);
        field.fieldGroup.splice(i, 1);
      }
    }
    for (let i = field.fieldGroup.length; i < length; i++) {
      const f = { ...clone(field.fieldArray), name: `${i}` };
      field.fieldGroup.push(f);
    }
  }

  /**
   * Executes `reset` to handle reset.
   * @zh 执行 `reset`，用于重置。
   * @param name - name parameter (`any`) / 名称参数（`any`）
   * @param field - field parameter (`any`) / 字段参数（`any`）
   */
  reset(name, field?) {
    let fieldArray = this.field.fieldArray.fieldGroup;
    let fld = filter(fieldArray, (f) => {
      return f.name == 'gridIndex';
    })[0];
    DuiBase.apply(fld, field);
    (<{ _buildForm? }><unknown>this.option)._buildForm(true);
  }

  /**
   * Executes `add` to handle add.
   * @zh 执行 `add`，用于添加。
   * @param i - i parameter (`number`) / i参数（`number`）
   * @param initialModel - initial model parameter (`any`) / 初始模型参数（`any`）
   * @param options - { mark as dirty } parameter (`any`) / {标记As是否已修改}参数（`any`）
   */
  add(i?: number, initialModel?, { markAsDirty } = { markAsDirty: true }) {
    i = i == null ? this.field.fieldGroup.length : i;
    if (!this.model) {
      assignFieldValue(this.field, []);
    }
    this.model.splice(i, 0, initialModel ? clone(initialModel) : undefined);
    this.build();
    markAsDirty && this.formControl.markAsDirty();
  }

  /**
   * Executes `remove` to handle remove.
   * @zh 执行 `remove`，用于移除。
   * @param i - i parameter (`number`) / i参数（`number`）
   * @param options - { mark as dirty } parameter (`any`) / {标记As是否已修改}参数（`any`）
   */
  remove(i: number, { markAsDirty } = { markAsDirty: true }) {
    this.model.splice(i, 1);
    unregisterControl(this.field.fieldGroup[i], true);
    this.field.fieldGroup.splice(i, 1);
    this.field.fieldGroup.forEach((f, name) => (f.name = `${name}`));
    this.build();
    markAsDirty && this.formControl.markAsDirty();
  }
  /**
   * Executes `build` to handle build.
   * @zh 执行 `build`，用于构建。
   */
  public build() {
    this.option.build(this.field);
    this.option.fieldChanges.next({
      field: this.field,
      value: getFieldValue(this.field),
      type: 'valueChanges',
    });
  }
}
