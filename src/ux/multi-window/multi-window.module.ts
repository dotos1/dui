/**
 * @fileoverview Module `src/ux/multi-window/multi-window.module.ts` providing multi window module definitions and implementation.
 * @zh 模块文件 `src/ux/multi-window/multi-window.module.ts`，提供多窗口模块相关的定义与实现。
 */

import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { MultiWindowService } from './providers/multi-window.service';
import { WStorageService } from './providers/storage.service';
import { NGXMW_CONFIG } from './providers/config.provider';
import { MultiWindowConfig } from './types/multi-window.config';
import { MultiWindowRef } from './providers/window.provider';

/**
 * Angular module `MultiWindowModule` declaring and exporting multi window module components, directives, pipes, and providers.
 * @zh Angular 模块 `MultiWindowModule`，声明并导出多窗口模块相关的组件、指令、管道与服务提供者。
 */
@NgModule({
  imports: [CommonModule],
  providers: [
    WStorageService,
    MultiWindowService,
    MultiWindowRef,
    { provide: NGXMW_CONFIG, useValue: {} },
  ],
})
export class MultiWindowModule {
  /**
   * Executes `forRoot` to handle for root.
   * @zh 执行 `forRoot`，用于用于根节点。
   * @param config - config parameter (`MultiWindowConfig`) / 配置参数（`MultiWindowConfig`）
   * @returns Result of type `ModuleWithProviders<MultiWindowModule>` / 类型为 `ModuleWithProviders<MultiWindowModule>` 的返回值
   */
  static forRoot(config?: MultiWindowConfig): ModuleWithProviders<MultiWindowModule> {
    return {
      ngModule: MultiWindowModule,
      providers: [MultiWindowService, { provide: NGXMW_CONFIG, useValue: config }],
    };
  }
}
