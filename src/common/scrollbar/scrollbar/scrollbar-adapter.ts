/**
 * @fileoverview Module `src/common/scrollbar/scrollbar/scrollbar-adapter.ts` providing scrollbar adapter definitions and implementation.
 * @zh 模块文件 `src/common/scrollbar/scrollbar/scrollbar-adapter.ts`，提供滚动条适配器相关的定义与实现。
 */

import { Directive, inject, signal, WritableSignal, InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { NG_SCROLLBAR, _NgScrollbar } from '../utils/scrollbar-base';

/**
 * Angular dependency-injection token `SCROLLBAR_CONTROL` for providing scrollbar control.
 * @zh Angular 依赖注入令牌 `SCROLLBAR_CONTROL`，用于提供与注入滚动条表单控件。
 */
export const SCROLLBAR_CONTROL: InjectionToken<ScrollbarAdapter> = new InjectionToken<ScrollbarAdapter>('SCROLLBAR_CONTROL');

/**
 * Angular directive `ScrollbarAdapter` attaching scrollbar adapter behavior to host DOM elements.
 * @zh Angular 指令 `ScrollbarAdapter`，为宿主 DOM 元素附加滚动条适配器行为。
 */
@Directive({ standalone: false })
export abstract class ScrollbarAdapter {

  /**
   * Property `trackSize` (`WritableSignal<number>`) storing track size (default: `signal(0)`).
   * @zh 属性 `trackSize`（类型：`WritableSignal<number>`），用于存储或配置track尺寸（默认值：`signal(0)`）。
   */
  trackSize: WritableSignal<number> = signal(0);

  /**
   * Property `rectOffsetProperty` (`"top" | "left"`) storing rect offset property.
   * @zh 属性 `rectOffsetProperty`（类型：`"top" | "left"`），用于存储或配置矩形偏移量属性。
   */
  abstract readonly rectOffsetProperty: 'left' | 'top';

  /**
   * Property `rectSizeProperty` (`"height" | "width"`) storing rect size property.
   * @zh 属性 `rectSizeProperty`（类型：`"height" | "width"`），用于存储或配置矩形尺寸属性。
   */
  abstract readonly rectSizeProperty: 'width' | 'height';

  /**
   * Property `sizeProperty` (`"offsetWidth" | "offsetHeight"`) storing size property.
   * @zh 属性 `sizeProperty`（类型：`"offsetWidth" | "offsetHeight"`），用于存储或配置尺寸属性。
   */
  abstract readonly sizeProperty: 'offsetWidth' | 'offsetHeight';

  // Returns either 'clientX' or 'clientY' coordinate of the pointer relative to the viewport
  /**
   * Property `clientProperty` (`"clientX" | "clientY"`) storing client property.
   * @zh 属性 `clientProperty`（类型：`"clientX" | "clientY"`），用于存储或配置client属性。
   */
  abstract readonly clientProperty: 'clientX' | 'clientY';

  // Returns either 'offsetX' or 'offsetY' coordinate of the pointer relative to the edge of the element
  /**
   * Property `offsetProperty` (`"offsetX" | "offsetY"`) storing offset property.
   * @zh 属性 `offsetProperty`（类型：`"offsetX" | "offsetY"`），用于存储或配置偏移量属性。
   */
  abstract readonly offsetProperty: 'offsetX' | 'offsetY'

  // Return axis
  /**
   * Property `axis` (`"y" | "x"`) storing axis.
   * @zh 属性 `axis`（类型：`"y" | "x"`），用于存储或配置坐标轴。
   */
  abstract readonly axis: 'x' | 'y';

  // Returns viewport scroll max
  /**
   * Gets the current viewport scroll max (`viewportScrollMax: number`).
   * @zh 获取当前视口滚动最大值（`viewportScrollMax: number`）。
   */
  abstract get viewportScrollMax(): number;

  // Returns viewport offset
  /**
   * Gets the current viewport scroll offset (`viewportScrollOffset: number`).
   * @zh 获取当前视口滚动偏移量（`viewportScrollOffset: number`）。
   */
  abstract get viewportScrollOffset(): number;

  // Host component reference
  /**
   * Property `cmp` (`_NgScrollbar`) storing cmp (default: `inject(NG_SCROLLBAR)`).
   * @zh 属性 `cmp`（类型：`_NgScrollbar`），用于存储或配置cmp（默认值：`inject(NG_SCROLLBAR)`）。
   */
  readonly cmp: _NgScrollbar = inject(NG_SCROLLBAR);

  /**
   * Executes `scrollTo` to handle scroll to.
   * @zh 执行 `scrollTo`，用于滚动转换为。
   * @param value - value parameter (`number`) / 值参数（`number`）
   * @param duration - duration parameter (`number`) / 持续时间参数（`number`）
   * @returns Result of type `Observable<void>` / 类型为 `Observable<void>` 的返回值
   */
  abstract scrollTo(value: number, duration: number): Observable<void>;

  /**
   * Executes `instantScrollTo` to handle instant scroll to.
   * @zh 执行 `instantScrollTo`，用于即时滚动转换为。
   * @param value - value parameter (`number`) / 值参数（`number`）
   * @param scrollMax - scroll max parameter (`number`) / 滚动最大值参数（`number`）
   */
  abstract instantScrollTo(value: number, scrollMax?: number): void;
}
