/**
 * @fileoverview Module `src/tree/components/tree-node-checkbox.component.ts` providing Signal-backed tree node checkbox component.
 * @zh 模块文件 `src/tree/components/tree-node-checkbox.component.ts`，提供基于原生 Angular Signal 的树节点复选框组件实现（零 MobX 依赖）。
 */

import { ChangeDetectionStrategy, Component, Input, signal, ViewEncapsulation } from '@angular/core';
import { TreeNode } from '../models/tree-node.model';

/**
 * Angular component `TreeNodeCheckboxComponent` (selector: 'tree-node-checkbox') providing tree node checkbox presentation and interaction in `src/tree/components`.
 * @zh Angular 组件 `TreeNodeCheckboxComponent`（selector: 'tree-node-checkbox'），提供树形控件节点复选框组件的视图渲染与勾选交互。
 */
@Component({
  selector: 'tree-node-checkbox',
  encapsulation: ViewEncapsulation.None,
  templateUrl: 'tree-node-checkbox.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    hostID: 'tree-node-checkbox' + Math.random().toString(36).substring(2, 15),
  },
  standalone: false,
})
export class TreeNodeCheckboxComponent {
  // 私有 Signal 追踪输入节点实例替换
  private readonly _nodeSig = signal<TreeNode | null>(null);

  /**
   * Getter for input property `node` (`TreeNode`) returning current node.
   * @zh 输入属性 `node`（类型：`TreeNode`）的读取器，返回当前节点。
   */
  @Input()
  get node(): TreeNode {
    return this._nodeSig() as TreeNode;
  }

  /**
   * Sets the `node` (`node`).
   * @zh 设置节点（`node`）。
   * @param node - New node value (`TreeNode`) / 新的节点值（`TreeNode`）
   */
  set node(node: TreeNode) {
    this.setNode(node);
  }

  /**
   * Executes `setNode` to update the node Signal.
   * @zh 执行 `setNode`，更新内部节点 Signal。
   * @param node - node parameter (`TreeNode`) / 节点参数（`TreeNode`）
   */
  setNode(node: TreeNode): void {
    this._nodeSig.set(node);
  }

  /**
   * Gets `_node` (`TreeNode`) for backward compatibility.
   * @zh 获取 `_node`（类型：`TreeNode`），保留兼容读取器。
   */
  get _node(): TreeNode {
    return this._nodeSig() as TreeNode;
  }

  /**
   * Sets `_node` (`_node`) for backward compatibility.
   * @zh 设置 `_node`（`_node`），保留兼容写入器。
   * @param value - New _node value (`TreeNode`) / 新的节点值（`TreeNode`）
   */
  set _node(value: TreeNode) {
    this._nodeSig.set(value);
  }

  /**
   * Input property `label` (`string`) configuring checkbox label.
   * @zh 输入属性 `label`（类型：`string`），配置复选框文本标签。
   */
  @Input() label = '';
}
