/**
 * @fileoverview Module `src/ux/windows/core/classes/base-components/button.ts` providing button definitions and implementation.
 * @zh 模块文件 `src/ux/windows/core/classes/base-components/button.ts`，提供按钮相关的定义与实现。
 */

import { Component, HostBinding, Injector, Input, Output, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';
import { ɵCommonCssClassEnum } from '../../enums';
import { ɵOsBaseComponent } from './component';

/**
 * Angular component `ɵOsBaseButtonComponent` providing ɵos base button component presentation and interaction in `src/ux/windows/core/classes/base-components`.
 * @zh Angular 组件 `ɵOsBaseButtonComponent`，提供ɵOs基础按钮组件的视图渲染与交互逻辑（位于 `src/ux/windows/core/classes/base-components`）。
 */
@Component({
    template: '',
    standalone: false,
    changeDetection: ChangeDetectionStrategy.Default
})
export abstract class ɵOsBaseButtonComponent extends ɵOsBaseComponent {

    /**
     * Input property `isDisabled` (`boolean`) configuring is disabled.
     * @zh 输入属性 `isDisabled`（类型：`boolean`），用于配置是否为已禁用。
     */
    @Input()
    @HostBinding(`class.${ɵCommonCssClassEnum.Disabled}`)
    public isDisabled: boolean;


    /**
     * Input property `isFocused` (`boolean`) configuring is focused.
     * @zh 输入属性 `isFocused`（类型：`boolean`），用于配置是否为已聚焦。
     */
    @Input()
    @HostBinding(`class.${ɵCommonCssClassEnum.Focused}`)
    public isFocused: boolean;

    /**
     * Metadata of destination of the button
     * @zh 输入属性 `ariaLabel`（类型：`string`），用于配置aria标签。
     */
    @Input()
    @HostBinding('attr.aria-label')
    public ariaLabel: string;

    /**
     * Metadata of relation of the button
     * @zh 输入属性 `ariaControls`（类型：`string`），用于配置aria控件集合。
     */
    @Input()
    @HostBinding('attr.aria-controls')
    public ariaControls: string;

    /**
     * Metadata of selection state of the button
     * @zh 输入属性 `ariaSelected`（类型：`string`），用于配置aria已选中。
     */
    @Input()
    @HostBinding('attr.aria-selected')
    public ariaSelected: string;

    /**
     * Metadata of role of the button
     * @zh 输入属性 `role`（类型：`string`），用于配置角色。
     */
    @Input()
    @HostBinding('attr.role')
    public role: string;

    /**
     * Target internal element focus event
     * @zh 输出事件 `osFocus`（类型：`Observable<FocusEvent>`），当触发os聚焦时向外发出事件。
     */
    @Output()
    public osFocus: Observable<FocusEvent> = this.createEvent('focus');

    /**
     * Target internal element blur event
     * @zh 输出事件 `osBlur`（类型：`Observable<FocusEvent>`），当触发os失焦时向外发出事件。
     */
    @Output()
    public osBlur: Observable<FocusEvent> = this.createEvent('blur');

    /**
     * Host-bound getter `_hostTabIndexAttr` (`number`) computing host tab index attr.
     * @internal
     * @zh 宿主绑定读取器 `_hostTabIndexAttr`（绑定至 `attr.tabindex`），计算并返回宿主选项卡索引特性。
     */
    @HostBinding('attr.tabindex')
    public get _hostTabIndexAttr(): number | null {
        return (this.isDisabled) ? null : 0;
    }

    /**
     * Creates an instance of `ɵOsBaseButtonComponent` and initializes its dependencies and internal state.
     * @zh 创建 `ɵOsBaseButtonComponent` 实例，并初始化其依赖项与内部状态。
     * @param injector - Injected or initial injector (`Injector`) / 注入或传入的注入器（`Injector`）
     */
    constructor(
        injector: Injector
    ) {
        super(injector);
    }
}
