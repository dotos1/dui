/**
 * @fileoverview Module `src/common/scrollbar/scrollbars/scrollbars.ts` providing scrollbars definitions and implementation.
 * @zh 模块文件 `src/common/scrollbar/scrollbars/scrollbars.ts`，提供滚动条相关的定义与实现。
 */

import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { ScrollbarX, ScrollbarY } from '../scrollbar/scrollbar';
import { NG_SCROLLBAR, _NgScrollbar } from '../utils/scrollbar-base';

/**
 * Angular component `Scrollbars` (selector: 'scrollbars') providing scrollbars presentation and interaction in `src/common/scrollbar/scrollbars`.
 * @zh Angular 组件 `Scrollbars`（selector: 'scrollbars'），提供滚动条的视图渲染与交互逻辑（位于 `src/common/scrollbar/scrollbars`）。
 */
@Component({
  standalone: true,
  selector: 'scrollbars',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ScrollbarX, ScrollbarY],
  template: `
    @if (cmp.verticalUsed()) {
      <scrollbar-y/>
    }
    @if (cmp.horizontalUsed()) {
      <scrollbar-x/>
    }
  `,
  styles: [`
    :host {
      display: contents;
    }
  `]
})
export class Scrollbars {
  /**
   * Property `cmp` (`_NgScrollbar`) storing cmp (default: `inject(NG_SCROLLBAR)`).
   * @zh 属性 `cmp`（类型：`_NgScrollbar`），用于存储或配置cmp（默认值：`inject(NG_SCROLLBAR)`）。
   */
  cmp: _NgScrollbar = inject(NG_SCROLLBAR);
}
