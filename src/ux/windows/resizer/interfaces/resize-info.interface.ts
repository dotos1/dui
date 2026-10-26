/**
 * Model that emits by events of {@link DraggableDirective}
 * @zh 接口 `ResizeInfo`，定义调整尺寸信息的数据结构契约与属性规范。
 */
export interface ResizeInfo {
    /**
     * Target resizable HTML element. Useful to read properties about current position and size
     * @zh 属性 `resizableElement`（类型：`HTMLElement`），用于存储或配置是否可调尺寸元素。
     */
    resizableElement: HTMLElement;
    /**
     * Original mouse event from movable HTML element
     * @zh 属性 `originalEvent`（类型：`PointerEvent | TouchEvent`），用于存储或配置原始事件。
     */
    originalEvent: PointerEvent | TouchEvent;
}
