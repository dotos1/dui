/**
 * @fileoverview Module `src/core/form/models/field.config.ts` providing field config definitions and implementation.
 * @zh 模块文件 `src/core/form/models/field.config.ts`，提供字段配置相关的定义与实现。
 */

import { FormGroup, FormArray, AbstractControl, FormGroupDirective } from '@angular/forms';
import { Subject, Observable } from 'rxjs';
import { FieldType } from '../template/field.type';
import { ValidationMessageOption } from './config';

/**
 * Interface `FieldConfig` defining the contract and properties for field config.
 * @zh 接口 `FieldConfig`，定义字段配置的数据结构契约与属性规范。
 */
export interface FieldConfig {

  /**
   * This should be a formly-field type added either by you or a plugin. More information over at Creating Formly Fields.

   * @zh 属性 `type`（类型：`string`），用于存储或配置类型。
   */
  type?: string;

  /**
   * Use `defaultValue` to initialize it the model. If this is provided and the value of the model at compile-time is undefined, then the value of the model will be assigned to `defaultValue`.

   * @zh 属性 `defaultValue`（类型：`any`），用于存储或配置默认值。
   */
  defaultValue?;

  /**
   * This allows you to specify the `id` of your field. Note, the `id` is generated if not set.

   * @zh 属性 `id`（类型：`string`），用于存储或配置唯一标识。
   */
  id?: string;

  /**
   * If you wish, you can specify a specific `name` for your field. This is useful if you're posting the form to a server using techniques of yester-year.

   * @zh 属性 `name`（类型：`string | string[]`），用于存储或配置名称。
   */
  name?: string | string[];

  /**
   * An object with a few useful properties
   * - `validation.messages`: A map of message names that will be displayed when the field has errors.
   * - `validation.show`: A boolean you as the developer can set to force displaying errors whatever the state of field. This is useful when you're trying to call the user's attention to some fields for some reason.

   * @zh 属性 `validation`（类型：`{ messages?: { [messageProperties: string]: ValidationMessageOption['m...`），用于存储或配置校验。
   */
  validation?: {
    messages?: {
      [messageProperties: string]: ValidationMessageOption['message'];
    };
    show?: boolean;
    [additionalProperties: string]: unknown;
  };


  /**
   * Property `validators` (`any`) storing validators.
   * @zh 属性 `validators`（类型：`any`），用于存储或配置校验器列表。
   */
  validators?;


  /**
   * Property `asyncValidators` (`any`) storing async validators.
   * @zh 属性 `asyncValidators`（类型：`any`），用于存储或配置async校验器列表。
   */
  asyncValidators?;

  /**
   * Can be set instead of `type` to render custom html content.

   * @zh 属性 `template`（类型：`string`），用于存储或配置模板。
   */
  template?: string;

  /**
   *  It is expected to be the name of the wrappers.
   *  The formly field template will be wrapped by the first wrapper, then the second, then the third, etc.
   *  You can also specify these as part of a type (which is the recommended approach).

   * @zh 属性 `wrappers`（类型：`string[]`），用于存储或配置包装器列表。
   */
  wrappers?: string[];

  /**
   * Whether to hide the field. Defaults to false. If you wish this to be conditional use `hideExpression`

   * @zh 属性 `hide`（类型：`boolean`），用于存储或配置隐藏。
   */
  hide?: boolean;

  /**
   * Conditionally hiding Field based on values from other Fields

   * @zh 属性 `hideExpression`（类型：`boolean | string | ((model: any, formState: any, field?: FieldConfig)...`），用于存储或配置隐藏表达式。
   */
  hideExpression?;

  /**
   * An object where the name is a property to be set on the main field config and the value is an expression used to assign that property.

   * @zh 属性 `expressionProperties`（类型：`{ [property: string]: string | ((model: any, formState: any, field?: F...`），用于存储或配置表达式属性列表。
   */
  expressionProperties?: {
    [property: string]: string | ({ (model, formState, field?: FieldConfig) }) | Observable<unknown>;
  };


  /**
   * Property `className` (`string`) storing class name.
   * @zh 属性 `className`（类型：`string`），用于存储或配置类名名称。
   */
  className?: string;

  /**
   * Specify your own class that will be applied to the `formly-group` component.

   * @zh 属性 `fieldGroupClassName`（类型：`string`），用于存储或配置字段分组类名名称。
   */
  fieldGroupClassName?: string;

