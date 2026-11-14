/**
 * @fileoverview Module `src/schema/public-api.ts` exposing public schema types, JSON Schema, and validator.
 * @zh 模块文件 `src/schema/public-api.ts`，公开导出零 `any` 表单 Schema 类型、Draft 2020-12 JSON Schema 与结构化校验器。
 */

export {
  DUI_FORM_DENSITIES,
  DUI_FORM_FIELD_TYPES,
  DUI_FORM_JSON_SCHEMA,
  DuiFormDensity,
  DuiFormFieldConfig,
  DuiFormFieldOption,
  DuiFormFieldType,
  DuiFormPrimitiveValue,
  DuiFormSchema,
  DuiJsonSchemaObject,
  DuiSchemaFinding,
  DuiSchemaFindingSeverity,
  DuiSchemaValidationResult,
  validateDuiFormSchema,
} from './form-schema';
