/**
 * @fileoverview Module `src/ux/monaco-editor/config.ts` providing config definitions and implementation.
 * @zh 模块文件 `src/ux/monaco-editor/config.ts`，提供配置相关的定义与实现。
 */

import { InjectionToken } from '@angular/core';

/**
 * Angular dependency-injection token `MONACO_EDITOR_CONFIG` for providing monaco editor config.
 * @zh Angular 依赖注入令牌 `MONACO_EDITOR_CONFIG`，用于提供与注入Monaco编辑器编辑器配置。
 */
export const MONACO_EDITOR_CONFIG = new InjectionToken('MONACO_EDITOR_CONFIG');

/**
 * Interface `MonacoEditorConfig` defining the contract and properties for monaco editor config.
 * @zh 接口 `MonacoEditorConfig`，定义Monaco编辑器编辑器配置的数据结构契约与属性规范。
 */
export interface MonacoEditorConfig {
  /**
   * Property `baseUrl` (`string`) storing base url.
   * @zh 属性 `baseUrl`（类型：`string`），用于存储或配置基础链接地址。
   */
  baseUrl?: string;
  /**
   * Property `requireConfig` (`{ [key: string]: unknown; }`) storing require config.
   * @zh 属性 `requireConfig`（类型：`{ [key: string]: unknown; }`），用于存储或配置require配置。
   */
  requireConfig?: { [key: string]: unknown; };
  /**
   * Property `defaultOptions` (`{ [key: string]: unknown; }`) storing default options.
   * @zh 属性 `defaultOptions`（类型：`{ [key: string]: unknown; }`），用于存储或配置默认配置选项。
   */
  defaultOptions?: { [key: string]: unknown; };
  /**
   * Property `monacoRequire` (`Function`) storing monaco require.
   * @zh 属性 `monacoRequire`（类型：`Function`），用于存储或配置Monaco编辑器Require。
   */
  monacoRequire?: Function;
  /**
   * Property `onMonacoLoad` (`Function`) storing on monaco load.
   * @zh 属性 `onMonacoLoad`（类型：`Function`），用于存储或配置当Monaco编辑器加载。
   */
  onMonacoLoad?: Function;
}