/**
 * @fileoverview Module `src/core/form/extensions/field-form/field-form.ts` providing field form definitions and implementation.
 * @zh 模块文件 `src/core/form/extensions/field-form/field-form.ts`，提供字段表单相关的定义与实现。
 */

import {
  FormGroup,
  FormControl,
  AbstractControlOptions,
  Validators,
  ValidatorFn,
  AsyncValidatorFn,
} from '@angular/forms';
import { FormExtension, FieldConfigCache } from '../../models';
import { getFieldValue, defineHiddenProp } from '../../utils';
import { registerControl, findControl, updateValidity as updateControlValidity } from './utils';
import { of } from 'rxjs';

/**
 * Class `FieldFormExtension` encapsulating field form extension data structures and logic in `src/core/form/extensions/field-form`.
 * @zh 类 `FieldFormExtension`，封装 `src/core/form/extensions/field-form` 中的字段表单Extension数据结构与处理逻辑。
 */
export class FieldFormExtension implements FormExtension {
  /**
   * Property `root` (`FieldConfigCache`) storing root.
   * @zh 属性 `root`（类型：`FieldConfigCache`），用于存储或配置根节点。
   */
  private root: FieldConfigCache;

  /**
   * Executes `prePopulate` to handle pre populate.
   * @zh 执行 `prePopulate`，用于prePopulate。
   * @param field - field parameter (`FieldConfigCache`) / 字段参数（`FieldConfigCache`）
   */
  prePopulate(field: FieldConfigCache) {
    if (!this.root) {
      this.root = field;
    }
    if (field.parent) {
      Object.defineProperty(field, 'form', {
        get: () => field.parent.formControl,
        configurable: true,
      });
    }
  }
  /**
   * Executes `onPopulate` to handle on populate.
   * @zh 执行 `onPopulate`，用于当Populate。
   * @param field - field parameter (`FieldConfigCache`) / 字段参数（`FieldConfigCache`）
   */
  onPopulate(field: FieldConfigCache) {
    if (field.hasOwnProperty('fieldGroup') && !field.name) {
      defineHiddenProp(field, 'formControl', field.form);
    } else {
      this.addFormControl(field);
    }
  }
  /**
   * Executes `postPopulate` to handle post populate.
   * @zh 执行 `postPopulate`，用于提交Populate。
   * @param field - field parameter (`FieldConfigCache`) / 字段参数（`FieldConfigCache`）
   */
  postPopulate(field: FieldConfigCache) {
    if (this.root !== field) {
      return;
    }
    this.root = null;
    const fieldsToUpdate = this.setValidators(field);
    if (fieldsToUpdate.length === 0) {
      return;
    }
    if (fieldsToUpdate.length === 1) {
      fieldsToUpdate[0].formControl.updateValueAndValidity();
    } else {
      (field.form as unknown as { _updateTreeValidity? })._updateTreeValidity();
    }
  }
  /**
   * Executes `addFormControl` to handle add form control.
   * @zh 执行 `addFormControl`，用于添加表单表单控件。
   * @param field - field parameter (`FieldConfigCache`) / 字段参数（`FieldConfigCache`）
   */
  private addFormControl(field: FieldConfigCache) {
    let control = findControl(field);
    if (!control) {
      const controlOptions: AbstractControlOptions = { updateOn: field.modelOptions.updateOn };
      if (field.fieldGroup) {
        control = new FormGroup({}, controlOptions);
      } else {
        const value = field.name ? getFieldValue(field) : field.defaultValue;
        control = new FormControl({ value, disabled: false }, controlOptions);
      }
    }
    registerControl(field, control);
  }

  /**
   * Executes `setValidators` to handle set validators.
   * @zh 执行 `setValidators`，用于集合校验器列表。
   * @param field - field parameter (`FieldConfigCache`) / 字段参数（`FieldConfigCache`）
   */
  private setValidators(field: FieldConfigCache) {
    let updateValidity = false;
    if (field.name || !field.parent || (!field.name && !field.fieldGroup)) {
      const { formControl: c } = field;
      const disabled = field ? field.disabled : false;
      if (disabled && c.enabled) {
        c.disable({ emitEvent: false, onlySelf: true });
        if (!c.parent) {
          updateControlValidity(c);
        } else {
          updateValidity = true;
        }
      }
      if (null === c.validator || null === c.asyncValidator) {
        c.setValidators(() => {
          const v = Validators.compose(this.mergeValidators<ValidatorFn>(field, '_validators'));
          return v ? v(c) : null;
        });
        c.setAsyncValidators(() => {
          const v = Validators.composeAsync(this.mergeValidators<AsyncValidatorFn>(field, '_asyncValidators'));
          return v ? v(c) : of(null);
        });
        if (!c.parent) {
          updateControlValidity(c);
        } else {
          updateValidity = true;
        }
      }
    }
    const fieldsToUpdate = updateValidity ? [field] : [];
    (field.fieldGroup || []).forEach((f) => {
      if (f) {
        const childrenToUpdate = this.setValidators(f);
        if (!updateValidity) {
          fieldsToUpdate.push(...childrenToUpdate);
        }
      }
    });
    return fieldsToUpdate;
  }

  /**
   * Executes `mergeValidators` to handle merge validators.
   * @zh 执行 `mergeValidators`，用于合并校验器列表。
   * @param field - field parameter (`FieldConfigCache`) / 字段参数（`FieldConfigCache`）
   * @param type - type parameter (`'_validators' | '_asyncValidators'`) / 类型参数（`'_validators' | '_asyncValidators'`）
   * @returns Result of type `T[]` / 类型为 `T[]` 的返回值
   */
  private mergeValidators<T>(field: FieldConfigCache, type: '_validators' | '_asyncValidators'): T[] {
    const validators = [];
    const c = field.formControl;
    if (c && c['_fields'] && c['_fields'].length > 1) {
      c['_fields']
        .filter((f: FieldConfigCache) => !f._hide)
        .forEach((f: FieldConfigCache) => validators.push(...f[type]));
    } else {
      validators.push(...field[type]);
    }
    if (field.fieldGroup) {
      field.fieldGroup
        .filter((f) => f && !f.name && f.fieldGroup)
        .forEach((f) => validators.push(...this.mergeValidators(f, type)));
    }
    return validators;
  }
}
