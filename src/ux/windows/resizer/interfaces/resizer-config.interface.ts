/**
 * @fileoverview Module `src/ux/windows/resizer/interfaces/resizer-config.interface.ts` providing resizer config interface definitions and implementation.
 * @zh 模块文件 `src/ux/windows/resizer/interfaces/resizer-config.interface.ts`，提供尺寸调整器配置interface相关的定义与实现。
 */

import { MouseButtonEnum } from '../../core';
import { ResizerEnum } from '../enums';
import { ResizeInfo } from '.';

/**
 * Interface `ResizerConfig` defining the contract and properties for resizer config.
 * @zh 接口 `ResizerConfig`，定义尺寸调整器配置的数据结构契约与属性规范。
 */
export interface ResizerConfig {
    /**
     * Is resizing enabled
     * @zh 属性 `isEnabled`（类型：`boolean`），用于存储或配置是否为已启用。
     */
    isEnabled?: boolean;
    /**
     * Target element that should be resizable
     * @zh 属性 `targetElement`（类型：`HTMLElement`），用于存储或配置目标元素。
     */
    targetElement?: HTMLElement;
    /**
     * The minimum width of the target element
     * @zh 属性 `minWidth`（类型：`number`），用于存储或配置最小值宽度。
     */
    minWidth?: number;
    /**
     * The minimum height of the target element
     * @zh 属性 `minHeight`（类型：`number`），用于存储或配置最小值高度。
     */
    minHeight?: number;
    /**
     * The maximum width of the target element
     * @zh 属性 `maxWidth`（类型：`number`），用于存储或配置最大值宽度。
     */
    maxWidth?: number;
    /**
     * The maximum height of the target element
     * @zh 属性 `maxHeight`（类型：`number`），用于存储或配置最大值高度。
     */
    maxHeight?: number;
    /**
     * Allowed resizers (sides and corners)
     * @zh 属性 `allowedResizers`（类型：`ResizerEnum[]`），用于存储或配置允许的尺寸调整器。
     */
    allowedResizers?: ResizerEnum[];
    /**
     * Mouse buttons by using which resizing allowed
     * @zh 属性 `allowedMouseButtons`（类型：`MouseButtonEnum[]`），用于存储或配置允许的鼠标按钮。
     */
    allowedMouseButtons?: MouseButtonEnum[];
    /**
     * Name of CSS property X-Axis from the left side of the HTML element.
     *
     * For example: `left`, `margin-left`
     *
     * @zh 属性 `xAxisLeftStyleProperty`（类型：`string`），用于存储或配置X坐标坐标轴左侧位置样式属性。
     */
    xAxisLeftStyleProperty?: string;
    /**
     * Name of CSS property X-Axis from the right side of the HTML element.
     *
     * For example: `right`, `margin-right`
     *
     * @zh 属性 `xAxisRightStyleProperty`（类型：`string`），用于存储或配置X坐标坐标轴右侧位置样式属性。
     */
    xAxisRightStyleProperty?: string;
    /**
     * Name of CSS property Y-Axis from the top side of the HTML element.
     *
     * For example: `top`, `margin-top`
     *
     * @zh 属性 `yAxisTopStyleProperty`（类型：`string`），用于存储或配置Y坐标坐标轴顶部位置样式属性。
     */
    yAxisTopStyleProperty?: string;
    /**
     * Name of CSS property Y-Axis from the bottom side of the HTML element.
     *
     * For example: `bottom`, `margin-bottom`
     *
     * @zh 属性 `yAxisBottomStyleProperty`（类型：`string`），用于存储或配置Y坐标坐标轴底部位置样式属性。
     */
    yAxisBottomStyleProperty?: string;
    /**
     * Name of CSS property for width of the HTML element.
     *
     * For example: `width`, `min-width`
     *
     * @zh 属性 `widthStyleProperty`（类型：`string`），用于存储或配置宽度样式属性。
     */
    widthStyleProperty?: string;
    /**
     * Name of CSS property for height of the HTML element.
     *
     * For example: `height`, `min-height`
     *
     * @zh 属性 `heightStyleProperty`（类型：`string`），用于存储或配置高度样式属性。
     */
    heightStyleProperty?: string;
    /**
     * Is resizing should affect position of the HTML element
     * @zh 属性 `isAllowChangePosition`（类型：`boolean`），用于存储或配置是否为允许变更位置。
     */
    isAllowChangePosition?: boolean;
    /**
     * Handler for custom logic implementation for mousemove
     * @zh 属性 `mouseMoveHandler`（类型：`(event: ResizeInfo) => void`），用于存储或配置鼠标移动处理器。
     */
    mouseMoveHandler?: (event: ResizeInfo) => void;
}
