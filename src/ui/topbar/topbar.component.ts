/**
 * @fileoverview Module `src/ui/topbar/topbar.component.ts` providing topbar component definitions and implementation.
 * @zh 模块文件 `src/ui/topbar/topbar.component.ts`，提供顶栏组件相关的定义与实现。
 */


import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';

/**
 * Angular component `TopbarComponent` (selector: 'dui-topbar') providing topbar component presentation and interaction in `src/ui/topbar`.
 * @zh Angular 组件 `TopbarComponent`（selector: 'dui-topbar'），提供顶栏组件的视图渲染与交互逻辑（位于 `src/ui/topbar`）。
 */
@Component({
    selector: 'dui-topbar',
    templateUrl: './topbar.component.html',
    styleUrls: ['./topbar.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: { 'class': 'dui-topbar' }
})
export class TopbarComponent {

    /**
     * Input property `title` (`string`) configuring title (default: `''`).
     * @zh 输入属性 `title`（类型：`string`），用于配置标题（默认值：`''`）。
     */
    @Input()
    title: string = '';

    /**
     * Input property `color` (`string`) configuring color.
     * @zh 输入属性 `color`（类型：`string`），用于配置颜色。
     */
    @Input()
    color: string;

}
