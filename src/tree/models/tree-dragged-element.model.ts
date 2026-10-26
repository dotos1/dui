/**
 * @fileoverview Module `src/tree/models/tree-dragged-element.model.ts` providing tree dragged element model definitions and implementation.
 * @zh 模块文件 `src/tree/models/tree-dragged-element.model.ts`，提供树形控件dragged元素模型相关的定义与实现。
 */

import { Injectable } from '@angular/core';

/**
 * Injectable Angular service `TreeDraggedElement` managing tree dragged element state and operations in `src/tree/models`.
 * @zh 可注入的 Angular 服务 `TreeDraggedElement`，管理 `src/tree/models` 中的树形控件Dragged元素状态与业务操作。
 */
@Injectable({
  providedIn: 'root'
})
export class TreeDraggedElement {
  /**
   * Property `_draggedElement` (`any`) storing dragged element (default: `null`).
   * @zh 属性 `_draggedElement`（类型：`any`），用于存储或配置dragged元素（默认值：`null`）。
   */
  _draggedElement = null;

  /**
   * Executes `set` to handle set.
   * @zh 执行 `set`，用于集合。
   * @param draggedElement - dragged element parameter (`any`) / dragged元素参数（`any`）
   */
  set(draggedElement) {
    this._draggedElement = draggedElement;
  }

  /**
   * Executes `get` to handle get.
   * @zh 执行 `get`，用于获取。
   * @returns Result of type `any` / 类型为 `any` 的返回值
   */
  get() {
    return this._draggedElement;
  }

  /**
   * Executes `isDragging` to handle is dragging.
   * @zh 执行 `isDragging`，用于是否为拖拽中。
   */
  isDragging() {
    return !!this.get();
  }
}
