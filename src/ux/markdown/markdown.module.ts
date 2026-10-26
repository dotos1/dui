/**
 * @fileoverview Module `src/ux/markdown/markdown.module.ts` providing markdown module definitions and implementation.
 * @zh 模块文件 `src/ux/markdown/markdown.module.ts`，提供Markdown文档模块相关的定义与实现。
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarkdownComponent } from './markdown.component';
import { MarkdownLoaderService } from './loader/markdown-loader.service';

/**
 * Angular module `MarkdownModule` declaring and exporting markdown module components, directives, pipes, and providers.
 * @zh Angular 模块 `MarkdownModule`，声明并导出Markdown文档模块相关的组件、指令、管道与服务提供者。
 */
@NgModule({
  imports: [CommonModule],
  declarations: [MarkdownComponent],
  exports: [MarkdownComponent],
  providers: [MarkdownLoaderService],
})
export class MarkdownModule {}
