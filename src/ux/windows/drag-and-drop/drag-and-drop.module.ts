/**
 * @fileoverview Module `src/ux/windows/drag-and-drop/drag-and-drop.module.ts` providing drag and drop module definitions and implementation.
 * @zh 模块文件 `src/ux/windows/drag-and-drop/drag-and-drop.module.ts`，提供拖拽and放置模块相关的定义与实现。
 */

import { NgModule } from '@angular/core';
import { UtilsModule } from '../utils';
import { DraggableDirective } from './directives';
import { CommonModule } from '@angular/common';

/**
 * Angular module `DragAndDropModule` declaring and exporting drag and drop module components, directives, pipes, and providers.
 * @zh Angular 模块 `DragAndDropModule`，声明并导出拖拽And放置模块相关的组件、指令、管道与服务提供者。
 */
@NgModule({
    declarations: [
        DraggableDirective
    ],
    imports: [
      CommonModule,
      UtilsModule
    ],
    exports: [
        DraggableDirective
    ]
})
export class DragAndDropModule {}

