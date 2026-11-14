/**
 * @fileoverview Module `src/tree/components/tree-node-recursive.components.ts` providing mutually recursive Signal-driven tree node components in a single compilation unit for Angular Ivy partial compilation.
 * @zh 模块文件 `src/tree/components/tree-node-recursive.components.ts`，在同一编译单元内定义基于原生 Angular Signal 互相递归引用的树节点组件，兼容 Angular Ivy partial 编译模式且零 MobX 依赖。
 */

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  Input,
  OnDestroy,
  OnInit,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { TreeNode as TreeNodeApi } from '../defs/api';
import { TreeNodeTemplates } from '../defs/tree-node-templates';
import { TreeNode } from '../models/tree-node.model';
import { TreeVirtualScroll } from '../models/tree-virtual-scroll.model';
import { TreeModel } from '../models/tree.model';

export { TreeNodeTemplates } from '../defs/tree-node-templates';

/**
 * Angular component `TreeNodeComponent` (selector: 'TreeNode, tree-node') providing Signal-driven tree node presentation and WAI-ARIA treeitem semantics in `src/tree/components`.
 * @zh Angular 组件 `TreeNodeComponent`（selector: 'TreeNode, tree-node'），提供基于 Signal 的树节点渲染与 WAI-ARIA `treeitem` 无障碍语义。
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
  // 私有 Signal 存储节点引用，支持虚拟滚动与父级重载时动态替换节点实例
  private readonly _nodeSig = signal<TreeNodeApi>(null);

  /**
   * Getter for input property `node` (`unknown`) returning node.
   * @zh 输入属性 `node`（类型：`unknown`）的读取器，返回当前节点。
   */
  @Input()
  get node(): TreeNodeApi {
    return this._nodeSig();
  }

  /**
   * Sets the `node` (`node`).
   * @zh 设置节点（`node`）。
   * @param node - New node value (`unknown`) / 新的节点值（`unknown`）
   */
  set node(node: TreeNodeApi) {
    this.setNode(node);
  }

  /**
   * Executes `setNode` to update the node Signal.
   * @zh 执行 `setNode`，更新内部节点 Signal。
   * @param node - node parameter (`unknown`) / 节点参数（`unknown`）
   */
  setNode(node: TreeNodeApi): void {
    this._nodeSig.set(node);
  }

  /**
   * Gets `_node` (`unknown`) for backward compatibility.
   * @zh 获取 `_node`（类型：`unknown`），保留兼容读取器。
   */
  get _node(): TreeNodeApi {
    return this._nodeSig();
  }

  /**
   * Sets `_node` (`_node`) for backward compatibility.
   * @zh 设置 `_node`（`_node`），保留兼容写入器。
   * @param value - New _node value (`unknown`) / 新的节点值（`unknown`）
   */
  set _node(value: TreeNodeApi) {
    this._nodeSig.set(value);
  }

  /**
   * Input property `index` (`number`) configuring sibling index.
   * @zh 输入属性 `index`（类型：`number`），配置索引。
   */
  @Input() index = 0;

  /**
   * Input property `templates` (`TreeNodeTemplates`) configuring templates.
   * @zh 输入属性 `templates`（类型：`TreeNodeTemplates`），配置模板集合。
   */
  @Input() templates!: TreeNodeTemplates;
}

/**
 * Angular component `TreeNodeChildrenComponent` (selector: 'tree-node-children') providing Signal-driven child group presentation in `src/tree/components`.
 * @zh Angular 组件 `TreeNodeChildrenComponent`（selector: 'tree-node-children'），提供基于 Signal 的子节点分组渲染与 WAI-ARIA `group` 语义。
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
  // 使用 Signal 存储 node：父节点重新加载子节点替换 TreeNode 实例时自动通知 OnPush / Zoneless 模板更新
  private readonly _nodeSig = signal<TreeNode | null>(null);

  /**
   * Getter for input property `node` (`TreeNode`) returning node.
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
   * Input property `templates` (`TreeNodeTemplates`) configuring templates.
   * @zh 输入属性 `templates`（类型：`TreeNodeTemplates`），配置模板集合。
   */
  @Input() templates!: TreeNodeTemplates;
}

