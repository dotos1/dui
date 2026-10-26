/**
 * @fileoverview Module `src/common/scrollbar/cdk/cdk-virtual-scroll.ts` providing cdk virtual scroll definitions and implementation.
 * @zh 模块文件 `src/common/scrollbar/cdk/cdk-virtual-scroll.ts`，提供CDK工具虚拟滚动滚动相关的定义与实现。
 */

import { Directive, inject, effect, untracked, contentChild, Signal } from '@angular/core';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { NgScrollbarExt } from '../ng-scrollbar-ext';
// import { NgScrollbarExt } from 'ngx-scrollbar';

/**
 * Angular directive `NgScrollbarCdkVirtualScroll` (selector: 'ng-scrollbar[cdkVirtualScrollViewport]') attaching ng scrollbar cdk virtual scroll behavior to host DOM elements.
 * @zh Angular 指令 `NgScrollbarCdkVirtualScroll`（selector: 'ng-scrollbar[cdkVirtualScrollViewport]'），为宿主 DOM 元素附加Angular滚动条CDK工具虚拟滚动滚动行为。
 */
@Directive({
  standalone: true,
  selector: 'ng-scrollbar[cdkVirtualScrollViewport]'
})
export class NgScrollbarCdkVirtualScroll {

  /**
   * Property `scrollbar` (`NgScrollbarExt`) storing scrollbar (default: `inject(NgScrollbarExt, { self: true })`).
   * @zh 属性 `scrollbar`（类型：`NgScrollbarExt`），用于存储或配置滚动条（默认值：`inject(NgScrollbarExt, { self: true })`）。
   */
  private readonly scrollbar: NgScrollbarExt = inject(NgScrollbarExt, { self: true });

  /**
   * Property `virtualScrollViewportRef` (`Signal<CdkVirtualScrollViewport>`) storing virtual scroll viewport ref (default: `contentChild(CdkVirtualScrollViewport)`).
   * @zh 属性 `virtualScrollViewportRef`（类型：`Signal<CdkVirtualScrollViewport>`），用于存储或配置虚拟滚动滚动视口引用（默认值：`contentChild(CdkVirtualScrollViewport)`）。
   */
  private readonly virtualScrollViewportRef: Signal<CdkVirtualScrollViewport> = contentChild(CdkVirtualScrollViewport);

  /**
   * Creates an instance of `NgScrollbarCdkVirtualScroll` and initializes its dependencies and internal state.
   * @zh 创建 `NgScrollbarCdkVirtualScroll` 实例，并初始化其依赖项与内部状态。
   */
  constructor() {
    this.scrollbar.skipInit = true;

    effect(() => {
      const virtualScrollViewport: CdkVirtualScrollViewport = this.virtualScrollViewportRef();

      untracked(() => {
        if (virtualScrollViewport) {
          const viewport: HTMLElement = virtualScrollViewport.elementRef.nativeElement;
          const contentWrapper: HTMLElement = virtualScrollViewport._contentWrapper.nativeElement;
          const spacer: HTMLElement = virtualScrollViewport.elementRef.nativeElement.querySelector('.cdk-virtual-scroll-spacer');

          this.scrollbar.skipInit = false;
          this.scrollbar.altViewport.set(viewport);
          this.scrollbar.altContentWrapper.set(contentWrapper);
          this.scrollbar.altSpacer.set(spacer);
        }
      });
    });
  }
}
