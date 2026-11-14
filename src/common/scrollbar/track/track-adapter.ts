/**
 * @fileoverview Module `src/common/scrollbar/track/track-adapter.ts` providing track adapter definitions and implementation.
 * @zh 模块文件 `src/common/scrollbar/track/track-adapter.ts`，提供track适配器相关的定义与实现。
 */

import { Directive, effect, inject, PLATFORM_ID, untracked } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import {
  Observable,
  delay,
  fromEvent,
  map,
  merge,
  startWith,
  switchMap,
  takeUntil,
  takeWhile,
  tap,
  EMPTY
} from 'rxjs';
import { enableSelection, preventSelection, stopPropagation } from '../utils/common';
import { PointerEventsAdapter } from '../utils/pointer-events-adapter';

/**
 * Angular directive `TrackAdapter` attaching track adapter behavior to host DOM elements.
 * @zh Angular 指令 `TrackAdapter`，为宿主 DOM 元素附加Track适配器行为。
 */
@Directive({ standalone: false })
export abstract class TrackAdapter extends PointerEventsAdapter {

  /**
   * Property `isBrowser` (`boolean`) storing is browser (default: `isPlatformBrowser(inject(PLATFORM_ID))`).
   * @zh 属性 `isBrowser`（类型：`boolean`），用于存储或配置是否为浏览器（默认值：`isPlatformBrowser(inject(PLATFORM_ID))`）。
   */
  private readonly isBrowser: boolean = isPlatformBrowser(inject(PLATFORM_ID));

  // The current position of the mouse during track dragging
  /**
   * Property `currMousePosition` (`number`) storing curr mouse position.
   * @zh 属性 `currMousePosition`（类型：`number`），用于存储或配置当前鼠标位置。
   */
  private currMousePosition: number;

  // The direction of scroll when the track area is clicked
  /**
   * Property `scrollDirection` (`"forward" | "backward"`) storing scroll direction.
   * @zh 属性 `scrollDirection`（类型：`"forward" | "backward"`），用于存储或配置滚动方向。
   */
  protected scrollDirection: 'forward' | 'backward';

  // The maximum scroll position until the end is reached
  /**
   * Property `scrollMax` (`number`) storing scroll max.
   * @zh 属性 `scrollMax`（类型：`number`），用于存储或配置滚动最大值。
   */
  protected scrollMax: number;

  // Returns viewport scroll size
  /**
   * Gets the current content size (`contentSize: number`).
   * @zh 获取当前内容尺寸（`contentSize: number`）。
   */
  protected abstract get contentSize(): number;

  // Returns viewport client size
  /**
   * Gets the current viewport size (`viewportSize: number`).
   * @zh 获取当前视口尺寸（`viewportSize: number`）。
   */
  protected get viewportSize(): number {
    return this.cmp.viewport[this.control.sizeProperty];
  }

  // Get track client rect
  /**
   * Gets the current client rect (`clientRect: DOMRect`).
   * @zh 获取当前client矩形（`clientRect: DOMRect`）。
   */
  protected get clientRect(): DOMRect {
    return this.nativeElement.getBoundingClientRect();
  }

  // Returns the scroll position relative to the track
  /**
   * Executes `getCurrPosition` to handle get curr position.
   * @zh 执行 `getCurrPosition`，用于获取当前位置。
   * @returns Result of type `number` / 类型为 `number` 的返回值
   */
  protected abstract getCurrPosition(): number;

  // Returns the dragging direction forward or backward
  /**
   * Executes `getScrollDirection` to handle get scroll direction.
   * @zh 执行 `getScrollDirection`，用于获取滚动方向。
   * @param position - position parameter (`number`) / 位置参数（`number`）
   * @returns Result of type `"forward" | "backward"` / 类型为 `"forward" | "backward"` 的返回值
   */
  protected abstract getScrollDirection(position: number): 'forward' | 'backward';

  // Function that scrolls to the given position
  /**
   * Executes `scrollTo` to handle scroll to.
   * @zh 执行 `scrollTo`，用于滚动转换为。
   * @param position - position parameter (`number`) / 位置参数（`number`）
   * @returns Result of type `Observable<void>` / 类型为 `Observable<void>` 的返回值
   */
  protected abstract scrollTo(position: number): Observable<void>;

  // Scrollbar track offset
  /**
   * Gets the current offset (`offset: number`).
   * @zh 获取当前偏移量（`offset: number`）。
   */
  get offset(): number {
    return this.clientRect[this.control.rectOffsetProperty];
  }

  // Scrollbar track length
  /**
   * Gets the current size (`size: number`).
   * @zh 获取当前尺寸（`size: number`）。
   */
  get size(): number {
    // Noticed that clientHeight is evaluated before getClientRect.height,
    // causing a wrong track size when integrated in dropdown integration
    return this.nativeElement[this.control.sizeProperty];
  }

