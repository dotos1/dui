/**
 * @fileoverview Module `src/ux/monaco-editor/code-editor-service.service.ts` providing code editor service service definitions and implementation.
 * @zh 模块文件 `src/ux/monaco-editor/code-editor-service.service.ts`，提供编码编辑器服务服务相关的定义与实现。
 */


import { Injectable } from '@angular/core';
import * as monaco from 'monaco-editor';

/**
 * Injectable Angular service `CodeEditorService` managing code editor service state and operations in `src/ux/monaco-editor`.
 * @zh 可注入的 Angular 服务 `CodeEditorService`，管理 `src/ux/monaco-editor` 中的编码编辑器服务状态与业务操作。
 */
@Injectable({
    providedIn: 'root'
})
export class CodeEditorService {

    /**
     * Property `schemas` (`any[]`) storing schemas (default: `[]`).
     * @zh 属性 `schemas`（类型：`any[]`），用于存储或配置结构定义（默认值：`[]`）。
     */
    private schemas = [];

    /**
     * Executes `addSchema` to handle add schema.
     * @zh 执行 `addSchema`，用于添加结构定义。
     * @param uri - uri parameter (`string`) / 资源标识参数（`string`）
     * @param fileMatch - file match parameter (`string | string[]`) / 文件匹配参数（`string | string[]`）
     * @param schema - schema parameter (`string | Object`) / 结构定义参数（`string | Object`）
     */
    addSchema(uri: string, fileMatch: string | string[], schema: string | Object) {
        this.schemas.push({
            uri,
            fileMatch: Array.isArray(fileMatch) ? fileMatch : [ fileMatch ],
            schema
        });
    }

    /**
     * Executes `getConfig` to handle get config.
     * @zh 执行 `getConfig`，用于获取配置。
     */
    getConfig() {
        return {
            baseUrl: './assets',
            onMonacoLoad: this.onMonacoLoad.bind(this)
        };
    }

    /**
     * Executes `onMonacoLoad` to handle on monaco load.
     * @zh 执行 `onMonacoLoad`，用于当Monaco编辑器加载。
     */
    private onMonacoLoad() {
        monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
            validate: true,
            schemas: this.schemas
        });
    }
}