/**
 * Angular component `TreeNodeCollectionComponent` (selector: 'tree-node-collection') providing Signal-driven viewport node collection rendering in `src/tree/components`.
 * @zh Angular 组件 `TreeNodeCollectionComponent`（selector: 'tree-node-collection'），提供基于 Signal `computed` 派生裁剪的视口节点集合渲染。
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
  private readonly _nodesSig = signal<TreeNode[]>([]);
  private readonly _virtualScrollSig = signal<TreeVirtualScroll | null>(null);
  private readonly _viewportNodesOverrideSig = signal<TreeNode[] | null>(null);

  private readonly _viewportNodesComputed = computed<TreeNode[]>(() => {
    const manual = this._viewportNodesOverrideSig();
    if (manual !== null) {
      return manual;
    }
    const nodes = this._nodesSig();
    const vs = this._virtualScrollSig();
    if (!vs) {
      return (nodes || []).filter((n: TreeNode) => !n.isHidden);
    }
    return vs.getViewportNodes(nodes);
  });

  private readonly _marginTopComputed = computed<string>(() => {
    const vpNodes = this.viewportNodes;
    const firstNode = vpNodes && vpNodes.length ? vpNodes[0] : undefined;
    const relativePosition =
      firstNode && firstNode.parent
        ? firstNode.position - firstNode.parent.position - firstNode.parent.getSelfHeight()
        : 0;
    return `${relativePosition}px`;
  });

  /**
   * Getter for input property `nodes` (`TreeNode[]`) returning nodes.
   * @zh 输入属性 `nodes`（类型：`TreeNode[]`）的读取器，返回当前节点列表。
   */
  @Input()
  get nodes(): TreeNode[] {
    return this._nodesSig();
  }

  /**
   * Sets the `nodes` (`nodes`).
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
  @Input() treeModel!: TreeModel;

  /**
   * Input property `templates` (`TreeNodeTemplates`) configuring templates.
   * @zh 输入属性 `templates`（类型：`TreeNodeTemplates`），配置模板集合。
   */
  @Input() templates!: TreeNodeTemplates;

  /**
   * Gets `_nodes` (`TreeNode[]`) for backward compatibility.
   * @zh 获取 `_nodes`（类型：`TreeNode[]`），保留兼容读取器。
   */
  get _nodes(): TreeNode[] {
    return this._nodesSig();
  }

  /**
   * Sets `_nodes` (`_nodes`) for backward compatibility.
   * @zh 设置 `_nodes`（`_nodes`），保留兼容写入器。
   * @param value - New _nodes value (`TreeNode[]`) / 新的节点数组（`TreeNode[]`）
   */
  set _nodes(value: TreeNode[]) {
    this._nodesSig.set(value ?? []);
  }

  /**
   * Gets the Signal-derived `viewportNodes` (`TreeNode[]`).
   * @zh 获取由 Signal 实时派生的当前视口可见节点列表（`TreeNode[]`）。
   */
  get viewportNodes(): TreeNode[] {
    return this._viewportNodesComputed();
  }

  /**
   * Sets `viewportNodes` override if assigned imperatively.
   * @zh 命令式设置视口节点列表（`viewportNodes`）。
   * @param value - New viewportNodes value (`TreeNode[]`) / 视口节点数组（`TreeNode[]`）
   */
  set viewportNodes(value: TreeNode[]) {
    this._viewportNodesOverrideSig.set(value);
  }

  /**
   * Gets the current `marginTop` (`string`).
   * @zh 获取当前虚拟滚动顶部外边距位置（`string`）。
   */
  get marginTop(): string {
    return this._marginTopComputed();
  }

  /**
   * Property `_dispose` (`(() => void)[]`) storing cleanup callbacks (default: `[]`).
   * @zh 属性 `_dispose`（类型：`(() => void)[]`），存储释放回调列表（默认值：`[]`）。
   */
  _dispose: Array<() => void> = [];

  /**
   * Executes `setNodes` to update the `_nodesSig` Signal.
   * @zh 执行 `setNodes`，更新节点集合 Signal 并清除命令式覆盖缓存。
   * @param nodes - nodes parameter (`TreeNode[]`) / 节点列表参数（`TreeNode[]`）
   */
  setNodes(nodes: TreeNode[]): void {
    this._viewportNodesOverrideSig.set(null);
    this._nodesSig.set(nodes ?? []);
  }

  /**
   * Creates an instance of `TreeNodeCollectionComponent` and initializes its dependencies and internal state.
   * @zh 创建 `TreeNodeCollectionComponent` 实例，并初始化变更检测引用。
   * @param cdr - Injected or initial cdr (`ChangeDetectorRef`) / 注入或传入的变更检测器引用（`ChangeDetectorRef`）
   */
  constructor(private cdr: ChangeDetectorRef) {}

  /**
   * Angular lifecycle hook invoked once after component or directive inputs are initialized.
   * @zh Angular 生命周期钩子：关联所属 `TreeVirtualScroll` 并监听树布局更新。
   */
  ngOnInit(): void {
    if (this.treeModel) {
      this._virtualScrollSig.set(this.treeModel.virtualScroll ?? null);
      const offLayout = this.treeModel.subscribeToLayout(() => {
        this._viewportNodesOverrideSig.set(null);
        this.cdr.markForCheck();
      });
      this._dispose.push(offLayout);
    }
  }

  /**
   * Angular lifecycle hook invoked just before the component, directive, or service is destroyed to release subscriptions and resources.
   * @zh Angular 生命周期钩子：清理布局监听回调。
   */
  ngOnDestroy(): void {
    this._dispose.forEach((d: () => void): void => d());
    this._dispose = [];
  }

  /**
   * Executes `trackNode` to track nodes by unique ID.
   * @zh 执行 `trackNode`，按节点唯一标识跟踪列表渲染项。
   * @param _index - index parameter (`number`) / 索引参数（`number`）
   * @param node - node parameter (`TreeNode`) / 节点参数（`TreeNode`）
   * @returns Result of type `string | number` / 类型为 `string | number` 的返回值
   */
  trackNode(_index: number, node: TreeNode): string | number {
    return node.id;
  }
}
