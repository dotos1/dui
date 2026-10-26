/**
 * @fileoverview Module `src/core/angular2parse/module.ts` providing module definitions and implementation.
 * @zh 模块文件 `src/core/angular2parse/module.ts`，提供模块相关的定义与实现。
 */

import { ModuleWithProviders, NgModule } from '@angular/core';
import {  PIPES_CONFIG, PipesConfig } from './parse';

/**
 * Angular module `Angular2ParseModule` declaring and exporting angular2 parse module components, directives, pipes, and providers.
 * @zh Angular 模块 `Angular2ParseModule`，声明并导出Angular2解析模块相关的组件、指令、管道与服务提供者。
 */
@NgModule()
export class Angular2ParseModule {
  /**
   * Executes `forRoot` to handle for root.
   * @zh 执行 `forRoot`，用于用于根节点。
   * @param pipesConfigMap - pipes config map parameter (`PipesConfig[]`) / 管道配置映射表参数（`PipesConfig[]`）
   * @returns Result of type `ModuleWithProviders<any>` / 类型为 `ModuleWithProviders<any>` 的返回值
   */
  static forRoot(pipesConfigMap: PipesConfig[]) {
    return {
      ngModule: Angular2ParseModule,
      providers: [{provide: PIPES_CONFIG, multi: true, useValue: pipesConfigMap || []}]
    };
  }
}
