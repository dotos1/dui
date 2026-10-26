/**
 * @fileoverview Module `src/common/resize-element/resizable.module.ts` providing resizable module definitions and implementation.
 * @zh 模块文件 `src/common/resize-element/resizable.module.ts`，提供是否可调尺寸模块相关的定义与实现。
 */

import { NgModule } from '@angular/core';
import { ResizableDirective } from './resizable.directive';
import { ResizeHandleDirective } from './resize-handle.directive';

/**
 * Angular module `ResizableModule` declaring and exporting resizable module components, directives, pipes, and providers.
 * @zh Angular 模块 `ResizableModule`，声明并导出是否可调尺寸模块相关的组件、指令、管道与服务提供者。
 */
@NgModule({
  declarations: [ResizableDirective, ResizeHandleDirective],
  exports: [ResizableDirective, ResizeHandleDirective],
})
export class ResizableModule {}
