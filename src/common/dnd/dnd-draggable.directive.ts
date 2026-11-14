/**
 * @fileoverview Module `src/common/dnd/dnd-draggable.directive.ts` providing dnd draggable directive definitions and implementation.
 * @zh 模块文件 `src/common/dnd/dnd-draggable.directive.ts`，提供拖放是否可拖拽指令相关的定义与实现。
 */

import {
  AfterViewInit,
  Directive,
  ElementRef,
  EventEmitter,
  forwardRef,
  HostBinding,
  HostListener,
  Inject,
  Input,
  NgZone,
  OnDestroy,
  Output,
  Renderer2
} from "@angular/core";
import { calculateDragImageOffset, DndDragImageOffsetFunction, DndEvent, setDragData, setDragImage } from "./dnd-utils";
import { DndHandleDirective } from "./dnd-handle.directive";
import { dndState, endDrag, startDrag } from "./dnd-state";
import { EffectAllowed } from "./dnd-types";

/**
 * Marks a descendant of {@link DndDraggableDirective} as the custom drag image to use instead
 * of the browser's default drag ghost.
 * @zh 将 {@link DndDraggableDirective} 的子孙元素标记为拖拽时使用的自定义拖拽图像，
 * 取代浏览器默认的拖拽幽灵图。
 */
@Directive( {
  selector: "[dndDragImageRef]",
  standalone: false
} )
export class DndDragImageRefDirective {

  /**
   * Creates an instance of `DndDragImageRefDirective` and initializes its dependencies and internal state.
   * @zh 创建 `DndDragImageRefDirective` 实例，并初始化其依赖项与内部状态。
   * @param parent - Injected or initial parent (`DndDraggableDirective`) / 注入或传入的父级（`DndDraggableDirective`）
   * @param elementRef - Injected or initial element ref (`ElementRef<any>`) / 注入或传入的元素引用（`ElementRef<any>`）
   */
  constructor(@Inject(forwardRef(() => DndDraggableDirective)) parent: DndDraggableDirective, elementRef:ElementRef ) {
    parent.registerDragImage( elementRef );
  }
}

/**
 * Makes the host element draggable using the native HTML5 drag-and-drop API; pair with
 * {@link DndDropzoneDirective} on a drop target. Emits events for start/drag/end and the
 * resulting drop effect (copy/move/link/canceled).
 * @zh 使宿主元素可拖拽（基于原生 HTML5 拖放 API）；需与放置目标上的 {@link DndDropzoneDirective} 配合使用。
 * 会发出开始/拖拽中/结束事件，以及最终的放置效果（复制/移动/链接/取消）。
 */
@Directive( {
  selector: "[dndDraggable]",
  standalone: false
} )
export class DndDraggableDirective implements AfterViewInit, OnDestroy {

  /**
   * Arbitrary payload data transferred to the drop target on a successful drop.
   * @zh 放置成功时传递给放置目标的任意载荷数据。
   */
  @Input()
  dndDraggable;

  /**
   * The set of drop effects this draggable allows (`copy`/`move`/`link`/etc.).
   * @zh 该可拖拽元素允许的放置效果集合（`copy`/`move`/`link` 等）。
   */
  @Input()
  dndEffectAllowed:EffectAllowed = "copy";

  /**
   * An arbitrary type string used by dropzones to filter which draggables they accept.
   * @zh 供放置区用于过滤可接受哪些可拖拽元素的任意类型字符串。
   */
  @Input()
  dndType?:string;

  /**
   * CSS class applied to the drag image element while dragging.
   * @zh 拖拽过程中应用到拖拽图像元素上的 CSS 类名。
   */
  @Input()
  dndDraggingClass = "dndDragging";

  /**
   * CSS class applied to the host (source) element while dragging.
   * @zh 拖拽过程中应用到宿主（拖拽源）元素上的 CSS 类名。
   */
  @Input()
  dndDraggingSourceClass = "dndDraggingSource";

  /**
   * CSS class applied to the host element when dragging is disabled (via `dndDisableIf`).
   * @zh 拖拽被禁用时（通过 `dndDisableIf`）应用到宿主元素上的 CSS 类名。
   */
  @Input()
  dndDraggableDisabledClass = "dndDraggableDisabled";

  /**
   * Computes the custom drag image's pointer offset; defaults to {@link calculateDragImageOffset}.
   * @zh 计算自定义拖拽图像的指针偏移量；默认使用 {@link calculateDragImageOffset}。
   */
  @Input()
  dndDragImageOffsetFunction:DndDragImageOffsetFunction = calculateDragImageOffset;

  /**
   * Emits when dragging starts.
   * @zh 拖拽开始时发出。
   */
  @Output()
  readonly dndStart:EventEmitter<DragEvent> = new EventEmitter<DragEvent>();

