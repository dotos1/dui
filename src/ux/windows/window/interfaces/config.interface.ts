/**
 * @fileoverview Module `src/ux/windows/window/interfaces/config.interface.ts` providing config interface definitions and implementation.
 * @zh 模块文件 `src/ux/windows/window/interfaces/config.interface.ts`，提供配置interface相关的定义与实现。
 */

import { NgModuleRef, Type } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CssCoordinate } from '../../core/interfaces';

import { DraggerConfig } from '../../drag-and-drop';
import { ResizerConfig, ResizerEnum } from '../../resizer';
import { DynamicWindowFullscreenOffset } from './fullscreen-offset.interface';

/**
 * The parameters to set up a dynamic window and pass some custom data for the component which will be rendered inside
 * @zh 接口 `DynamicWindowConfig`，定义动态窗口配置的数据结构契约与属性规范。
 */
export interface DynamicWindowConfig<D = unknown, T = unknown> {

    /**
     * Property `id` (`string`) storing id.
     * @zh 属性 `id`（类型：`string`），用于存储或配置唯一标识。
     */
    id?:string;
    /**
     * The title text of the dynamic window's title bar
     * @zh 属性 `title`（类型：`string`），用于存储或配置标题。
     */
    title?: string;
    /**
     * Custom data you can access via the component which rendered inside of the dynamic window
     * @zh 属性 `data`（类型：`D`），用于存储或配置数据。
     */
    data?: D;
    /**
     * Custom data you can use to mark your window somehow you want.
     * Can be useful when you want to work with a bunch of windows as with a group.
     * For example, you need to close a group of windows with the type: MY_TYPE1

     * @zh 属性 `type`（类型：`T`），用于存储或配置类型。
     */
    type?: T;
    /**
     * The component for the title bar with content which will be rendered instead of default content
     * @zh 属性 `titleBarCustomContent`（类型：`Type<unknown>`），用于存储或配置标题条自定义内容。
     */
    titleBarCustomContent?: Type<unknown>;
    /**
     * The width of the dynamic window
     * @zh 属性 `width`（类型：`number`），用于存储或配置宽度。
     */
    width?: number;
    /**
     * The height of the dynamic window
     * @zh 属性 `height`（类型：`number`），用于存储或配置高度。
     */
    height?: number;
    /**
     * The minimum width of the dynamic window
     * @zh 属性 `minWidth`（类型：`number`），用于存储或配置最小值宽度。
     */
    minWidth?: number;
    /**
     * The minimum height of the dynamic window
     * @zh 属性 `minHeight`（类型：`number`），用于存储或配置最小值高度。
     */
    minHeight?: number;
    /**
     * The maximum width of the dynamic window
     * @zh 属性 `maxWidth`（类型：`number`），用于存储或配置最大值宽度。
     */
    maxWidth?: number;
    /**
     * The maximum height of the dynamic window
     * @zh 属性 `maxHeight`（类型：`number`），用于存储或配置最大值高度。
     */
    maxHeight?: number;
    /**
     * The allowed sides of the dynamic window to resize
     * @zh 属性 `allowedResizers`（类型：`ResizerEnum[]`），用于存储或配置允许的尺寸调整器。
     */
    allowedResizers?: ResizerEnum[];
    /**
     * The position of the dynamic window by X-axis
     * @zh 属性 `x`（类型：`number`），用于存储或配置X坐标。
     */
    x?: number;
    /**
     * The position of the dynamic window by Y-axis
     * @zh 属性 `y`（类型：`number`），用于存储或配置Y坐标。
     */
    y?: number;
    /**
     * The link to the icon. Will be displayed in the window's title bar
     * @zh 属性 `iconUrl`（类型：`string`），用于存储或配置图标链接地址。
     */
    iconUrl?: string;
    /**
     * Parameters of offsets from the edges of the screen in the full-screen mode
     * @zh 属性 `fullscreenOffset`（类型：`DynamicWindowFullscreenOffset`），用于存储或配置全屏偏移量。
     */
    fullscreenOffset?: DynamicWindowFullscreenOffset;
    /**
     * Coordinates as CSS strings the dynamic window will be hidden into
     * @zh 属性 `hidesInto`（类型：`CssCoordinate`），用于存储或配置隐藏进入。
     */
    hidesInto?: CssCoordinate;
    /**
     * The dynamic window will be at full-screen mode after the creation
     * @zh 属性 `isFullscreenByDefault`（类型：`boolean`），用于存储或配置是否为全屏按默认。
     */
    isFullscreenByDefault?: boolean;
    /**
     * The dynamic window will be hidden after the creation
     * @zh 属性 `isHiddenByDefault`（类型：`boolean`），用于存储或配置是否为隐藏按默认。
     */
    isHiddenByDefault?: boolean;
    /**
     * Defines can the dynamic window be hidden by user
     * @zh 属性 `isAllowHide`（类型：`boolean`），用于存储或配置是否为允许隐藏。
     */
    isAllowHide?: boolean;
    /**
     * Defines can the dynamic window be switched at full-screen mode and to windowed mode by user
     * @zh 属性 `isAllowFullscreen`（类型：`boolean`），用于存储或配置是否为允许全屏。
     */
    isAllowFullscreen?: boolean;
    /**
     * Defines can the dynamic window be closed by user
     * @zh 属性 `isAllowClose`（类型：`boolean`），用于存储或配置是否为允许关闭。
     */
    isAllowClose?: boolean;
    /**
     * Dynamic window with this flag will be always above other dynamic windows without this flag
     * @zh 属性 `isAlwaysOnTop`（类型：`boolean`），用于存储或配置是否为Always当顶部位置。
     */
    isAlwaysOnTop?: boolean;
    /**
     * Allows the switch to full-screen mode and to the windowed mode by double-clicking on title bar
     * @zh 属性 `isToggleFullscreenByDblClickOnTitleBar`（类型：`boolean`），用于存储或配置是否为开关全屏按Dbl点击当标题条。
     */
    isToggleFullscreenByDblClickOnTitleBar?: boolean;
    /**
     * Allows going to the windowed mode from the full-screen mode by dragging dynamic window's title bar
     * @zh 属性 `isExitFullscreenByDragTitleBar`（类型：`boolean`），用于存储或配置是否为Exit全屏按拖拽标题条。
     */
    isExitFullscreenByDragTitleBar?: boolean;
    /**
     * Is the need to display the title bar
     * @zh 属性 `isTitleBarVisible`（类型：`boolean`），用于存储或配置是否为标题条可见。
     */
    isTitleBarVisible?: boolean;
    /**
     * Stylelist for the dynamic window
     * @zh 属性 `style`（类型：`object`），用于存储或配置样式。
     */
    style?: object;
    /**
     * Classlist for the dynamic window
     * @zh 属性 `styleClass`（类型：`string | object | string[]`），用于存储或配置样式类名。
     */
    styleClass?: string | string[] | object;
    /**
     * Stylelist for the title bar of the dynamic window
     * @zh 属性 `titleBarStyle`（类型：`object`），用于存储或配置标题条样式。
     */
    titleBarStyle?: object;
    /**
     * Classlist for the title bar of the dynamic window
     * @zh 属性 `titleBarStyleClass`（类型：`string | object | string[]`），用于存储或配置标题条样式类名。
     */
    titleBarStyleClass?: string | string[] | object;
    /**
     * Stylelist for scroll view component of the window
     * @zh 属性 `scrollViewStyle`（类型：`object`），用于存储或配置滚动视图样式。
     */
    scrollViewStyle?: object;
    /**
     * Classlist for scroll view component of the window
     * @zh 属性 `scrollViewStyleClass`（类型：`string | object | string[]`），用于存储或配置滚动视图样式类名。
     */
    scrollViewStyleClass?: string | string[] | object;
    /**
     * Configuration for {@link DraggableDirective}
     * @zh 属性 `draggerConfig`（类型：`DraggerConfig`），用于存储或配置dragger配置。
     */
    draggerConfig?: DraggerConfig;
    /**
     * Configuration for {@link ResizableDirective}
     * @zh 属性 `resizerConfig`（类型：`ResizerConfig`），用于存储或配置尺寸调整器配置。
     */
    resizerConfig?: ResizerConfig;

