/**
 * @fileoverview Module `src/common/scrollbar/button/scrollbar-button.component.ts` providing scrollbar button component definitions and implementation.
 * @zh 模块文件 `src/common/scrollbar/button/scrollbar-button.component.ts`，提供滚动条按钮组件相关的定义与实现。
 */

import { Component, effect, untracked, input, InputSignal, ChangeDetectionStrategy } from '@angular/core';
import { Direction } from '@angular/cdk/bidi';
import {
  Observable,
  tap,
  delay,
  merge,
  switchMap,
  fromEvent,
  takeUntil,
  interval,
  takeWhile,
  animationFrameScheduler
} from 'rxjs';
import { enableSelection, preventSelection, stopPropagation } from '../utils/common';
import { PointerEventsAdapter } from '../utils/pointer-events-adapter';

/**
 * Type alias `CanScrollFn` representing can scroll fn (`(offset: number, scrollMax?: number) => boolean`).
 * @zh 类型别名 `CanScrollFn`，表示是否可以滚动函数（`(offset: number, scrollMax?: number) => boolean`）。
 */
type CanScrollFn = (offset: number, scrollMax?: number) => boolean;

/**
 * Type alias `ScrollStepFn` representing scroll step fn (`(scrollBy: number, offset: number, scrollMax: number) => number`).
 * @zh 类型别名 `ScrollStepFn`，表示滚动步骤函数（`(scrollBy: number, offset: number, scrollMax: number) => number`）。
 */
type ScrollStepFn = (scrollBy: number, offset: number, scrollMax: number) => number;

// canScroll function can work for y-axis and x-axis for both LTR and RTL directions
/**
 * Constant/variable `canScrollFunc` defining can scroll func in `src/common/scrollbar/button`.
 * @zh 常量/变量 `canScrollFunc`，定义 `src/common/scrollbar/button` 中的是否可以滚动Func。
 */
const canScrollFunc: Record<'forward' | 'backward', CanScrollFn> = {
  forward: (scrollOffset: number, scrollMax: number): boolean => scrollOffset < scrollMax,
  backward: (scrollOffset: number): boolean => scrollOffset > 0
}

/**
 * Constant/variable `scrollStepFunc` defining scroll step func in `src/common/scrollbar/button`.
 * @zh 常量/变量 `scrollStepFunc`，定义 `src/common/scrollbar/button` 中的滚动步骤Func。
 */
const scrollStepFunc: Record<'forward' | 'backward', ScrollStepFn> = {
  forward: (scrollBy: number, offset: number) => offset + scrollBy,
  backward: (scrollBy: number, offset: number) => offset - scrollBy
};

/**
 * Constant/variable `horizontalScrollStepFunc` defining horizontal scroll step func in `src/common/scrollbar/button`.
 * @zh 常量/变量 `horizontalScrollStepFunc`，定义 `src/common/scrollbar/button` 中的水平滚动步骤Func。
 */
const horizontalScrollStepFunc: Record<'ltr' | 'rtl', Record<'forward' | 'backward', ScrollStepFn>> = {
  rtl: {
    forward: (scrollBy: number, offset: number, scrollMax: number) => scrollMax - offset - scrollBy,
    backward: (scrollBy: number, offset: number, scrollMax: number) => scrollMax - offset + scrollBy
  },
  ltr: scrollStepFunc
}

/**
 * Angular component `ScrollbarButton` (selector: 'button[scrollbarButton]') providing scrollbar button presentation and interaction in `src/common/scrollbar/button`.
 * @zh Angular 组件 `ScrollbarButton`（selector: 'button[scrollbarButton]'），提供滚动条按钮的视图渲染与交互逻辑（位于 `src/common/scrollbar/button`）。
 */
