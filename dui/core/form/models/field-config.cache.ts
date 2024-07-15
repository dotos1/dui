import { ComponentFactoryResolver, ComponentRef, Injector } from '@angular/core';
import { AsyncValidatorFn, ValidatorFn, FormArray, FormGroup, AbstractControl } from '@angular/forms';
import { FieldType } from '../template/field.type';
import { FieldConfig, FormOptions } from './field.config';

export interface FieldConfigCache extends FieldConfig {
  form?: FormGroup | FormArray;
  model?: any;
  formControl?: AbstractControl;
  parent?: FieldConfigCache;
  option?: FormOptionsCache;
  _expressions?: { [property: string]: (ingoreCache: boolean) => boolean };
  _hide?: boolean;
  _validators?: ValidatorFn[];
  _asyncValidators?: AsyncValidatorFn[];
  _componentRefs?: ComponentRef<FieldType>[];
  _keyPath?: {
    key: FieldConfig['name'];
    path: string[];
  };
}

export interface FormOptionsCache extends FormOptions {
  checkExpressions?: (field: FieldConfig, ingoreCache?: boolean) => void;
  _resolver?: ComponentFactoryResolver;
  _injector?: Injector;
  _hiddenFieldsForCheck?: FieldConfigCache[];
  _initialModel?: any;

  _buildForm?: () => void;

  _checkField?: (field: FieldConfig, ingoreCache?: boolean) => void;

  _markForCheck?: (field: FieldConfig) => void;
}
