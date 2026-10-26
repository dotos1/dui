/**
 * @fileoverview Module `src/common/scrollbar/smooth-scroll/smooth-scroll.model.ts` providing smooth scroll model definitions and implementation.
 * @zh 模块文件 `src/common/scrollbar/smooth-scroll/smooth-scroll.model.ts`，提供smooth滚动模型相关的定义与实现。
 */

import { ElementRef, InjectionToken, Provider } from '@angular/core';
import { _XAxis, _YAxis } from '@angular/cdk/scrolling';
import { defaultSmoothScrollOptions } from './smooth-scroll.default';

/**
 * Angular dependency-injection token `SMOOTH_SCROLL_OPTIONS` for providing smooth scroll options.
 * @zh Angular 依赖注入令牌 `SMOOTH_SCROLL_OPTIONS`，用于提供与注入SMOOTH滚动配置选项。
 */
export const SMOOTH_SCROLL_OPTIONS: InjectionToken<SmoothScrollOptions> = new InjectionToken<SmoothScrollOptions>('SMOOTH_SCROLL_OPTIONS', {
  providedIn: 'root',
  factory: () => defaultSmoothScrollOptions
});

/**
 * Executes `provideSmoothScrollOptions` to handle provide smooth scroll options.
 * @zh 执行 `provideSmoothScrollOptions`，用于提供Smooth滚动配置选项。
 * @param options - options parameter (`SmoothScrollOptions`) / 配置选项参数（`SmoothScrollOptions`）
 * @returns Result of type `Provider[]` / 类型为 `Provider[]` 的返回值
 */
export function provideSmoothScrollOptions(options: SmoothScrollOptions): Provider[] {
  return [
    {
      provide: SMOOTH_SCROLL_OPTIONS,
      useValue: { ...defaultSmoothScrollOptions, ...options }
    }
  ]
}

/**
 * Interface for an element that can be scrolled smoothly.

 * @zh 类型别名 `SmoothScrollElement`，表示Smooth滚动元素（`Element | ElementRef<Element> | string`）。
 */
export type SmoothScrollElement = Element | ElementRef<Element> | string;

/**
 * Interface for options provided for smooth scrolling.

 * @zh 类型别名 `SmoothScrollToOptions`，表示Smooth滚动转换为配置选项（`Partial<Pick<_XAxis, keyof _XAxis> & Pick<_YAxis, keyof _YAxis>> & Smo...`）。
 */
export type SmoothScrollToOptions = Partial<Pick<_XAxis, keyof _XAxis> & Pick<_YAxis, keyof _YAxis>> & SmoothScrollOptions;

/**
 * Interface for options provided for smooth scrolling to an element.

 * @zh 类型别名 `SmoothScrollToElementOptions`，表示Smooth滚动转换为元素配置选项（`SmoothScrollToOptions & { center?: boolean }`）。
 */
export type SmoothScrollToElementOptions = SmoothScrollToOptions & { center?: boolean };

/**
 * Interface `SmoothScrollStep` defining the contract and properties for smooth scroll step.
 * @zh 接口 `SmoothScrollStep`，定义Smooth滚动步骤的数据结构契约与属性规范。
 */
export interface SmoothScrollStep {
  /**
   * Property `scrollable` (`Element`) storing scrollable.
   * @zh 属性 `scrollable`（类型：`Element`），用于存储或配置scrollable。
   */
  scrollable: Element;
  /**
   * Property `startTime` (`number`) storing start time.
   * @zh 属性 `startTime`（类型：`number`），用于存储或配置开始时间。
   */
  startTime: number;
  /**
   * Property `startX` (`number`) storing start x.
   * @zh 属性 `startX`（类型：`number`），用于存储或配置开始X坐标。
   */
  startX: number;
  /**
   * Property `startY` (`number`) storing start y.
   * @zh 属性 `startY`（类型：`number`），用于存储或配置开始Y坐标。
   */
  startY: number;
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
  /**
   * Property `duration` (`number`) storing duration.
   * @zh 属性 `duration`（类型：`number`），用于存储或配置持续时间。
   */
  duration: number;
  /**
   * Property `easing` (`(k: number) => number`) storing easing.
   * @zh 属性 `easing`（类型：`(k: number) => number`），用于存储或配置easing。
   */
  easing: (k: number) => number;
  /**
   * Property `currentX` (`number`) storing current x.
   * @zh 属性 `currentX`（类型：`number`），用于存储或配置当前X坐标。
   */
  currentX?: number;
  /**
   * Property `currentY` (`number`) storing current y.
   * @zh 属性 `currentY`（类型：`number`），用于存储或配置当前Y坐标。
   */
  currentY?: number;
}

/**
 * Interface `SmoothScrollOptions` defining the contract and properties for smooth scroll options.
 * @zh 接口 `SmoothScrollOptions`，定义Smooth滚动配置选项的数据结构契约与属性规范。
 */
export interface SmoothScrollOptions {
  /**
   * Property `duration` (`number`) storing duration.
   * @zh 属性 `duration`（类型：`number`），用于存储或配置持续时间。
   */
  duration?: number;
  /**
   * Property `easing` (`BezierEasingOptions`) storing easing.
   * @zh 属性 `easing`（类型：`BezierEasingOptions`），用于存储或配置easing。
   */
  easing?: BezierEasingOptions;
}

/**
 * Interface `BezierEasingOptions` defining the contract and properties for bezier easing options.
 * @zh 接口 `BezierEasingOptions`，定义BezierEasing配置选项的数据结构契约与属性规范。
 */
export interface BezierEasingOptions {
  /**
   * Property `x1` (`number`) storing x1.
   * @zh 属性 `x1`（类型：`number`），用于存储或配置x1。
   */
  x1: number;
  /**
   * Property `y1` (`number`) storing y1.
   * @zh 属性 `y1`（类型：`number`），用于存储或配置y1。
   */
  y1: number;
  /**
   * Property `x2` (`number`) storing x2.
   * @zh 属性 `x2`（类型：`number`），用于存储或配置x2。
   */
  x2: number;
  /**
   * Property `y2` (`number`) storing y2.
   * @zh 属性 `y2`（类型：`number`），用于存储或配置y2。
   */
  y2: number;
}
