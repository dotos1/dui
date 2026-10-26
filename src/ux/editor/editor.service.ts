/**
 * @fileoverview Module `src/ux/editor/editor.service.ts` providing editor service definitions and implementation.
 * @zh 模块文件 `src/ux/editor/editor.service.ts`，提供编辑器服务相关的定义与实现。
 */

import { Injectable, Optional } from '@angular/core';

import { EditorConfig } from './types';
import Locals from './Locals';
import { EditorServiceConfig } from './editor-config.service';

/**
 * Injectable Angular service `EditorService` managing editor service state and operations in `src/ux/editor`.
 * @zh 可注入的 Angular 服务 `EditorService`，管理 `src/ux/editor` 中的编辑器服务状态与业务操作。
 */
@Injectable({
  providedIn: 'root',
})
export class EditorService {
  /**
   * Property `config` (`EditorServiceConfig`) storing config.
   * @zh 属性 `config`（类型：`EditorServiceConfig`），用于存储或配置配置。
   */
  config: EditorServiceConfig;

  /**
   * Creates an instance of `EditorService` and initializes its dependencies and internal state.
   * @zh 创建 `EditorService` 实例，并初始化其依赖项与内部状态。
   * @param config - Injected or initial config (`EditorServiceConfig`) / 注入或传入的配置（`EditorServiceConfig`）
   */
  constructor(@Optional() config?: EditorServiceConfig) {
    this.config = config;
  }

  /**
   * Gets the current locals (`locals: Locals`).
   * @zh 获取当前本地（`locals: Locals`）。
   */
  get locals(): Locals {
    return new Locals(this.config.locals);
  }
}

/**
 * Constant/variable `provideMyServiceOptions` defining provide my service options in `src/ux/editor`.
 * @zh 常量/变量 `provideMyServiceOptions`，定义 `src/ux/editor` 中的提供My服务配置选项。
 */
export const provideMyServiceOptions = (config?: EditorConfig): EditorServiceConfig => {
  return {
    locals: config.locals ?? {},
  };
};
