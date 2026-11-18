/**
 * @fileoverview Module `src/tree/components/tree-node-checkbox.component.ts` providing tree node checkbox component definitions and implementation.
 * @zh 模块文件 `src/tree/components/tree-node-checkbox.component.ts`，提供树形控件节点复选框组件相关的定义与实现。
 */

import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { makeObservable } from 'mobx';
import { action, observable } from '@dotos1/dui/core/mobx';
import { TreeNode } from '../models/tree-node.model';

/**
 * Angular component `TreeNodeCheckboxComponent` (selector: 'tree-node-checkbox') providing tree node checkbox component presentation and interaction in `src/tree/components`.
 * @zh Angular 组件 `TreeNodeCheckboxComponent`（selector: 'tree-node-checkbox'），提供树形控件节点复选框组件的视图渲染与交互逻辑（位于 `src/tree/components`）。
 */
@Component({
  selector: 'tree-node-checkbox',
   encapsulation: ViewEncapsulation.None,
  templateUrl: 'tree-node-checkbox.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush, 
  host: {
    hostID: 'tree-node-checkbox' + Math.random().toString(36).substring(2, 15)
  },
  standalone: false
})
export class TreeNodeCheckboxComponent {
  //同 TreeNodeChildrenComponent：模板在 mobxAutorun 里，换实例必须走 observable
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
  @observable _node: TreeNode = undefined;

  /**
   * Input property `label` (`string`) configuring label.
   * @zh 输入属性 `label`（类型：`string`），用于配置标签。
   */
  @Input() label: string;

  /**
   * Creates an instance of `TreeNodeCheckboxComponent` and initializes its dependencies and internal state.
   * @zh 创建 `TreeNodeCheckboxComponent` 实例，并初始化其依赖项与内部状态。
   */
  constructor() {
    makeObservable(this);
  }
}
