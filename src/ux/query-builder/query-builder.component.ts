/**
 * @fileoverview Module `src/ux/query-builder/query-builder.component.ts` providing query builder component definitions and implementation.
 * @zh 模块文件 `src/ux/query-builder/query-builder.component.ts`，提供查询构建器组件相关的定义与实现。
 */

import {
  AbstractControl,
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  NG_VALIDATORS,
  ValidationErrors,
  Validator
} from '@angular/forms';
import { QueryOperatorDirective } from './query-operator.directive';
import { QueryFieldDirective } from './query-field.directive';
import { QueryEntityDirective } from './query-entity.directive';
import { QuerySwitchGroupDirective } from './query-switch-group.directive';
import { QueryButtonGroupDirective } from './query-button-group.directive';
import { QueryInputDirective } from './query-input.directive';
import { QueryRemoveButtonDirective } from './query-remove-button.directive';
import { QueryEmptyWarningDirective } from './query-empty-warning.directive';
import { QueryArrowIconDirective } from './query-arrow-icon.directive';
import {
  ButtonGroupContext,
  Entity,
  Field,
  SwitchGroupContext,
  EntityContext,
  FieldContext,
  InputContext,
  LocalRuleMeta,
  OperatorContext,
  Option,
  QueryBuilderClassNames,
  QueryBuilderConfig,
  RemoveButtonContext,
  ArrowIconContext,
  Rule,
  RuleSet,
  EmptyWarningContext,
} from './query-builder.interfaces';
import {
  ChangeDetectorRef,
  Component,
  ContentChild,
  ContentChildren,
  forwardRef,
  Input,
  OnChanges,
  OnInit,
  QueryList,
  SimpleChanges,
  TemplateRef,
  ViewChild,
  ElementRef
} from '@angular/core';

/**
 * Constant/variable `CONTROL_VALUE_ACCESSOR` defining control value accessor in `src/ux/query-builder`.
 * @zh 常量/变量 `CONTROL_VALUE_ACCESSOR`，定义 `src/ux/query-builder` 中的表单控件值访问器。
 */
export const CONTROL_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => QueryBuilderComponent),
  multi: true
};

/**
 * Constant/variable `VALIDATOR` defining validator in `src/ux/query-builder`.
 * @zh 常量/变量 `VALIDATOR`，定义 `src/ux/query-builder` 中的校验器。
 */
export const VALIDATOR = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => QueryBuilderComponent),
  multi: true
};

/**
 * Angular component `QueryBuilderComponent` (selector: 'query-builder') providing query builder component presentation and interaction in `src/ux/query-builder`.
 * @zh Angular 组件 `QueryBuilderComponent`（selector: 'query-builder'），提供查询构建器组件的视图渲染与交互逻辑（位于 `src/ux/query-builder`）。
 */
@Component({
  selector: 'query-builder',
  templateUrl: './query-builder.component.html',
  styleUrls: ['./query-builder.component.scss'],
  providers: [CONTROL_VALUE_ACCESSOR, VALIDATOR],
  standalone: false
})
export class QueryBuilderComponent implements OnChanges, ControlValueAccessor, Validator {
  /**
   * Property `fields` (`Field[]`) storing fields.
   * @zh 属性 `fields`（类型：`Field[]`），用于存储或配置字段列表。
   */
  public fields: Field[];
  /**
   * Property `filterFields` (`Field[]`) storing filter fields.
   * @zh 属性 `filterFields`（类型：`Field[]`），用于存储或配置过滤字段列表。
   */
  public filterFields: Field[];
  /**
   * Property `entities` (`Entity[]`) storing entities.
   * @zh 属性 `entities`（类型：`Entity[]`），用于存储或配置实体列表。
   */
  public entities: Entity[];
  /**
   * Property `defaultClassNames` (`QueryBuilderClassNames`) storing default class names.
   * @zh 属性 `defaultClassNames`（类型：`QueryBuilderClassNames`），用于存储或配置默认类名名称列表。
   */
  public defaultClassNames: QueryBuilderClassNames = {
    arrowIconButton: 'q-arrow-icon-button',
    arrowIcon: 'q-icon q-arrow-icon',
    removeIcon: 'q-icon q-remove-icon',
    addIcon: 'q-icon q-add-icon',
    button: 'q-button',
    buttonGroup: 'q-button-group',
    removeButton: 'q-remove-button',
    switchGroup: 'q-switch-group',
    switchLabel: 'q-switch-label',
    switchRadio: 'q-switch-radio',
    rightAlign: 'q-right-align',
    transition: 'q-transition',
    collapsed: 'q-collapsed',
    treeContainer: 'q-tree-container',
    tree: 'q-tree',
    row: 'q-row',
    connector: 'q-connector',
    rule: 'q-rule',
    ruleSet: 'q-ruleset',
    invalidRuleSet: 'q-invalid-ruleset',
    emptyWarning: 'q-empty-warning',
    fieldControl: 'q-field-control',
    fieldControlSize: 'q-control-size',
    entityControl: 'q-entity-control',
    entityControlSize: 'q-control-size',
    operatorControl: 'q-operator-control',
    operatorControlSize: 'q-control-size',
    inputControl: 'q-input-control',
    inputControlSize: 'q-control-size'
  };
  /**
   * Property `defaultOperatorMap` (`{ [key: string]: string[]; }`) storing default operator map.
   * @zh 属性 `defaultOperatorMap`（类型：`{ [key: string]: string[]; }`），用于存储或配置默认操作符映射表。
   */
  public defaultOperatorMap: { [key: string]: string[] } = {
    string: ['=', '!=', 'contains', 'like'],
    number: ['=', '!=', '>', '>=', '<', '<='],
    time: ['=', '!=', '>', '>=', '<', '<='],
    date: ['=', '!=', '>', '>=', '<', '<='],
    category: ['=', '!=', 'in', 'not in'],
    boolean: ['=']
  };
  /**
   * Input property `disabled` (`boolean`) configuring disabled.
   * @zh 输入属性 `disabled`（类型：`boolean`），用于配置已禁用。
   */
  @Input() disabled: boolean;
  /**
   * Input property `data` (`RuleSet`) configuring data (default: `{ condition: 'and', rules: [] }`).
   * @zh 输入属性 `data`（类型：`RuleSet`），用于配置数据（默认值：`{ condition: 'and', rules: [] }`）。
   */
  @Input() data: RuleSet = { condition: 'and', rules: [] };

  // For ControlValueAccessor interface
  /**
   * Property `onChangeCallback` (`() => void`) storing on change callback.
   * @zh 属性 `onChangeCallback`（类型：`() => void`），用于存储或配置当变更回调函数。
   */
  public onChangeCallback: () => void;
  /**
   * Property `onTouchedCallback` (`() => any`) storing on touched callback.
   * @zh 属性 `onTouchedCallback`（类型：`() => any`），用于存储或配置当是否已触碰回调函数。
   */
  public onTouchedCallback: { () };