  /**
   * A field group is a way to group fields together, making advanced layout very simple.
   * It can also be used to group fields that are associated with the same model (useful if it's different than the model for the rest of the fields).

   * @zh 属性 `fieldGroup`（类型：`FieldConfig[]`），用于存储或配置字段分组。
   */
  fieldGroup?: FieldConfig[];

  /**
   * Property `fieldArray` (`FieldConfig`) storing field array.
   * @zh 属性 `fieldArray`（类型：`FieldConfig`），用于存储或配置字段数组。
   */
  fieldArray?: FieldConfig;

  /**
   * Whether to focus or blur the element field. Defaults to false. If you wish this to be conditional use `expressionProperties`

   * @zh 属性 `focused`（类型：`boolean`），用于存储或配置已聚焦。
   */
  focused?: boolean;

  /**
   * An object with a few useful properties to control the model changes
   * - `debounce`: integer value which contains the debounce model update value in milliseconds. A value of 0 triggers an immediate update.
   * - `updateOn`: string event value that instructs when the control should be updated

   * @zh 属性 `modelOptions`（类型：`{ debounce?: { default: number; }; updateOn?: 'change' | 'blur' | 'sub...`），用于存储或配置模型配置选项。
   */
  modelOptions?: {
    debounce?: {
      default: number;
    };
    /**
     * @see https://angular.io/api/forms/AbstractControl#updateOn
     */
    updateOn?: 'change' | 'blur' | 'submit';
  };


  /**
   * Property `hooks` (`FormHookConfig`) storing hooks.
   * @zh 属性 `hooks`（类型：`FormHookConfig`），用于存储或配置hooks。
   */
  hooks?: FormHookConfig;

  /**
   * Array of functions to execute, as a pipeline, whenever the model updates, usually via user input.

   * @zh 属性 `parsers`（类型：`((value: any) => any)[]`），用于存储或配置解析器。
   */
  parsers?;

  /**
   * The model that stores all the data, where the model[name] is the value of the field

   * @zh 属性 `model`（类型：`any`），用于存储或配置模型。
   */
  readonly model?;

  /**
   * The parent field.

   * @zh 属性 `parent`（类型：`FieldConfig`），用于存储或配置父级。
   */
  readonly parent?: FieldConfig;

  /**
   * The form option.

   * @zh 属性 `option`（类型：`FormOptions`），用于存储或配置选项。
   */
  readonly option?: FormOptions;

  /**
   * The parent form.

   * @zh 属性 `form`（类型：`FormGroup | FormArray`），用于存储或配置表单。
   */
  readonly form?: FormGroup | FormArray;

  /**
   * This is the [FormControl](https://angular.io/api/forms/FormControl) for the field.
   * It provides you more control like running validators, calculating status, and resetting state.

   * @zh 属性 `formControl`（类型：`AbstractControl`），用于存储或配置表单表单控件。
   */
  readonly formControl?: AbstractControl;

  /**
   * Property `optionsTypes` (`string[]`) storing options types.
   * @deprecated
   * @zh 属性 `optionsTypes`（类型：`string[]`），用于存储或配置配置选项类型列表。
   */
  optionsTypes?: string[];


  /**
   * Property `flex` (`number`) storing flex.
   * @zh 属性 `flex`（类型：`number`），用于存储或配置flex。
   */
  flex?: number;
  /**
   *是否是Field

   * @zh 是否是Field
   */
  isField?: boolean;


  /**
   * Property `xtype` (`string`) storing xtype.
   * @zh 属性 `xtype`（类型：`string`），用于存储或配置扩展类型。
   */
  xtype?: string;

  /**
   * Property `inputValue` (`any`) storing input value.
   * @zh 属性 `inputValue`（类型：`any`），用于存储或配置输入属性值。
   */
  inputValue?;

  /**
   * Field的标签，显示在前面.

   * @zh Field的标签，显示在前面.
   */
  label?: string;
  /**
   * Field的占位提示，字符类型

   * @zh Field的占位提示，字符类型
   */
  placeholder?: string;
  /**
   * 标识是否disable

   * @zh 标识是否disable
   */
  disabled?: boolean;
  /**
   * 描述，一般显示在Field的下方

   * @zh 描述，一般显示在Field的下方
   */
  description?: string;
  /**
   * 选项，主要用于Select等

   * @zh 选项，主要用于Select等
   */
  options?;
  /**
   * 行与列，主要用于TextArea

   * @zh 行与列，主要用于TextArea
   */
  rows?: number;

