/**
 * @fileoverview Module `src/ux/windows/resizer/classes/top-left-resizer.ts` providing top left resizer definitions and implementation.
 * @zh 模块文件 `src/ux/windows/resizer/classes/top-left-resizer.ts`，提供顶部位置左侧位置尺寸调整器相关的定义与实现。
 */

import { ɵPointerHelper } from '../../core';
import { ResizerEnum } from '../enums';
import { ɵBaseResizer } from './base-resizer';

/**
 * Class `ɵTopLeftResizer` encapsulating ɵtop left resizer data structures and logic in `src/ux/windows/resizer/classes`.
 * @internal
 * @zh 类 `ɵTopLeftResizer`，封装 `src/ux/windows/resizer/classes` 中的ɵTop左侧位置尺寸调整器数据结构与处理逻辑。
 */
export class ɵTopLeftResizer extends ɵBaseResizer {
    /**
     * Property `id` (`ResizerEnum`) storing id (default: `ResizerEnum.TopLeft`).
     * @zh 属性 `id`（类型：`ResizerEnum`），用于存储或配置唯一标识（默认值：`ResizerEnum.TopLeft`）。
     */
    public static override id = ResizerEnum.TopLeft;

    /**
     * Executes `resizeElement` to handle resize element.
     * @zh 执行 `resizeElement`，用于调整尺寸元素。
     * @param event - event parameter (`PointerEvent | TouchEvent`) / 事件参数（`PointerEvent | TouchEvent`）
     */
    public resizeElement(event: PointerEvent | TouchEvent): void {
        this.processAxisX(event);
        this.processAxisY(event);
    }

    /**
     * Executes `processAxisX` to handle process axis x.
     * @zh 执行 `processAxisX`，用于处理坐标轴X坐标。
     * @param event - event parameter (`PointerEvent | TouchEvent`) / 事件参数（`PointerEvent | TouchEvent`）
     */
    private processAxisX(event: PointerEvent | TouchEvent): void {
        const pageX = ɵPointerHelper.getPageX(event);
        const width = this.originalWidth - (pageX - this.originalMouseX);

        if (width > this.minWidth && width < this.maxWidth) {
            this.resizableElement.style.setProperty(this.config.widthStyleProperty, `${width}px`);

            if (this.config.isAllowChangePosition && this.config.xAxisLeftStyleProperty) {
                const position = `${this.originalX + (pageX - this.originalMouseX)}px`;
                const property = this.config.xAxisLeftStyleProperty;

                this.resizableElement.style.setProperty(property, position);
            }
        }
    }

    /**
     * Executes `processAxisY` to handle process axis y.
     * @zh 执行 `processAxisY`，用于处理坐标轴Y坐标。
     * @param event - event parameter (`PointerEvent | TouchEvent`) / 事件参数（`PointerEvent | TouchEvent`）
     */
    private processAxisY(event: PointerEvent | TouchEvent): void {
        const pageY = ɵPointerHelper.getPageY(event);
        const height = this.originalHeight - (pageY - this.originalMouseY);

        if (height > this.minHeight && height < this.maxHeight) {
            this.resizableElement.style.setProperty(this.config.heightStyleProperty, `${height}px`);

            if (this.config.isAllowChangePosition && this.config.yAxisTopStyleProperty) {
                const position = `${this.originalY + (pageY - this.originalMouseY)}px`;
                const property = this.config.yAxisTopStyleProperty;

                this.resizableElement.style.setProperty(property, position);
            }
        }
    }
}
