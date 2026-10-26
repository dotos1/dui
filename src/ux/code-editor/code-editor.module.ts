/**
 * @fileoverview Module `src/ux/code-editor/code-editor.module.ts` providing code editor module definitions and implementation.
 * @zh 模块文件 `src/ux/code-editor/code-editor.module.ts`，提供编码编辑器模块相关的定义与实现。
 */

import { NgModule, ModuleWithProviders, ComponentFactoryResolver } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExtCodeEditorComponent } from './code-editor.component';
import { Dui } from '@dotos/dui/core';

/**
 * Angular module `CodeEditorModule` declaring and exporting code editor module components, directives, pipes, and providers.
 * @zh Angular 模块 `CodeEditorModule`，声明并导出编码编辑器模块相关的组件、指令、管道与服务提供者。
 */
@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    ExtCodeEditorComponent,
  ],
  exports: [
    ExtCodeEditorComponent,
  ],
  bootstrap: [ ExtCodeEditorComponent ],
})
export class CodeEditorModule {
  /**
   * Property `entryComponents` (`any[]`) storing entry components (default: `[ExtCodeEditorComponent]`).
   * @zh 属性 `entryComponents`（类型：`any[]`），用于存储或配置条目组件列表（默认值：`[ExtCodeEditorComponent]`）。
   */
  entryComponents = [ExtCodeEditorComponent];
  /**
   * Creates an instance of `CodeEditorModule` and initializes its dependencies and internal state.
   * @zh 创建 `CodeEditorModule` 实例，并初始化其依赖项与内部状态。
   * @param componentFactoryResolver - Injected or initial component factory resolver (`ComponentFactoryResolver`) / 注入或传入的组件工厂解析器（`ComponentFactoryResolver`）
   */
  constructor(componentFactoryResolver: ComponentFactoryResolver) {
    Dui.registerComponentFactory(componentFactoryResolver,this.entryComponents);
  }
  /**
   * Executes `forRoot` to handle for root.
   * @zh 执行 `forRoot`，用于用于根节点。
   * @returns Result of type `ModuleWithProviders<CodeEditorModule>` / 类型为 `ModuleWithProviders<CodeEditorModule>` 的返回值
   */
  static forRoot(): ModuleWithProviders<CodeEditorModule> {
    return {
      ngModule: CodeEditorModule,
      providers: [ ],
    };
  }
}
