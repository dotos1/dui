/**
 * @fileoverview Module `src/container/dock-layout/utils/drag-listener.ts` providing drag listener definitions and implementation.
 * @zh 模块文件 `src/container/dock-layout/utils/drag-listener.ts`，提供拖拽监听器相关的定义与实现。
 */

import { DomConstants } from './dom-constants';
import { EventEmitter } from './event-emitter';

/**
 * Class `DragListener` encapsulating drag listener data structures and logic in `src/container/dock-layout/utils`.
 * @internal
 * @zh 类 `DragListener`，封装 `src/container/dock-layout/utils` 中的拖拽监听器数据结构与处理逻辑。
 */
export class DragListener extends EventEmitter {
    /**
     * Property `_timeout` (`ReturnType<typeof setTimeout> | undefined`) storing timeout.
     * @zh 属性 `_timeout`（类型：`ReturnType<typeof setTimeout> | undefined`），用于存储或配置延时器。
     */
    private _timeout: ReturnType<typeof setTimeout> | undefined;
    /**
     * Property `_allowableTargets` (`HTMLElement[]`) storing allowable targets.
     * @zh 属性 `_allowableTargets`（类型：`HTMLElement[]`），用于存储或配置allowable目标。
     */
    private _allowableTargets: HTMLElement[];
    /**
     * Property `_oDocument` (`Document`) storing o document.
     * @zh 属性 `_oDocument`（类型：`Document`），用于存储或配置o文档对象。
     */
    private _oDocument: Document;
    /**
     * Property `_eBody` (`HTMLElement`) storing e body.
     * @zh 属性 `_eBody`（类型：`HTMLElement`），用于存储或配置e主体。
     */
    private _eBody: HTMLElement;
    /**
     * Property `_nDelay` (`number`) storing n delay.
     * @zh 属性 `_nDelay`（类型：`number`），用于存储或配置n延迟。
     */
    private _nDelay: number;
    /**
     * Property `_nDistance` (`number`) storing n distance.
     * @zh 属性 `_nDistance`（类型：`number`），用于存储或配置n距离。
     */
    private _nDistance: number;
    /**
     * Property `_nX` (`number`) storing n x.
     * @zh 属性 `_nX`（类型：`number`），用于存储或配置nX坐标。
     */
    private _nX: number;
    /**
     * Property `_nY` (`number`) storing n y.
     * @zh 属性 `_nY`（类型：`number`），用于存储或配置nY坐标。
     */
    private _nY: number;
    /**
     * Property `_nOriginalX` (`number`) storing n original x.
     * @zh 属性 `_nOriginalX`（类型：`number`），用于存储或配置n原始X坐标。
     */
    private _nOriginalX: number;
    /**
     * Property `_nOriginalY` (`number`) storing n original y.
     * @zh 属性 `_nOriginalY`（类型：`number`），用于存储或配置n原始Y坐标。
     */
    private _nOriginalY: number;
    /**
     * Property `_dragging` (`boolean`) storing dragging.
     * @zh 属性 `_dragging`（类型：`boolean`），用于存储或配置拖拽中。
     */
    private _dragging: boolean;
    /**
     * Property `_pointerTracking` (`boolean`) storing pointer tracking (default: `false`).
     * @zh 属性 `_pointerTracking`（类型：`boolean`），用于存储或配置指针Tracking（默认值：`false`）。
     */
    private _pointerTracking = false;

    /**
     * Property `_pointerDownEventListener` (`any`) storing pointer down event listener.
     * @zh 属性 `_pointerDownEventListener`（类型：`any`），用于存储或配置指针向下事件监听器。
     */
    private _pointerDownEventListener = (ev: PointerEvent) => this.onPointerDown(ev);
    /**
     * Property `_pointerMoveEventListener` (`any`) storing pointer move event listener.
     * @zh 属性 `_pointerMoveEventListener`（类型：`any`），用于存储或配置指针移动事件监听器。
     */
    private _pointerMoveEventListener = (ev: PointerEvent) => this.onPointerMove(ev);
    /**
     * Property `_pointerUpEventListener` (`any`) storing pointer up event listener.
     * @zh 属性 `_pointerUpEventListener`（类型：`any`），用于存储或配置指针向上事件监听器。
     */
    private _pointerUpEventListener = (ev: PointerEvent) => this.onPointerUp(ev);

