/**
 * @fileoverview Module `src/tree/components/tree-node-recursive.components.ts` providing mutually recursive tree node components in a single compilation unit for Angular Ivy partial compilation.
 * @zh 模块文件 `src/tree/components/tree-node-recursive.components.ts`，在同一编译单元内定义互相递归引用的树节点组件，以兼容 Angular Ivy partial 编译模式（避免跨文件 NG3003 循环导入报错）。
 */

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewEncapsulation,
} from '@angular/core';
import { makeObservable, reaction } from 'mobx';
import { action, computed, observable } from '@dotos1/dui/core/mobx';
import { TreeNode as TreeNodeApi } from '../defs/api';
import { TreeNode } from '../models/tree-node.model';
import { TreeModel } from '../models/tree.model';
import { TreeVirtualScroll } from '../models/tree-virtual-scroll.model';

/**
 * Interface `TreeNodeTemplates` defining template references passed through recursive tree node components.
 * @zh 接口 `TreeNodeTemplates`，定义递归树节点组件之间传递的模板引用集合。
 */
export interface TreeNodeTemplates {
  /**
   * Optional property `loadingTemplate` (`TemplateRef<unknown>`) storing loading template.
   * @zh 可选属性 `loadingTemplate`（类型：`TemplateRef<unknown>`），存储加载状态模板。
   */
  loadingTemplate?: TemplateRef<unknown>;
  /**
   * Optional property `treeNodeTemplate` (`TemplateRef<unknown>`) storing tree node template.
   * @zh 可选属性 `treeNodeTemplate`（类型：`TemplateRef<unknown>`），存储树节点内容模板。
   */
  treeNodeTemplate?: TemplateRef<unknown>;
  /**
   * Optional property `treeNodeWrapperTemplate` (`TemplateRef<unknown>`) storing tree node wrapper template.
   * @zh 可选属性 `treeNodeWrapperTemplate`（类型：`TemplateRef<unknown>`），存储树节点包裹模板。
   */
  treeNodeWrapperTemplate?: TemplateRef<unknown>;
  /**
   * Optional property `treeNodeFullTemplate` (`TemplateRef<unknown>`) storing tree node full template.
   * @zh 可选属性 `treeNodeFullTemplate`（类型：`TemplateRef<unknown>`），存储树节点完整自定义模板。
   */
  treeNodeFullTemplate?: TemplateRef<unknown>;
}

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
    hostID: 'tree-node' + Math.random().toString(36).substring(2, 15),
  },
  standalone: false,
})
export class TreeNodeComponent {
  /**
   * Getter for input property `node` (`unknown`) returning node.
   * @zh 输入属性 `node`（类型：`unknown`）的读取器，返回当前节点。
   */
  @Input()
  get node(): TreeNodeApi {
    return this._node;
  }
  /**
   * Sets the node (`node`).
   * @zh 设置节点（`node`）。
   * @param node - New node value (`unknown`) / 新的节点值（`unknown`）
   */
  set node(node: TreeNodeApi) {
    this.setNode(node);
  }
  /**
   * Executes `setNode` to handle set node.
   * @zh 执行 `setNode`，执行设置节点操作。
   * @param node - node parameter (`unknown`) / 节点参数（`unknown`）
   */
  @action setNode(node: TreeNodeApi): void {
    this._node = node;
  }

  /**
   * Property `_node` (`unknown`) storing node.
   * @zh 属性 `_node`（类型：`unknown`），存储或配置节点。
   */
  @observable _node: TreeNodeApi = undefined;
  /**
   * Input property `index` (`number`) configuring index.
   * @zh 输入属性 `index`（类型：`number`），配置索引。
   */
  @Input() index: number;
  /**
   * Input property `templates` (`TreeNodeTemplates`) configuring templates.
   * @zh 输入属性 `templates`（类型：`TreeNodeTemplates`），配置模板。
   */
  @Input() templates: TreeNodeTemplates;

  /**
   * Creates an instance of `TreeNodeComponent` and initializes its dependencies and internal state.
   * @zh 创建 `TreeNodeComponent` 实例，并初始化其依赖项与内部状态。
   */
  constructor() {
    makeObservable(this);
  }
}

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
    hostID: 'tree-node-children' + Math.random().toString(36).substring(2, 15),
  },
  standalone: false,
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
  get node(): TreeNode {
    return this._node;
  }
  /**
   * Sets the node (`node`).
   * @zh 设置节点（`node`）。
   * @param node - New node value (`TreeNode`) / 新的节点值（`TreeNode`）
   */
  set node(node: TreeNode) {
    this.setNode(node);
  }
  /**
   * Executes `setNode` to handle set node.
   * @zh 执行 `setNode`，执行设置节点操作。
   * @param node - node parameter (`TreeNode`) / 节点参数（`TreeNode`）
   */
  @action setNode(node: TreeNode): void {
    this._node = node;
  }
  /**
   * Property `_node` (`TreeNode`) storing node.
   * @zh 属性 `_node`（类型：`TreeNode`），存储或配置节点。
   */
  @observable _node: TreeNode = undefined;

  /**
   * Input property `templates` (`TreeNodeTemplates`) configuring templates.
   * @zh 输入属性 `templates`（类型：`TreeNodeTemplates`），配置模板。
   */
  @Input() templates: TreeNodeTemplates;

  /**
   * Creates an instance of `TreeNodeChildrenComponent` and initializes its dependencies and internal state.
   * @zh 创建 `TreeNodeChildrenComponent` 实例，并初始化其依赖项与内部状态。
   */
  constructor() {
    makeObservable(this);
  }
}

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
    hostID: 'tree-node-collection' + Math.random().toString(36).substring(2, 15),
  },
  standalone: false,
})
export class TreeNodeCollectionComponent implements OnInit, OnDestroy {
  /**
   * Getter for input property `nodes` (`TreeNode[]`) returning nodes.
   * @zh 输入属性 `nodes`（类型：`TreeNode[]`）的读取器，返回当前节点列表。
   */
  @Input()
  get nodes(): TreeNode[] {
    return this._nodes;
  }
  /**
   * Sets the nodes (`nodes`).
   * @zh 设置节点列表（`nodes`）。
   * @param nodes - New nodes value (`TreeNode[]`) / 新的节点列表值（`TreeNode[]`）
   */
  set nodes(nodes: TreeNode[]) {
    this.setNodes(nodes);
  }