    /**
     * Property `items` (`any`) storing items.
     * @zh 属性 `items`（类型：`any`），用于存储或配置条目列表。
     */
    items?;

    /**
     * Property `listeners` (`any`) storing listeners.
     * @zh 属性 `listeners`（类型：`any`），用于存储或配置监听器列表。
     */
    listeners?

    /**
     * Property `icon` (`string`) storing icon.
     * @zh 属性 `icon`（类型：`string`），用于存储或配置图标。
     */
    icon?: string;

    /**
     * Property `xtype` (`string`) storing xtype.
     * @zh 属性 `xtype`（类型：`string`），用于存储或配置扩展类型。
     */
    xtype?: string;

    /**
     * Property `iconType` (`string`) storing icon type.
     * @zh 属性 `iconType`（类型：`string`），用于存储或配置图标类型。
     */
    iconType?:string;

    /**
     * Property `svgIcon` (`string`) storing svg icon.
     * @zh 属性 `svgIcon`（类型：`string`），用于存储或配置SVG矢量图图标。
     */
    svgIcon?:string;

    /**
     * Property `background` (`string`) storing background.
     * @zh 属性 `background`（类型：`string`），用于存储或配置背景。
     */
    background?:string;

    /**
     * Property `radius` (`string`) storing radius.
     * @zh 属性 `radius`（类型：`string`），用于存储或配置半径。
     */
    radius?:string;

    /**
     * Property `color` (`string`) storing color.
     * @zh 属性 `color`（类型：`string`），用于存储或配置颜色。
     */
    color?:string;

    /**
     * Property `prefix` (`string`) storing prefix.
     * @zh 属性 `prefix`（类型：`string`），用于存储或配置前缀。
     */
    prefix?:string;

    /**
     * Property `path` (`string`) storing path.
     * @zh 属性 `path`（类型：`string`），用于存储或配置路径。
     */
    path?:string;

    /**
     * Property `addTask` (`boolean`) storing add task.
     * @zh 属性 `addTask`（类型：`boolean`），用于存储或配置添加任务。
     */
    addTask?:boolean;

    /**
     * Property `route` (`any`) storing route.
     * @zh 属性 `route`（类型：`any`），用于存储或配置route。
     */
    route?;

    /**
     * Property `params` (`any`) storing params.
     * @zh 属性 `params`（类型：`any`），用于存储或配置参数集合。
     */
    params?;

    /**
     * Property `iconClass` (`string`) storing icon class.
     * @zh 属性 `iconClass`（类型：`string`），用于存储或配置图标类名。
     */
    iconClass?:string;

    /**
     * Property `moduleRef` (`any`) storing module ref.
     * @zh 属性 `moduleRef`（类型：`any`），用于存储或配置模块引用。
     */
    moduleRef?;
}