    /**
     * Creates an instance of `DragListener` and initializes its dependencies and internal state.
     * @zh 创建 `DragListener` 实例，并初始化其依赖项与内部状态。
     * @param _eElement - Injected or initial e element (`HTMLElement`) / 注入或传入的e元素（`HTMLElement`）
     * @param extraAllowableChildTargets - Injected or initial extra allowable child targets (`HTMLElement[]`) / 注入或传入的extraAllowable子级目标（`HTMLElement[]`）
     */
    constructor(private _eElement: HTMLElement, extraAllowableChildTargets: HTMLElement[]) {
        super();

        this._timeout = undefined;

        this._allowableTargets = [_eElement, ...extraAllowableChildTargets];
        this._oDocument = document;
        this._eBody = document.body;

        /**
         * The delay after which to start the drag in milliseconds
         * Do NOT make too short (previous value of 200 was not long enough for my touchpad)
         * Should generally rely on the mouse move to start drag.  Not this delay.
         */
        this._nDelay = 1800;

        /**
         * The distance the mouse needs to be moved to qualify as a drag
         * Previous comment: works better with delay only
         * ???
         * Probably somehow needs tuning for different devices
         */
        this._nDistance = 10;

        this._nX = 0;
        this._nY = 0;

        this._nOriginalX = 0;
        this._nOriginalY = 0;

        this._dragging = false;

        this._eElement.addEventListener('pointerdown', this._pointerDownEventListener, { passive: true });
    }

    /**
     * Executes `destroy` to handle destroy.
     * @zh 执行 `destroy`，用于销毁。
     */
    destroy(): void {
        this.checkRemovePointerTrackingEventListeners();

        this._eElement.removeEventListener('pointerdown', this._pointerDownEventListener);
    }

    /**
     * Executes `cancelDrag` to handle cancel drag.
     * @zh 执行 `cancelDrag`，用于取消拖拽。
     */
    cancelDrag(): void {
        this.processDragStop(undefined);
    }

    /**
     * Executes `onPointerDown` to handle on pointer down.
     * @zh 执行 `onPointerDown`，用于当指针向下。
     * @param oEvent - o event parameter (`PointerEvent`) / o事件参数（`PointerEvent`）
     */
    private onPointerDown(oEvent: PointerEvent) {
        if (this._allowableTargets.includes(oEvent.target as HTMLElement) && oEvent.isPrimary) {
            const coordinates = this.getPointerCoordinates(oEvent);
            this.processPointerDown(coordinates);
        }
    }

    /**
     * Executes `processPointerDown` to handle process pointer down.
     * @zh 执行 `processPointerDown`，用于处理指针向下。
     * @param coordinates - coordinates parameter (`DragListener.PointerCoordinates`) / 坐标参数（`DragListener.PointerCoordinates`）
     */
    private processPointerDown(coordinates: DragListener.PointerCoordinates) {
        this._nOriginalX = coordinates.x;
        this._nOriginalY = coordinates.y;

        this._oDocument.addEventListener('pointermove', this._pointerMoveEventListener);
        this._oDocument.addEventListener('pointerup', this._pointerUpEventListener, { passive: true });
        this._pointerTracking = true;

        this._timeout = setTimeout(
            () => {
                try {
                    this.startDrag()
                }
                catch (err) {
                    console.error(err);
                    throw err;
                }
            }
            , this._nDelay);
    }

    /**
     * Executes `onPointerMove` to handle on pointer move.
     * @zh 执行 `onPointerMove`，用于当指针移动。
     * @param oEvent - o event parameter (`PointerEvent`) / o事件参数（`PointerEvent`）
     */
    private onPointerMove(oEvent: PointerEvent) {
        if (this._pointerTracking) {
            this.processDragMove(oEvent);
            oEvent.preventDefault();
        }
    }

