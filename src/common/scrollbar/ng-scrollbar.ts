/**
 * @fileoverview Module `src/common/scrollbar/ng-scrollbar.ts` providing ng scrollbar definitions and implementation.
 * @zh 模块文件 `src/common/scrollbar/ng-scrollbar.ts`，提供Angular滚动条相关的定义与实现。
 */

import { Component, effect, untracked, viewChild, Signal, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { ViewportAdapter } from './viewport';
import { NgScrollbarCore } from './ng-scrollbar-core';
import { NG_SCROLLBAR } from './utils/scrollbar-base';
import { Scrollbars } from './scrollbars/scrollbars';

/**
 * Custom scrollbar component: wraps projected content in an internally-managed scrollable
 * viewport and renders custom scrollbar overlays over it.
 * @zh 自定义滚动条组件：将投影内容包裹在内部管理的可滚动视口中，并在其上渲染自定义滚动条覆层。
 */
@Component({
  standalone: true,
  selector: 'ng-scrollbar:not([externalViewport])',
  exportAs: 'ngScrollbar',
  imports: [Scrollbars],
  template: `
    <div #contentWrapper>
      <ng-content/>
      <scrollbars/>
    </div>
  `,
  styleUrls: ['./ng-scrollbar.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: NG_SCROLLBAR, useExisting: NgScrollbar },
    ViewportAdapter
  ]
})
export class NgScrollbar extends NgScrollbarCore {

  /**
   * Property `contentWrapper` (`Signal<ElementRef<HTMLElement>>`) storing content wrapper (default: `viewChild.required('contentWrapper')`).
   * @zh 内部内容包裹层元素的引用。
   * @zh 内部内容包裹层元素的引用。
   */
  contentWrapper: Signal<ElementRef<HTMLElement>> = viewChild.required('contentWrapper');

  /**
   * Property `_scrollbars` (`Signal<Scrollbars>`) storing scrollbars (default: `viewChild.required(Scrollbars)`).
   * @zh 属性 `_scrollbars`（类型：`Signal<Scrollbars>`），用于存储或配置滚动条（默认值：`viewChild.required(Scrollbars)`）。
   */
  _scrollbars: Signal<Scrollbars> = viewChild.required(Scrollbars);

  /**
   * Creates an instance of `NgScrollbar` and initializes its dependencies and internal state.
   * @zh 创建 `NgScrollbar` 实例，并初始化其依赖项与内部状态。
   */
  constructor() {
    effect(() => {
      const contentWrapper: HTMLElement = this.contentWrapper().nativeElement;
      untracked(() => {
        this.viewport.init(this.nativeElement, contentWrapper);
      });
    });
    super();
  }
}
