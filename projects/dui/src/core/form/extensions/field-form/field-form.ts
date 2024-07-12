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

export class FieldFormExtension implements FormExtension {
  private root: FieldConfigCache;

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
  onPopulate(field: FieldConfigCache) {
    if (field.hasOwnProperty('fieldGroup') && !field.name) {
      defineHiddenProp(field, 'formControl', field.form);
    } else {
      this.addFormControl(field);
    }
  }
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
      (field.form as any)._updateTreeValidity();
    }
  }
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

  private mergeValidators<T>(field: FieldConfigCache, type: '_validators' | '_asyncValidators'): T[] {
    const validators: any = [];
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
