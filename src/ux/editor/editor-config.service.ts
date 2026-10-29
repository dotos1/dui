/**
 * @fileoverview Module `src/ux/editor/editor-config.service.ts` providing editor config service definitions and implementation.
 * @zh 模块文件 `src/ux/editor/editor-config.service.ts`，提供编辑器配置服务相关的定义与实现。
 */

import { Injectable } from '@angular/core';

/**
 * Injectable Angular service `EditorServiceConfig` managing editor service config state and operations in `src/ux/editor`.
 * @zh 可注入的 Angular 服务 `EditorServiceConfig`，管理 `src/ux/editor` 中的编辑器服务配置状态与业务操作。
 */
@Injectable({
  providedIn: 'root',
})
export class EditorServiceConfig {
  /**
   * Property `locals` (`any`) storing locals (default: `{}`).
   * @zh 属性 `locals`（类型：`any`），用于存储或配置本地（默认值：`{}`）。
   */
  public locals: Record<string, string> = {};
}
