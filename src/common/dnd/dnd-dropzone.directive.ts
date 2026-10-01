import {
  AfterViewInit,
  ContentChild,
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  NgZone,
  OnDestroy,
  Output,
  Renderer2
} from "@angular/core";
import {
  DndEvent,
  DragDropData,
  getDirectChildElement,
  getDropData,
  shouldPositionPlaceholderBeforeElement
} from "./dnd-utils";
import { getDndType, getDropEffect, isExternalDrag, setDropEffect } from "./dnd-state";
import { DropEffect, EffectAllowed } from "./dnd-types";

export interface DndDropEvent {
  event:DragEvent;
  dropEffect:DropEffect;
  isExternal:boolean;
  data?:any;
  index?:number;
  type?:any;
  dropTarget?:any
}

/**
 * Marks a descendant of {@link DndDropzoneDirective} as the placeholder element to position
 * at the prospective drop location while dragging over the dropzone.
 * @zh 将 {@link DndDropzoneDirective} 的子孙元素标记为占位元素，
 * 在拖拽悬停于放置区上方时将其定位到预计的放置位置。
 */
@Directive( {
  selector: "[dndPlaceholderRef]"
} )
export class DndPlaceholderRefDirective {

  constructor( public readonly elementRef:ElementRef ) {
  }
}

/**
 * Marks the host element as a valid drop target for {@link DndDraggableDirective} elements,
 * with optional type filtering (`dndDropzone`) and drop-position placeholder support.
 * @zh 将宿主元素标记为 {@link DndDraggableDirective} 元素的有效放置目标，支持按类型过滤
 * （`dndDropzone`）以及放置位置的占位符提示。
 */
@Directive( {
  selector: "[dndDropzone]"
} )
export class DndDropzoneDirective implements AfterViewInit, OnDestroy {

  /**
   * Restricts accepted draggables to those whose `dndType` is in this list; `""` accepts any type.
   * @zh 限制仅接受 `dndType` 在此列表中的可拖拽元素；`""` 表示接受任意类型。
   */
  @Input()
  dndDropzone?:string[] | "" = "";

  /**
   * The drop effect(s) this dropzone allows.
   * @zh 该放置区允许的放置效果。
   */
  @Input()
  dndEffectAllowed:EffectAllowed = "uninitialized";

  /**
   * Whether to accept drags originating from outside this library's `dndDraggable` directives
   * (e.g. native OS file drags).
   * @zh 是否接受来自本库 `dndDraggable` 指令之外的拖拽（如原生系统文件拖拽）。
   */
  @Input()
  dndAllowExternal:boolean = false;

  /**
   * Whether the placeholder positioning logic treats siblings as laid out horizontally
   * rather than vertically.
   * @zh 占位符定位逻辑是否将同级元素视为水平排列而非垂直排列。
   */
  @Input()
  dndHorizontal:boolean = false;

  /**
   * CSS class applied to the host element while a valid drag is over the dropzone.
   * @zh 当有效拖拽悬停在放置区上方时应用到宿主元素上的 CSS 类名。
   */
  @Input()
  dndDragoverClass:string = "dndDragover";

  /**
   * CSS class applied to the host element when the dropzone is disabled (via `dndDisableIf`).
   * @zh 放置区被禁用时（通过 `dndDisableIf`）应用到宿主元素上的 CSS 类名。
   */
  @Input()
  dndDropzoneDisabledClass = "dndDropzoneDisabled";

  /**
   * Emits while a valid drag is over the dropzone (throttled to native `dragover`).
   * @zh 当有效拖拽悬停在放置区上方时发出（随原生 `dragover` 事件节流触发）。
   */
  @Output()
  readonly dndDragover:EventEmitter<DragEvent> = new EventEmitter<DragEvent>();

  /**
   * Emits when a valid drag first enters the dropzone.
   * @zh 有效拖拽首次进入放置区时发出。
   */
  @Output()
  readonly dndDragEnter:EventEmitter<DragEvent> = new EventEmitter<DragEvent>();

  /**
   * Emits when a drag leaves the dropzone without dropping.
   * @zh 拖拽离开放置区且未放置时发出。
   */
  @Output()
  readonly dndDropLeave:EventEmitter<DndEvent> = new EventEmitter<DndEvent>();


  /**
   * Emits when an item is dropped on this dropzone, with the resolved drop data/effect/index.
   * @zh 当有条目被放置到该放置区时发出，携带解析后的放置数据/效果/索引。
   */
  @Output()
  readonly dndDrop:EventEmitter<DndDropEvent> = new EventEmitter<DndDropEvent>();


