/**
 * @fileoverview DOTOS 五大复杂控件 Draft 2020-12 JSON Schema 注册表与闭环自愈语义校验引擎（100% 零 any）
 * 复刻并升级 dotos.customizer 的 Finding + Hint 自愈诊断体验
 */

import type {
  JsonSchemaDraft202012,
  SchemaFinding,
  SchemaTarget,
  ValidateSchemaOutput,
} from './types.js';

/**
 * 支持校验的五大目标枚举集合
 */
export const VALID_SCHEMA_TARGETS: readonly SchemaTarget[] = [
  'dui-form',
  'duix-grid',
  'duix-pivot-grid',
  'duix-gantt',
  'xdraw-canvas',
];

/**
 * 五大核心复杂控件的内置 Draft 2020-12 JSON Schema 定义注册表
 */
export const DOTOS_JSON_SCHEMAS: Readonly<Record<SchemaTarget, JsonSchemaDraft202012>> = {
  'dui-form': {
    $schema: 'https://json-schema.org/draft/2020-12/schema',
    $id: 'https://dotos.dev/schemas/v8/dui-form.schema.json',
    title: 'DuiFormSchema',
    description: '@dotos/dui/standalone <dui-standalone-form> 动态表单配置契约',
    type: 'object',
    required: ['fields'],
    additionalProperties: false,
    properties: {
      layout: {
        type: 'string',
        enum: ['vertical', 'horizontal', 'inline'],
        default: 'vertical',
      },
      columns: {
        type: 'integer',
        minimum: 1,
        maximum: 6,
        default: 1,
      },
      fields: {
        type: 'array',
        minItems: 1,
        items: {
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
                'select',
                'multi-select',
                'switch',
                'checkbox',
                'date',
                'radio',
              ],
            },
            required: { type: 'boolean' },
            placeholder: { type: 'string' },
            defaultValue: { type: ['string', 'number', 'boolean', 'null'] },
            min: { type: 'number' },
            max: { type: 'number' },
            minLength: { type: 'integer', minimum: 0 },
            maxLength: { type: 'integer', minimum: 1 },
            options: {
              type: 'array',
              minItems: 1,
              items: {
                type: 'object',
                required: ['label', 'value'],
                additionalProperties: false,
                properties: {
                  label: { type: 'string', minLength: 1 },
                  value: { type: ['string', 'number', 'boolean'] },
                  disabled: { type: 'boolean' },
                },
              },
            },
          },
        },
      },
    },
  },
  'duix-grid': {
    $schema: 'https://json-schema.org/draft/2020-12/schema',
    $id: 'https://dotos.dev/schemas/v8/duix-grid.schema.json',
    title: 'DuixGridSchema',
    description: '@dotos/duix/standalone <duix-standalone-grid> 企业级高密度表格契约',
    type: 'object',
    required: ['columns'],
    additionalProperties: false,
    properties: {
      rowKey: { type: 'string', minLength: 1 },
      virtualScroll: { type: 'boolean', default: false },
      rowHeight: { type: 'number', minimum: 24, maximum: 120 },
      pageSize: { type: 'integer', minimum: 1, maximum: 5000 },
      columns: {
        type: 'array',
        minItems: 1,
        items: {
          type: 'object',
          required: ['field', 'header'],
          additionalProperties: false,
          properties: {
            field: { type: 'string', minLength: 1 },
            header: { type: 'string', minLength: 1 },
            width: { type: ['number', 'string'] },
            sortable: { type: 'boolean' },
            filterable: { type: 'boolean' },
            editable: { type: 'boolean' },
            pinned: { type: 'string', enum: ['left', 'right'] },
            align: { type: 'string', enum: ['left', 'center', 'right'] },
          },
        },
      },
    },
  },
  'duix-pivot-grid': {
    $schema: 'https://json-schema.org/draft/2020-12/schema',
    $id: 'https://dotos.dev/schemas/v8/duix-pivot-grid.schema.json',
    title: 'DuixPivotGridSchema',
    description: '@dotos/duix/standalone <duix-standalone-pivot-grid> 多维交叉透视报表契约',
    type: 'object',
    required: ['rows', 'columns', 'measures'],
    additionalProperties: false,
    properties: {
      showGrandTotals: { type: 'boolean', default: true },
      showSubTotals: { type: 'boolean', default: true },
      rows: {
        type: 'array',
        minItems: 1,
        items: {
          type: 'object',
          required: ['field'],
          additionalProperties: false,
          properties: {
            field: { type: 'string', minLength: 1 },
            label: { type: 'string' },
          },
        },
      },
      columns: {
        type: 'array',
        minItems: 1,
        items: {
          type: 'object',
          required: ['field'],
          additionalProperties: false,
          properties: {
            field: { type: 'string', minLength: 1 },
            label: { type: 'string' },
          },
        },
      },
      measures: {
        type: 'array',
        minItems: 1,
        items: {
          type: 'object',
          required: ['field', 'aggregator'],
          additionalProperties: false,
          properties: {
            field: { type: 'string', minLength: 1 },
            label: { type: 'string' },
            aggregator: {
              type: 'string',
              enum: ['sum', 'avg', 'count', 'min', 'max'],
            },
            precision: { type: 'integer', minimum: 0, maximum: 8 },
          },
        },
      },
    },
  },
  'duix-gantt': {
    $schema: 'https://json-schema.org/draft/2020-12/schema',
    $id: 'https://dotos.dev/schemas/v8/duix-gantt.schema.json',
    title: 'DuixGanttSchema',
    description: '@dotos/duix/standalone <duix-standalone-gantt> APS 排程与项目甘特图契约',
    type: 'object',
    required: ['tasks'],
    additionalProperties: false,
    properties: {
      viewMode: {
        type: 'string',
        enum: ['hour', 'day', 'week', 'month', 'quarter'],
        default: 'day',
      },
      showCriticalPath: { type: 'boolean', default: true },
      tasks: {
        type: 'array',
        minItems: 1,
        items: {
          type: 'object',
          required: ['id', 'name', 'startDate', 'endDate'],
          additionalProperties: false,
          properties: {
            id: { type: 'string', minLength: 1 },
            name: { type: 'string', minLength: 1 },
            startDate: { type: 'string', minLength: 8 },
            endDate: { type: 'string', minLength: 8 },
            progress: { type: 'number', minimum: 0, maximum: 100 },
            dependencies: {
              type: 'array',
              items: { type: 'string', minLength: 1 },
            },
            milestone: { type: 'boolean' },
            assignee: { type: 'string' },
          },
        },
      },
    },
  },
  'xdraw-canvas': {
    $schema: 'https://json-schema.org/draft/2020-12/schema',
    $id: 'https://dotos.dev/schemas/v8/xdraw-canvas.schema.json',
    title: 'XdrawCanvasSchema',
    description: '@dotos/xdraw/standalone <xdraw-standalone-canvas> 2D 工业组态与拓扑画布契约',
    type: 'object',
    required: ['nodes'],
    additionalProperties: false,
    properties: {
      layout: {
        type: 'string',
        enum: ['dagre', 'grid', 'circular', 'force'],
      },
      readonly: { type: 'boolean', default: false },
      snapToGrid: { type: 'boolean', default: true },
      nodes: {
        type: 'array',
        minItems: 1,
        items: {
          type: 'object',
          required: ['id', 'x', 'y'],
          additionalProperties: false,
          properties: {
            id: { type: 'string', minLength: 1 },
            label: { type: 'string' },
            shape: {
              type: 'string',
              enum: ['rect', 'circle', 'diamond', 'cylinder', 'plc-node', 'sensor-node'],
            },
            x: { type: 'number' },
            y: { type: 'number' },
            width: { type: 'number', minimum: 16 },
            height: { type: 'number', minimum: 16 },
            status: { type: 'string', enum: ['normal', 'warning', 'alarm', 'offline'] },
          },
        },
      },
      edges: {
        type: 'array',
        items: {
          type: 'object',
          required: ['source', 'target'],
          additionalProperties: false,
          properties: {
            id: { type: 'string', minLength: 1 },
            source: { type: 'string', minLength: 1 },
            target: { type: 'string', minLength: 1 },
            label: { type: 'string' },
            animated: { type: 'boolean' },
          },
        },
      },
    },
  },
};

