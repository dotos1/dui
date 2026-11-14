/**
 * @fileoverview Module `src/core/form/services/form.config.ts` providing form config definitions and implementation.
 * @zh 模块文件 `src/core/form/services/form.config.ts`，提供表单配置相关的定义与实现。
 */

import { createComponent, EnvironmentInjector, Injectable, InjectionToken, ComponentRef } from '@angular/core';
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

/**
 * Angular dependency-injection token `FORM_CONFIG` for providing form config.
 * @zh Angular 依赖注入令牌 `FORM_CONFIG`，用于提供与注入表单配置。
 */
export const FORM_CONFIG = new InjectionToken<FormConfig>('FORM_CONFIG');
/**
 * Injectable Angular service `FormConfig` managing form config state and operations in `src/core/form/services`.
 * @zh 可注入的 Angular 服务 `FormConfig`，管理 `src/core/form/services` 中的表单配置状态与业务操作。
 */
@Injectable({ providedIn: 'root' })
export class FormConfig {
  /**
   * Property `types` (`{ [name: string]: TypeOption; }`) storing types (default: `{}`).
   * @zh 属性 `types`（类型：`{ [name: string]: TypeOption; }`），用于存储或配置类型列表（默认值：`{}`）。
   */
  types: { [name: string]: TypeOption } = {};
  /**
   * Property `validators` (`{ [name: string]: ValidatorOption; }`) storing validators (default: `{}`).
   * @zh 属性 `validators`（类型：`{ [name: string]: ValidatorOption; }`），用于存储或配置校验器列表（默认值：`{}`）。
   */
  validators: { [name: string]: ValidatorOption } = {};
  /**
   * Property `wrappers` (`{ [name: string]: WrapperOption; }`) storing wrappers (default: `{}`).
   * @zh 属性 `wrappers`（类型：`{ [name: string]: WrapperOption; }`），用于存储或配置包装器列表（默认值：`{}`）。
   */
  wrappers: { [name: string]: WrapperOption } = {};
  /**
   * Property `messages` (`{ [name: string]: any; }`) storing messages (default: `{}`).
   * @zh 属性 `messages`（类型：`{ [name: string]: any; }`），用于存储或配置消息列表（默认值：`{}`）。
   */
  messages: { [name: string]: ValidationMessageOption['message'] } = {};
  /**
   * Property `extras` (`{…}`) storing extras.
   * @zh 属性 `extras`（类型：`{…}`），用于存储或配置extras。
   */
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
  /**
   * Property `extensions` (`{ [name: string]: FormExtension; }`) storing extensions (default: `{}`).
   * @zh 属性 `extensions`（类型：`{ [name: string]: FormExtension; }`），用于存储或配置extensions（默认值：`{}`）。
   */
  extensions: { [name: string]: FormExtension } = {};

  /**
   * Executes `addConfig` to handle add config.
   * @zh 执行 `addConfig`，用于添加配置。
   * @param config - config parameter (`ConfigOption`) / 配置参数（`ConfigOption`）
   */
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

  /**
   * Executes `setType` to handle set type.
   * @zh 执行 `setType`，用于集合类型。
   * @param option - option parameter (`TypeOption | TypeOption[]`) / 选项参数（`TypeOption | TypeOption[]`）
   */
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

  /**
   * Executes `getType` to handle get type.
   * @zh 执行 `getType`，用于获取类型。
   * @param name - name parameter (`string`) / 名称参数（`string`）
   * @returns Result of type `TypeOption` / 类型为 `TypeOption` 的返回值
   */
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