  /**
   * Input property `treeModel` (`TreeModel`) configuring tree model.
   * @zh 输入属性 `treeModel`（类型：`TreeModel`），配置树形控件模型。
   */
  @Input() treeModel: TreeModel;
  /**
   * Input property `templates` (`TreeNodeTemplates`) configuring templates.
   * @zh 输入属性 `templates`（类型：`TreeNodeTemplates`），配置模板。
   */
  @Input() templates: TreeNodeTemplates;

  /**
   * Property `_nodes` (`TreeNode[]`) storing nodes.
   * @zh 属性 `_nodes`（类型：`TreeNode[]`），存储或配置节点列表。
   */
  @observable _nodes: TreeNode[] = undefined;
  /**
   * Property `virtualScroll` (`TreeVirtualScroll`) storing virtual scroll.
   * @zh 属性 `virtualScroll`（类型：`TreeVirtualScroll`），存储或配置虚拟滚动。
   */
  private virtualScroll: TreeVirtualScroll;
  /**
   * Property `viewportNodes` (`TreeNode[]`) storing viewport nodes.
   * @zh 属性 `viewportNodes`（类型：`TreeNode[]`），存储或配置视口节点列表。
   */
  @observable viewportNodes: TreeNode[] = undefined;

  /**
   * Gets the current margin top (`marginTop: string`).
   * @zh 获取当前外边距顶部位置（`marginTop: string`）。
   */
  @computed get marginTop(): string {
    const firstNode = this.viewportNodes && this.viewportNodes.length && this.viewportNodes[0];
    const relativePosition =
      firstNode && firstNode.parent
        ? firstNode.position - firstNode.parent.position - firstNode.parent.getSelfHeight()
        : 0;
    return `${relativePosition}px`;
  }

  /**
   * Property `_dispose` (`(() => void)[]`) storing dispose (default: `[]`).
   * @zh 属性 `_dispose`（类型：`(() => void)[]`），存储或配置释放回调列表（默认值：`[]`）。
   */
  _dispose: Array<() => void> = [];

  /**
   * Executes `setNodes` to handle set nodes.
   * @zh 执行 `setNodes`，执行设置节点列表操作。
   * @param nodes - nodes parameter (`TreeNode[]`) / 节点列表参数（`TreeNode[]`）
   */
  @action setNodes(nodes: TreeNode[]): void {
    this._nodes = nodes;
  }

  /**
   * Creates an instance of `TreeNodeCollectionComponent` and initializes its dependencies and internal state.
   * @zh 创建 `TreeNodeCollectionComponent` 实例，并初始化其依赖项与内部状态。
   * @param cdr - Injected or initial cdr (`ChangeDetectorRef`) / 注入或传入的变更检测引用（`ChangeDetectorRef`）
   */
  constructor(private cdr: ChangeDetectorRef) {
    makeObservable(this);
  }

  /**
   * Angular lifecycle hook invoked once after component or directive inputs are initialized.
   * @zh Angular 生命周期钩子：在组件或指令的输入属性初始化完成后调用一次。
   */
  ngOnInit(): void {
    this.virtualScroll = this.treeModel.virtualScroll;

    this._dispose = [
      reaction(
        (): number[] => {
          return this.virtualScroll.getViewportNodes(this.nodes).map((n: TreeNode): number => n.index);
        },
        (nodeIndexes: number[]) => {
          this.viewportNodes = nodeIndexes.map((i: number): TreeNode => this.nodes[i]);
        },
        { compareStructural: true, fireImmediately: true } as unknown
      ),
      reaction(
        (): TreeNode[] => this.nodes,
        (nodes: TreeNode[]) => {
          this.viewportNodes = this.virtualScroll.getViewportNodes(nodes);
        }
      ),
    ];
  }

  /**
   * Angular lifecycle hook invoked just before the component, directive, or service is destroyed to release subscriptions and resources.
   * @zh Angular 生命周期钩子：在组件、指令或服务销毁前调用，释放订阅与清理资源。
   */
  ngOnDestroy(): void {
    this._dispose.forEach((d: () => void): void => d());
  }

  /**
   * Executes `trackNode` to handle track node.
   * @zh 执行 `trackNode`，按节点标识跟踪列表项。
   * @param index - index parameter (`number`) / 索引参数（`number`）
   * @param node - node parameter (`TreeNode`) / 节点参数（`TreeNode`）
   */
  trackNode(index: number, node: TreeNode): string | number {
    return node.id;
  }
}
