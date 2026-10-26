/**
 * @fileoverview Module `src/tree/components/tree-node-drop-slot.component.ts` providing tree node drop slot component definitions and implementation.
 * @zh 模块文件 `src/tree/components/tree-node-drop-slot.component.ts`，提供树形控件节点放置slot组件相关的定义与实现。
 */

import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { TreeNode } from '../models/tree-node.model';

/**
 * Angular component `TreeNodeDropSlot` (selector: 'TreeNodeDropSlot, tree-node-drop-slot') providing tree node drop slot presentation and interaction in `src/tree/components`.
 * @zh Angular 组件 `TreeNodeDropSlot`（selector: 'TreeNodeDropSlot, tree-node-drop-slot'），提供树形控件节点放置Slot的视图渲染与交互逻辑（位于 `src/tree/components`）。
 */
@Component({
  selector: 'TreeNodeDropSlot, tree-node-drop-slot',
  encapsulation: ViewEncapsulation.None,
     changeDetection: ChangeDetectionStrategy.OnPush, 
  styles: [],
  templateUrl: 'tree-node-drop-slot.component.html',
  host: {

    hostID: 'tree-node-drop-slot' + Math.random().toString(36).substring(2, 15)
  }
})
export class TreeNodeDropSlot {
  /**
   * Input property `node` (`TreeNode`) configuring node.
   * @zh 输入属性 `node`（类型：`TreeNode`），用于配置节点。
   */
  @Input() node: TreeNode;
  /**
   * Input property `dropIndex` (`number`) configuring drop index.
   * @zh 输入属性 `dropIndex`（类型：`number`），用于配置放置索引。
   */
  @Input() dropIndex: number;
  /**
   * Executes `onDrop` to handle on drop.
   * @zh 执行 `onDrop`，用于当放置。
   * @param $event - event parameter (`any`) / 事件参数（`any`）
   */
  onDrop($event) {
    this.node.mouseAction('drop', $event.event, {
      from: $event.element,
      to: { parent: this.node, index: this.dropIndex }
    });
  }
  /**
   * Executes `allowDrop` to handle allow drop.
   * @zh 执行 `allowDrop`，用于允许放置。
   * @param element - element parameter (`any`) / 元素参数（`any`）
   * @param $event - event parameter (`any`) / 事件参数（`any`）
   */
  allowDrop(element, $event) {
    return this.node.options.allowDrop(element, { parent: this.node, index: this.dropIndex }, $event);
  }
}
