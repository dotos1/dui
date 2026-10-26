/**
 * @fileoverview Module `src/ux/query-builder/query-builder.interfaces.ts` providing query builder interfaces definitions and implementation.
 * @zh 模块文件 `src/ux/query-builder/query-builder.interfaces.ts`，提供查询构建器interfaces相关的定义与实现。
 */


/**
 * Interface `RuleSet` defining the contract and properties for rule set.
 * @zh 接口 `RuleSet`，定义规则集合的数据结构契约与属性规范。
 */
export interface RuleSet {
  /**
   * Property `condition` (`string`) storing condition.
   * @zh 属性 `condition`（类型：`string`），用于存储或配置条件。
   */
  condition: string;
  /**
   * Property `rules` (`Array<RuleSet | Rule>`) storing rules.
   * @zh 属性 `rules`（类型：`Array<RuleSet | Rule>`），用于存储或配置规则列表。
   */
  rules: Array<RuleSet | Rule>;
  /**
   * Property `collapsed` (`boolean`) storing collapsed.
   * @zh 属性 `collapsed`（类型：`boolean`），用于存储或配置已折叠。
   */
  collapsed?: boolean;
  /**
   * Property `isChild` (`boolean`) storing is child.
   * @zh 属性 `isChild`（类型：`boolean`），用于存储或配置是否为子级。
   */
  isChild?: boolean;
}

/**
 * Interface `Rule` defining the contract and properties for rule.
 * @zh 接口 `Rule`，定义规则的数据结构契约与属性规范。
 */
export interface Rule {
  /**
   * Property `field` (`string`) storing field.
   * @zh 属性 `field`（类型：`string`），用于存储或配置字段。
   */
  field: string;
  /**
   * Property `value` (`any`) storing value.
   * @zh 属性 `value`（类型：`any`），用于存储或配置值。
   */
  value?;
  /**
   * Property `operator` (`string`) storing operator.
   * @zh 属性 `operator`（类型：`string`），用于存储或配置操作符。
   */
  operator?: string;
  /**
   * Property `entity` (`string`) storing entity.
   * @zh 属性 `entity`（类型：`string`），用于存储或配置实体。
   */
  entity?: string;
}

/**
 * Interface `Option` defining the contract and properties for option.
 * @zh 接口 `Option`，定义选项的数据结构契约与属性规范。
 */
export interface Option {
  /**
   * Property `name` (`string`) storing name.
   * @zh 属性 `name`（类型：`string`），用于存储或配置名称。
   */
  name: string;
  /**
   * Property `value` (`any`) storing value.
   * @zh 属性 `value`（类型：`any`），用于存储或配置值。
   */
  value;
}

/**
 * Interface `FieldMap` defining the contract and properties for field map.
 * @zh 接口 `FieldMap`，定义字段映射表的数据结构契约与属性规范。
 */
export interface FieldMap {
  [key: string]: Field;
}

/**
 * Interface `Field` defining the contract and properties for field.
 * @zh 接口 `Field`，定义字段的数据结构契约与属性规范。
 */
export interface Field {
  /**
   * Property `name` (`string`) storing name.
   * @zh 属性 `name`（类型：`string`），用于存储或配置名称。
   */
  name: string;
  /**
   * Property `value` (`string`) storing value.
   * @zh 属性 `value`（类型：`string`），用于存储或配置值。
   */
  value?: string;
  /**
   * Property `type` (`string`) storing type.
   * @zh 属性 `type`（类型：`string`），用于存储或配置类型。
   */
  type: string;
  /**
   * Property `nullable` (`boolean`) storing nullable.
   * @zh 属性 `nullable`（类型：`boolean`），用于存储或配置nullable。
   */
  nullable?: boolean;
  /**
   * Property `options` (`Option[]`) storing options.
   * @zh 属性 `options`（类型：`Option[]`），用于存储或配置配置选项。
   */
  options?: Option[];
  /**
   * Property `operators` (`string[]`) storing operators.
   * @zh 属性 `operators`（类型：`string[]`），用于存储或配置操作符。
   */
  operators?: string[];
  /**
   * Property `defaultValue` (`any`) storing default value.
   * @zh 属性 `defaultValue`（类型：`any`），用于存储或配置默认值。
   */
  defaultValue?;
  /**
   * Property `defaultOperator` (`any`) storing default operator.
   * @zh 属性 `defaultOperator`（类型：`any`），用于存储或配置默认操作符。
   */
  defaultOperator?;
  /**
   * Property `entity` (`string`) storing entity.
   * @zh 属性 `entity`（类型：`string`），用于存储或配置实体。
   */
  entity?: string;
  /**
   * Property `validator` (`(rule: Rule, parent: RuleSet) => any | null`) storing validator.
   * @zh 属性 `validator`（类型：`(rule: Rule, parent: RuleSet) => any | null`），用于存储或配置校验器。
   */
  validator?: (rule: Rule, parent: RuleSet) => unknown | null;
}

