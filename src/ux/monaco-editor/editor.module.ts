/**
 * @fileoverview Module `src/ux/monaco-editor/editor.module.ts` providing editor module definitions and implementation.
 * @zh 模块文件 `src/ux/monaco-editor/editor.module.ts`，提供编辑器模块相关的定义与实现。
 */

import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule, makeEnvironmentProviders } from '@angular/core';

import { MONACO_EDITOR_CONFIG, MonacoEditorConfig } from './config';
import { DiffEditorComponent } from './diff-editor.component';
import { EditorComponent } from './editor.component';

/**
 * Angular module `MonacoEditorModule` declaring and exporting monaco editor module components, directives, pipes, and providers.
 * @zh Angular 模块 `MonacoEditorModule`，声明并导出Monaco编辑器编辑器模块相关的组件、指令、管道与服务提供者。
 */
@NgModule({
  imports: [
    CommonModule,
    EditorComponent, 
    DiffEditorComponent
  ],
  exports: [
    EditorComponent,
    DiffEditorComponent
  ]
})
export class MonacoEditorModule {
  /**
   * Executes `forRoot` to handle for root.
   * @zh 执行 `forRoot`，用于用于根节点。
   * @param config - config parameter (`MonacoEditorConfig`) / 配置参数（`MonacoEditorConfig`）
   * @returns Result of type `ModuleWithProviders<MonacoEditorModule>` / 类型为 `ModuleWithProviders<MonacoEditorModule>` 的返回值
   */
  public static forRoot(config: MonacoEditorConfig = {}): ModuleWithProviders<MonacoEditorModule> {
    return {
      ngModule: MonacoEditorModule,
      providers: [
        { provide: MONACO_EDITOR_CONFIG, useValue: config }
      ]
    };
  }
}

/**
 * Executes `provideMonacoEditor` to handle provide monaco editor.
 * @zh 执行 `provideMonacoEditor`，用于提供Monaco编辑器编辑器。
 * @param config - config parameter (`MonacoEditorConfig`) / 配置参数（`MonacoEditorConfig`）
 */
export function provideMonacoEditor(config: MonacoEditorConfig = {}) {
  return makeEnvironmentProviders([
    { provide: MONACO_EDITOR_CONFIG, useValue: config }
  ]);
}