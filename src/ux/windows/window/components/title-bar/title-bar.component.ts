/**
 * @fileoverview Module `src/ux/windows/window/components/title-bar/title-bar.component.ts` providing title bar component definitions and implementation.
 * @zh 模块文件 `src/ux/windows/window/components/title-bar/title-bar.component.ts`，提供标题条组件相关的定义与实现。
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
 * Angular component `TitleBarComponent` (selector: 'dui-title-bar') providing title bar component presentation and interaction in `src/ux/windows/window/components/title-bar`.
 * @zh Angular 组件 `TitleBarComponent`（selector: 'dui-title-bar'），提供标题条组件的视图渲染与交互逻辑（位于 `src/ux/windows/window/components/title-bar`）。
 */
@Component({
    selector: 'dui-title-bar',
    template: '<ng-content></ng-content>',
    host: {
        'class': 'dui-title-bar'
    },
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TitleBarComponent extends ɵOsBaseComponent {
    /**
     * Marks title bar as active (means user works with it right now)
     * @zh 输入属性 `isActive`（类型：`boolean`），用于配置是否为激活（默认值：`true`）。
     */
    @Input()
    @HostBinding(`class.${ɵCommonCssClassEnum.Active}`)
    public isActive: boolean = true;

    /**
     * Creates an instance of `TitleBarComponent` and initializes its dependencies and internal state.
     * @zh 创建 `TitleBarComponent` 实例，并初始化其依赖项与内部状态。
     * @param injector - Injected or initial injector (`Injector`) / 注入或传入的注入器（`Injector`）
     */
    constructor(
        injector: Injector
    ) {
        super(injector);
    }
}
