/**
 * @fileoverview DOTOS Angular 22 组件库 MCP Server 核心类型契约定义（100% 零 any）
 */

/**
 * 支持的组件库官方包名枚举
 */
export type DotosPackageName = '@dotos/dui' | '@dotos/duix' | '@dotos/xdraw';

/**
 * 组件列表查询时的包过滤枚举
 */
export type DotosPackageFilter = 'all' | DotosPackageName;

/**
 * 组件功能分类枚举
 */
export type ComponentCategory =
  | 'form'
  | 'data-grid'
  | 'bi-analytics'
  | 'gantt-schedule'
  | 'layout-dock'
  | 'navigation-tree'
  | 'diagram-2d'
  | 'feedback';

/**
 * 支持 Schema 闭环自愈校验的五大核心复杂控件标识
 */
export type SchemaTarget =
  | 'dui-form'
  | 'duix-grid'
  | 'duix-pivot-grid'
  | 'duix-gantt'
  | 'xdraw-canvas';

/**
 * 严格 JSON 基础值类型（零 any）
 */
export type JsonPrimitive = string | number | boolean | null;

/**
 * 严格 JSON 数组类型（零 any）
 */
export type JsonArray = readonly JsonValue[];

/**
 * 严格 JSON 对象类型（零 any）
 */
export interface JsonObject {
  readonly [key: string]: JsonValue | undefined;
}

/**
 * 严格递归 JSON 值类型（零 any）
 */
export type JsonValue = JsonPrimitive | JsonObject | JsonArray;

/**
 * Draft 2020-12 JSON Schema 强类型结构表示（零 any）
 */
export interface JsonSchemaDraft202012 {
  readonly $schema?: 'https://json-schema.org/draft/2020-12/schema';
  readonly $id?: string;
  readonly title?: string;
  readonly description?: string;
  readonly type?: 'object' | 'array' | 'string' | 'number' | 'integer' | 'boolean' | readonly string[];
  readonly required?: readonly string[];
  readonly additionalProperties?: boolean | JsonSchemaDraft202012;
  readonly properties?: Readonly<Record<string, JsonSchemaDraft202012>>;
  readonly items?: JsonSchemaDraft202012;
  readonly enum?: readonly JsonPrimitive[];
  readonly minimum?: number;
  readonly maximum?: number;
  readonly minLength?: number;
  readonly minItems?: number;
  readonly pattern?: string;
  readonly default?: JsonValue;
}

/**
 * Signal 输入输出端口契约项（input / model / output）
 */
export interface SignalContractItem {
  /** 属性或事件名称 */
  readonly name: string;
  /** Angular 22 Signal 端口类型 */
  readonly kind: 'input' | 'model' | 'output';
  /** 是否必填（对应 input.required） */
  readonly required: boolean;
  /** 完整零 any TypeScript 类型签名 */
  readonly typeSignature: string;
  /** 默认值说明（可选） */
  readonly defaultValue?: string;
  /** 中文语义说明 */
  readonly description: string;
}

/**
 * Headless Command API 方法签名描述
 */
export interface HeadlessCommandSignature {
  /** 方法名称 */
  readonly method: string;
  /** 完整方法签名 */
  readonly signature: string;
  /** 返回值类型 */
  readonly returnType: string;
  /** 中文用途说明 */
  readonly description: string;
}

/**
 * Material 3 / DOTOS CSS 变量定制钩子描述
 */
export interface CssTokenHook {
  /** CSS 自定义属性名（--mat-sys-* 或 --dui-*） */
  readonly token: string;
  /** 默认回退值或推荐令牌映射 */
  readonly fallback: string;
  /** 视觉作用范围说明 */
  readonly description: string;
}

/**
 * Angular 22 Zoneless + Standalone 强制反模式禁令条目
 */
export interface AntiPatternRule {
  /** 禁令编号 */
  readonly id: string;
  /** 严禁出现的反模式写法 */
  readonly forbidden: string;
  /** 标准合规替代方案 */
  readonly replacement: string;
  /** 禁止原因说明 */
  readonly reason: string;
}

/**
 * 组件完整元数据注册表条目
 */