  /**
   * Property `cols` (`number`) storing cols.
   * @zh 属性 `cols`（类型：`number`），用于存储或配置列列表。
   */
  cols?: number;
  /**
   * 最大值，用于numberfield

   * @zh 最大值，用于numberfield
   */
  max?: number;
  /**
   * 最小值，用于numberfield

   * @zh 最小值，用于numberfield
   */
  min?: number;
  /**
   * 最小长度，用于TextField

   * @zh 最小长度，用于TextField
   */
  minLength?: number;
  /**
   * 最大长度，用于TextField

   * @zh 最大长度，用于TextField
   */
  maxLength?: number;
  /**
   * 格式，用于TextField

   * @zh 格式，用于TextField
   */
  pattern?: string | RegExp;
  /**
   * 非空，用于TextField

   * @zh 非空，用于TextField
   */
  required?: boolean;
  /**
   * tab 的序号

   * @zh tab 的序号
   */
  tabindex?: number;
  /**
   * Step，用于NumberField或者slider等

   * @zh Step，用于NumberField或者slider等
   */
  step?: number;
  /**
   * Property `attributes` (`{ [names: string]: string | number }`) storing attributes.
   * 扩展属性，用于上述未定义的个性化设置

   * @zh 扩展属性，用于上述未定义的个性化设置
   */
  attributes?: { [names: string]: string | number };

  //templateOption 合并

  /**
   * Property `hidden` (`boolean`) storing hidden.
   * @zh 属性 `hidden`（类型：`boolean`），用于存储或配置隐藏。
   */
  hidden?: boolean;
  /**
   * Property `readonly` (`boolean`) storing readonly.
   * @zh 属性 `readonly`（类型：`boolean`），用于存储或配置是否只读。
   */
  readonly?: boolean;
  /**
   * Property `auto` (`boolean`) storing auto.
   * @zh 属性 `auto`（类型：`boolean`），用于存储或配置自动。
   */
  auto?: boolean;
  /**
   * Property `focus` (`FormAttributeEvent`) storing focus.
   * @zh 属性 `focus`（类型：`FormAttributeEvent`），用于存储或配置聚焦。
   */
  focus?: FormAttributeEvent;
  /**
   * Property `blur` (`FormAttributeEvent`) storing blur.
   * @zh 属性 `blur`（类型：`FormAttributeEvent`），用于存储或配置失焦。
   */
  blur?: FormAttributeEvent;
  /**
   * Property `keyup` (`FormAttributeEvent`) storing keyup.
   * @zh 属性 `keyup`（类型：`FormAttributeEvent`），用于存储或配置按键抬起。
   */
  keyup?: FormAttributeEvent;
  /**
   * Property `keydown` (`FormAttributeEvent`) storing keydown.
   * @zh 属性 `keydown`（类型：`FormAttributeEvent`），用于存储或配置按键按下。
   */
  keydown?: FormAttributeEvent;
  /**
   * Property `click` (`FormAttributeEvent`) storing click.
   * @zh 属性 `click`（类型：`FormAttributeEvent`），用于存储或配置点击。
   */
  click?: FormAttributeEvent;
  /**
   * Property `change` (`FormAttributeEvent`) storing change.
   * @zh 属性 `change`（类型：`FormAttributeEvent`），用于存储或配置变更。
   */
  change?: FormAttributeEvent;
  /**
   * Property `keypress` (`FormAttributeEvent`) storing keypress.
   * @zh 属性 `keypress`（类型：`FormAttributeEvent`），用于存储或配置按键敲击。
   */
  keypress?: FormAttributeEvent;
  /**
   * Property `opened` (`FormAttributeEvent`) storing opened.
   * @zh 属性 `opened`（类型：`FormAttributeEvent`），用于存储或配置是否展开。
   */
  opened?: FormAttributeEvent;
  /**
   * Property `closed` (`FormAttributeEvent`) storing closed.
   * @zh 属性 `closed`（类型：`FormAttributeEvent`），用于存储或配置是否关闭。
   */
  closed?: FormAttributeEvent;
  [additionalProperties: string]: unknown;

