/**
 * @fileoverview Module `projects/testdui/src/app/docs/models/api-record.model.ts` providing api record model definitions and implementation.
 * @zh 模块文件 `projects/testdui/src/app/docs/models/api-record.model.ts`，提供API接口记录模型相关的定义与实现。
 */

/**
 * Type alias `ApiExportKind` representing api export kind (`| 'component' | 'directive' | 'service' | 'pipe' | 'module' | 'class'...`).
 * @zh 类型别名 `ApiExportKind`，表示API接口导出种类（`| 'component' | 'directive' | 'service' | 'pipe' | 'module' | 'class'...`）。
 */
export type ApiExportKind =
  | 'component'
  | 'directive'
  | 'service'
  | 'pipe'
  | 'module'
  | 'class'
  | 'interface'
  | 'enum'
  | 'constant'
  | 'function'
  | 'type';

/**
 * Interface `ApiInput` defining the contract and properties for api input.
 * @zh 接口 `ApiInput`，定义API接口输入属性的数据结构契约与属性规范。
 */
export interface ApiInput {
  /**
   * Property `name` (`string`) storing name.
   * @zh 属性 `name`（类型：`string`），用于存储或配置名称。
   */
  name: string;
  /**
   * Property `alias` (`string`) storing alias.
   * @zh 属性 `alias`（类型：`string`），用于存储或配置alias。
   */
  alias?: string;
  /**
   * Property `type` (`string`) storing type.
   * @zh 属性 `type`（类型：`string`），用于存储或配置类型。
   */
  type: string;
  /**
   * Property `default` (`string`) storing default.
   * @zh 属性 `default`（类型：`string`），用于存储或配置默认。
   */
  default?: string;
  /**
   * Property `description` (`string | null`) storing description.
   * @zh 属性 `description`（类型：`string | null`），用于存储或配置描述。
   */
  description: string | null;
  /**
   * Property `descriptionZh` (`string | null`) storing description zh.
   * @zh 属性 `descriptionZh`（类型：`string | null`），用于存储或配置描述Zh。
   */
  descriptionZh: string | null;
}

/**
 * Interface `ApiOutput` defining the contract and properties for api output.
 * @zh 接口 `ApiOutput`，定义API接口输出事件的数据结构契约与属性规范。
 */
export interface ApiOutput {
  /**
   * Property `name` (`string`) storing name.
   * @zh 属性 `name`（类型：`string`），用于存储或配置名称。
   */
  name: string;
  /**
   * Property `type` (`string`) storing type.
   * @zh 属性 `type`（类型：`string`），用于存储或配置类型。
   */
  type: string;
  /**
   * Property `description` (`string | null`) storing description.
   * @zh 属性 `description`（类型：`string | null`），用于存储或配置描述。
   */
  description: string | null;
  /**
   * Property `descriptionZh` (`string | null`) storing description zh.
   * @zh 属性 `descriptionZh`（类型：`string | null`），用于存储或配置描述Zh。
   */
  descriptionZh: string | null;
}

/**
 * Interface `ApiMethodParam` defining the contract and properties for api method param.
 * @zh 接口 `ApiMethodParam`，定义API接口方法参数的数据结构契约与属性规范。
 */
export interface ApiMethodParam {
  /**
   * Property `name` (`string`) storing name.
   * @zh 属性 `name`（类型：`string`），用于存储或配置名称。
   */
  name: string;
  /**
   * Property `type` (`string`) storing type.
   * @zh 属性 `type`（类型：`string`），用于存储或配置类型。
   */
  type: string;
}

/**
 * Interface `ApiMethod` defining the contract and properties for api method.
 * @zh 接口 `ApiMethod`，定义API接口方法的数据结构契约与属性规范。
 */
export interface ApiMethod {
  /**
   * Property `name` (`string`) storing name.
   * @zh 属性 `name`（类型：`string`），用于存储或配置名称。
   */
  name: string;
  /**
   * Property `params` (`ApiMethodParam[]`) storing params.
   * @zh 属性 `params`（类型：`ApiMethodParam[]`），用于存储或配置参数集合。
   */
  params: ApiMethodParam[];
  /**
   * Property `returnType` (`string`) storing return type.
   * @zh 属性 `returnType`（类型：`string`），用于存储或配置return类型。
   */
  returnType: string;
  /**
   * Property `description` (`string | null`) storing description.
   * @zh 属性 `description`（类型：`string | null`），用于存储或配置描述。
   */
  description: string | null;
  /**
   * Property `descriptionZh` (`string | null`) storing description zh.
   * @zh 属性 `descriptionZh`（类型：`string | null`），用于存储或配置描述Zh。
   */
  descriptionZh: string | null;
}