  /** @zh 内部使用，投影进来的可选占位符元素引用。 */
  @ContentChild( DndPlaceholderRefDirective )
  private readonly dndPlaceholderRef?:DndPlaceholderRefDirective;

  private placeholder:Element | null = null;

  private disabled:boolean = false;

  private readonly dragEnterEventHandler:( event:DragEvent ) => void = ( event:DragEvent ) => this.onDragEnter( event );
  private readonly dragOverEventHandler:( event:DragEvent ) => void = ( event:DragEvent ) => this.onDragOver( event );
  private readonly dragLeaveEventHandler:( event:DragEvent ) => void = ( event:DragEvent ) => this.onDragLeave( event );

  /**
   * When `true`, disables this dropzone and applies `dndDropzoneDisabledClass` to the host element.
   * @zh 为 `true` 时禁用该放置区，并将 `dndDropzoneDisabledClass` 应用到宿主元素上。
   */
  @Input()
  set dndDisableIf( value:boolean ) {

    this.disabled = !!value;

    if( this.disabled ) {

      this.renderer.addClass( this.elementRef.nativeElement, this.dndDropzoneDisabledClass );
    }
    else {

      this.renderer.removeClass( this.elementRef.nativeElement, this.dndDropzoneDisabledClass );
    }
  }

  /**
   * Alias for `dndDisableIf`.
   * @zh `dndDisableIf` 的别名。
   */
  @Input()
  set dndDisableDropIf( value:boolean ) {
    this.dndDisableIf = value;
  }

  constructor( private ngZone:NgZone,
               private elementRef:ElementRef,
               private renderer:Renderer2 ) {
  }

  ngAfterViewInit():void {

    this.placeholder = this.tryGetPlaceholder();

    this.removePlaceholderFromDOM();

    this.ngZone.runOutsideAngular( () => {
      this.elementRef.nativeElement.addEventListener( "dragenter", this.dragEnterEventHandler );
      this.elementRef.nativeElement.addEventListener( "dragover", this.dragOverEventHandler );
      this.elementRef.nativeElement.addEventListener( "dragleave", this.dragLeaveEventHandler );
    } );
  }

  ngOnDestroy():void {
    this.elementRef.nativeElement.removeEventListener( "dragenter", this.dragEnterEventHandler );
    this.elementRef.nativeElement.removeEventListener( "dragover", this.dragOverEventHandler );
    this.elementRef.nativeElement.removeEventListener( "dragleave", this.dragLeaveEventHandler );
  }

  /**
   * @hidden Handles the native `dragenter` event: emits `dndDragEnter` if the drag type is accepted.
   * @zh 内部使用，处理原生 `dragenter` 事件：若拖拽类型被接受则发出 `dndDragEnter`。
   */
  onDragEnter( event:DndEvent ) {
    if( event._dndDropzoneActive === true ) {
      this.cleanupDragoverState();
      return;
    }

    // set as active if the target element is inside this dropzone
    if( typeof event._dndDropzoneActive === "undefined" ) {
      const newTarget = document.elementFromPoint( event.clientX, event.clientY );
      if( this.elementRef.nativeElement.contains( newTarget ) ) {
        event._dndDropzoneActive = true;
      }
    }
    const type = getDndType( event );
    if( this.isDropAllowed( type ) === false ) {
      return;
    }
    this.dndDragEnter.emit( event );
    // allow the dragenter
    event.preventDefault();
  }

  /**
   * @hidden Handles the native `dragover` event: updates the placeholder position and emits `dndDragover`.
   * @zh 内部使用，处理原生 `dragover` 事件：更新占位符位置并发出 `dndDragover`。
   */
  onDragOver( event:DragEvent ) {
    if( event.defaultPrevented ) {
      return;
    }

    // check if this drag event is allowed to drop on this dropzone
    const type = getDndType( event );
    if( this.isDropAllowed( type ) === false ) {

      return;
    }

    this.checkAndUpdatePlaceholderPosition( event );

    const dropEffect = getDropEffect( event, this.dndEffectAllowed );

    if( dropEffect === "none" ) {

      this.cleanupDragoverState();
      return;
    }

    // allow the dragover
    event.preventDefault();

    setDropEffect( event, dropEffect );
    event['dropTarget']=this;

    this.dndDragover.emit( event );

    this.renderer.addClass( this.elementRef.nativeElement, this.dndDragoverClass );
  }

