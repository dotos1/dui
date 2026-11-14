/**
 * @fileoverview Module `src/ux/windows/window/components/title-bar-content/title-bar-content.component.ts` providing title bar content component definitions and implementation.
 * @zh 模块文件 `src/ux/windows/window/components/title-bar-content/title-bar-content.component.ts`，提供标题条内容组件相关的定义与实现。
 */

import { ChangeDetectionStrategy, Component, Injector, ViewEncapsulation } from '@angular/core';
import { ɵOsBaseComponent } from '../../../core/classes/base-components';


/**
 * Angular component `TitleBarContentComponent` (selector: 'dui-title-bar-content') providing title bar content component presentation and interaction in `src/ux/windows/window/components/title-bar-content`.
 * @zh Angular 组件 `TitleBarContentComponent`（selector: 'dui-title-bar-content'），提供标题条内容组件的视图渲染与交互逻辑（位于 `src/ux/windows/window/components/title-bar-content`）。
 */
@Component({
    selector: 'dui-title-bar-content',
    template: '<ng-content></ng-content>',
    host: {
        'class': 'dui-title-bar-content'
    },
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class TitleBarContentComponent extends ɵOsBaseComponent {
    /**
     * Creates an instance of `TitleBarContentComponent` and initializes its dependencies and internal state.
     * @zh 创建 `TitleBarContentComponent` 实例，并初始化其依赖项与内部状态。
     * @param injector - Injected or initial injector (`Injector`) / 注入或传入的注入器（`Injector`）
     */
    constructor(
        injector: Injector
    ) {
        super(injector);
    }
}
