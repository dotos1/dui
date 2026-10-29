/**
 * @fileoverview Module `src/tree/components/tree-node.component.ts` providing tree node component definitions and implementation.
 * @zh 模块文件 `src/tree/components/tree-node.component.ts`，提供树形控件节点组件相关的定义与实现。
 */

import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation} from '@angular/core';
import { observable, action } from '@dotos/dui/core/mobx';
import { TreeNode } from '../defs/api';

/**
 * Angular component `TreeNodeComponent` (selector: 'TreeNode, tree-node') providing tree node component presentation and interaction in `src/tree/components`.
 * @zh Angular 组件 `TreeNodeComponent`（selector: 'TreeNode, tree-node'），提供树形控件节点组件的视图渲染与交互逻辑（位于 `src/tree/components`）。
 */
@Component({
  selector: 'TreeNode, tree-node',
  encapsulation: ViewEncapsulation.None,
     changeDetection: ChangeDetectionStrategy.OnPush, 
  styles: [],
  templateUrl: 'tree-node.component.html',
  host: {
    hostID: 'tree-node' + Math.random().toString(36).substring(2, 15)
  }
})

export class TreeNodeComponent {
  /**
   * Getter for input property `node` (`unknown`) returning node.
   * @zh 输入属性 `node`（类型：`unknown`）的读取器，返回当前节点。
   */
  @Input()
  get node() {
    return this._node;
  }
  /**
   * Sets the node (`node`).
   * @zh 设置节点（`node`）。
   * @param node - New node value (`unknown`) / 新的节点值（`unknown`）
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
   * Property `_node` (`unknown`) storing node.
   * @zh 属性 `_node`（类型：`unknown`），用于存储或配置节点。
   */
  @observable _node: TreeNode;
  /**
   * Input property `index` (`number`) configuring index.
   * @zh 输入属性 `index`（类型：`number`），用于配置索引。
   */
  @Input() index: number;
  /**
   * Input property `templates` (`any`) configuring templates.
   * @zh 输入属性 `templates`（类型：`any`），用于配置模板。
   */
  @Input() templates;
}
