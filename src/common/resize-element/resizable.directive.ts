/**
 * @fileoverview Module `src/common/resize-element/resizable.directive.ts` providing resizable directive definitions and implementation.
 * @zh 模块文件 `src/common/resize-element/resizable.directive.ts`，提供是否可调尺寸指令相关的定义与实现。
 */

import {
  Directive,
  Renderer2,
  ElementRef,
  OnInit,
  Output,
  Input,
  EventEmitter,
  OnDestroy,
  NgZone,
  Inject,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Subject, Observable, Observer, merge } from 'rxjs';
import {
  map,
  mergeMap,
  takeUntil,
  filter,
  pairwise,
  take,
  share,
  tap,
  throttleTime,
} from 'rxjs/operators';
import { Edges } from './interfaces/edges.interface';
import { BoundingRectangle } from './interfaces/bounding-rectangle.interface';
import { ResizeEvent } from './interfaces/resize-event.interface';
import { IS_TOUCH_DEVICE } from './util/is-touch-device';
import { deepCloneNode } from './util/clone-node';

/**
 * Interface `PointerEventCoordinate` defining the contract and properties for pointer event coordinate.
 * @zh 接口 `PointerEventCoordinate`，定义指针事件坐标的数据结构契约与属性规范。
 */
interface PointerEventCoordinate {
  /**
   * Property `clientX` (`number`) storing client x.
   * @zh 属性 `clientX`（类型：`number`），用于存储或配置clientX坐标。
   */
  clientX: number;
  /**
   * Property `clientY` (`number`) storing client y.
   * @zh 属性 `clientY`（类型：`number`），用于存储或配置clientY坐标。
   */
  clientY: number;
  /**
   * Property `event` (`MouseEvent | TouchEvent`) storing event.
   * @zh 属性 `event`（类型：`MouseEvent | TouchEvent`），用于存储或配置事件。
   */
  event: MouseEvent | TouchEvent;
}

/**
 * Interface `Coordinate` defining the contract and properties for coordinate.
 * @zh 接口 `Coordinate`，定义坐标的数据结构契约与属性规范。
 */
interface Coordinate {
  /**
   * Property `x` (`number`) storing x.
   * @zh 属性 `x`（类型：`number`），用于存储或配置X坐标。
   */
  x: number;
  /**
   * Property `y` (`number`) storing y.
   * @zh 属性 `y`（类型：`number`），用于存储或配置Y坐标。
   */
  y: number;
}

/**
 * Executes `getNewBoundingRectangle` to handle get new bounding rectangle.
 * @zh 执行 `getNewBoundingRectangle`，用于获取新包围边界矩形。
 * @param startingRect - starting rect parameter (`BoundingRectangle`) / 开始矩形参数（`BoundingRectangle`）
 * @param edges - edges parameter (`Edges`) / 边/连线列表参数（`Edges`）
 * @param clientX - client x parameter (`number`) / clientX坐标参数（`number`）
 * @param clientY - client y parameter (`number`) / clientY坐标参数（`number`）
 * @returns Result of type `BoundingRectangle` / 类型为 `BoundingRectangle` 的返回值
 */
function getNewBoundingRectangle(
  startingRect: BoundingRectangle,
  edges: Edges,
  clientX: number,
  clientY: number
): BoundingRectangle {
  const newBoundingRect: BoundingRectangle = {
    top: startingRect.top,
    bottom: startingRect.bottom,
    left: startingRect.left,
    right: startingRect.right,
  };

  if (edges.top) {
    newBoundingRect.top += clientY;
  }
  if (edges.bottom) {
    newBoundingRect.bottom += clientY;
  }
  if (edges.left) {
    newBoundingRect.left += clientX;
  }
  if (edges.right) {
    newBoundingRect.right += clientX;
  }
  newBoundingRect.height = newBoundingRect.bottom - newBoundingRect.top;
  newBoundingRect.width = newBoundingRect.right - newBoundingRect.left;

  return newBoundingRect;
}

/**
 * Executes `getElementRect` to handle get element rect.
 * @zh 执行 `getElementRect`，用于获取元素矩形。
 * @param element - element parameter (`ElementRef<any>`) / 元素参数（`ElementRef<any>`）
 * @param ghostElementPositioning - ghost element positioning parameter (`string`) / ghost元素位置参数（`string`）
 * @returns Result of type `BoundingRectangle` / 类型为 `BoundingRectangle` 的返回值
 */
