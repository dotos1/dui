/**
 * @fileoverview Module `src/container/resizable/resize.module.ts` providing resize module definitions and implementation.
 * @zh 模块文件 `src/container/resizable/resize.module.ts`，提供调整尺寸模块相关的定义与实现。
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ResizableComponent } from './resizable.component';

/**
 * Angular module `ResizableModule` declaring and exporting resizable module components, directives, pipes, and providers.
 * @zh Angular 模块 `ResizableModule`，声明并导出是否可调尺寸模块相关的组件、指令、管道与服务提供者。
 */
@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [ResizableComponent],
  exports: [ResizableComponent]
})
export class ResizableModule { }
export { ResizableComponent } from './resizable.component';
