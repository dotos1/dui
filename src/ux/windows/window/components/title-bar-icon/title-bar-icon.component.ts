/**
 * @fileoverview Module `src/ux/windows/window/components/title-bar-icon/title-bar-icon.component.ts` providing title bar icon component definitions and implementation.
 * @zh 模块文件 `src/ux/windows/window/components/title-bar-icon/title-bar-icon.component.ts`，提供标题条图标组件相关的定义与实现。
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


/**
 * Angular component `TitleBarIconComponent` (selector: 'dui-title-bar-icon') providing title bar icon component presentation and interaction in `src/ux/windows/window/components/title-bar-icon`.
 * @zh Angular 组件 `TitleBarIconComponent`（selector: 'dui-title-bar-icon'），提供标题条图标组件的视图渲染与交互逻辑（位于 `src/ux/windows/window/components/title-bar-icon`）。
 */
@Component({
    selector: 'dui-title-bar-icon',
    template: `
    <div class="window-titleicon" [ngClass]="iconClass">
      <!-- <ng-container *ngIf="iconType!=='class'"> -->
        <mat-icon *ngIf="iconType!=='SVG'" class="dui-title-icon">{{icon}}</mat-icon>
        <mat-icon *ngIf="iconType==='SVG'" class="dui-title-icon" svgIcon="{{icon}}" ></mat-icon>
      <!-- </ng-container> -->
    </div>` ,
    host: {
        'class': 'dui-title-bar-icon'
    },
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class TitleBarIconComponent extends ɵOsBaseComponent {
    /**
     * The URL to the icon
     * @zh 输入属性 `iconType`（类型：`string`），用于配置图标类型（默认值：`'Font'`）。
     */
    @Input()
    public iconType='Font';

    /**
     * Input property `icon` (`string`) configuring icon (default: `''`).
     * @zh 输入属性 `icon`（类型：`string`），用于配置图标（默认值：`''`）。
     */
    @Input()
    public icon='';

    /**
     * Input property `iconClass` (`string`) configuring icon class (default: `''`).
     * @zh 输入属性 `iconClass`（类型：`string`），用于配置图标类名（默认值：`''`）。
     */
    @Input()
    public iconClass='';

    /**
     * Host binding `_iconCssBackground` bound to host attribute/property `style.backgroundImage` for icon css background.
     * @zh 宿主绑定属性 `_iconCssBackground`，绑定至宿主元素 `style.backgroundImage` 以控制图标CSS样式背景。
     */
    @HostBinding('style.backgroundImage')
    public _iconCssBackground: string;

    /**
     * Creates an instance of `TitleBarIconComponent` and initializes its dependencies and internal state.
     * @zh 创建 `TitleBarIconComponent` 实例，并初始化其依赖项与内部状态。
     * @param injector - Injected or initial injector (`Injector`) / 注入或传入的注入器（`Injector`）
     */
    constructor(
        injector: Injector
    ) {
        super(injector);
    }
}
