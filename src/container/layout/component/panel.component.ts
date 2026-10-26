/**
 * @fileoverview Module `src/container/layout/component/panel.component.ts` providing panel component definitions and implementation.
 * @zh 模块文件 `src/container/layout/component/panel.component.ts`，提供面板组件相关的定义与实现。
 */

import {  Component, OnDestroy, OnInit } from '@angular/core'
import { AbstractPanel } from './abstract.panel';

/**
 * Angular component `DuiPanelComponent` (selector: 'dui-panel') providing dui panel component presentation and interaction in `src/container/layout/component`.
 * @zh Angular 组件 `DuiPanelComponent`（selector: 'dui-panel'），提供DUI面板组件的视图渲染与交互逻辑（位于 `src/container/layout/component`）。
 */
@Component({
  selector: 'dui-panel',
  styleUrls: ['./panel.component.scss'],
  templateUrl: './panel.component.html',
  host: {
    '[style.flex]': 'flex'
  }
})
export class DuiPanelComponent  extends AbstractPanel  implements OnInit, OnDestroy {


}
