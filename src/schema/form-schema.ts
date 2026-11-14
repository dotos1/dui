/**
 * @fileoverview Module `src/schema/form-schema.ts` providing zero-`any` declarative form schema types, Draft 2020-12 JSON Schema, and self-healing validator.
 * @zh 模块文件 `src/schema/form-schema.ts`，提供 100% 零 `any` 的声明式表单 Schema 类型定义、Draft 2020-12 JSON Schema 常量以及支持 AI 自愈提示的结构化校验器。
 */

/**
 * Type alias `DuiFormPrimitiveValue` representing primitive form control values without `any`.
 * @zh 类型别名 `DuiFormPrimitiveValue`，表示严格零 `any` 的表单字段基础值类型。
 */
export type DuiFormPrimitiveValue = string | number | boolean | null;

/**
 * Type alias `DuiFormFieldType` enumerating supported declarative form control types.
 * @zh 类型别名 `DuiFormFieldType`，枚举受支持的声明式表单控件类型。
 */
export type DuiFormFieldType =
  | 'text'
  | 'textarea'
  | 'number'
  | 'password'
  | 'email'
  | 'select'
  | 'radio'
  | 'checkbox'
  | 'switch'
  | 'date';

/**
 * Type alias `DuiFormDensity` representing enterprise layout density levels.
 * @zh 类型别名 `DuiFormDensity`，表示企业级高密度表单的三档密度模式。
 */
export type DuiFormDensity = 'compact' | 'normal' | 'loose';

/**
 * Constant `DUI_FORM_FIELD_TYPES` listing all valid `DuiFormFieldType` literals.
 * @zh 常量 `DUI_FORM_FIELD_TYPES`，列出全部合法的表单字段类型字面量。
 */
export const DUI_FORM_FIELD_TYPES: readonly DuiFormFieldType[] = [
  'text',
  'textarea',
  'number',
  'password',
  'email',
  'select',
  'radio',
  'checkbox',
  'switch',
  'date',
];

/**
 * Constant `DUI_FORM_DENSITIES` listing all valid `DuiFormDensity` literals.
 * @zh 常量 `DUI_FORM_DENSITIES`，列出全部合法的表单密度字面量。
 */
export const DUI_FORM_DENSITIES: readonly DuiFormDensity[] = [
  'compact',
  'normal',
  'loose',
];

/**
 * Interface `DuiFormFieldOption` describing a selectable option for `select` or `radio` fields.
 * @zh 接口 `DuiFormFieldOption`，定义下拉选择或单选组字段的可选项配置。
 */
export interface DuiFormFieldOption {
  /**
   * Property `label` (`string`) storing human-readable option label.
   * @zh 属性 `label`（类型：`string`），存储选项展示文本。
   */
  readonly label: string;
  /**
   * Property `value` (`string | number | boolean`) storing option value.
   * @zh 属性 `value`（类型：`string | number | boolean`），存储选项提交值。
   */
  readonly value: string | number | boolean;
  /**
   * Optional property `disabled` (`boolean`) indicating whether the option is disabled.
   * @zh 可选属性 `disabled`（类型：`boolean`），标识该选项是否禁用。
   */
  readonly disabled?: boolean;
}

/**
 * Interface `DuiFormFieldConfig` describing a single declarative form field configuration.
 * @zh 接口 `DuiFormFieldConfig`，定义单个声明式表单字段的完整结构配置。
 */
export interface DuiFormFieldConfig {
  /**
   * Property `key` (`string`) storing unique field identifier within the schema.
   * @zh 属性 `key`（类型：`string`），存储表单内唯一的字段键名。
   */
  readonly key: string;
  /**
   * Property `label` (`string`) storing field display label.
   * @zh 属性 `label`（类型：`string`），存储字段显示标题。
   */
  readonly label: string;
  /**
   * Property `type` (`DuiFormFieldType`) storing control type.
   * @zh 属性 `type`（类型：`DuiFormFieldType`），存储字段控件类型。
   */
  readonly type: DuiFormFieldType;
  /**
   * Optional property `placeholder` (`string`) storing input placeholder text.
   * @zh 可选属性 `placeholder`（类型：`string`），存储输入占位提示文本。
   */
  readonly placeholder?: string;
  /**
   * Optional property `required` (`boolean`) indicating whether input is mandatory.
   * @zh 可选属性 `required`（类型：`boolean`），标识字段是否为必填项。
   */
  readonly required?: boolean;
  /**
   * Optional property `disabled` (`boolean`) indicating whether control is disabled.
   * @zh 可选属性 `disabled`（类型：`boolean`），标识字段是否处于禁用态。
   */
  readonly disabled?: boolean;
  /**
   * Optional property `defaultValue` (`DuiFormPrimitiveValue`) storing initial field value.
   * @zh 可选属性 `defaultValue`（类型：`DuiFormPrimitiveValue`），存储字段初始默认值。
   */
  readonly defaultValue?: DuiFormPrimitiveValue;
  /**
   * Optional property `min` (`number`) storing minimum numeric bound.
   * @zh 可选属性 `min`（类型：`number`），存储数值型字段最小值约束。
   */
  readonly min?: number;
  /**
   * Optional property `max` (`number`) storing maximum numeric bound.
   * @zh 可选属性 `max`（类型：`number`），存储数值型字段最大值约束。
   */
  readonly max?: number;
  /**
   * Optional property `step` (`number`) storing numeric increment step.
   * @zh 可选属性 `step`（类型：`number`），存储数值型字段步进值。
   */
  readonly step?: number;
  /**
   * Optional property `minLength` (`number`) storing minimum string length bound.
   * @zh 可选属性 `minLength`（类型：`number`），存储文本型字段最小长度约束。
   */
  readonly minLength?: number;
  /**
   * Optional property `maxLength` (`number`) storing maximum string length bound.
   * @zh 可选属性 `maxLength`（类型：`number`），存储文本型字段最大长度约束。
   */
  readonly maxLength?: number;
  /**
   * Optional property `pattern` (`string`) storing regular expression validation pattern.
   * @zh 可选属性 `pattern`（类型：`string`），存储正则表达式校验规则字符串。
   */
  readonly pattern?: string;
  /**
   * Optional property `hint` (`string`) storing helper text displayed under the control.
   * @zh 可选属性 `hint`（类型：`string`），存储控件下方的辅助说明文本。
   */
  readonly hint?: string;
  /**
   * Optional property `colSpan` (`number`) storing CSS Grid column span count.
   * @zh 可选属性 `colSpan`（类型：`number`），存储字段在网格布局中跨越的列数。
   */
  readonly colSpan?: number;
  /**
   * Optional property `options` (`readonly DuiFormFieldOption[]`) storing options for `select` or `radio`.
   * @zh 可选属性 `options`（类型：`readonly DuiFormFieldOption[]`），存储下拉或单选字段的候选项列表。
   */
  readonly options?: readonly DuiFormFieldOption[];
}