/**
 * Interface `LocalRuleMeta` defining the contract and properties for local rule meta.
 * @zh 接口 `LocalRuleMeta`，定义本地规则元数据的数据结构契约与属性规范。
 */
export interface LocalRuleMeta {
  /**
   * Property `ruleset` (`boolean`) storing ruleset.
   * @zh 属性 `ruleset`（类型：`boolean`），用于存储或配置ruleset。
   */
  ruleset: boolean;
  /**
   * Property `invalid` (`boolean`) storing invalid.
   * @zh 属性 `invalid`（类型：`boolean`），用于存储或配置无效。
   */
  invalid: boolean;
}

/**
 * Interface `EntityMap` defining the contract and properties for entity map.
 * @zh 接口 `EntityMap`，定义实体映射表的数据结构契约与属性规范。
 */
export interface EntityMap {
  [key: string]: Entity;
}

/**
 * Interface `Entity` defining the contract and properties for entity.
 * @zh 接口 `Entity`，定义实体的数据结构契约与属性规范。
 */
export interface Entity {
  /**
   * Property `name` (`string`) storing name.
   * @zh 属性 `name`（类型：`string`），用于存储或配置名称。
   */
  name: string;
  /**
   * Property `value` (`string`) storing value.
   * @zh 属性 `value`（类型：`string`），用于存储或配置值。
   */
  value?: string;
  /**
   * Property `defaultField` (`any`) storing default field.
   * @zh 属性 `defaultField`（类型：`any`），用于存储或配置默认字段。
   */
  defaultField?;
}

/**
 * Interface `QueryBuilderClassNames` defining the contract and properties for query builder class names.
 * @zh 接口 `QueryBuilderClassNames`，定义查询构建器类名名称列表的数据结构契约与属性规范。
 */