  /**
   * Input property `allowRuleset` (`boolean`) configuring allow ruleset (default: `true`).
   * @zh 输入属性 `allowRuleset`（类型：`boolean`），用于配置允许Ruleset（默认值：`true`）。
   */
  @Input() allowRuleset: boolean = true;
  /**
   * Input property `allowCollapse` (`boolean`) configuring allow collapse (default: `false`).
   * @zh 输入属性 `allowCollapse`（类型：`boolean`），用于配置允许折叠（默认值：`false`）。
   */
  @Input() allowCollapse: boolean = false;
  /**
   * Input property `emptyMessage` (`string`) configuring empty message.
   * @zh 输入属性 `emptyMessage`（类型：`string`），用于配置空消息。
   */
  @Input() emptyMessage: string = 'A ruleset cannot be empty. Please add a rule or remove it all together.';
  /**
   * Input property `classNames` (`QueryBuilderClassNames`) configuring class names.
   * @zh 输入属性 `classNames`（类型：`QueryBuilderClassNames`），用于配置类名名称列表。
   */
  @Input() classNames: QueryBuilderClassNames;
  /**
   * Input property `operatorMap` (`{ [key: string]: string[]; }`) configuring operator map.
   * @zh 输入属性 `operatorMap`（类型：`{ [key: string]: string[]; }`），用于配置操作符映射表。
   */
  @Input() operatorMap: { [key: string]: string[] };
  /**
   * Input property `parentValue` (`RuleSet`) configuring parent value.
   * @zh 输入属性 `parentValue`（类型：`RuleSet`），用于配置父级值。
   */
  @Input() parentValue: RuleSet;
  /**
   * Input property `config` (`QueryBuilderConfig`) configuring config (default: `{ fields: {} }`).
   * @zh 输入属性 `config`（类型：`QueryBuilderConfig`），用于配置配置（默认值：`{ fields: {} }`）。
   */
  @Input() config: QueryBuilderConfig = { fields: {} };
  /**
   * Input property `parentArrowIconTemplate` (`QueryArrowIconDirective`) configuring parent arrow icon template.
   * @zh 输入属性 `parentArrowIconTemplate`（类型：`QueryArrowIconDirective`），用于配置父级箭头图标模板。
   */
  @Input() parentArrowIconTemplate: QueryArrowIconDirective;
  /**
   * Input property `parentInputTemplates` (`QueryList<QueryInputDirective>`) configuring parent input templates.
   * @zh 输入属性 `parentInputTemplates`（类型：`QueryList<QueryInputDirective>`），用于配置父级输入属性模板。
   */
  @Input() parentInputTemplates: QueryList<QueryInputDirective>;
  /**
   * Input property `parentOperatorTemplate` (`QueryOperatorDirective`) configuring parent operator template.
   * @zh 输入属性 `parentOperatorTemplate`（类型：`QueryOperatorDirective`），用于配置父级操作符模板。
   */
  @Input() parentOperatorTemplate: QueryOperatorDirective;
  /**
   * Input property `parentFieldTemplate` (`QueryFieldDirective`) configuring parent field template.
   * @zh 输入属性 `parentFieldTemplate`（类型：`QueryFieldDirective`），用于配置父级字段模板。
   */
  @Input() parentFieldTemplate: QueryFieldDirective;
  /**
   * Input property `parentEntityTemplate` (`QueryEntityDirective`) configuring parent entity template.
   * @zh 输入属性 `parentEntityTemplate`（类型：`QueryEntityDirective`），用于配置父级实体模板。
   */
  @Input() parentEntityTemplate: QueryEntityDirective;
  /**
   * Input property `parentSwitchGroupTemplate` (`QuerySwitchGroupDirective`) configuring parent switch group template.
   * @zh 输入属性 `parentSwitchGroupTemplate`（类型：`QuerySwitchGroupDirective`），用于配置父级切换开关分组模板。
   */
  @Input() parentSwitchGroupTemplate: QuerySwitchGroupDirective;
  /**
   * Input property `parentButtonGroupTemplate` (`QueryButtonGroupDirective`) configuring parent button group template.
   * @zh 输入属性 `parentButtonGroupTemplate`（类型：`QueryButtonGroupDirective`），用于配置父级按钮分组模板。
   */
  @Input() parentButtonGroupTemplate: QueryButtonGroupDirective;
  /**
   * Input property `parentRemoveButtonTemplate` (`QueryRemoveButtonDirective`) configuring parent remove button template.
   * @zh 输入属性 `parentRemoveButtonTemplate`（类型：`QueryRemoveButtonDirective`），用于配置父级移除按钮模板。
   */
  @Input() parentRemoveButtonTemplate: QueryRemoveButtonDirective;
  /**
   * Input property `parentEmptyWarningTemplate` (`QueryEmptyWarningDirective`) configuring parent empty warning template.
   * @zh 输入属性 `parentEmptyWarningTemplate`（类型：`QueryEmptyWarningDirective`），用于配置父级空警告模板。
   */
  @Input() parentEmptyWarningTemplate: QueryEmptyWarningDirective;
  /**
   * Input property `parentChangeCallback` (`() => void`) configuring parent change callback.
   * @zh 输入属性 `parentChangeCallback`（类型：`() => void`），用于配置父级变更回调函数。
   */
  @Input() parentChangeCallback: () => void;
  /**
   * Input property `parentTouchedCallback` (`() => void`) configuring parent touched callback.
   * @zh 输入属性 `parentTouchedCallback`（类型：`() => void`），用于配置父级是否已触碰回调函数。
   */
  @Input() parentTouchedCallback: () => void;
  /**
   * Input property `persistValueOnFieldChange` (`boolean`) configuring persist value on field change (default: `false`).
   * @zh 输入属性 `persistValueOnFieldChange`（类型：`boolean`），用于配置persist值当字段变更（默认值：`false`）。
   */
  @Input() persistValueOnFieldChange: boolean = false;

  /**
   * Template/content query reference `treeContainer` (`ElementRef<any>`) targeting tree container.
   * @zh 模板/内容视图查询引用 `treeContainer`（`@ViewChild`），指向树形控件容器。
   */
  @ViewChild('treeContainer', { static: true }) treeContainer: ElementRef;