/**
 * Interface `DuiFormSchema` describing a complete declarative enterprise form schema.
 * @zh 接口 `DuiFormSchema`，定义完整的企业级声明式表单结构描述对象。
 */
export interface DuiFormSchema {
  /**
   * Property `id` (`string`) storing unique form schema identifier.
   * @zh 属性 `id`（类型：`string`），存储表单 Schema 的唯一标识符。
   */
  readonly id: string;
  /**
   * Optional property `title` (`string`) storing form header title.
   * @zh 可选属性 `title`（类型：`string`），存储表单顶部主标题。
   */
  readonly title?: string;
  /**
   * Optional property `description` (`string`) storing form subtitle or description.
   * @zh 可选属性 `description`（类型：`string`），存储表单说明描述文本。
   */
  readonly description?: string;
  /**
   * Optional property `columns` (`2 | 1 | 3 | 4`) storing CSS Grid column count.
   * @zh 可选属性 `columns`（类型：`2 | 1 | 3 | 4`），存储表单原生 CSS Grid 列数。
   */
  readonly columns?: 1 | 2 | 3 | 4;
  /**
   * Optional property `density` (`DuiFormDensity`) storing visual density mode.
   * @zh 可选属性 `density`（类型：`DuiFormDensity`），存储表单高密度排版档位。
   */
  readonly density?: DuiFormDensity;
  /**
   * Optional property `submitLabel` (`string`) storing submit button label.
   * @zh 可选属性 `submitLabel`（类型：`string`），存储提交按钮文案。
   */
  readonly submitLabel?: string;
  /**
   * Optional property `resetLabel` (`string`) storing reset button label.
   * @zh 可选属性 `resetLabel`（类型：`string`），存储重置按钮文案。
   */
  readonly resetLabel?: string;
  /**
   * Property `fields` (`readonly DuiFormFieldConfig[]`) storing ordered field definitions.
   * @zh 属性 `fields`（类型：`readonly DuiFormFieldConfig[]`），存储有序字段配置数组。
   */
  readonly fields: readonly DuiFormFieldConfig[];
}

/**
 * Type alias `DuiSchemaFindingSeverity` representing diagnostic severity levels.
 * @zh 类型别名 `DuiSchemaFindingSeverity`，表示结构化校验诊断项的严重级别。
 */
export type DuiSchemaFindingSeverity = 'error' | 'warning';

/**
 * Interface `DuiSchemaFinding` representing a single structured validation diagnostic with self-healing hint.
 * @zh 接口 `DuiSchemaFinding`，表示含路径、错误码、严重度、消息及 AI 自动自愈提示 `hint` 的单条诊断结果。
 */
export interface DuiSchemaFinding {
  /**
   * Property `path` (`string`) storing JSONPath-like location of the issue.
   * @zh 属性 `path`（类型：`string`），存储问题所在的 JSON 路径（如 `fields[0].type`）。
   */
  readonly path: string;
  /**
   * Property `code` (`string`) storing machine-readable diagnostic code.
   * @zh 属性 `code`（类型：`string`），存储机器可读的稳定诊断错误码。
   */
  readonly code: string;
  /**
   * Property `severity` (`DuiSchemaFindingSeverity`) storing `'error'` or `'warning'`.
   * @zh 属性 `severity`（类型：`DuiSchemaFindingSeverity`），存储诊断严重度级别。
   */
  readonly severity: DuiSchemaFindingSeverity;
  /**
   * Property `message` (`string`) storing human-readable diagnostic description.
   * @zh 属性 `message`（类型：`string`），存储可读的问题描述信息。
   */
  readonly message: string;
  /**
   * Property `hint` (`string`) storing actionable self-healing instruction for AI agents and developers.
   * @zh 属性 `hint`（类型：`string`），存储供 AI 代理与开发者直接执行的自动修复建议。
   */
  readonly hint: string;
}

