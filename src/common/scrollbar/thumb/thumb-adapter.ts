/**
 * @fileoverview Module `src/common/scrollbar/thumb/thumb-adapter.ts` providing thumb adapter definitions and implementation.
 * @zh 模块文件 `src/common/scrollbar/thumb/thumb-adapter.ts`，提供thumb适配器相关的定义与实现。
 */

import { Directive, inject, effect, untracked } from '@angular/core';
import { Observable, of, fromEvent, map, takeUntil, tap, switchMap } from 'rxjs';
import {
  ScrollbarDragging,
  ScrollTimelineFunc,
  stopPropagation,
  enableSelection,
  preventSelection
} from '../utils/common';
import { ScrollbarManager } from '../utils/scrollbar-manager';
import { TrackAdapter } from '../track/track-adapter';
import { PointerEventsAdapter } from '../utils/pointer-events-adapter';

/**
 * Angular directive `ThumbAdapter` attaching thumb adapter behavior to host DOM elements.
 * @zh Angular 指令 `ThumbAdapter`，为宿主 DOM 元素附加Thumb适配器行为。
 */
@Directive({ standalone: false })
export abstract class ThumbAdapter extends PointerEventsAdapter {

  /**
   * Property `manager` (`ScrollbarManager`) storing manager (default: `inject(ScrollbarManager)`).
   * @zh 属性 `manager`（类型：`ScrollbarManager`），用于存储或配置管理器（默认值：`inject(ScrollbarManager)`）。
   */
  protected readonly manager: ScrollbarManager = inject(ScrollbarManager);

  /**
   * Property `track` (`TrackAdapter`) storing track (default: `inject(TrackAdapter)`).
   * @zh 属性 `track`（类型：`TrackAdapter`），用于存储或配置track（默认值：`inject(TrackAdapter)`）。
   */
  private readonly track: TrackAdapter = inject(TrackAdapter);

  // The animation reference used for enabling the polyfill on Safari and Firefox.
  /**
   * Property `_animation` (`Animation`) storing animation.
   * @zh 属性 `_animation`（类型：`Animation`），用于存储或配置动画。
   */
  _animation: Animation;

  // Returns thumb size
  /**
   * Gets the current size (`size: number`).
   * @zh 获取当前尺寸（`size: number`）。
   */
  get size(): number {
    return this.nativeElement.getBoundingClientRect()[this.control.rectSizeProperty];
  }

  // The maximum space available for scrolling.
  /**
   * Gets the current track max (`trackMax: number`).
   * @zh 获取当前track最大值（`trackMax: number`）。
   */
  get trackMax(): number {
    return this.track.size - this.size;
  }

  /**
   * Stream that emits the 'scrollTo' position when a scrollbar thumb element is dragged
   * This function is called by thumb drag event using viewport or scrollbar pointer events

   * @zh 获取当前指针事件集合（`pointerEvents: Observable<PointerEvent>`）。
   */
  get pointerEvents(): Observable<PointerEvent> {
    return fromEvent<PointerEvent>(this.nativeElement, 'pointerdown').pipe(
      stopPropagation(),
      preventSelection(this.document),
      switchMap((e: PointerEvent) => {
        let startTrackMax: number;
        let startScrollMax: number;

        const dragStart: Observable<PointerEvent> = of<PointerEvent>(e).pipe(
          tap(() => {
            // Capture scrollMax and trackMax once
            startTrackMax = this.trackMax;
            startScrollMax = this.control.viewportScrollMax;
            this.setDragging(this.control.axis);
          }),
        );

        const dragging: Observable<PointerEvent> = fromEvent<PointerEvent>(this.document, 'pointermove').pipe(stopPropagation());

        const dragEnd: Observable<PointerEvent> = fromEvent<PointerEvent>(this.document, 'pointerup', { capture: true }).pipe(
          stopPropagation(),
          enableSelection(this.document),
          tap(() => this.setDragging('none'))
        );

        return dragStart.pipe(
          map((startEvent: PointerEvent) => startEvent[this.control.offsetProperty]),
          switchMap((startOffset: number) => dragging.pipe(
            map((moveEvent: PointerEvent) => moveEvent[this.control.clientProperty]),
            // Calculate how far the pointer is from the top/left of the scrollbar (minus the dragOffset).
            map((moveClient: number) => moveClient - this.track.offset),
            map((trackRelativeOffset: number) => startScrollMax * (trackRelativeOffset - startOffset) / startTrackMax),
            tap((scrollPosition: number) => this.control.instantScrollTo(scrollPosition, startScrollMax)),
            takeUntil(dragEnd)
          ) as Observable<PointerEvent>)
        );
      })
    );
  }

  /**
   * Creates an instance of `ThumbAdapter` and initializes its dependencies and internal state.
   * @zh 创建 `ThumbAdapter` 实例，并初始化其依赖项与内部状态。
   */
  constructor() {
    effect(() => {
      const script: ScrollTimelineFunc = this.manager.scrollTimelinePolyfill();
      untracked(() => {
        if (script && !this._animation) {
          this._animation = startPolyfill(script, this.nativeElement, this.cmp.viewport.nativeElement, this.control.axis);
        }
      })
    });
    super();
  }

  /**
   * Executes `setDragging` to handle set dragging.
   * @zh 执行 `setDragging`，用于集合拖拽中。
   * @param value - value parameter (`ScrollbarDragging`) / 值参数（`ScrollbarDragging`）
   */
  private setDragging(value: ScrollbarDragging): void {
    this.zone.run(() => this.cmp.dragging.set(value));
  }
}

/**
 * Executes `startPolyfill` to handle start polyfill.
 * @zh 执行 `startPolyfill`，用于开始Polyfill。
 * @param ScrollTimeline - scroll timeline parameter (`ScrollTimelineFunc`) / 滚动时间轴参数（`ScrollTimelineFunc`）
 * @param element - element parameter (`HTMLElement`) / 元素参数（`HTMLElement`）
 * @param source - source parameter (`HTMLElement`) / 源参数（`HTMLElement`）
 * @param axis - axis parameter (`"y" | "x"`) / 坐标轴参数（`"y" | "x"`）
 * @returns Result of type `Animation` / 类型为 `Animation` 的返回值
 */
function startPolyfill(ScrollTimeline: ScrollTimelineFunc, element: HTMLElement, source: HTMLElement, axis: 'x' | 'y'): Animation {
  return element.animate(
    {
      translate: [
        'var(--_scrollbar-thumb-transform-from)',
        'var(--_scrollbar-thumb-transform-to)'
      ]
    },
    {
      fill: 'both',
      easing: 'linear',
      timeline: new ScrollTimeline({ source, axis })
    }
  );
}
