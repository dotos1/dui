/**
 * @fileoverview Module `src/common/dnd/dnd-handle.directive.ts` providing dnd handle directive definitions and implementation.
 * @zh 模块文件 `src/common/dnd/dnd-handle.directive.ts`，提供拖放连接手柄指令相关的定义与实现。
 */

import { Directive, HostBinding, HostListener } from "@angular/core";
import { DndEvent } from "./dnd-utils";
import { DndDraggableDirective } from "./dnd-draggable.directive";

/**
 * Restricts dragging of a parent {@link DndDraggableDirective} to only start from this
 * element (a "drag handle"), rather than anywhere on the draggable element.
 * @zh 将父级 {@link DndDraggableDirective} 的拖拽起始点限制为仅此元素（即"拖拽手柄"），
 * 而不是整个可拖拽元素的任意位置。
 */
@Directive( {
  selector: "[dndHandle]",
  standalone: false
} )
export class DndHandleDirective {

  /**
   * Host binding `draggable` bound to host attribute/property `attr.draggable` for draggable.
   * @zh 内部使用，绑定宿主元素的原生 `draggable` 属性。
   * @zh 内部使用，绑定宿主元素的原生 `draggable` 属性。
   */
  @HostBinding( "attr.draggable" )
  draggable = true;

  /**
   * Creates an instance of `DndHandleDirective` and initializes its dependencies and internal state.
   * @zh 创建 `DndHandleDirective` 实例，并初始化其依赖项与内部状态。
   * @param parent - Injected or initial parent (`DndDraggableDirective`) / 注入或传入的父级（`DndDraggableDirective`）
   */
  constructor( parent:DndDraggableDirective ) {

    parent.registerDragHandle( this );
  }

  /**
   * @hidden Marks the originating drag event as having gone through this handle.
   * @zh 内部使用，标记发起的拖拽事件是通过该手柄触发的。
   */
  @HostListener( "dragstart", [ "$event" ] )
  @HostListener( "dragend", [ "$event" ] )
  onDragEvent( event:DndEvent ) {

    event._dndUsingHandle = true;
  }
}