  // ===========================扩展参数==============================================
  /**
   * A field group is a way to group fields together, making advanced layout very simple.
   * It can also be used to group fields that are associated with the same model (useful if it's different than the model for the rest of the fields).

   * @zh 属性 `items`（类型：`FieldConfig[]`），用于存储或配置条目列表。
   */
  items?: FieldConfig[];

  /**
   * Can be set to replace the component that is defined in `type`.

   * @zh 属性 `component`（类型：`any`），用于存储或配置组件。
   */
  component?;

  /**
   * Property `hideFieldUnderline` (`boolean`) storing hide field underline.
   * @zh 属性 `hideFieldUnderline`（类型：`boolean`），用于存储或配置隐藏字段Underline。
   */
  hideFieldUnderline?: boolean;

  /**
   * Property `floatLabel` (`string`) storing float label.
   * @zh 属性 `floatLabel`（类型：`string`），用于存储或配置float标签。
   */
  floatLabel?: string;

  /**
   * Property `params` (`any`) storing params.
   * @zh 属性 `params`（类型：`any`），用于存储或配置参数集合。
   */
  params?;

  /**
   * Property `remote` (`boolean`) storing remote.
   * @zh 属性 `remote`（类型：`boolean`），用于存储或配置远程。
   */
  remote?: boolean;

  /**
   * Property `hasSearch` (`boolean`) storing has search.
   * @zh 属性 `hasSearch`（类型：`boolean`），用于存储或配置是否包含搜索。
   */
  hasSearch?: boolean;

  /**
   * Property `clearble` (`boolean`) storing clearble.
   * @zh 属性 `clearble`（类型：`boolean`），用于存储或配置clearble。
   */
  clearble?: boolean;

  /**
   * Property `objectValue` (`boolean`) storing object value.
   * @zh 属性 `objectValue`（类型：`boolean`），用于存储或配置对象值。
   */
  objectValue?: boolean;

  /**
   * Property `dataSource` (`{ url?: string; method?: string; pageble?: boolean; pageSize?: number;...`) storing data source.
   * @zh 属性 `dataSource`（类型：`{ url?: string; method?: string; pageble?: boolean; pageSize?: number;...`），用于存储或配置数据源。
   */
  dataSource?: {
    url?: string;
    method?: string;
    pageble?: boolean;
    pageSize?: number;
  }

  /**
   * Property `mask` (`string`) storing mask.
   * @zh 属性 `mask`（类型：`string`），用于存储或配置遮罩。
   */
  mask?: string;

  /**
   * Property `unit` (`any`) storing unit.
   * @zh 属性 `unit`（类型：`any`），用于存储或配置unit。
   */
  unit?;
}

/**
 * Type alias `FormAttributeEvent` representing form attribute event (`(field: FieldConfig, event?: any) => void`).
 * @zh 类型别名 `FormAttributeEvent`，表示表单HTML属性事件（`(field: FieldConfig, event?: any) => void`）。
 */
export type FormAttributeEvent = (field: FieldConfig, event?) => void;

/**
 * Constant/variable `FormLifeCycleEvent` defining form life cycle event in `src/core/form/models`.
 * @zh 常量/变量 `FormLifeCycleEvent`，定义 `src/core/form/models` 中的表单LifeCycle事件。
 */
export const FormLifeCycleEvent = [
  'onInit', 'onChanges', 'afterContentInit', 'afterViewInit', 'onDestroy'
];

/**
 * Type alias `FormHookFn` representing form hook fn (`(field?: FieldConfig) => void`).
 * @zh 类型别名 `FormHookFn`，表示表单Hook函数（`(field?: FieldConfig) => void`）。
 */
export type FormHookFn = (field?: FieldConfig) => void;

/**
 * Interface `FormHookConfig` defining the contract and properties for form hook config.
 * @zh 接口 `FormHookConfig`，定义表单Hook配置的数据结构契约与属性规范。
 */
