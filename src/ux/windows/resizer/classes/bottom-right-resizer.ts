/**
 * @fileoverview Module `src/ux/windows/resizer/classes/bottom-right-resizer.ts` providing bottom right resizer definitions and implementation.
 * @zh 模块文件 `src/ux/windows/resizer/classes/bottom-right-resizer.ts`，提供底部位置右侧位置尺寸调整器相关的定义与实现。
 */

import { ɵPointerHelper } from '../../core';
import { ResizerEnum } from '../enums';
import { ɵBaseResizer } from './base-resizer';


/**
 * Class `ɵBottomRightResizer` encapsulating ɵbottom right resizer data structures and logic in `src/ux/windows/resizer/classes`.
 * @zh 类 `ɵBottomRightResizer`，封装 `src/ux/windows/resizer/classes` 中的ɵBottom右侧位置尺寸调整器数据结构与处理逻辑。
 */
export class ɵBottomRightResizer extends ɵBaseResizer {
    /**
     * Property `id` (`any`) storing id (default: `ResizerEnum.BottomRight`).
     * @zh 属性 `id`（类型：`any`），用于存储或配置唯一标识（默认值：`ResizerEnum.BottomRight`）。
     */
    public static override id = ResizerEnum.BottomRight;

    /**
     * Executes `resizeElement` to handle resize element.
     * @zh 执行 `resizeElement`，用于调整尺寸元素。
     * @param event - event parameter (`PointerEvent`) / 事件参数（`PointerEvent`）
     */
    public resizeElement(event: PointerEvent): void {
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
        const clientX = ɵPointerHelper.getClientX(event);
        const width = this.originalWidth + (pageX - this.originalMouseX);

        if (width > this.minWidth && width < this.maxWidth) {
            this.resizableElement.style.setProperty(this.config.widthStyleProperty, `${width}px`);

            if (this.config.isAllowChangePosition && this.config.xAxisRightStyleProperty) {
                const position = `${(this.documentElement.clientWidth - clientX)}px`;
                const property = this.config.xAxisRightStyleProperty;

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
        const clientY = ɵPointerHelper.getClientY(event);
        const height = this.originalHeight + (pageY - this.originalMouseY);

        if (height > this.minHeight && height < this.maxHeight) {
            this.resizableElement.style.setProperty(this.config.heightStyleProperty, `${height}px`);

            if (this.config.isAllowChangePosition && this.config.yAxisBottomStyleProperty) {
                const position = `${(this.documentElement.clientHeight - clientY)}px`;
                const property = this.config.yAxisBottomStyleProperty;

                this.resizableElement.style.setProperty(property, position);
            }
        }
    }
}
