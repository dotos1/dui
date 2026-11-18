/**
 * @fileoverview Module `src/ux/highlight/highlight.module.ts` providing highlight module definitions and implementation.
 * @zh 模块文件 `src/ux/highlight/highlight.module.ts`，提供highlight模块相关的定义与实现。
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { HighlightComponent } from './highlight.component';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { CopyCodeButtonComponent } from './copy-code-button/copy-code-button.component';
import { TranslateModule } from '@dotos1/dui/translator';

/**
 * Angular module `HighlightModule` declaring and exporting highlight module components, directives, pipes, and providers.
 * @zh Angular 模块 `HighlightModule`，声明并导出Highlight模块相关的组件、指令、管道与服务提供者。
 */
@NgModule({
  imports: [
    CommonModule,
    ClipboardModule,
    MatIconModule,
    TranslateModule,
    MatTooltipModule,
     MatButtonModule
  ],
  declarations: [
    HighlightComponent,
     CopyCodeButtonComponent],
  exports: [HighlightComponent],
})
export class HighlightModule {}
