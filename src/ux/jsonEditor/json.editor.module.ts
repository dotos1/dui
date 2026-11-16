/**
 * @fileoverview Module `src/ux/jsonEditor/json.editor.module.ts` providing json editor module definitions and implementation.
 * @zh 模块文件 `src/ux/jsonEditor/json.editor.module.ts`，提供JSON编辑器模块相关的定义与实现。
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FlexLayoutModule } from 'ngx-flexible-layout';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

import { CardModule } from '@dotos1/dui/container';
import { Dui } from '@dotos1/dui/core';
import { ButtonModule } from '@dotos1/dui/ui/button';
import { DialogsModule } from '@dotos1/dui/common/dialogs';
import { TranslationService } from '@dotos1/dui/translator';
import { MonacoEditorModule } from '@dotos1/dui/ux/monaco-editor';

import { JsonEditor } from './json.editor';
/**
 * Angular module `JsonEditorModule` declaring and exporting json editor module components, directives, pipes, and providers.
 * @zh Angular 模块 `JsonEditorModule`，声明并导出JSON编辑器模块相关的组件、指令、管道与服务提供者。
 */
@NgModule({
  declarations: [
    JsonEditor,
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatMenuModule,
    MatTooltipModule,
    MatButtonModule,
    MatDialogModule,
    CardModule,
    ButtonModule,
    DialogsModule,
    FlexLayoutModule,
    MonacoEditorModule.forRoot({})
  ]
})
export class JsonEditorModule {
  /**
   * Property `entryComponents` (`(typeof JsonEditor)[]`) storing entry components (default: `[JsonEditor]`).
   * @zh 属性 `entryComponents`（类型：`(typeof JsonEditor)[]`），用于存储或配置条目组件列表（默认值：`[JsonEditor]`）。
   */
  entryComponents = [JsonEditor];
  /**
   * Creates an instance of `JsonEditorModule` and initializes its dependencies and internal state.
   * @zh 创建 `JsonEditorModule` 实例，并初始化其依赖项与内部状态。
   * @param componentFactoryResolver - Injected or initial component factory resolver (`ComponentFactoryResolver`) / 注入或传入的组件工厂解析器（`ComponentFactoryResolver`）
   * @param translateService - Injected or initial translate service (`TranslationService`) / 注入或传入的翻译服务（`TranslationService`）
   */
  constructor(
    translateService: TranslationService) {
    Dui.registerComponentFactory(this.entryComponents);
    translateService.addTranslationFolder('dui', 'i18n');
  }
}