/**
 * 零 any 纯对象守卫
 */
function isPlainObject(value: unknown): value is Readonly<Record<string, unknown>> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * 非空字符串守卫
 */
function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

/**
 * 有限数值守卫
 */
function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

/**
 * 解析可比较的日期毫秒时间戳（严格校验 YYYY-MM-DD 或 ISO-8601）
 */
function parseDateTimestamp(raw: string): number | null {
  const isoPattern = /^\d{4}-\d{2}-\d{2}(?:[T\s]\d{2}:\d{2}(?::\d{2}(?:\.\d{1,3})?)?(?:Z|[+-]\d{2}:?\d{2})?)?$/;
  if (!isoPattern.test(raw.trim())) {
    return null;
  }
  const ts = Date.parse(raw.trim());
  return Number.isNaN(ts) ? null : ts;
}

/**
 * 校验 dui-form 配置及常见 AI 幻觉
 */
function validateDuiFormConfig(
  root: Readonly<Record<string, unknown>>,
  findings: SchemaFinding[]
): void {
  const allowedRootKeys = new Set(['layout', 'columns', 'fields']);
  for (const key of Object.keys(root)) {
    if (!allowedRootKeys.has(key)) {
      findings.push({
        path: `$.${key}`,
        code: 'UNKNOWN_ROOT_PROPERTY',
        severity: 'warning',
        message: `dui-form 顶层存在未在 Schema 中声明的属性 "${key}"。`,
        hint: `请移除 "${key}"，顶层仅支持 "layout" | "columns" | "fields"。`,
      });
    }
  }

  if (root['layout'] !== undefined) {
    const validLayouts = ['vertical', 'horizontal', 'inline'];
    if (typeof root['layout'] !== 'string' || !validLayouts.includes(root['layout'])) {
      findings.push({
        path: '$.layout',
        code: 'INVALID_FORM_LAYOUT',
        severity: 'error',
        message: `表单 layout 值 "${String(root['layout'])}" 非法。`,
        hint: "请将 $.layout 设置为 'vertical' | 'horizontal' | 'inline' 之一。",
      });
    }
  }

  if (root['columns'] !== undefined) {
    const cols = root['columns'];
    if (typeof cols !== 'number' || !Number.isInteger(cols) || cols < 1 || cols > 6) {
      findings.push({
        path: '$.columns',
        code: 'INVALID_FORM_COLUMNS',
        severity: 'error',
        message: `表单网格列数 columns (${String(cols)}) 必须是 1..6 之间的整数。`,
        hint: '请将 $.columns 修改为 1、2、3 或 4（数字类型，不要加引号）。',
      });
    }
  }

  const fields = root['fields'];
  if (!Array.isArray(fields) || fields.length === 0) {
    const hasItemsAlias = Array.isArray(root['items']) || Array.isArray(root['controls']);
    findings.push({
      path: '$.fields',
      code: 'MISSING_FORM_FIELDS',
      severity: 'error',
      message: 'dui-form 缺失必填的非空字段数组 "fields"。',
      hint: hasItemsAlias
        ? '检测到您使用了 "items" 或 "controls"，请将其属性名重命名为标准字段名 "fields"。'
        : '请在顶层补充非空数组 "fields": [{ "key": "name", "label": "名称", "type": "text" }]。',
    });
    return;
  }

  const validFieldTypes = new Set([
    'text',
    'textarea',
    'number',
    'select',
    'multi-select',
    'switch',
    'checkbox',
    'date',
    'radio',
  ]);

  const fieldTypeAliasHints: Readonly<Record<string, string>> = {
    textfield: 'text',
    input: 'text',
    string: 'text',
    textbox: 'text',
    dropdown: 'select',
    combobox: 'select',
    picker: 'select',
    multiselect: 'multi-select',
    toggle: 'switch',
    boolean: 'switch',
    bool: 'switch',
    int: 'number',
    integer: 'number',
    float: 'number',
    decimal: 'number',
    datepicker: 'date',
    datetime: 'date',
  };

  const seenKeys = new Map<string, number>();

  fields.forEach((rawField, index) => {
    const basePath = `$.fields[${index}]`;
    if (!isPlainObject(rawField)) {
      findings.push({
        path: basePath,
        code: 'INVALID_FIELD_OBJECT',
        severity: 'error',
        message: `${basePath} 必须是字段配置对象。`,
        hint: `请将 ${basePath} 改为包含 { "key", "label", "type" } 的对象。`,
      });
      return;
    }

    const keyVal = rawField['key'];
    if (!isNonEmptyString(keyVal)) {
      const aliasName = isNonEmptyString(rawField['name'])
        ? 'name'
        : isNonEmptyString(rawField['field'])
          ? 'field'
          : null;
      findings.push({
        path: `${basePath}.key`,
        code: 'MISSING_FIELD_KEY',
        severity: 'error',
        message: `${basePath} 缺失唯一字段标识 "key"。`,
        hint: aliasName
          ? `检测到幻觉属性 "${aliasName}"，请将其重命名为 "key": "${String(rawField[aliasName])}"。`
          : `请为 ${basePath} 添加非空字符串属性 "key"（例如 "deviceCode"）。`,
      });
    } else {
      const prevIdx = seenKeys.get(keyVal);
      if (prevIdx !== undefined) {
        findings.push({
          path: `${basePath}.key`,
          code: 'DUPLICATE_FIELD_KEY',
          severity: 'error',
          message: `表单字段 key "${keyVal}" 与 $.fields[${prevIdx}].key 重复。`,
          hint: `请确保每个字段的 "key" 全局唯一，例如将 ${basePath}.key 重命名为 "${keyVal}2" 或更具业务语义的名称。`,
        });
      } else {
        seenKeys.set(keyVal, index);
      }
    }

    if (!isNonEmptyString(rawField['label'])) {
      const hasTitle = isNonEmptyString(rawField['title']);
      findings.push({
        path: `${basePath}.label`,
        code: 'MISSING_FIELD_LABEL',
        severity: 'error',
        message: `${basePath} 缺失展示标签 "label"。`,
        hint: hasTitle
          ? `检测到 "${String(rawField['title'])}" 写在了 "title" 上，请将属性名改为 "label"。`
          : `请为 ${basePath} 添加中文或业务可读的 "label" 字符串。`,
      });
    }

    const typeVal = rawField['type'];
    if (!isNonEmptyString(typeVal)) {
      findings.push({
        path: `${basePath}.type`,
        code: 'MISSING_FIELD_TYPE',
        severity: 'error',
        message: `${basePath} 缺失控件类型 "type"。`,
        hint: "请添加 'type'，可选值：'text' | 'textarea' | 'number' | 'select' | 'multi-select' | 'switch' | 'checkbox' | 'date' | 'radio'。",
      });
    } else if (!validFieldTypes.has(typeVal)) {
      const normalizedType = typeVal.trim().toLowerCase();
      const suggested = fieldTypeAliasHints[normalizedType];
      findings.push({
        path: `${basePath}.type`,
        code: 'INVALID_FIELD_TYPE',
        severity: 'error',
        message: `不支持的表单字段类型 "${typeVal}"。`,
        hint: suggested
          ? `请将 ${basePath}.type 从 '${typeVal}' 修改为标准类型 '${suggested}'（合法枚举：'text' | 'textarea' | 'number' | 'select' | 'multi-select' | 'switch' | 'checkbox' | 'date' | 'radio'）。`
          : `请将 ${basePath}.type 修改为合法类型之一：'text' | 'textarea' | 'number' | 'select' | 'multi-select' | 'switch' | 'checkbox' | 'date' | 'radio'。`,
      });
    } else {
      // 检查枚举类控件必须具备非空 options
      const optionRequiredTypes = new Set(['select', 'multi-select', 'radio']);
      if (optionRequiredTypes.has(typeVal)) {
        const opts = rawField['options'];
        if (!Array.isArray(opts) || opts.length === 0) {
          findings.push({
            path: `${basePath}.options`,
            code: 'MISSING_SELECT_OPTIONS',
            severity: 'error',
            message: `类型为 "${typeVal}" 的字段必须提供非空候选列表 "options"。`,
            hint: `请在 ${basePath} 中添加 "options": [{ "label": "选项一", "value": "opt1" }]。`,
          });
        } else {
          opts.forEach((opt, optIdx) => {
            if (
              !isPlainObject(opt) ||
              !isNonEmptyString(opt['label']) ||
              (typeof opt['value'] !== 'string' &&
                typeof opt['value'] !== 'number' &&
                typeof opt['value'] !== 'boolean')
            ) {
              findings.push({
                path: `${basePath}.options[${optIdx}]`,
                code: 'INVALID_SELECT_OPTION_ITEM',
                severity: 'error',
                message: `${basePath}.options[${optIdx}] 必须包含非空字符串 "label" 与原始值 "value"。`,
                hint: `请将选项改为标准结构 { "label": "显示名", "value": "实际值" }（切勿直接传入纯字符串数组）。`,
              });
            }
          });
        }
      }
    }

    const minVal = rawField['min'];
    const maxVal = rawField['max'];
    if (minVal !== undefined && !isFiniteNumber(minVal)) {
      findings.push({
        path: `${basePath}.min`,
        code: 'INVALID_MIN_VALUE',
        severity: 'error',
        message: `${basePath}.min 必须是有限数字。`,
        hint: `请将 ${basePath}.min 修改为 number 类型数值。`,
      });
    }
    if (maxVal !== undefined && !isFiniteNumber(maxVal)) {
      findings.push({
        path: `${basePath}.max`,
        code: 'INVALID_MAX_VALUE',
        severity: 'error',
        message: `${basePath}.max 必须是有限数字。`,
        hint: `请将 ${basePath}.max 修改为 number 类型数值。`,
      });
    }
    if (isFiniteNumber(minVal) && isFiniteNumber(maxVal) && minVal > maxVal) {
      findings.push({
        path: `${basePath}.min`,
        code: 'MIN_GREATER_THAN_MAX',
        severity: 'error',
        message: `数值下限 min (${minVal}) 大于上限 max (${maxVal})。`,
        hint: `请调换或修正 ${basePath} 的范围约束，确保 min <= max（例如 min: ${maxVal}, max: ${minVal}）。`,
      });
    }

    const minLen = rawField['minLength'];
    const maxLen = rawField['maxLength'];
    if (isFiniteNumber(minLen) && isFiniteNumber(maxLen) && minLen > maxLen) {
      findings.push({
        path: `${basePath}.minLength`,
        code: 'MIN_LENGTH_GREATER_THAN_MAX_LENGTH',
        severity: 'error',
        message: `字符串最小长度 minLength (${minLen}) 大于最大长度 maxLength (${maxLen})。`,
        hint: `请调整 ${basePath} 的长度约束，确保 minLength <= maxLength。`,
      });
    }
  });
}

