/**
 * @fileoverview Module `src/ux/windows/window/components/window/window.component.ts` providing window component definitions and implementation.
 * @zh 模块文件 `src/ux/windows/window/components/window/window.component.ts`，提供窗口组件相关的定义与实现。
 */

import {
    ChangeDetectionStrategy,
    Component,
    HostBinding,
    Injector,
    Input,
    ViewEncapsulation
} from '@angular/core';
import { ɵOsBaseComponent } from '../../../core/classes/base-components';
import { ɵCommonCssClassEnum } from '../../../core/enums/common-css-class.enum';


/**
 * Angular component `WindowComponent` (selector: 'dui-window') providing window component presentation and interaction in `src/ux/windows/window/components/window`.
 * @zh Angular 组件 `WindowComponent`（selector: 'dui-window'），提供窗口组件的视图渲染与交互逻辑（位于 `src/ux/windows/window/components/window`）。
 */
@Component({
    selector: 'dui-window',
    templateUrl: './window.component.html',
    host: {
        'class': 'dui-window'
    },
    styleUrls: ['./window.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class WindowComponent extends ɵOsBaseComponent {
    /**
     * Marks window as active (means user works with it right now)
     * @zh 输入属性 `isActive`（类型：`boolean`），用于配置是否为激活（默认值：`false`）。
     */
    @Input()
    @HostBinding(`class.${ɵCommonCssClassEnum.Active}`)
    public isActive: boolean = false;

    /**
     * Stylelist for scroll view component of the window
     * @zh 输入属性 `scrollViewStyle`（类型：`object`），用于配置滚动视图样式。
     */
    @Input()
    public scrollViewStyle: object;

    /**
     * Classlist for scroll view component of the window
     * @zh 输入属性 `scrollViewStyleClass`（类型：`string | string[] | object`），用于配置滚动视图样式类名。
     */
    @Input()
    public scrollViewStyleClass: string | string[] | object;

    /**
     * Creates an instance of `WindowComponent` and initializes its dependencies and internal state.
     * @zh 创建 `WindowComponent` 实例，并初始化其依赖项与内部状态。
     * @param injector - Injected or initial injector (`Injector`) / 注入或传入的注入器（`Injector`）
     */
    constructor(
        injector: Injector
    ) {
        super(injector);
    }
}
