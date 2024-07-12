import { Injectable, ComponentFactoryResolver, Injector , Optional } from '@angular/core';
import { FormGroup, FormArray, FormGroupDirective } from '@angular/forms';
import { FormConfig } from './form.config';
import {
  FieldConfig, FormOptions, FieldConfigCache
} from '../models';
import { defineHiddenProp, reduceFormUpdateValidityCalls, observe } from '../utils';
@Injectable({ providedIn: 'root' })
export class FormBuilder {
  constructor(
    private config: FormConfig,
    private resolver: ComponentFactoryResolver,
    private injector: Injector,
    @Optional() private parentForm: FormGroupDirective,
  ) { }

  buildForm(form: FormGroup | FormArray, fieldGroup: FieldConfig[] = [], model: any, option: FormOptions) {
    this.build({ fieldGroup, model, form, option });
  }

  build(field: FieldConfig) {
    if (!this.config.extensions['core']) {
      throw new Error('NgxFormly: missing `forRoot()` call. use `forRoot()` when registering the `FormlyModule`.');
    }
    if (!field.parent) {
      this._setOptions(field);
      reduceFormUpdateValidityCalls(field.form, () => this._build(field));
      const option = (field as FieldConfigCache).option;
      option.checkExpressions && option.checkExpressions(field, true);
      option.detectChanges && option.detectChanges(field);
    } else {
      this._build(field);
    }
  }

  private _build(field: FieldConfigCache) {
    if (!field) {
      return;
    }
    this.getExtensions().forEach((extension) => extension.prePopulate && extension.prePopulate(field));
    this.getExtensions().forEach((extension) => extension.onPopulate && extension.onPopulate(field));
    if (field.fieldGroup) {
      field.fieldGroup.forEach((f) => this._build(f));
    }
    this.getExtensions().forEach((extension) => extension.postPopulate && extension.postPopulate(field));
  }

  private getExtensions() {
    return Object.keys(this.config.extensions).map((name) => this.config.extensions[name]);
  }

  private _setOptions(field: FieldConfigCache) {
    field.form = field.form || new FormGroup({});
    field.model = field.model || {};
    field.option = field.option || {};
    const option = field.option;

    if (!option._resolver) {
      defineHiddenProp(option, '_resolver', this.resolver);
    }

    if (!option._injector) {
      defineHiddenProp(option, '_injector', this.injector);
    }

    if (!option.build) {
      option._buildForm = () => {
        this.build(field);
      };
      option.build = (f: FieldConfig) => {
        this.build(f);
        return f;
      };
    }
    if (!option.parentForm && this.parentForm) {
      defineHiddenProp(option, 'parentForm', this.parentForm);
      observe(option, ['parentForm', 'submitted'], ({ firstChange }) => {
        if (!firstChange) {
          option.checkExpressions(field);
          option.detectChanges(field);
        }
      });
    }
  }
}
