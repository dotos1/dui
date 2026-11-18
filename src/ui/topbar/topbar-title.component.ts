/**
 * @fileoverview Module `src/ui/topbar/topbar-title.component.ts` providing topbar title component definitions and implementation.
 * @zh 模块文件 `src/ui/topbar/topbar-title.component.ts`，提供顶栏标题组件相关的定义与实现。
 */


import { Component, ChangeDetectionStrategy } from '@angular/core';

/**
 * Angular component `TopbarTitleComponent` (selector: 'dui-topbar-title') providing topbar title component presentation and interaction in `src/ui/topbar`.
 * @zh Angular 组件 `TopbarTitleComponent`（selector: 'dui-topbar-title'），提供顶栏标题组件的视图渲染与交互逻辑（位于 `src/ui/topbar`）。
 */
@Component({
    selector: 'dui-topbar-title',
    template: '<ng-content></ng-content>',
    host: { 'class': 'dui-topbar-title' },
    standalone: false,
    changeDetection: ChangeDetectionStrategy.Default
})
export class TopbarTitleComponent { }
