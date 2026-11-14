/**
 * @fileoverview Module `src/ux/terminal/global-style/global-style.component.ts` providing global style component definitions and implementation.
 * @zh 模块文件 `src/ux/terminal/global-style/global-style.component.ts`，提供全局样式组件相关的定义与实现。
 */

import { Component, ViewEncapsulation } from '@angular/core';

/**
 * Angular component `GlobalStyleComponent` (selector: 'global-style') providing global style component presentation and interaction in `src/ux/terminal/global-style`.
 * @zh Angular 组件 `GlobalStyleComponent`（selector: 'global-style'），提供全局样式组件的视图渲染与交互逻辑（位于 `src/ux/terminal/global-style`）。
 */
@Component({
  selector: 'global-style',
  templateUrl: './global-style.component.html',
  styleUrls: ['./xterm.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: false
})
export class GlobalStyleComponent {

  /**
   * Creates an instance of `GlobalStyleComponent` and initializes its dependencies and internal state.
   * @zh 创建 `GlobalStyleComponent` 实例，并初始化其依赖项与内部状态。
   */
  constructor() { }

}
