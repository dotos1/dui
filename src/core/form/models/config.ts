/**
 * @fileoverview Module `src/core/form/models/config.ts` providing config definitions and implementation.
 * @zh 模块文件 `src/core/form/models/config.ts`，提供配置相关的定义与实现。
 */

import { ValidationErrors, AbstractControl } from '@angular/forms';
import { FieldType } from '../template/field.type';
import { FieldConfig } from './field.config';
import { Observable } from 'rxjs';

/**
 * Interface `FormExtension` defining the contract and properties for form extension.
 * @zh 接口 `FormExtension`，定义表单Extension的数据结构契约与属性规范。
 */
export interface FormExtension {
  /**
   * Executes `prePopulate` to handle pre populate.
   * @zh 执行 `prePopulate`，用于prePopulate。
   * @param field - field parameter (`FieldConfig`) / 字段参数（`FieldConfig`）
   */
  prePopulate?(field: FieldConfig): void;
  /**
   * Executes `onPopulate` to handle on populate.
   * @zh 执行 `onPopulate`，用于当Populate。
   * @param field - field parameter (`FieldConfig`) / 字段参数（`FieldConfig`）
   */
  onPopulate?(field: FieldConfig): void;
  /**
   * Executes `postPopulate` to handle post populate.
   * @zh 执行 `postPopulate`，用于提交Populate。
   * @param field - field parameter (`FieldConfig`) / 字段参数（`FieldConfig`）
   */
  postPopulate?(field: FieldConfig): void;
}

/**
 * Interface `TypeOption` defining the contract and properties for type option.
 * @zh 接口 `TypeOption`，定义类型选项的数据结构契约与属性规范。
 */
export interface TypeOption {
  /**
   * Property `name` (`string`) storing name.
   * @zh 属性 `name`（类型：`string`），用于存储或配置名称。
   */
  name: string;
  /**
   * Property `component` (`any`) storing component.
   * @zh 属性 `component`（类型：`any`），用于存储或配置组件。
   */
  component?;
  /**
   * Property `wrappers` (`string[]`) storing wrappers.
   * @zh 属性 `wrappers`（类型：`string[]`），用于存储或配置包装器列表。
   */
  wrappers?: string[];
  /**
   * Property `extends` (`string`) storing extends.
   * @zh 属性 `extends`（类型：`string`），用于存储或配置extends。
   */
  extends?: string;
  /**
   * Property `defaultOptions` (`FieldConfig`) storing default options.
   * @zh 属性 `defaultOptions`（类型：`FieldConfig`），用于存储或配置默认配置选项。
   */
  defaultOptions?: FieldConfig;
}

/**
 * Interface `WrapperOption` defining the contract and properties for wrapper option.
 * @zh 接口 `WrapperOption`，定义包装器选项的数据结构契约与属性规范。
 */
export interface WrapperOption {
  /**
   * Property `name` (`string`) storing name.
   * @zh 属性 `name`（类型：`string`），用于存储或配置名称。
   */
  name: string;
  /**
   * Property `component` (`any`) storing component.
   * @zh 属性 `component`（类型：`any`），用于存储或配置组件。
   */
  component;
  /**
   * Property `types` (`string[]`) storing types.
   * @zh 属性 `types`（类型：`string[]`），用于存储或配置类型列表。
   */
  types?: string[];
}

/**
 * Type alias `FieldValidatorFn` representing field validator fn (`( c: AbstractControl, field: FieldConfig, options?: { [id: string]: an...`).
 * @zh 类型别名 `FieldValidatorFn`，表示字段校验器函数（`( c: AbstractControl, field: FieldConfig, options?: { [id: string]: an...`）。
 */
export type FieldValidatorFn = (
  c: AbstractControl,
  field: FieldConfig,
  options?: { [id: string]: unknown },
) => ValidationErrors | null;

/**
 * Interface `ValidatorOption` defining the contract and properties for validator option.
 * @zh 接口 `ValidatorOption`，定义校验器选项的数据结构契约与属性规范。
 */