/**
 * Interface `DuiSchemaValidationResult` representing the output of `validateDuiFormSchema`.
 * @zh 接口 `DuiSchemaValidationResult`，表示 `validateDuiFormSchema` 的结构化校验返回结果。
 */
export interface DuiSchemaValidationResult {
  /**
   * Property `valid` (`boolean`) indicating whether zero error-level findings occurred.
   * @zh 属性 `valid`（类型：`boolean`），标识是否不存在任何 `error` 级别的校验错误。
   */
  readonly valid: boolean;
  /**
   * Property `findings` (`readonly DuiSchemaFinding[]`) storing all collected errors and warnings.
   * @zh 属性 `findings`（类型：`readonly DuiSchemaFinding[]`），存储收集到的全部错误与警告列表。
   */
  readonly findings: readonly DuiSchemaFinding[];
  /**
   * Optional property `schema` (`DuiFormSchema`) storing normalized strongly-typed schema when `valid` is `true`.
   * @zh 可选属性 `schema`（类型：`DuiFormSchema`），当校验通过时返回强类型归一化后的 `DuiFormSchema` 对象。
   */
  readonly schema?: DuiFormSchema;
}

/**
 * Interface `DuiJsonSchemaObject` typing Draft 2020-12 JSON Schema nodes strictly without `any`.
 * @zh 接口 `DuiJsonSchemaObject`，以严格零 `any` 方式描述 JSON Schema Draft 2020-12 节点结构。
 */
export interface DuiJsonSchemaObject {
  readonly $schema?: string;
  readonly $id?: string;
  readonly $ref?: string;
  readonly title?: string;
  readonly description?: string;
  readonly type?: string | readonly string[];
  readonly enum?: readonly (string | number | boolean | null)[];
  readonly required?: readonly string[];
  readonly additionalProperties?: boolean;
  readonly minLength?: number;
  readonly minItems?: number;
  readonly minimum?: number;
  readonly maximum?: number;
  readonly properties?: Readonly<Record<string, DuiJsonSchemaObject>>;
  readonly items?: DuiJsonSchemaObject;
  readonly $defs?: Readonly<Record<string, DuiJsonSchemaObject>>;
}

/**
 * Constant `DUI_FORM_JSON_SCHEMA` exporting standard JSON Schema (Draft 2020-12) for `DuiFormSchema`.
 * @zh 常量 `DUI_FORM_JSON_SCHEMA`，导出遵循 JSON Schema Draft 2020-12 标准的 `DuiFormSchema` 元模型定义。
 */
export const DUI_FORM_JSON_SCHEMA: DuiJsonSchemaObject = {
  $schema: 'https://json-schema.org/draft/2020-12/schema',
  $id: 'https://dotos.io/schemas/dui-form-schema.v1.json',
  title: 'DuiFormSchema',
  description: 'Declarative zero-any enterprise form schema for @dotos/dui/standalone DuiSchemaFormComponent.',
  type: 'object',
  required: ['id', 'fields'],
  additionalProperties: false,
  properties: {
    id: {
      type: 'string',
      minLength: 1,
      description: 'Unique identifier of the form schema.',
    },
    title: {
      type: 'string',
      description: 'Optional header title of the form.',
    },
    description: {
      type: 'string',
      description: 'Optional subtitle or helper description of the form.',
    },
    columns: {
      type: 'integer',
      enum: [1, 2, 3, 4],
      description: 'CSS Grid column count (1 to 4).',
    },
    density: {
      type: 'string',
      enum: ['compact', 'normal', 'loose'],
      description: 'Enterprise visual density level.',
    },
    submitLabel: {
      type: 'string',
      description: 'Custom submit button label.',
    },
    resetLabel: {
      type: 'string',
      description: 'Custom reset button label.',
    },
    fields: {
      type: 'array',
      minItems: 1,
      items: {
        $ref: '#/$defs/fieldConfig',
      },
    },
  },
  $defs: {
    fieldOption: {
      type: 'object',
      required: ['label', 'value'],
      additionalProperties: false,
      properties: {
        label: { type: 'string', minLength: 1 },
        value: { type: ['string', 'number', 'boolean'] },
        disabled: { type: 'boolean' },
      },
    },
    fieldConfig: {
      type: 'object',
      required: ['key', 'label', 'type'],
      additionalProperties: false,
      properties: {
        key: { type: 'string', minLength: 1 },
        label: { type: 'string', minLength: 1 },
        type: {
          type: 'string',
          enum: [
            'text',
            'textarea',
            'number',
            'password',
            'email',
            'select',
            'radio',
            'checkbox',
            'switch',
            'date',
          ],
        },
        placeholder: { type: 'string' },
        required: { type: 'boolean' },
        disabled: { type: 'boolean' },
        defaultValue: { type: ['string', 'number', 'boolean', 'null'] },
        min: { type: 'number' },
        max: { type: 'number' },
        step: { type: 'number' },
        minLength: { type: 'integer', minimum: 0 },
        maxLength: { type: 'integer', minimum: 0 },
        pattern: { type: 'string' },
        hint: { type: 'string' },
        colSpan: { type: 'integer', minimum: 1, maximum: 4 },
        options: {
          type: 'array',
          minItems: 1,
          items: { $ref: '#/$defs/fieldOption' },
        },
      },
    },
  },
};

