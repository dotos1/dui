/**
 * @fileoverview Module `src/ui/topbar/topbar-divider.component.ts` providing topbar divider component definitions and implementation.
 * @zh 模块文件 `src/ui/topbar/topbar-divider.component.ts`，提供顶栏divider组件相关的定义与实现。
 */


import { Component, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';

/**
 * Angular component `ToolbarDividerComponent` (selector: 'dui-topbar-divider') providing toolbar divider component presentation and interaction in `src/ui/topbar`.
 * @zh Angular 组件 `ToolbarDividerComponent`（selector: 'dui-topbar-divider'），提供工具栏Divider组件的视图渲染与交互逻辑（位于 `src/ui/topbar`）。
 */
@Component({
    selector: 'dui-topbar-divider',
    template: '<div></div>',
    host: { 'class': 'dui-topbar-divider' },
    styles: [`
        .dui-topbar-divider > div {
            height: 24px;
            width: 1px;
            background: rgba(0, 0, 0, 0.26);
            margin-left: 5px;
            margin-right: 5px;
        }
    `],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class ToolbarDividerComponent { }