export interface QueryBuilderClassNames {
  /**
   * Property `arrowIconButton` (`string`) storing arrow icon button.
   * @zh 属性 `arrowIconButton`（类型：`string`），用于存储或配置箭头图标按钮。
   */
  arrowIconButton?: string;
  /**
   * Property `arrowIcon` (`string`) storing arrow icon.
   * @zh 属性 `arrowIcon`（类型：`string`），用于存储或配置箭头图标。
   */
  arrowIcon?: string;
  /**
   * Property `removeIcon` (`string`) storing remove icon.
   * @zh 属性 `removeIcon`（类型：`string`），用于存储或配置移除图标。
   */
  removeIcon?: string;
  /**
   * Property `addIcon` (`string`) storing add icon.
   * @zh 属性 `addIcon`（类型：`string`），用于存储或配置添加图标。
   */
  addIcon?: string;
  /**
   * Property `button` (`string`) storing button.
   * @zh 属性 `button`（类型：`string`），用于存储或配置按钮。
   */
  button?: string;
  /**
   * Property `buttonGroup` (`string`) storing button group.
   * @zh 属性 `buttonGroup`（类型：`string`），用于存储或配置按钮分组。
   */
  buttonGroup?: string;
  /**
   * Property `removeButton` (`string`) storing remove button.
   * @zh 属性 `removeButton`（类型：`string`），用于存储或配置移除按钮。
   */
  removeButton?: string;
  /**
   * Property `removeButtonSize` (`string`) storing remove button size.
   * @zh 属性 `removeButtonSize`（类型：`string`），用于存储或配置移除按钮尺寸。
   */
  removeButtonSize?: string;
  /**
   * Property `switchRow` (`string`) storing switch row.
   * @zh 属性 `switchRow`（类型：`string`），用于存储或配置切换开关行。
   */
  switchRow?: string;
  /**
   * Property `switchGroup` (`string`) storing switch group.
   * @zh 属性 `switchGroup`（类型：`string`），用于存储或配置切换开关分组。
   */
  switchGroup?: string;
  /**
   * Property `switchLabel` (`string`) storing switch label.
   * @zh 属性 `switchLabel`（类型：`string`），用于存储或配置切换开关标签。
   */
  switchLabel?: string;
  /**
   * Property `switchRadio` (`string`) storing switch radio.
   * @zh 属性 `switchRadio`（类型：`string`），用于存储或配置切换开关单选框。
   */
  switchRadio?: string;
  /**
   * Property `switchControl` (`string`) storing switch control.
   * @zh 属性 `switchControl`（类型：`string`），用于存储或配置切换开关表单控件。
   */
  switchControl?: string;
  /**
   * Property `rightAlign` (`string`) storing right align.
   * @zh 属性 `rightAlign`（类型：`string`），用于存储或配置右侧位置对齐。
   */
  rightAlign?: string;
  /**
   * Property `transition` (`string`) storing transition.
   * @zh 属性 `transition`（类型：`string`），用于存储或配置过渡动画。
   */
  transition?: string;
  /**
   * Property `collapsed` (`string`) storing collapsed.
   * @zh 属性 `collapsed`（类型：`string`），用于存储或配置已折叠。
   */
  collapsed?: string;
  /**
   * Property `treeContainer` (`string`) storing tree container.
   * @zh 属性 `treeContainer`（类型：`string`），用于存储或配置树形控件容器。
   */
  treeContainer?: string;
  /**
   * Property `tree` (`string`) storing tree.
   * @zh 属性 `tree`（类型：`string`），用于存储或配置树形控件。
   */
  tree?: string;
  /**
   * Property `row` (`string`) storing row.
   * @zh 属性 `row`（类型：`string`），用于存储或配置行。
   */
  row?: string;
  /**
   * Property `connector` (`string`) storing connector.
   * @zh 属性 `connector`（类型：`string`），用于存储或配置连接器。
   */
  connector?: string;
  /**
   * Property `rule` (`string`) storing rule.
   * @zh 属性 `rule`（类型：`string`），用于存储或配置规则。
   */
  rule?: string;
  /**
   * Property `ruleSet` (`string`) storing rule set.
   * @zh 属性 `ruleSet`（类型：`string`），用于存储或配置规则集合。
   */
  ruleSet?: string;
  /**
   * Property `invalidRuleSet` (`string`) storing invalid rule set.
   * @zh 属性 `invalidRuleSet`（类型：`string`），用于存储或配置无效规则集合。
   */
  invalidRuleSet?: string;
  /**
   * Property `emptyWarning` (`string`) storing empty warning.
   * @zh 属性 `emptyWarning`（类型：`string`），用于存储或配置空警告。
   */
  emptyWarning?: string;
  /**
   * Property `fieldControl` (`string`) storing field control.
   * @zh 属性 `fieldControl`（类型：`string`），用于存储或配置字段表单控件。
   */
  fieldControl?: string;
  /**
   * Property `fieldControlSize` (`string`) storing field control size.
   * @zh 属性 `fieldControlSize`（类型：`string`），用于存储或配置字段表单控件尺寸。
   */
  fieldControlSize?: string;
  /**
   * Property `entityControl` (`string`) storing entity control.
   * @zh 属性 `entityControl`（类型：`string`），用于存储或配置实体表单控件。
   */
  entityControl?: string;
  /**
   * Property `entityControlSize` (`string`) storing entity control size.
   * @zh 属性 `entityControlSize`（类型：`string`），用于存储或配置实体表单控件尺寸。
   */
  entityControlSize?: string;
  /**
   * Property `operatorControl` (`string`) storing operator control.
   * @zh 属性 `operatorControl`（类型：`string`），用于存储或配置操作符表单控件。
   */
  operatorControl?: string;
  /**
   * Property `operatorControlSize` (`string`) storing operator control size.
   * @zh 属性 `operatorControlSize`（类型：`string`），用于存储或配置操作符表单控件尺寸。
   */
  operatorControlSize?: string;
  /**
   * Property `inputControl` (`string`) storing input control.
   * @zh 属性 `inputControl`（类型：`string`），用于存储或配置输入属性表单控件。
   */
  inputControl?: string;
  /**
   * Property `inputControlSize` (`string`) storing input control size.
   * @zh 属性 `inputControlSize`（类型：`string`），用于存储或配置输入属性表单控件尺寸。
   */
  inputControlSize?: string;
}

/**
 * Interface `QueryBuilderConfig` defining the contract and properties for query builder config.
 * @zh 接口 `QueryBuilderConfig`，定义查询构建器配置的数据结构契约与属性规范。
 */
