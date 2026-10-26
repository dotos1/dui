/**
 * @fileoverview Module `src/common/scrollbar/utils/scrollbar-base.ts` providing scrollbar base definitions and implementation.
 * @zh 模块文件 `src/common/scrollbar/utils/scrollbar-base.ts`，提供滚动条基础相关的定义与实现。
 */

import { InjectionToken, Signal, WritableSignal } from '@angular/core';
import { Direction } from '@angular/cdk/bidi';
import { SmoothScrollToOptions } from '../smooth-scroll';
import { ViewportAdapter } from '../viewport';
import { ElementDimension, ScrollbarDragging } from './common';


/**
 * Angular dependency-injection token `NG_SCROLLBAR` for providing ng scrollbar.
 * @zh Angular 依赖注入令牌 `NG_SCROLLBAR`，用于提供与注入Angular滚动条。
 */
export const NG_SCROLLBAR: InjectionToken<_NgScrollbar> = new InjectionToken<_NgScrollbar>('NG_SCROLLBAR');

/**
 * Interface `_NgScrollbar` defining the contract and properties for ng scrollbar.
 * @zh 接口 `_NgScrollbar`，定义Angular滚动条的数据结构契约与属性规范。
 */
export interface _NgScrollbar {
  /**
   * Property `nativeElement` (`HTMLElement`) storing native element.
   * @zh 属性 `nativeElement`（类型：`HTMLElement`），用于存储或配置原生元素。
   */
  nativeElement: HTMLElement;
  /**
   * Property `dragging` (`WritableSignal<ScrollbarDragging>`) storing dragging.
   * @zh 属性 `dragging`（类型：`WritableSignal<ScrollbarDragging>`），用于存储或配置拖拽中。
   */
  dragging: WritableSignal<ScrollbarDragging>;
  /**
   * Property `direction` (`Signal<Direction>`) storing direction.
   * @zh 属性 `direction`（类型：`Signal<Direction>`），用于存储或配置方向。
   */
  direction: Signal<Direction>;
  /**
   * Property `trackScrollDuration` (`Signal<number>`) storing track scroll duration.
   * @zh 属性 `trackScrollDuration`（类型：`Signal<number>`），用于存储或配置track滚动持续时间。
   */
  trackScrollDuration: Signal<number>;
  /**
   * Property `hoverOffset` (`Signal<boolean>`) storing hover offset.
   * @zh 属性 `hoverOffset`（类型：`Signal<boolean>`），用于存储或配置hover偏移量。
   */
  hoverOffset: Signal<boolean>;
  /**
   * Property `buttons` (`Signal<boolean>`) storing buttons.
   * @zh 属性 `buttons`（类型：`Signal<boolean>`），用于存储或配置按钮。
   */
  buttons: Signal<boolean>;
  /**
   * Property `disableSensor` (`Signal<boolean>`) storing disable sensor.
   * @zh 属性 `disableSensor`（类型：`Signal<boolean>`），用于存储或配置禁用Sensor。
   */
  disableSensor: Signal<boolean>;
  /**
   * Property `sensorThrottleTime` (`Signal<number>`) storing sensor throttle time.
   * @zh 属性 `sensorThrottleTime`（类型：`Signal<number>`），用于存储或配置sensor节流时间。
   */
  sensorThrottleTime: Signal<number>;
  /**
   * Property `disableInteraction` (`Signal<boolean>`) storing disable interaction.
   * @zh 属性 `disableInteraction`（类型：`Signal<boolean>`），用于存储或配置禁用Interaction。
   */
  disableInteraction: Signal<boolean>;
  /**
   * Property `isVerticallyScrollable` (`Signal<boolean>`) storing is vertically scrollable.
   * @zh 属性 `isVerticallyScrollable`（类型：`Signal<boolean>`），用于存储或配置是否为VerticallyScrollable。
   */
  isVerticallyScrollable: Signal<boolean>;
  /**
   * Property `isHorizontallyScrollable` (`Signal<boolean>`) storing is horizontally scrollable.
   * @zh 属性 `isHorizontallyScrollable`（类型：`Signal<boolean>`），用于存储或配置是否为HorizontallyScrollable。
   */
  isHorizontallyScrollable: Signal<boolean>;
  /**
   * Property `verticalUsed` (`Signal<boolean>`) storing vertical used.
   * @zh 属性 `verticalUsed`（类型：`Signal<boolean>`），用于存储或配置垂直已使用。
   */
  verticalUsed: Signal<boolean>;
  /**
   * Property `horizontalUsed` (`Signal<boolean>`) storing horizontal used.
   * @zh 属性 `horizontalUsed`（类型：`Signal<boolean>`），用于存储或配置水平已使用。
   */
  horizontalUsed: Signal<boolean>;
  /**
   * Property `thumbClass` (`Signal<string>`) storing thumb class.
   * @zh 属性 `thumbClass`（类型：`Signal<string>`），用于存储或配置thumb类名。
   */
  thumbClass: Signal<string>;
  /**
   * Property `trackClass` (`Signal<string>`) storing track class.
   * @zh 属性 `trackClass`（类型：`Signal<string>`），用于存储或配置track类名。
   */
  trackClass: Signal<string>;
  /**
   * Property `buttonClass` (`Signal<string>`) storing button class.
   * @zh 属性 `buttonClass`（类型：`Signal<string>`），用于存储或配置按钮类名。
   */
  buttonClass: Signal<string>;
  /**
   * Property `viewportDimension` (`WritableSignal<ElementDimension>`) storing viewport dimension.
   * @zh 属性 `viewportDimension`（类型：`WritableSignal<ElementDimension>`），用于存储或配置视口维度。
   */
  viewportDimension: WritableSignal<ElementDimension>;
  /**
   * Property `contentDimension` (`WritableSignal<ElementDimension>`) storing content dimension.
   * @zh 属性 `contentDimension`（类型：`WritableSignal<ElementDimension>`），用于存储或配置内容维度。
   */
  contentDimension: WritableSignal<ElementDimension>;

  get viewport(): ViewportAdapter;

  /**
   * Executes `scrollTo` to handle scroll to.
   * @zh 执行 `scrollTo`，用于滚动转换为。
   * @param options - options parameter (`SmoothScrollToOptions`) / 配置选项参数（`SmoothScrollToOptions`）
   * @returns Result of type `Promise<void>` / 类型为 `Promise<void>` 的返回值
   */
  scrollTo(options: SmoothScrollToOptions): Promise<void>;
}
