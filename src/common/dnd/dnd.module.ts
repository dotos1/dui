/**
 * @fileoverview Module `src/common/dnd/dnd.module.ts` providing dnd module definitions and implementation.
 * @zh 模块文件 `src/common/dnd/dnd.module.ts`，提供拖放模块相关的定义与实现。
 */

import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DndDraggableDirective, DndDragImageRefDirective } from "./dnd-draggable.directive";
import { DndDropzoneDirective, DndPlaceholderRefDirective } from "./dnd-dropzone.directive";
import { DndHandleDirective } from "./dnd-handle.directive";

/**
 * Angular module `DndModule` declaring and exporting dnd module components, directives, pipes, and providers.
 * @zh Angular 模块 `DndModule`，声明并导出拖放模块相关的组件、指令、管道与服务提供者。
 */
@NgModule( {
  imports: [
    CommonModule
  ],
  declarations: [
    DndDraggableDirective,
    DndDropzoneDirective,
    DndHandleDirective,
    DndPlaceholderRefDirective,
    DndDragImageRefDirective
  ],
  exports: [
    DndDraggableDirective,
    DndDropzoneDirective,
    DndHandleDirective,
    DndPlaceholderRefDirective,
    DndDragImageRefDirective
  ]
} )
export class DndModule {
}
