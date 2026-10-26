/**
 * @fileoverview Module `src/ux/windows/drag-and-drop/interfaces/drag-info.interface.ts` providing drag info interface definitions and implementation.
 * @zh 模块文件 `src/ux/windows/drag-and-drop/interfaces/drag-info.interface.ts`，提供拖拽信息interface相关的定义与实现。
 */


/**
 * Interface `DragInfo` defining the contract and properties for drag info.
 * @zh 接口 `DragInfo`，定义拖拽信息的数据结构契约与属性规范。
 */
export interface DragInfo {
    /**
     * Target movable HTML element. Useful to read properties about current position and size
     * @zh 属性 `movableElement`（类型：`HTMLElement`），用于存储或配置是否可移动元素。
     */
    movableElement: HTMLElement;
    /**
     * Original mouse event from movable HTML element
     * @zh 属性 `originalEvent`（类型：`PointerEvent | TouchEvent`），用于存储或配置原始事件。
     */
    originalEvent: PointerEvent | TouchEvent;
}
