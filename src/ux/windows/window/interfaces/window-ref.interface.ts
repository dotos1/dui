/**
 * @fileoverview Module `src/ux/windows/window/interfaces/window-ref.interface.ts` providing window ref interface definitions and implementation.
 * @zh 模块文件 `src/ux/windows/window/interfaces/window-ref.interface.ts`，提供窗口引用interface相关的定义与实现。
 */

import { ComponentRef } from '@angular/core';
import { Observable } from 'rxjs';
import { DraggableDirective } from '../../drag-and-drop';
import { ResizableDirective } from '../../resizer';
import { ɵDynamicWindowComponent } from '../components';
import { DynamicWindowConfig } from './config.interface';

/**
 * Public API of DynamicWindowRef.
 *
 * A mediator for manipulating and tracking the states of a dynamic window.
 * It can be used to manipulate the window itself (minimizing, closing, etc.),
 * and to change the config, modify the initial window settings, or change the window data.
 *
 * @zh 接口 `DynamicWindowRef`，定义动态窗口引用的数据结构契约与属性规范。
 */
export interface DynamicWindowRef {
    /**
     * Is the dynamic window hidden
     * @zh 属性 `isHidden$`（类型：`Observable<boolean>`），用于存储或配置是否为隐藏。
     */
    isHidden$: Observable<boolean>;
    /**
     * Is the dynamic window at full-screen
     * @zh 属性 `isFullscreen$`（类型：`Observable<boolean>`），用于存储或配置是否为全屏。
     */
    isFullscreen$: Observable<boolean>;
    /**
     * Is the dynamic window active (means the user works with it right now)
     * @zh 属性 `isActive$`（类型：`Observable<boolean>`），用于存储或配置是否为激活。
     */
    isActive$: Observable<boolean>;
    /**
     * Configuration object for the dynamic window
     * @zh 属性 `config$`（类型：`Observable<DynamicWindowConfig>`），用于存储或配置配置。
     */
    config$: Observable<DynamicWindowConfig>;
    /**
     * Emits value when the dynamic window closed
     * @zh 属性 `afterClosed$`（类型：`Observable<any>`），用于存储或配置之后是否关闭。
     */
    afterClosed$;

    /**
     * Id of the dynamic window
     * @zh 属性 `id`（类型：`string`），用于存储或配置唯一标识。
     */
    id: string;
    /**
     * Is the dynamic window hidden
     * @zh 属性 `isHidden`（类型：`boolean`），用于存储或配置是否为隐藏。
     */
    isHidden: boolean;
    /**
     * Is the dynamic window at full-screen
     * @zh 属性 `isFullscreen`（类型：`boolean`），用于存储或配置是否为全屏。
     */
    isFullscreen: boolean;
    /**
     * Is the dynamic window active (means the user works with it right now)
     * @zh 属性 `isActive`（类型：`boolean`），用于存储或配置是否为激活。
     */
    isActive: boolean;
    /**
     * Configuration object for the dynamic window
     * @zh 属性 `config`（类型：`DynamicWindowConfig`），用于存储或配置配置。
     */
    config: DynamicWindowConfig;
    /**
     * The HTML element of the dynamic window
     * @zh 属性 `windowElement`（类型：`HTMLElement`），用于存储或配置窗口元素。
     */
    windowElement: HTMLElement;
    /**
     * The component rendered inside the dynamic window
     * @zh 属性 `componentRef`（类型：`ComponentRef<ɵDynamicWindowComponent>`），用于存储或配置组件引用。
     */
    componentRef: ComponentRef<ɵDynamicWindowComponent>;
    /**
     * {@link DraggableDirective} of the dynamic window. Might be used to track events
     * @zh 属性 `draggableDirective`（类型：`DraggableDirective`），用于存储或配置是否可拖拽指令。
     */
    draggableDirective: DraggableDirective;
    /**
     * {@link ResizableDirective} of the dynamic window. Might be used to track events
     * @zh 属性 `resizableDirective`（类型：`ResizableDirective`），用于存储或配置是否可调尺寸指令。
     */
    resizableDirective: ResizableDirective;

    /**
     * Changes the configuration of the dynamic window
     * @zh 执行 `updateConfig`，用于更新配置。
     */
    updateConfig(config: DynamicWindowConfig): void;
    /**
     * Makes the dynamic window active (means the user works with it right now)
     * @zh 执行 `makeActive`，用于生成激活。
     */
    makeActive(): void;
    /**
     * Makes the dynamic window inactive
     * @zh 执行 `makeInactive`，用于生成未激活。
     */
    makeInactive(): void;
    /**
     * Hides dynamic window
     * @zh 执行 `hide`，用于隐藏。
     */
    hide(): void;
    /**
     * Shows dynamic window
     * @zh 执行 `show`，用于显示。
     */
    show(): void;
    /**
     * Makes dynamic window visible or hidden
     * @zh 执行 `toggleVisibility`，用于开关Visibility。
     */
    toggleVisibility(): void;
    /**
     * Maximizes the dynamic window at full-screen mode
     * @zh 执行 `goFullscreen`，用于go全屏。
     */
    goFullscreen(): void;
    /**
     * Minimizes the dynamic window at windowed mode
     * @zh 执行 `goWindowed`，用于go已窗口。
     */
    goWindowed(): void;
    /**
     * Makes dynamic window full-screen or windowed mode
     * @zh 执行 `toggleFullscreen`，用于开关全屏。
     */
    toggleFullscreen(): void;
    /**
     * Closes the dynamic window
     * @zh 执行 `close`，用于关闭。
     */
    close<T>(result?: T): void;
}
