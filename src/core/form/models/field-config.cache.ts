/**
 * @fileoverview Module `src/core/form/models/field-config.cache.ts` providing field config cache definitions and implementation.
 * @zh 模块文件 `src/core/form/models/field-config.cache.ts`，提供字段配置缓存相关的定义与实现。
 */

import { ComponentRef, Injector } from '@angular/core';
import { AsyncValidatorFn, ValidatorFn, FormArray, FormGroup, AbstractControl } from '@angular/forms';
import { FieldType } from '../template/field.type';
import { FieldConfig, FormOptions } from './field.config';

/**
 * Interface `FieldConfigCache` defining the contract and properties for field config cache.
 * @zh 接口 `FieldConfigCache`，定义字段配置缓存的数据结构契约与属性规范。
 */
export interface FieldConfigCache extends FieldConfig {
  /**
   * Property `form` (`FormGroup<any> | FormArray<any>`) storing form.
   * @zh 属性 `form`（类型：`FormGroup<any> | FormArray<any>`），用于存储或配置表单。
   */
  form?: FormGroup | FormArray;
  /**
   * Property `model` (`any`) storing model.
   * @zh 属性 `model`（类型：`any`），用于存储或配置模型。
   */
  model?;
  /**
   * Property `formControl` (`AbstractControl<any, any>`) storing form control.
   * @zh 属性 `formControl`（类型：`AbstractControl<any, any>`），用于存储或配置表单表单控件。
   */
  formControl?: AbstractControl;
  /**
   * Property `parent` (`FieldConfigCache`) storing parent.
   * @zh 属性 `parent`（类型：`FieldConfigCache`），用于存储或配置父级。
   */
  parent?: FieldConfigCache;
  /**
   * Property `option` (`FormOptionsCache`) storing option.
   * @zh 属性 `option`（类型：`FormOptionsCache`），用于存储或配置选项。
   */
  option?: FormOptionsCache;
  /**
   * Property `_expressions` (`{ [property: string]: (ingoreCache: boolean) => boolean; }`) storing expressions.
   * @zh 属性 `_expressions`（类型：`{ [property: string]: (ingoreCache: boolean) => boolean; }`），用于存储或配置表达式。
   */
  _expressions?: { [property: string]: (ingoreCache: boolean) => boolean };
  /**
   * Property `_hide` (`boolean`) storing hide.
   * @zh 属性 `_hide`（类型：`boolean`），用于存储或配置隐藏。
   */
  _hide?: boolean;
  /**
   * Property `_validators` (`ValidatorFn[]`) storing validators.
   * @zh 属性 `_validators`（类型：`ValidatorFn[]`），用于存储或配置校验器列表。
   */
  _validators?: ValidatorFn[];
  /**
   * Property `_asyncValidators` (`AsyncValidatorFn[]`) storing async validators.
   * @zh 属性 `_asyncValidators`（类型：`AsyncValidatorFn[]`），用于存储或配置async校验器列表。
   */
  _asyncValidators?: AsyncValidatorFn[];
  /**
   * Property `_componentRefs` (`ComponentRef<FieldType<FieldConfig>>[]`) storing component refs.
   * @zh 属性 `_componentRefs`（类型：`ComponentRef<FieldType<FieldConfig>>[]`），用于存储或配置组件引用。
   */
  _componentRefs?: ComponentRef<FieldType>[];
  /**
   * Property `_keyPath` (`{ key: FieldConfig["name"]; path: string[]; }`) storing key path.
   * @zh 属性 `_keyPath`（类型：`{ key: FieldConfig["name"]; path: string[]; }`），用于存储或配置键路径。
   */
  _keyPath?: {
    key: FieldConfig['name'];
    path: string[];
  };
}

/**
 * Interface `FormOptionsCache` defining the contract and properties for form options cache.
 * @zh 接口 `FormOptionsCache`，定义表单配置选项缓存的数据结构契约与属性规范。
 */
export interface FormOptionsCache extends FormOptions {
  /**
   * Property `checkExpressions` (`(field: FieldConfig, ingoreCache?: boolean) => void`) storing check expressions.
   * @zh 属性 `checkExpressions`（类型：`(field: FieldConfig, ingoreCache?: boolean) => void`），用于存储或配置检查表达式。
   */
  checkExpressions?: (field: FieldConfig, ingoreCache?: boolean) => void;
  /**
   * Property `_resolver` (`unknown`) storing legacy resolver placeholder.
   * @zh 属性 `_resolver`（类型：`unknown`），历史兼容占位字段。
   */
  _resolver?: unknown;
  /**
   * Property `_injector` (`Injector`) storing injector.
   * @zh 属性 `_injector`（类型：`Injector`），用于存储或配置注入器。
   */
  _injector?: Injector;
  /**
   * Property `_hiddenFieldsForCheck` (`FieldConfigCache[]`) storing hidden fields for check.
   * @zh 属性 `_hiddenFieldsForCheck`（类型：`FieldConfigCache[]`），用于存储或配置隐藏字段列表用于检查。
   */
  _hiddenFieldsForCheck?: FieldConfigCache[];
  /**
   * Property `_initialModel` (`any`) storing initial model.
   * @zh 属性 `_initialModel`（类型：`any`），用于存储或配置初始模型。
   */
  _initialModel?;

  /**
   * Property `_buildForm` (`() => void`) storing build form.
   * @zh 属性 `_buildForm`（类型：`() => void`），用于存储或配置构建表单。
   */
  _buildForm?: () => void;

  /**
   * Property `_checkField` (`(field: FieldConfig, ingoreCache?: boolean) => void`) storing check field.
   * @zh 属性 `_checkField`（类型：`(field: FieldConfig, ingoreCache?: boolean) => void`），用于存储或配置检查字段。
   */
  _checkField?: (field: FieldConfig, ingoreCache?: boolean) => void;

  /**
   * Property `_markForCheck` (`(field: FieldConfig) => void`) storing mark for check.
   * @zh 属性 `_markForCheck`（类型：`(field: FieldConfig) => void`），用于存储或配置标记用于检查。
   */
  _markForCheck?: (field: FieldConfig) => void;
}
