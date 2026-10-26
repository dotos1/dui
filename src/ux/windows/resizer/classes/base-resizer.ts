/**
 * @fileoverview Module `src/ux/windows/resizer/classes/base-resizer.ts` providing base resizer definitions and implementation.
 * @zh 模块文件 `src/ux/windows/resizer/classes/base-resizer.ts`，提供基础尺寸调整器相关的定义与实现。
 */

import { DOCUMENT } from '@angular/common';
import { Injector } from '@angular/core';
import { ɵParseInt, ɵPointerHelper } from '../../core';
import { ResizableDirective } from '../directives';
import { ResizerEnum } from '../enums';
import { ɵResizerConfigModel } from './resizer-config';

/**
 * Class `ɵBaseResizer` encapsulating ɵbase resizer data structures and logic in `src/ux/windows/resizer/classes`.
 * @zh 类 `ɵBaseResizer`，封装 `src/ux/windows/resizer/classes` 中的ɵBase尺寸调整器数据结构与处理逻辑。
 */
export abstract class ɵBaseResizer {
    /**
     * Property `id` (`ResizerEnum`) storing id (default: `null`).
     * @zh 属性 `id`（类型：`ResizerEnum`），用于存储或配置唯一标识（默认值：`null`）。
     */
    public static id: ResizerEnum = null;

    /**
     * Property `documentElement` (`HTMLElement`) storing document element.
     * @zh 属性 `documentElement`（类型：`HTMLElement`），用于存储或配置文档对象元素。
     */
    protected readonly documentElement: HTMLElement;
    /**
     * Property `minWidth` (`number`) storing min width.
     * @zh 属性 `minWidth`（类型：`number`），用于存储或配置最小值宽度。
     */
    protected minWidth: number;
    /**
     * Property `maxWidth` (`number`) storing max width.
     * @zh 属性 `maxWidth`（类型：`number`），用于存储或配置最大值宽度。
     */
    protected maxWidth: number;
    /**
     * Property `minHeight` (`number`) storing min height.
     * @zh 属性 `minHeight`（类型：`number`），用于存储或配置最小值高度。
     */
    protected minHeight: number;
    /**
     * Property `maxHeight` (`number`) storing max height.
     * @zh 属性 `maxHeight`（类型：`number`），用于存储或配置最大值高度。
     */
    protected maxHeight: number;
    /**
     * Property `originalWidth` (`number`) storing original width (default: `20`).
     * @zh 属性 `originalWidth`（类型：`number`），用于存储或配置原始宽度（默认值：`20`）。
     */
    protected originalWidth = 20;
    /**
     * Property `originalHeight` (`number`) storing original height (default: `20`).
     * @zh 属性 `originalHeight`（类型：`number`），用于存储或配置原始高度（默认值：`20`）。
     */
    protected originalHeight = 20;
    /**
     * Property `originalX` (`number`) storing original x (default: `20`).
     * @zh 属性 `originalX`（类型：`number`），用于存储或配置原始X坐标（默认值：`20`）。
     */
    protected originalX = 20;
    /**
     * Property `originalY` (`number`) storing original y (default: `20`).
     * @zh 属性 `originalY`（类型：`number`），用于存储或配置原始Y坐标（默认值：`20`）。
     */
    protected originalY = 20;
    /**
     * Property `originalMouseX` (`number`) storing original mouse x (default: `20`).
     * @zh 属性 `originalMouseX`（类型：`number`），用于存储或配置原始鼠标X坐标（默认值：`20`）。
     */
    protected originalMouseX = 20;
    /**
     * Property `originalMouseY` (`number`) storing original mouse y (default: `20`).
     * @zh 属性 `originalMouseY`（类型：`number`），用于存储或配置原始鼠标Y坐标（默认值：`20`）。
     */
    protected originalMouseY = 20;
    /**
     * Property `config` (`ɵResizerConfigModel`) storing config.
     * @zh 属性 `config`（类型：`ɵResizerConfigModel`），用于存储或配置配置。
     */
    protected config: ɵResizerConfigModel;
    /**
     * Property `resizableElement` (`HTMLElement`) storing resizable element.
     * @zh 属性 `resizableElement`（类型：`HTMLElement`），用于存储或配置是否可调尺寸元素。
     */
    protected resizableElement: HTMLElement;

    /**
     * Property `minSize` (`number`) storing min size (default: `20`).
     * @zh 属性 `minSize`（类型：`number`），用于存储或配置最小值尺寸（默认值：`20`）。
     */
    private minSize = 20;

    /**
     * Creates an instance of `ɵBaseResizer` and initializes its dependencies and internal state.
     * @zh 创建 `ɵBaseResizer` 实例，并初始化其依赖项与内部状态。
     * @param context - Injected or initial context (`ResizableDirective`) / 注入或传入的上下文（`ResizableDirective`）
     * @param injector - Injected or initial injector (`Injector`) / 注入或传入的注入器（`Injector`）
     */
    constructor(
        protected readonly context: ResizableDirective,
        private readonly injector: Injector
    ) {
        this.config = this.context.config;
        this.documentElement = this.injector.get(DOCUMENT)?.documentElement;
    }

    /**
     * Executes `init` to handle init.
     * @zh 执行 `init`，用于初始化。
     * @param resizableElement - resizable element parameter (`HTMLElement`) / 是否可调尺寸元素参数（`HTMLElement`）
     * @param event - event parameter (`PointerEvent | TouchEvent`) / 事件参数（`PointerEvent | TouchEvent`）
     */
    public init(resizableElement: HTMLElement, event: PointerEvent | TouchEvent): void {
        const { width, height, left, top } = resizableElement.getBoundingClientRect();
        this.originalWidth = width;
        this.originalHeight = height;
        this.originalX = left;
        this.originalY = top;
        this.originalMouseX = ɵPointerHelper.getPageX(event);
        this.originalMouseY = ɵPointerHelper.getPageY(event);
        this.resizableElement = resizableElement;

        this.initMinAndMaxSizes();
    }

    /**
     * Executes `initMinAndMaxSizes` to handle init min and max sizes.
     * @zh 执行 `initMinAndMaxSizes`，用于初始化最小值And最大值尺寸列表。
     */
    private initMinAndMaxSizes(): void {
        const computedStyles = getComputedStyle(this.resizableElement);
        const { minWidth, maxWidth, minHeight, maxHeight } = computedStyles;

        this.minWidth = this.config.minWidth || ɵParseInt(minWidth) || this.minSize;
        this.maxWidth = this.config.maxWidth || ɵParseInt(maxWidth) || this.minSize;
        this.minHeight = this.config.minHeight || ɵParseInt(minHeight) || this.minSize;
        this.maxHeight = this.config.maxHeight || ɵParseInt(maxHeight) || this.minSize;
    }

    /**
     * Executes `resizeElement` to handle resize element.
     * @zh 执行 `resizeElement`，用于调整尺寸元素。
     * @param event - event parameter (`PointerEvent | TouchEvent`) / 事件参数（`PointerEvent | TouchEvent`）
     */
    public abstract resizeElement(event: PointerEvent | TouchEvent): void;
}