  /**
   * Emits on each native `drag` event while dragging.
   * @zh 拖拽过程中每次原生 `drag` 事件触发时发出。
   */
  @Output()
  readonly dndDrag:EventEmitter<DragEvent> = new EventEmitter<DragEvent>();

  /**
   * Emits when dragging ends, regardless of the resulting drop effect.
   * @zh 拖拽结束时发出，无论最终的放置效果是什么。
   */
  @Output()
  readonly dndEnd:EventEmitter<DragEvent> = new EventEmitter<DragEvent>();

  /**
   * Emits when dragging ends with a `move` drop effect.
   * @zh 拖拽以 `move`（移动）放置效果结束时发出。
   */
  @Output()
  readonly dndMoved:EventEmitter<DragEvent> = new EventEmitter<DragEvent>();

  /**
   * Emits when dragging ends with a `copy` drop effect.
   * @zh 拖拽以 `copy`（复制）放置效果结束时发出。
   */
  @Output()
  readonly dndCopied:EventEmitter<DragEvent> = new EventEmitter<DragEvent>();

  /**
   * Emits when dragging ends with a `link` drop effect.
   * @zh 拖拽以 `link`（链接）放置效果结束时发出。
   */
  @Output()
  readonly dndLinked:EventEmitter<DragEvent> = new EventEmitter<DragEvent>();

  /**
   * Emits when dragging ends without a recognized drop effect (i.e. canceled).
   * @zh 拖拽结束但没有可识别的放置效果时发出（即被取消）。
   */
  @Output()
  readonly dndCanceled:EventEmitter<DragEvent> = new EventEmitter<DragEvent>();

  /**
   * Host binding `draggable` bound to host attribute/property `attr.draggable` for draggable.
   * @zh 内部使用，绑定宿主元素的原生 `draggable` 属性。
   * @zh 内部使用，绑定宿主元素的原生 `draggable` 属性。
   */
  @HostBinding( "attr.draggable" )
  draggable = true;

  /**
   * Property `dndHandle` (`DndHandleDirective`) storing dnd handle.
   * @zh 属性 `dndHandle`（类型：`DndHandleDirective`），用于存储或配置拖放连接手柄。
   */
  private dndHandle?:DndHandleDirective;

  /**
   * Property `dndDragImageElementRef` (`ElementRef<any>`) storing dnd drag image element ref.
   * @zh 属性 `dndDragImageElementRef`（类型：`ElementRef<any>`），用于存储或配置拖放拖拽图像元素引用。
   */
  private dndDragImageElementRef?:ElementRef;

  /**
   * Property `dragImage` (`Element`) storing drag image.
   * @zh 属性 `dragImage`（类型：`Element`），用于存储或配置拖拽图像。
   */
  private dragImage:Element | undefined;

  /**
   * Property `isDragStarted` (`boolean`) storing is drag started (default: `false`).
   * @zh 属性 `isDragStarted`（类型：`boolean`），用于存储或配置是否为拖拽已开始（默认值：`false`）。
   */
  private isDragStarted:boolean = false;

  /**
   * Property `dragEventHandler` (`(event: DragEvent) => void`) storing drag event handler.
   * @zh 属性 `dragEventHandler`（类型：`(event: DragEvent) => void`），用于存储或配置拖拽事件处理器。
   */
  private readonly dragEventHandler:( event:DragEvent ) => void = ( event:DragEvent ) => this.onDrag( event );

  /**
   * When `true`, disables dragging and applies `dndDraggableDisabledClass` to the host element.
   * @zh 为 `true` 时禁用拖拽，并将 `dndDraggableDisabledClass` 应用到宿主元素上。
   */
  @Input()
  set dndDisableIf( value:boolean ) {

    this.draggable = !value;

    if( this.draggable ) {
      this.renderer.removeClass( this.elementRef.nativeElement, this.dndDraggableDisabledClass );
    } else {
      this.renderer.addClass( this.elementRef.nativeElement, this.dndDraggableDisabledClass );
    }
  }

  /**
   * Alias for `dndDisableIf`.
   * @zh `dndDisableIf` 的别名。
   */
  @Input()
  set dndDisableDragIf( value:boolean ) {
    this.dndDisableIf = value;
  }

  /**
   * Creates an instance of `DndDraggableDirective` and initializes its dependencies and internal state.
   * @zh 创建 `DndDraggableDirective` 实例，并初始化其依赖项与内部状态。
   * @param elementRef - Injected or initial element ref (`ElementRef<any>`) / 注入或传入的元素引用（`ElementRef<any>`）
   * @param renderer - Injected or initial renderer (`Renderer2`) / 注入或传入的渲染器（`Renderer2`）
   * @param ngZone - Injected or initial ng zone (`NgZone`) / 注入或传入的Angular区域(NgZone)（`NgZone`）
   */
  constructor( private elementRef:ElementRef,
               private renderer:Renderer2,
               private ngZone:NgZone ) {
  }