/**
 * 校验 duix-grid 配置及常见 AI 幻觉
 */
function validateDuixGridConfig(
  root: Readonly<Record<string, unknown>>,
  findings: SchemaFinding[]
): void {
  const columns = root['columns'];
  if (!Array.isArray(columns) || columns.length === 0) {
    const hasColsAlias = Array.isArray(root['cols']) || Array.isArray(root['columnDefs']);
    findings.push({
      path: '$.columns',
      code: 'MISSING_GRID_COLUMNS',
      severity: 'error',
      message: 'duix-grid 缺失必填的非空列定义数组 "columns"。',
      hint: hasColsAlias
        ? '检测到 AG-Grid/其他库风格的 "columnDefs" 或 "cols"，请统一重命名为标准字段 "columns"。'
        : '请在顶层添加非空数组 "columns": [{ "field": "id", "header": "编号", "width": 120 }]。',
    });
  } else {
    const seenFields = new Map<string, number>();

    columns.forEach((rawCol, index) => {
      const basePath = `$.columns[${index}]`;
      if (!isPlainObject(rawCol)) {
        findings.push({
          path: basePath,
          code: 'INVALID_COLUMN_OBJECT',
          severity: 'error',
          message: `${basePath} 必须是列定义对象。`,
          hint: `请将 ${basePath} 修改为 { "field": "字段名", "header": "列标题" } 对象。`,
        });
        return;
      }

      const fieldVal = rawCol['field'];
      if (!isNonEmptyString(fieldVal)) {
        const aliasKey = isNonEmptyString(rawCol['dataIndex'])
          ? 'dataIndex'
          : isNonEmptyString(rawCol['prop'])
            ? 'prop'
            : isNonEmptyString(rawCol['key'])
              ? 'key'
              : null;
        findings.push({
          path: `${basePath}.field`,
          code: 'MISSING_COLUMN_FIELD',
          severity: 'error',
          message: `${basePath} 缺失数据绑定属性名 "field"。`,
          hint: aliasKey
            ? `检测到幻觉属性 "${aliasKey}"，请将其重命名为标准属性 "field": "${String(rawCol[aliasKey])}"。`
            : `请为 ${basePath} 补充非空字符串 "field"（对应行数据对象中的字段键名）。`,
        });
      } else {
        const prevIdx = seenFields.get(fieldVal);
        if (prevIdx !== undefined) {
          findings.push({
            path: `${basePath}.field`,
            code: 'DUPLICATE_COLUMN_FIELD',
            severity: 'error',
            message: `列字段 field "${fieldVal}" 与 $.columns[${prevIdx}].field 重复。`,
            hint: `请移除重复列或为 ${basePath}.field 绑定唯一的数据属性名。`,
          });
        } else {
          seenFields.set(fieldVal, index);
        }
      }

      const headerVal = rawCol['header'];
      if (!isNonEmptyString(headerVal)) {
        const headerAlias = isNonEmptyString(rawCol['headerName'])
          ? 'headerName'
          : isNonEmptyString(rawCol['title'])
            ? 'title'
            : isNonEmptyString(rawCol['label'])
              ? 'label'
              : null;
        findings.push({
          path: `${basePath}.header`,
          code: 'MISSING_COLUMN_HEADER',
          severity: 'error',
          message: `${basePath} 缺失表头显示名称 "header"。`,
          hint: headerAlias
            ? `检测到 "${headerAlias}" 属性，请将其重命名为 DOTOS 标准属性 "header": "${String(rawCol[headerAlias])}"。`
            : `请为 ${basePath} 添加非空字符串 "header"（例如 "设备名称"）。`,
        });
      }

      const widthVal = rawCol['width'];
      if (widthVal !== undefined) {
        if (typeof widthVal === 'number') {
          if (!Number.isFinite(widthVal) || widthVal <= 0) {
            findings.push({
              path: `${basePath}.width`,
              code: 'INVALID_COLUMN_WIDTH',
              severity: 'error',
              message: `${basePath}.width 数值 (${String(widthVal)}) 必须大于 0。`,
              hint: `请将 ${basePath}.width 设置为正整数像素值（例如 140）或百分比字符串（例如 "25%"）。`,
            });
          }
        } else if (typeof widthVal === 'string') {
          const percentPattern = /^(?:100|[1-9]\d?)(?:\.\d+)?%$/;
          const pxMatch = /^(\d+(?:\.\d+)?)px$/i.exec(widthVal.trim());
          if (pxMatch) {
            const numericPx = Number(pxMatch[1]);
            findings.push({
              path: `${basePath}.width`,
              code: 'COLUMN_WIDTH_PX_STRING_HALLUCINATION',
              severity: 'error',
              message: `${basePath}.width 不接受带 "px" 单位的字符串 "${widthVal}"。`,
              hint: `请去掉 "px" 单位与引号，直接改写为数字类型 width: ${numericPx}，或使用合法百分比字符串（如 "20%"）。`,
            });
          } else if (!percentPattern.test(widthVal.trim())) {
            findings.push({
              path: `${basePath}.width`,
              code: 'INVALID_COLUMN_WIDTH',
              severity: 'error',
              message: `${basePath}.width 字符串值 "${widthVal}" 格式非法。`,
              hint: `width 仅支持正数（如 160）或 1%..100% 的百分比字符串（如 "25%"），请修正 ${basePath}.width。`,
            });
          }
        } else {
          findings.push({
            path: `${basePath}.width`,
            code: 'INVALID_COLUMN_WIDTH',
            severity: 'error',
            message: `${basePath}.width 类型非法。`,
            hint: `请将 ${basePath}.width 设为正数（如 140）或百分比字符串（如 "25%"）。`,
          });
        }
      }

      if (rawCol['pinned'] !== undefined) {
        if (rawCol['pinned'] !== 'left' && rawCol['pinned'] !== 'right') {
          findings.push({
            path: `${basePath}.pinned`,
            code: 'INVALID_COLUMN_PINNED',
            severity: 'error',
            message: `${basePath}.pinned 值 "${String(rawCol['pinned'])}" 非法。`,
            hint: "列冻结方向仅支持 'left' 或 'right'（不要传布尔值 true）。",
          });
        }
      }
    });
  }

  // 虚拟滚动未配 rowKey 风险警告
  if (root['virtualScroll'] === true && !isNonEmptyString(root['rowKey'])) {
    findings.push({
      path: '$.rowKey',
      code: 'VIRTUAL_SCROLL_MISSING_ROW_KEY',
      severity: 'warning',
      message: '已开启 virtualScroll: true，但未配置行主键字段 "rowKey"。',
      hint: '请在顶层补充唯一主键字段名，例如 "rowKey": "id"，以保障 Zoneless 虚拟滚动行复用与勾选状态不漂移。',
    });
  }
}