/**
 * Interface `ApiProperty` defining the contract and properties for api property.
 * @zh 接口 `ApiProperty`，定义API接口属性的数据结构契约与属性规范。
 */
export interface ApiProperty {
  /**
   * Property `name` (`string`) storing name.
   * @zh 属性 `name`（类型：`string`），用于存储或配置名称。
   */
  name: string;
  /**
   * Property `type` (`string`) storing type.
   * @zh 属性 `type`（类型：`string`），用于存储或配置类型。
   */
  type: string;
  /**
   * Property `default` (`string`) storing default.
   * @zh 属性 `default`（类型：`string`），用于存储或配置默认。
   */
  default?: string;
  /**
   * Property `description` (`string | null`) storing description.
   * @zh 属性 `description`（类型：`string | null`），用于存储或配置描述。
   */
  description: string | null;
  /**
   * Property `descriptionZh` (`string | null`) storing description zh.
   * @zh 属性 `descriptionZh`（类型：`string | null`），用于存储或配置描述Zh。
   */
  descriptionZh: string | null;
}

/**
 * Interface `ApiExport` defining the contract and properties for api export.
 * @zh 接口 `ApiExport`，定义API接口导出的数据结构契约与属性规范。
 */
export interface ApiExport {
  /**
   * Property `name` (`string`) storing name.
   * @zh 属性 `name`（类型：`string`），用于存储或配置名称。
   */
  name: string;
  /**
   * Property `kind` (`ApiExportKind`) storing kind.
   * @zh 属性 `kind`（类型：`ApiExportKind`），用于存储或配置种类。
   */
  kind: ApiExportKind;
  /**
   * Property `selector` (`string`) storing selector.
   * @zh 属性 `selector`（类型：`string`），用于存储或配置选择器。
   */
  selector?: string;
  /**
   * Property `pipeName` (`string`) storing pipe name.
   * @zh 属性 `pipeName`（类型：`string`），用于存储或配置管道名称。
   */
  pipeName?: string;
  /**
   * Property `summary` (`string | null`) storing summary.
   * @zh 属性 `summary`（类型：`string | null`），用于存储或配置汇总。
   */
  summary: string | null;
  /**
   * Property `summaryZh` (`string | null`) storing summary zh.
   * @zh 属性 `summaryZh`（类型：`string | null`），用于存储或配置汇总Zh。
   */
  summaryZh: string | null;
  /**
   * Property `inputs` (`ApiInput[]`) storing inputs.
   * @zh 属性 `inputs`（类型：`ApiInput[]`），用于存储或配置输入属性。
   */
  inputs: ApiInput[];
  /**
   * Property `outputs` (`ApiOutput[]`) storing outputs.
   * @zh 属性 `outputs`（类型：`ApiOutput[]`），用于存储或配置输出事件。
   */
  outputs: ApiOutput[];
  /**
   * Property `methods` (`ApiMethod[]`) storing methods.
   * @zh 属性 `methods`（类型：`ApiMethod[]`），用于存储或配置方法。
   */
  methods: ApiMethod[];
  /**
   * Property `properties` (`ApiProperty[]`) storing properties.
   * @zh 属性 `properties`（类型：`ApiProperty[]`），用于存储或配置属性列表。
   */
  properties: ApiProperty[];
  /**
   * Property `sourceFile` (`string`) storing source file.
   * @zh 属性 `sourceFile`（类型：`string`），用于存储或配置源文件。
   */
  sourceFile: string;
}

/**
 * Interface `ModuleApiFile` defining the contract and properties for module api file.
 * @zh 接口 `ModuleApiFile`，定义模块API接口文件的数据结构契约与属性规范。
 */
export interface ModuleApiFile {
  /**
   * Property `importPath` (`string`) storing import path.
   * @zh 属性 `importPath`（类型：`string`），用于存储或配置导入路径。
   */
  importPath: string;
  /**
   * Property `exports` (`ApiExport[]`) storing exports.
   * @zh 属性 `exports`（类型：`ApiExport[]`），用于存储或配置导出列表。
   */
  exports: ApiExport[];
  /**
   * Property `suggestedUsageSnippet` (`string`) storing suggested usage snippet.
   * @zh 属性 `suggestedUsageSnippet`（类型：`string`），用于存储或配置suggestedUsageSnippet。
   */
  suggestedUsageSnippet: string;
}
