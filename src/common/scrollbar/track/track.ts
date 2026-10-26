/**
 * @fileoverview Module `src/common/scrollbar/track/track.ts` providing track definitions and implementation.
 * @zh 模块文件 `src/common/scrollbar/track/track.ts`，提供track相关的定义与实现。
 */

import { Directive, effect } from '@angular/core';
import { from, Observable } from 'rxjs';
import { TrackAdapter } from './track-adapter';

/**
 * Angular directive `TrackXDirective` (selector: '[scrollbarTrackX]') attaching track x directive behavior to host DOM elements.
 * @zh Angular 指令 `TrackXDirective`（selector: '[scrollbarTrackX]'），为宿主 DOM 元素附加TrackX坐标指令行为。
 */
@Directive({
  standalone: true,
  selector: '[scrollbarTrackX]',
  providers: [{ provide: TrackAdapter, useExisting: TrackXDirective }]
})
export class TrackXDirective extends TrackAdapter {

  /**
   * Gets the current content size (`contentSize: number`).
   * @zh 获取当前内容尺寸（`contentSize: number`）。
   */
  protected get contentSize(): number {
    return this.cmp.viewport.contentWidth;
  }

  /**
   * Property `getCurrPosition` (`() => number`) storing get curr position.
   * @zh 属性 `getCurrPosition`（类型：`() => number`），用于存储或配置获取当前位置。
   */
  getCurrPosition: () => number;

  /**
   * Property `getScrollDirection` (`(position: number) => 'forward' | 'backward'`) storing get scroll direction.
   * @zh 属性 `getScrollDirection`（类型：`(position: number) => 'forward' | 'backward'`），用于存储或配置获取滚动方向。
   */
  getScrollDirection: (position: number) => 'forward' | 'backward';

  /**
   * Creates an instance of `TrackXDirective` and initializes its dependencies and internal state.
   * @zh 创建 `TrackXDirective` 实例，并初始化其依赖项与内部状态。
   */
  constructor() {
    effect(() => {
      if (this.cmp.direction() === 'rtl') {
        this.getCurrPosition = (): number => {
          const offset: number = this.contentSize - this.viewportSize - this.control.viewportScrollOffset;
          return offset * this.size / this.contentSize;
        };
        this.getScrollDirection = (position: number): 'forward' | 'backward' => {
          return position < this.getCurrPosition() ? 'forward' : 'backward';
        };
      } else {
        this.getCurrPosition = (): number => {
          return this.control.viewportScrollOffset * this.size / this.contentSize;
        };
        this.getScrollDirection = (position: number): 'forward' | 'backward' => {
          return position > this.getCurrPosition() ? 'forward' : 'backward';
        };
      }
    });
    super();
  }

  /**
   * Executes `scrollTo` to handle scroll to.
   * @zh 执行 `scrollTo`，用于滚动转换为。
   * @param start - start parameter (`number`) / 开始参数（`number`）
   * @returns Result of type `Observable<void>` / 类型为 `Observable<void>` 的返回值
   */
  protected scrollTo(start: number): Observable<void> {
    return from(this.cmp.scrollTo({ start, duration: this.cmp.trackScrollDuration() }));
  }

  /**
   * Executes `getScrollForwardStep` to handle get scroll forward step.
   * @zh 执行 `getScrollForwardStep`，用于获取滚动向前步骤。
   * @returns Result of type `number` / 类型为 `number` 的返回值
   */
  protected getScrollForwardStep(): number {
    return this.control.viewportScrollOffset + this.viewportSize;
  }

  /**
   * Executes `getScrollBackwardStep` to handle get scroll backward step.
   * @zh 执行 `getScrollBackwardStep`，用于获取滚动向后步骤。
   * @returns Result of type `number` / 类型为 `number` 的返回值
   */
  protected getScrollBackwardStep(): number {
    return this.control.viewportScrollOffset - this.viewportSize;
  }
}

/**
 * Angular directive `TrackYDirective` (selector: '[scrollbarTrackY]') attaching track y directive behavior to host DOM elements.
 * @zh Angular 指令 `TrackYDirective`（selector: '[scrollbarTrackY]'），为宿主 DOM 元素附加TrackY坐标指令行为。
 */
@Directive({
  standalone: true,
  selector: '[scrollbarTrackY]',
  providers: [{ provide: TrackAdapter, useExisting: TrackYDirective }]
})
export class TrackYDirective extends TrackAdapter {

  /**
   * Gets the current content size (`contentSize: number`).
   * @zh 获取当前内容尺寸（`contentSize: number`）。
   */
  protected get contentSize(): number {
    return this.cmp.viewport.contentHeight;
  }

  /**
   * Executes `getCurrPosition` to handle get curr position.
   * @zh 执行 `getCurrPosition`，用于获取当前位置。
   * @returns Result of type `number` / 类型为 `number` 的返回值
   */
  protected getCurrPosition(): number {
    return this.control.viewportScrollOffset * this.size / this.contentSize;
  }

  /**
   * Executes `getScrollDirection` to handle get scroll direction.
   * @zh 执行 `getScrollDirection`，用于获取滚动方向。
   * @param position - position parameter (`number`) / 位置参数（`number`）
   * @returns Result of type `'forward' | 'backward'` / 类型为 `'forward' | 'backward'` 的返回值
   */
  protected getScrollDirection(position: number): 'forward' | 'backward' {
    return position > this.getCurrPosition() ? 'forward' : 'backward';
  }

  /**
   * Executes `scrollTo` to handle scroll to.
   * @zh 执行 `scrollTo`，用于滚动转换为。
   * @param top - top parameter (`number`) / 顶部位置参数（`number`）
   * @returns Result of type `Observable<void>` / 类型为 `Observable<void>` 的返回值
   */
  protected scrollTo(top: number): Observable<void> {
    return from(this.cmp.scrollTo({ top, duration: this.cmp.trackScrollDuration() }));
  }

  /**
   * Executes `getScrollForwardStep` to handle get scroll forward step.
   * @zh 执行 `getScrollForwardStep`，用于获取滚动向前步骤。
   * @returns Result of type `number` / 类型为 `number` 的返回值
   */
  protected getScrollForwardStep(): number {
    return this.control.viewportScrollOffset + this.viewportSize;
  }

  /**
   * Executes `getScrollBackwardStep` to handle get scroll backward step.
   * @zh 执行 `getScrollBackwardStep`，用于获取滚动向后步骤。
   * @returns Result of type `number` / 类型为 `number` 的返回值
   */
  protected getScrollBackwardStep(): number {
    return this.control.viewportScrollOffset - this.viewportSize;
  }
}
