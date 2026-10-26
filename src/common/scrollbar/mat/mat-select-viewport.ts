/**
 * @fileoverview Module `src/common/scrollbar/mat/mat-select-viewport.ts` providing mat select viewport definitions and implementation.
 * @zh 模块文件 `src/common/scrollbar/mat/mat-select-viewport.ts`，提供Material下拉选择视口相关的定义与实现。
 */

import { Directive, effect, inject, untracked } from '@angular/core';
import { MatOption, MatSelect } from '@angular/material/select';
import { _NgScrollbar, NG_SCROLLBAR } from '../utils/scrollbar-base';


/**
 * Angular directive `NgScrollbarMatSelectViewport` (selector: 'ng-scrollbar[matSelectViewport]') attaching ng scrollbar mat select viewport behavior to host DOM elements.
 * @zh Angular 指令 `NgScrollbarMatSelectViewport`（selector: 'ng-scrollbar[matSelectViewport]'），为宿主 DOM 元素附加Angular滚动条Material下拉选择视口行为。
 */
@Directive({
  standalone: true,
  selector: 'ng-scrollbar[matSelectViewport]'
})
export class NgScrollbarMatSelectViewport {

  /**
   * Property `scrollbar` (`_NgScrollbar`) storing scrollbar (default: `inject(NG_SCROLLBAR, { self: true })`).
   * @zh 属性 `scrollbar`（类型：`_NgScrollbar`），用于存储或配置滚动条（默认值：`inject(NG_SCROLLBAR, { self: true })`）。
   */
  private readonly scrollbar: _NgScrollbar = inject(NG_SCROLLBAR, { self: true });

  /**
   * Property `matSelect` (`MatSelect`) storing mat select (default: `inject(MatSelect)`).
   * @zh 属性 `matSelect`（类型：`MatSelect`），用于存储或配置Material下拉选择（默认值：`inject(MatSelect)`）。
   */
  private readonly matSelect: MatSelect = inject(MatSelect);

  /**
   * Creates an instance of `NgScrollbarMatSelectViewport` and initializes its dependencies and internal state.
   * @zh 创建 `NgScrollbarMatSelectViewport` 实例，并初始化其依赖项与内部状态。
   */
  constructor() {
    effect(() => {
      const isVerticallyScrollable: boolean = this.scrollbar.isVerticallyScrollable();

      untracked(() => {
        if (isVerticallyScrollable && this.matSelect.panelOpen) {
          const selected: MatOption | MatOption[] = this.matSelect.selected;
          if (selected) {
            const element: HTMLElement = Array.isArray(selected) ? selected[0]._getHostElement() : selected._getHostElement();
            const height: number = this.scrollbar.nativeElement.clientHeight;
            this.scrollbar.viewport.scrollYTo(element.offsetTop + element.offsetHeight - height);
          }
        }
      });
    });
  }
}