export interface QueryBuilderConfig {
  /**
   * Property `fields` (`FieldMap`) storing fields.
   * @zh 属性 `fields`（类型：`FieldMap`），用于存储或配置字段列表。
   */
  fields: FieldMap;
  /**
   * Property `entities` (`EntityMap`) storing entities.
   * @zh 属性 `entities`（类型：`EntityMap`），用于存储或配置实体列表。
   */
  entities?: EntityMap;
  /**
   * Property `allowEmptyRulesets` (`boolean`) storing allow empty rulesets.
   * @zh 属性 `allowEmptyRulesets`（类型：`boolean`），用于存储或配置允许空Rulesets。
   */
  allowEmptyRulesets?: boolean;
  /**
   * Property `getOperators` (`(fieldName: string, field: Field) => string[]`) storing get operators.
   * @zh 属性 `getOperators`（类型：`(fieldName: string, field: Field) => string[]`），用于存储或配置获取操作符。
   */
  getOperators?: (fieldName: string, field: Field) => string[];
  /**
   * Property `getInputType` (`(field: string, operator: string) => string`) storing get input type.
   * @zh 属性 `getInputType`（类型：`(field: string, operator: string) => string`），用于存储或配置获取输入属性类型。
   */
  getInputType?: (field: string, operator: string) => string;
  /**
   * Property `getOptions` (`(field: string) => Option[]`) storing get options.
   * @zh 属性 `getOptions`（类型：`(field: string) => Option[]`），用于存储或配置获取配置选项。
   */
  getOptions?: (field: string) => Option[];
  /**
   * Property `addRuleSet` (`(parent: RuleSet) => void`) storing add rule set.
   * @zh 属性 `addRuleSet`（类型：`(parent: RuleSet) => void`），用于存储或配置添加规则集合。
   */
  addRuleSet?: (parent: RuleSet) => void;
  /**
   * Property `addRule` (`(parent: RuleSet) => void`) storing add rule.
   * @zh 属性 `addRule`（类型：`(parent: RuleSet) => void`），用于存储或配置添加规则。
   */
  addRule?: (parent: RuleSet) => void;
  /**
   * Property `removeRuleSet` (`(ruleset: RuleSet, parent: RuleSet) => void`) storing remove rule set.
   * @zh 属性 `removeRuleSet`（类型：`(ruleset: RuleSet, parent: RuleSet) => void`），用于存储或配置移除规则集合。
   */
  removeRuleSet?: (ruleset: RuleSet, parent: RuleSet) => void;
  /**
   * Property `removeRule` (`(rule: Rule, parent: RuleSet) => void`) storing remove rule.
   * @zh 属性 `removeRule`（类型：`(rule: Rule, parent: RuleSet) => void`），用于存储或配置移除规则。
   */
  removeRule?: (rule: Rule, parent: RuleSet) => void;
  /**
   * Property `coerceValueForOperator` (`(operator: string, value: any, rule: Rule) => any`) storing coerce value for operator.
   * @zh 属性 `coerceValueForOperator`（类型：`(operator: string, value: any, rule: Rule) => any`），用于存储或配置coerce值用于操作符。
   */
  coerceValueForOperator?: { (operator: string, value, rule: Rule) };
  /**
   * Property `calculateFieldChangeValue` (`(currentField: Field, nextField: Field, currentValue: any) => any`) storing calculate field change value.
   * @zh 属性 `calculateFieldChangeValue`（类型：`(currentField: Field, nextField: Field, currentValue: any) => any`），用于存储或配置计算字段变更值。
   */
  calculateFieldChangeValue?: { (currentField: Field, nextField: Field, currentValue) };
}

/**
 * Interface `SwitchGroupContext` defining the contract and properties for switch group context.
 * @zh 接口 `SwitchGroupContext`，定义切换开关分组上下文的数据结构契约与属性规范。
 */
export interface SwitchGroupContext {
  /**
   * Property `onChange` (`(conditionValue: string) => void`) storing on change.
   * @zh 属性 `onChange`（类型：`(conditionValue: string) => void`），用于存储或配置当变更。
   */
  onChange: (conditionValue: string) => void;
  /**
   * Property `getDisabledState` (`() => boolean`) storing get disabled state.
   * @zh 属性 `getDisabledState`（类型：`() => boolean`），用于存储或配置获取已禁用状态。
   */
  getDisabledState: () => boolean;
  /**
   * Property `$implicit` (`RuleSet`) storing implicit.
   * @zh 属性 `$implicit`（类型：`RuleSet`），用于存储或配置implicit。
   */
  $implicit: RuleSet;
}

