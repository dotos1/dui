/**
 * @fileoverview Module `src/common/resize-element/resize-handle.directive.ts` providing resize handle directive definitions and implementation.
 * @zh 模块文件 `src/common/resize-element/resize-handle.directive.ts`，提供调整尺寸连接手柄指令相关的定义与实现。
 */

import {
  Directive,
  Input,
  Renderer2,
  ElementRef,
  OnInit,
  OnDestroy,
  NgZone,
  Optional,
} from '@angular/core';
import { fromEvent, merge, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ResizableDirective } from './resizable.directive';
import { Edges } from './interfaces/edges.interface';
import { IS_TOUCH_DEVICE } from './util/is-touch-device';

/**
 * Marks an element as a dedicated drag handle that triggers resizing on a sibling/ancestor
 * element carrying {@link ResizableDirective} (`resizableContainer` or nearest via DI).
 * @zh 将元素标记为专用的拖拽手柄，拖拽它会触发携带 {@link ResizableDirective} 的
 * 兄弟/祖先元素（通过 `resizableContainer` 或最近的 DI 注入）进行缩放。
 */
@Directive({
  selector: '[duiResizeHandle]',
  standalone: false,
})
export class ResizeHandleDirective implements OnInit, OnDestroy {
  /**
   * The `Edges` object that contains the edges of the parent element that dragging the handle will trigger a resize on
   * @zh 描述父元素哪些边（edges）会因拖拽该手柄而触发缩放。
   */
  @Input() resizeEdges: Edges = {};
  /**
   * Reference to ResizableDirective in case if handle is not located inside of element with ResizableDirective
   * @zh 当手柄不在带有 {@link ResizableDirective} 的元素内部时，显式指定其引用。
   */
  @Input() resizableContainer: ResizableDirective;

  /**
   * Property `eventListeners` (`{ [key: string]: () => void; touchmove?: () => void; mousemove?: () => void; }`) storing event listeners (default: `{}`).
   * @zh 属性 `eventListeners`（类型：`{ [key: string]: () => void; touchmove?: () => void; mousemove?: () => void; }`），用于存储或配置事件监听器列表（默认值：`{}`）。
   */
  private eventListeners: {
    touchmove?: () => void;
    mousemove?: () => void;
    [key: string]: (() => void) | undefined;
  } = {};

  /**
   * Property `destroy$` (`Subject<void>`) storing destroy (default: `new Subject<void>()`).
   * @zh 属性 `destroy$`（类型：`Subject<void>`），用于存储或配置销毁（默认值：`new Subject<void>()`）。
   */
  private destroy$ = new Subject<void>();

  /**
   * Creates an instance of `ResizeHandleDirective` and initializes its dependencies and internal state.
   * @zh 创建 `ResizeHandleDirective` 实例，并初始化其依赖项与内部状态。
   * @param renderer - Injected or initial renderer (`Renderer2`) / 注入或传入的渲染器（`Renderer2`）
   * @param element - Injected or initial element (`ElementRef<any>`) / 注入或传入的元素（`ElementRef<any>`）
   * @param zone - Injected or initial zone (`NgZone`) / 注入或传入的区域(NgZone)（`NgZone`）
   * @param resizableDirective - Injected or initial resizable directive (`ResizableDirective`) / 注入或传入的是否可调尺寸指令（`ResizableDirective`）
   */
  constructor(
    private renderer: Renderer2,
    private element: ElementRef,
    private zone: NgZone,
    @Optional() private resizableDirective: ResizableDirective
  ) {}

  /**
   * Angular lifecycle hook invoked once after component or directive inputs are initialized.
   * @zh Angular 生命周期钩子：在组件或指令的输入属性初始化完成后调用一次。
   */
  ngOnInit(): void {
    this.zone.runOutsideAngular(() => {
      this.listenOnTheHost<MouseEvent>('mousedown').subscribe((event) => {
        this.onMousedown(event, event.clientX, event.clientY);
      });

      this.listenOnTheHost<MouseEvent>('mouseup').subscribe((event) => {
        this.onMouseup(event.clientX, event.clientY);
      });

      if (IS_TOUCH_DEVICE) {
        this.listenOnTheHost<TouchEvent>('touchstart').subscribe((event) => {
          this.onMousedown(
            event,
            event.touches[0].clientX,
            event.touches[0].clientY
          );
        });

        merge(
          this.listenOnTheHost<TouchEvent>('touchend'),
          this.listenOnTheHost<TouchEvent>('touchcancel')
        ).subscribe((event) => {
          this.onMouseup(
            event.changedTouches[0].clientX,
            event.changedTouches[0].clientY
          );
        });
      }
    });
  }

