/**
 * @fileoverview Module `src/ux/windows/window/components/dynamic-window/base-dynamic-window.component.ts` providing base dynamic window component definitions and implementation.
 * @zh 模块文件 `src/ux/windows/window/components/dynamic-window/base-dynamic-window.component.ts`，提供基础动态窗口组件相关的定义与实现。
 */

import { Component, ComponentRef, Input, OnDestroy, Type } from '@angular/core';
import { merge, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { ɵOsBaseViewComponent } from '../../../core/classes/base-components';
import { ɵCacheableReturnInstance, ɵWhenViewInit } from '../../../core/decorators';

import {
  transform,
} from '../../../core';

import { DragStrategyByAxisProperties } from '../../../drag-and-drop';
import { ɵDynamicStateManager, ɵDynamicWindowRefModel } from '../../classes';
import {
    ɵDynamicStateEnum,
    ɵDynamicWindowCssClassEnum as CssClass,
    ɵDynamicWindowCssVariableEnum as CssVariable
} from '../../enums';
import { DynamicWindowConfig } from '../../interfaces';

/**
 * Angular component `ɵBaseDynamicWindowComponent` providing ɵbase dynamic window component presentation and interaction in `src/ux/windows/window/components/dynamic-window`.
 * @internal
 * @zh Angular 组件 `ɵBaseDynamicWindowComponent`，提供ɵBase动态窗口组件的视图渲染与交互逻辑（位于 `src/ux/windows/window/components/dynamic-window`）。
 */
@Component({
    template: '',
    standalone: false
})
export abstract class ɵBaseDynamicWindowComponent
    extends ɵOsBaseViewComponent
    implements OnDestroy {
    /**
     * Input property `childComponentType` (`Type<unknown>`) configuring child component type.
     * @zh 输入属性 `childComponentType`（类型：`Type<unknown>`），用于配置子级组件类型。
     */
    @Input()
    public childComponentType: Type<unknown>;

    /**
     * Input property `windowRef` (`ɵDynamicWindowRefModel`) configuring window ref.
     * @zh 输入属性 `windowRef`（类型：`ɵDynamicWindowRefModel`），用于配置窗口引用。
     */
    @Input()
    public windowRef: ɵDynamicWindowRefModel;

    /**
     * Gets the current is opening (`isOpening: boolean`).
     * @zh 获取当前是否为打开（`isOpening: boolean`）。
     */
    public get isOpening(): boolean {
        return this.dynamicStateManager.is(ɵDynamicStateEnum.Opening);
    }

    /**
     * Gets the current is hiding (`isHiding: boolean`).
     * @zh 获取当前是否为隐藏（`isHiding: boolean`）。
     */
    public get isHiding(): boolean {
        return this.dynamicStateManager.is(ɵDynamicStateEnum.Hiding);
    }

    /**
     * Gets the current is showing (`isShowing: boolean`).
     * @zh 获取当前是否为显示（`isShowing: boolean`）。
     */
    public get isShowing(): boolean {
        return this.dynamicStateManager.is(ɵDynamicStateEnum.Showing);
    }

    /**
     * Gets the current is closing (`isClosing: boolean`).
     * @zh 获取当前是否为关闭（`isClosing: boolean`）。
     */
    public get isClosing(): boolean {
        return this.dynamicStateManager.is(ɵDynamicStateEnum.Closing);
    }

    /**
     * Gets the current is entering fullscreen (`isEnteringFullscreen: boolean`).
     * @zh 获取当前是否为进入全屏（`isEnteringFullscreen: boolean`）。
     */
    public get isEnteringFullscreen(): boolean {
        return this.dynamicStateManager.is(ɵDynamicStateEnum.EnteringFullscreen);
    }

    /**
     * Gets the current is entering windowed (`isEnteringWindowed: boolean`).
     * @zh 获取当前是否为进入已窗口（`isEnteringWindowed: boolean`）。
     */
    public get isEnteringWindowed(): boolean {
        return this.dynamicStateManager.is(ɵDynamicStateEnum.EnteringWindowed);
    }

    /**
     * Gets the current is hidden (`isHidden: boolean`).
     * @zh 获取当前是否为隐藏（`isHidden: boolean`）。
     */
    public get isHidden(): boolean {
        return (this.windowRef.isHidden && !this.isHiding);
    }

    /**
     * Gets the current is fullscreen (`isFullscreen: boolean`).
     * @zh 获取当前是否为全屏（`isFullscreen: boolean`）。
     */
    public get isFullscreen(): boolean {
        return (this.windowRef.isFullscreen && !this.isEnteringFullscreen);
    }

    /**
     * Gets the current is windowed (`isWindowed: boolean`).
     * @zh 获取当前是否为已窗口（`isWindowed: boolean`）。
     */
    public get isWindowed(): boolean {
        return (!this.windowRef.isFullscreen && !this.isEnteringWindowed);
    }

    /**
     * Gets the current title bar display attr (`_titleBarDisplayAttr: string`).
     * @zh 获取当前标题条Display特性（`_titleBarDisplayAttr: string`）。
     */
    public get _titleBarDisplayAttr(): string {
        return (this.config.isTitleBarVisible) ? '' : 'none';
    }

    /**
     * Gets the current view destroyed or window inactive (`_viewDestroyedOrWindowInactive$: Observable<boolean>`).
     * @zh 获取当前视图已销毁Or窗口未激活（`_viewDestroyedOrWindowInactive$: Observable<boolean>`）。
     */
    public get _viewDestroyedOrWindowInactive$(): Observable<boolean> {
        return merge(
            this.viewDestroyed$,
            this.windowRef.isActive$
                .pipe(filter((isActive) => !isActive))
        );
    }

    /**
     * Gets the current window style (`windowStyle: object`).
     * @zh 获取当前窗口样式（`windowStyle: object`）。
     */
    @ɵCacheableReturnInstance
    public get windowStyle(): object {
        return {
            [CssVariable.Left]: `${this.config.x}px`,
            [CssVariable.Top]: `${this.config.y}px`,
            [CssVariable.RealWidth]: `${this.windowElement?.offsetWidth}px`,
            [CssVariable.RealHeight]: `${this.windowElement?.offsetHeight}px`,
            [CssVariable.CoordinateForHidingX]: this.config.hidesInto?.x,
            [CssVariable.CoordinateForHidingY]: this.config.hidesInto?.y,
            [CssVariable.FullscreenOffsetTop]: this.config.fullscreenOffset?.top,
            [CssVariable.FullscreenOffsetRight]: this.config.fullscreenOffset?.right,
            [CssVariable.FullscreenOffsetBottom]: this.config.fullscreenOffset?.bottom,
            [CssVariable.FullscreenOffsetLeft]: this.config.fullscreenOffset?.left,
            'z-index': this.zIndex,
            ...this.config.style
        };
    }

    /**
     * Gets the current window style class (`windowStyleClass: object`).
     * @zh 获取当前窗口样式类名（`windowStyleClass: object`）。
     */
    @ɵCacheableReturnInstance
    public get windowStyleClass(): object {
        return {
            ...transform(this.config.styleClass),
            [CssClass.Opening]: this.isOpening,
            [CssClass.Hiding]: this.isHiding,
            [CssClass.Showing]: this.isShowing,
            [CssClass.Closing]: this.isClosing,
            [CssClass.EnteringFullscreen]: this.isEnteringFullscreen,
            [CssClass.EnteringWindowed]: this.isEnteringWindowed,
            [CssClass.Hidden]: this.isHidden,
            [CssClass.Fullscreen]: this.isFullscreen,
            [CssClass.Windowed]: this.isWindowed
        };
    }

    /**
     * Gets the current dragger config (`draggerConfig: object`).
     * @zh 获取当前dragger配置（`draggerConfig: object`）。
     */
    @ɵWhenViewInit()
    @ɵCacheableReturnInstance
    public get draggerConfig(): object {
        return {
            draggableElement: this.titleBarElement,
            movableElement: this.windowElement,
            childElementsBlackList: this.titleBarButtons,
            strategy: this.draggerStrategy,
            ...this.config.draggerConfig
        };
    }

    /**
     * Gets the current resizer config (`resizerConfig: object`).
     * @zh 获取当前尺寸调整器配置（`resizerConfig: object`）。
     */
    @ɵWhenViewInit()
    @ɵCacheableReturnInstance
    public get resizerConfig(): object {
        return {
            targetElement: this.windowElement,
            minWidth: this.config.minWidth,
            minHeight: this.config.minHeight,
            maxWidth: this.config.maxWidth,
            maxHeight: this.config.maxHeight,
            allowedResizers: this.config.allowedResizers,
            xAxisLeftStyleProperty: CssVariable.Left,
            yAxisTopStyleProperty: CssVariable.Top,
            widthStyleProperty: CssVariable.Width,
            heightStyleProperty: CssVariable.Height,
            ...this.config.resizerConfig
        };
    }

    /**
     * Property `config` (`DynamicWindowConfig<unknown, unknown>`) storing config.
     * @zh 属性 `config`（类型：`DynamicWindowConfig<unknown, unknown>`），用于存储或配置配置。
     */
    public config: DynamicWindowConfig;

    /**
     * Property `zIndex` (`number`) storing z index.
     * @zh 属性 `zIndex`（类型：`number`），用于存储或配置Z坐标索引。
     */
    public zIndex: number;
    /**
     * Property `windowOrderIndex` (`number`) storing window order index (default: `0`).
     * @zh 属性 `windowOrderIndex`（类型：`number`），用于存储或配置窗口顺序索引（默认值：`0`）。
     */
    public windowOrderIndex: number = 0;

    /**
     * Property `windowElement` (`HTMLElement`) storing window element.
     * @zh 属性 `windowElement`（类型：`HTMLElement`），用于存储或配置窗口元素。
     */
    public windowElement: HTMLElement;
    /**
     * Property `titleBarElement` (`HTMLElement`) storing title bar element.
     * @zh 属性 `titleBarElement`（类型：`HTMLElement`），用于存储或配置标题条元素。
     */
    public titleBarElement: HTMLElement;
    /**
     * Property `titleBarButtons` (`HTMLElement[]`) storing title bar buttons (default: `[]`).
     * @zh 属性 `titleBarButtons`（类型：`HTMLElement[]`），用于存储或配置标题条按钮（默认值：`[]`）。
     */
    public titleBarButtons: HTMLElement[] = [];

    /**
     * Property `dynamicStateManager` (`ɵDynamicStateManager`) storing dynamic state manager (default: `new ɵDynamicStateManager()`).
     * @zh 属性 `dynamicStateManager`（类型：`ɵDynamicStateManager`），用于存储或配置动态状态管理器（默认值：`new ɵDynamicStateManager()`）。
     */
    protected readonly dynamicStateManager = new ɵDynamicStateManager();
    /**
     * Property `baseZIndex` (`number`) storing base z index (default: `500`).
     * @zh 属性 `baseZIndex`（类型：`number`），用于存储或配置基础Z坐标索引（默认值：`500`）。
     */
    protected readonly baseZIndex: number = 500;
    /**
     * Property `alwaysOnTopBaseZIndex` (`number`) storing always on top base z index (default: `5000`).
     * @zh 属性 `alwaysOnTopBaseZIndex`（类型：`number`），用于存储或配置always当顶部位置基础Z坐标索引（默认值：`5000`）。
     */
    protected readonly alwaysOnTopBaseZIndex: number = 5000;

    /**
     * Property `childComponentRef` (`any`) storing child component ref.
     * @zh 属性 `childComponentRef`（类型：`any`），用于存储或配置子级组件引用。
     */
    protected childComponentRef;
    /**
     * Property `widthAtWindowedMode` (`number`) storing width at windowed mode.
     * @zh 属性 `widthAtWindowedMode`（类型：`number`），用于存储或配置宽度位于已窗口模式。
     */
    protected widthAtWindowedMode: number;
    /**
     * Property `heightAtWindowedMode` (`number`) storing height at windowed mode.
     * @zh 属性 `heightAtWindowedMode`（类型：`number`），用于存储或配置高度位于已窗口模式。
     */
    protected heightAtWindowedMode: number;

    /**
     * Property `draggerStrategy` (`DragStrategyByAxisProperties`) storing dragger strategy.
     * @zh 属性 `draggerStrategy`（类型：`DragStrategyByAxisProperties`），用于存储或配置dragger策略。
     */
    private readonly draggerStrategy = new DragStrategyByAxisProperties({
        xAxisLeftStyleProperty: CssVariable.Left,
        yAxisTopStyleProperty: CssVariable.Top
    });

    /**
     * Angular lifecycle hook invoked just before the component, directive, or service is destroyed to release subscriptions and resources.
     * @zh Angular 生命周期钩子：在组件、指令或服务销毁前调用，用于释放订阅与清理资源。
     */
    public override ngOnDestroy(): void {
        super.ngOnDestroy();
        this.childComponentRef?.destroy();
        this.windowRef.destroy();
    }

    /**
     * Executes `updateZIndex` to handle update z index.
     * @zh 执行 `updateZIndex`，用于更新Z坐标索引。
     */
    protected updateZIndex(): void {
        this.zIndex = (this.baseZIndex + this.windowOrderIndex);

        if (this.config.isAlwaysOnTop) {
            this.zIndex += this.alwaysOnTopBaseZIndex;
        }
    }
}
