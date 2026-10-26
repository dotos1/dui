/**
 * @fileoverview Module `src/common/scrollbar/scrollbar/scrollbar.ts` providing scrollbar definitions and implementation.
 * @zh 模块文件 `src/common/scrollbar/scrollbar/scrollbar.ts`，提供滚动条相关的定义与实现。
 */

import { Component, effect, inject, ChangeDetectionStrategy } from '@angular/core';
import { from, Observable } from 'rxjs';
import { TrackXDirective, TrackYDirective } from '../track/track';
import { ThumbXDirective, ThumbYDirective } from '../thumb/thumb';
import { SCROLLBAR_CONTROL, ScrollbarAdapter } from './scrollbar-adapter';
import { ScrollbarButton } from '../button/scrollbar-button.component';
import { ScrollbarManager } from '../utils/scrollbar-manager';

/**
 * Angular component `ScrollbarY` (selector: 'scrollbar-y') providing scrollbar y presentation and interaction in `src/common/scrollbar/scrollbar`.
 * @zh Angular 组件 `ScrollbarY`（selector: 'scrollbar-y'），提供滚动条Y坐标的视图渲染与交互逻辑（位于 `src/common/scrollbar/scrollbar`）。
 */
@Component({
  standalone: true,
  selector: 'scrollbar-y',
  template: `
    <div class="ng-scrollbar-sticky"
         [class.ng-scrollbar-hover]="cmp.hoverOffset()">
      <div class="ng-scrollbar-track-wrapper"
           [class.ng-scrollbar-hover]="!cmp.hoverOffset()">
        <div scrollbarTrackY class="ng-scrollbar-track {{ cmp.trackClass() }}">
          <div scrollbarThumbY class="ng-scrollbar-thumb {{ cmp.thumbClass() }}"></div>
        </div>
        @if (cmp.buttons()) {
          <button class="ng-scrollbar-button {{ cmp.buttonClass() }}"
                  scrollbarButton="top"
                  scrollDirection="backward"></button>
          <button class="ng-scrollbar-button {{ cmp.buttonClass() }}"
                  scrollbarButton="bottom"
                  scrollDirection="forward"></button>
        }
      </div>
    </div>
  `,
  styleUrls: ['./shared.scss', './vertical.scss'],
  imports: [TrackYDirective, ThumbYDirective, ScrollbarButton],
  providers: [
    { provide: SCROLLBAR_CONTROL, useExisting: ScrollbarY }
  ],
  host: {
    '[style.--track-size]': 'trackSize()'
  },
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ScrollbarY extends ScrollbarAdapter {

  /**
   * Property `rectOffsetProperty` (`'left' | 'top'`) storing rect offset property (default: `'top'`).
   * @zh 属性 `rectOffsetProperty`（类型：`'left' | 'top'`），用于存储或配置矩形偏移量属性（默认值：`'top'`）。
   */
  readonly rectOffsetProperty: 'left' | 'top' = 'top';

  /**
   * Property `rectSizeProperty` (`'width' | 'height'`) storing rect size property (default: `'height'`).
   * @zh 属性 `rectSizeProperty`（类型：`'width' | 'height'`），用于存储或配置矩形尺寸属性（默认值：`'height'`）。
   */
  readonly rectSizeProperty: 'width' | 'height' = 'height';

  /**
   * Property `sizeProperty` (`'offsetWidth' | 'offsetHeight'`) storing size property (default: `'offsetHeight'`).
   * @zh 属性 `sizeProperty`（类型：`'offsetWidth' | 'offsetHeight'`），用于存储或配置尺寸属性（默认值：`'offsetHeight'`）。
   */
  readonly sizeProperty: 'offsetWidth' | 'offsetHeight' = 'offsetHeight';

  /**
   * Property `clientProperty` (`'clientX' | 'clientY'`) storing client property (default: `'clientY'`).
   * @zh 属性 `clientProperty`（类型：`'clientX' | 'clientY'`），用于存储或配置client属性（默认值：`'clientY'`）。
   */
  readonly clientProperty: 'clientX' | 'clientY' = 'clientY';

  /**
   * Property `offsetProperty` (`'offsetX' | 'offsetY'`) storing offset property (default: `'offsetY'`).
   * @zh 属性 `offsetProperty`（类型：`'offsetX' | 'offsetY'`），用于存储或配置偏移量属性（默认值：`'offsetY'`）。
   */
  readonly offsetProperty: 'offsetX' | 'offsetY' = 'offsetY';

  /**
   * Property `axis` (`'x' | 'y'`) storing axis (default: `'y'`).
   * @zh 属性 `axis`（类型：`'x' | 'y'`），用于存储或配置坐标轴（默认值：`'y'`）。
   */
  readonly axis: 'x' | 'y' = 'y';

  /**
   * Gets the current viewport scroll max (`viewportScrollMax: number`).
   * @zh 获取当前视口滚动最大值（`viewportScrollMax: number`）。
   */
  get viewportScrollMax(): number {
    return this.cmp.viewport.scrollMaxY;
  }

  /**
   * Gets the current viewport scroll offset (`viewportScrollOffset: number`).
   * @zh 获取当前视口滚动偏移量（`viewportScrollOffset: number`）。
   */
  get viewportScrollOffset(): number {
    return this.cmp.viewport.scrollTop;
  }

  /**
   * Executes `scrollTo` to handle scroll to.
   * @zh 执行 `scrollTo`，用于滚动转换为。
   * @param top - top parameter (`number`) / 顶部位置参数（`number`）
   * @param duration - duration parameter (`number`) / 持续时间参数（`number`）
   * @returns Result of type `Observable<void>` / 类型为 `Observable<void>` 的返回值
   */
  scrollTo(top: number, duration: number): Observable<void> {
    return from(this.cmp.scrollTo({ top, duration }));
  }

  /**
   * Executes `instantScrollTo` to handle instant scroll to.
   * @zh 执行 `instantScrollTo`，用于即时滚动转换为。
   * @param value - value parameter (`number`) / 值参数（`number`）
   */
  instantScrollTo(value: number): void {
    this.cmp.viewport.scrollYTo(value);
  }
}

/**
 * Angular component `ScrollbarX` (selector: 'scrollbar-x') providing scrollbar x presentation and interaction in `src/common/scrollbar/scrollbar`.
 * @zh Angular 组件 `ScrollbarX`（selector: 'scrollbar-x'），提供滚动条X坐标的视图渲染与交互逻辑（位于 `src/common/scrollbar/scrollbar`）。
 */
@Component({
  standalone: true,
  selector: 'scrollbar-x',
  template: `
    <div class="ng-scrollbar-sticky"
         [class.ng-scrollbar-hover]="cmp.hoverOffset()">
      <div class="ng-scrollbar-track-wrapper"
           [class.ng-scrollbar-hover]="!cmp.hoverOffset()">
        <div scrollbarTrackX class="ng-scrollbar-track {{ cmp.trackClass() }}">
          <div scrollbarThumbX class="ng-scrollbar-thumb {{ cmp.thumbClass() }}"></div>
        </div>
        @if (cmp.buttons()) {
          <button class="ng-scrollbar-button {{ cmp.buttonClass() }}"
                  scrollbarButton="start"
                  scrollDirection="backward"></button>
          <button class="ng-scrollbar-button {{ cmp.buttonClass() }}"
                  scrollbarButton="end"
                  scrollDirection="forward"></button>
        }
      </div>
    </div>
  `,
  styleUrls: ['./shared.scss', './horizontal.scss'],
  imports: [TrackXDirective, ThumbXDirective, ScrollbarButton],
  providers: [
    { provide: SCROLLBAR_CONTROL, useExisting: ScrollbarX }
  ],
  host: {
    '[attr.dir]': 'cmp.direction()',
    '[style.--track-size]': 'trackSize()'
  },
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ScrollbarX extends ScrollbarAdapter {

  /**
   * Property `manager` (`ScrollbarManager`) storing manager (default: `inject(ScrollbarManager)`).
   * @zh 属性 `manager`（类型：`ScrollbarManager`），用于存储或配置管理器（默认值：`inject(ScrollbarManager)`）。
   */
  readonly manager: ScrollbarManager = inject(ScrollbarManager);

  /**
   * Property `rectOffsetProperty` (`'left' | 'top'`) storing rect offset property (default: `'left'`).
   * @zh 属性 `rectOffsetProperty`（类型：`'left' | 'top'`），用于存储或配置矩形偏移量属性（默认值：`'left'`）。
   */
  readonly rectOffsetProperty: 'left' | 'top' = 'left';

  /**
   * Property `rectSizeProperty` (`'width' | 'height'`) storing rect size property (default: `'width'`).
   * @zh 属性 `rectSizeProperty`（类型：`'width' | 'height'`），用于存储或配置矩形尺寸属性（默认值：`'width'`）。
   */
  readonly rectSizeProperty: 'width' | 'height' = 'width';

  /**
   * Property `sizeProperty` (`'offsetWidth' | 'offsetHeight'`) storing size property (default: `'offsetWidth'`).
   * @zh 属性 `sizeProperty`（类型：`'offsetWidth' | 'offsetHeight'`），用于存储或配置尺寸属性（默认值：`'offsetWidth'`）。
   */
  readonly sizeProperty: 'offsetWidth' | 'offsetHeight' = 'offsetWidth';

  /**
   * Property `clientProperty` (`'clientX' | 'clientY'`) storing client property (default: `'clientX'`).
   * @zh 属性 `clientProperty`（类型：`'clientX' | 'clientY'`），用于存储或配置client属性（默认值：`'clientX'`）。
   */
  readonly clientProperty: 'clientX' | 'clientY' = 'clientX';

  /**
   * Property `offsetProperty` (`'offsetX' | 'offsetY'`) storing offset property (default: `'offsetX'`).
   * @zh 属性 `offsetProperty`（类型：`'offsetX' | 'offsetY'`），用于存储或配置偏移量属性（默认值：`'offsetX'`）。
   */
  readonly offsetProperty: 'offsetX' | 'offsetY' = 'offsetX';

  /**
   * Property `axis` (`'x' | 'y'`) storing axis (default: `'x'`).
   * @zh 属性 `axis`（类型：`'x' | 'y'`），用于存储或配置坐标轴（默认值：`'x'`）。
   */
  readonly axis: 'x' | 'y' = 'x';

  // Handle dragging position (Support LTR and RTL directions for the horizontal scrollbar)
  /**
   * Property `handlePosition` (`(value: number, scrollMax: number) => number`) storing handle position.
   * @zh 属性 `handlePosition`（类型：`(value: number, scrollMax: number) => number`），用于存储或配置连接手柄位置。
   */
  private handlePosition: (value: number, scrollMax: number) => number;

  /**
   * Gets the current viewport scroll max (`viewportScrollMax: number`).
   * @zh 获取当前视口滚动最大值（`viewportScrollMax: number`）。
   */
  get viewportScrollMax(): number {
    return this.cmp.viewport.scrollMaxX;
  }

  /**
   * Gets the current viewport scroll offset (`viewportScrollOffset: number`).
   * @zh 获取当前视口滚动偏移量（`viewportScrollOffset: number`）。
   */
  get viewportScrollOffset(): number {
    // Keep scrollLeft value positive for horizontal scrollbar
    return Math.abs(this.cmp.viewport.scrollLeft);
  }

  /**
   * Creates an instance of `ScrollbarX` and initializes its dependencies and internal state.
   * @zh 创建 `ScrollbarX` 实例，并初始化其依赖项与内部状态。
   */
  constructor() {
    effect(() => {
      if (this.cmp.direction() === 'rtl') {
        this.handlePosition = (position: number, scrollMax: number): number => -(scrollMax - position);
      } else {
        this.handlePosition = (position: number): number => position;
      }
    });
    super();
  }

  /**
   * Executes `scrollTo` to handle scroll to.
   * @zh 执行 `scrollTo`，用于滚动转换为。
   * @param left - left parameter (`number`) / 左侧位置参数（`number`）
   * @param duration - duration parameter (`number`) / 持续时间参数（`number`）
   * @returns Result of type `Observable<void>` / 类型为 `Observable<void>` 的返回值
   */
  scrollTo(left: number, duration: number): Observable<void> {
    return from(this.cmp.scrollTo({ left, duration }));
  }

  /**
   * Executes `instantScrollTo` to handle instant scroll to.
   * @zh 执行 `instantScrollTo`，用于即时滚动转换为。
   * @param value - value parameter (`number`) / 值参数（`number`）
   * @param scrollMax - scroll max parameter (`number`) / 滚动最大值参数（`number`）
   */
  instantScrollTo(value: number, scrollMax?: number): void {
    this.cmp.viewport.scrollXTo(this.handlePosition(value, scrollMax));
  }
}
