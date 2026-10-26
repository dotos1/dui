/**
 * @fileoverview Module `src/ux/link-preview/link-preview.module.ts` providing link preview module definitions and implementation.
 * @zh 模块文件 `src/ux/link-preview/link-preview.module.ts`，提供链接预览模块相关的定义与实现。
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LinkPreviewComponent } from './components/link-preview.component';
import { LinkPreviewCacheService } from './services/link-preview-cache.service';

/**
 * Angular module `LinkPreviewModule` declaring and exporting link preview module components, directives, pipes, and providers.
 * @zh Angular 模块 `LinkPreviewModule`，声明并导出链接预览模块相关的组件、指令、管道与服务提供者。
 */
@NgModule({
   declarations: [LinkPreviewComponent],
   exports: [LinkPreviewComponent],
   imports: [CommonModule],
   providers: [LinkPreviewCacheService]
})
export class LinkPreviewModule {}
