/**
 * @fileoverview Module `src/common/fileupload/file-upload.module.ts` providing file upload module definitions and implementation.
 * @zh 模块文件 `src/common/fileupload/file-upload.module.ts`，提供文件上传模块相关的定义与实现。
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FileDropDirective } from './file-drop.directive';
import { FileSelectDirective } from './file-select.directive';

/**
 * Angular module `FileUploadModule` declaring and exporting file upload module components, directives, pipes, and providers.
 * @zh Angular 模块 `FileUploadModule`，声明并导出文件上传模块相关的组件、指令、管道与服务提供者。
 */
@NgModule({
  imports: [CommonModule],
  declarations: [FileDropDirective, FileSelectDirective],
  exports: [FileDropDirective, FileSelectDirective]
})
export class FileUploadModule {
}
