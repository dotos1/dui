import { FormArray } from '@angular/forms';
import { FieldType } from './field.type';
import { clone, assignFieldValue, getFieldValue} from '../utils';
import { FieldConfig, FormExtension  } from '../models';
import { registerControl, unregisterControl, findControl } from '../extensions/field-form/utils';
import { DuiBase } from '@dotos/dui/base';
import * as _ from 'lodash';

export abstract class FieldArrayType<F extends FieldConfig = FieldConfig> extends FieldType<F> implements FormExtension {

  override get formControl() {
    return this.field.formControl as FormArray;
  }

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

  reset(name, field?: any) {
    let fieldArray = this.field.fieldArray.fieldGroup;
    let fld = _.filter(fieldArray, (f) => {
      return f.name == 'gridIndex';
    })[0];
    DuiBase.apply(fld, field);
    (<any>this.option)._buildForm(true);
  }

  add(i?: number, initialModel?: any, { markAsDirty } = { markAsDirty: true }) {
    i = i == null ? this.field.fieldGroup.length : i;
    if (!this.model) {
      assignFieldValue(this.field, []);
    }
    this.model.splice(i, 0, initialModel ? clone(initialModel) : undefined);
    this.build();
    markAsDirty && this.formControl.markAsDirty();
  }

  remove(i: number, { markAsDirty } = { markAsDirty: true }) {
    this.model.splice(i, 1);
    unregisterControl(this.field.fieldGroup[i], true);
    this.field.fieldGroup.splice(i, 1);
    this.field.fieldGroup.forEach((f, name) => (f.name = `${name}`));
    this.build();
    markAsDirty && this.formControl.markAsDirty();
  }
  public build() {
    this.option.build(this.field);
    this.option.fieldChanges.next({
      field: this.field,
      value: getFieldValue(this.field),
      type: 'valueChanges',
    });
  }
}
