/**
 * @fileoverview Module `src/tree/components/tree-node-collection.component.ts` providing tree node collection component definitions and implementation.
 * @zh 模块文件 `src/tree/components/tree-node-collection.component.ts`，提供树形控件节点集合组件相关的定义与实现。
 */

import {
  Component, Input, ViewEncapsulation, OnInit, OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';
import { reaction, comparer } from 'mobx'; 
import { observable, computed, action } from '@dotos/dui/core/mobx';
import { TreeVirtualScroll } from '../models/tree-virtual-scroll.model';
import { TreeNode } from '../models/tree-node.model';
import { TreeModel } from '../models/tree.model';

/**
 * Angular component `TreeNodeCollectionComponent` (selector: 'tree-node-collection') providing tree node collection component presentation and interaction in `src/tree/components`.
 * @zh Angular 组件 `TreeNodeCollectionComponent`（selector: 'tree-node-collection'），提供树形控件节点集合组件的视图渲染与交互逻辑（位于 `src/tree/components`）。
 */
@Component({
  selector: 'tree-node-collection',
  encapsulation: ViewEncapsulation.None,
  templateUrl: 'tree-node-collection.component.html',
      changeDetection: ChangeDetectionStrategy.OnPush, 
  host: {
    hostID: 'tree-node-collection' + Math.random().toString(36).substring(2, 15)    
  }
})
export class TreeNodeCollectionComponent implements OnInit, OnDestroy {
  /**
   * Getter for input property `nodes` (`any`) returning nodes.
   * @zh 输入属性 `nodes`（类型：`any`）的读取器，返回当前节点列表。
   */
  @Input()
  get nodes() { return this._nodes; }
  /**
   * Sets the nodes (`nodes`).
   * @zh 设置节点列表（`nodes`）。
   * @param nodes - New nodes value (`any`) / 新的节点列表值（`any`）
   */
  set nodes(nodes) {
    this.setNodes(nodes);
  }

  /**
   * Input property `treeModel` (`TreeModel`) configuring tree model.
   * @zh 输入属性 `treeModel`（类型：`TreeModel`），用于配置树形控件模型。
   */
  @Input() treeModel: TreeModel;
  /**
   * Input property `templates` (`any`) configuring templates.
   * @zh 输入属性 `templates`（类型：`any`），用于配置模板。
   */
  @Input() templates;

  /**
   * Property `_nodes` (`any`) storing nodes.
   * @zh 属性 `_nodes`（类型：`any`），用于存储或配置节点列表。
   */
  @observable _nodes;
  /**
   * Property `virtualScroll` (`TreeVirtualScroll`) storing virtual scroll.
   * @zh 属性 `virtualScroll`（类型：`TreeVirtualScroll`），用于存储或配置虚拟滚动滚动。
   */
  private virtualScroll: TreeVirtualScroll; 
  /**
   * Property `viewportNodes` (`TreeNode[]`) storing viewport nodes.
   * @zh 属性 `viewportNodes`（类型：`TreeNode[]`），用于存储或配置视口节点列表。
   */
  @observable viewportNodes: TreeNode[];

  /**
   * Gets the current margin top (`marginTop: string`).
   * @zh 获取当前外边距顶部位置（`marginTop: string`）。
   */
  @computed get marginTop(): string {
    const firstNode = this.viewportNodes && this.viewportNodes.length && this.viewportNodes[0];
    const relativePosition = firstNode && firstNode.parent
     ? firstNode.position - firstNode.parent.position - firstNode.parent.getSelfHeight() : 0;
    return `${relativePosition}px`;
  }

  /**
   * Property `_dispose` (`any[]`) storing dispose (default: `[]`).
   * @zh 属性 `_dispose`（类型：`any[]`），用于存储或配置释放（默认值：`[]`）。
   */
  _dispose =[];

  /**
   * Executes `setNodes` to handle set nodes.
   * @zh 执行 `setNodes`，用于集合节点列表。
   * @param nodes - nodes parameter (`any`) / 节点列表参数（`any`）
   */
  @action setNodes(nodes) {
    this._nodes = nodes;
  }

  /**
   * Creates an instance of `TreeNodeCollectionComponent` and initializes its dependencies and internal state.
   * @zh 创建 `TreeNodeCollectionComponent` 实例，并初始化其依赖项与内部状态。
   * @param cdr - Injected or initial cdr (`ChangeDetectorRef`) / 注入或传入的cdr（`ChangeDetectorRef`）
   */
  constructor(private cdr: ChangeDetectorRef) {} 

  /**
   * Angular lifecycle hook invoked once after component or directive inputs are initialized.
   * @zh Angular 生命周期钩子：在组件或指令的输入属性初始化完成后调用一次。
   */
  ngOnInit() {
    this.virtualScroll = this.treeModel.virtualScroll;
    
   this._dispose = [
      reaction(
        () => {
          return this.virtualScroll
            .getViewportNodes(this.nodes)
            .map(n => n.index);
        },
        nodeIndexes => {
          this.viewportNodes = nodeIndexes.map(i => this.nodes[i]);
        },
        { compareStructural: true, fireImmediately: true } as unknown
      ),
      reaction(
        () => this.nodes,
        nodes => {
          this.viewportNodes = this.virtualScroll.getViewportNodes(nodes);
        }
      )
    ];
  }

  /**
   * Angular lifecycle hook invoked just before the component, directive, or service is destroyed to release subscriptions and resources.
   * @zh Angular 生命周期钩子：在组件、指令或服务销毁前调用，用于释放订阅与清理资源。
   */
  ngOnDestroy() {
    this._dispose.forEach(d => d());
  }

  /**
   * Executes `trackNode` to handle track node.
   * @zh 执行 `trackNode`，用于track节点。
   * @param index - index parameter (`any`) / 索引参数（`any`）
   * @param node - node parameter (`any`) / 节点参数（`any`）
   */
  trackNode(index, node) {
    return node.id;
  }
}