/**
 * @fileoverview Module `src/ux/windows/window/components/title-bar-button/title-bar-button.component.ts` providing title bar button component definitions and implementation.
 * @zh 模块文件 `src/ux/windows/window/components/title-bar-button/title-bar-button.component.ts`，提供标题条按钮组件相关的定义与实现。
 */

import {
    ChangeDetectionStrategy,
    Component,
    Injector,
    Input,
    OnInit,
    ViewEncapsulation
} from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { ɵOsBaseButtonComponent } from '../../../core/classes/base-components';

/**
 * Angular component `TitleBarButtonComponent` (selector: 'dui-title-bar-button') providing title bar button component presentation and interaction in `src/ux/windows/window/components/title-bar-button`.
 * @zh Angular 组件 `TitleBarButtonComponent`（selector: 'dui-title-bar-button'），提供标题条按钮组件的视图渲染与交互逻辑（位于 `src/ux/windows/window/components/title-bar-button`）。
 */
@Component({
    selector: 'dui-title-bar-button',
    templateUrl: './title-bar-button.component.html',
    host: {
        'class': 'dui-title-bar-button'
    },
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TitleBarButtonComponent extends ɵOsBaseButtonComponent implements OnInit {
    /**
     * Link to the icon
     * @zh 输入属性 `iconUrl`（类型：`string`），用于配置图标链接地址。
     */
    @Input()
    public iconUrl: string;

    /**
     * Stylelist for the icon
     * @zh 输入属性 `iconStyle`（类型：`object`），用于配置图标样式。
     */
    @Input()
    public iconStyle: object;

    /**
     * Classlist for the icon
     * @zh 输入属性 `iconStyleClass`（类型：`string | string[] | object`），用于配置图标样式类名。
     */
    @Input()
    public iconStyleClass: string | string[] | object;

    /**
     * Gets the current icon css url (`_iconCssUrl: string`).
     * @internal
     * @zh 获取当前图标CSS样式链接地址（`_iconCssUrl: string`）。
     */
    public get _iconCssUrl(): string {
        return (this.iconUrl) ? `url(${this.iconUrl})` : null;
    }

    /**
     * Creates an instance of `TitleBarButtonComponent` and initializes its dependencies and internal state.
     * @zh 创建 `TitleBarButtonComponent` 实例，并初始化其依赖项与内部状态。
     * @param injector - Injected or initial injector (`Injector`) / 注入或传入的注入器（`Injector`）
     */
    constructor(
        injector: Injector
    ) {
        super(injector);
    }

    /**
     * Angular lifecycle hook invoked once after component or directive inputs are initialized.
     * @zh Angular 生命周期钩子：在组件或指令的输入属性初始化完成后调用一次。
     */
    public ngOnInit(): void {
        this.initClickObserver();
    }

    /**
     * Executes `initClickObserver` to handle init click observer.
     * @zh 执行 `initClickObserver`，用于初始化点击观察者。
     */
    private initClickObserver(): void {
        this.osClick
            .pipe(takeUntil(this.viewDestroyed$))
            .subscribe((event) => event.stopPropagation());
    }
}
