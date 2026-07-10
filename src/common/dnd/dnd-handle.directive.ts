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
  selector: "[dndHandle]"
} )
export class DndHandleDirective {

  /** @zh 内部使用，绑定宿主元素的原生 `draggable` 属性。 */
  @HostBinding( "attr.draggable" )
  draggable = true;

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
