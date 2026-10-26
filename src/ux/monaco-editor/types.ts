/**
 * @fileoverview Module `src/ux/monaco-editor/types.ts` providing types definitions and implementation.
 * @zh 模块文件 `src/ux/monaco-editor/types.ts`，提供类型列表相关的定义与实现。
 */

/**
 * Interface `DiffEditorModel` defining the contract and properties for diff editor model.
 * @zh 接口 `DiffEditorModel`，定义Diff编辑器模型的数据结构契约与属性规范。
 */
export interface DiffEditorModel {
    /**
     * Property `code` (`string`) storing code.
     * @zh 属性 `code`（类型：`string`），用于存储或配置编码。
     */
    code: string;
    /**
     * Property `language` (`string`) storing language.
     * @zh 属性 `language`（类型：`string`），用于存储或配置语言。
     */
    language: string;
}
/**
 * Interface `EditorModel` defining the contract and properties for editor model.
 * @zh 接口 `EditorModel`，定义编辑器模型的数据结构契约与属性规范。
 */
export interface EditorModel {
    /**
     * Property `value` (`string`) storing value.
     * @zh 属性 `value`（类型：`string`），用于存储或配置值。
     */
    value: string;
    /**
     * Property `language` (`string`) storing language.
     * @zh 属性 `language`（类型：`string`），用于存储或配置语言。
     */
    language?: string;
    /**
     * Property `uri` (`any`) storing uri.
     * @zh 属性 `uri`（类型：`any`），用于存储或配置资源标识。
     */
    uri?;
}