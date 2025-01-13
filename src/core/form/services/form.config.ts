import { Injectable, InjectionToken, ComponentRef } from '@angular/core';
import { DuiBase } from '@dotos/dui/base';
import { FieldType } from '../template/field.type';
import { reverseDeepMerge , defineHiddenProp} from './../utils';
import {
  FieldConfig,
  FieldConfigCache,
  ConfigOption,
  TypeOption,
  ValidatorOption,
  WrapperOption,
  FormExtension,
  ValidationMessageOption,
} from '../models';

export const FORM_CONFIG = new InjectionToken<FormConfig>('FORM_CONFIG');
@Injectable({ providedIn: 'root' })
export class FormConfig {
  types: { [name: string]: TypeOption } = {};
  validators: { [name: string]: ValidatorOption } = {};
  wrappers: { [name: string]: WrapperOption } = {};
  messages: { [name: string]: ValidationMessageOption['message'] } = {};
  extras: ConfigOption['extras'] = {
    checkExpressionOn: 'changeDetectionCheck',
    lazyRender: false,
    showError(field: FieldType) {
      return (
        field.formControl &&
        field.formControl.invalid &&
        (field.formControl.touched ||
          (field.option.parentForm && field.option.parentForm.submitted) ||
          !!(field.field.validation && field.field.validation.show))
      );
    },
  };
  extensions: { [name: string]: FormExtension } = {};

  addConfig(config: ConfigOption) {
    if (config.types) {
      config.types.forEach((type) => this.setType(type));
    }
    if (config.validators) {
      config.validators.forEach((validator) => this.setValidator(validator));
    }
    if (config.wrappers) {
      config.wrappers.forEach((wrapper) => this.setWrapper(wrapper));
    }
    if (config.validationMessages) {
      config.validationMessages.forEach((validation) => this.addValidatorMessage(validation.name, validation.message));
    }
    if (config.extensions) {
      config.extensions.forEach((c) => (this.extensions[c.name] = c.extension));
    }
    if (config.extras) {
      this.extras = { ...this.extras, ...config.extras };
    }
  }

  setType(option: TypeOption | TypeOption[]) {
    if (Array.isArray(option)) {
      option.forEach((option) => this.setType(option));
    } else {
      if (!this.types[option.name]) {
        this.types[option.name] = <TypeOption>{ name: option.name };
      }
      ['component', 'extends', 'defaultOptions'].forEach((prop) => {
        if (option.hasOwnProperty(prop)) {
          this.types[option.name][prop] = option[prop];
        }
      });
      if (option.wrappers) {
        option.wrappers.forEach((wrapper) => this.setTypeWrapper(option.name, wrapper));
      }
    }
  }

  getType(name: string): TypeOption {
    if (!this.types[name]) {
      const component = DuiBase.getFieldByType(name);
      this.types[name] = <TypeOption>{};
      this.types[name].name = name;
      this.types[name].component = component;
      this.types[name].extends = '';
      this.types[name].defaultOptions = {};
    }
    this.mergeExtendedType(name);
    return this.types[name];
  }

  getMergedField(field: FieldConfig = {}): any {
    const type = this.getType(field.xtype);
    if (type.defaultOptions) {
      reverseDeepMerge(field, type.defaultOptions);
    }

    const extendDefaults = type.extends && this.getType(type.extends).defaultOptions;
    if (extendDefaults) {
      reverseDeepMerge(field, extendDefaults);
    }

    if (field && field.optionsTypes) {
      field.optionsTypes.forEach((option) => {
        const defaultOptions = this.getType(option).defaultOptions;
        if (defaultOptions) {
          reverseDeepMerge(field, defaultOptions);
        }
      });
    }

    const componentRef = this.resolveFieldTypeRef(field);
    if (componentRef && componentRef.instance && componentRef.instance.defaultOptions) {
      reverseDeepMerge(field, componentRef.instance.defaultOptions);
    }

    if (!field.wrappers && type.wrappers) {
      field.wrappers = [...type.wrappers];
    }
  }

  /** @internal */
  resolveFieldTypeRef(field: FieldConfigCache = {}): ComponentRef<FieldType> {
    if (!field.xtype) {
      return null;
    }

    const type = this.getType(field.xtype);
    if (!type.component || type['_componentRef']) {
      return type['_componentRef'];
    }

    const { _resolver, _injector } = field.option;
    if (!_resolver || !_injector) {
      return null;
    }
    const componentRef = _resolver.resolveComponentFactory<FieldType>(type.component).create(_injector);
    defineHiddenProp(type, '_componentRef', componentRef);
    componentRef.destroy();
    return type['_componentRef'];
  }

  setWrapper(option: WrapperOption) {
    this.wrappers[option.name] = option;
    if (option.types) {
      option.types.forEach((type) => {
        this.setTypeWrapper(type, option.name);
      });
    }
  }

  getWrapper(name: string): WrapperOption {
    if (!this.wrappers[name]) {
      throw new Error(`[Form Error] There is no wrapper by the name of "${name}"`);
    }
    return this.wrappers[name];
  }

  setTypeWrapper(type: string, name: string) {
    if (!this.types[type]) {
      this.types[type] = <TypeOption>{};
    }
    if (!this.types[type].wrappers) {
      this.types[type].wrappers = [];
    }
    if (this.types[type].wrappers.indexOf(name) === -1) {
      this.types[type].wrappers.push(name);
    }
  }

  setValidator(option: ValidatorOption) {
    this.validators[option.name] = option;
  }

  getValidator(name: string): ValidatorOption {
    if (!this.validators[name]) {
      throw new Error(`[Form Error] There is no validator by the name of "${name}"`);
    }
    return this.validators[name];
  }

  addValidatorMessage(name: string, message: ValidationMessageOption['message']) {
    this.messages[name] = message;
  }


  getValidatorMessage(name: string) {
    return this.messages[name];
  }


  private mergeExtendedType(name: string) {
    if (!this.types[name].extends) {
      return;
    }
    const extendedType = this.getType(this.types[name].extends);
    if (!this.types[name].component) {
      this.types[name].component = extendedType.component;
    }
    if (!this.types[name].wrappers) {
      this.types[name].wrappers = extendedType.wrappers;
    }
  }
}
