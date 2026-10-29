/**
 * @fileoverview Module `src/ux/windows/window/classes/dynamic-window-config.ts` providing dynamic window config definitions and implementation.
 * @zh 模块文件 `src/ux/windows/window/classes/dynamic-window-config.ts`，提供动态窗口配置相关的定义与实现。
 */

import { Type } from '@angular/core';
import { DraggerConfig } from '../../drag-and-drop';
import { ResizerConfig, ResizerEnum } from '../../resizer';
import { DynamicWindowConfig, DynamicWindowFullscreenOffset } from '../interfaces';

/**
 * Class `ɵDynamicWindowConfigModel` encapsulating ɵdynamic window config model data structures and logic in `src/ux/windows/window/classes`.
 * @internal
 * @zh 类 `ɵDynamicWindowConfigModel`，封装 `src/ux/windows/window/classes` 中的ɵDynamic窗口配置模型数据结构与处理逻辑。
 */
export class ɵDynamicWindowConfigModel<D = unknown, T = unknown> implements DynamicWindowConfig {
    /**
     * Property `title` (`string`) storing title.
     * @zh 属性 `title`（类型：`string`），用于存储或配置标题。
     */
    public title?: string;
    /**
     * Property `data` (`D`) storing data.
     * @zh 属性 `data`（类型：`D`），用于存储或配置数据。
     */
    public data?: D;
    /**
     * Property `type` (`T`) storing type.
     * @zh 属性 `type`（类型：`T`），用于存储或配置类型。
     */
    public type?: T;
    /**
     * Property `titleBarCustomContent` (`Type<unknown>`) storing title bar custom content.
     * @zh 属性 `titleBarCustomContent`（类型：`Type<unknown>`），用于存储或配置标题条自定义内容。
     */
    public titleBarCustomContent?: Type<unknown>;
    /**
     * Property `width` (`number`) storing width.
     * @zh 属性 `width`（类型：`number`），用于存储或配置宽度。
     */
    public width?: number;
    /**
     * Property `height` (`number`) storing height.
     * @zh 属性 `height`（类型：`number`），用于存储或配置高度。
     */
    public height?: number;
    /**
     * Property `minWidth` (`number`) storing min width.
     * @zh 属性 `minWidth`（类型：`number`），用于存储或配置最小值宽度。
     */
    public minWidth?: number;
    /**
     * Property `minHeight` (`number`) storing min height.
     * @zh 属性 `minHeight`（类型：`number`），用于存储或配置最小值高度。
     */
    public minHeight?: number;
    /**
     * Property `maxWidth` (`number`) storing max width.
     * @zh 属性 `maxWidth`（类型：`number`），用于存储或配置最大值宽度。
     */
    public maxWidth?: number;
    /**
     * Property `maxHeight` (`number`) storing max height.
     * @zh 属性 `maxHeight`（类型：`number`），用于存储或配置最大值高度。
     */
    public maxHeight?: number;
    /**
     * Property `allowedResizers` (`ResizerEnum[]`) storing allowed resizers.
     * @zh 属性 `allowedResizers`（类型：`ResizerEnum[]`），用于存储或配置允许的尺寸调整器。
     */
    public allowedResizers?: ResizerEnum[];
    /**
     * Property `positionX` (`number`) storing position x.
     * @zh 属性 `positionX`（类型：`number`），用于存储或配置位置X坐标。
     */
    public positionX?: number;
    /**
     * Property `positionY` (`number`) storing position y.
     * @zh 属性 `positionY`（类型：`number`），用于存储或配置位置Y坐标。
     */
    public positionY?: number;
    /**
     * Property `iconUrl` (`string`) storing icon url.
     * @zh 属性 `iconUrl`（类型：`string`），用于存储或配置图标链接地址。
     */
    public iconUrl?: string;
    /**
     * Property `fullscreenOffset` (`DynamicWindowFullscreenOffset`) storing fullscreen offset.
     * @zh 属性 `fullscreenOffset`（类型：`DynamicWindowFullscreenOffset`），用于存储或配置全屏偏移量。
     */
    public fullscreenOffset?: DynamicWindowFullscreenOffset;
    /**
     * Property `isFullscreenByDefault` (`boolean`) storing is fullscreen by default.
     * @zh 属性 `isFullscreenByDefault`（类型：`boolean`），用于存储或配置是否为全屏按默认。
     */
    public isFullscreenByDefault?: boolean;
    /**
     * Property `isHiddenByDefault` (`boolean`) storing is hidden by default.
     * @zh 属性 `isHiddenByDefault`（类型：`boolean`），用于存储或配置是否为隐藏按默认。
     */
    public isHiddenByDefault?: boolean;
    /**
     * Property `isAllowHide` (`boolean`) storing is allow hide.
     * @zh 属性 `isAllowHide`（类型：`boolean`），用于存储或配置是否为允许隐藏。
     */
    public isAllowHide?: boolean;
    /**
     * Property `isAllowFullscreen` (`boolean`) storing is allow fullscreen.
     * @zh 属性 `isAllowFullscreen`（类型：`boolean`），用于存储或配置是否为允许全屏。
     */
    public isAllowFullscreen?: boolean;
    /**
     * Property `isAllowClose` (`boolean`) storing is allow close.
     * @zh 属性 `isAllowClose`（类型：`boolean`），用于存储或配置是否为允许关闭。
     */
    public isAllowClose?: boolean;
    /**
     * Property `isAlwaysOnTop` (`boolean`) storing is always on top.
     * @zh 属性 `isAlwaysOnTop`（类型：`boolean`），用于存储或配置是否为Always当顶部位置。
     */
    public isAlwaysOnTop?: boolean;
    /**
     * Property `isToggleFullscreenByDblClickOnTitleBar` (`boolean`) storing is toggle fullscreen by dbl click on title bar.
     * @zh 属性 `isToggleFullscreenByDblClickOnTitleBar`（类型：`boolean`），用于存储或配置是否为开关全屏按Dbl点击当标题条。
     */
    public isToggleFullscreenByDblClickOnTitleBar?: boolean;
    /**
     * Property `isExitFullscreenByDragTitleBar` (`boolean`) storing is exit fullscreen by drag title bar.
     * @zh 属性 `isExitFullscreenByDragTitleBar`（类型：`boolean`），用于存储或配置是否为Exit全屏按拖拽标题条。
     */
    public isExitFullscreenByDragTitleBar?: boolean;
    /**
     * Property `isTitleBarVisible` (`boolean`) storing is title bar visible.
     * @zh 属性 `isTitleBarVisible`（类型：`boolean`），用于存储或配置是否为标题条可见。
     */
    public isTitleBarVisible?: boolean;
    /**
     * Property `style` (`object`) storing style.
     * @zh 属性 `style`（类型：`object`），用于存储或配置样式。
     */
    public style?: object;
    /**
     * Property `styleClass` (`string | object | string[]`) storing style class.
     * @zh 属性 `styleClass`（类型：`string | object | string[]`），用于存储或配置样式类名。
     */
    public styleClass?: string | string[] | object;
    /**
     * Property `titleBarStyle` (`object`) storing title bar style.
     * @zh 属性 `titleBarStyle`（类型：`object`），用于存储或配置标题条样式。
     */
    public titleBarStyle: object;
    /**
     * Property `titleBarStyleClass` (`string | object | string[]`) storing title bar style class.
     * @zh 属性 `titleBarStyleClass`（类型：`string | object | string[]`），用于存储或配置标题条样式类名。
     */
    public titleBarStyleClass: string | string[] | object;
    /**
     * Property `scrollViewStyle` (`object`) storing scroll view style.
     * @zh 属性 `scrollViewStyle`（类型：`object`），用于存储或配置滚动视图样式。
     */
    public scrollViewStyle?: object;
    /**
     * Property `scrollViewStyleClass` (`string | object | string[]`) storing scroll view style class.
     * @zh 属性 `scrollViewStyleClass`（类型：`string | object | string[]`），用于存储或配置滚动视图样式类名。
     */
    public scrollViewStyleClass?: string | string[] | object;
    /**
     * Property `draggerConfig` (`DraggerConfig`) storing dragger config (default: `{}`).
     * @zh 属性 `draggerConfig`（类型：`DraggerConfig`），用于存储或配置dragger配置（默认值：`{}`）。
     */
    public draggerConfig?: DraggerConfig = {};
    /**
     * Property `resizerConfig` (`ResizerConfig`) storing resizer config (default: `{}`).
     * @zh 属性 `resizerConfig`（类型：`ResizerConfig`），用于存储或配置尺寸调整器配置（默认值：`{}`）。
     */
    public resizerConfig?: ResizerConfig = {};

