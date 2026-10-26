/**
 * @fileoverview Module `src/ux/windows/resizer/resizer.module.ts` providing resizer module definitions and implementation.
 * @zh 模块文件 `src/ux/windows/resizer/resizer.module.ts`，提供尺寸调整器模块相关的定义与实现。
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { UtilsModule } from '../utils';
import { ResizableDirective } from './directives';

/**
 * Angular module `ResizerModule` declaring and exporting resizer module components, directives, pipes, and providers.
 * @zh Angular 模块 `ResizerModule`，声明并导出尺寸调整器模块相关的组件、指令、管道与服务提供者。
 */
@NgModule({
    declarations: [
        ResizableDirective
    ],
    imports: [
      CommonModule,
      UtilsModule
    ],
    exports: [
        ResizableDirective
    ]
})
export class ResizerModule {}
