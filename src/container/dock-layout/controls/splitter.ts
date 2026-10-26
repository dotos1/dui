/**
 * @fileoverview Module `src/container/dock-layout/controls/splitter.ts` providing splitter definitions and implementation.
 * @zh 模块文件 `src/container/dock-layout/controls/splitter.ts`，提供分割条相关的定义与实现。
 */

import { DomConstants } from '../utils/dom-constants';
import { DragListener } from '../utils/drag-listener';
import { EventEmitter } from '../utils/event-emitter';
import { numberToPixels } from '../utils/utils';

/**
 * Class `Splitter` encapsulating splitter data structures and logic in `src/container/dock-layout/controls`.
 * @internal
 * @zh 类 `Splitter`，封装 `src/container/dock-layout/controls` 中的分割条数据结构与处理逻辑。
 */
export class Splitter {
    /**
     * Property `_grabSize` (`any`) storing grab size.
     * @zh 属性 `_grabSize`（类型：`any`），用于存储或配置grab尺寸。
     */
    private _grabSize;
    /**
     * Property `_dragListener` (`DragListener`) storing drag listener.
     * @zh 属性 `_dragListener`（类型：`DragListener`），用于存储或配置拖拽监听器。
     */
    private _dragListener: DragListener;

    /**
     * Property `_element` (`HTMLDivElement`) storing element.
     * @zh 属性 `_element`（类型：`HTMLDivElement`），用于存储或配置元素。
     */
    private readonly _element: HTMLDivElement;

    /**
     * Gets the current element (`element: HTMLDivElement`).
     * @zh 获取当前元素（`element: HTMLDivElement`）。
     */
    get element(): HTMLDivElement { return this._element; }

    /**
     * Creates an instance of `Splitter` and initializes its dependencies and internal state.
     * @zh 创建 `Splitter` 实例，并初始化其依赖项与内部状态。
     * @param _isVertical - Injected or initial is vertical (`boolean`) / 注入或传入的是否为垂直（`boolean`）
     * @param _size - Injected or initial size (`number`) / 注入或传入的尺寸（`number`）
     * @param grabSize - Injected or initial grab size (`number`) / 注入或传入的grab尺寸（`number`）
     */
    constructor(private _isVertical: boolean, private _size: number, grabSize: number) {
        this._grabSize = grabSize < this._size ? this._size : grabSize;

        this._element = document.createElement('div');
        this._element.classList.add(DomConstants.ClassName.Splitter);
        const dragHandleElement = document.createElement('div');
        dragHandleElement.classList.add(DomConstants.ClassName.DragHandle);

        const handleExcessSize = this._grabSize - this._size;
        const handleExcessPos = handleExcessSize / 2;

        if (this._isVertical) {
            dragHandleElement.style.top = numberToPixels(-handleExcessPos);
            dragHandleElement.style.height = numberToPixels(this._size + handleExcessSize);
            this._element.classList.add(DomConstants.ClassName.Vertical);
            this._element.style.height = numberToPixels(this._size);
        } else {
            dragHandleElement.style.left = numberToPixels(-handleExcessPos);
            dragHandleElement.style.width = numberToPixels(this._size + handleExcessSize);
            this._element.classList.add(DomConstants.ClassName.Horizontal);
            this._element.style.width = numberToPixels(this._size);
        }

        this._element.appendChild(dragHandleElement);

        this._dragListener = new DragListener(this._element, [dragHandleElement]);
    }

    /**
     * Executes `destroy` to handle destroy.
     * @zh 执行 `destroy`，用于销毁。
     */
    destroy(): void {
        this._element.remove();
    }

    /**
     * Executes `on` to handle on.
     * @zh 执行 `on`，用于当。
     * @param eventName - event name parameter (`K`) / 事件名称参数（`K`）
     * @param callback - callback parameter (`EventEmitter.Callback<K>`) / 回调函数参数（`EventEmitter.Callback<K>`）
     */
    on<K extends keyof EventEmitter.EventParamsMap>(eventName: K, callback: EventEmitter.Callback<K>): void {
        this._dragListener.on<K>(eventName, callback);
    }
}