@Component({
  standalone: true,
  selector: 'button[scrollbarButton]',
  templateUrl: './scrollbar-button.component.html',
  styleUrl: './scrollbar-button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ScrollbarButton extends PointerEventsAdapter {

  /**
   * Property `scrollbarButton` (`InputSignal<'top' | 'bottom' | 'start' | 'end'>`) storing scrollbar button (default: `input.required()`).
   * @zh 属性 `scrollbarButton`（类型：`InputSignal<'top' | 'bottom' | 'start' | 'end'>`），用于存储或配置滚动条按钮（默认值：`input.required()`）。
   */
  scrollbarButton: InputSignal<'top' | 'bottom' | 'start' | 'end'> = input.required();
  /**
   * Property `scrollDirection` (`InputSignal<'forward' | 'backward'>`) storing scroll direction (default: `input.required()`).
   * @zh 属性 `scrollDirection`（类型：`InputSignal<'forward' | 'backward'>`），用于存储或配置滚动方向（默认值：`input.required()`）。
   */
  scrollDirection: InputSignal<'forward' | 'backward'> = input.required();

  /**
   * Property `afterFirstClickDelay` (`number`) storing after first click delay (default: `120`).
   * @zh 属性 `afterFirstClickDelay`（类型：`number`），用于存储或配置之后首个点击延迟（默认值：`120`）。
   */
  private afterFirstClickDelay: number = 120;
  /**
   * Property `firstClickDuration` (`number`) storing first click duration (default: `100`).
   * @zh 属性 `firstClickDuration`（类型：`number`），用于存储或配置首个点击持续时间（默认值：`100`）。
   */
  private firstClickDuration: number = 100;
  /**
   * Property `scrollBy` (`number`) storing scroll by (default: `50`).
   * @zh 属性 `scrollBy`（类型：`number`），用于存储或配置滚动按（默认值：`50`）。
   */
  private scrollBy: number = 50;
  /**
   * Property `onGoingScrollBy` (`number`) storing on going scroll by (default: `12`).
   * @zh 属性 `onGoingScrollBy`（类型：`number`），用于存储或配置当Going滚动按（默认值：`12`）。
   */
  private onGoingScrollBy: number = 12;

  /**
   * Property `nextStep` (`(scrollBy: number, offset: number, scrollMax: number) => number`) storing next step.
   * @zh 属性 `nextStep`（类型：`(scrollBy: number, offset: number, scrollMax: number) => number`），用于存储或配置下一个步骤。
   */
  private nextStep: (scrollBy: number, offset: number, scrollMax: number) => number;
  /**
   * Property `canScroll` (`(offset: number, scrollMax: number) => boolean`) storing can scroll.
   * @zh 属性 `canScroll`（类型：`(offset: number, scrollMax: number) => boolean`），用于存储或配置是否可以滚动。
   */
  private canScroll: (offset: number, scrollMax: number) => boolean;

  /**
   * Gets the current pointer events (`pointerEvents: Observable<PointerEvent>`).
   * @zh 获取当前指针事件集合（`pointerEvents: Observable<PointerEvent>`）。
   */
  get pointerEvents(): Observable<PointerEvent> {
    const pointerDown$: Observable<PointerEvent> = fromEvent<PointerEvent>(this.nativeElement, 'pointerdown').pipe(
      stopPropagation(),
      preventSelection(this.document)
    );
    const pointerUp$: Observable<PointerEvent> = fromEvent<PointerEvent>(this.document, 'pointerup', { passive: true }).pipe(
      enableSelection(this.document)
    );

    const pointerLeave$: Observable<PointerEvent> = fromEvent<PointerEvent>(this.nativeElement, 'pointerleave', { passive: true });

    // Combine pointerup and pointerleave events into one stream
    const pointerUpOrLeave$: Observable<PointerEvent> = merge(pointerUp$, pointerLeave$);

    return pointerDown$.pipe(
      switchMap(() => this.firstScrollStep().pipe(
        delay(this.afterFirstClickDelay),
        switchMap(() => this.onOngoingPointerdown()),
        takeUntil(pointerUpOrLeave$),
      ))
    );
  }

  /**
   * Creates an instance of `ScrollbarButton` and initializes its dependencies and internal state.
   * @zh 创建 `ScrollbarButton` 实例，并初始化其依赖项与内部状态。
   */
  constructor() {
    effect(() => {
      const scrollDirection: 'forward' | 'backward' = this.scrollDirection();
      const dir: Direction = this.cmp.direction();

      untracked(() => {
        // Get the canScroll function according to scroll direction (forward/backward)
        this.canScroll = canScrollFunc[scrollDirection];

        if (this.control.axis === 'x') {
          // Get the nextStep function according to scroll direction (forward/backward) and layout direction (LTR/RTL)
          this.nextStep = horizontalScrollStepFunc[dir][scrollDirection];
        } else {
          // Get the nextStep function according to scroll direction (forward/backward)
          this.nextStep = scrollStepFunc[scrollDirection];
        }
      });
    });
    super();
  }

  /**
   * Executes `firstScrollStep` to handle first scroll step.
   * @zh 执行 `firstScrollStep`，用于首个滚动步骤。
   * @returns Result of type `Observable<void>` / 类型为 `Observable<void>` 的返回值
   */
  private firstScrollStep(): Observable<void> {
    const value: number = this.nextStep(this.scrollBy, this.control.viewportScrollOffset, this.control.viewportScrollMax);
    return this.control.scrollTo(value, this.firstClickDuration);
  }

  /**
   * Executes `onGoingScrollStep` to handle on going scroll step.
   * @zh 执行 `onGoingScrollStep`，用于当Going滚动步骤。
   */
  private onGoingScrollStep(): void {
    const scrollMax: number = this.control.viewportScrollMax;
    const value: number = this.nextStep(this.onGoingScrollBy, this.control.viewportScrollOffset, scrollMax);
    this.control.instantScrollTo(value, scrollMax);
  }

  /**
   * Executes `onOngoingPointerdown` to handle on ongoing pointerdown.
   * @zh 执行 `onOngoingPointerdown`，用于当OngoingPointerdown。
   * @returns Result of type `Observable<PointerEvent>` / 类型为 `Observable<PointerEvent>` 的返回值
   */
  private onOngoingPointerdown(): Observable<PointerEvent> {
    return interval(0, animationFrameScheduler).pipe(
      takeWhile(() => this.canScroll(this.control.viewportScrollOffset, this.control.viewportScrollMax)),
      tap(() => this.onGoingScrollStep())
    ) as Observable<PointerEvent>;
  }
}
