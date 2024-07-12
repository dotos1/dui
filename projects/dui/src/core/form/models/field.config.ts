import { FormGroup, FormArray, AbstractControl, FormGroupDirective } from '@angular/forms';
import { Subject, Observable } from 'rxjs';
import { FieldType } from '../template/field.type';
import { ValidationMessageOption } from './config';

export interface FieldConfig {

  /**
   * This should be a formly-field type added either by you or a plugin. More information over at Creating Formly Fields.
   */
  type?: string;

  /**
   * Use `defaultValue` to initialize it the model. If this is provided and the value of the model at compile-time is undefined, then the value of the model will be assigned to `defaultValue`.
   */
  defaultValue?: any;

  /**
   * This allows you to specify the `id` of your field. Note, the `id` is generated if not set.
   */
  id?: string;

  /**
   * If you wish, you can specify a specific `name` for your field. This is useful if you're posting the form to a server using techniques of yester-year.
   */
  name?: string | string[];

  /**
   * An object with a few useful properties
   * - `validation.messages`: A map of message names that will be displayed when the field has errors.
   * - `validation.show`: A boolean you as the developer can set to force displaying errors whatever the state of field. This is useful when you're trying to call the user's attention to some fields for some reason.
   */
  validation?: {
    messages?: {
      [messageProperties: string]: ValidationMessageOption['message'];
    };
    show?: boolean;
    [additionalProperties: string]: any;
  };


  validators?: any;


  asyncValidators?: any;

  /**
   * Can be set instead of `type` to render custom html content.
   */
  template?: string;

  /**
   *  It is expected to be the name of the wrappers.
   *  The formly field template will be wrapped by the first wrapper, then the second, then the third, etc.
   *  You can also specify these as part of a type (which is the recommended approach).
   */
  wrappers?: string[];

  /**
   * Whether to hide the field. Defaults to false. If you wish this to be conditional use `hideExpression`
   */
  hide?: boolean;

  /**
   * Conditionally hiding Field based on values from other Fields
   */
  hideExpression?: boolean | string | ((model: any, formState: any, field?: FieldConfig) => boolean);

  /**
   * An object where the name is a property to be set on the main field config and the value is an expression used to assign that property.
   */
  expressionProperties?: {
    [property: string]: string | ((model: any, formState: any, field?: FieldConfig) => any) | Observable<any>;
  };


  className?: string;

  /**
   * Specify your own class that will be applied to the `formly-group` component.
   */
  fieldGroupClassName?: string;

  /**
   * A field group is a way to group fields together, making advanced layout very simple.
   * It can also be used to group fields that are associated with the same model (useful if it's different than the model for the rest of the fields).
   */
  fieldGroup?: FieldConfig[];

  fieldArray?: FieldConfig;

  /**
   * Whether to focus or blur the element field. Defaults to false. If you wish this to be conditional use `expressionProperties`
   */
  focused?: boolean;

  /**
   * An object with a few useful properties to control the model changes
   * - `debounce`: integer value which contains the debounce model update value in milliseconds. A value of 0 triggers an immediate update.
   * - `updateOn`: string event value that instructs when the control should be updated
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


  hooks?: FormHookConfig;

  /**
   * Array of functions to execute, as a pipeline, whenever the model updates, usually via user input.
   */
  parsers?: ((value: any) => any)[];

  /**
   * The model that stores all the data, where the model[name] is the value of the field
   */
  readonly model?: any;

  /**
   * The parent field.
   */
  readonly parent?: FieldConfig;

  /**
   * The form option.
   */
  readonly option?: FormOptions;

  /**
   * The parent form.
   */
  readonly form?: FormGroup | FormArray;

  /**
   * This is the [FormControl](https://angular.io/api/forms/FormControl) for the field.
   * It provides you more control like running validators, calculating status, and resetting state.
   */
  readonly formControl?: AbstractControl;

  /** @deprecated */
  optionsTypes?: string[];


  flex?: number;
  /**
   *是否是Field
   */
  isField?: boolean;


  xtype?: string;

  inputValue?: any;

  /**
   * Field的标签，显示在前面.
   */
  label?: string;
  /**
   * Field的占位提示，字符类型
   */
  placeholder?: string;
  /**
   * 标识是否disable
   */
  disabled?: boolean;
  /**
   * 描述，一般显示在Field的下方
   */
  description?: string;
  /**
   * 选项，主要用于Select等
   */
  options?: any[] | Observable<any[]>;
  /**
   * 行与列，主要用于TextArea
   */
  rows?: number;

  cols?: number;
  /**
   * 最大值，用于numberfield
   */
  max?: number;
  /**
   * 最小值，用于numberfield
   */
  min?: number;
  /**
   * 最小长度，用于TextField
   */
  minLength?: number;
  /**
   * 最大长度，用于TextField
   */
  maxLength?: number;
  /**
   * 格式，用于TextField
   */
  pattern?: string | RegExp;
  /**
   * 非空，用于TextField
   */
  required?: boolean;
  /**
   * tab 的序号
   */
  tabindex?: number;
  /**
   * Step，用于NumberField或者slider等
   */
  step?: number;
  /**
   * 扩展属性，用于上述未定义的个性化设置
   */
  attributes?: { [names: string]: string | number };

  //templateOption 合并

  hidden?: boolean;
  readonly?: boolean;
  auto?: boolean;
  focus?: FormAttributeEvent;
  blur?: FormAttributeEvent;
  keyup?: FormAttributeEvent;
  keydown?: FormAttributeEvent;
  click?: FormAttributeEvent;
  change?: FormAttributeEvent;
  keypress?: FormAttributeEvent;
  opened?: FormAttributeEvent;
  closed?: FormAttributeEvent;
  [additionalProperties: string]: any;

  // ===========================扩展参数==============================================
  /**
   * A field group is a way to group fields together, making advanced layout very simple.
   * It can also be used to group fields that are associated with the same model (useful if it's different than the model for the rest of the fields).
   */
  items?: FieldConfig[];

  /**
   * Can be set to replace the component that is defined in `type`.
   */
  component?: any;

  hideFieldUnderline?: boolean;

  floatLabel?: string;

  params?: any;

  remote?: boolean;

  hasSearch?: boolean;

  clearble?: boolean;

  objectValue?: boolean;

  dataSource?: {
    url?: string;
    method?: string;
    pageble?: boolean;
    pageSize?: number;
  }

  mask?: string;

  unit?:any;
}

export type FormAttributeEvent = (field: FieldConfig, event?: any) => void;

export const FormLifeCycleEvent = [
  'onInit', 'onChanges', 'afterContentInit', 'afterViewInit', 'onDestroy'
];

export type FormHookFn = (field?: FieldConfig) => void;

export interface FormHookConfig {
  onInit?: FormHookFn;
  onChanges?: FormHookFn;
  afterContentInit?: FormHookFn;
  afterViewInit?: FormHookFn;
  onDestroy?: FormHookFn;
}

export interface FormOptions {
  updateInitialValue?: () => void;
  resetModel?: (model?: any) => void;
  formState?: any;
  fieldChanges?: Subject<ValueChangeEvent>;
  // fieldTransform?: (fields: FieldConfig[], model: any, form: FormGroup | FormArray, option: FormOptions) => FieldConfig[];
  showError?: (field: FieldType) => boolean;
  build?: (field: FieldConfig) => FieldConfig;
  checkExpressions?: (field: FieldConfig) => void;
  detectChanges?: (field: FieldConfig) => void;
  parentForm?: FormGroupDirective | null;
}

export interface ValueChangeEvent {
  field: FieldConfig;
  type: string;
  value: any;
  [meta: string]: any;
}
