/**
 * @fileoverview Module `src/common/stop-propagation/stop-propagation.module.ts` providing stop propagation module definitions and implementation.
 * @zh 模块文件 `src/common/stop-propagation/stop-propagation.module.ts`，提供停止事件冒泡模块相关的定义与实现。
 */

import { NgModule, ModuleWithProviders } from '@angular/core';
import { StopDropPropagationDirective } from './stop-drop-propagation.directive';
import { StopPropagationDirective } from './stop-propagation.directive';

/**
 * Angular module `StopPropagationModule` declaring and exporting stop propagation module components, directives, pipes, and providers.
 * @zh Angular 模块 `StopPropagationModule`，声明并导出停止事件冒泡模块相关的组件、指令、管道与服务提供者。
 */
@NgModule({
  imports: [],
  declarations: [StopDropPropagationDirective, StopPropagationDirective],
  exports: [StopDropPropagationDirective, StopPropagationDirective]
})
export class StopPropagationModule {
  /**
   * Executes `forRoot` to handle for root.
   * @zh 执行 `forRoot`，用于用于根节点。
   * @returns Result of type `ModuleWithProviders<StopPropagationModule>` / 类型为 `ModuleWithProviders<StopPropagationModule>` 的返回值
   */
  static forRoot(): ModuleWithProviders<StopPropagationModule> {
    return {
      ngModule: StopPropagationModule,
      providers: []
    };
  }
}
