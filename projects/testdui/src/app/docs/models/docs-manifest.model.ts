/**
 * @fileoverview Module `projects/testdui/src/app/docs/models/docs-manifest.model.ts` providing docs manifest model definitions and implementation.
 * @zh 模块文件 `projects/testdui/src/app/docs/models/docs-manifest.model.ts`，提供文档manifest模型相关的定义与实现。
 */

/**
 * Interface `DocsManifestModule` defining the contract and properties for docs manifest module.
 * @zh 接口 `DocsManifestModule`，定义文档Manifest模块的数据结构契约与属性规范。
 */
export interface DocsManifestModule {
  /**
   * Property `id` (`string`) storing id.
   * @zh 属性 `id`（类型：`string`），用于存储或配置唯一标识。
   */
  id: string;
  /**
   * Property `importPath` (`string`) storing import path.
   * @zh 属性 `importPath`（类型：`string`），用于存储或配置导入路径。
   */
  importPath: string;
  /**
   * Property `dataFile` (`string`) storing data file.
   * @zh 属性 `dataFile`（类型：`string`），用于存储或配置数据文件。
   */
  dataFile: string;
  /**
   * Property `exportedClassCount` (`number`) storing exported class count.
   * @zh 属性 `exportedClassCount`（类型：`number`），用于存储或配置已导出类名计数。
   */
  exportedClassCount: number;
  /**
   * Property `isFlagship` (`boolean`) storing is flagship.
   * @zh 属性 `isFlagship`（类型：`boolean`），用于存储或配置是否为Flagship。
   */
  isFlagship: boolean;
}

/**
 * Interface `DocsManifestCategory` defining the contract and properties for docs manifest category.
 * @zh 接口 `DocsManifestCategory`，定义文档Manifest分类的数据结构契约与属性规范。
 */
export interface DocsManifestCategory {
  /**
   * Property `id` (`string`) storing id.
   * @zh 属性 `id`（类型：`string`），用于存储或配置唯一标识。
   */
  id: string;
  /**
   * Property `importPath` (`string`) storing import path.
   * @zh 属性 `importPath`（类型：`string`），用于存储或配置导入路径。
   */
  importPath: string;
  /**
   * Property `moduleCount` (`number`) storing module count.
   * @zh 属性 `moduleCount`（类型：`number`），用于存储或配置模块计数。
   */
  moduleCount: number;
  /**
   * Property `modules` (`DocsManifestModule[]`) storing modules.
   * @zh 属性 `modules`（类型：`DocsManifestModule[]`），用于存储或配置模块。
   */
  modules: DocsManifestModule[];
}

/**
 * Interface `DocsManifest` defining the contract and properties for docs manifest.
 * @zh 接口 `DocsManifest`，定义文档Manifest的数据结构契约与属性规范。
 */
export interface DocsManifest {
  /**
   * Property `generatedAt` (`string`) storing generated at.
   * @zh 属性 `generatedAt`（类型：`string`），用于存储或配置已生成位于。
   */
  generatedAt: string;
  /**
   * Property `categories` (`DocsManifestCategory[]`) storing categories.
   * @zh 属性 `categories`（类型：`DocsManifestCategory[]`），用于存储或配置分类。
   */
  categories: DocsManifestCategory[];
}