function getElementRect(
  element: ElementRef,
  ghostElementPositioning: string
): BoundingRectangle {
  let translateX = 0;
  let translateY = 0;
  const style = element.nativeElement.style;
  const transformProperties = [
    'transform',
    '-ms-transform',
    '-moz-transform',
    '-o-transform',
  ];
  const transform = transformProperties
    .map((property) => style[property])
    .find((value) => !!value);
  if (transform && transform.includes('translate')) {
    translateX = transform.replace(
      /.*translate3?d?\((-?[0-9]*)px, (-?[0-9]*)px.*/,
      '$1'
    );
    translateY = transform.replace(
      /.*translate3?d?\((-?[0-9]*)px, (-?[0-9]*)px.*/,
      '$2'
    );
  }

  if (ghostElementPositioning === 'absolute') {
    return {
      height: element.nativeElement.offsetHeight,
      width: element.nativeElement.offsetWidth,
      top: element.nativeElement.offsetTop - translateY,
      bottom:
        element.nativeElement.offsetHeight +
        element.nativeElement.offsetTop -
        translateY,
      left: element.nativeElement.offsetLeft - translateX,
      right:
        element.nativeElement.offsetWidth +
        element.nativeElement.offsetLeft -
        translateX,
    };
  } else {
    const boundingRect: BoundingRectangle =
      element.nativeElement.getBoundingClientRect();
    return {
      height: boundingRect.height,
      width: boundingRect.width,
      top: boundingRect.top - translateY,
      bottom: boundingRect.bottom - translateY,
      left: boundingRect.left - translateX,
      right: boundingRect.right - translateX,
      scrollTop: element.nativeElement.scrollTop,
      scrollLeft: element.nativeElement.scrollLeft,
    };
  }
}

/**
 * Interface `ResizeCursors` defining the contract and properties for resize cursors.
 * @zh 接口 `ResizeCursors`，定义调整尺寸光标的数据结构契约与属性规范。
 */
export interface ResizeCursors {
  /**
   * Property `topLeft` (`string`) storing top left.
   * @zh 属性 `topLeft`（类型：`string`），用于存储或配置顶部位置左侧位置。
   */
  topLeft: string;
  /**
   * Property `topRight` (`string`) storing top right.
   * @zh 属性 `topRight`（类型：`string`），用于存储或配置顶部位置右侧位置。
   */
  topRight: string;
  /**
   * Property `bottomLeft` (`string`) storing bottom left.
   * @zh 属性 `bottomLeft`（类型：`string`），用于存储或配置底部位置左侧位置。
   */
  bottomLeft: string;
  /**
   * Property `bottomRight` (`string`) storing bottom right.
   * @zh 属性 `bottomRight`（类型：`string`），用于存储或配置底部位置右侧位置。
   */
  bottomRight: string;
  /**
   * Property `leftOrRight` (`string`) storing left or right.
   * @zh 属性 `leftOrRight`（类型：`string`），用于存储或配置左侧位置Or右侧位置。
   */
  leftOrRight: string;
  /**
   * Property `topOrBottom` (`string`) storing top or bottom.
   * @zh 属性 `topOrBottom`（类型：`string`），用于存储或配置顶部位置Or底部位置。
   */
  topOrBottom: string;
}

/**
 * Constant/variable `DEFAULT_RESIZE_CURSORS` defining default resize cursors in `src/common/resize-element`.
 * @zh 常量/变量 `DEFAULT_RESIZE_CURSORS`，定义 `src/common/resize-element` 中的默认调整尺寸光标。
 */
const DEFAULT_RESIZE_CURSORS: ResizeCursors = Object.freeze({
  topLeft: 'nw-resize',
  topRight: 'ne-resize',
  bottomLeft: 'sw-resize',
  bottomRight: 'se-resize',
  leftOrRight: 'col-resize',
  topOrBottom: 'row-resize',
});

/**
 * Executes `getResizeCursor` to handle get resize cursor.
 * @zh 执行 `getResizeCursor`，用于获取调整尺寸光标。
 * @param edges - edges parameter (`Edges`) / 边/连线列表参数（`Edges`）
 * @param cursors - cursors parameter (`ResizeCursors`) / 光标参数（`ResizeCursors`）
 * @returns Result of type `string` / 类型为 `string` 的返回值
 */
function getResizeCursor(edges: Edges, cursors: ResizeCursors): string {
  if (edges.left && edges.top) {
    return cursors.topLeft;
  } else if (edges.right && edges.top) {
    return cursors.topRight;
  } else if (edges.left && edges.bottom) {
    return cursors.bottomLeft;
  } else if (edges.right && edges.bottom) {
    return cursors.bottomRight;
  } else if (edges.left || edges.right) {
    return cursors.leftOrRight;
  } else if (edges.top || edges.bottom) {
    return cursors.topOrBottom;
  } else {
    return '';
  }
}

/**
 * Executes `getEdgesDiff` to handle get edges diff.
 * @zh 执行 `getEdgesDiff`，用于获取边/连线列表Diff。
 * @param { edges, initialRectangle, new... - { edges, initial rectangle, new parameter (`{ edges: Edges; initialRectangle: BoundingRectangle; newRect...`) / {edges,初始Rectangle,新参数（`{ edges: Edges; initialRectangle: BoundingRectangle; newRect...`）
 * @returns Result of type `Edges` / 类型为 `Edges` 的返回值
 */
function getEdgesDiff({
  edges,
  initialRectangle,
  newRectangle,
}: {
  edges: Edges;
  initialRectangle: BoundingRectangle;
  newRectangle: BoundingRectangle;
}): Edges {
  const edgesDiff: Edges = {};
  Object.keys(edges).forEach((edge) => {
    edgesDiff[edge] = (newRectangle[edge] || 0) - (initialRectangle[edge] || 0);
  });
  return edgesDiff;
}

/**
 * Constant/variable `RESIZE_ACTIVE_CLASS` defining resize active class in `src/common/resize-element`.
 * @zh 常量/变量 `RESIZE_ACTIVE_CLASS`，定义 `src/common/resize-element` 中的调整尺寸激活类名。
 */
const RESIZE_ACTIVE_CLASS: string = 'resize-active';
/**
 * Constant/variable `RESIZE_GHOST_ELEMENT_CLASS` defining resize ghost element class in `src/common/resize-element`.
 * @zh 常量/变量 `RESIZE_GHOST_ELEMENT_CLASS`，定义 `src/common/resize-element` 中的调整尺寸GHOST元素类名。
 */
const RESIZE_GHOST_ELEMENT_CLASS: string = 'resize-ghost-element';

/**
 * Constant/variable `MOUSE_MOVE_THROTTLE_MS` defining mouse move throttle ms in `src/common/resize-element`.
 * @zh 常量/变量 `MOUSE_MOVE_THROTTLE_MS`，定义 `src/common/resize-element` 中的鼠标移动节流毫秒。
 */
export const MOUSE_MOVE_THROTTLE_MS: number = 50;

/**
 * Place this on an element to make it resizable. For example:
 *
 * ```html
 * <div
 *   mwlResizable
 *   [resizeEdges]="{bottom: true, right: true, top: true, left: true}"
 *   [enableGhostResize]="true">
 * </div>
 * ```
 * Or in case they are sibling elements:
 * ```html
 * <div mwlResizable #resizableElement="mwlResizable"></div>
 * <div duiResizeHandle [resizableContainer]="resizableElement" [resizeEdges]="{bottom: true, right: true}"></div>
 * ```
 * @zh 将此指令用于元素使其可缩放，可配合 {@link ResizeHandleDirective} 作为独立的拖拽手柄。
 */
@Directive({
  selector: '[duiResizable]',
  exportAs: 'duiResizable',
})
export class ResizableDirective implements OnInit, OnDestroy {
  /**
   * A function that will be called before each resize event. Return `true` to allow the resize event to propagate or `false` to cancel it

   * @zh 输入属性 `validateResize`（类型：`(resizeEvent: ResizeEvent) => boolean`），用于配置校验调整尺寸。
   */
  @Input() validateResize: (resizeEvent: ResizeEvent) => boolean;

  /**
   * Set to `true` to enable a temporary resizing effect of the element in between the `resizeStart` and `resizeEnd` events.

   * @zh 输入属性 `enableGhostResize`（类型：`boolean`），用于配置启用Ghost调整尺寸（默认值：`false`）。
   */
  @Input() enableGhostResize: boolean = false;

  /**
   * A snap grid that resize events will be locked to.
   *
   * e.g. to only allow the element to be resized every 10px set it to `{left: 10, right: 10}`

   * @zh 输入属性 `resizeSnapGrid`（类型：`Edges`），用于配置调整尺寸吸附网格表格（默认值：`{}`）。
   */
  @Input() resizeSnapGrid: Edges = {};

  /**
   * The mouse cursors that will be set on the resize edges

   * @zh 输入属性 `resizeCursors`（类型：`ResizeCursors`），用于配置调整尺寸光标（默认值：`DEFAULT_RESIZE_CURSORS`）。
   */
  @Input() resizeCursors: ResizeCursors = DEFAULT_RESIZE_CURSORS;

  /**
   * Define the positioning of the ghost element (can be fixed or absolute)

   * @zh 输入属性 `ghostElementPositioning`（类型：`"fixed" | "absolute"`），用于配置ghost元素位置（默认值：`'fixed'`）。
   */
  @Input() ghostElementPositioning: 'fixed' | 'absolute' = 'fixed';

  /**
   * Allow elements to be resized to negative dimensions

   * @zh 输入属性 `allowNegativeResizes`（类型：`boolean`），用于配置允许Negative调整尺寸（默认值：`false`）。
   */
  @Input() allowNegativeResizes: boolean = false;

  /**
   * The mouse move throttle in milliseconds, default: 50 ms

   * @zh 输入属性 `mouseMoveThrottleMS`（类型：`number`），用于配置鼠标移动节流毫秒（默认值：`MOUSE_MOVE_THROTTLE_MS`）。
   */
  @Input() mouseMoveThrottleMS: number = MOUSE_MOVE_THROTTLE_MS;

  /**
   * Called when the mouse is pressed and a resize event is about to begin. `$event` is a `ResizeEvent` object.

   * @zh 输出事件 `resizeStart`（类型：`EventEmitter<ResizeEvent>`），当触发调整尺寸开始时向外发出事件。
   */
  @Output() resizeStart = new EventEmitter<ResizeEvent>();

  /**
   * Called as the mouse is dragged after a resize event has begun. `$event` is a `ResizeEvent` object.

   * @zh 输出事件 `resizing`（类型：`EventEmitter<ResizeEvent>`），当触发调整尺寸中时向外发出事件。
   */
  @Output() resizing = new EventEmitter<ResizeEvent>();

  /**
   * Called after the mouse is released after a resize event. `$event` is a `ResizeEvent` object.

   * @zh 输出事件 `resizeEnd`（类型：`EventEmitter<ResizeEvent>`），当触发调整尺寸结束时向外发出事件。
   */
  @Output() resizeEnd = new EventEmitter<ResizeEvent>();

  /**
   * @hidden Internal subject a paired {@link ResizeHandleDirective} pushes pointer-up events into.
   * @zh 内部使用，配对的 {@link ResizeHandleDirective} 通过它推送指针抬起事件。
   */
  public mouseup = new Subject<{
    clientX: number;
    clientY: number;
    edges?: Edges;
  }>();

  /**
   * @hidden Internal subject a paired {@link ResizeHandleDirective} pushes pointer-down events into.
   * @zh 内部使用，配对的 {@link ResizeHandleDirective} 通过它推送指针按下事件。
   */
  public mousedown = new Subject<{
    clientX: number;
    clientY: number;
    edges?: Edges;
  }>();

  /**
   * @hidden Internal subject a paired {@link ResizeHandleDirective} pushes pointer-move events into.
   * @zh 内部使用，配对的 {@link ResizeHandleDirective} 通过它推送指针移动事件。
   */
  public mousemove = new Subject<{
    clientX: number;
    clientY: number;
    edges?: Edges;
    event: MouseEvent | TouchEvent;
  }>();

  /**
   * Property `pointerEventListeners` (`PointerEventListeners`) storing pointer event listeners.
   * @zh 属性 `pointerEventListeners`（类型：`PointerEventListeners`），用于存储或配置指针事件监听器列表。
   */
  private pointerEventListeners: PointerEventListeners;

  /**
   * Property `destroy$` (`Subject<void>`) storing destroy (default: `new Subject<void>()`).
   * @zh 属性 `destroy$`（类型：`Subject<void>`），用于存储或配置销毁（默认值：`new Subject<void>()`）。
   */
  private destroy$ = new Subject<void>();

  /**
   * Creates an instance of `ResizableDirective` and initializes its dependencies and internal state.
   * @hidden

   * @zh 创建 `ResizableDirective` 实例，并初始化其依赖项与内部状态。
   */
  constructor(
    @Inject(PLATFORM_ID) private platformId,
    private renderer: Renderer2,
    public elm: ElementRef,
    private zone: NgZone
  ) {
    this.pointerEventListeners = PointerEventListeners.getInstance(
      renderer,
      zone
    );
  }

  /**
   * Angular lifecycle hook invoked once after component or directive inputs are initialized.
   * @hidden

   * @zh Angular 生命周期钩子：在组件或指令的输入属性初始化完成后调用一次。
   */
  ngOnInit(): void {
    const mousedown$: Observable<{
      clientX: number;
      clientY: number;
      edges?: Edges;
    }> = merge(this.pointerEventListeners.pointerDown, this.mousedown);

    const mousemove$ = merge(
      this.pointerEventListeners.pointerMove,
      this.mousemove
    ).pipe(
      tap(({ event }) => {
        if (currentResize) {
          try {
            event.preventDefault();
          } catch (e) {
            // just adding try-catch not to see errors in console if there is a passive listener for same event somewhere
            // browser does nothing except of writing errors to console
          }
        }
      }),
      // `mouseMoveThrottleMS` was declared as a configurable @Input() but never actually
      // applied anywhere in this pipeline -- resizing was never throttled regardless of
      // what consumers set it to. preventDefault() above still runs on every raw move
      // (unthrottled, so text selection etc. stays suppressed throughout the drag);
      // only the computation-driving stream downstream is rate-limited. `trailing: true`
      // keeps the final position of each throttle window so the resize doesn't lag behind
      // where the pointer actually stopped.
      throttleTime(this.mouseMoveThrottleMS, undefined, { leading: true, trailing: true }),
      share()
    );

    const mouseup$ = merge(this.pointerEventListeners.pointerUp, this.mouseup);

    let currentResize: {
      edges: Edges;
      startingRect: BoundingRectangle;
      currentRect: BoundingRectangle;
      clonedNode?: HTMLElement;
    } | null;

    const removeGhostElement = () => {
      if (currentResize && currentResize.clonedNode) {
        this.elm.nativeElement.parentElement.removeChild(
          currentResize.clonedNode
        );
        this.renderer.setStyle(this.elm.nativeElement, 'visibility', 'inherit');
      }
    };

    const getResizeCursors = (): ResizeCursors => {
      return {
        ...DEFAULT_RESIZE_CURSORS,
        ...this.resizeCursors,
      };
    };

    const mousedrag = mousedown$
      .pipe(
        mergeMap((startCoords) => {
          function getDiff(moveCoords: { clientX: number; clientY: number }) {
            return {
              clientX: moveCoords.clientX - startCoords.clientX,
              clientY: moveCoords.clientY - startCoords.clientY,
            };
          }

          const getSnapGrid = () => {
            const snapGrid: Coordinate = { x: 1, y: 1 };

            if (currentResize) {
              if (this.resizeSnapGrid.left && currentResize.edges.left) {
                snapGrid.x = +this.resizeSnapGrid.left;
              } else if (
                this.resizeSnapGrid.right &&
                currentResize.edges.right
              ) {
                snapGrid.x = +this.resizeSnapGrid.right;
              }

              if (this.resizeSnapGrid.top && currentResize.edges.top) {
                snapGrid.y = +this.resizeSnapGrid.top;
              } else if (
                this.resizeSnapGrid.bottom &&
                currentResize.edges.bottom
              ) {
                snapGrid.y = +this.resizeSnapGrid.bottom;
              }
            }

            return snapGrid;
          };

          function getGrid(
            coords: { clientX: number; clientY: number },
            snapGrid: Coordinate
          ) {
            return {
              x: Math.ceil(coords.clientX / snapGrid.x),
              y: Math.ceil(coords.clientY / snapGrid.y),
            };
          }

          return (
            merge(
              mousemove$.pipe(take(1)).pipe(map((coords) => [ coords])),
              mousemove$.pipe(pairwise())
            ) as Observable<
              [
                { clientX: number; clientY: number },
                { clientX: number; clientY: number }
              ]
            >
          )
            .pipe(
              map(([previousCoords, newCoords]) => {
                return [
                  previousCoords ? getDiff(previousCoords) : previousCoords,
                  newCoords? getDiff(newCoords): previousCoords,
                ];
              })
            )
            .pipe(
              filter(([previousCoords, newCoords]) => {
                if (!previousCoords) {
                  return true;
                }

                const snapGrid: Coordinate = getSnapGrid();
                const previousGrid: Coordinate = getGrid(
                  previousCoords,
                  snapGrid
                );
                const newGrid: Coordinate = getGrid(newCoords, snapGrid);

                return (
                  previousGrid.x !== newGrid.x || previousGrid.y !== newGrid.y
                );
              })
            )
            .pipe(
              map(([, newCoords]) => {
                const snapGrid: Coordinate = getSnapGrid();
                return {
                  clientX:
                    Math.round(newCoords.clientX / snapGrid.x) * snapGrid.x,
                  clientY:
                    Math.round(newCoords.clientY / snapGrid.y) * snapGrid.y,
                };
              })
            )
            .pipe(takeUntil(merge(mouseup$, mousedown$)));
        })
      )
      .pipe(filter(() => !!currentResize));

    mousedrag
      .pipe(
        map(({ clientX, clientY }) => {
          return getNewBoundingRectangle(
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            currentResize!.startingRect,
             // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            currentResize!.edges,
            clientX,
            clientY
          );
        })
      )
      .pipe(
        filter((newBoundingRect: BoundingRectangle) => {
          return (
            this.allowNegativeResizes ||
            !!(
              newBoundingRect.height &&
              newBoundingRect.width &&
              newBoundingRect.height > 0 &&
              newBoundingRect.width > 0
            )
          );
        })
      )
      .pipe(
        filter((newBoundingRect: BoundingRectangle) => {
          return this.validateResize
            ? this.validateResize({
                rectangle: newBoundingRect,
                edges: getEdgesDiff({
                   // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                  edges: currentResize!.edges,
                   // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                  initialRectangle: currentResize!.startingRect,
                  newRectangle: newBoundingRect,
                }),
              })
            : true;
        }),
        takeUntil(this.destroy$)
      )
      .subscribe((newBoundingRect: BoundingRectangle) => {
        if (currentResize && currentResize.clonedNode) {
          this.renderer.setStyle(
            currentResize.clonedNode,
            'height',
            `${newBoundingRect.height}px`
          );
          this.renderer.setStyle(
            currentResize.clonedNode,
            'width',
            `${newBoundingRect.width}px`
          );
          this.renderer.setStyle(
            currentResize.clonedNode,
            'top',
            `${newBoundingRect.top}px`
          );
          this.renderer.setStyle(
            currentResize.clonedNode,
            'left',
            `${newBoundingRect.left}px`
          );
        }

        if (this.resizing.observers.length > 0) {
          this.zone.run(() => {
            this.resizing.emit({
              edges: getEdgesDiff({
                 // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                edges: currentResize!.edges,
                 // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                initialRectangle: currentResize!.startingRect,
                newRectangle: newBoundingRect,
              }),
              rectangle: newBoundingRect,
            });
          });
        }
         // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        currentResize!.currentRect = newBoundingRect;
      });

    mousedown$
      .pipe(
        map(({ edges }) => {
          return edges || {};
        }),
        filter((edges: Edges) => {
          return Object.keys(edges).length > 0;
        }),
        takeUntil(this.destroy$)
      )
      .subscribe((edges: Edges) => {
        if (currentResize) {
          removeGhostElement();
        }
        const startingRect: BoundingRectangle = getElementRect(
          this.elm,
          this.ghostElementPositioning
        );
        currentResize = {
          edges,
          startingRect,
          currentRect: startingRect,
        };
        const resizeCursors = getResizeCursors();
        const cursor = getResizeCursor(currentResize.edges, resizeCursors);
        this.renderer.setStyle(document.body, 'cursor', cursor);
        this.setElementClass(this.elm, RESIZE_ACTIVE_CLASS, true);
        if (this.enableGhostResize) {
          currentResize.clonedNode = deepCloneNode(this.elm.nativeElement);
          this.elm.nativeElement.parentElement.appendChild(
            currentResize.clonedNode
          );
          this.renderer.setStyle(
            this.elm.nativeElement,
            'visibility',
            'hidden'
          );
          this.renderer.setStyle(
            currentResize.clonedNode,
            'position',
            this.ghostElementPositioning
          );
          this.renderer.setStyle(
            currentResize.clonedNode,
            'left',
            `${currentResize.startingRect.left}px`
          );
          this.renderer.setStyle(
            currentResize.clonedNode,
            'top',
            `${currentResize.startingRect.top}px`
          );
          this.renderer.setStyle(
            currentResize.clonedNode,
            'height',
            `${currentResize.startingRect.height}px`
          );
          this.renderer.setStyle(
            currentResize.clonedNode,
            'width',
            `${currentResize.startingRect.width}px`
          );
          this.renderer.setStyle(
            currentResize.clonedNode,
            'cursor',
            getResizeCursor(currentResize.edges, resizeCursors)
          );
          this.renderer.addClass(
            currentResize.clonedNode,
            RESIZE_GHOST_ELEMENT_CLASS
          );
           // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          currentResize.clonedNode!.scrollTop = currentResize.startingRect
            .scrollTop as number;
             // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          currentResize.clonedNode!.scrollLeft = currentResize.startingRect
            .scrollLeft as number;
        }
        if (this.resizeStart.observers.length > 0) {
          this.zone.run(() => {
            this.resizeStart.emit({
              edges: getEdgesDiff({
                edges,
                initialRectangle: startingRect,
                newRectangle: startingRect,
              }),
              rectangle: getNewBoundingRectangle(startingRect, {}, 0, 0),
            });
          });
        }
      });

    mouseup$.pipe(takeUntil(this.destroy$)).subscribe(() => {
      if (currentResize) {
        this.renderer.removeClass(this.elm.nativeElement, RESIZE_ACTIVE_CLASS);
        this.renderer.setStyle(document.body, 'cursor', '');
        this.renderer.setStyle(this.elm.nativeElement, 'cursor', '');
        if (this.resizeEnd.observers.length > 0) {
          this.zone.run(() => {
            this.resizeEnd.emit({
              edges: getEdgesDiff({
                 // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                edges: currentResize!.edges,
                 // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                initialRectangle: currentResize!.startingRect,
                 // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                newRectangle: currentResize!.currentRect,
              }),
               // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              rectangle: currentResize!.currentRect,
            });
          });
        }
        removeGhostElement();
        currentResize = null;
      }
    });
  }

  /**
   * Angular lifecycle hook invoked just before the component, directive, or service is destroyed to release subscriptions and resources.
   * @hidden

   * @zh Angular 生命周期钩子：在组件、指令或服务销毁前调用，用于释放订阅与清理资源。
   */
  ngOnDestroy(): void {
    // browser check for angular universal, because it doesn't know what document is
    if (isPlatformBrowser(this.platformId)) {
      this.renderer.setStyle(document.body, 'cursor', '');
    }
    this.mousedown.complete();
    this.mouseup.complete();
    this.mousemove.complete();
    this.destroy$.next();
  }

  /**
   * Executes `setElementClass` to handle set element class.
   * @zh 执行 `setElementClass`，用于集合元素类名。
   * @param elm - elm parameter (`ElementRef<any>`) / elm参数（`ElementRef<any>`）
   * @param name - name parameter (`string`) / 名称参数（`string`）
   * @param add - add parameter (`boolean`) / 添加参数（`boolean`）
   */
  private setElementClass(elm: ElementRef, name: string, add: boolean): void {
    if (add) {
      this.renderer.addClass(elm.nativeElement, name);
    } else {
      this.renderer.removeClass(elm.nativeElement, name);
    }
  }
}

/**
 * Class `PointerEventListeners` encapsulating pointer event listeners data structures and logic in `src/common/resize-element`.
 * @zh 类 `PointerEventListeners`，封装 `src/common/resize-element` 中的指针事件监听器列表数据结构与处理逻辑。
 */
class PointerEventListeners {
  /**
   * Property `pointerDown` (`Observable<PointerEventCoordinate>`) storing pointer down.
   * @zh 属性 `pointerDown`（类型：`Observable<PointerEventCoordinate>`），用于存储或配置指针向下。
   */
  public pointerDown: Observable<PointerEventCoordinate>;

  /**
   * Property `pointerMove` (`Observable<PointerEventCoordinate>`) storing pointer move.
   * @zh 属性 `pointerMove`（类型：`Observable<PointerEventCoordinate>`），用于存储或配置指针移动。
   */
  public pointerMove: Observable<PointerEventCoordinate>;

  /**
   * Property `pointerUp` (`Observable<PointerEventCoordinate>`) storing pointer up.
   * @zh 属性 `pointerUp`（类型：`Observable<PointerEventCoordinate>`），用于存储或配置指针向上。
   */
  public pointerUp: Observable<PointerEventCoordinate>;

  /**
   * Property `instance` (`PointerEventListeners`) storing instance.
   * @zh 属性 `instance`（类型：`PointerEventListeners`），用于存储或配置实例。
   */
  private static instance: PointerEventListeners;

  /**
   * Executes `getInstance` to handle get instance.
   * @zh 执行 `getInstance`，用于获取实例。
   * @param renderer - renderer parameter (`Renderer2`) / 渲染器参数（`Renderer2`）
   * @param zone - zone parameter (`NgZone`) / 区域(NgZone)参数（`NgZone`）
   * @returns Result of type `PointerEventListeners` / 类型为 `PointerEventListeners` 的返回值
   */
  public static getInstance(
    renderer: Renderer2,
    zone: NgZone
  ): PointerEventListeners {
    if (!PointerEventListeners.instance) {
      PointerEventListeners.instance = new PointerEventListeners(
        renderer,
        zone
      );
    }
    return PointerEventListeners.instance;
  }

  /**
   * Creates an instance of `PointerEventListeners` and initializes its dependencies and internal state.
   * @zh 创建 `PointerEventListeners` 实例，并初始化其依赖项与内部状态。
   * @param renderer - Injected or initial renderer (`Renderer2`) / 注入或传入的渲染器（`Renderer2`）
   * @param zone - Injected or initial zone (`NgZone`) / 注入或传入的区域(NgZone)（`NgZone`）
   */
  constructor(renderer: Renderer2, zone: NgZone) {
    this.pointerDown = new Observable(
      (observer: Observer<PointerEventCoordinate>) => {
        let unsubscribeMouseDown: () => void;
        let unsubscribeTouchStart: (() => void) | undefined;

        zone.runOutsideAngular(() => {
          unsubscribeMouseDown = renderer.listen(
            'document',
            'mousedown',
            (event: MouseEvent) => {
              observer.next({
                clientX: event.clientX,
                clientY: event.clientY,
                event,
              });
            }
          );

          if (IS_TOUCH_DEVICE) {
            unsubscribeTouchStart = renderer.listen(
              'document',
              'touchstart',
              (event: TouchEvent) => {
                observer.next({
                  clientX: event.touches[0].clientX,
                  clientY: event.touches[0].clientY,
                  event,
                });
              }
            );
          }
        });

        return () => {
          unsubscribeMouseDown();
          if (IS_TOUCH_DEVICE) {
             // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            unsubscribeTouchStart!();
          }
        };
      }
    ).pipe(share());

    this.pointerMove = new Observable(
      (observer: Observer<PointerEventCoordinate>) => {
        let unsubscribeMouseMove: () => void;
        let unsubscribeTouchMove: (() => void) | undefined;

        zone.runOutsideAngular(() => {
          unsubscribeMouseMove = renderer.listen(
            'document',
            'mousemove',
            (event: MouseEvent) => {
              observer.next({
                clientX: event.clientX,
                clientY: event.clientY,
                event,
              });
            }
          );

          if (IS_TOUCH_DEVICE) {
            unsubscribeTouchMove = renderer.listen(
              'document',
              'touchmove',
              (event: TouchEvent) => {
                observer.next({
                  clientX: event.targetTouches[0].clientX,
                  clientY: event.targetTouches[0].clientY,
                  event,
                });
              }
            );
          }
        });

        return () => {
          unsubscribeMouseMove();
          if (IS_TOUCH_DEVICE) {
             // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            unsubscribeTouchMove!();
          }
        };
      }
    ).pipe(share());

    this.pointerUp = new Observable(
      (observer: Observer<PointerEventCoordinate>) => {
        let unsubscribeMouseUp: () => void;
        let unsubscribeTouchEnd: (() => void) | undefined;
        let unsubscribeTouchCancel: (() => void) | undefined;

        zone.runOutsideAngular(() => {
          unsubscribeMouseUp = renderer.listen(
            'document',
            'mouseup',
            (event: MouseEvent) => {
              observer.next({
                clientX: event.clientX,
                clientY: event.clientY,
                event,
              });
            }
          );

          if (IS_TOUCH_DEVICE) {
            unsubscribeTouchEnd = renderer.listen(
              'document',
              'touchend',
              (event: TouchEvent) => {
                observer.next({
                  clientX: event.changedTouches[0].clientX,
                  clientY: event.changedTouches[0].clientY,
                  event,
                });
              }
            );

            unsubscribeTouchCancel = renderer.listen(
              'document',
              'touchcancel',
              (event: TouchEvent) => {
                observer.next({
                  clientX: event.changedTouches[0].clientX,
                  clientY: event.changedTouches[0].clientY,
                  event,
                });
              }
            );
          }
        });

        return () => {
          unsubscribeMouseUp();
          if (IS_TOUCH_DEVICE) {
             // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            unsubscribeTouchEnd!();
             // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            unsubscribeTouchCancel!();
          }
        };
      }
    ).pipe(share());
  }
}