  // Observable for track dragging events
  /**
   * Gets the current pointer events (`pointerEvents: Observable<PointerEvent>`).
   * @zh 获取当前指针事件集合（`pointerEvents: Observable<PointerEvent>`）。
   */
  get pointerEvents(): Observable<PointerEvent> {
    // Observable streams for pointer events
    const pointerDown$: Observable<PointerEvent> = fromEvent<PointerEvent>(this.nativeElement, 'pointerdown').pipe(
      stopPropagation(),
      preventSelection(this.document)
    );
    const pointerUp$: Observable<PointerEvent> = fromEvent<PointerEvent>(this.document, 'pointerup', { passive: true }).pipe(
      enableSelection(this.document)
    );

    const pointerEnter$: Observable<boolean> = fromEvent<PointerEvent>(this.nativeElement, 'pointerover', { passive: true }).pipe(
      // When mouse is out and enters again, must set the current position first
      tap((e: PointerEvent) => this.currMousePosition = e[this.control.offsetProperty]),
      map(() => true)
    );
    const pointerLeave$: Observable<boolean> = fromEvent<PointerEvent>(this.nativeElement, 'pointerout', { passive: true }).pipe(
      map(() => false)
    );

    const pointerOver$: Observable<boolean> = merge(pointerEnter$, pointerLeave$).pipe(startWith(true));

    // Keep track of current mouse location while dragging
    const pointerMove$: Observable<PointerEvent> = fromEvent<PointerEvent>(this.nativeElement, 'pointermove', { passive: true }).pipe(
      tap((e: PointerEvent) => this.currMousePosition = e[this.control.offsetProperty])
    );

    return pointerDown$.pipe(
      switchMap((startEvent: PointerEvent) => {
        // Track pointer location while dragging
        pointerMove$.pipe(takeUntil(pointerUp$)).subscribe();

        return this.onTrackFirstClick(startEvent).pipe(
          delay(200),
          switchMap(() => {
            // Otherwise, activate pointermove and pointerout events and switch to ongoing scroll calls
            return pointerOver$.pipe(
              switchMap((over: boolean) => {
                const currDirection: 'forward' | 'backward' = this.getScrollDirection(this.currMousePosition);
                const sameDirection: boolean = this.scrollDirection === currDirection;
                // If mouse is out the track pause the scroll calls, otherwise keep going
                return (over && sameDirection) ? this.onTrackOngoingMousedown() : EMPTY;
              }),
            ) as Observable<PointerEvent>;
          }),
          takeUntil(pointerUp$),
        );
      })
    );
  }

  /**
   * Creates an instance of `TrackAdapter` and initializes its dependencies and internal state.
   * @zh 创建 `TrackAdapter` 实例，并初始化其依赖项与内部状态。
   */
  constructor() {
    effect(() => {
      this.cmp.viewportDimension();
      this.cmp.contentDimension();

      // Avoid SSR error because we're using `requestAnimationFrame`
      if (!this.isBrowser) return;

      untracked(() => {
        // Use animation frame to give the track element time to render (avoid size 0)
        requestAnimationFrame(() => this.control.trackSize.set(this.size));
      });
    });
    super();
  }

  /**
   * Executes `getScrollForwardStep` to handle get scroll forward step.
   * @zh 执行 `getScrollForwardStep`，用于获取滚动向前步骤。
   * @returns Result of type `number` / 类型为 `number` 的返回值
   */
  protected abstract getScrollForwardStep(): number;

  /**
   * Executes `getScrollBackwardStep` to handle get scroll backward step.
   * @zh 执行 `getScrollBackwardStep`，用于获取滚动向后步骤。
   * @returns Result of type `number` / 类型为 `number` 的返回值
   */
  protected abstract getScrollBackwardStep(): number;

  /**
   *  Callback when mouse is first clicked on the track

   * @zh 执行 `onTrackFirstClick`，用于当Track首个点击。
   */
  onTrackFirstClick(e: PointerEvent): Observable<void> {
    // Initialize variables and determine scroll direction
    this.currMousePosition = e[this.control.offsetProperty];
    this.scrollDirection = this.getScrollDirection(this.currMousePosition);
    this.scrollMax = this.control.viewportScrollMax;
    return this.scrollTo(this.nextStep());
  }

  /**
   * Executes `nextStep` to handle next step.
   * @zh 执行 `nextStep`，用于下一个步骤。
   * @returns Result of type `number` / 类型为 `number` 的返回值
   */
  private nextStep(): number {
    // Check which direction should the scroll go (forward or backward)
    if (this.scrollDirection === 'forward') {
      // Scroll forward
      const scrollForwardIncrement: number = this.getScrollForwardStep();

      // Check if the incremental position is bigger than the scroll max
      if (scrollForwardIncrement >= this.scrollMax) {
        return this.scrollMax;
      }
      return scrollForwardIncrement;
    }
    // Scroll backward
    const scrollBackwardIncrement: number = this.getScrollBackwardStep();

    if (scrollBackwardIncrement <= 0) {
      return 0;
    }
    return scrollBackwardIncrement;
  }

  /**
   * Callback when mouse is still down on the track
   * Incrementally scrolls towards target position until reached

   * @zh 执行 `onTrackOngoingMousedown`，用于当TrackOngoing鼠标按下。
   */
  onTrackOngoingMousedown(): Observable<unknown> {
    const position: number = this.nextStep();
    return this.scrollTo(position).pipe(
      takeWhile(() => !this.isReached(position)),
      switchMap(() => this.onTrackOngoingMousedown())
    );
  }

  /**
   * Returns a flag that determines whether the scroll from the given position is the final step or not

   * @zh 执行 `isReached`，用于是否为Reached。
   */
  private isReached(position: number): boolean {
    if (this.scrollDirection === 'forward') {
      return position >= this.scrollMax;
    }
    return position <= 0;
  }
}
