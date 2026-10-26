/**
 * @fileoverview Module `src/common/backdrop/backdrop.module.ts` providing backdrop module definitions and implementation.
 * @zh 模块文件 `src/common/backdrop/backdrop.module.ts`，提供背景遮罩模块相关的定义与实现。
 */

import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BackdropComponent } from './backdrop.component';

/**
 * Angular module `BackdropModule` declaring and exporting backdrop module components, directives, pipes, and providers.
 * @zh Angular 模块 `BackdropModule`，声明并导出背景遮罩模块相关的组件、指令、管道与服务提供者。
 */
@NgModule({
  imports: [CommonModule],
  declarations: [BackdropComponent],
  exports: [BackdropComponent]
})
export class BackdropModule {
  /**
   * Executes `forRoot` to handle for root.
   * @zh 执行 `forRoot`，用于用于根节点。
   * @returns Result of type `ModuleWithProviders<BackdropModule>` / 类型为 `ModuleWithProviders<BackdropModule>` 的返回值
   */
  static forRoot(): ModuleWithProviders<BackdropModule> {
    return {
      ngModule: BackdropModule,
      providers: []
    };
  }
}
