/**
 * @fileoverview @dotos1/mcp 编程式公共入口导出
 */

export {
  DOTOS_ANTI_PATTERN_BANS,
  DOTOS_COMPONENT_CATALOG,
  executeGetComponentApiAndExample,
  executeListDotosComponents,
} from './catalog.js';

export {
  DOTOS_MCP_SERVER_NAME,
  DOTOS_MCP_SERVER_VERSION,
  createDotosMcpServer,
  type DotosMcpServerOptions,
} from './server.js';

export {
  DOTOS_JSON_SCHEMAS,
  VALID_SCHEMA_TARGETS,
  executeValidateSchema,
} from './validator.js';

export type {
  AntiPatternRule,
  ComponentApiNotFoundOutput,
  ComponentApiSuccessOutput,
  ComponentCatalogEntry,
  ComponentCategory,
  ComponentSummaryItem,
  CssTokenHook,
  DotosPackageFilter,
  DotosPackageName,
  GetComponentApiInput,
  GetComponentApiOutput,
  HeadlessCommandSignature,
  JsonArray,
  JsonObject,
  JsonPrimitive,
  JsonSchemaDraft202012,
  JsonValue,
  ListComponentsInput,
  ListComponentsOutput,
  SchemaFinding,
  SchemaTarget,
  SelectionDecisionRow,
  SignalContractItem,
  ValidateSchemaInput,
  ValidateSchemaOutput,
} from './types.js';