  /**
   * Template/content query reference `buttonGroupTemplate` (`QueryButtonGroupDirective`) targeting button group template.
   * @zh 模板/内容视图查询引用 `buttonGroupTemplate`（`@ContentChild`），指向按钮分组模板。
   */
  @ContentChild(QueryButtonGroupDirective) buttonGroupTemplate: QueryButtonGroupDirective;
  /**
   * Template/content query reference `switchGroupTemplate` (`QuerySwitchGroupDirective`) targeting switch group template.
   * @zh 模板/内容视图查询引用 `switchGroupTemplate`（`@ContentChild`），指向切换开关分组模板。
   */
  @ContentChild(QuerySwitchGroupDirective) switchGroupTemplate: QuerySwitchGroupDirective;
  /**
   * Template/content query reference `fieldTemplate` (`QueryFieldDirective`) targeting field template.
   * @zh 模板/内容视图查询引用 `fieldTemplate`（`@ContentChild`），指向字段模板。
   */
  @ContentChild(QueryFieldDirective) fieldTemplate: QueryFieldDirective;
  /**
   * Template/content query reference `entityTemplate` (`QueryEntityDirective`) targeting entity template.
   * @zh 模板/内容视图查询引用 `entityTemplate`（`@ContentChild`），指向实体模板。
   */
  @ContentChild(QueryEntityDirective) entityTemplate: QueryEntityDirective;
  /**
   * Template/content query reference `operatorTemplate` (`QueryOperatorDirective`) targeting operator template.
   * @zh 模板/内容视图查询引用 `operatorTemplate`（`@ContentChild`），指向操作符模板。
   */
  @ContentChild(QueryOperatorDirective) operatorTemplate: QueryOperatorDirective;
  /**
   * Template/content query reference `removeButtonTemplate` (`QueryRemoveButtonDirective`) targeting remove button template.
   * @zh 模板/内容视图查询引用 `removeButtonTemplate`（`@ContentChild`），指向移除按钮模板。
   */
  @ContentChild(QueryRemoveButtonDirective) removeButtonTemplate: QueryRemoveButtonDirective;
  /**
   * Template/content query reference `emptyWarningTemplate` (`QueryEmptyWarningDirective`) targeting empty warning template.
   * @zh 模板/内容视图查询引用 `emptyWarningTemplate`（`@ContentChild`），指向空警告模板。
   */
  @ContentChild(QueryEmptyWarningDirective) emptyWarningTemplate: QueryEmptyWarningDirective;
  /**
   * Template/content query reference `inputTemplates` (`QueryList<QueryInputDirective>`) targeting input templates.
   * @zh 模板/内容视图查询引用 `inputTemplates`（`@ContentChildren`），指向输入属性模板。
   */
  @ContentChildren(QueryInputDirective) inputTemplates: QueryList<QueryInputDirective>;
  /**
   * Template/content query reference `arrowIconTemplate` (`QueryArrowIconDirective`) targeting arrow icon template.
   * @zh 模板/内容视图查询引用 `arrowIconTemplate`（`@ContentChild`），指向箭头图标模板。
   */
  @ContentChild(QueryArrowIconDirective) arrowIconTemplate: QueryArrowIconDirective;

  /**
   * Property `defaultTemplateTypes` (`string[]`) storing default template types.
   * @zh 属性 `defaultTemplateTypes`（类型：`string[]`），用于存储或配置默认模板类型列表。
   */
  private defaultTemplateTypes: string[] = [
    'string', 'number', 'time', 'date', 'category', 'boolean', 'multiselect'];
  /**
   * Property `defaultPersistValueTypes` (`string[]`) storing default persist value types.
   * @zh 属性 `defaultPersistValueTypes`（类型：`string[]`），用于存储或配置默认Persist值类型列表。
   */
  private defaultPersistValueTypes: string[] = [
    'string', 'number', 'time', 'date', 'boolean'];
  /**
   * Property `defaultEmptyList` (`any[]`) storing default empty list (default: `[]`).
   * @zh 属性 `defaultEmptyList`（类型：`any[]`），用于存储或配置默认空列表（默认值：`[]`）。
   */
  private defaultEmptyList = [];
  /**
   * Property `operatorsCache` (`{ [key: string]: string[]; }`) storing operators cache.
   * @zh 属性 `operatorsCache`（类型：`{ [key: string]: string[]; }`），用于存储或配置操作符缓存。
   */
  private operatorsCache: { [key: string]: string[] };
  /**
   * Property `inputContextCache` (`Map<Rule, InputContext>`) storing input context cache (default: `new Map<Rule, InputContext>()`).
   * @zh 属性 `inputContextCache`（类型：`Map<Rule, InputContext>`），用于存储或配置输入属性上下文缓存（默认值：`new Map<Rule, InputContext>()`）。
   */
  private inputContextCache = new Map<Rule, InputContext>();
  /**
   * Property `operatorContextCache` (`Map<Rule, OperatorContext>`) storing operator context cache (default: `new Map<Rule, OperatorContext>()`).
   * @zh 属性 `operatorContextCache`（类型：`Map<Rule, OperatorContext>`），用于存储或配置操作符上下文缓存（默认值：`new Map<Rule, OperatorContext>()`）。
   */
  private operatorContextCache = new Map<Rule, OperatorContext>();
  /**
   * Property `fieldContextCache` (`Map<Rule, FieldContext>`) storing field context cache (default: `new Map<Rule, FieldContext>()`).
   * @zh 属性 `fieldContextCache`（类型：`Map<Rule, FieldContext>`），用于存储或配置字段上下文缓存（默认值：`new Map<Rule, FieldContext>()`）。
   */
  private fieldContextCache = new Map<Rule, FieldContext>();
  /**
   * Property `entityContextCache` (`Map<Rule, EntityContext>`) storing entity context cache (default: `new Map<Rule, EntityContext>()`).
   * @zh 属性 `entityContextCache`（类型：`Map<Rule, EntityContext>`），用于存储或配置实体上下文缓存（默认值：`new Map<Rule, EntityContext>()`）。
   */
  private entityContextCache = new Map<Rule, EntityContext>();
  /**
   * Property `removeButtonContextCache` (`Map<Rule, RemoveButtonContext>`) storing remove button context cache (default: `new Map<Rule, RemoveButtonContext>()`).
   * @zh 属性 `removeButtonContextCache`（类型：`Map<Rule, RemoveButtonContext>`），用于存储或配置移除按钮上下文缓存（默认值：`new Map<Rule, RemoveButtonContext>()`）。
   */
  private removeButtonContextCache = new Map<Rule, RemoveButtonContext>();
  /**
   * Property `buttonGroupContext` (`ButtonGroupContext`) storing button group context.
   * @zh 属性 `buttonGroupContext`（类型：`ButtonGroupContext`），用于存储或配置按钮分组上下文。
   */
  private buttonGroupContext: ButtonGroupContext;

  /**
   * Creates an instance of `QueryBuilderComponent` and initializes its dependencies and internal state.
   * @zh 创建 `QueryBuilderComponent` 实例，并初始化其依赖项与内部状态。
   * @param changeDetectorRef - Injected or initial change detector ref (`ChangeDetectorRef`) / 注入或传入的变更检测器引用（`ChangeDetectorRef`）
   */
  constructor(private changeDetectorRef: ChangeDetectorRef) { }



