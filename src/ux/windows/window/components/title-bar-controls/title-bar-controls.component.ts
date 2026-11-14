/**
 * @fileoverview Module `src/ux/windows/window/components/title-bar-controls/title-bar-controls.component.ts` providing title bar controls component definitions and implementation.
 * @zh 模块文件 `src/ux/windows/window/components/title-bar-controls/title-bar-controls.component.ts`，提供标题条控件集合组件相关的定义与实现。
 */

import { ChangeDetectionStrategy, Component, Injector, ViewEncapsulation } from '@angular/core';
import { ɵOsBaseComponent } from '../../../core/classes/base-components';


/**
 * Angular component `TitleBarControlsComponent` (selector: 'dui-title-bar-controls') providing title bar controls component presentation and interaction in `src/ux/windows/window/components/title-bar-controls`.
 * @zh Angular 组件 `TitleBarControlsComponent`（selector: 'dui-title-bar-controls'），提供标题条控件集合组件的视图渲染与交互逻辑（位于 `src/ux/windows/window/components/title-bar-controls`）。
 */
@Component({
    selector: 'dui-title-bar-controls',
    template: '<ng-content></ng-content>',
    host: {
        'class': 'dui-title-bar-controls'
    },
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class TitleBarControlsComponent extends ɵOsBaseComponent {
    /**
     * Creates an instance of `TitleBarControlsComponent` and initializes its dependencies and internal state.
     * @zh 创建 `TitleBarControlsComponent` 实例，并初始化其依赖项与内部状态。
     * @param injector - Injected or initial injector (`Injector`) / 注入或传入的注入器（`Injector`）
     */
    constructor(
        injector: Injector
    ) {
        super(injector);
    }
}