  /**
   * Angular lifecycle hook invoked just before the component, directive, or service is destroyed to release subscriptions and resources.
   * @zh Angular 生命周期钩子：在组件、指令或服务销毁前调用，用于释放订阅与清理资源。
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.unsubscribeEventListeners();
  }

  /**
   * @hidden Starts tracking pointer movement/release and forwards a mousedown to the paired
   * {@link ResizableDirective}.
   * @zh 内部使用，开始跟踪指针移动/抬起，并向配对的 {@link ResizableDirective} 转发按下事件。
   */
  onMousedown(
    event: MouseEvent | TouchEvent,
    clientX: number,
    clientY: number
  ): void {
    event.preventDefault();
    if (!this.eventListeners.touchmove) {
      this.eventListeners.touchmove = this.renderer.listen(
        this.element.nativeElement,
        'touchmove',
        (touchMoveEvent: TouchEvent) => {
          this.onMousemove(
            touchMoveEvent,
            touchMoveEvent.targetTouches[0].clientX,
            touchMoveEvent.targetTouches[0].clientY
          );
        }
      );
    }
    if (!this.eventListeners.mousemove) {
      this.eventListeners.mousemove = this.renderer.listen(
        this.element.nativeElement,
        'mousemove',
        (mouseMoveEvent: MouseEvent) => {
          this.onMousemove(
            mouseMoveEvent,
            mouseMoveEvent.clientX,
            mouseMoveEvent.clientY
          );
        }
      );
    }
    this.resizable.mousedown.next({
      clientX,
      clientY,
      edges: this.resizeEdges,
    });
  }

  /**
   * @hidden Stops tracking pointer movement and forwards a mouseup to the paired
   * {@link ResizableDirective}.
   * @zh 内部使用，停止跟踪指针移动，并向配对的 {@link ResizableDirective} 转发抬起事件。
   */
  onMouseup(clientX: number, clientY: number): void {
    this.unsubscribeEventListeners();
    this.resizable.mouseup.next({
      clientX,
      clientY,
      edges: this.resizeEdges,
    });
  }

  // directive might be passed from DI or as an input
  /**
   * Gets the current resizable (`resizable: ResizableDirective`).
   * @zh 获取当前是否可调尺寸（`resizable: ResizableDirective`）。
   */
  private get resizable(): ResizableDirective {
    return this.resizableDirective || this.resizableContainer;
  }

  /**
   * Executes `onMousemove` to handle on mousemove.
   * @zh 执行 `onMousemove`，用于当鼠标移动。
   * @param event - event parameter (`MouseEvent | TouchEvent`) / 事件参数（`MouseEvent | TouchEvent`）
   * @param clientX - client x parameter (`number`) / clientX坐标参数（`number`）
   * @param clientY - client y parameter (`number`) / clientY坐标参数（`number`）
   */
  private onMousemove(
    event: MouseEvent | TouchEvent,
    clientX: number,
    clientY: number
  ): void {
    this.resizable.mousemove.next({
      clientX,
      clientY,
      edges: this.resizeEdges,
      event,
    });
  }

  /**
   * Executes `unsubscribeEventListeners` to handle unsubscribe event listeners.
   * @zh 执行 `unsubscribeEventListeners`，用于取消订阅事件监听器列表。
   */
  private unsubscribeEventListeners(): void {
    Object.keys(this.eventListeners).forEach((type) => {
      (this as unknown as { eventListeners? }).eventListeners[type]();
      delete this.eventListeners[type];
    });
  }

  /**
   * Executes `listenOnTheHost` to handle listen on the host.
   * @zh 执行 `listenOnTheHost`，用于监听当The宿主。
   * @param eventName - event name parameter (`string`) / 事件名称参数（`string`）
   */
  private listenOnTheHost<T extends Event>(eventName: string) {
    return fromEvent<T>(this.element.nativeElement, eventName).pipe(
      takeUntil(this.destroy$)
    );
  }
}