/**
 * 校验 duix-pivot-grid 配置及常见 AI 幻觉
 */
function validateDuixPivotGridConfig(
  root: Readonly<Record<string, unknown>>,
  findings: SchemaFinding[]
): void {
  const rowFields = new Set<string>();

  const validateAxisDimensions = (axisName: 'rows' | 'columns'): void => {
    const dims = root[axisName];
    if (!Array.isArray(dims) || dims.length === 0) {
      findings.push({
        path: `$.${axisName}`,
        code: axisName === 'rows' ? 'MISSING_PIVOT_ROWS' : 'MISSING_PIVOT_COLUMNS',
        severity: 'error',
        message: `duix-pivot-grid 缺失必填的非空维度数组 "${axisName}"。`,
        hint: `请在顶层补充 "${axisName}": [{ "field": "${axisName === 'rows' ? 'region' : 'quarter'}", "label": "${axisName === 'rows' ? '区域' : '季度'}" }]。`,
      });
      return;
    }

    dims.forEach((dim, idx) => {
      const itemPath = `$.${axisName}[${idx}]`;
      if (typeof dim === 'string') {
        findings.push({
          path: itemPath,
          code: 'PIVOT_DIMENSION_STRING_HALLUCINATION',
          severity: 'error',
          message: `${itemPath} 不能直接传入纯字符串 "${dim}"，必须是维度描述对象。`,
          hint: `请将 ${itemPath} 修改为对象格式：{ "field": "${dim}", "label": "${dim}" }。`,
        });
        return;
      }
      if (!isPlainObject(dim) || !isNonEmptyString(dim['field'])) {
        findings.push({
          path: `${itemPath}.field`,
          code: 'MISSING_PIVOT_DIMENSION_FIELD',
          severity: 'error',
          message: `${itemPath} 缺失维度字段名 "field"。`,
          hint: `请为 ${itemPath} 提供非空字符串 "field"，例如 { "field": "department", "label": "部门" }。`,
        });
        return;
      }
      if (axisName === 'rows') {
        rowFields.add(dim['field']);
      } else if (rowFields.has(dim['field'])) {
        findings.push({
          path: `${itemPath}.field`,
          code: 'DUPLICATE_PIVOT_AXIS_FIELD',
          severity: 'warning',
          message: `字段 "${dim['field']}" 同时出现在行维度 rows 与列维度 columns 中。`,
          hint: `请确保行维度与列维度正交，从 $.columns 或 $.rows 中移除重复的 "${dim['field']}"。`,
        });
      }
    });
  };

  validateAxisDimensions('rows');
  validateAxisDimensions('columns');

  const measures = root['measures'];
  if (!Array.isArray(measures) || measures.length === 0) {
    const hasValuesAlias = Array.isArray(root['values']) || Array.isArray(root['metrics']);
    findings.push({
      path: '$.measures',
      code: 'MISSING_PIVOT_MEASURES',
      severity: 'error',
      message: 'duix-pivot-grid 缺失必填的非空指标聚合数组 "measures"。',
      hint: hasValuesAlias
        ? '检测到您使用了 "values" 或 "metrics"，请将其重命名为标准属性 "measures"。'
        : '请在顶层补充 "measures": [{ "field": "amount", "label": "总金额", "aggregator": "sum" }]。',
    });
    return;
  }

  const validAggregators = new Set(['sum', 'avg', 'count', 'min', 'max']);
  const aggregatorAliasHints: Readonly<Record<string, string>> = {
    average: 'avg',
    mean: 'avg',
    total: 'sum',
    add: 'sum',
    cnt: 'count',
    minimum: 'min',
    maximum: 'max',
  };

  measures.forEach((rawMeasure, idx) => {
    const basePath = `$.measures[${idx}]`;
    if (!isPlainObject(rawMeasure)) {
      findings.push({
        path: basePath,
        code: 'INVALID_PIVOT_MEASURE_OBJECT',
        severity: 'error',
        message: `${basePath} 必须是指标聚合配置对象。`,
        hint: `请将 ${basePath} 修改为 { "field": "amount", "label": "金额", "aggregator": "sum" }。`,
      });
      return;
    }

    if (!isNonEmptyString(rawMeasure['field'])) {
      findings.push({
        path: `${basePath}.field`,
        code: 'MISSING_MEASURE_FIELD',
        severity: 'error',
        message: `${basePath} 缺失指标字段名 "field"。`,
        hint: `请在 ${basePath} 中添加要聚合的数值字段名 "field"。`,
      });
    }

    const aggVal = rawMeasure['aggregator'];
    if (!isNonEmptyString(aggVal)) {
      const fnAlias = isNonEmptyString(rawMeasure['aggFunc'])
        ? 'aggFunc'
        : isNonEmptyString(rawMeasure['fn'])
          ? 'fn'
          : null;
      findings.push({
        path: `${basePath}.aggregator`,
        code: 'MISSING_MEASURE_AGGREGATOR',
        severity: 'error',
        message: `${basePath} 缺失聚合函数枚举 "aggregator"。`,
        hint: fnAlias
          ? `检测到幻觉属性 "${fnAlias}"，请将其重命名为 "aggregator"，且取值限定为 'sum' | 'avg' | 'count' | 'min' | 'max'。`
          : "请在指标对象中补充 'aggregator'，合法枚举：'sum' | 'avg' | 'count' | 'min' | 'max'。",
      });
    } else if (!validAggregators.has(aggVal)) {
      const suggested = aggregatorAliasHints[aggVal.trim().toLowerCase()];
      findings.push({
        path: `${basePath}.aggregator`,
        code: 'INVALID_MEASURE_AGGREGATOR',
        severity: 'error',
        message: `透视指标聚合函数 "${aggVal}" 不在支持列表中。`,
        hint: suggested
          ? `请将 ${basePath}.aggregator 从 '${aggVal}' 改为 '${suggested}'（合法枚举：'sum' | 'avg' | 'count' | 'min' | 'max'）。`
          : `请将 ${basePath}.aggregator 修改为合法枚举之一：'sum' | 'avg' | 'count' | 'min' | 'max'。`,
      });
    }
  });
}