  /**
   * @hidden Handles the native `drop` event: resolves the drop data/index and emits `dndDrop`.
   * @zh 内部使用，处理原生 `drop` 事件：解析放置数据/索引并发出 `dndDrop`。
   */
  @HostListener( "drop", [ "$event" ] )
  onDrop( event:DragEvent ) {

    try {

      // check if this drag event is allowed to drop on this dropzone
      const type = getDndType( event );
      if( this.isDropAllowed( type ) === false ) {

        return;
      }

      const data:DragDropData = getDropData( event, isExternalDrag() );

      if( this.isDropAllowed( data.type ) === false ) {

        return;
      }

      // signal custom drop handling
      event.preventDefault();

      const dropEffect = getDropEffect( event );

      setDropEffect( event, dropEffect );

      if( dropEffect === "none" ) {

        return;
      }

      const dropIndex = this.getPlaceholderIndex();
      if( dropIndex === -1 ) {

        return;
      }

      this.dndDrop.emit( {
        event: event,
        dropEffect: dropEffect,
        isExternal: isExternalDrag(),
        data: data.data,
        index: dropIndex,
        type: type,
        dropTarget:this,
      } );

      event.stopPropagation();

    }
    finally {

      this.cleanupDragoverState();
    }
  }

  /**
   * @hidden Handles the native `dragleave` event: cleans up dragover state and emits `dndDropLeave`.
   * @zh 内部使用，处理原生 `dragleave` 事件：清理拖拽悬停状态并发出 `dndDropLeave`。
   */
  onDragLeave( event:DndEvent ) {

    // check if still inside this dropzone and not yet handled by another dropzone
    if( typeof event._dndDropzoneActive === "undefined" ) {

      const newTarget = document.elementFromPoint( event.clientX, event.clientY );

      if( this.elementRef.nativeElement.contains( newTarget ) ) {

        event._dndDropzoneActive = true;
        return;
      }
    }
    event['dropTarget']=this;
    this.cleanupDragoverState();
    this.dndDropLeave.emit( event );
    setDropEffect( event, "none" );
  }

  private isDropAllowed( type?:string ):boolean {

    // dropzone is disabled -> deny it
    if( this.disabled === true ) {

      return false;
    }

    // if drag did not start from our directive
    // and external drag sources are not allowed -> deny it
    if( isExternalDrag() === true
      && this.dndAllowExternal === false ) {

      return false;
    }

    // no filtering by types -> allow it
    if( !this.dndDropzone ) {

      return true;
    }

    // no type set -> allow it
    if( !type ) {

      return true;
    }

    if( Array.isArray( this.dndDropzone ) === false ) {

      throw new Error( "dndDropzone: bound value to [dndDropzone] must be an array!" );
    }

    // if dropzone contains type -> allow it
    return this.dndDropzone.indexOf( type ) !== -1;
  }

  private tryGetPlaceholder():Element | null {

    if( typeof this.dndPlaceholderRef !== "undefined" ) {

      return this.dndPlaceholderRef.elementRef.nativeElement as Element;
    }
    return this.elementRef.nativeElement.querySelector( "[dndPlaceholderRef]" );
  }

  private removePlaceholderFromDOM() {

    if( this.placeholder !== null
      && this.placeholder.parentNode !== null ) {
      this.placeholder.parentNode.removeChild( this.placeholder );
    }
  }

  private checkAndUpdatePlaceholderPosition( event:DragEvent ):void {

    if( this.placeholder === null ) {

      return;
    }

    // make sure the placeholder is in the DOM
    if( this.placeholder.parentNode !== this.elementRef.nativeElement ) {

      this.renderer.appendChild( this.elementRef.nativeElement, this.placeholder );
    }

    // update the position if the event originates from a child element of the dropzone
    const directChild = getDirectChildElement( this.elementRef.nativeElement, event.target as Element );

    // early exit if no direct child or direct child is placeholder
    if( directChild === null
      || directChild === this.placeholder ) {

      return;
    }

    const positionPlaceholderBeforeDirectChild = shouldPositionPlaceholderBeforeElement( event, directChild, this.dndHorizontal );

    if( positionPlaceholderBeforeDirectChild ) {

      // do insert before only if necessary
      if( directChild.previousSibling !== this.placeholder ) {

        this.renderer.insertBefore( this.elementRef.nativeElement, this.placeholder, directChild );
      }
    }
    else {

      // do insert after only if necessary
      if( directChild.nextSibling !== this.placeholder ) {

        this.renderer.insertBefore( this.elementRef.nativeElement, this.placeholder, directChild.nextSibling );
      }
    }
  }

  private getPlaceholderIndex():number | undefined {

    if( this.placeholder === null ) {

      return undefined;
    }

    const element = this.elementRef.nativeElement as HTMLElement;

    return Array.prototype.indexOf.call( element.children, this.placeholder );
  }

  private cleanupDragoverState() {

    this.renderer.removeClass( this.elementRef.nativeElement, this.dndDragoverClass );

    this.removePlaceholderFromDOM();
  }
}
