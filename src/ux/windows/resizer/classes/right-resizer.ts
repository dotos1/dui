/**
 * @fileoverview Module `src/ux/windows/resizer/classes/right-resizer.ts` providing right resizer definitions and implementation.
 * @zh 模块文件 `src/ux/windows/resizer/classes/right-resizer.ts`，提供右侧位置尺寸调整器相关的定义与实现。
 */

import { ɵPointerHelper } from '../../core';
import { ResizerEnum } from '../enums';
import { ɵBaseResizer } from './base-resizer';


/**
 * Class `ɵRightResizer` encapsulating ɵright resizer data structures and logic in `src/ux/windows/resizer/classes`.
 * @zh 类 `ɵRightResizer`，封装 `src/ux/windows/resizer/classes` 中的ɵRight尺寸调整器数据结构与处理逻辑。
 */
export class ɵRightResizer extends ɵBaseResizer {
    /**
     * Property `id` (`any`) storing id (default: `ResizerEnum.Right`).
     * @zh 属性 `id`（类型：`any`），用于存储或配置唯一标识（默认值：`ResizerEnum.Right`）。
     */
    public static override id = ResizerEnum.Right;

    /**
     * Executes `resizeElement` to handle resize element.
     * @zh 执行 `resizeElement`，用于调整尺寸元素。
     * @param event - event parameter (`PointerEvent | TouchEvent`) / 事件参数（`PointerEvent | TouchEvent`）
     */
    public resizeElement(event: PointerEvent | TouchEvent): void {
        const pageX = ɵPointerHelper.getPageX(event);
        const width = this.originalWidth + (pageX - this.originalMouseX);

        if (width > this.minWidth && width < this.maxWidth) {
            this.resizableElement.style.setProperty(this.config.widthStyleProperty, `${width}px`);
        }
    }
}