  /**
   * Angular lifecycle hook invoked once after the component's view and child views are initialized.
   * @zh Angular 生命周期钩子：在组件视图及其子视图初始化完成后调用一次。
   */
  ngAfterViewInit():void {
    this.ngZone.runOutsideAngular( () => {
      this.elementRef.nativeElement.addEventListener( "drag", this.dragEventHandler );
    } );
  }

  /**
   * Angular lifecycle hook invoked just before the component, directive, or service is destroyed to release subscriptions and resources.
   * @zh Angular 生命周期钩子：在组件、指令或服务销毁前调用，用于释放订阅与清理资源。
   */
  ngOnDestroy():void {
    this.elementRef.nativeElement.removeEventListener( "drag", this.dragEventHandler );
    if(this.isDragStarted === true) {
      endDrag()
    }
  }

  /**
   * @hidden Handles the native `dragstart` event: initializes drag state and emits `dndStart`.
   * @zh 内部使用，处理原生 `dragstart` 事件：初始化拖拽状态并发出 `dndStart`。
   */
  @HostListener( "dragstart", [ "$event" ] )
  onDragStart( event:DndEvent ): boolean {

    if( this.draggable === false ) {
      return false;
    }
    if( typeof this.dndHandle !== "undefined"
      && typeof event._dndUsingHandle === "undefined" ) {
      return false;
    }

    startDrag( event, this.dndEffectAllowed, this.dndType );

    this.isDragStarted = true;

    setDragData( event, {data: this.dndDraggable, type: this.dndType}, dndState.effectAllowed );

    this.dragImage = this.determineDragImage();

    this.renderer.addClass( this.dragImage, this.dndDraggingClass );

    if( typeof this.dndDragImageElementRef !== "undefined"
      || typeof event._dndUsingHandle !== "undefined" ) {

      setDragImage( event, this.dragImage, this.dndDragImageOffsetFunction );
    }

    const unregister = this.renderer.listen( this.elementRef.nativeElement, "drag", () => {
      this.renderer.addClass( this.elementRef.nativeElement, this.dndDraggingSourceClass );
      unregister();
    } );

    this.dndStart.emit( event );

    event.stopPropagation();
    return true;
  }

  /**
   * @hidden Handles the native `drag` event and re-emits it as `dndDrag`.
   * @zh 内部使用，处理原生 `drag` 事件并将其重新以 `dndDrag` 发出。
   */
  onDrag( event:DragEvent ) {

    this.dndDrag.emit( event );
  }

  /**
   * @hidden Handles the native `dragend` event: emits the drop-effect-specific output plus `dndEnd`.
   * @zh 内部使用，处理原生 `dragend` 事件：发出对应放置效果的输出以及 `dndEnd`。
   */
  @HostListener( "dragend", [ "$event" ] )
  onDragEnd( event:DragEvent ) {

    const dropEffect = dndState.dropEffect;

    let dropEffectEmitter:EventEmitter<DragEvent>;

    switch( dropEffect ) {

      case "copy":
        dropEffectEmitter = this.dndCopied;
        break;

      case "link":
        dropEffectEmitter = this.dndLinked;
        break;

      case "move":
        dropEffectEmitter = this.dndMoved;
        break;

      default:
        dropEffectEmitter = this.dndCanceled;
        break;
    }

    dropEffectEmitter.emit( event );
    this.dndEnd.emit( event );

    // reset global state
    endDrag();

    this.isDragStarted = false;

    this.renderer.removeClass( this.dragImage, this.dndDraggingClass );

    // IE9 special hammering
    window.setTimeout( () => {
      this.renderer.removeClass( this.elementRef.nativeElement, this.dndDraggingSourceClass );
    }, 0 );

    event.stopPropagation();
  }

  /**
   * Registers the child {@link DndHandleDirective} that dragging must start from, if any.
   * @zh 注册子级 {@link DndHandleDirective}（若存在），拖拽必须从该手柄发起。
   */
  registerDragHandle( handle:DndHandleDirective | undefined ) {

    this.dndHandle = handle;
  }

  /**
   * Registers the child element reference to use as the custom drag image.
   * @zh 注册用作自定义拖拽图像的子元素引用。
   */
  registerDragImage( elementRef:ElementRef | undefined ) {

    this.dndDragImageElementRef = elementRef;
  }

  /**
   * Executes `determineDragImage` to handle determine drag image.
   * @zh 执行 `determineDragImage`，用于determine拖拽图像。
   * @returns Result of type `Element` / 类型为 `Element` 的返回值
   */
  private determineDragImage():Element {
    if( typeof this.dndDragImageElementRef !== "undefined" ) {
      return this.dndDragImageElementRef.nativeElement as Element;
    }
    else {
      return this.elementRef.nativeElement;
    }
  }
}
