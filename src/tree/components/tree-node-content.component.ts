/**
 * @fileoverview Module `src/tree/components/tree-node-content.component.ts` providing tree node content component definitions and implementation.
 * @zh 模块文件 `src/tree/components/tree-node-content.component.ts`，提供树形控件节点内容组件相关的定义与实现。
 */

import { Component, Input, ViewEncapsulation, TemplateRef, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';

import { TreeNode } from '../models/tree-node.model';

/**
 * Angular component `TreeNodeContent` (selector: 'tree-node-content') providing tree node content presentation and interaction in `src/tree/components`.
 * @zh Angular 组件 `TreeNodeContent`（selector: 'tree-node-content'），提供树形控件节点内容的视图渲染与交互逻辑（位于 `src/tree/components`）。
 */
@Component({
  selector: 'tree-node-content',
  encapsulation: ViewEncapsulation.None,
  templateUrl: 'tree-node-content.component.html',
        changeDetection: ChangeDetectionStrategy.OnPush, 
  host: {
    '[style.flex]': '1',
    hostID: 'tree-node-content' + Math.random().toString(36).substring(2, 15),
  },
})
export class TreeNodeContent {

  /**
   * Input setter `node` updating node.
   * @zh 输入属性 `node` 的设置器，用于更新节点。
   * @param node - New node value (`TreeNode`) / 新的节点值（`TreeNode`）
   */
  @Input() set node(node) {
    this._node =node ;
  }
  /**
   * Gets the current node (`node: TreeNode`).
   * @zh 获取当前节点（`node: TreeNode`）。
   */
  get node(): TreeNode {
    return this._node;
  }
  /**
   * Property `_node` (`TreeNode`) storing node.
   * @zh 属性 `_node`（类型：`TreeNode`），用于存储或配置节点。
   */
  private _node: TreeNode;

  /**
   * Input property `index` (`number`) configuring index.
   * @zh 输入属性 `index`（类型：`number`），用于配置索引。
   */
  @Input() index: number;
  /**
   * Input property `template` (`TemplateRef<unknown>`) configuring template.
   * @zh 输入属性 `template`（类型：`TemplateRef<unknown>`），用于配置模板。
   */
  @Input() template: TemplateRef<unknown>;

  /**
   * Property `sub` (`any`) storing sub.
   * @zh 属性 `sub`（类型：`any`），用于存储或配置子。
   */
  private sub;

  /**
   * Creates an instance of `TreeNodeContent` and initializes its dependencies and internal state.
   * @zh 创建 `TreeNodeContent` 实例，并初始化其依赖项与内部状态。
   * @param cdr - Injected or initial cdr (`ChangeDetectorRef`) / 注入或传入的cdr（`ChangeDetectorRef`）
   */
  constructor(private cdr: ChangeDetectorRef) {}

  /**
   * Angular lifecycle hook invoked once after component or directive inputs are initialized.
   * @zh Angular 生命周期钩子：在组件或指令的输入属性初始化完成后调用一次。
   */
  ngOnInit() {
    this.sub = this.node.treeModel.subscribe('updateData', (event: { node? }) => {
      if (event.node === this.node) {
        this.cdr.detectChanges();
      }
    });
  }

  /**
   * Angular lifecycle hook invoked just before the component, directive, or service is destroyed to release subscriptions and resources.
   * @zh Angular 生命周期钩子：在组件、指令或服务销毁前调用，用于释放订阅与清理资源。
   */
  ngOnDestroy() {
    if (this.sub && this.sub.unsubscribe) {
      this.sub.unsubscribe();
    }
  }
}