    /**
     * Creates an instance of `ɵDynamicWindowConfigModel` and initializes its dependencies and internal state.
     * @zh 创建 `ɵDynamicWindowConfigModel` 实例，并初始化其依赖项与内部状态。
     * @param params - Injected or initial params (`DynamicWindowConfig<unknown, unknown>`) / 注入或传入的参数集合（`DynamicWindowConfig<unknown, unknown>`）
     */
    constructor(params: DynamicWindowConfig = {}) {
        Object.assign(this, params);
        this.initWidth(params);
        this.initHeight(params);
    }

    /**
     * Executes `initWidth` to handle init width.
     * @zh 执行 `initWidth`，用于初始化宽度。
     * @param params - params parameter (`DynamicWindowConfig<unknown, unknown>`) / 参数集合参数（`DynamicWindowConfig<unknown, unknown>`）
     */
    private initWidth(params: DynamicWindowConfig): void {
        if (params.minWidth && !params.width) {
            this.width = params.minWidth;
        }
    }

    /**
     * Executes `initHeight` to handle init height.
     * @zh 执行 `initHeight`，用于初始化高度。
     * @param params - params parameter (`DynamicWindowConfig<unknown, unknown>`) / 参数集合参数（`DynamicWindowConfig<unknown, unknown>`）
     */
    private initHeight(params: DynamicWindowConfig): void {
        if (params.minHeight && !params.height) {
            this.height = params.minHeight;
        }
    }
}