export interface ComponentCatalogEntry {
  /** 归属包名 */
  readonly packageName: DotosPackageName;
  /** 开源或许可证层级说明 */
  readonly licenseTier: 'MIT Open Source' | 'Enterprise BI Pro' | 'Industrial 2D Topology';
  /** 标准 Standalone 导入子路径 */
  readonly standaloneImportPath: string;
  /** 配套 Schema / 类型导入子路径 */
  readonly schemaImportPath: string;
  /** 标准 HTML 选择器（不含尖括号，如 dui-standalone-button） */
  readonly selector: string;
  /** 带尖括号标签展示名（如 <dui-standalone-button>） */
  readonly tag: string;
  /** 导出的 Standalone 组件类名 */
  readonly className: string;
  /** 支持智能归一化的短选择器与常见别名 */
  readonly aliases: readonly string[];
  /** 组件功能分类 */
  readonly category: ComponentCategory;
  /** 是否原生 100% 兼容 Angular 22 Zoneless 模式 */
  readonly zonelessCompatible: boolean;
  /** 关联的 validate_schema 校验目标（若支持 Schema 驱动） */
  readonly schemaTarget?: SchemaTarget;
  /** 适用业务场景列表 */
  readonly scenarios: readonly string[];
  /** 一句话选型建议 */
  readonly recommendation: string;
  /** 全部零 any Signal 输入/双向绑定/输出契约 */
  readonly signalContracts: readonly SignalContractItem[];
  /** 组件暴露的 Headless Command API 方法签名 */
  readonly headlessCommands: readonly HeadlessCommandSignature[];
  /** M3 / DOTOS CSS 变量定制钩子 */
  readonly cssTokens: readonly CssTokenHook[];
  /** 最小可独立编译的单文件黄金组件完整 TS 源码示例 */
  readonly goldenExampleTs: string;
}

/**
 * 工具 1：list_dotos_components 输入参数
 */
export interface ListComponentsInput {
  readonly package?: DotosPackageFilter;
  readonly category?: ComponentCategory;
  readonly zonelessOnly?: boolean;
  readonly query?: string;
}

/**
 * 组件目录摘要项
 */
export interface ComponentSummaryItem {
  readonly packageName: DotosPackageName;
  readonly licenseTier: string;
  readonly importEntry: string;
  readonly schemaEntry: string;
  readonly selector: string;
  readonly tag: string;
  readonly className: string;
  readonly category: ComponentCategory;
  readonly zonelessCompatible: boolean;
  readonly schemaTarget?: SchemaTarget;
  readonly scenarios: readonly string[];
  readonly recommendation: string;
}

/**
 * 组件选型决策表行定义
 */
export interface SelectionDecisionRow {
  readonly scenarioRequirement: string;
  readonly recommendedTag: string;
  readonly importEntry: string;
  readonly category: ComponentCategory;
  readonly rationale: string;
}

/**
 * 工具 1：list_dotos_components 返回结果
 */
export interface ListComponentsOutput {
  readonly totalCount: number;
  readonly appliedFilters: {
    readonly package: DotosPackageFilter;
    readonly category: ComponentCategory | 'all';
    readonly zonelessOnly: boolean;
    readonly query: string;
  };
  readonly packageOverview: ReadonlyArray<{
    readonly packageName: DotosPackageName;
    readonly standaloneEntry: string;
    readonly positioning: string;
    readonly componentCount: number;
  }>;
  readonly components: readonly ComponentSummaryItem[];
  readonly decisionMatrix: readonly SelectionDecisionRow[];
}

/**
 * 工具 2：get_component_api_and_example 输入参数
 */
export interface GetComponentApiInput {
  readonly component: string;
}

/**
 * 工具 2：命中组件时的完整 API 与黄金示例输出
 */
export interface ComponentApiSuccessOutput {
  readonly found: true;
  readonly requestedName: string;
  readonly resolvedSelector: string;
  readonly tag: string;
  readonly className: string;
  readonly packageName: DotosPackageName;
  readonly category: ComponentCategory;
  readonly zonelessCompatible: boolean;
  readonly schemaTarget?: SchemaTarget;
  readonly imports: {
    readonly standaloneImportPath: string;
    readonly schemaImportPath: string;
    readonly importStatement: string;
  };
  readonly signalContracts: readonly SignalContractItem[];
  readonly headlessCommandApi: readonly HeadlessCommandSignature[];
  readonly cssTokenHooks: readonly CssTokenHook[];
  readonly antiPatternBans: readonly AntiPatternRule[];
  readonly goldenStandaloneExample: string;
}

/**
 * 工具 2：未命中组件时的友好错误与候选建议输出
 */
export interface ComponentApiNotFoundOutput {
  readonly found: false;
  readonly requestedName: string;
  readonly error: string;
  readonly hint: string;
  readonly candidates: ReadonlyArray<{
    readonly selector: string;
    readonly tag: string;
    readonly className: string;
    readonly packageName: DotosPackageName;
  }>;
}

/**
 * 工具 2：get_component_api_and_example 联合返回类型
 */
export type GetComponentApiOutput = ComponentApiSuccessOutput | ComponentApiNotFoundOutput;

/**
 * 工具 3：validate_schema 输入参数
 */
export interface ValidateSchemaInput {
  readonly target: SchemaTarget;
  readonly config: string | Readonly<Record<string, unknown>>;
}

/**
 * Schema 闭环自愈单条诊断问题与修复指引（严格遵循 M2.5-4 契约）
 */
export interface SchemaFinding {
  path: string;
  code: string;
  severity: 'error' | 'warning';
  message: string;
  hint: string;
}

/**
 * 工具 3：validate_schema 返回结果（严格遵循 M2.5-4 契约）
 */
export interface ValidateSchemaOutput {
  valid: boolean;
  target: string;
  schemaUri: string;
  summary: string;
  findings: SchemaFinding[];
}