  // ----------OnChanges Implementation----------

  /**
   * Angular lifecycle hook invoked when data-bound input properties change.
   * @zh Angular 生命周期钩子：当数据绑定的输入属性发生变更时调用。
   * @param changes - changes parameter (`{ [propName: string]: SimpleChange<any>; }`) / 变更集合参数（`{ [propName: string]: SimpleChange<any>; }`）
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes['config']) {

      const config = this.config || ({} as QueryBuilderConfig);
      const type = typeof config;
      if (type === 'object') {
        this.fields = Object.keys(config.fields).map((value) => {
          const field = config.fields[value];
          field.value = field.value || value;
          return field;
        });
        if (config.entities) {
          this.entities = Object.keys(config.entities).map((value) => {
            const entity = config.entities[value];
            entity.value = entity.value || value;
            return entity;
          });
        } else {
          this.entities = null;
        }
        this.operatorsCache = {};
      } else {
        throw new Error(`Expected 'config' must be a valid object, got ${type} instead.`);
      }
    }
  }

  // ----------Validator Implementation----------

  /**
   * Executes `validate` to handle validate.
   * @zh 执行 `validate`，用于校验。
   * @param control - control parameter (`AbstractControl<any, any, any>`) / 表单控件参数（`AbstractControl<any, any, any>`）
   * @returns Result of type `ValidationErrors` / 类型为 `ValidationErrors` 的返回值
   */
  validate(control: AbstractControl): ValidationErrors | null {
    const errors: { [key: string]: unknown } = {};
    const ruleErrorStore = [];
    let hasErrors = false;

    if (!this.config.allowEmptyRulesets && this.checkEmptyRuleInRuleset(this.data)) {
      errors['empty'] = 'Empty rulesets are not allowed.';
      hasErrors = true;
    }

    this.validateRulesInRuleset(this.data, ruleErrorStore);

    if (ruleErrorStore.length) {
      errors['rules'] = ruleErrorStore;
      hasErrors = true;
    }
    return hasErrors ? errors : null;
  }

  // ----------ControlValueAccessor Implementation----------

  /**
   * Getter for input property `value` (`RuleSet`) returning value.
   * @zh 输入属性 `value`（类型：`RuleSet`）的读取器，返回当前值。
   */
  @Input()
  get value(): RuleSet {
    return this.data;
  }
  /**
   * Sets the value (`value`).
   * @zh 设置值（`value`）。
   * @param value - New value value (`RuleSet`) / 新的值值（`RuleSet`）
   */
  set value(value: RuleSet) {
    // When component is initialized without a formControl, null is passed to value
    this.data = value || { condition: 'and', rules: [] };
    this.handleDataChange();
  }