/**
 * 校验 duix-gantt 配置及常见 AI 幻觉
 */
function validateDuixGanttConfig(
  root: Readonly<Record<string, unknown>>,
  findings: SchemaFinding[]
): void {
  if (root['viewMode'] !== undefined) {
    const validModes = ['hour', 'day', 'week', 'month', 'quarter'];
    if (typeof root['viewMode'] !== 'string' || !validModes.includes(root['viewMode'])) {
      findings.push({
        path: '$.viewMode',
        code: 'INVALID_GANTT_VIEW_MODE',
        severity: 'error',
        message: `甘特图 viewMode "${String(root['viewMode'])}" 非法。`,
        hint: "请将 $.viewMode 修改为 'hour' | 'day' | 'week' | 'month' | 'quarter' 之一。",
      });
    }
  }

  const tasks = root['tasks'];
  if (!Array.isArray(tasks) || tasks.length === 0) {
    const hasDataAlias = Array.isArray(root['data']) || Array.isArray(root['items']);
    findings.push({
      path: '$.tasks',
      code: 'MISSING_GANTT_TASKS',
      severity: 'error',
      message: 'duix-gantt 缺失必填的非空排程任务数组 "tasks"。',
      hint: hasDataAlias
        ? '检测到您使用了 "data" 或 "items"，请重命名为标准属性 "tasks"。'
        : '请在顶层提供非空数组 "tasks": [{ "id": "T-1", "name": "工序一", "startDate": "2026-11-15", "endDate": "2026-11-18" }]。',
    });
    return;
  }

  // 第一遍扫描收集全部合法任务 ID，以供第二遍做悬空依赖检查
  const knownTaskIds = new Set<string>();
  tasks.forEach((rawTask, index) => {
    if (isPlainObject(rawTask) && isNonEmptyString(rawTask['id'])) {
      if (knownTaskIds.has(rawTask['id'])) {
        findings.push({
          path: `$.tasks[${index}].id`,
          code: 'DUPLICATE_TASK_ID',
          severity: 'error',
          message: `甘特图任务 id "${rawTask['id']}" 重复。`,
          hint: `请为 $.tasks[${index}].id 分配全局唯一的字符串标识。`,
        });
      } else {
        knownTaskIds.add(rawTask['id']);
      }
    }
  });

  const validTaskIdPreview = Array.from(knownTaskIds).slice(0, 6).join(', ');

  tasks.forEach((rawTask, index) => {
    const basePath = `$.tasks[${index}]`;
    if (!isPlainObject(rawTask)) {
      findings.push({
        path: basePath,
        code: 'INVALID_GANTT_TASK_OBJECT',
        severity: 'error',
        message: `${basePath} 必须是任务对象。`,
        hint: `请将 ${basePath} 改为包含 { "id", "name", "startDate", "endDate" } 的对象。`,
      });
      return;
    }

    const taskId = isNonEmptyString(rawTask['id']) ? rawTask['id'] : null;
    if (!taskId) {
      findings.push({
        path: `${basePath}.id`,
        code: 'MISSING_TASK_ID',
        severity: 'error',
        message: `${basePath} 缺失必填的任务唯一标识 "id"。`,
        hint: `请为 ${basePath} 添加非空字符串 "id"（例如 "T-${index + 1}"）。`,
      });
    }

    if (!isNonEmptyString(rawTask['name'])) {
      const titleAlias = isNonEmptyString(rawTask['title'])
        ? 'title'
        : isNonEmptyString(rawTask['label'])
          ? 'label'
          : null;
      findings.push({
        path: `${basePath}.name`,
        code: 'MISSING_TASK_NAME',
        severity: 'error',
        message: `${basePath} 缺失必填的任务名称 "name"。`,
        hint: titleAlias
          ? `检测到 "${titleAlias}" 属性，请将其重命名为标准属性 "name": "${String(rawTask[titleAlias])}"。`
          : `请在 ${basePath} 中添加非空字符串 "name"。`,
      });
    }

    const startRaw = rawTask['startDate'];
    const endRaw = rawTask['endDate'];
    let startTs: number | null = null;
    let endTs: number | null = null;

    if (!isNonEmptyString(startRaw)) {
      const startAlias = isNonEmptyString(rawTask['start']) ? 'start' : null;
      findings.push({
        path: `${basePath}.startDate`,
        code: 'MISSING_TASK_START_DATE',
        severity: 'error',
        message: `${basePath} 缺失开始日期 "startDate"。`,
        hint: startAlias
          ? `检测到属性 "start"，请将其重命名为 "startDate": "${String(rawTask['start'])}"。`
          : `请在 ${basePath} 中补充 ISO 日期字符串 "startDate"（如 "2026-11-15"）。`,
      });
    } else {
      startTs = parseDateTimestamp(startRaw);
      if (startTs === null) {
        findings.push({
          path: `${basePath}.startDate`,
          code: 'INVALID_TASK_DATE_FORMAT',
          severity: 'error',
          message: `${basePath}.startDate ("${startRaw}") 不是合法的 YYYY-MM-DD 或 ISO-8601 日期。`,
          hint: '请使用标准 ISO 日期格式，例如 "2026-11-15" 或 "2026-11-15T08:00:00Z"。',
        });
      }
    }

    if (!isNonEmptyString(endRaw)) {
      const endAlias = isNonEmptyString(rawTask['end']) ? 'end' : null;
      findings.push({
        path: `${basePath}.endDate`,
        code: 'MISSING_TASK_END_DATE',
        severity: 'error',
        message: `${basePath} 缺失结束日期 "endDate"。`,
        hint: endAlias
          ? `检测到属性 "end"，请将其重命名为 "endDate": "${String(rawTask['end'])}"。`
          : `请在 ${basePath} 中补充 ISO 日期字符串 "endDate"（如 "2026-11-20"）。`,
      });
    } else {
      endTs = parseDateTimestamp(endRaw);
      if (endTs === null) {
        findings.push({
          path: `${basePath}.endDate`,
          code: 'INVALID_TASK_DATE_FORMAT',
          severity: 'error',
          message: `${basePath}.endDate ("${endRaw}") 不是合法的 YYYY-MM-DD 或 ISO-8601 日期。`,
          hint: '请使用标准 ISO 日期格式，例如 "2026-11-20" 或 "2026-11-20T18:00:00Z"。',
        });
      }
    }

    if (startTs !== null && endTs !== null && endTs < startTs) {
      findings.push({
        path: `${basePath}.endDate`,
        code: 'END_DATE_BEFORE_START_DATE',
        severity: 'error',
        message: `任务 "${taskId ?? index}" 出现时序倒置：endDate (${String(endRaw)}) 早于 startDate (${String(startRaw)})。`,
        hint: `请调换起止日期或延长 ${basePath}.endDate，确保 endDate >= startDate（当前 startDate 为 "${String(startRaw)}"）。`,
      });
    }

    if (rawTask['progress'] !== undefined) {
      const prog = rawTask['progress'];
      if (!isFiniteNumber(prog) || prog < 0 || prog > 100) {
        findings.push({
          path: `${basePath}.progress`,
          code: 'PROGRESS_OUT_OF_RANGE',
          severity: 'error',
          message: `${basePath}.progress (${String(prog)}) 超出合法的百分比区间 0..100。`,
          hint: `请将 ${basePath}.progress 修正为 0 到 100 之间的数字（例如 50 表示完成 50%）。`,
        });
      }
    }

    if (rawTask['dependencies'] !== undefined) {
      const deps = rawTask['dependencies'];
      if (!Array.isArray(deps)) {
        findings.push({
          path: `${basePath}.dependencies`,
          code: 'INVALID_TASK_DEPENDENCIES_TYPE',
          severity: 'error',
          message: `${basePath}.dependencies 必须是前置任务 ID 字符串数组。`,
          hint: `请将 ${basePath}.dependencies 修改为字符串数组，例如 ["${Array.from(knownTaskIds)[0] ?? 'T-100'}"]。`,
        });
      } else {
        deps.forEach((depId, depIdx) => {
          const depPath = `${basePath}.dependencies[${depIdx}]`;
          if (!isNonEmptyString(depId)) {
            findings.push({
              path: depPath,
              code: 'INVALID_DEPENDENCY_ID',
              severity: 'error',
              message: `${depPath} 必须是非空任务 ID 字符串。`,
              hint: `请将 ${depPath} 修改为已存在的任务 ID（当前有效任务 ID：${validTaskIdPreview || '无'}）。`,
            });
          } else if (taskId !== null && depId === taskId) {
            findings.push({
              path: depPath,
              code: 'SELF_TASK_DEPENDENCY',
              severity: 'error',
              message: `任务 "${taskId}" 的 dependencies 不能自引用自身。`,
              hint: `请从 ${basePath}.dependencies 中移除自身 ID "${taskId}"。`,
            });
          } else if (!knownTaskIds.has(depId)) {
            findings.push({
              path: depPath,
              code: 'DANGLING_TASK_DEPENDENCY',
              severity: 'error',
              message: `${depPath} 引用了不存在的前置任务 ID "${depId}"。`,
              hint: knownTaskIds.size > 0
                ? `请将 "${depId}" 修正为 tasks 中实际存在的任务 ID（可选：${validTaskIdPreview}），或先在 tasks 中补充 id="${depId}" 的任务节点。`
                : `请先在 tasks 数组中定义被依赖的任务 "${depId}"。`,
            });
          }
        });
      }
    }
  });
}

