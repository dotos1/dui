/**
 * @fileoverview Module `src/common/scrollbar/ng-scrollbar.model.ts` providing ng scrollbar model definitions and implementation.
 * @zh 模块文件 `src/common/scrollbar/ng-scrollbar.model.ts`，提供Angular滚动条模型相关的定义与实现。
 */

import { InjectionToken } from '@angular/core';
import { defaultOptions, defaultScrollTimelinePolyfill } from './ng-scrollbar.default';

/**
 * Type alias `ScrollbarAppearance` representing scrollbar appearance (`'native' | 'compact'`).
 * @zh 类型别名 `ScrollbarAppearance`，表示滚动条Appearance（`'native' | 'compact'`）。
 */
export type ScrollbarAppearance = 'native' | 'compact';
/**
 * Type alias `ScrollbarOrientation` representing scrollbar orientation (`'auto' | 'vertical' | 'horizontal'`).
 * @zh 类型别名 `ScrollbarOrientation`，表示滚动条方向（`'auto' | 'vertical' | 'horizontal'`）。
 */
export type ScrollbarOrientation = 'auto' | 'vertical' | 'horizontal';
/**
 * Type alias `ScrollbarVisibility` representing scrollbar visibility (`'native' | 'hover' | 'visible'`).
 * @zh 类型别名 `ScrollbarVisibility`，表示滚动条Visibility（`'native' | 'hover' | 'visible'`）。
 */
export type ScrollbarVisibility = 'native' | 'hover' | 'visible';
/**
 * Type alias `ScrollbarPosition` representing scrollbar position (`'native' | 'invertY' | 'invertX' | 'invertAll'`).
 * @zh 类型别名 `ScrollbarPosition`，表示滚动条位置（`'native' | 'invertY' | 'invertX' | 'invertAll'`）。
 */
export type ScrollbarPosition = 'native' | 'invertY' | 'invertX' | 'invertAll';

/**
 * Enumeration `ScrollbarUpdateReason` defining supported scrollbar update reason constants.
 * @zh 枚举 `ScrollbarUpdateReason`，定义支持的滚动条更新Reason常量集合。
 */
export enum ScrollbarUpdateReason {
  /**
   * Enum member `ScrollbarUpdateReason.AfterInit` = 'AfterInit' representing after init.
   * @zh 枚举项 `ScrollbarUpdateReason.AfterInit` = 'AfterInit'，表示之后初始化。
   */
  AfterInit = 'AfterInit',
  /**
   * Enum member `ScrollbarUpdateReason.Resized` = 'ResizeObserver' representing resized.
   * @zh 枚举项 `ScrollbarUpdateReason.Resized` = 'ResizeObserver'，表示已调整尺寸。
   */
  Resized = 'ResizeObserver'
}

/**
 * Angular dependency-injection token `NG_SCROLLBAR_OPTIONS` for providing ng scrollbar options.
 * @zh Angular 依赖注入令牌 `NG_SCROLLBAR_OPTIONS`，用于提供与注入Angular滚动条配置选项。
 */
export const NG_SCROLLBAR_OPTIONS: InjectionToken<NgScrollbarOptions> = new InjectionToken<NgScrollbarOptions>('NG_SCROLLBAR_OPTIONS', {
  providedIn: 'root',
  factory: () => defaultOptions
});

/**
 * Angular dependency-injection token `NG_SCROLLBAR_POLYFILL` for providing ng scrollbar polyfill.
 * @zh Angular 依赖注入令牌 `NG_SCROLLBAR_POLYFILL`，用于提供与注入Angular滚动条POLYFILL。
 */
export const NG_SCROLLBAR_POLYFILL: InjectionToken<string> = new InjectionToken<string>('NG_SCROLLBAR_POLYFILL', {
  providedIn: 'root',
  factory: () => defaultScrollTimelinePolyfill
});

/**
 * Interface `NgScrollbarOptions` defining the contract and properties for ng scrollbar options.
 * @zh 接口 `NgScrollbarOptions`，定义Angular滚动条配置选项的数据结构契约与属性规范。
 */
