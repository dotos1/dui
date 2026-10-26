/**
 * @fileoverview Module `src/common/scrollbar/viewport/viewport-adapter.ts` providing viewport adapter definitions and implementation.
 * @zh 模块文件 `src/common/scrollbar/viewport/viewport-adapter.ts`，提供视口适配器相关的定义与实现。
 */

import { Injectable, signal, WritableSignal } from '@angular/core';
import { ViewportClasses } from '../utils/common';

/**
 * Class representing a viewport adapter.
 * Provides methods and properties to interact with a viewport and its content.

 * @zh 可注入的 Angular 服务 `ViewportAdapter`，管理 `src/common/scrollbar/viewport` 中的视口适配器状态与业务操作。
 */
@Injectable()
export class ViewportAdapter {

  /**
   * Viewport native element

   * @zh 属性 `nativeElement`（类型：`HTMLElement`），用于存储或配置原生元素。
   */
  nativeElement: HTMLElement;
  /**
   * The element that wraps the content inside the viewport,
   * used to measure the content size and observe its changes.

   * @zh 属性 `contentWrapperElement`（类型：`HTMLElement`），用于存储或配置内容包装器元素。
   */
  contentWrapperElement: HTMLElement;

  /*
   * A signal that indicates when viewport adapter is initialized
   */
  /**
   * Property `initialized` (`WritableSignal<boolean>`) storing initialized (default: `signal(false)`).
   * @zh 属性 `initialized`（类型：`WritableSignal<boolean>`），用于存储或配置已初始化（默认值：`signal(false)`）。
   */
  initialized: WritableSignal<boolean> = signal(false);

  /**
   * Viewport clientHeight
   * @zh 获取当前偏移量高度（`offsetHeight: number`）。
   */
  get offsetHeight(): number {
    return this.nativeElement.offsetHeight;
  }

  /**
   * Viewport clientWidth
   * @zh 获取当前偏移量宽度（`offsetWidth: number`）。
   */
  get offsetWidth(): number {
    return this.nativeElement.offsetWidth;
  }

  /**
   * Viewport scrollTop
   * @zh 获取当前滚动顶部位置（`scrollTop: number`）。
   */
  get scrollTop(): number {
    return this.nativeElement.scrollTop;
  }

  /**
   * Viewport scrollLeft
   * @zh 获取当前滚动左侧位置（`scrollLeft: number`）。
   */
  get scrollLeft(): number {
    return this.nativeElement.scrollLeft;
  }

  /**
   * Content height
   * @zh 获取当前内容高度（`contentHeight: number`）。
   */
  get contentHeight(): number {
    return this.contentWrapperElement.offsetHeight;
  }

  /**
   * Content width
   * @zh 获取当前内容宽度（`contentWidth: number`）。
   */
  get contentWidth(): number {
    return this.contentWrapperElement.offsetWidth;
  }

  /**
   * The remaining vertical scrollable distance.
   * @zh 获取当前滚动最大值X坐标（`scrollMaxX: number`）。
   */
  get scrollMaxX(): number {
    return this.contentWidth - this.offsetWidth;
  }

  /**
   * The vertical remaining scrollable distance
   * @zh 获取当前滚动最大值Y坐标（`scrollMaxY: number`）。
   */
  get scrollMaxY(): number {
    return this.contentHeight - this.offsetHeight;
  }

  /**
   * Initialize viewport

   * @zh 执行 `init`，用于初始化。
   */
  init(viewportElement: HTMLElement, contentElement: HTMLElement, spacerElement?: HTMLElement): void {
    // Add viewport class
    viewportElement.classList.add(ViewportClasses.Viewport);
    this.nativeElement = viewportElement;

    // Add content wrapper class
    contentElement.classList.add(ViewportClasses.Content);

    // When integrating the scrollbar with virtual scroll, the content wrapper will have fake size,
    // and a spacer element will have the real size
    // Therefore, if spaceElement is provided, it will be observed instead of the content wrapper
    if (spacerElement) {
      spacerElement.classList.add(ViewportClasses.Spacer);
      this.contentWrapperElement = spacerElement;
    } else {
      // If spacer is not provided, set it as the content wrapper
      this.contentWrapperElement = contentElement;
    }
    this.initialized.set(true);
  }

  /**
   * Executes `reset` to handle reset.
   * @zh 执行 `reset`，用于重置。
   */
  reset(): void {
    this.nativeElement = null;
    this.contentWrapperElement = null;
    this.initialized.set(false);
  }

  /**
   * Scrolls the viewport vertically to the specified value.

   * @zh 执行 `scrollYTo`，用于滚动Y坐标转换为。
   */
  scrollYTo(value: number): void {
    this.nativeElement.scrollTop = value;
  }

  /**
   * Scrolls the viewport horizontally to the specified value.

   * @zh 执行 `scrollXTo`，用于滚动X坐标转换为。
   */
  scrollXTo(value: number): void {
    this.nativeElement.scrollLeft = value;
  }
}