/**
 * 校验 xdraw-canvas 配置及常见 AI 幻觉（含悬空边与未知布局算法自愈）
 */
function validateXdrawCanvasConfig(
  root: Readonly<Record<string, unknown>>,
  findings: SchemaFinding[]
): void {
  const validLayouts = new Set(['dagre', 'grid', 'circular', 'force']);
  if (root['layout'] !== undefined) {
    const rawLayout = root['layout'];
    if (typeof rawLayout !== 'string' || !validLayouts.has(rawLayout)) {
      findings.push({
        path: '$.layout',
        code: 'INVALID_LAYOUT_ALGORITHM',
        severity: 'error',
        message: `xdraw-canvas 不支持布局算法 "${String(rawLayout)}"。`,
        hint: "请将 $.layout 修改为官方内置布局算法之一：'dagre' | 'grid' | 'circular' | 'force'（有向拓扑推荐 'dagre'）。",
      });
    }
  }

  const nodes = root['nodes'];
  if (!Array.isArray(nodes) || nodes.length === 0) {
    findings.push({
      path: '$.nodes',
      code: 'MISSING_CANVAS_NODES',
      severity: 'error',
      message: 'xdraw-canvas 缺失必填的非空图元节点数组 "nodes"。',
      hint: '请在顶层补充非空数组 "nodes": [{ "id": "node-1", "label": "PLC主站", "x": 100, "y": 120 }]。',
    });
    return;
  }

  const knownNodeIds = new Set<string>();

  nodes.forEach((rawNode, index) => {
    const basePath = `$.nodes[${index}]`;
    if (!isPlainObject(rawNode)) {
      findings.push({
        path: basePath,
        code: 'INVALID_CANVAS_NODE_OBJECT',
        severity: 'error',
        message: `${basePath} 必须是图元节点对象。`,
        hint: `请将 ${basePath} 修改为 { "id": "node-${index + 1}", "label": "节点", "x": 100, "y": 100 }。`,
      });
      return;
    }

    const nodeId = rawNode['id'];
    if (!isNonEmptyString(nodeId)) {
      findings.push({
        path: `${basePath}.id`,
        code: 'MISSING_NODE_ID',
        severity: 'error',
        message: `${basePath} 缺失唯一节点标识 "id"。`,
        hint: `请为 ${basePath} 添加非空唯一字符串 "id"（例如 "plc-${index + 1}"）。`,
      });
    } else if (knownNodeIds.has(nodeId)) {
      findings.push({
        path: `${basePath}.id`,
        code: 'DUPLICATE_NODE_ID',
        severity: 'error',
        message: `画布节点 id "${nodeId}" 重复。`,
        hint: `请确保所有 nodes 的 "id" 唯一，将 ${basePath}.id 修改为不重复的标识。`,
      });
    } else {
      knownNodeIds.add(nodeId);
    }

    const hasNestedPosition = isPlainObject(rawNode['position']);
    if (!isFiniteNumber(rawNode['x'])) {
      findings.push({
        path: `${basePath}.x`,
        code: 'MISSING_NODE_COORDINATE_X',
        severity: 'error',
        message: `${basePath} 缺失数值型水平坐标 "x"。`,
        hint: hasNestedPosition
          ? `检测到嵌套的 "position" 对象，请将其扁平化提升为节点顶层数字属性 "x" 与 "y"（如 "x": 120, "y": 160）。`
          : `请在 ${basePath} 顶层补充数字类型坐标 "x"（例如 "x": ${100 + index * 180}）。`,
      });
    }
    if (!isFiniteNumber(rawNode['y'])) {
      findings.push({
        path: `${basePath}.y`,
        code: 'MISSING_NODE_COORDINATE_Y',
        severity: 'error',
        message: `${basePath} 缺失数值型垂直坐标 "y"。`,
        hint: hasNestedPosition
          ? `请移除嵌套 "position"，直接在 ${basePath} 顶层声明数值属性 "y"（如 "y": 160）。`
          : `请在 ${basePath} 顶层补充数字类型坐标 "y"（例如 "y": 160）。`,
      });
    }
  });

  const nodeIdPreview = Array.from(knownNodeIds).slice(0, 8).join(', ');

  if (root['edges'] !== undefined) {
    const edges = root['edges'];
    if (!Array.isArray(edges)) {
      findings.push({
        path: '$.edges',
        code: 'INVALID_CANVAS_EDGES_TYPE',
        severity: 'error',
        message: '$.edges 必须是连线对象数组。',
        hint: '请将 $.edges 修改为数组格式：[{ "id": "e-1", "source": "源节点ID", "target": "目标节点ID" }]。',
      });
      return;
    }

    edges.forEach((rawEdge, index) => {
      const basePath = `$.edges[${index}]`;
      if (!isPlainObject(rawEdge)) {
        findings.push({
          path: basePath,
          code: 'INVALID_CANVAS_EDGE_OBJECT',
          severity: 'error',
          message: `${basePath} 必须是连线配置对象。`,
          hint: `请将 ${basePath} 修改为 { "source": "源节点ID", "target": "目标节点ID" }。`,
        });
        return;
      }

      const sourceVal = rawEdge['source'];
      const targetVal = rawEdge['target'];

      if (!isNonEmptyString(sourceVal)) {
        const fromAlias = isNonEmptyString(rawEdge['from']) ? 'from' : null;
        findings.push({
          path: `${basePath}.source`,
          code: 'MISSING_EDGE_SOURCE',
          severity: 'error',
          message: `${basePath} 缺失连线起点属性 "source"。`,
          hint: fromAlias
            ? `检测到属性 "from"，请重命名为标准属性 "source": "${String(rawEdge['from'])}"。`
            : `请在 ${basePath} 中添加指向合法节点 ID 的 "source"（可选节点：${nodeIdPreview}）。`,
        });
      } else if (!knownNodeIds.has(sourceVal)) {
        findings.push({
          path: `${basePath}.source`,
          code: 'DANGLING_EDGE_SOURCE',
          severity: 'error',
          message: `悬空连线起点：${basePath}.source 引用了不存在的节点 ID "${sourceVal}"。`,
          hint: `请将 ${basePath}.source 修改为 $.nodes 中已定义的节点 ID（当前可用节点 ID：${nodeIdPreview || '无'}），或在 $.nodes 中补充 id="${sourceVal}" 的节点。`,
        });
      }

      if (!isNonEmptyString(targetVal)) {
        const toAlias = isNonEmptyString(rawEdge['to']) ? 'to' : null;
        findings.push({
          path: `${basePath}.target`,
          code: 'MISSING_EDGE_TARGET',
          severity: 'error',
          message: `${basePath} 缺失连线终点属性 "target"。`,
          hint: toAlias
            ? `检测到属性 "to"，请重命名为标准属性 "target": "${String(rawEdge['to'])}"。`
            : `请在 ${basePath} 中添加指向合法节点 ID 的 "target"（可选节点：${nodeIdPreview}）。`,
        });
      } else if (!knownNodeIds.has(targetVal)) {
        findings.push({
          path: `${basePath}.target`,
          code: 'DANGLING_EDGE_TARGET',
          severity: 'error',
          message: `悬空连线终点：${basePath}.target 引用了不存在的节点 ID "${targetVal}"。`,
          hint: `请将 ${basePath}.target 修改为 $.nodes 中已定义的节点 ID（当前可用节点 ID：${nodeIdPreview || '无'}），或在 $.nodes 中补充 id="${targetVal}" 的节点。`,
        });
      }
    });
  }
}