/**
 * Interface `EmptyWarningContext` defining the contract and properties for empty warning context.
 * @zh 接口 `EmptyWarningContext`，定义空警告上下文的数据结构契约与属性规范。
 */
export interface EmptyWarningContext {
  /**
   * Property `getDisabledState` (`() => boolean`) storing get disabled state.
   * @zh 属性 `getDisabledState`（类型：`() => boolean`），用于存储或配置获取已禁用状态。
   */
  getDisabledState: () => boolean;
  /**
   * Property `message` (`string`) storing message.
   * @zh 属性 `message`（类型：`string`），用于存储或配置消息。
   */
  message: string;
  /**
   * Property `$implicit` (`RuleSet`) storing implicit.
   * @zh 属性 `$implicit`（类型：`RuleSet`），用于存储或配置implicit。
   */
  $implicit: RuleSet;
}

/**
 * Interface `ArrowIconContext` defining the contract and properties for arrow icon context.
 * @zh 接口 `ArrowIconContext`，定义箭头图标上下文的数据结构契约与属性规范。
 */
export interface ArrowIconContext {
  /**
   * Property `getDisabledState` (`() => boolean`) storing get disabled state.
   * @zh 属性 `getDisabledState`（类型：`() => boolean`），用于存储或配置获取已禁用状态。
   */
  getDisabledState: () => boolean;
  /**
   * Property `$implicit` (`RuleSet`) storing implicit.
   * @zh 属性 `$implicit`（类型：`RuleSet`），用于存储或配置implicit。
   */
  $implicit: RuleSet;
}

/**
 * Interface `EntityContext` defining the contract and properties for entity context.
 * @zh 接口 `EntityContext`，定义实体上下文的数据结构契约与属性规范。
 */
export interface EntityContext {
  /**
   * Property `onChange` (`(entityValue: string, rule: Rule) => void`) storing on change.
   * @zh 属性 `onChange`（类型：`(entityValue: string, rule: Rule) => void`），用于存储或配置当变更。
   */
  onChange: (entityValue: string, rule: Rule) => void;
  /**
   * Property `getDisabledState` (`() => boolean`) storing get disabled state.
   * @zh 属性 `getDisabledState`（类型：`() => boolean`），用于存储或配置获取已禁用状态。
   */
  getDisabledState: () => boolean;
  /**
   * Property `entities` (`Entity[]`) storing entities.
   * @zh 属性 `entities`（类型：`Entity[]`），用于存储或配置实体列表。
   */
  entities: Entity[];
  /**
   * Property `$implicit` (`Rule`) storing implicit.
   * @zh 属性 `$implicit`（类型：`Rule`），用于存储或配置implicit。
   */
  $implicit: Rule;
}

/**
 * Interface `FieldContext` defining the contract and properties for field context.
 * @zh 接口 `FieldContext`，定义字段上下文的数据结构契约与属性规范。
 */
export interface FieldContext {
  /**
   * Property `onChange` (`(fieldValue: string, rule: Rule) => void`) storing on change.
   * @zh 属性 `onChange`（类型：`(fieldValue: string, rule: Rule) => void`），用于存储或配置当变更。
   */
  onChange: (fieldValue: string, rule: Rule) => void;
  /**
   * Property `getFields` (`(entityName: string) => void`) storing get fields.
   * @zh 属性 `getFields`（类型：`(entityName: string) => void`），用于存储或配置获取字段列表。
   */
  getFields: (entityName: string) => void;
  /**
   * Property `getDisabledState` (`() => boolean`) storing get disabled state.
   * @zh 属性 `getDisabledState`（类型：`() => boolean`），用于存储或配置获取已禁用状态。
   */
  getDisabledState: () => boolean;
  /**
   * Property `fields` (`Field[]`) storing fields.
   * @zh 属性 `fields`（类型：`Field[]`），用于存储或配置字段列表。
   */
  fields: Field[];
  /**
   * Property `$implicit` (`Rule`) storing implicit.
   * @zh 属性 `$implicit`（类型：`Rule`），用于存储或配置implicit。
   */
  $implicit: Rule;
}

/**
 * Interface `OperatorContext` defining the contract and properties for operator context.
 * @zh 接口 `OperatorContext`，定义操作符上下文的数据结构契约与属性规范。
 */
