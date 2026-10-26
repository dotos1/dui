/**
 * @fileoverview Module `src/ux/windows/drag-and-drop/classes/drag-strategy/base-drag-impl.strategy.ts` providing base drag impl strategy definitions and implementation.
 * @zh 模块文件 `src/ux/windows/drag-and-drop/classes/drag-strategy/base-drag-impl.strategy.ts`，提供基础拖拽实现策略相关的定义与实现。
 */


import { ɵIsNil, ɵPointerHelper } from '../../../core/helpers';
import { DraggableDirective } from '../../directives/draggable.directive';
import { ɵDragStrategyEnum } from '../../enums';
import { DragInfo } from '../../interfaces';
import { DragStrategyType } from '../../types';

/**
 * Class `ɵBaseDragStrategyImpl` encapsulating ɵbase drag strategy impl data structures and logic in `src/ux/windows/drag-and-drop/classes/drag-strategy`.
 * @internal
 * @zh 类 `ɵBaseDragStrategyImpl`，封装 `src/ux/windows/drag-and-drop/classes/drag-strategy` 中的ɵBase拖拽策略实现数据结构与处理逻辑。
 */
export abstract class ɵBaseDragStrategyImpl {
    /**
     * Property `type` (`ɵDragStrategyEnum`) storing type.
     * @zh 属性 `type`（类型：`ɵDragStrategyEnum`），用于存储或配置类型。
     */
    public readonly type: ɵDragStrategyEnum;

    /**
     * Property `mouseDownEvent` (`PointerEvent | TouchEvent`) storing mouse down event.
     * @zh 属性 `mouseDownEvent`（类型：`PointerEvent | TouchEvent`），用于存储或配置鼠标向下事件。
     */
    protected mouseDownEvent: PointerEvent | TouchEvent;
    /**
     * Property `shiftX` (`number`) storing shift x.
     * @zh 属性 `shiftX`（类型：`number`），用于存储或配置移出首项X坐标。
     */
    protected shiftX: number;
    /**
     * Property `shiftY` (`number`) storing shift y.
     * @zh 属性 `shiftY`（类型：`number`），用于存储或配置移出首项Y坐标。
     */
    protected shiftY: number;
    /**
     * Property `config` (`DragStrategyType`) storing config.
     * @zh 属性 `config`（类型：`DragStrategyType`），用于存储或配置配置。
     */
    protected config: DragStrategyType;

    /**
     * Creates an instance of `ɵBaseDragStrategyImpl` and initializes its dependencies and internal state.
     * @zh 创建 `ɵBaseDragStrategyImpl` 实例，并初始化其依赖项与内部状态。
     * @param context - Injected or initial context (`DraggableDirective`) / 注入或传入的上下文（`DraggableDirective`）
     */
    constructor(
        protected readonly context: DraggableDirective
    ) {
        this.config = this.context.config.strategy;
    }

    /**
     * Executes `registerMouseDown` to handle register mouse down.
     * @zh 执行 `registerMouseDown`，用于注册鼠标向下。
     * @param { originalEvent: mouseEvent, m... - { original event: mouse event, m parameter (`DragInfo`) / {原始Event:鼠标Event,m参数（`DragInfo`）
     */
    public registerMouseDown({ originalEvent: mouseEvent, movableElement }: DragInfo): void {
        const elementDomRect = movableElement.getBoundingClientRect();
        this.mouseDownEvent = mouseEvent;

        this.setShiftX(mouseEvent, elementDomRect);
        this.setShiftY(mouseEvent, elementDomRect);
    }

    /**
     * Executes `setShiftX` to handle set shift x.
     * @zh 执行 `setShiftX`，用于集合移出首项X坐标。
     * @param event - event parameter (`PointerEvent | TouchEvent`) / 事件参数（`PointerEvent | TouchEvent`）
     * @param elementDomRect - element dom rect parameter (`DOMRect`) / 元素DOM节点矩形参数（`DOMRect`）
     */
    private setShiftX(event: PointerEvent | TouchEvent, elementDomRect: DOMRect): void {
        if (!ɵIsNil(this.context.config.shiftX)) {
            this.shiftX = this.context.config.shiftX;
        } else {
            this.shiftX = ɵPointerHelper.getClientX(event) - elementDomRect.left + scrollX;
        }
    }

    /**
     * Executes `setShiftY` to handle set shift y.
     * @zh 执行 `setShiftY`，用于集合移出首项Y坐标。
     * @param event - event parameter (`PointerEvent | TouchEvent`) / 事件参数（`PointerEvent | TouchEvent`）
     * @param elementDomRect - element dom rect parameter (`DOMRect`) / 元素DOM节点矩形参数（`DOMRect`）
     */
    private setShiftY(event: PointerEvent | TouchEvent, elementDomRect: DOMRect): void {
        if (!ɵIsNil(this.context.config.shiftY)) {
            this.shiftY = this.context.config.shiftY;
        } else {
            this.shiftY = ɵPointerHelper.getClientY(event) - elementDomRect.top + scrollY;
        }
    }

    /**
     * Executes `updateElementPosition` to handle update element position.
     * @zh 执行 `updateElementPosition`，用于更新元素位置。
     * @param event - event parameter (`PointerEvent | TouchEvent`) / 事件参数（`PointerEvent | TouchEvent`）
     */
    public abstract updateElementPosition(event: PointerEvent | TouchEvent): void;
}