/**
 * 执行工具 3：对目标复杂组件的 Schema 配置执行 Draft 2020-12 结构与深度语义自愈校验
 */
export function executeValidateSchema(
  target: SchemaTarget,
  rawConfig: unknown
): ValidateSchemaOutput {
  const schemaDef = DOTOS_JSON_SCHEMAS[target];
  const schemaUri = schemaDef.$id ?? `https://dotos.dev/schemas/v8/${target}.schema.json`;
  const findings: SchemaFinding[] = [];

  let parsedConfig: unknown = rawConfig;
  if (typeof rawConfig === 'string') {
    try {
      parsedConfig = JSON.parse(rawConfig) as unknown;
    } catch (err: unknown) {
      const detail = err instanceof Error ? err.message : String(err);
      return {
        valid: false,
        target,
        schemaUri,
        summary: `[${target}] JSON 字符串语法解析失败（共 1 个错误）。`,
        findings: [
          {
            path: '$',
            code: 'INVALID_JSON_SYNTAX',
            severity: 'error',
            message: `无法解析传入的 JSON 字符串：${detail}`,
            hint: '请检查 JSON 字符串是否存在尾随逗号、单引号或未闭合括号，或者直接传入合法 JSON 对象。',
          },
        ],
      };
    }
  }

  if (!isPlainObject(parsedConfig)) {
    return {
      valid: false,
      target,
      schemaUri,
      summary: `[${target}] 根配置必须是 JSON 对象（共 1 个错误）。`,
      findings: [
        {
          path: '$',
          code: 'ROOT_MUST_BE_OBJECT',
          severity: 'error',
          message: `期望顶层配置为 JSON 对象（object），但实际收到 ${Array.isArray(parsedConfig) ? 'array' : typeof parsedConfig}。`,
          hint: `请将 ${target} 配置包装为标准顶层对象（参考 ${schemaUri}）。`,
        },
      ],
    };
  }

  switch (target) {
    case 'dui-form':
      validateDuiFormConfig(parsedConfig, findings);
      break;
    case 'duix-grid':
      validateDuixGridConfig(parsedConfig, findings);
      break;
    case 'duix-pivot-grid':
      validateDuixPivotGridConfig(parsedConfig, findings);
      break;
    case 'duix-gantt':
      validateDuixGanttConfig(parsedConfig, findings);
      break;
    case 'xdraw-canvas':
      validateXdrawCanvasConfig(parsedConfig, findings);
      break;
  }

  const errorCount = findings.filter((f) => f.severity === 'error').length;
  const warningCount = findings.filter((f) => f.severity === 'warning').length;
  const valid = errorCount === 0;

  let summary: string;
  if (valid && warningCount === 0) {
    summary = `[${target}] Schema 校验完全通过（0 错误，0 警告），可安全绑定至 Standalone Signal 组件。`;
  } else if (valid) {
    summary = `[${target}] Schema 校验通过（0 错误，${warningCount} 条优化警告），建议参考 hint 进一步加固。`;
  } else {
    summary = `[${target}] Schema 校验未通过：共发现 ${errorCount} 个阻断错误、${warningCount} 条警告，请严格按 findings[].hint 逐项自愈修正后重新校验。`;
  }

  return {
    valid,
    target,
    schemaUri,
    summary,
    findings,
  };
}