export interface OperatorContext {
  /**
   * Property `onChange` (`(a:any) => void`) storing on change.
   * @zh 属性 `onChange`（类型：`(a:any) => void`），用于存储或配置当变更。
   */
  onChange: (a) => void;
  /**
   * Property `getDisabledState` (`() => boolean`) storing get disabled state.
   * @zh 属性 `getDisabledState`（类型：`() => boolean`），用于存储或配置获取已禁用状态。
   */
  getDisabledState: () => boolean;
  /**
   * Property `operators` (`string[]`) storing operators.
   * @zh 属性 `operators`（类型：`string[]`），用于存储或配置操作符。
   */
  operators: string[];
  /**
   * Property `$implicit` (`Rule`) storing implicit.
   * @zh 属性 `$implicit`（类型：`Rule`），用于存储或配置implicit。
   */
  $implicit: Rule;
}

/**
 * Interface `InputContext` defining the contract and properties for input context.
 * @zh 接口 `InputContext`，定义输入属性上下文的数据结构契约与属性规范。
 */
export interface InputContext {
  /**
   * Property `onChange` (`() => void`) storing on change.
   * @zh 属性 `onChange`（类型：`() => void`），用于存储或配置当变更。
   */
  onChange: () => void;
  /**
   * Property `getDisabledState` (`() => boolean`) storing get disabled state.
   * @zh 属性 `getDisabledState`（类型：`() => boolean`），用于存储或配置获取已禁用状态。
   */
  getDisabledState: () => boolean;
  /**
   * Property `options` (`Option[]`) storing options.
   * @zh 属性 `options`（类型：`Option[]`），用于存储或配置配置选项。
   */
  options: Option[];
  /**
   * Property `field` (`Field`) storing field.
   * @zh 属性 `field`（类型：`Field`），用于存储或配置字段。
   */
  field: Field;
  /**
   * Property `$implicit` (`Rule`) storing implicit.
   * @zh 属性 `$implicit`（类型：`Rule`），用于存储或配置implicit。
   */
  $implicit: Rule;
}

/**
 * Interface `ButtonGroupContext` defining the contract and properties for button group context.
 * @zh 接口 `ButtonGroupContext`，定义按钮分组上下文的数据结构契约与属性规范。
 */
export interface ButtonGroupContext {
  /**
   * Property `addRule` (`() => void`) storing add rule.
   * @zh 属性 `addRule`（类型：`() => void`），用于存储或配置添加规则。
   */
  addRule: () => void;
  /**
   * Property `addRuleSet` (`() => void`) storing add rule set.
   * @zh 属性 `addRuleSet`（类型：`() => void`），用于存储或配置添加规则集合。
   */
  addRuleSet: () => void;
  /**
   * Property `removeRuleSet` (`() => void`) storing remove rule set.
   * @zh 属性 `removeRuleSet`（类型：`() => void`），用于存储或配置移除规则集合。
   */
  removeRuleSet: () => void;
  /**
   * Property `getDisabledState` (`() => boolean`) storing get disabled state.
   * @zh 属性 `getDisabledState`（类型：`() => boolean`），用于存储或配置获取已禁用状态。
   */
  getDisabledState: () => boolean;
  /**
   * Property `$implicit` (`RuleSet`) storing implicit.
   * @zh 属性 `$implicit`（类型：`RuleSet`），用于存储或配置implicit。
   */
  $implicit: RuleSet;
}

/**
 * Interface `RemoveButtonContext` defining the contract and properties for remove button context.
 * @zh 接口 `RemoveButtonContext`，定义移除按钮上下文的数据结构契约与属性规范。
 */
export interface RemoveButtonContext {
  /**
   * Property `removeRule` (`(rule: Rule) => void`) storing remove rule.
   * @zh 属性 `removeRule`（类型：`(rule: Rule) => void`），用于存储或配置移除规则。
   */
  removeRule: (rule: Rule) => void;
  /**
   * Property `getDisabledState` (`() => boolean`) storing get disabled state.
   * @zh 属性 `getDisabledState`（类型：`() => boolean`），用于存储或配置获取已禁用状态。
   */
  getDisabledState: () => boolean;
  /**
   * Property `$implicit` (`Rule`) storing implicit.
   * @zh 属性 `$implicit`（类型：`Rule`），用于存储或配置implicit。
   */
  $implicit: Rule;
}
