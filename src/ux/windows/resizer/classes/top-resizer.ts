/**
 * @fileoverview Module `src/ux/windows/resizer/classes/top-resizer.ts` providing top resizer definitions and implementation.
 * @zh 模块文件 `src/ux/windows/resizer/classes/top-resizer.ts`，提供顶部位置尺寸调整器相关的定义与实现。
 */

import { ɵPointerHelper } from '../../core';
import { ResizerEnum } from '../enums';
import { ɵBaseResizer } from './base-resizer';

/**
 * Class `ɵTopResizer` encapsulating ɵtop resizer data structures and logic in `src/ux/windows/resizer/classes`.
 * @internal
 * @zh 类 `ɵTopResizer`，封装 `src/ux/windows/resizer/classes` 中的ɵTop尺寸调整器数据结构与处理逻辑。
 */
export class ɵTopResizer extends ɵBaseResizer {
    /**
     * Property `id` (`any`) storing id (default: `ResizerEnum.Top`).
     * @zh 属性 `id`（类型：`any`），用于存储或配置唯一标识（默认值：`ResizerEnum.Top`）。
     */
    public static override id = ResizerEnum.Top;

    /**
     * Executes `resizeElement` to handle resize element.
     * @zh 执行 `resizeElement`，用于调整尺寸元素。
     * @param event - event parameter (`PointerEvent | TouchEvent`) / 事件参数（`PointerEvent | TouchEvent`）
     */
    public resizeElement(event: PointerEvent | TouchEvent): void {
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