  /**
   * Executes `getMergedField` to handle get merged field.
   * @zh 执行 `getMergedField`，用于获取已合并字段。
   * @param field - field parameter (`FieldConfig`) / 字段参数（`FieldConfig`）
   * @returns Result of type `void` / 类型为 `void` 的返回值
   */
  getMergedField(field: FieldConfig = {}) {
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

  /**
   * Executes `resolveFieldTypeRef` to handle resolve field type ref.
   * @internal
   * @zh 执行 `resolveFieldTypeRef`，用于解析字段类型引用。
   */
  resolveFieldTypeRef(field: FieldConfigCache = {}): ComponentRef<FieldType> {
    if (!field.xtype) {
      return null;
    }

    const type = this.getType(field.xtype);
    if (!type.component || type['_componentRef']) {
      return type['_componentRef'];
    }

    const { _injector } = field.option;
    if (!_injector) {
      return null;
    }
    const componentRef = createComponent<FieldType>(type.component, {
      environmentInjector: _injector.get(EnvironmentInjector),
      elementInjector: _injector,
    });
    defineHiddenProp(type, '_componentRef', componentRef);
    componentRef.destroy();
    return type['_componentRef'];
  }

  /**
   * Executes `setWrapper` to handle set wrapper.
   * @zh 执行 `setWrapper`，用于集合包装器。
   * @param option - option parameter (`WrapperOption`) / 选项参数（`WrapperOption`）
   */
  setWrapper(option: WrapperOption) {
    this.wrappers[option.name] = option;
    if (option.types) {
      option.types.forEach((type) => {
        this.setTypeWrapper(type, option.name);
      });
    }
  }

  /**
   * Executes `getWrapper` to handle get wrapper.
   * @zh 执行 `getWrapper`，用于获取包装器。
   * @param name - name parameter (`string`) / 名称参数（`string`）
   * @returns Result of type `WrapperOption` / 类型为 `WrapperOption` 的返回值
   */
  getWrapper(name: string): WrapperOption {
    if (!this.wrappers[name]) {
      throw new Error(`[Form Error] There is no wrapper by the name of "${name}"`);
    }
    return this.wrappers[name];
  }

  /**
   * Executes `setTypeWrapper` to handle set type wrapper.
   * @zh 执行 `setTypeWrapper`，用于集合类型包装器。
   * @param type - type parameter (`string`) / 类型参数（`string`）
   * @param name - name parameter (`string`) / 名称参数（`string`）
   */
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

  /**
   * Executes `setValidator` to handle set validator.
   * @zh 执行 `setValidator`，用于集合校验器。
   * @param option - option parameter (`ValidatorOption`) / 选项参数（`ValidatorOption`）
   */
  setValidator(option: ValidatorOption) {
    this.validators[option.name] = option;
  }

  /**
   * Executes `getValidator` to handle get validator.
   * @zh 执行 `getValidator`，用于获取校验器。
   * @param name - name parameter (`string`) / 名称参数（`string`）
   * @returns Result of type `ValidatorOption` / 类型为 `ValidatorOption` 的返回值
   */
  getValidator(name: string): ValidatorOption {
    if (!this.validators[name]) {
      throw new Error(`[Form Error] There is no validator by the name of "${name}"`);
    }
    return this.validators[name];
  }

  /**
   * Executes `addValidatorMessage` to handle add validator message.
   * @zh 执行 `addValidatorMessage`，用于添加校验器消息。
   * @param name - name parameter (`string`) / 名称参数（`string`）
   * @param message - message parameter (`any`) / 消息参数（`any`）
   */
  addValidatorMessage(name: string, message: ValidationMessageOption['message']) {
    this.messages[name] = message;
  }


  /**
   * Executes `getValidatorMessage` to handle get validator message.
   * @zh 执行 `getValidatorMessage`，用于获取校验器消息。
   * @param name - name parameter (`string`) / 名称参数（`string`）
   */
  getValidatorMessage(name: string) {
    return this.messages[name];
  }


  /**
   * Executes `mergeExtendedType` to handle merge extended type.
   * @zh 执行 `mergeExtendedType`，用于合并Extended类型。
   * @param name - name parameter (`string`) / 名称参数（`string`）
   */
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
