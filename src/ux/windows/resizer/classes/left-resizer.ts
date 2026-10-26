/**
 * @fileoverview Module `src/ux/windows/resizer/classes/left-resizer.ts` providing left resizer definitions and implementation.
 * @zh 模块文件 `src/ux/windows/resizer/classes/left-resizer.ts`，提供左侧位置尺寸调整器相关的定义与实现。
 */

import { ɵPointerHelper } from '../../core';
import { ResizerEnum } from '../enums';
import { ɵBaseResizer } from './base-resizer';

/**
 * Class `ɵLeftResizer` encapsulating ɵleft resizer data structures and logic in `src/ux/windows/resizer/classes`.
 * @internal
 * @zh 类 `ɵLeftResizer`，封装 `src/ux/windows/resizer/classes` 中的ɵLeft尺寸调整器数据结构与处理逻辑。
 */
export class ɵLeftResizer extends ɵBaseResizer {
    /**
     * Property `id` (`any`) storing id (default: `ResizerEnum.Left`).
     * @zh 属性 `id`（类型：`any`），用于存储或配置唯一标识（默认值：`ResizerEnum.Left`）。
     */
    public static override id = ResizerEnum.Left;

    /**
     * Executes `resizeElement` to handle resize element.
     * @zh 执行 `resizeElement`，用于调整尺寸元素。
     * @param event - event parameter (`PointerEvent | TouchEvent`) / 事件参数（`PointerEvent | TouchEvent`）
     */
    public resizeElement(event: PointerEvent | TouchEvent): void {
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
}
