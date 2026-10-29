/**
 * @fileoverview Module `src/ux/windows/drag-and-drop/classes/drag-strategy/by-axis-properties-drag-impl.strategy.ts` providing by axis properties drag impl strategy definitions and implementation.
 * @zh 模块文件 `src/ux/windows/drag-and-drop/classes/drag-strategy/by-axis-properties-drag-impl.strategy.ts`，提供按坐标轴属性列表拖拽实现策略相关的定义与实现。
 */


import { ɵPointerHelper } from '../../../core/helpers/pointer.helper';
import { ɵDragStrategyEnum } from '../../enums';
import { ɵBaseDragStrategyImpl } from './base-drag-impl.strategy';
import { DragStrategyByAxisProperties } from './by-axis-properties-drag.strategy';

/**
 * Class `ɵDragStrategyByAxisPropertiesImpl` encapsulating ɵdrag strategy by axis properties impl data structures and logic in `src/ux/windows/drag-and-drop/classes/drag-strategy`.
 * @internal
 * @zh 类 `ɵDragStrategyByAxisPropertiesImpl`，封装 `src/ux/windows/drag-and-drop/classes/drag-strategy` 中的ɵDrag策略按坐标轴属性列表实现数据结构与处理逻辑。
 */
export class ɵDragStrategyByAxisPropertiesImpl extends ɵBaseDragStrategyImpl {
    /**
     * Property `type` (`ɵDragStrategyEnum.ByAxisProperties`) storing type (default: `ɵDragStrategyEnum.ByAxisProperties`).
     * @zh 属性 `type`（类型：`ɵDragStrategyEnum.ByAxisProperties`），用于存储或配置类型（默认值：`ɵDragStrategyEnum.ByAxisProperties`）。
     */
    public override readonly  type = ɵDragStrategyEnum.ByAxisProperties;

    /**
     * Executes `updateElementPosition` to handle update element position.
     * @zh 执行 `updateElementPosition`，用于更新元素位置。
     * @param event - event parameter (`PointerEvent | TouchEvent`) / 事件参数（`PointerEvent | TouchEvent`）
     */
    public updateElementPosition(event: PointerEvent | TouchEvent): void {
        if (this.context.config.isAllowMoveElement) {
            const strategyConfig = this.context.config.strategy as DragStrategyByAxisProperties;

            this.context.movableElement.style.setProperty(
                strategyConfig.xAxisLeftStyleProperty,
                `${ɵPointerHelper.getClientX(event) - this.shiftX}px`
            );

            this.context.movableElement.style.setProperty(
                strategyConfig.yAxisTopStyleProperty,
                `${ɵPointerHelper.getClientY(event) - this.shiftY}px`
            );
        }
    }
}
