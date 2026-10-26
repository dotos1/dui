/**
 * @fileoverview Module `src/common/scrollbar/smooth-scroll/smooth-scroll.ts` providing smooth scroll definitions and implementation.
 * @zh 模块文件 `src/common/scrollbar/smooth-scroll/smooth-scroll.ts`，提供smooth滚动相关的定义与实现。
 */

import { Directive, ElementRef, inject } from '@angular/core';
import { SmoothScrollManager } from './smooth-scroll-manager';
import { SmoothScrollElement, SmoothScrollToElementOptions, SmoothScrollToOptions } from './smooth-scroll.model';

/**
 * Angular directive `SmoothScroll` (selector: '[smoothScroll]') attaching smooth scroll behavior to host DOM elements.
 * @zh Angular 指令 `SmoothScroll`（selector: '[smoothScroll]'），为宿主 DOM 元素附加Smooth滚动行为。
 */
@Directive({
  standalone: true,
  selector: '[smoothScroll]',
  exportAs: 'smoothScroll'
})
export class SmoothScroll {

  /**
   * Property `smoothScroll` (`SmoothScrollManager`) storing smooth scroll (default: `inject(SmoothScrollManager)`).
   * @zh 属性 `smoothScroll`（类型：`SmoothScrollManager`），用于存储或配置smooth滚动（默认值：`inject(SmoothScrollManager)`）。
   */
  private readonly smoothScroll: SmoothScrollManager = inject(SmoothScrollManager);

  /**
   * Property `element` (`ElementRef<HTMLElement>`) storing element (default: `inject(ElementRef<HTMLElement>)`).
   * @zh 属性 `element`（类型：`ElementRef<HTMLElement>`），用于存储或配置元素（默认值：`inject(ElementRef<HTMLElement>)`）。
   */
  private readonly element: ElementRef<HTMLElement> = inject(ElementRef<HTMLElement>);

  /**
   * Executes `scrollTo` to handle scroll to.
   * @zh 执行 `scrollTo`，用于滚动转换为。
   * @param options - options parameter (`SmoothScrollToOptions`) / 配置选项参数（`SmoothScrollToOptions`）
   * @returns Result of type `Promise<void>` / 类型为 `Promise<void>` 的返回值
   */
  scrollTo(options: SmoothScrollToOptions): Promise<void> {
    return this.smoothScroll.scrollTo(this.element, options);
  }

  /**
   * Executes `scrollToElement` to handle scroll to element.
   * @zh 执行 `scrollToElement`，用于滚动转换为元素。
   * @param target - target parameter (`SmoothScrollElement`) / 目标参数（`SmoothScrollElement`）
   * @param options - options parameter (`SmoothScrollToElementOptions`) / 配置选项参数（`SmoothScrollToElementOptions`）
   * @returns Result of type `Promise<void>` / 类型为 `Promise<void>` 的返回值
   */
  scrollToElement(target: SmoothScrollElement, options: SmoothScrollToElementOptions): Promise<void> {
    return this.smoothScroll.scrollToElement(this.element, target, options);
  }
}