export interface FormHookConfig {
  /**
   * Property `onInit` (`FormHookFn`) storing on init.
   * @zh 属性 `onInit`（类型：`FormHookFn`），用于存储或配置当初始化。
   */
  onInit?: FormHookFn;
  /**
   * Property `onChanges` (`FormHookFn`) storing on changes.
   * @zh 属性 `onChanges`（类型：`FormHookFn`），用于存储或配置当变更集合。
   */
  onChanges?: FormHookFn;
  /**
   * Property `afterContentInit` (`FormHookFn`) storing after content init.
   * @zh 属性 `afterContentInit`（类型：`FormHookFn`），用于存储或配置之后内容初始化。
   */
  afterContentInit?: FormHookFn;
  /**
   * Property `afterViewInit` (`FormHookFn`) storing after view init.
   * @zh 属性 `afterViewInit`（类型：`FormHookFn`），用于存储或配置之后视图初始化。
   */
  afterViewInit?: FormHookFn;
  /**
   * Property `onDestroy` (`FormHookFn`) storing on destroy.
   * @zh 属性 `onDestroy`（类型：`FormHookFn`），用于存储或配置当销毁。
   */
  onDestroy?: FormHookFn;
}

/**
 * Interface `FormOptions` defining the contract and properties for form options.
 * @zh 接口 `FormOptions`，定义表单配置选项的数据结构契约与属性规范。
 */
export interface FormOptions {
  /**
   * Property `updateInitialValue` (`() => void`) storing update initial value.
   * @zh 属性 `updateInitialValue`（类型：`() => void`），用于存储或配置更新初始值。
   */
  updateInitialValue?: () => void;
  /**
   * Property `resetModel` (`(model?: any) => void`) storing reset model.
   * @zh 属性 `resetModel`（类型：`(model?: any) => void`），用于存储或配置重置模型。
   */
  resetModel?: (model?) => void;
  /**
   * Property `formState` (`any`) storing form state.
   * @zh 属性 `formState`（类型：`any`），用于存储或配置表单状态。
   */
  formState?;
  /**
   * Property `fieldChanges` (`Subject<ValueChangeEvent>`) storing field changes.
   * @zh 属性 `fieldChanges`（类型：`Subject<ValueChangeEvent>`），用于存储或配置字段变更集合。
   */
  fieldChanges?: Subject<ValueChangeEvent>;
  // fieldTransform?: (fields: FieldConfig[], model: any, form: FormGroup | FormArray, option: FormOptions) => FieldConfig[];
  /**
   * Property `showError` (`(field: FieldType) => boolean`) storing show error.
   * @zh 属性 `showError`（类型：`(field: FieldType) => boolean`），用于存储或配置显示错误。
   */
  showError?: (field: FieldType) => boolean;
  /**
   * Property `build` (`(field: FieldConfig) => FieldConfig`) storing build.
   * @zh 属性 `build`（类型：`(field: FieldConfig) => FieldConfig`），用于存储或配置构建。
   */
  build?: (field: FieldConfig) => FieldConfig;
  /**
   * Property `checkExpressions` (`(field: FieldConfig) => void`) storing check expressions.
   * @zh 属性 `checkExpressions`（类型：`(field: FieldConfig) => void`），用于存储或配置检查表达式。
   */
  checkExpressions?: (field: FieldConfig) => void;
  /**
   * Property `detectChanges` (`(field: FieldConfig) => void`) storing detect changes.
   * @zh 属性 `detectChanges`（类型：`(field: FieldConfig) => void`），用于存储或配置检测变更集合。
   */
  detectChanges?: (field: FieldConfig) => void;
  /**
   * Property `parentForm` (`FormGroupDirective | null`) storing parent form.
   * @zh 属性 `parentForm`（类型：`FormGroupDirective | null`），用于存储或配置父级表单。
   */
  parentForm?: FormGroupDirective | null;
}

/**
 * Interface `ValueChangeEvent` defining the contract and properties for value change event.
 * @zh 接口 `ValueChangeEvent`，定义值变更事件的数据结构契约与属性规范。
 */
export interface ValueChangeEvent {
  /**
   * Property `field` (`FieldConfig`) storing field.
   * @zh 属性 `field`（类型：`FieldConfig`），用于存储或配置字段。
   */
  field: FieldConfig;
  /**
   * Property `type` (`string`) storing type.
   * @zh 属性 `type`（类型：`string`），用于存储或配置类型。
   */
  type: string;
  /**
   * Property `value` (`any`) storing value.
   * @zh 属性 `value`（类型：`any`），用于存储或配置值。
   */
  value;
  [meta: string]: unknown;
}
