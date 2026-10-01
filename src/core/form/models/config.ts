import { ValidationErrors, AbstractControl } from '@angular/forms';
import { FieldType } from '../template/field.type';
import { FieldConfig } from './field.config';
import { Observable } from 'rxjs';

export interface FormExtension {
  prePopulate?(field: FieldConfig): void;
  onPopulate?(field: FieldConfig): void;
  postPopulate?(field: FieldConfig): void;
}

export interface TypeOption {
  name: string;
  component?: any;
  wrappers?: string[];
  extends?: string;
  defaultOptions?: FieldConfig;
}

export interface WrapperOption {
  name: string;
  component: any;
  types?: string[];
}

export type FieldValidatorFn = (
  c: AbstractControl,
  field: FieldConfig,
  options?: { [id: string]: any },
) => ValidationErrors | null;

export interface ValidatorOption {
  name: string;
  validation: FieldValidatorFn;
  options?: { [id: string]: any };
}

export interface ExtensionOption {
  name: string;
  extension: FormExtension;
}

export interface ValidationMessageOption {
  name: string;
  message: string | ((error: any, field: FieldConfig) => string | Observable<string>);
}

export interface ConfigOption {
  types?: TypeOption[];
  wrappers?: WrapperOption[];
  validators?: ValidatorOption[];
  extensions?: ExtensionOption[];
  validationMessages?: ValidationMessageOption[];
  extras?: {
    immutable?: boolean;
    showError?: (field: FieldType) => boolean;


    checkExpressionOn?: 'modelChange' | 'changeDetectionCheck';

    lazyRender?: boolean;

    resetFieldOnHide?: boolean;
  };
}