const ALLOWED_ROOT_KEYS: ReadonlySet<string> = new Set<string>([
  'id',
  'title',
  'description',
  'columns',
  'density',
  'submitLabel',
  'resetLabel',
  'fields',
]);

const ALLOWED_FIELD_KEYS: ReadonlySet<string> = new Set<string>([
  'key',
  'label',
  'type',
  'placeholder',
  'required',
  'disabled',
  'defaultValue',
  'min',
  'max',
  'step',
  'minLength',
  'maxLength',
  'pattern',
  'hint',
  'colSpan',
  'options',
]);

const ALLOWED_OPTION_KEYS: ReadonlySet<string> = new Set<string>([
  'label',
  'value',
  'disabled',
]);

const VALID_FIELD_TYPE_SET: ReadonlySet<string> = new Set<string>(DUI_FORM_FIELD_TYPES);
const VALID_DENSITY_SET: ReadonlySet<string> = new Set<string>(DUI_FORM_DENSITIES);

/** 常见 AI 误写字段类型到合法 `DuiFormFieldType` 的自愈映射表 */
const FIELD_TYPE_ALIAS_MAP: Readonly<Record<string, DuiFormFieldType>> = {
  textfield: 'text',
  'text-field': 'text',
  input: 'text',
  string: 'text',
  varchar: 'text',
  multiline: 'textarea',
  'text-area': 'textarea',
  longtext: 'textarea',
  int: 'number',
  integer: 'number',
  float: 'number',
  decimal: 'number',
  numeric: 'number',
  dropdown: 'select',
  combobox: 'select',
  enum: 'select',
  radiogroup: 'radio',
  'radio-group': 'radio',
  bool: 'checkbox',
  boolean: 'switch',
  toggle: 'switch',
  slide: 'switch',
  datepicker: 'date',
  datetime: 'date',
  mail: 'email',
  secret: 'password',
};

/** 常见未知属性名到标准属性名的自愈建议表 */
const FIELD_PROP_TYPO_MAP: Readonly<Record<string, string>> = {
  name: 'key',
  id: 'key',
  field: 'key',
  title: 'label',
  caption: 'label',
  controlType: 'type',
  widget: 'type',
  choices: 'options',
  items: 'options',
  values: 'options',
  value: 'defaultValue',
  initialValue: 'defaultValue',
  readonly: 'disabled',
  readOnly: 'disabled',
  helpText: 'hint',
  description: 'hint',
  span: 'colSpan',
};

function isPlainRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isPrimitiveValue(value: unknown): value is DuiFormPrimitiveValue {
  return (
    value === null ||
    typeof value === 'string' ||
    (typeof value === 'number' && Number.isFinite(value)) ||
    typeof value === 'boolean'
  );
}

function isFieldType(value: string): value is DuiFormFieldType {
  return VALID_FIELD_TYPE_SET.has(value);
}

function isFormDensity(value: string): value is DuiFormDensity {
  return VALID_DENSITY_SET.has(value);
}

/**
 * Validates an arbitrary `unknown` input against `DuiFormSchema` rules and returns structured findings with AI self-healing hints.
 * @zh 对任意 `unknown` 输入执行零外部依赖的 `DuiFormSchema` 结构化校验，返回包含路径、错误码与 AI 自动修复提示 `hint` 的诊断结果。
 * @param input - Arbitrary candidate schema input (`unknown`) / 待校验的候选表单 Schema 输入（`unknown`）
 * @returns Structured validation result (`DuiSchemaValidationResult`) / 结构化校验结果（`DuiSchemaValidationResult`）
 */
