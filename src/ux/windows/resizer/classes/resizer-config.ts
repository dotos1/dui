/**
 * @fileoverview Module `src/ux/windows/resizer/classes/resizer-config.ts` providing resizer config definitions and implementation.
 * @zh 模块文件 `src/ux/windows/resizer/classes/resizer-config.ts`，提供尺寸调整器配置相关的定义与实现。
 */

import { MouseButtonEnum } from '../../core';
import { ɵRESIZERS_ARRAY } from '../data';
import { ResizerEnum } from '../enums';
import { ResizeInfo, ResizerConfig } from '../interfaces';


/**
 * Class `ɵResizerConfigModel` encapsulating ɵresizer config model data structures and logic in `src/ux/windows/resizer/classes`.
 * @zh 类 `ɵResizerConfigModel`，封装 `src/ux/windows/resizer/classes` 中的ɵResizer配置模型数据结构与处理逻辑。
 */
export class ɵResizerConfigModel implements ResizerConfig {
    /**
     * Property `targetElement` (`HTMLElement`) storing target element.
     * @zh 属性 `targetElement`（类型：`HTMLElement`），用于存储或配置目标元素。
     */
    public targetElement?: HTMLElement;
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
     * Property `maxWidth` (`number`) storing max width (default: `Infinity`).
     * @zh 属性 `maxWidth`（类型：`number`），用于存储或配置最大值宽度（默认值：`Infinity`）。
     */
    public maxWidth?: number = Infinity;
    /**
     * Property `maxHeight` (`number`) storing max height (default: `Infinity`).
     * @zh 属性 `maxHeight`（类型：`number`），用于存储或配置最大值高度（默认值：`Infinity`）。
     */
    public maxHeight?: number = Infinity;
    /**
     * Property `allowedResizers` (`ResizerEnum[]`) storing allowed resizers (default: `[...ɵRESIZERS_ARRAY]`).
     * @zh 属性 `allowedResizers`（类型：`ResizerEnum[]`），用于存储或配置允许的尺寸调整器（默认值：`[...ɵRESIZERS_ARRAY]`）。
     */
    public allowedResizers?: ResizerEnum[] = [...ɵRESIZERS_ARRAY];
    /**
     * Property `allowedMouseButtons` (`MouseButtonEnum[]`) storing allowed mouse buttons (default: `[MouseButtonEnum.Left]`).
     * @zh 属性 `allowedMouseButtons`（类型：`MouseButtonEnum[]`），用于存储或配置允许的鼠标按钮（默认值：`[MouseButtonEnum.Left]`）。
     */
    public allowedMouseButtons?: MouseButtonEnum[] = [MouseButtonEnum.Left];
    /**
     * Property `xAxisLeftStyleProperty` (`string`) storing x axis left style property (default: `'left'`).
     * @zh 属性 `xAxisLeftStyleProperty`（类型：`string`），用于存储或配置X坐标坐标轴左侧位置样式属性（默认值：`'left'`）。
     */
    public xAxisLeftStyleProperty?: string = 'left';
    /**
     * Property `xAxisRightStyleProperty` (`string`) storing x axis right style property.
     * @zh 属性 `xAxisRightStyleProperty`（类型：`string`），用于存储或配置X坐标坐标轴右侧位置样式属性。
     */
    public xAxisRightStyleProperty?: string;
    /**
     * Property `yAxisTopStyleProperty` (`string`) storing y axis top style property (default: `'top'`).
     * @zh 属性 `yAxisTopStyleProperty`（类型：`string`），用于存储或配置Y坐标坐标轴顶部位置样式属性（默认值：`'top'`）。
     */
    public yAxisTopStyleProperty?: string = 'top';
    /**
     * Property `yAxisBottomStyleProperty` (`string`) storing y axis bottom style property.
     * @zh 属性 `yAxisBottomStyleProperty`（类型：`string`），用于存储或配置Y坐标坐标轴底部位置样式属性。
     */
    public yAxisBottomStyleProperty?: string;
    /**
     * Property `widthStyleProperty` (`string`) storing width style property (default: `'width'`).
     * @zh 属性 `widthStyleProperty`（类型：`string`），用于存储或配置宽度样式属性（默认值：`'width'`）。
     */
    public widthStyleProperty?: string = 'width';
    /**
     * Property `heightStyleProperty` (`string`) storing height style property (default: `'height'`).
     * @zh 属性 `heightStyleProperty`（类型：`string`），用于存储或配置高度样式属性（默认值：`'height'`）。
     */
    public heightStyleProperty?: string = 'height';
    /**
     * Property `isAllowChangePosition` (`boolean`) storing is allow change position (default: `true`).
     * @zh 属性 `isAllowChangePosition`（类型：`boolean`），用于存储或配置是否为允许变更位置（默认值：`true`）。
     */
    public isAllowChangePosition?: boolean = true;
    /**
     * Property `isEnabled` (`boolean`) storing is enabled (default: `true`).
     * @zh 属性 `isEnabled`（类型：`boolean`），用于存储或配置是否为已启用（默认值：`true`）。
     */
    public isEnabled?: boolean = true;
    /**
     * Property `mouseMoveHandler` (`(event: ResizeInfo) => void`) storing mouse move handler.
     * @zh 属性 `mouseMoveHandler`（类型：`(event: ResizeInfo) => void`），用于存储或配置鼠标移动处理器。
     */
    public mouseMoveHandler?: (event: ResizeInfo) => void;
}
