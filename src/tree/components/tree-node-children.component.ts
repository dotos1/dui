/**
 * @fileoverview Module `src/tree/components/tree-node-children.component.ts` providing tree node children component definitions and implementation.
 * @zh 模块文件 `src/tree/components/tree-node-children.component.ts`，提供树形控件节点子级列表组件相关的定义与实现。
 */

import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { action, observable } from '@dotos/dui/core/mobx';
import { TreeNode } from '../models/tree-node.model';

/**
 * Angular component `TreeNodeChildrenComponent` (selector: 'tree-node-children') providing tree node children component presentation and interaction in `src/tree/components`.
 * @zh Angular 组件 `TreeNodeChildrenComponent`（selector: 'tree-node-children'），提供树形控件节点子级列表组件的视图渲染与交互逻辑（位于 `src/tree/components`）。
 */
@Component({
  selector: 'tree-node-children',
  encapsulation: ViewEncapsulation.None,
  styles: [],
  templateUrl: 'tree-node-children.component.html',
      changeDetection: ChangeDetectionStrategy.OnPush, 
  host: {
    hostID: 'tree-node-children' + Math.random().toString(36).substring(2, 15)
  }
})
export class TreeNodeChildrenComponent {
  // node 必须是 observable：模板跑在 mobxAutorun 里，autorun 的依赖是在
  // detectChanges 期间收集的。父节点重新加载子节点时会换成全新的 TreeNode 实例
  // （id 不变），普通 @Input 换实例不产生 mobx 通知，autorun 会一直盯着旧实例，
  // 新实例后到的 children 就再也刷不出来——表现为节点永远转圈。
  /**
   * Getter for input property `node` (`TreeNode`) returning node.
   * @zh 输入属性 `node`（类型：`TreeNode`）的读取器，返回当前节点。
   */
  @Input()
  get node() {
    return this._node;
  }
  /**
   * Sets the node (`node`).
   * @zh 设置节点（`node`）。
   * @param node - New node value (`TreeNode`) / 新的节点值（`TreeNode`）
   */
  set node(node) {
    this.setNode(node);
  }
  /**
   * Executes `setNode` to handle set node.
   * @zh 执行 `setNode`，用于集合节点。
   * @param node - node parameter (`any`) / 节点参数（`any`）
   */
  @action setNode(node) {
    this._node = node;
  }
  /**
   * Property `_node` (`TreeNode`) storing node.
   * @zh 属性 `_node`（类型：`TreeNode`），用于存储或配置节点。
   */
  @observable _node: TreeNode;

  /**
   * Input property `templates` (`any`) configuring templates.
   * @zh 输入属性 `templates`（类型：`any`），用于配置模板。
   */
  @Input() templates;
}