export function validateDuiFormSchema(input: unknown): DuiSchemaValidationResult {
  const findings: DuiSchemaFinding[] = [];

  if (!isPlainRecord(input)) {
    findings.push({
      path: '$',
      code: 'SCHEMA_NOT_OBJECT',
      severity: 'error',
      message: '表单 Schema 根节点必须是非空普通对象。',
      hint: '请传入形如 { id: "user-form", fields: [...] } 的 JSON 对象，不要传入数组、字符串或 null。',
    });
    return { valid: false, findings };
  }

  for (const rootKey of Object.keys(input)) {
    if (!ALLOWED_ROOT_KEYS.has(rootKey)) {
      findings.push({
        path: rootKey,
        code: 'UNKNOWN_ROOT_PROPERTY',
        severity: 'error',
        message: `表单 Schema 存在未知顶层属性 "${rootKey}"。`,
        hint: `请移除顶层属性 "${rootKey}"；合法的顶层属性仅限: id, title, description, columns, density, submitLabel, resetLabel, fields。`,
      });
    }
  }

  const rawId = input['id'];
  if (typeof rawId !== 'string' || rawId.trim().length === 0) {
    findings.push({
      path: 'id',
      code: rawId === undefined ? 'MISSING_SCHEMA_ID' : 'INVALID_SCHEMA_ID',
      severity: 'error',
      message: '表单 Schema 缺少必填的非空字符串属性 "id"。',
      hint: '请在顶层补充非空字符串标识符，例如: "id": "device-config-form"。',
    });
  }

  const optionalRootStrings: readonly string[] = ['title', 'description', 'submitLabel', 'resetLabel'];
  for (const propName of optionalRootStrings) {
    const val = input[propName];
    if (val !== undefined && typeof val !== 'string') {
      findings.push({
        path: propName,
        code: 'INVALID_ROOT_STRING',
        severity: 'error',
        message: `顶层属性 "${propName}" 必须是字符串。`,
        hint: `请将 "${propName}" 的值改为字符串类型，或删除该可选属性。`,
      });
    }
  }

  const rawColumns = input['columns'];
  let normalizedColumns: 1 | 2 | 3 | 4 | undefined;
  if (rawColumns !== undefined) {
    if (rawColumns === 1 || rawColumns === 2 || rawColumns === 3 || rawColumns === 4) {
      normalizedColumns = rawColumns;
    } else {
      findings.push({
        path: 'columns',
        code: 'INVALID_COLUMNS',
        severity: 'error',
        message: `顶层属性 "columns" 的值 ${String(rawColumns)} 非法，仅支持 1 | 2 | 3 | 4。`,
        hint: '请将 "columns" 设置为整数 1、2、3 或 4（例如双栏企业表单设置为 2）。',
      });
    }
  }

  const rawDensity = input['density'];
  let normalizedDensity: DuiFormDensity | undefined;
  if (rawDensity !== undefined) {
    if (typeof rawDensity === 'string' && isFormDensity(rawDensity)) {
      normalizedDensity = rawDensity;
    } else {
      findings.push({
        path: 'density',
        code: 'INVALID_DENSITY',
        severity: 'error',
        message: `顶层属性 "density" 的值 "${String(rawDensity)}" 非法。`,
        hint: '请将 "density" 修改为 "compact"、"normal" 或 "loose" 之一。',
      });
    }
  }

  const rawFields = input['fields'];
  const normalizedFields: DuiFormFieldConfig[] = [];
  if (!Array.isArray(rawFields)) {
    findings.push({
      path: 'fields',
      code: 'MISSING_FIELDS',
      severity: 'error',
      message: '表单 Schema 缺少必填的字段数组 "fields"。',
      hint: '请在顶层添加非空数组 "fields": [{ key: "name", label: "名称", type: "text" }]。',
    });
  } else if (rawFields.length === 0) {
    findings.push({
      path: 'fields',
      code: 'EMPTY_FIELDS',
      severity: 'error',
      message: '"fields" 数组不能为空，至少需要声明 1 个字段。',
      hint: '请在 "fields" 数组中至少补充一个包含 key、label、type 的字段对象。',
    });
  } else {
    const seenKeys = new Map<string, number>();
    for (let i = 0; i < rawFields.length; i++) {
      const fieldPath = `fields[${i}]`;
      const rawField: unknown = rawFields[i];
      if (!isPlainRecord(rawField)) {
        findings.push({
          path: fieldPath,
          code: 'FIELD_NOT_OBJECT',
          severity: 'error',
          message: `${fieldPath} 必须是非空字段配置对象。`,
          hint: `请将 ${fieldPath} 修改为包含 { key, label, type } 的对象。`,
        });
        continue;
      }

      for (const fieldKey of Object.keys(rawField)) {
        if (!ALLOWED_FIELD_KEYS.has(fieldKey)) {
          const replacement = FIELD_PROP_TYPO_MAP[fieldKey];
          const suggestion = replacement
            ? `请将 "${fieldKey}" 重命名为标准属性 "${replacement}"。`
            : `请移除未知属性 "${fieldKey}"；合法字段属性为: ${Array.from(ALLOWED_FIELD_KEYS).join(', ')}。`;
          findings.push({
            path: `${fieldPath}.${fieldKey}`,
            code: 'UNKNOWN_FIELD_PROPERTY',
            severity: 'error',
            message: `${fieldPath} 包含未知属性 "${fieldKey}"。`,
            hint: suggestion,
          });
        }
      }

      const keyVal = rawField['key'];
      let validKey = '';
      if (typeof keyVal !== 'string' || keyVal.trim().length === 0) {
        findings.push({
          path: `${fieldPath}.key`,
          code: 'MISSING_FIELD_KEY',
          severity: 'error',
          message: `${fieldPath}.key 必须是非空字符串。`,
          hint: `请为 ${fieldPath} 指定唯一的英文驼峰或下划线键名，例如 "key": "field_${i + 1}"。`,
        });
      } else {
        validKey = keyVal.trim();
        const prevIdx = seenKeys.get(validKey);
        if (prevIdx !== undefined) {
          findings.push({
            path: `${fieldPath}.key`,
            code: 'DUPLICATE_FIELD_KEY',
            severity: 'error',
            message: `字段 key "${validKey}" 与 fields[${prevIdx}].key 重复。`,
            hint: `请将 ${fieldPath}.key 修改为不重复的唯一键名（例如 "${validKey}_${i + 1}"），避免表单模型键值冲突。`,
          });
        } else {
          seenKeys.set(validKey, i);
        }
      }

      const labelVal = rawField['label'];
      if (typeof labelVal !== 'string' || labelVal.trim().length === 0) {
        findings.push({
          path: `${fieldPath}.label`,
          code: 'MISSING_FIELD_LABEL',
          severity: 'error',
          message: `${fieldPath}.label 必须是非空字符串。`,
          hint: `请为 ${fieldPath} 添加用户可读标题，例如 "label": "${validKey || '字段标题'}"。`,
        });
      }

      const typeVal = rawField['type'];
      let resolvedType: DuiFormFieldType | undefined;
      if (typeof typeVal !== 'string' || !isFieldType(typeVal)) {
        const lower = typeof typeVal === 'string' ? typeVal.trim().toLowerCase() : '';
        const aliasTarget = lower ? FIELD_TYPE_ALIAS_MAP[lower] : undefined;
        const typeHint = aliasTarget
          ? `检测到常见别名 "${String(typeVal)}"，请将 ${fieldPath}.type 修改为 "${aliasTarget}"。合法枚举为: ${DUI_FORM_FIELD_TYPES.join(', ')}。`
          : `请将 ${fieldPath}.type 设置为合法枚举值之一: ${DUI_FORM_FIELD_TYPES.join(', ')}。`;
        findings.push({
          path: `${fieldPath}.type`,
          code: 'INVALID_FIELD_TYPE',
          severity: 'error',
          message: `${fieldPath}.type 的值 "${String(typeVal)}" 不在受支持的控件枚举中。`,
          hint: typeHint,
        });
      } else {
        resolvedType = typeVal;
      }

      const rawOptions = rawField['options'];
      let normalizedOptions: DuiFormFieldOption[] | undefined;
      if (resolvedType === 'select' || resolvedType === 'radio') {
        if (!Array.isArray(rawOptions) || rawOptions.length === 0) {
          findings.push({
            path: `${fieldPath}.options`,
            code: 'MISSING_FIELD_OPTIONS',
            severity: 'error',
            message: `类型为 "${resolvedType}" 的字段 ${fieldPath} 必须提供非空 "options" 数组。`,
            hint: `请为 ${fieldPath} 添加非空选项列表，例如 "options": [{ "label": "选项一", "value": "opt1" }]。`,
          });
        }
      } else if (rawOptions !== undefined) {
        findings.push({
          path: `${fieldPath}.options`,
          code: 'UNUSED_FIELD_OPTIONS',
          severity: 'warning',
          message: `${fieldPath} 的类型为 "${String(typeVal)}"，提供的 "options" 不会被渲染使用。`,
          hint: `若需要下拉或单选请将 ${fieldPath}.type 改为 "select" 或 "radio"，否则可移除冗余的 "options"。`,
        });
      }

      if (Array.isArray(rawOptions)) {
        normalizedOptions = [];
        for (let optIdx = 0; optIdx < rawOptions.length; optIdx++) {
          const optPath = `${fieldPath}.options[${optIdx}]`;
          const rawOpt: unknown = rawOptions[optIdx];
          if (!isPlainRecord(rawOpt)) {
            findings.push({
              path: optPath,
              code: 'OPTION_NOT_OBJECT',
              severity: 'error',
              message: `${optPath} 必须是包含 label 与 value 的对象。`,
              hint: `请将 ${optPath} 改为形如 { "label": "显示名", "value": "val" } 的对象。`,
            });
            continue;
          }
          for (const optKey of Object.keys(rawOpt)) {
            if (!ALLOWED_OPTION_KEYS.has(optKey)) {
              findings.push({
                path: `${optPath}.${optKey}`,
                code: 'UNKNOWN_OPTION_PROPERTY',
                severity: 'error',
                message: `${optPath} 包含未知属性 "${optKey}"。`,
                hint: `请移除 "${optKey}"；选项对象仅允许 label、value、disabled。`,
              });
            }
          }
          const optLabel = rawOpt['label'];
          const optValue = rawOpt['value'];
          const optDisabled = rawOpt['disabled'];
          if (typeof optLabel !== 'string' || optLabel.trim().length === 0) {
            findings.push({
              path: `${optPath}.label`,
              code: 'INVALID_OPTION_LABEL',
              severity: 'error',
              message: `${optPath}.label 必须是非空字符串。`,
              hint: `请为 ${optPath} 设置非空显示文本 "label"。`,
            });
          }
          if (
            typeof optValue !== 'string' &&
            (typeof optValue !== 'number' || !Number.isFinite(optValue)) &&
            typeof optValue !== 'boolean'
          ) {
            findings.push({
              path: `${optPath}.value`,
              code: 'INVALID_OPTION_VALUE',
              severity: 'error',
              message: `${optPath}.value 必须是 string、number 或 boolean。`,
              hint: `请将 ${optPath}.value 设置为基础字面量（如字符串或数值）。`,
            });
          }
          if (optDisabled !== undefined && typeof optDisabled !== 'boolean') {
            findings.push({
              path: `${optPath}.disabled`,
              code: 'INVALID_OPTION_DISABLED',
              severity: 'error',
              message: `${optPath}.disabled 必须是布尔值。`,
              hint: `请将 ${optPath}.disabled 设置为 true 或 false。`,
            });
          }
          if (
            typeof optLabel === 'string' &&
            optLabel.trim().length > 0 &&
            (typeof optValue === 'string' ||
              (typeof optValue === 'number' && Number.isFinite(optValue)) ||
              typeof optValue === 'boolean')
          ) {
            normalizedOptions.push({
              label: optLabel,
              value: optValue,
              ...(typeof optDisabled === 'boolean' ? { disabled: optDisabled } : {}),
            });
          }
        }
      }

      const minVal = rawField['min'];
      const maxVal = rawField['max'];
      const stepVal = rawField['step'];
      if (minVal !== undefined && (typeof minVal !== 'number' || !Number.isFinite(minVal))) {
        findings.push({
          path: `${fieldPath}.min`,
          code: 'INVALID_NUMBER_BOUND',
          severity: 'error',
          message: `${fieldPath}.min 必须是有限数值。`,
          hint: `请将 ${fieldPath}.min 改为合法的 number（例如 0），不要传入字符串。`,
        });
      }
      if (maxVal !== undefined && (typeof maxVal !== 'number' || !Number.isFinite(maxVal))) {
        findings.push({
          path: `${fieldPath}.max`,
          code: 'INVALID_NUMBER_BOUND',
          severity: 'error',
          message: `${fieldPath}.max 必须是有限数值。`,
          hint: `请将 ${fieldPath}.max 改为合法的 number（例如 100），不要传入字符串。`,
        });
      }
      if (
        typeof minVal === 'number' &&
        Number.isFinite(minVal) &&
        typeof maxVal === 'number' &&
        Number.isFinite(maxVal) &&
        minVal > maxVal
      ) {
        findings.push({
          path: `${fieldPath}.min`,
          code: 'MIN_GREATER_THAN_MAX',
          severity: 'error',
          message: `${fieldPath} 的最小值 min (${minVal}) 大于最大值 max (${maxVal})。`,
          hint: `请确保 ${fieldPath}.min <= ${fieldPath}.max，例如将 min 改为 ${maxVal}、max 改为 ${minVal}。`,
        });
      }
      if (
        stepVal !== undefined &&
        (typeof stepVal !== 'number' || !Number.isFinite(stepVal) || stepVal <= 0)
      ) {
        findings.push({
          path: `${fieldPath}.step`,
          code: 'INVALID_STEP',
          severity: 'error',
          message: `${fieldPath}.step 必须是大于 0 的有限数值。`,
          hint: `请将 ${fieldPath}.step 设置为正数（例如 1 或 0.1）。`,
        });
      }

      const minLenVal = rawField['minLength'];
      const maxLenVal = rawField['maxLength'];
      if (
        minLenVal !== undefined &&
        (typeof minLenVal !== 'number' || !Number.isInteger(minLenVal) || minLenVal < 0)
      ) {
        findings.push({
          path: `${fieldPath}.minLength`,
          code: 'INVALID_LENGTH_BOUND',
          severity: 'error',
          message: `${fieldPath}.minLength 必须是非负整数。`,
          hint: `请将 ${fieldPath}.minLength 设置为 >= 0 的整数。`,
        });
      }
      if (
        maxLenVal !== undefined &&
        (typeof maxLenVal !== 'number' || !Number.isInteger(maxLenVal) || maxLenVal < 0)
      ) {
        findings.push({
          path: `${fieldPath}.maxLength`,
          code: 'INVALID_LENGTH_BOUND',
          severity: 'error',
          message: `${fieldPath}.maxLength 必须是非负整数。`,
          hint: `请将 ${fieldPath}.maxLength 设置为 >= 0 的整数。`,
        });
      }
      if (
        typeof minLenVal === 'number' &&
        Number.isInteger(minLenVal) &&
        typeof maxLenVal === 'number' &&
        Number.isInteger(maxLenVal) &&
        minLenVal > maxLenVal
      ) {
        findings.push({
          path: `${fieldPath}.minLength`,
          code: 'MIN_LENGTH_GREATER_THAN_MAX_LENGTH',
          severity: 'error',
          message: `${fieldPath} 的 minLength (${minLenVal}) 大于 maxLength (${maxLenVal})。`,
          hint: `请确保 ${fieldPath}.minLength <= ${fieldPath}.maxLength。`,
        });
      }

      const patternVal = rawField['pattern'];
      if (patternVal !== undefined) {
        if (typeof patternVal !== 'string') {
          findings.push({
            path: `${fieldPath}.pattern`,
            code: 'INVALID_PATTERN_TYPE',
            severity: 'error',
            message: `${fieldPath}.pattern 必须是正则表达式字符串。`,
            hint: `请将 ${fieldPath}.pattern 改为字符串形式（例如 "^[a-zA-Z0-9_-]+$"）。`,
          });
        } else {
          try {
            new RegExp(patternVal);
          } catch {
            findings.push({
              path: `${fieldPath}.pattern`,
              code: 'INVALID_REGEX_PATTERN',
              severity: 'error',
              message: `${fieldPath}.pattern 不是合法的正则表达式语法。`,
              hint: `请检查括号与转义字符，修复 ${fieldPath}.pattern 的正则表达式语法错误。`,
            });
          }
        }
      }

      const defaultVal = rawField['defaultValue'];
      if (defaultVal !== undefined && !isPrimitiveValue(defaultVal)) {
        findings.push({
          path: `${fieldPath}.defaultValue`,
          code: 'INVALID_DEFAULT_VALUE',
          severity: 'error',
          message: `${fieldPath}.defaultValue 仅允许 string、number、boolean 或 null。`,
          hint: `请将 ${fieldPath}.defaultValue 修改为基础类型字面量，不要传入嵌套对象或数组。`,
        });
      }

      const placeholderVal = rawField['placeholder'];
      if (placeholderVal !== undefined && typeof placeholderVal !== 'string') {
        findings.push({
          path: `${fieldPath}.placeholder`,
          code: 'INVALID_FIELD_STRING',
          severity: 'error',
          message: `${fieldPath}.placeholder 必须是字符串。`,
          hint: `请将 ${fieldPath}.placeholder 修改为字符串。`,
        });
      }

      const hintVal = rawField['hint'];
      if (hintVal !== undefined && typeof hintVal !== 'string') {
        findings.push({
          path: `${fieldPath}.hint`,
          code: 'INVALID_FIELD_STRING',
          severity: 'error',
          message: `${fieldPath}.hint 必须是字符串。`,
          hint: `请将 ${fieldPath}.hint 修改为字符串。`,
        });
      }

      const reqVal = rawField['required'];
      if (reqVal !== undefined && typeof reqVal !== 'boolean') {
        findings.push({
          path: `${fieldPath}.required`,
          code: 'INVALID_FIELD_BOOLEAN',
          severity: 'error',
          message: `${fieldPath}.required 必须是布尔值。`,
          hint: `请将 ${fieldPath}.required 设置为 true 或 false。`,
        });
      }

      const disVal = rawField['disabled'];
      if (disVal !== undefined && typeof disVal !== 'boolean') {
        findings.push({
          path: `${fieldPath}.disabled`,
          code: 'INVALID_FIELD_BOOLEAN',
          severity: 'error',
          message: `${fieldPath}.disabled 必须是布尔值。`,
          hint: `请将 ${fieldPath}.disabled 设置为 true 或 false。`,
        });
      }

      const colSpanVal = rawField['colSpan'];
      if (colSpanVal !== undefined) {
        if (
          typeof colSpanVal !== 'number' ||
          !Number.isInteger(colSpanVal) ||
          colSpanVal < 1 ||
          colSpanVal > 4
        ) {
          findings.push({
            path: `${fieldPath}.colSpan`,
            code: 'INVALID_COL_SPAN',
            severity: 'error',
            message: `${fieldPath}.colSpan 必须是 1 到 4 之间的整数。`,
            hint: `请将 ${fieldPath}.colSpan 设置为 1..4 之间的整数。`,
          });
        } else if (normalizedColumns !== undefined && colSpanVal > normalizedColumns) {
          findings.push({
            path: `${fieldPath}.colSpan`,
            code: 'COL_SPAN_EXCEEDS_COLUMNS',
            severity: 'warning',
            message: `${fieldPath}.colSpan (${colSpanVal}) 大于表单总列数 columns (${normalizedColumns})。`,
            hint: `建议将 ${fieldPath}.colSpan 调整为 <= ${normalizedColumns}，或增大顶层 columns。`,
          });
        }
      }

      if (validKey && typeof labelVal === 'string' && labelVal.trim().length > 0 && resolvedType) {
        normalizedFields.push({
          key: validKey,
          label: labelVal,
          type: resolvedType,
          ...(typeof placeholderVal === 'string' ? { placeholder: placeholderVal } : {}),
          ...(typeof reqVal === 'boolean' ? { required: reqVal } : {}),
          ...(typeof disVal === 'boolean' ? { disabled: disVal } : {}),
          ...(defaultVal !== undefined && isPrimitiveValue(defaultVal)
            ? { defaultValue: defaultVal }
            : {}),
          ...(typeof minVal === 'number' && Number.isFinite(minVal) ? { min: minVal } : {}),
          ...(typeof maxVal === 'number' && Number.isFinite(maxVal) ? { max: maxVal } : {}),
          ...(typeof stepVal === 'number' && Number.isFinite(stepVal) ? { step: stepVal } : {}),
          ...(typeof minLenVal === 'number' && Number.isInteger(minLenVal)
            ? { minLength: minLenVal }
            : {}),
          ...(typeof maxLenVal === 'number' && Number.isInteger(maxLenVal)
            ? { maxLength: maxLenVal }
            : {}),
          ...(typeof patternVal === 'string' ? { pattern: patternVal } : {}),
          ...(typeof hintVal === 'string' ? { hint: hintVal } : {}),
          ...(typeof colSpanVal === 'number' && Number.isInteger(colSpanVal)
            ? { colSpan: colSpanVal }
            : {}),
          ...(normalizedOptions !== undefined ? { options: normalizedOptions } : {}),
        });
      }
    }
  }

  const hasError = findings.some((f) => f.severity === 'error');
  if (hasError || typeof rawId !== 'string') {
    return {
      valid: false,
      findings,
    };
  }

  const titleStr = input['title'];
  const descStr = input['description'];
  const submitStr = input['submitLabel'];
  const resetStr = input['resetLabel'];

  const normalizedSchema: DuiFormSchema = {
    id: rawId.trim(),
    ...(typeof titleStr === 'string' ? { title: titleStr } : {}),
    ...(typeof descStr === 'string' ? { description: descStr } : {}),
    ...(normalizedColumns !== undefined ? { columns: normalizedColumns } : {}),
    ...(normalizedDensity !== undefined ? { density: normalizedDensity } : {}),
    ...(typeof submitStr === 'string' ? { submitLabel: submitStr } : {}),
    ...(typeof resetStr === 'string' ? { resetLabel: resetStr } : {}),
    fields: normalizedFields,
  };

  return {
    valid: true,
    findings,
    schema: normalizedSchema,
  };
}
