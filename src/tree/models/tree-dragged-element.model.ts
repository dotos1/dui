/**
 * @fileoverview Module `src/tree/models/tree-dragged-element.model.ts` providing Signal-backed dragged element state for tree drag-and-drop.
 * @zh 模块文件 `src/tree/models/tree-dragged-element.model.ts`，提供基于原生 Angular Signal 的树节点拖拽元素状态服务。
 */

import { computed, Injectable, signal } from '@angular/core';

/**
 * Injectable Angular service `TreeDraggedElement` managing tree dragged element state via Signals in `src/tree/models`.
 * @zh 可注入的 Angular 服务 `TreeDraggedElement`，通过原生 Signal 管理 `src/tree/models` 中的树拖拽元素状态。
 */
@Injectable({
  providedIn: 'root',
})
export class TreeDraggedElement {
  // 私有 Signal 存储当前正在拖拽的节点或自定义载荷
  private readonly _draggedElementSig = signal<unknown>(null);
  // 派生是否处于拖拽态的 computed Signal
  private readonly _isDraggingSig = computed<boolean>(() => Boolean(this._draggedElementSig()));

  /**
   * Gets the current `_draggedElement` (`unknown`).
   * @zh 获取当前拖拽元素（`unknown`）。
   */
  get _draggedElement(): unknown {
    return this._draggedElementSig();
  }

  /**
   * Sets the `_draggedElement` (`_draggedElement`).
   * @zh 设置当前拖拽元素（`_draggedElement`）。
   * @param value - New dragged element value (`unknown`) / 新的拖拽元素值（`unknown`）
   */
  set _draggedElement(value: unknown) {
    this._draggedElementSig.set(value);
  }

  /**
   * Executes `set` to update the currently dragged element.
   * @zh 执行 `set`，更新当前拖拽元素状态。
   * @param draggedElement - dragged element parameter (`unknown`) / 拖拽元素参数（`unknown`）
   */
  set(draggedElement: unknown): void {
    this._draggedElementSig.set(draggedElement);
  }

  /**
   * Executes `get` to retrieve the currently dragged element.
   * @zh 执行 `get`，读取当前拖拽元素状态。
   * @returns Result of type `unknown` / 类型为 `unknown` 的返回值
   */
  get(): unknown {
    return this._draggedElementSig();
  }

  /**
   * Executes `isDragging` to check whether a drag operation is active.
   * @zh 执行 `isDragging`，检查当前是否处于拖拽状态。
   * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
   */
  isDragging(): boolean {
    return this._isDraggingSig();
  }
}
