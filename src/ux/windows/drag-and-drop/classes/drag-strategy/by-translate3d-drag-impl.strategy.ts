/**
 * @fileoverview Module `src/ux/windows/drag-and-drop/classes/drag-strategy/by-translate3d-drag-impl.strategy.ts` providing by translate3d drag impl strategy definitions and implementation.
 * @zh 模块文件 `src/ux/windows/drag-and-drop/classes/drag-strategy/by-translate3d-drag-impl.strategy.ts`，提供按translate3d拖拽实现策略相关的定义与实现。
 */


import { ɵPointerHelper } from '../../../core/helpers';
import { ɵDragStrategyEnum } from '../../enums';
import { DragInfo } from '../../interfaces';
import { ɵBaseDragStrategyImpl } from './base-drag-impl.strategy';
import { DragStrategyByTranslate3d } from './by-translate3d-drag.strategy';

/**
 * Class `ɵDragStrategyByTranslate3dImpl` encapsulating ɵdrag strategy by translate3d impl data structures and logic in `src/ux/windows/drag-and-drop/classes/drag-strategy`.
 * @internal
 * @zh 类 `ɵDragStrategyByTranslate3dImpl`，封装 `src/ux/windows/drag-and-drop/classes/drag-strategy` 中的ɵDrag策略按Translate3d实现数据结构与处理逻辑。
 */
export class ɵDragStrategyByTranslate3dImpl extends ɵBaseDragStrategyImpl {
    /**
     * Property `type` (`any`) storing type (default: `ɵDragStrategyEnum.ByTranslate3d`).
     * @zh 属性 `type`（类型：`any`），用于存储或配置类型（默认值：`ɵDragStrategyEnum.ByTranslate3d`）。
     */
    public override readonly type = ɵDragStrategyEnum.ByTranslate3d;

    /**
     * Property `config` (`DragStrategyByTranslate3d`) storing config.
     * @zh 属性 `config`（类型：`DragStrategyByTranslate3d`），用于存储或配置配置。
     */
    protected override config: DragStrategyByTranslate3d;

    /**
     * Property `initialX` (`number`) storing initial x.
     * @zh 属性 `initialX`（类型：`number`），用于存储或配置初始X坐标。
     */
    private initialX: number;
    /**
     * Property `initialY` (`number`) storing initial y.
     * @zh 属性 `initialY`（类型：`number`），用于存储或配置初始Y坐标。
     */
    private initialY: number;

    /**
     * Executes `registerMouseDown` to handle register mouse down.
     * @zh 执行 `registerMouseDown`，用于注册鼠标向下。
     * @param dragInfo - drag info parameter (`DragInfo`) / 拖拽信息参数（`DragInfo`）
     */
    public override registerMouseDown(dragInfo: DragInfo): void {
        this.initInitialCoordinates();
        super.registerMouseDown(dragInfo);
    }

    /**
     * Executes `updateElementPosition` to handle update element position.
     * @zh 执行 `updateElementPosition`，用于更新元素位置。
     * @param event - event parameter (`PointerEvent | TouchEvent`) / 事件参数（`PointerEvent | TouchEvent`）
     */
    public updateElementPosition(event: PointerEvent | TouchEvent): void {
        if (this.context.config.isAllowMoveElement) {
            const x = this.calculateElementPositionX(event);
            const y = this.calculateElementPositionY(event);
            this.context.movableElement.style.transform = `translate3d(${x}, ${y}, 0px)`;
        }
    }

    /**
     * Executes `initInitialCoordinates` to handle init initial coordinates.
     * @zh 执行 `initInitialCoordinates`，用于初始化初始坐标。
     */
    private initInitialCoordinates(): void {
        const computedStyle = window.getComputedStyle(this.context.movableElement);
        const transform = new WebKitCSSMatrix(computedStyle.transform);
        const domRect = this.context.movableElement.getBoundingClientRect();
        this.initialX = (domRect.left - transform.m41);
        this.initialY = (domRect.top - transform.m42);
    }

    /**
     * Executes `calculateElementPositionX` to handle calculate element position x.
     * @zh 执行 `calculateElementPositionX`，用于计算元素位置X坐标。
     * @param event - event parameter (`PointerEvent | TouchEvent`) / 事件参数（`PointerEvent | TouchEvent`）
     * @returns Result of type `string` / 类型为 `string` 的返回值
     */
    private calculateElementPositionX(event: PointerEvent | TouchEvent): string {
        const position = (!this.config.isLockAxisX) ?
            (ɵPointerHelper.getClientX(event) - this.initialX - this.shiftX) : 0;

        return `${position}px`;
    }

    /**
     * Executes `calculateElementPositionY` to handle calculate element position y.
     * @zh 执行 `calculateElementPositionY`，用于计算元素位置Y坐标。
     * @param event - event parameter (`PointerEvent | TouchEvent`) / 事件参数（`PointerEvent | TouchEvent`）
     * @returns Result of type `string` / 类型为 `string` 的返回值
     */
    private calculateElementPositionY(event: PointerEvent | TouchEvent): string {
        const position = (!this.config.isLockAxisY) ?
            (ɵPointerHelper.getClientY(event) - this.initialY - this.shiftY) : 0;

        return `${position}px`;
    }
}