export interface ValidatorOption {
  /**
   * Property `name` (`string`) storing name.
   * @zh 属性 `name`（类型：`string`），用于存储或配置名称。
   */
  name: string;
  /**
   * Property `validation` (`FieldValidatorFn`) storing validation.
   * @zh 属性 `validation`（类型：`FieldValidatorFn`），用于存储或配置校验。
   */
  validation: FieldValidatorFn;
  /**
   * Property `options` (`{ [id: string]: any }`) storing options.
   * @zh 属性 `options`（类型：`{ [id: string]: any }`），用于存储或配置配置选项。
   */
  options?: { [id: string]: unknown };
}

/**
 * Interface `ExtensionOption` defining the contract and properties for extension option.
 * @zh 接口 `ExtensionOption`，定义Extension选项的数据结构契约与属性规范。
 */
export interface ExtensionOption {
  /**
   * Property `name` (`string`) storing name.
   * @zh 属性 `name`（类型：`string`），用于存储或配置名称。
   */
  name: string;
  /**
   * Property `extension` (`FormExtension`) storing extension.
   * @zh 属性 `extension`（类型：`FormExtension`），用于存储或配置extension。
   */
  extension: FormExtension;
}

/**
 * Interface `ValidationMessageOption` defining the contract and properties for validation message option.
 * @zh 接口 `ValidationMessageOption`，定义校验消息选项的数据结构契约与属性规范。
 */
export interface ValidationMessageOption {
  /**
   * Property `name` (`string`) storing name.
   * @zh 属性 `name`（类型：`string`），用于存储或配置名称。
   */
  name: string;
  /**
   * Property `message` (`string | ((error: any, field: FieldConfig) => string | Observable<stri...`) storing message.
   * @zh 属性 `message`（类型：`string | ((error: any, field: FieldConfig) => string | Observable<stri...`），用于存储或配置消息。
   */
  message;
}

/**
 * Interface `ConfigOption` defining the contract and properties for config option.
 * @zh 接口 `ConfigOption`，定义配置选项的数据结构契约与属性规范。
 */
export interface ConfigOption {
  /**
   * Property `types` (`TypeOption[]`) storing types.
   * @zh 属性 `types`（类型：`TypeOption[]`），用于存储或配置类型列表。
   */
  types?: TypeOption[];
  /**
   * Property `wrappers` (`WrapperOption[]`) storing wrappers.
   * @zh 属性 `wrappers`（类型：`WrapperOption[]`），用于存储或配置包装器列表。
   */
  wrappers?: WrapperOption[];
  /**
   * Property `validators` (`ValidatorOption[]`) storing validators.
   * @zh 属性 `validators`（类型：`ValidatorOption[]`），用于存储或配置校验器列表。
   */
  validators?: ValidatorOption[];
  /**
   * Property `extensions` (`ExtensionOption[]`) storing extensions.
   * @zh 属性 `extensions`（类型：`ExtensionOption[]`），用于存储或配置extensions。
   */
  extensions?: ExtensionOption[];
  /**
   * Property `validationMessages` (`ValidationMessageOption[]`) storing validation messages.
   * @zh 属性 `validationMessages`（类型：`ValidationMessageOption[]`），用于存储或配置校验消息列表。
   */
  validationMessages?: ValidationMessageOption[];
  /**
   * Property `extras` (`{ immutable?: boolean; showError?: (field: FieldType) => boolean; chec...`) storing extras.
   * @zh 属性 `extras`（类型：`{ immutable?: boolean; showError?: (field: FieldType) => boolean; chec...`），用于存储或配置extras。
   */
  extras?: {
    immutable?: boolean;
    showError?: (field: FieldType) => boolean;


    checkExpressionOn?: 'modelChange' | 'changeDetectionCheck';

    lazyRender?: boolean;

    resetFieldOnHide?: boolean;
  };
}