export interface NgScrollbarOptions {
  /**
   * Sets the scroll axis of the viewport.
   * - 'auto': Scrollbars are displayed for both vertical and horizontal scrolling.
   * - 'vertical': Scrollbars are displayed for vertical scrolling.
   * - 'horizontal': Scrollbars are displayed for horizontal scrolling.
   * Defaults to 'auto'.

   * @zh 属性 `orientation`（类型：`ScrollbarOrientation`），用于存储或配置方向。
   */
  orientation?: ScrollbarOrientation;

  /**
   * Determines when to show the scrollbar.
   * - 'native': Scrollbar is visible when the viewport is scrollable, similar to native scrollbars.
   * - 'hover': Scrollbars are hidden by default and become visible on scrolling or hovering.
   * - 'visible': Scrollbars are always visible, even if the viewport is not scrollable.
   * Defaults to 'native'.

   * @zh 属性 `visibility`（类型：`ScrollbarVisibility`），用于存储或配置visibility。
   */
  visibility?: ScrollbarVisibility;

  /**
   * Sets the appearance of the scrollbar.
   * - 'native': Scrollbar space is reserved within the viewport, similar to native scrollbars.
   * - 'compact': Scrollbars do not reserve any space and are placed over the viewport.
   * Defaults to 'native'.

   * @zh 属性 `appearance`（类型：`ScrollbarAppearance`），用于存储或配置appearance。
   */
  appearance?: ScrollbarAppearance;

  /**
   * Sets the position of each scrollbar.
   * - 'native': Uses the default position as in native scrollbars.
   * - 'invertY': Inverts the vertical scrollbar position.
   * - 'invertX': Inverts the horizontal scrollbar position.
   * - 'invertAll': Inverts the positions of both vertical and horizontal scrollbars.
   * Defaults to 'native'.

   * @zh 属性 `position`（类型：`ScrollbarPosition`），用于存储或配置位置。
   */
  position?: ScrollbarPosition;
  /**
   * A class forwarded to the scrollbar track element
   * @zh 属性 `trackClass`（类型：`string`），用于存储或配置track类名。
   */
  trackClass?: string;
  /**
   * A class forwarded to the scrollbar thumb element
   * @zh 属性 `thumbClass`（类型：`string`），用于存储或配置thumb类名。
   */
  thumbClass?: string;
  /**
   * A class forwarded to the scrollbar button element
   * @zh 属性 `buttonClass`（类型：`string`），用于存储或配置按钮类名。
   */
  buttonClass?: string;
  /**
   * Scrolling speed when clicking on scrollbar rail
   * @zh 属性 `trackScrollDuration`（类型：`number`），用于存储或配置track滚动持续时间。
   */
  trackScrollDuration?: number;
  /**
   * A flag used to enable/disable the scrollbar pointer events
   * @zh 属性 `disableInteraction`（类型：`boolean`），用于存储或配置禁用Interaction。
   */
  disableInteraction?: boolean;
  /**
   * Debounce interval for detecting changes via ResizeObserver
   * @zh 属性 `sensorThrottleTime`（类型：`number`），用于存储或配置sensor节流时间。
   */
  sensorThrottleTime?: number;
  /**
   * Whether ResizeObserver is disabled
   * @zh 属性 `disableSensor`（类型：`boolean`），用于存储或配置禁用Sensor。
   */
  disableSensor?: boolean;
  /**
   * Show scrollbar buttons
   * @zh 属性 `buttons`（类型：`boolean`），用于存储或配置按钮。
   */
  buttons?: boolean;
  /**
   * A flag used to activate hover effect on the offset area around the scrollbar
   * @zh 属性 `hoverOffset`（类型：`boolean`），用于存储或配置hover偏移量。
   */
  hoverOffset?: boolean;
}

/**
 * Executes `filterResizeEntries` to handle filter resize entries.
 * @zh 执行 `filterResizeEntries`，用于过滤调整尺寸条目集合。
 * @param entries - entries parameter (`ResizeObserverEntry[]`) / 条目集合参数（`ResizeObserverEntry[]`）
 * @param target - target parameter (`Element`) / 目标参数（`Element`）
 * @returns Result of type `DOMRectReadOnly` / 类型为 `DOMRectReadOnly` 的返回值
 */
export function filterResizeEntries(entries: ResizeObserverEntry[], target: Element): DOMRectReadOnly {
  return entries.filter((entry: ResizeObserverEntry) => entry.target === target)[0]?.contentRect;
}