    /**
     * Executes `processDragMove` to handle process drag move.
     * @zh 执行 `processDragMove`，用于处理拖拽移动。
     * @param dragEvent - drag event parameter (`PointerEvent`) / 拖拽事件参数（`PointerEvent`）
     */
    private processDragMove(dragEvent: PointerEvent) {
        this._nX = dragEvent.pageX - this._nOriginalX;
        this._nY = dragEvent.pageY - this._nOriginalY;

        if (this._dragging === false) {
            if (
                Math.abs(this._nX) > this._nDistance ||
                Math.abs(this._nY) > this._nDistance
            ) {
                this.startDrag();
            }
        }

        if (this._dragging) {
            this.emit('drag', this._nX, this._nY, dragEvent);
        }
    }

    /**
     * Executes `onPointerUp` to handle on pointer up.
     * @zh 执行 `onPointerUp`，用于当指针向上。
     * @param oEvent - o event parameter (`PointerEvent`) / o事件参数（`PointerEvent`）
     */
    private onPointerUp(oEvent: PointerEvent) {
        this.processDragStop(oEvent);
    }

    /**
     * Executes `processDragStop` to handle process drag stop.
     * @zh 执行 `processDragStop`，用于处理拖拽停止。
     * @param dragEvent - drag event parameter (`PointerEvent`) / 拖拽事件参数（`PointerEvent`）
     */
    private processDragStop(dragEvent?: PointerEvent) {
        if (this._timeout !== undefined) {
            clearTimeout(this._timeout);
            this._timeout = undefined;
        }

        this.checkRemovePointerTrackingEventListeners();
    
        if (this._dragging === true) {
            this._eBody.classList.remove(DomConstants.ClassName.Dragging);
            this._eElement.classList.remove(DomConstants.ClassName.Dragging);
            this._oDocument.querySelector('iframe')?.style.setProperty('pointer-events', '');
            this._dragging = false;
            this.emit('dragStop', dragEvent);
        }
    }

    /**
     * Executes `checkRemovePointerTrackingEventListeners` to handle check remove pointer tracking event listeners.
     * @zh 执行 `checkRemovePointerTrackingEventListeners`，用于检查移除指针Tracking事件监听器列表。
     */
    private checkRemovePointerTrackingEventListeners(): void {
        if (this._pointerTracking) {
            this._oDocument.removeEventListener('pointermove', this._pointerMoveEventListener);
            this._oDocument.removeEventListener('pointerup', this._pointerUpEventListener);
            this._pointerTracking = false;
        }    
    }

    /**
     * Executes `startDrag` to handle start drag.
     * @zh 执行 `startDrag`，用于开始拖拽。
     */
    private startDrag() {
        if (this._timeout !== undefined) {
            clearTimeout(this._timeout);
            this._timeout = undefined;
        }
        this._dragging = true;
        this._eBody.classList.add(DomConstants.ClassName.Dragging);
        this._eElement.classList.add(DomConstants.ClassName.Dragging);
        this._oDocument.querySelector('iframe')?.style.setProperty('pointer-events', 'none');
        this.emit('dragStart', this._nOriginalX, this._nOriginalY);
    }

    /**
     * Executes `getPointerCoordinates` to handle get pointer coordinates.
     * @zh 执行 `getPointerCoordinates`，用于获取指针坐标。
     * @param event - event parameter (`PointerEvent`) / 事件参数（`PointerEvent`）
     */
    private getPointerCoordinates(event: PointerEvent) {
        const result: DragListener.PointerCoordinates = {
            x: event.pageX,
            y: event.pageY
        };
        return result;
    }

}

/** @internal */
export namespace DragListener {
    /**
     * Interface `PointerCoordinates` defining the contract and properties for pointer coordinates.
     * @zh 接口 `PointerCoordinates`，定义指针坐标的数据结构契约与属性规范。
     */
    export interface PointerCoordinates {
        /**
         * Property `x` (`number`) storing x.
         * @zh 属性 `x`（类型：`number`），用于存储或配置X坐标。
         */
        x: number,
        /**
         * Property `y` (`number`) storing y.
         * @zh 属性 `y`（类型：`number`），用于存储或配置Y坐标。
         */
        y: number,
    }
}