  /**
   * Writes a new value from the Angular form model into the view (`ControlValueAccessor`).
   * @zh 将 Angular 表单模型中的新值写入视图（`ControlValueAccessor` 接口实现）。
   * @param obj - obj parameter (`any`) / 对象参数（`any`）
   */
  writeValue(obj): void {
    this.value = obj;
  }
  /**
   * Registers a callback function invoked when the control value changes in the UI (`ControlValueAccessor`).
   * @zh 注册当界面控件值发生变化时触发的回调函数（`ControlValueAccessor` 接口实现）。
   * @param fn - fn parameter (`any`) / 函数参数（`any`）
   */
  registerOnChange(fn): void {
    this.onChangeCallback = () => fn(this.data);
  }
  /**
   * Registers a callback function invoked when the control receives a blur/touched event (`ControlValueAccessor`).
   * @zh 注册当控件失焦或被触碰时触发的回调函数（`ControlValueAccessor` 接口实现）。
   * @param fn - fn parameter (`any`) / 函数参数（`any`）
   */
  registerOnTouched(fn): void {
    this.onTouchedCallback = () => fn(this.data);
  }
  /**
   * Enables or disables the UI control when the form control disabled status changes (`ControlValueAccessor`).
   * @zh 当表单控件的禁用状态变更时启用或禁用界面控件（`ControlValueAccessor` 接口实现）。
   * @param isDisabled - is disabled parameter (`boolean`) / 是否为已禁用参数（`boolean`）
   */
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this.changeDetectorRef.detectChanges();
  }

  // ----------END----------

  /**
   * Property `getDisabledState` (`() => boolean`) storing get disabled state.
   * @zh 属性 `getDisabledState`（类型：`() => boolean`），用于存储或配置获取已禁用状态。
   */
  getDisabledState = (): boolean => {
    return this.disabled;
  }

  /**
   * Executes `findTemplateForRule` to handle find template for rule.
   * @zh 执行 `findTemplateForRule`，用于查找模板用于规则。
   * @param rule - rule parameter (`Rule`) / 规则参数（`Rule`）
   * @returns Result of type `TemplateRef<unknown>` / 类型为 `TemplateRef<unknown>` 的返回值
   */
  findTemplateForRule(rule: Rule): TemplateRef<unknown> {
    const type = this.getInputType(rule.field, rule.operator);
    if (type) {
      const queryInput = this.findQueryInput(type);
      if (queryInput) {
        return queryInput.template;
      } else {
        if (this.defaultTemplateTypes.indexOf(type) === -1) {
          console.warn(`Could not find template for field with type: ${type}`);
        }
        return undefined;
      }
    }else{
      return undefined;
    }
  }

  /**
   * Executes `findQueryInput` to handle find query input.
   * @zh 执行 `findQueryInput`，用于查找查询输入属性。
   * @param type - type parameter (`string`) / 类型参数（`string`）
   * @returns Result of type `QueryInputDirective` / 类型为 `QueryInputDirective` 的返回值
   */
  findQueryInput(type: string): QueryInputDirective {
    const templates = this.parentInputTemplates || this.inputTemplates;
    return templates.find((item) => item.queryInputType === type);
  }

  /**
   * Executes `getOperators` to handle get operators.
   * @zh 执行 `getOperators`，用于获取操作符。
   * @param field - field parameter (`string`) / 字段参数（`string`）
   * @returns Result of type `string[]` / 类型为 `string[]` 的返回值
   */
  getOperators(field: string): string[] {
    if (this.operatorsCache[field]) {
      return this.operatorsCache[field];
    }
    let operators = this.defaultEmptyList;
    const fieldObject = this.config.fields[field];

    if (this.config.getOperators) {
      return this.config.getOperators(field, fieldObject);
    }

    const type = fieldObject.type;

    if (fieldObject && fieldObject.operators) {
      operators = fieldObject.operators;
    } else if (type) {
      operators = (this.operatorMap && this.operatorMap[type]) || this.defaultOperatorMap[type] || this.defaultEmptyList;
      if (operators.length === 0) {
        console.warn(
          `No operators found for field '${field}' with type ${fieldObject.type}. ` +
          `Please define an 'operators' property on the field or use the 'operatorMap' binding to fix this.`);
      }
      if (fieldObject.nullable) {
        operators = operators.concat(['is null', 'is not null']);
      }
    } else {
      console.warn(`No 'type' property found on field: '${field}'`);
    }

    // Cache reference to array object, so it won't be computed next time and trigger a rerender.
    this.operatorsCache[field] = operators;
    return operators;
  }

  /**
   * Executes `getFields` to handle get fields.
   * @zh 执行 `getFields`，用于获取字段列表。
   * @param entity - entity parameter (`string`) / 实体参数（`string`）
   * @returns Result of type `Field[]` / 类型为 `Field[]` 的返回值
   */
  getFields(entity: string): Field[] {
    if (this.entities && entity) {
      return this.fields.filter((field) => {
        return field && field.entity === entity;
      });
    } else {
      return this.fields;
    }
  }

  /**
   * Executes `getInputType` to handle get input type.
   * @zh 执行 `getInputType`，用于获取输入属性类型。
   * @param field - field parameter (`string`) / 字段参数（`string`）
   * @param operator - operator parameter (`string`) / 操作符参数（`string`）
   * @returns Result of type `string` / 类型为 `string` 的返回值
   */
  getInputType(field: string, operator: string): string {
    if (this.config.getInputType) {
      return this.config.getInputType(field, operator);
    }

    if (!this.config.fields[field]) {
      throw new Error(`No configuration for field '${field}' could be found! Please add it to config.fields.`);
    }

    const type = this.config.fields[field].type;
    switch (operator) {
      case 'is null':
      case 'is not null':
        return null;  // No displayed component
      case 'in':
      case 'not in':
        return type === 'category' || type === 'boolean' ? 'multiselect' : type;
      default:
        return type;
    }
  }

  /**
   * Executes `getOptions` to handle get options.
   * @zh 执行 `getOptions`，用于获取配置选项。
   * @param field - field parameter (`string`) / 字段参数（`string`）
   * @returns Result of type `Option[]` / 类型为 `Option[]` 的返回值
   */
  getOptions(field: string): Option[] {
    if (this.config.getOptions) {
      return this.config.getOptions(field);
    }
    return this.config.fields[field].options || this.defaultEmptyList;
  }

  /**
   * Executes `getClassNames` to handle get class names.
   * @zh 执行 `getClassNames`，用于获取类名名称列表。
   * @param args - args parameter (`any[]`) / 参数列表参数（`any[]`）
   * @returns Result of type `string` / 类型为 `string` 的返回值
   */
  getClassNames(...args): string {
    const clsLookup = this.classNames ? this.classNames : this.defaultClassNames;
    const classNames = args.map((id) => clsLookup[id] || this.defaultClassNames[id]).filter((c) => !!c);
    return classNames.length ? classNames.join(' ') : null;
  }

  /**
   * Executes `getDefaultField` to handle get default field.
   * @zh 执行 `getDefaultField`，用于获取默认字段。
   * @param entity - entity parameter (`Entity`) / 实体参数（`Entity`）
   * @returns Result of type `Field` / 类型为 `Field` 的返回值
   */
  getDefaultField(entity: Entity): Field {
    if (!entity) {
      return null;
    } else if (entity.defaultField !== undefined) {
      return this.getDefaultValue(entity.defaultField);
    } else {
      const entityFields = this.fields.filter((field) => {
        return field && field.entity === entity.value;
      });
      if (entityFields && entityFields.length) {
        return entityFields[0];
      } else {
        console.warn(`No fields found for entity '${entity.name}'. ` +
          `A 'defaultOperator' is also not specified on the field config. Operator value will default to null.`);
        return null;
      }
    }
  }

  /**
   * Executes `getDefaultOperator` to handle get default operator.
   * @zh 执行 `getDefaultOperator`，用于获取默认操作符。
   * @param field - field parameter (`Field`) / 字段参数（`Field`）
   * @returns Result of type `string` / 类型为 `string` 的返回值
   */
  getDefaultOperator(field: Field): string {
    if (field && field.defaultOperator !== undefined) {
      return this.getDefaultValue(field.defaultOperator);
    } else {
      const operators = this.getOperators(field.value);
      if (operators && operators.length) {
        return operators[0];
      } else {
        console.warn(`No operators found for field '${field.value}'. ` +
          `A 'defaultOperator' is also not specified on the field config. Operator value will default to null.`);
        return null;
      }
    }
  }

  /**
   * Executes `addRule` to handle add rule.
   * @zh 执行 `addRule`，用于添加规则。
   * @param parent - parent parameter (`RuleSet`) / 父级参数（`RuleSet`）
   */
  addRule(parent?: RuleSet): void {
    if (this.disabled) {
      return;
    }

    parent = parent || this.data;
    if (this.config.addRule) {
      this.config.addRule(parent);
    } else {
      const field = this.fields[0];
      parent.rules = parent.rules.concat([{
        field: field.value,
        operator: this.getDefaultOperator(field),
        value: this.getDefaultValue(field.defaultValue),
        entity: field.entity
      }]);
    }

    this.handleTouched();
    this.handleDataChange();
  }

  /**
   * Executes `removeRule` to handle remove rule.
   * @zh 执行 `removeRule`，用于移除规则。
   * @param rule - rule parameter (`Rule`) / 规则参数（`Rule`）
   * @param parent - parent parameter (`RuleSet`) / 父级参数（`RuleSet`）
   */
  removeRule(rule: Rule, parent?: RuleSet): void {
    if (this.disabled) {
      return;
    }

    parent = parent || this.data;
    if (this.config.removeRule) {
      this.config.removeRule(rule, parent);
    } else {
      parent.rules = parent.rules.filter((r) => r !== rule);
    }
    this.inputContextCache.delete(rule);
    this.operatorContextCache.delete(rule);
    this.fieldContextCache.delete(rule);
    this.entityContextCache.delete(rule);
    this.removeButtonContextCache.delete(rule);

    this.handleTouched();
    this.handleDataChange();
  }

  /**
   * Executes `addRuleSet` to handle add rule set.
   * @zh 执行 `addRuleSet`，用于添加规则集合。
   * @param parent - parent parameter (`RuleSet`) / 父级参数（`RuleSet`）
   */
  addRuleSet(parent?: RuleSet): void {
    if (this.disabled) {
      return;
    }

    parent = parent || this.data;
    if (this.config.addRuleSet) {
      this.config.addRuleSet(parent);
    } else {
      parent.rules = parent.rules.concat([{ condition: 'and', rules: [] }]);
    }

    this.handleTouched();
    this.handleDataChange();
  }

  /**
   * Executes `removeRuleSet` to handle remove rule set.
   * @zh 执行 `removeRuleSet`，用于移除规则集合。
   * @param ruleset - ruleset parameter (`RuleSet`) / ruleset参数（`RuleSet`）
   * @param parent - parent parameter (`RuleSet`) / 父级参数（`RuleSet`）
   */
  removeRuleSet(ruleset?: RuleSet, parent?: RuleSet): void {
    if (this.disabled) {
      return;
    }

    ruleset = ruleset || this.data;
    parent = parent || this.parentValue;
    if (this.config.removeRuleSet) {
      this.config.removeRuleSet(ruleset, parent);
    } else {
      parent.rules = parent.rules.filter((r) => r !== ruleset);
    }

    this.handleTouched();
    this.handleDataChange();
  }

  /**
   * Executes `transitionEnd` to handle transition end.
   * @zh 执行 `transitionEnd`，用于过渡动画结束。
   * @param e - e parameter (`Event`) / e参数（`Event`）
   */
  transitionEnd(e: Event): void {
    this.treeContainer.nativeElement.style.maxHeight = null;
  }

  /**
   * Executes `toggleCollapse` to handle toggle collapse.
   * @zh 执行 `toggleCollapse`，用于开关折叠。
   */
  toggleCollapse(): void {
    this.computedTreeContainerHeight();
    setTimeout(() => {
      this.data.collapsed = !this.data.collapsed;
    }, 100);
  }

  /**
   * Executes `computedTreeContainerHeight` to handle computed tree container height.
   * @zh 执行 `computedTreeContainerHeight`，用于计算属性树形控件容器高度。
   */
  computedTreeContainerHeight(): void {
    const nativeElement: HTMLElement = this.treeContainer.nativeElement;
    if (nativeElement && nativeElement.firstElementChild) {
      nativeElement.style.maxHeight = (nativeElement.firstElementChild.clientHeight + 8) + 'px';
    }
  }

  /**
   * Executes `changeCondition` to handle change condition.
   * @zh 执行 `changeCondition`，用于变更条件。
   * @param value - value parameter (`string`) / 值参数（`string`）
   */
  changeCondition(value: string): void {
    if (this.disabled) {
      return;
    }

    this.data.condition = value;
    this.handleTouched();
    this.handleDataChange();
  }

  /**
   * Executes `changeOperator` to handle change operator.
   * @zh 执行 `changeOperator`，用于变更操作符。
   * @param rule - rule parameter (`Rule`) / 规则参数（`Rule`）
   */
  changeOperator(rule: Rule): void {
    if (this.disabled) {
      return;
    }

    if (this.config.coerceValueForOperator) {
      rule.value = this.config.coerceValueForOperator(rule.operator, rule.value, rule);
    } else {
      rule.value = this.coerceValueForOperator(rule.operator, rule.value, rule);
    }

    this.handleTouched();
    this.handleDataChange();
  }

  /**
   * Executes `coerceValueForOperator` to handle coerce value for operator.
   * @zh 执行 `coerceValueForOperator`，用于强制转换值用于操作符。
   * @param operator - operator parameter (`string`) / 操作符参数（`string`）
   * @param value - value parameter (`any`) / 值参数（`any`）
   * @param rule - rule parameter (`Rule`) / 规则参数（`Rule`）
   * @returns Result of type `any` / 类型为 `any` 的返回值
   */
  coerceValueForOperator(operator: string, value, rule: Rule) {
    const inputType: string = this.getInputType(rule.field, operator);
    if (inputType === 'multiselect' && !Array.isArray(value)) {
      return [value];
    }
    return value;
  }

  /**
   * Executes `changeInput` to handle change input.
   * @zh 执行 `changeInput`，用于变更输入属性。
   */
  changeInput(): void {
    if (this.disabled) {
      return;
    }

    this.handleTouched();
    this.handleDataChange();
  }

  /**
   * Executes `changeField` to handle change field.
   * @zh 执行 `changeField`，用于变更字段。
   * @param fieldValue - field value parameter (`string`) / 字段值参数（`string`）
   * @param rule - rule parameter (`Rule`) / 规则参数（`Rule`）
   */
  changeField(fieldValue: string, rule: Rule): void {
    if (this.disabled) {
      return;
    }

    const inputContext = this.inputContextCache.get(rule);
    const currentField = inputContext && inputContext.field;

    const nextField: Field = this.config.fields[fieldValue];

    const nextValue = this.calculateFieldChangeValue(
      currentField, nextField, rule.value);

    if (nextValue !== undefined) {
      rule.value = nextValue;
    } else {
      delete rule.value;
    }

    rule.operator = this.getDefaultOperator(nextField);

    // Create new context objects so templates will automatically update
    this.inputContextCache.delete(rule);
    this.operatorContextCache.delete(rule);
    this.fieldContextCache.delete(rule);
    this.entityContextCache.delete(rule);
    this.getInputContext(rule);
    this.getFieldContext(rule);
    this.getOperatorContext(rule);
    this.getEntityContext(rule);

    this.handleTouched();
    this.handleDataChange();
  }

  /**
   * Executes `changeEntity` to handle change entity.
   * @zh 执行 `changeEntity`，用于变更实体。
   * @param entityValue - entity value parameter (`string`) / 实体值参数（`string`）
   * @param rule - rule parameter (`Rule`) / 规则参数（`Rule`）
   * @param index - index parameter (`number`) / 索引参数（`number`）
   * @param data - data parameter (`RuleSet`) / 数据参数（`RuleSet`）
   */
  changeEntity(entityValue: string, rule: Rule, index?: number, data?: RuleSet): void {
    if (this.disabled) {
      return;
    }

    const entity: Entity = this.entities.find((e) => e.value === entityValue);
    const defaultField: Field = this.getDefaultField(entity);
    if (defaultField) {
      const nextRule: Rule = {
        ...rule,
        field: defaultField.value
      };
      data.rules[index] = nextRule;
      this.changeField(defaultField.value, nextRule);
    } else {
      data.rules[index] = {
        ...rule,
        field: undefined
      };
      this.handleTouched();
      this.handleDataChange();
    }
  }

  /**
   * Executes `getDefaultValue` to handle get default value.
   * @zh 执行 `getDefaultValue`，用于获取默认值。
   * @param defaultValue - default value parameter (`any`) / 默认值参数（`any`）
   * @returns Result of type `any` / 类型为 `any` 的返回值
   */
  getDefaultValue(defaultValue) {
    switch (typeof defaultValue) {
      case 'function':
        return defaultValue();
      default:
        return defaultValue;
    }
  }

  /**
   * Executes `getOperatorTemplate` to handle get operator template.
   * @zh 执行 `getOperatorTemplate`，用于获取操作符模板。
   * @returns Result of type `TemplateRef<unknown>` / 类型为 `TemplateRef<unknown>` 的返回值
   */
  getOperatorTemplate(): TemplateRef<unknown> {
    const t = this.parentOperatorTemplate || this.operatorTemplate;
    return t ? t.template : null;
  }

  /**
   * Executes `getFieldTemplate` to handle get field template.
   * @zh 执行 `getFieldTemplate`，用于获取字段模板。
   * @returns Result of type `TemplateRef<unknown>` / 类型为 `TemplateRef<unknown>` 的返回值
   */
  getFieldTemplate(): TemplateRef<unknown> {
    const t = this.parentFieldTemplate || this.fieldTemplate;
    return t ? t.template : null;
  }

  /**
   * Executes `getEntityTemplate` to handle get entity template.
   * @zh 执行 `getEntityTemplate`，用于获取实体模板。
   * @returns Result of type `TemplateRef<unknown>` / 类型为 `TemplateRef<unknown>` 的返回值
   */
  getEntityTemplate(): TemplateRef<unknown> {
    const t = this.parentEntityTemplate || this.entityTemplate;
    return t ? t.template : null;
  }

  /**
   * Executes `getArrowIconTemplate` to handle get arrow icon template.
   * @zh 执行 `getArrowIconTemplate`，用于获取箭头图标模板。
   * @returns Result of type `TemplateRef<unknown>` / 类型为 `TemplateRef<unknown>` 的返回值
   */
  getArrowIconTemplate(): TemplateRef<unknown> {
    const t = this.parentArrowIconTemplate || this.arrowIconTemplate;
    return t ? t.template : null;
  }

  /**
   * Executes `getButtonGroupTemplate` to handle get button group template.
   * @zh 执行 `getButtonGroupTemplate`，用于获取按钮分组模板。
   * @returns Result of type `TemplateRef<unknown>` / 类型为 `TemplateRef<unknown>` 的返回值
   */
  getButtonGroupTemplate(): TemplateRef<unknown> {
    const t = this.parentButtonGroupTemplate || this.buttonGroupTemplate;
    return t ? t.template : null;
  }

  /**
   * Executes `getSwitchGroupTemplate` to handle get switch group template.
   * @zh 执行 `getSwitchGroupTemplate`，用于获取切换开关分组模板。
   * @returns Result of type `TemplateRef<unknown>` / 类型为 `TemplateRef<unknown>` 的返回值
   */
  getSwitchGroupTemplate(): TemplateRef<unknown> {
    const t = this.parentSwitchGroupTemplate || this.switchGroupTemplate;
    return t ? t.template : null;
  }

  /**
   * Executes `getRemoveButtonTemplate` to handle get remove button template.
   * @zh 执行 `getRemoveButtonTemplate`，用于获取移除按钮模板。
   * @returns Result of type `TemplateRef<unknown>` / 类型为 `TemplateRef<unknown>` 的返回值
   */
  getRemoveButtonTemplate(): TemplateRef<unknown> {
    const t = this.parentRemoveButtonTemplate || this.removeButtonTemplate;
    return t ? t.template : null;
  }

  /**
   * Executes `getEmptyWarningTemplate` to handle get empty warning template.
   * @zh 执行 `getEmptyWarningTemplate`，用于获取空警告模板。
   * @returns Result of type `TemplateRef<unknown>` / 类型为 `TemplateRef<unknown>` 的返回值
   */
  getEmptyWarningTemplate(): TemplateRef<unknown> {
    const t = this.parentEmptyWarningTemplate || this.emptyWarningTemplate;
    return t ? t.template : null;
  }

  /**
   * Executes `getQueryItemClassName` to handle get query item class name.
   * @zh 执行 `getQueryItemClassName`，用于获取查询条目类名名称。
   * @param local - local parameter (`LocalRuleMeta`) / 本地参数（`LocalRuleMeta`）
   * @returns Result of type `string` / 类型为 `string` 的返回值
   */
  getQueryItemClassName(local: LocalRuleMeta): string {
    let cls = this.getClassNames('row', 'connector', 'transition');
    cls += ' ' + this.getClassNames(local.ruleset ? 'ruleSet' : 'rule');
    if (local.invalid) {
      cls += ' ' + this.getClassNames('invalidRuleSet');
    }
    return cls;
  }

  /**
   * Executes `getButtonGroupContext` to handle get button group context.
   * @zh 执行 `getButtonGroupContext`，用于获取按钮分组上下文。
   * @returns Result of type `ButtonGroupContext` / 类型为 `ButtonGroupContext` 的返回值
   */
  getButtonGroupContext(): ButtonGroupContext {
    if (!this.buttonGroupContext) {
      this.buttonGroupContext = {
        addRule: this.addRule.bind(this),
        addRuleSet: this.allowRuleset && this.addRuleSet.bind(this),
        removeRuleSet: this.allowRuleset && this.parentValue && this.removeRuleSet.bind(this),
        getDisabledState: this.getDisabledState,
        $implicit: this.data
      };
    }
    return this.buttonGroupContext;
  }

  /**
   * Executes `getRemoveButtonContext` to handle get remove button context.
   * @zh 执行 `getRemoveButtonContext`，用于获取移除按钮上下文。
   * @param rule - rule parameter (`Rule`) / 规则参数（`Rule`）
   * @returns Result of type `RemoveButtonContext` / 类型为 `RemoveButtonContext` 的返回值
   */
  getRemoveButtonContext(rule: Rule): RemoveButtonContext {
    if (!this.removeButtonContextCache.has(rule)) {
      this.removeButtonContextCache.set(rule, {
        removeRule: this.removeRule.bind(this),
        getDisabledState: this.getDisabledState,
        $implicit: rule
      });
    }
    return this.removeButtonContextCache.get(rule);
  }

  /**
   * Executes `getFieldContext` to handle get field context.
   * @zh 执行 `getFieldContext`，用于获取字段上下文。
   * @param rule - rule parameter (`Rule`) / 规则参数（`Rule`）
   * @returns Result of type `FieldContext` / 类型为 `FieldContext` 的返回值
   */
  getFieldContext(rule: Rule): FieldContext {
    if (!this.fieldContextCache.has(rule)) {
      this.fieldContextCache.set(rule, {
        onChange: this.changeField.bind(this),
        getFields: this.getFields.bind(this),
        getDisabledState: this.getDisabledState,
        fields: this.fields,
        $implicit: rule
      });
    }
    return this.fieldContextCache.get(rule);
  }

  /**
   * Executes `getEntityContext` to handle get entity context.
   * @zh 执行 `getEntityContext`，用于获取实体上下文。
   * @param rule - rule parameter (`Rule`) / 规则参数（`Rule`）
   * @returns Result of type `EntityContext` / 类型为 `EntityContext` 的返回值
   */
  getEntityContext(rule: Rule): EntityContext {
    if (!this.entityContextCache.has(rule)) {
      this.entityContextCache.set(rule, {
        onChange: this.changeEntity.bind(this),
        getDisabledState: this.getDisabledState,
        entities: this.entities,
        $implicit: rule
      });
    }
    return this.entityContextCache.get(rule);
  }

  /**
   * Executes `getSwitchGroupContext` to handle get switch group context.
   * @zh 执行 `getSwitchGroupContext`，用于获取切换开关分组上下文。
   * @returns Result of type `SwitchGroupContext` / 类型为 `SwitchGroupContext` 的返回值
   */
  getSwitchGroupContext(): SwitchGroupContext {
    return {
      onChange: this.changeCondition.bind(this),
      getDisabledState: this.getDisabledState,
      $implicit: this.data
    };
  }

  /**
   * Executes `getArrowIconContext` to handle get arrow icon context.
   * @zh 执行 `getArrowIconContext`，用于获取箭头图标上下文。
   * @returns Result of type `ArrowIconContext` / 类型为 `ArrowIconContext` 的返回值
   */
  getArrowIconContext(): ArrowIconContext {
    return {
      getDisabledState: this.getDisabledState,
      $implicit: this.data
    };
  }

  /**
   * Executes `getEmptyWarningContext` to handle get empty warning context.
   * @zh 执行 `getEmptyWarningContext`，用于获取空警告上下文。
   * @returns Result of type `EmptyWarningContext` / 类型为 `EmptyWarningContext` 的返回值
   */
  getEmptyWarningContext(): EmptyWarningContext {
    return {
      getDisabledState: this.getDisabledState,
      message: this.emptyMessage,
      $implicit: this.data
    };
  }

  /**
   * Executes `getOperatorContext` to handle get operator context.
   * @zh 执行 `getOperatorContext`，用于获取操作符上下文。
   * @param rule - rule parameter (`Rule`) / 规则参数（`Rule`）
   * @returns Result of type `OperatorContext` / 类型为 `OperatorContext` 的返回值
   */
  getOperatorContext(rule: Rule): OperatorContext {
    if (!this.operatorContextCache.has(rule)) {
      this.operatorContextCache.set(rule, {
        onChange: this.changeOperator.bind(this),
        getDisabledState: this.getDisabledState,
        operators: this.getOperators(rule.field),
        $implicit: rule
      });
    }
    return this.operatorContextCache.get(rule);
  }

  /**
   * Executes `getInputContext` to handle get input context.
   * @zh 执行 `getInputContext`，用于获取输入属性上下文。
   * @param rule - rule parameter (`Rule`) / 规则参数（`Rule`）
   * @returns Result of type `InputContext` / 类型为 `InputContext` 的返回值
   */
  getInputContext(rule: Rule): InputContext {
    if (!this.inputContextCache.has(rule)) {
      this.inputContextCache.set(rule, {
        onChange: this.changeInput.bind(this),
        getDisabledState: this.getDisabledState,
        options: this.getOptions(rule.field),
        field: this.config.fields[rule.field],
        $implicit: rule
      });
    }
    return this.inputContextCache.get(rule);
  }

  /**
   * Executes `calculateFieldChangeValue` to handle calculate field change value.
   * @zh 执行 `calculateFieldChangeValue`，用于计算字段变更值。
   * @param currentField - current field parameter (`Field`) / 当前字段参数（`Field`）
   * @param nextField - next field parameter (`Field`) / 下一个字段参数（`Field`）
   * @param currentValue - current value parameter (`any`) / 当前值参数（`any`）
   * @returns Result of type `any` / 类型为 `any` 的返回值
   */
  private calculateFieldChangeValue(
    currentField: Field,
    nextField: Field,
    currentValue
  ) {

    if (this.config.calculateFieldChangeValue != null) {
      return this.config.calculateFieldChangeValue(
        currentField, nextField, currentValue);
    }

    const canKeepValue = () => {
      if (currentField == null || nextField == null) {
        return false;
      }
      return currentField.type === nextField.type
        && this.defaultPersistValueTypes.indexOf(currentField.type) !== -1;
    };

    if (this.persistValueOnFieldChange && canKeepValue()) {
      return currentValue;
    }

    if (nextField && nextField.defaultValue !== undefined) {
      return this.getDefaultValue(nextField.defaultValue);
    }

    return undefined;
  }

  /**
   * Executes `checkEmptyRuleInRuleset` to handle check empty rule in ruleset.
   * @zh 执行 `checkEmptyRuleInRuleset`，用于检查空规则在Ruleset。
   * @param ruleset - ruleset parameter (`RuleSet`) / ruleset参数（`RuleSet`）
   * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
   */
  private checkEmptyRuleInRuleset(ruleset: RuleSet): boolean {
    if (!ruleset || !ruleset.rules || ruleset.rules.length === 0) {
      return true;
    } else {
      return ruleset.rules.some((item) => {
        if ((item as RuleSet).rules) {
          return this.checkEmptyRuleInRuleset(item as RuleSet);
        } else {
          return false;
        }
      });
    }
  }

  /**
   * Executes `validateRulesInRuleset` to handle validate rules in ruleset.
   * @zh 执行 `validateRulesInRuleset`，用于校验规则列表在Ruleset。
   * @param ruleset - ruleset parameter (`RuleSet`) / ruleset参数（`RuleSet`）
   * @param errorStore - error store parameter (`any`) / 错误状态仓库参数（`any`）
   */
  private validateRulesInRuleset(ruleset: RuleSet, errorStore) {
    if (ruleset && ruleset.rules && ruleset.rules.length > 0) {
      ruleset.rules.forEach((item) => {
        if ((item as RuleSet).rules) {
          return this.validateRulesInRuleset(item as RuleSet, errorStore);
        } else if ((item as Rule).field) {
          const field = this.config.fields[(item as Rule).field];
          if (field && field.validator && field.validator.apply) {
            const error = field.validator(item as Rule, ruleset);
            if (error != null) {
              errorStore.push(error);
            }
          }
        }
      });
    }
  }

  /**
   * Executes `handleDataChange` to handle handle data change.
   * @zh 执行 `handleDataChange`，用于连接手柄数据变更。
   */
  private handleDataChange(): void {
    this.changeDetectorRef.markForCheck();
    if (this.onChangeCallback) {
      this.onChangeCallback();
    }
    if (this.parentChangeCallback) {
      this.parentChangeCallback();
    }
  }

  /**
   * Executes `handleTouched` to handle handle touched.
   * @zh 执行 `handleTouched`，用于连接手柄是否已触碰。
   */
  private handleTouched(): void {
    if (this.onTouchedCallback) {
      this.onTouchedCallback();
    }
    if (this.parentTouchedCallback) {
      this.parentTouchedCallback();
    }
  }
}
