/**
 * @fileoverview Module `src/common/scrollbar/utils/scrollbar-manager.ts` providing scrollbar manager definitions and implementation.
 * @zh 模块文件 `src/common/scrollbar/utils/scrollbar-manager.ts`，提供滚动条管理器相关的定义与实现。
 */

import { Injectable, inject, signal, WritableSignal, PLATFORM_ID } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { NG_SCROLLBAR_POLYFILL } from '../ng-scrollbar.model';
import { ScrollTimelineFunc } from './common';

/**
 * Injectable Angular service `ScrollbarManager` managing scrollbar manager state and operations in `src/common/scrollbar/utils`.
 * @zh 可注入的 Angular 服务 `ScrollbarManager`，管理 `src/common/scrollbar/utils` 中的滚动条管理器状态与业务操作。
 */
@Injectable({ providedIn: 'root' })
export class ScrollbarManager {

  /**
   * Property `isBrowser` (`boolean`) storing is browser (default: `isPlatformBrowser(inject(PLATFORM_ID))`).
   * @zh 属性 `isBrowser`（类型：`boolean`），用于存储或配置是否为浏览器（默认值：`isPlatformBrowser(inject(PLATFORM_ID))`）。
   */
  private readonly isBrowser: boolean = isPlatformBrowser(inject(PLATFORM_ID));

  /**
   * Property `_polyfillUrl` (`string`) storing polyfill url (default: `inject(NG_SCROLLBAR_POLYFILL)`).
   * @zh 属性 `_polyfillUrl`（类型：`string`），用于存储或配置polyfill链接地址（默认值：`inject(NG_SCROLLBAR_POLYFILL)`）。
   */
  readonly _polyfillUrl: string = inject(NG_SCROLLBAR_POLYFILL);

  /**
   * Property `document` (`Document`) storing document (default: `inject(DOCUMENT)`).
   * @zh 属性 `document`（类型：`Document`），用于存储或配置文档对象（默认值：`inject(DOCUMENT)`）。
   */
  readonly document: Document = inject(DOCUMENT);

  /**
   * Property `window` (`Window`) storing window (default: `this.document.defaultView`).
   * @zh 属性 `window`（类型：`Window`），用于存储或配置窗口（默认值：`this.document.defaultView`）。
   */
  readonly window: Window = this.document.defaultView;

  /**
   * Property `scrollTimelinePolyfill` (`WritableSignal<ScrollTimelineFunc>`) storing scroll timeline polyfill (default: `signal(null)`).
   * @zh 属性 `scrollTimelinePolyfill`（类型：`WritableSignal<ScrollTimelineFunc>`），用于存储或配置滚动时间轴Polyfill（默认值：`signal(null)`）。
   */
  readonly scrollTimelinePolyfill: WritableSignal<ScrollTimelineFunc> = signal(null);

  /**
   * Creates an instance of `ScrollbarManager` and initializes its dependencies and internal state.
   * @zh 创建 `ScrollbarManager` 实例，并初始化其依赖项与内部状态。
   */
  constructor() {
    if (this.isBrowser && (!this.window['ScrollTimeline'] || !CSS.supports('animation-timeline', 'scroll()'))) {
      this.initPolyfill();
    }
  }

  /**
   * Executes `initPolyfill` to handle init polyfill.
   * @zh 执行 `initPolyfill`，用于初始化Polyfill。
   * @returns Result of type `Promise<void>` / 类型为 `Promise<void>` 的返回值
   */
  async initPolyfill(): Promise<void> {
    try {
      // Create a script element
      const script: HTMLScriptElement = this.document.createElement('script');
      script.src = this._polyfillUrl;

      // Wait for the script to load
      await new Promise<Event>((resolve, reject) => {
        script.onload = resolve;
        script.onerror = reject;
        this.document.head.appendChild(script);
      });

      // Once loaded, access and execute the function attached to the window object
      if (this.window['ScrollTimeline']) {
        this.scrollTimelinePolyfill.set(this.window['ScrollTimeline']);
      } else {
        console.error('[NgScrollbar]: ScrollTimeline is not attached to the window object.');
      }
    } catch (error) {
      console.error('[NgScrollbar]: Error loading ScrollTimeline script:', error);
    }
  }
}
