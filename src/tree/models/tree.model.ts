/**
 * @fileoverview Module `src/tree/models/tree.model.ts` providing Signal-backed tree state and operations without MobX.
 * @zh 模块文件 `src/tree/models/tree.model.ts`，提供基于原生 Angular Signal 的树形控件核心模型与状态管理（零 MobX 依赖，遵循护栏 A 100% 向下兼容）。
 */

import { computed, EventEmitter, Injectable, OnDestroy, Optional, signal } from '@angular/core';
import { TranslateService } from '@dotos/dui/translator';
import { compact, find, first, isFunction, isString, last } from 'lodash-es';
import { Subscription } from 'rxjs';
import { TREE_EVENTS } from '../constants/events';
import { IDType, IDTypeDictionary, ITreeModel, ITreeNode, ITreeOptions, ITreeState } from '../defs/api';
import { TreeNode } from './tree-node.model';
import { TreeOptions } from './tree-options.model';
import { TreeVirtualScroll } from './tree-virtual-scroll.model';

/**
 * Interface `ITreeDropTarget` describing move/copy target parent and index.
 * @zh 接口 `ITreeDropTarget`，描述树节点移动或复制的目标父节点与位置索引。
 */
export interface ITreeDropTarget {
  /**
   * Property `parent` (`ITreeNode`) storing destination parent node.
   * @zh 属性 `parent`（类型：`ITreeNode`），存储目标父节点。
   */
  parent: ITreeNode;
  /**
   * Property `index` (`number`) storing destination child index.
   * @zh 属性 `index`（类型：`number`），存储目标插入索引。
   */
  index: number;
  /**
   * Optional property `dropOnNode` (`boolean`) indicating drop occurred directly on a node.
   * @zh 可选属性 `dropOnNode`（类型：`boolean`），标记是否直接放置于节点之上。
   */
  dropOnNode?: boolean;
}

function toBooleanMap(dict: IDTypeDictionary | null | undefined): Record<string, boolean> {
  const result: Record<string, boolean> = {};
  if (!dict) {
    return result;
  }
  const source = dict as Record<string, boolean>;
  for (const key of Object.keys(source)) {
    if (source[key]) {
      result[String(key)] = true;
    }
  }
  return result;
}

/**
 * Injectable Angular service `TreeModel` managing Signal-driven tree state and operations in `src/tree/models`.
 * @zh 可注入的 Angular 服务 `TreeModel`，使用原生 Angular Signal 管理 `src/tree/models` 中的树形控件状态与交互（护栏 A 兼容公开 get/set 属性）。
 */
@Injectable()
export class TreeModel implements ITreeModel, OnDestroy {
  // 全局聚焦树实例私有 Signal，使 isFocused 具备 Signal 响应能力
  private static readonly _focusedTreeSig = signal<TreeModel | null>(null);

  /**
   * Gets the currently focused `TreeModel` (`TreeModel | null`).
   * @zh 获取当前全局聚焦的树模型实例（`TreeModel | null`）。
   */
  static get focusedTree(): TreeModel | null {
    return TreeModel._focusedTreeSig();
  }

  /**
   * Sets the currently focused `TreeModel` (`focusedTree`).
   * @zh 设置当前全局聚焦的树模型实例（`focusedTree`）。
   * @param value - New focusedTree value (`TreeModel`) / 新的聚焦树模型实例（`TreeModel`）
   */
  static set focusedTree(value: TreeModel | null) {
    TreeModel._focusedTreeSig.set(value);
  }

  /**
   * Property `options` (`TreeOptions`) storing tree options (default: `new TreeOptions()`).
   * @zh 属性 `options`（类型：`TreeOptions`），存储树形控件配置项（默认值：`new TreeOptions()`）。
   */
  options: TreeOptions = new TreeOptions();
  /**
   * Property `nodes` (`Record<string, unknown>[]`) storing raw input nodes.
   * @zh 属性 `nodes`（类型：`Record<string, unknown>[]`），存储原始输入节点数组。
   */
  nodes: Record<string, unknown>[] | null = null;
  /**
   * Property `eventNames` (`string[]`) storing supported tree event names.
   * @zh 属性 `eventNames`（类型：`string[]`），存储树支持的全部事件名称列表。
   */
  eventNames: string[] = Object.keys(TREE_EVENTS);
  /**
   * Property `virtualScroll` (`TreeVirtualScroll`) storing attached virtual scroll controller.
   * @zh 属性 `virtualScroll`（类型：`TreeVirtualScroll`），存储关联的虚拟滚动控制器。
   */
  virtualScroll!: TreeVirtualScroll;

  // 底层私有 WritableSignal 状态（护栏 A：对外暴露同名 get / set 访问器）
  private readonly _rootsSig = signal<TreeNode[]>([]);
  private readonly _expandedNodeIdsSig = signal<Record<string, boolean>>({});
  private readonly _selectedLeafNodeIdsSig = signal<Record<string, boolean>>({});
  private readonly _activeNodeIdsSig = signal<Record<string, boolean>>({});
  private readonly _hiddenNodeIdsSig = signal<Record<string, boolean>>({});
  private readonly _focusedNodeIdSig = signal<IDType | null>(null);
  private readonly _virtualRootSig = signal<TreeNode | null>(null);

  // 底层派生 computed Signal（替代原 MobX @computed）
  private readonly _focusedNodeComputed = computed<TreeNode | null>(() => {
    const id = this._focusedNodeIdSig();
    return id !== null && id !== undefined ? (this.getNodeById(id) ?? null) : null;
  });

  private readonly _expandedNodesComputed = computed<TreeNode[]>(() => {
    const dict = this._expandedNodeIdsSig();
    const nodes = Object.keys(dict)
      .filter((id: string) => Boolean(dict[id]))
      .map((id: string) => this.getNodeById(id));
    return compact(nodes);
  });

  private readonly _activeNodesComputed = computed<TreeNode[]>(() => {
    const dict = this._activeNodeIdsSig();
    const nodes = Object.keys(dict)
      .filter((id: string) => Boolean(dict[id]))
      .map((id: string) => this.getNodeById(id));
    return compact(nodes);
  });

  private readonly _hiddenNodesComputed = computed<TreeNode[]>(() => {
    const dict = this._hiddenNodeIdsSig();
    const nodes = Object.keys(dict)
      .filter((id: string) => Boolean(dict[id]))
      .map((id: string) => this.getNodeById(id));
    return compact(nodes);
  });

  private readonly _selectedLeafNodesComputed = computed<TreeNode[]>(() => {
    const dict = this._selectedLeafNodeIdsSig();
    const nodes = Object.keys(dict)
      .filter((id: string) => Boolean(dict[id]))
      .map((id: string) => this.getNodeById(id));
    return compact(nodes);
  });

  /**
   * Gets the current `roots` (`TreeNode[]`).
   * @zh 获取当前根节点列表（`TreeNode[]`）。
   */
  get roots(): TreeNode[] {
    return this._rootsSig();
  }

  /**
   * Sets the `roots` (`roots`).
   * @zh 设置根节点列表（`roots`）。
   * @param value - New roots value (`TreeNode[]`) / 新的根节点数组（`TreeNode[]`）
   */
  set roots(value: TreeNode[]) {
    this._rootsSig.set(value ?? []);
    this._notifyLayoutListeners();
  }

  /**
   * Gets the current `expandedNodeIds` (`IDTypeDictionary`).
   * @zh 获取已展开节点 ID 字典（`IDTypeDictionary`）。
   */
  get expandedNodeIds(): IDTypeDictionary {
    return this._expandedNodeIdsSig();
  }

  /**
   * Sets the `expandedNodeIds` (`expandedNodeIds`).
   * @zh 设置已展开节点 ID 字典（`expandedNodeIds`），触发 Signal 不可变更新与按需懒加载。
   * @param value - New expandedNodeIds value (`IDTypeDictionary`) / 新的展开节点字典（`IDTypeDictionary`）
   */
  set expandedNodeIds(value: IDTypeDictionary) {
    const next = toBooleanMap(value);
    this._expandedNodeIdsSig.set(next);
    for (const id of Object.keys(next)) {
      if (next[id]) {
        const node = this.getNodeById(id);
        node?._checkAutoLoadChildren();
      }
    }
    this._notifyLayoutListeners();
    this._notifyStateListeners();
  }

  /**
   * Gets the current `selectedLeafNodeIds` (`IDTypeDictionary`).
   * @zh 获取已勾选叶子节点 ID 字典（`IDTypeDictionary`）。
   */
  get selectedLeafNodeIds(): IDTypeDictionary {
    return this._selectedLeafNodeIdsSig();
  }

  /**
   * Sets the `selectedLeafNodeIds` (`selectedLeafNodeIds`).
   * @zh 设置已勾选叶子节点 ID 字典（`selectedLeafNodeIds`）。
   * @param value - New selectedLeafNodeIds value (`IDTypeDictionary`) / 新的已勾选叶子节点字典（`IDTypeDictionary`）
   */
  set selectedLeafNodeIds(value: IDTypeDictionary) {
    this._selectedLeafNodeIdsSig.set(toBooleanMap(value));
    this._notifyStateListeners();
  }

  /**
   * Gets the current `activeNodeIds` (`IDTypeDictionary`).
   * @zh 获取当前激活节点 ID 字典（`IDTypeDictionary`）。
   */
  get activeNodeIds(): IDTypeDictionary {
    return this._activeNodeIdsSig();
  }

  /**
   * Sets the `activeNodeIds` (`activeNodeIds`).
   * @zh 设置当前激活节点 ID 字典（`activeNodeIds`）。
   * @param value - New activeNodeIds value (`IDTypeDictionary`) / 新的激活节点字典（`IDTypeDictionary`）
   */
  set activeNodeIds(value: IDTypeDictionary) {
    this._activeNodeIdsSig.set(toBooleanMap(value));
    this._notifyStateListeners();
  }

  /**
   * Gets the current `hiddenNodeIds` (`IDTypeDictionary`).
   * @zh 获取隐藏节点 ID 字典（`IDTypeDictionary`）。
   */
  get hiddenNodeIds(): IDTypeDictionary {
    return this._hiddenNodeIdsSig();
  }

  /**
   * Sets the `hiddenNodeIds` (`hiddenNodeIds`).
   * @zh 设置隐藏节点 ID 字典（`hiddenNodeIds`）。
   * @param value - New hiddenNodeIds value (`IDTypeDictionary`) / 新的隐藏节点字典（`IDTypeDictionary`）
   */
  set hiddenNodeIds(value: IDTypeDictionary) {
    this._hiddenNodeIdsSig.set(toBooleanMap(value));
    this._notifyLayoutListeners();
    this._notifyStateListeners();
  }

  /**
   * Gets the current `focusedNodeId` (`IDType`).
   * @zh 获取当前聚焦节点 ID（`IDType`）。
   */
  get focusedNodeId(): IDType {
    return this._focusedNodeIdSig() as IDType;
  }

  /**
   * Sets the `focusedNodeId` (`focusedNodeId`).
   * @zh 设置当前聚焦节点 ID（`focusedNodeId`）。
   * @param value - New focusedNodeId value (`IDType`) / 新的聚焦节点 ID（`IDType`）
   */
  set focusedNodeId(value: IDType | null) {
    this._focusedNodeIdSig.set(value ?? null);
    this._notifyStateListeners();
  }

  /**
   * Gets the current `virtualRoot` (`TreeNode`).
   * @zh 获取虚拟根节点（`TreeNode`）。
   */
  get virtualRoot(): TreeNode {
    return this._virtualRootSig() as TreeNode;
  }

  /**
   * Sets the `virtualRoot` (`virtualRoot`).
   * @zh 设置虚拟根节点（`virtualRoot`）。
   * @param value - New virtualRoot value (`TreeNode`) / 新的虚拟根节点（`TreeNode`）
   */
  set virtualRoot(value: TreeNode) {
    this._virtualRootSig.set(value);
  }

  /**
   * Property `firstUpdate` (`boolean`) storing first update flag (default: `true`).
   * @zh 属性 `firstUpdate`（类型：`boolean`），标记是否为首次数据更新（默认值：`true`）。
   */
  public firstUpdate = true;

  private events: Record<string, EventEmitter<Record<string, unknown>>> = {};
  private subscriptions: Subscription[] = [];
  private stateListeners: Array<(state: ITreeState) => void> = [];
  private layoutListeners: Array<() => void> = [];

  /**
   * Property `idSet` (`Set<string>`) storing node ID set (default: `new Set()`).
   * @zh 属性 `idSet`（类型：`Set<string>`），存储节点唯一标识集合（默认值：`new Set()`）。
   */
  public idSet: Set<string> = new Set<string>();

  // ✨ 核心优化：新增 O(1) 复杂度的节点注册表缓存
  /**
   * Property `nodeRegistry` (`Map<string, TreeNode>`) storing O(1) node lookup map.
   * @zh 属性 `nodeRegistry`（类型：`Map<string, TreeNode>`），存储 O(1) 节点索引注册表。
   */
  public nodeRegistry: Map<string, TreeNode> = new Map<string, TreeNode>();

  /**
   * Creates an instance of `TreeModel` and initializes its dependencies and internal state.
   * @zh 创建 `TreeModel` 实例，并初始化国际化翻译依赖与内部 Signal 状态。
   * @param translator - Injected or initial translator (`TranslateService`) / 注入或传入的翻译服务（`TranslateService`）
   */
  constructor(@Optional() public translator?: TranslateService) {}

  private _notifyStateListeners(): void {
    if (this.stateListeners.length === 0) {
      return;
    }
    const snapshot = this.getState();
    for (const listener of this.stateListeners) {
      listener(snapshot);
    }
  }

  private _notifyLayoutListeners(): void {
    for (const listener of this.layoutListeners) {
      listener();
    }
  }

  /**
   * Executes `subscribeToLayout` to register a callback invoked when roots, expanded nodes, or hidden nodes change.
   * @zh 执行 `subscribeToLayout`，注册当根节点、展开态或隐藏态变更时的布局重算监听回调。
   * @param fn - fn parameter (`() => void`) / 监听回调参数（`() => void`）
   * @returns Result of type `() => void` / 类型为 `() => void` 的返回值
   */
  subscribeToLayout(fn: () => void): () => void {
    this.layoutListeners.push(fn);
    return (): void => {
      const idx = this.layoutListeners.indexOf(fn);
      if (idx !== -1) {
        this.layoutListeners.splice(idx, 1);
      }
    };
  }

  /**
   * Executes `hasEvent` to check if an event emitter is registered for the given name.
   * @zh 执行 `hasEvent`，判断指定事件名称是否已绑定事件发射器。
   * @param eventName - event name parameter (`string`) / 事件名称参数（`string`）
   * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
   */
  hasEvent(eventName: string): boolean {
    return Boolean(this.events && this.events[eventName]);
  }

  /**
   * Executes `fireEvent` to emit a tree event.
   * @zh 执行 `fireEvent`，触发树事件并附带当前 `treeModel` 引用。
   * @param event - event parameter (`Record<string, unknown>`) / 事件载荷参数（`Record<string, unknown>`）
   */
  fireEvent(event: Record<string, unknown>): void {
    event['treeModel'] = this;
    const eventName = String(event['eventName'] ?? '');
    if (this.events && this.events[eventName]) {
      this.events[eventName].emit(event);
      if (this.events['event']) {
        this.events['event'].emit(event);
      }
    }
  }

  /**
   * Executes `subscribe` to subscribe to a named tree event.
   * @zh 执行 `subscribe`，订阅指定名称的树事件。
   * @param eventName - event name parameter (`string`) / 事件名称参数（`string`）
   * @param fn - fn parameter (`(event: Record<string, unknown>) => void`) / 回调函数参数（`(event: Record<string, unknown>) => void`）
   * @returns Result of type `Subscription` / 类型为 `Subscription` 的返回值
   */
  subscribe(eventName: string, fn: (event: Record<string, unknown>) => void): Subscription {
    if (!this.events[eventName]) {
      this.events[eventName] = new EventEmitter<Record<string, unknown>>();
    }
    const subscription = this.events[eventName].subscribe(fn);
    this.subscriptions.push(subscription);
    subscription.add(() => {
      const idx = this.subscriptions.indexOf(subscription);
      if (idx !== -1) {
        this.subscriptions.splice(idx, 1);
      }
    });
    return subscription;
  }

  /**
   * Executes `unsubscribe` to unsubscribe from a named tree event.
   * @zh 执行 `unsubscribe`，取消指定树事件的订阅。
   * @param eventName - event name parameter (`string`) / 事件名称参数（`string`）
   */
  unsubscribe(eventName: string): void {
    if (this.events[eventName]) {
      this.events[eventName].unsubscribe();
    }
  }

  /**
   * Executes `getFocusedNode` to return the currently focused node.
   * @zh 执行 `getFocusedNode`，返回当前聚焦节点。
   * @returns Result of type `TreeNode` / 类型为 `TreeNode` 的返回值
   */
  getFocusedNode(): TreeNode {
    return this.focusedNode as TreeNode;
  }

  /**
   * Executes `getActiveNode` to return the first active node.
   * @zh 执行 `getActiveNode`，返回当前第一个激活节点。
   * @returns Result of type `TreeNode` / 类型为 `TreeNode` 的返回值
   */
  getActiveNode(): TreeNode {
    return this.activeNodes[0];
  }

  /**
   * Executes `getActiveNodes` to return all active nodes.
   * @zh 执行 `getActiveNodes`，返回当前全部激活节点列表。
   * @returns Result of type `TreeNode[]` / 类型为 `TreeNode[]` 的返回值
   */
  getActiveNodes(): TreeNode[] {
    return this.activeNodes;
  }

  /**
   * Executes `getVisibleRoots` to return non-hidden root nodes.
   * @zh 执行 `getVisibleRoots`，获取所有可见的根节点列表。
   * @returns Result of type `TreeNode[]` / 类型为 `TreeNode[]` 的返回值
   */
  getVisibleRoots(): TreeNode[] {
    return this.virtualRoot ? this.virtualRoot.visibleChildren : [];
  }

  /**
   * Executes `getFirstRoot` to return the first root node.
   * @zh 执行 `getFirstRoot`，获取第一个根节点。
   * @param skipHidden - skip hidden parameter (`boolean`) / 是否跳过隐藏节点（`boolean`）
   * @returns Result of type `TreeNode` / 类型为 `TreeNode` 的返回值
   */
  getFirstRoot(skipHidden = false): TreeNode | undefined {
    return first(skipHidden ? this.getVisibleRoots() : this.roots);
  }

  /**
   * Executes `getLastRoot` to return the last root node.
   * @zh 执行 `getLastRoot`，获取最后一个根节点。
   * @param skipHidden - skip hidden parameter (`boolean`) / 是否跳过隐藏节点（`boolean`）
   * @returns Result of type `TreeNode` / 类型为 `TreeNode` 的返回值
   */
  getLastRoot(skipHidden = false): TreeNode | undefined {
    return last(skipHidden ? this.getVisibleRoots() : this.roots);
  }

  /**
   * Gets the current `isFocused` (`boolean`).
   * @zh 获取当前树是否处于聚焦状态（`boolean`）。
   */
  get isFocused(): boolean {
    return TreeModel.focusedTree === this;
  }

  /**
   * Executes `isNodeFocused` to check if a specific node is focused.
   * @zh 执行 `isNodeFocused`，判断指定节点是否处于聚焦态。
   * @param node - node parameter (`TreeNode`) / 待检测节点参数（`TreeNode`）
   * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
   */
  isNodeFocused(node: TreeNode): boolean {
    return this.focusedNode === node;
  }

  /**
   * Executes `isEmptyTree` to check if the tree has zero root nodes.
   * @zh 执行 `isEmptyTree`，判断树是否为空。
   * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
   */
  isEmptyTree(): boolean {
    return Boolean(this.roots && this.roots.length === 0);
  }

  /**
   * Gets the current `focusedNode` (`TreeNode`).
   * @zh 获取当前聚焦节点（`TreeNode | null`）。
   */
  get focusedNode(): TreeNode | null {
    return this._focusedNodeComputed();
  }

  /**
   * Gets the current `expandedNodes` (`TreeNode[]`).
   * @zh 获取当前已展开节点数组（`TreeNode[]`）。
   */
  get expandedNodes(): TreeNode[] {
    return this._expandedNodesComputed();
  }

  /**
   * Gets the current `activeNodes` (`TreeNode[]`).
   * @zh 获取当前激活节点数组（`TreeNode[]`）。
   */
  get activeNodes(): TreeNode[] {
    return this._activeNodesComputed();
  }

  /**
   * Gets the current `hiddenNodes` (`TreeNode[]`).
   * @zh 获取当前隐藏节点数组（`TreeNode[]`）。
   */
  get hiddenNodes(): TreeNode[] {
    return this._hiddenNodesComputed();
  }

  /**
   * Gets the current `selectedLeafNodes` (`TreeNode[]`).
   * @zh 获取当前已选中的叶子节点数组（`TreeNode[]`）。
   */
  get selectedLeafNodes(): TreeNode[] {
    return this._selectedLeafNodesComputed();
  }

  /**
   * Executes `getNodePath` to return ancestor chain of the focused node.
   * @zh 执行 `getNodePath`，返回当前聚焦节点从根到自身的节点路径数组。
   * @returns Result of type `TreeNode[]` / 类型为 `TreeNode[]` 的返回值
   */
  getNodePath(): Array<TreeNode> {
    let currentNode: TreeNode | null = this.getFocusedNode();
    const nodes: TreeNode[] = [];
    if (currentNode != null) {
      nodes.push(currentNode);
      while (currentNode.parent != null) {
        nodes.push(currentNode.parent);
        currentNode = currentNode.parent;
      }
    }
    return nodes.reverse();
  }

  /**
   * Executes `getNodeByPath` to locate a node by an array of IDs.
   * @zh 执行 `getNodeByPath`，按路径标识数组查找目标节点。
   * @param path - path parameter (`IDType[]`) / 路径标识列表参数（`IDType[]`）
   * @param startNode - start node parameter (`TreeNode`) / 起始查找节点参数（`TreeNode`）
   * @returns Result of type `TreeNode` / 类型为 `TreeNode` 的返回值
   */
  getNodeByPath(path: IDType[] | null | undefined, startNode: TreeNode | null = null): TreeNode | null {
    if (!path) {
      return null;
    }

    const currentStart = startNode || this.virtualRoot;
    if (!currentStart) {
      return null;
    }
    if (path.length === 0) {
      return currentStart;
    }
    if (!currentStart.children) {
      return null;
    }

    const childId = path.shift();
    const childNode = find(currentStart.children, (n: TreeNode) => n.id === childId);
    if (!childNode) {
      return null;
    }
    return this.getNodeByPath(path, childNode);
  }

  // ✨ 核心优化：直接从 Map 获取，摒弃全树查找
  /**
   * Executes `getNodeById` to locate a node in O(1) from `nodeRegistry`.
   * @zh 执行 `getNodeById`，通过 `nodeRegistry` 以 O(1) 复杂度按 ID 获取节点。
   * @param id - id parameter (`IDType`) / 节点标识参数（`IDType`）
   * @returns Result of type `TreeNode` / 类型为 `TreeNode` 的返回值
   */
  getNodeById(id: IDType | null | undefined): TreeNode | null | undefined {
    if (id === null || id === undefined) {
      return null;
    }
    return this.nodeRegistry.get(id.toString());
  }

  // 保留原有方法供兼容，但核心业务不再依赖此低效方法
  /**
   * Executes `getNodeBy` to search nodes recursively using a predicate or partial match.
   * @zh 执行 `getNodeBy`，按断言函数或属性匹配递归检索节点。
   * @param predicate - predicate parameter (`Record<string, unknown> | ((node: TreeNode) => boolean)`) / 匹配条件参数（`Record<string, unknown> | ((node: TreeNode) => boolean)`）
   * @param startNode - start node parameter (`TreeNode`) / 起始节点参数（`TreeNode`）
   * @returns Result of type `TreeNode` / 类型为 `TreeNode` 的返回值
   */
  getNodeBy(
    predicate: ((node: TreeNode) => boolean) | Record<string, unknown>,
    startNode: TreeNode | null = null,
  ): TreeNode | null | undefined {
    const currentStart = startNode || this.virtualRoot;
    if (!currentStart || !currentStart.children) {
      return null;
    }
    const found = find(currentStart.children, predicate as (node: TreeNode) => boolean);
    if (found) {
      return found;
    }
    for (const child of currentStart.children) {
      const foundInChildren = this.getNodeBy(predicate, child);
      if (foundInChildren) {
        return foundInChildren;
      }
    }
    return null;
  }

  /**
   * Executes `isExpanded` to read Signal-tracked expansion state of a node.
   * @zh 执行 `isExpanded`，读取 Signal 追踪的节点展开状态。
   * @param node - node parameter (`TreeNode`) / 节点参数（`TreeNode`）
   * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
   */
  isExpanded(node: TreeNode): boolean {
    return Boolean(this._expandedNodeIdsSig()[String(node.id)]);
  }

  /**
   * Executes `isHidden` to read Signal-tracked visibility state of a node.
   * @zh 执行 `isHidden`，读取 Signal 追踪的节点隐藏状态。
   * @param node - node parameter (`TreeNode`) / 节点参数（`TreeNode`）
   * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
   */
  isHidden(node: TreeNode): boolean {
    return Boolean(this._hiddenNodeIdsSig()[String(node.id)]);
  }

  /**
   * Executes `isActive` to read Signal-tracked active state of a node.
   * @zh 执行 `isActive`，读取 Signal 追踪的节点激活状态。
   * @param node - node parameter (`TreeNode`) / 节点参数（`TreeNode`）
   * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
   */
  isActive(node: TreeNode): boolean {
    return Boolean(this._activeNodeIdsSig()[String(node.id)]);
  }

  /**
   * Executes `isSelected` to read Signal-tracked checkbox selection state of a node.
   * @zh 执行 `isSelected`，读取 Signal 追踪的节点勾选状态。
   * @param node - node parameter (`TreeNode`) / 节点参数（`TreeNode`）
   * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
   */
  isSelected(node: TreeNode): boolean {
    return Boolean(this._selectedLeafNodeIdsSig()[String(node.id)]);
  }

  /**
   * Executes `setEvents` to bind event emitters from `TreeComponent`.
   * @zh 执行 `setEvents`，绑定来自宿主树组件的事件发射器映射。
   * @param events - events parameter (`object`) / 事件发射器字典（`object`）
   */
  setEvents(events: object): void {
    this.events = events as Record<string, EventEmitter<Record<string, unknown>>>;
  }

  /**
   * Angular lifecycle hook invoked just before the component, directive, or service is destroyed to release subscriptions and resources.
   * @zh Angular 生命周期钩子：销毁树模型实例并清理所有注册表与事件订阅。
   */
  ngOnDestroy(): void {
    this.dispose();
    this.stateListeners = [];
    this.layoutListeners = [];
    this.unsubscribeAll();
  }

  /**
   * Executes `dispose` to dispose virtual root and clear `nodeRegistry`.
   * @zh 执行 `dispose`，释放虚拟根节点并清空节点注册表缓存。
   */
  dispose(): void {
    const vRoot = this._virtualRootSig();
    if (vRoot) {
      vRoot.dispose();
    }
    this.nodeRegistry.clear();
  }

  /**
   * Executes `unsubscribeAll` to unsubscribe all RxJS event subscriptions.
   * @zh 执行 `unsubscribeAll`，取消全部事件订阅。
   */
  unsubscribeAll(): void {
    this.subscriptions.slice().forEach((subscription: Subscription) => subscription.unsubscribe());
    this.subscriptions = [];
  }

  /**
   * Executes `setData` to initialize or update tree nodes, options, and events.
   * @zh 执行 `setData`，设置或更新树节点数据、配置项与事件映射。
   * @param config - config parameter (`{ nodes?: Record<string, unknown>[] | null; options?: ITreeOptions | TreeOptions | null; events?: Record<string, EventEmitter<Record<string, unknown>>> | null }`) / 数据与配置参数（`{ nodes?: Record<string, unknown>[] | null; options?: ITreeOptions | TreeOptions | null; events?: Record<string, EventEmitter<Record<string, unknown>>> | null }`）
   */
  setData({
    nodes,
    options = null,
    events = null,
  }: {
    nodes?: Record<string, unknown>[] | null;
    options?: ITreeOptions | TreeOptions | null;
    events?: object | null;
  }): void {
    if (options) {
      if (options instanceof TreeOptions) {
        this.options = options;
      } else {
        this.options = new TreeOptions(options);
      }
    }
    if (events) {
      this.events = events as Record<string, EventEmitter<Record<string, unknown>>>;
    }
    if (nodes !== undefined) {
      this.nodes = nodes;
    }
    this.update();
  }

  /**
   * Executes `update` to rebuild `virtualRoot` and `roots` Signals from `this.nodes`.
   * @zh 执行 `update`，基于当前原始节点重建 `virtualRoot` 与 `roots` Signal 状态。
   */
  update(): void {
    const virtualRootConfig: Record<string, unknown> = {
      id: this.options.rootId,
      virtual: true,
      [this.options.childrenField]: this.nodes,
    };
    this.dispose();
    const nextVirtualRoot = new TreeNode(virtualRootConfig, null, this, 0);
    this._virtualRootSig.set(nextVirtualRoot);
    this._rootsSig.set(nextVirtualRoot.children ?? []);
    if (this.nodes && this.nodes.length > 0) {
      this._calculateExpandedNodes();
    }
    this._notifyLayoutListeners();
    this.fireEvent({ eventName: TREE_EVENTS.updateData });
  }

  /**
   * Executes `setFocusedNode` to update the focused node Signal.
   * @zh 执行 `setFocusedNode`，更新当前聚焦节点标识 Signal。
   * @param node - node parameter (`TreeNode`) / 目标聚焦节点参数（`TreeNode`）
   */
  setFocusedNode(node: TreeNode | null): void {
    this._focusedNodeIdSig.set(node ? node.id : null);
    this._notifyStateListeners();
  }

  /**
   * Executes `setFocus` to set or clear tree-level focus state.
   * @zh 执行 `setFocus`，设置或清除树级聚焦状态。
   * @param value - value parameter (`boolean`) / 是否聚焦参数（`boolean`）
   */
  setFocus(value: boolean): void {
    TreeModel.focusedTree = value ? this : null;
  }

  /**
   * Executes `doForAll` to run an async/sync callback across every node in the tree.
   * @zh 执行 `doForAll`，对全树所有节点依次执行回调函数。
   * @param fn - fn parameter (`(node: TreeNode) => unknown`) / 节点处理函数参数（`(node: TreeNode) => unknown`）
   */
  doForAll(fn: (node: TreeNode) => unknown): void {
    this.roots.forEach((root: TreeNode) => root.doForAll(fn));
  }

  /**
   * Executes `focusNextNode` to move keyboard focus to the next visible node.
   * @zh 执行 `focusNextNode`，将键盘焦点移动至下一个可见节点。
   */
  focusNextNode(): void {
    const previousNode = this.getFocusedNode();
    const nextNode = previousNode ? previousNode.findNextNode(true, true) : this.getFirstRoot(true);
    if (nextNode) {
      nextNode.focus();
    }
  }

  /**
   * Executes `focusPreviousNode` to move keyboard focus to the previous visible node.
   * @zh 执行 `focusPreviousNode`，将键盘焦点移动至上一个可见节点。
   */
  focusPreviousNode(): void {
    const previousNode = this.getFocusedNode();
    const nextNode = previousNode ? previousNode.findPreviousNode(true) : this.getLastRoot(true);
    if (nextNode) {
      nextNode.focus();
    }
  }

  /**
   * Executes `focusFirstNode` to move keyboard focus to the first visible root node (WAI-ARIA Home key).
   * @zh 执行 `focusFirstNode`，将焦点移至首个可见节点（对应 WAI-ARIA `Home` 键）。
   */
  focusFirstNode(): void {
    const firstRoot = this.getFirstRoot(true);
    if (firstRoot) {
      firstRoot.focus();
    }
  }

  /**
   * Executes `focusLastNode` to move keyboard focus to the last open visible node (WAI-ARIA End key).
   * @zh 执行 `focusLastNode`，将焦点移至最后一个可见展开后代节点（对应 WAI-ARIA `End` 键）。
   */
  focusLastNode(): void {
    const lastRoot = this.getLastRoot(true);
    if (lastRoot) {
      const target = lastRoot._getLastOpenDescendant(true);
      if (target) {
        target.focus();
      }
    }
  }

  /**
   * Executes `focusDrillDown` to expand collapsed parent or focus first child (WAI-ARIA ArrowRight).
   * @zh 执行 `focusDrillDown`，展开当前折叠父节点或将焦点移入首个子节点（对应 WAI-ARIA 右方向键）。
   */
  focusDrillDown(): void {
    const previousNode = this.getFocusedNode();
    if (previousNode && previousNode.isCollapsed && previousNode.hasChildren) {
      previousNode.toggleExpanded(false);
    } else {
      const nextNode = previousNode ? previousNode.getFirstChild(true) : this.getFirstRoot(true);
      if (nextNode) {
        nextNode.focus();
      }
    }
  }

  /**
   * Executes `focusDrillUp` to collapse expanded node or focus parent node (WAI-ARIA ArrowLeft).
   * @zh 执行 `focusDrillUp`，折叠当前展开节点或回退焦点至父节点（对应 WAI-ARIA 左方向键）。
   */
  focusDrillUp(): void {
    const previousNode = this.getFocusedNode();
    if (!previousNode) {
      return;
    }
    if (previousNode.isExpanded) {
      previousNode.toggleExpanded(false);
    } else {
      const nextNode = previousNode.realParent;
      if (nextNode) {
        nextNode.focus();
      }
    }
  }

  /**
   * Executes `setActiveNode` to activate or deactivate a node via immutable Signal update.
   * @zh 执行 `setActiveNode`，通过 Signal 不可变更新激活或取消激活指定节点。
   * @param node - node parameter (`TreeNode`) / 目标节点参数（`TreeNode`）
   * @param value - value parameter (`boolean`) / 是否激活参数（`boolean`）
   * @param multi - multi parameter (`boolean`) / 是否多选激活参数（`boolean`）
   */
  setActiveNode(node: TreeNode, value: boolean, multi = false): void {
    if (multi) {
      this._setActiveNodeMulti(node, value);
    } else {
      this._setActiveNodeSingle(node, value);
    }

    if (value) {
      node.focus(this.options.scrollOnActivate);
      this.fireEvent({ eventName: TREE_EVENTS.activate, node });
      this.fireEvent({ eventName: TREE_EVENTS.nodeActivate, node });
    } else {
      this.fireEvent({ eventName: TREE_EVENTS.deactivate, node });
      this.fireEvent({ eventName: TREE_EVENTS.nodeDeactivate, node });
    }
  }

  /**
   * Executes `setSelectedNode` to update leaf selection Signal immutably.
   * @zh 执行 `setSelectedNode`，通过不可变字典更新节点勾选状态 Signal。
   * @param node - node parameter (`TreeNode`) / 目标节点参数（`TreeNode`）
   * @param value - value parameter (`boolean`) / 是否选中参数（`boolean`）
   * @param silent - silent parameter (`boolean`) / 是否静默不派发事件参数（`boolean`）
   */
  setSelectedNode(node: TreeNode, value: boolean, silent?: boolean): void {
    const key = String(node.id);
    this._selectedLeafNodeIdsSig.update((prev: Record<string, boolean>) => {
      if (value) {
        if (prev[key]) {
          return prev;
        }
        return { ...prev, [key]: true };
      }
      if (!prev[key]) {
        return prev;
      }
      const next = { ...prev };
      delete next[key];
      return next;
    });
    this._notifyStateListeners();

    if (value) {
      node.focus();
      if (!silent) {
        this.fireEvent({ eventName: TREE_EVENTS.select, node });
      }
    } else if (!silent) {
      this.fireEvent({ eventName: TREE_EVENTS.deselect, node });
    }
  }

  /**
   * Executes `setExpandedNode` to expand or collapse a node via immutable Signal update.
   * @zh 执行 `setExpandedNode`，通过不可变字典更新节点展开态 Signal 并触发懒加载检查与布局重算。
   * @param node - node parameter (`TreeNode`) / 目标节点参数（`TreeNode`）
   * @param value - value parameter (`boolean`) / 是否展开参数（`boolean`）
   * @param silent - silent parameter (`boolean`) / 是否静默不派发事件参数（`boolean`）
   */
  setExpandedNode(node: TreeNode, value: boolean, silent?: boolean): void {
    const key = String(node.id);
    this._expandedNodeIdsSig.update((prev: Record<string, boolean>) => {
      if (value) {
        if (prev[key]) {
          return prev;
        }
        return { ...prev, [key]: true };
      }
      if (!prev[key]) {
        return prev;
      }
      const next = { ...prev };
      delete next[key];
      return next;
    });

    if (value) {
      node._checkAutoLoadChildren();
    }
    this._notifyLayoutListeners();
    this._notifyStateListeners();

    if (!silent) {
      this.fireEvent({ eventName: TREE_EVENTS.toggleExpanded, node, isExpanded: value });
    }
  }

  /**
   * Executes `expandAll` to expand all nodes in the tree.
   * @zh 执行 `expandAll`，展开全树所有节点。
   */
  expandAll(): void {
    this.roots.forEach((root: TreeNode) => root.expandAll());
  }

  /**
   * Executes `collapseAll` to collapse all nodes in the tree.
   * @zh 执行 `collapseAll`，折叠全树所有节点。
   */
  collapseAll(): void {
    this.roots.forEach((root: TreeNode) => root.collapseAll());
  }

  /**
   * Executes `setIsHidden` to hide or show a single node via immutable Signal update.
   * @zh 执行 `setIsHidden`，通过不可变字典更新单个节点的隐藏状态 Signal。
   * @param node - node parameter (`TreeNode`) / 目标节点参数（`TreeNode`）
   * @param value - value parameter (`boolean`) / 是否隐藏参数（`boolean`）
   */
  setIsHidden(node: TreeNode, value: boolean): void {
    const key = String(node.id);
    this._hiddenNodeIdsSig.update((prev: Record<string, boolean>) => {
      if (value) {
        if (prev[key]) {
          return prev;
        }
        return { ...prev, [key]: true };
      }
      if (!prev[key]) {
        return prev;
      }
      const next = { ...prev };
      delete next[key];
      return next;
    });
    this._notifyLayoutListeners();
    this._notifyStateListeners();
  }

  /**
   * Executes `setHiddenNodeIds` to bulk-set hidden node IDs.
   * @zh 执行 `setHiddenNodeIds`，批量设置隐藏节点标识列表。
   * @param nodeIds - node ids parameter (`IDType[]`) / 隐藏节点标识数组参数（`IDType[]`）
   */
  setHiddenNodeIds(nodeIds: IDType[]): void {
    const newHidden: Record<string, boolean> = {};
    nodeIds.forEach((id: IDType) => {
      newHidden[String(id)] = true;
    });
    this.hiddenNodeIds = newHidden;
  }

  /**
   * Executes `performKeyAction` to handle keyboard events mapped in `options.actionMapping.keys`.
   * @zh 执行 `performKeyAction`，根据按键码执行动作映射表中的键盘导航操作。
   * @param node - node parameter (`TreeNode`) / 当前节点参数（`TreeNode`）
   * @param $event - event parameter (`KeyboardEvent`) / 键盘事件参数（`KeyboardEvent`）
   * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
   */
  performKeyAction(node: TreeNode, $event: KeyboardEvent): boolean {
    const keysMap = this.options.actionMapping.keys;
    const keyAction = keysMap ? keysMap[$event.keyCode] : undefined;
    if (keyAction) {
      $event.preventDefault();
      keyAction(this, node, $event);
      return true;
    }
    return false;
  }

  /**
   * Executes `filterNodes` to filter visible tree nodes by string or predicate function.
   * @zh 执行 `filterNodes`，按关键字字符串或断言函数过滤树节点并自动展开匹配祖先路径。
   * @param filter - filter parameter (`string | ((node: TreeNode) => boolean)`) / 过滤条件参数（`string | ((node: TreeNode) => boolean)`）
   * @param autoShow - auto show parameter (`boolean`) / 是否自动展开可见路径参数（`boolean`）
   */
  filterNodes(filter: string | ((node: TreeNode) => boolean) | null | undefined, autoShow = true): void {
    let filterFn: (node: TreeNode) => boolean;

    if (!filter) {
      this.clearFilter();
      return;
    }

    if (isString(filter)) {
      const lowered = filter.toLowerCase();
      filterFn = (node: TreeNode): boolean => String(node.displayField).toLowerCase().indexOf(lowered) !== -1;
    } else if (isFunction(filter)) {
      filterFn = filter;
    } else {
      console.error("Don't know what to do with filter", filter);
      console.error('Should be either a string or function');
      return;
    }

    const ids: Record<string, boolean> = {};
    this.roots.forEach((node: TreeNode) => this._filterNode(ids, node, filterFn, autoShow));
    this.hiddenNodeIds = ids;
    this.fireEvent({ eventName: TREE_EVENTS.changeFilter });
  }

  /**
   * Executes `clearFilter` to clear all node filter hidden flags.
   * @zh 执行 `clearFilter`，清除所有隐藏节点过滤状态。
   */
  clearFilter(): void {
    const emptyHidden: Record<string, boolean> = {};
    this.hiddenNodeIds = emptyHidden;
    this.fireEvent({ eventName: TREE_EVENTS.changeFilter });
  }

  /**
   * Executes `moveNode` to move a node to a new parent and index.
   * @zh 执行 `moveNode`，将节点移动至新的父节点及索引位置。
   * @param node - node parameter (`TreeNode`) / 待移动节点参数（`TreeNode`）
   * @param to - to parameter (`ITreeDropTarget`) / 目标位置参数（`ITreeDropTarget`）
   */
  moveNode(nodeItem: ITreeNode, to: ITreeDropTarget): void {
    const node = nodeItem as TreeNode;
    const toParent = to.parent as TreeNode;
    const fromIndex = node.getIndexInParent();
    const fromParent = node.parent;
    if (!fromParent || !this.canMoveNode(node, to, fromIndex)) {
      return;
    }

    const fromChildren = fromParent.getField('children') as Record<string, unknown>[];
    if (!toParent.getField('children')) {
      toParent.setField('children', []);
    }
    const toChildren = toParent.getField('children') as Record<string, unknown>[];

    const originalNode = fromChildren.splice(fromIndex, 1)[0];
    const toIndex = fromParent === toParent && to.index > fromIndex ? to.index - 1 : to.index;

    toChildren.splice(toIndex, 0, originalNode);

    fromParent.treeModel.update();
    if (toParent.treeModel !== fromParent.treeModel) {
      toParent.treeModel.update();
    }

    this.fireEvent({
      eventName: TREE_EVENTS.moveNode,
      node: originalNode,
      to: { parent: toParent.data, index: toIndex },
      from: { parent: fromParent.data, index: fromIndex },
    });
  }

  /**
   * Executes `removeNode` to remove a node from its parent and update the tree.
   * @zh 执行 `removeNode`，从父节点中移除指定节点并刷新树状态。
   * @param node - node parameter (`TreeNode`) / 待移除节点参数（`TreeNode`）
   */
  removeNode(node: TreeNode): void {
    const fromIndex = node.getIndexInParent();
    const fromParent = node.parent;
    if (!fromParent) {
      return;
    }
    const fromChildren = fromParent.getField('children') as Record<string, unknown>[];
    const originalNode = fromChildren.splice(fromIndex, 1)[0];
    fromParent.setField('hasChildren', fromChildren.length > 0);
    fromParent.treeModel.update();
    this.fireEvent({ eventName: TREE_EVENTS.removeNode, node: originalNode });
  }

  /**
   * Executes `copyNode` to clone and insert a node at the target location.
   * @zh 执行 `copyNode`，克隆节点并插入到目标父节点指定索引处。
   * @param node - node parameter (`TreeNode`) / 源节点参数（`TreeNode`）
   * @param to - to parameter (`ITreeDropTarget`) / 目标位置参数（`ITreeDropTarget`）
   */
  copyNode(nodeItem: ITreeNode, to: ITreeDropTarget): void {
    const node = nodeItem as TreeNode;
    const toParent = to.parent as TreeNode;
    const fromIndex = node.getIndexInParent();
    if (!this.canMoveNode(node, to, fromIndex)) {
      return;
    }

    if (!toParent.getField('children')) {
      toParent.setField('children', []);
    }
    const toChildren = toParent.getField('children') as Record<string, unknown>[];
    const nodeCopy = this.options.getNodeClone(node);

    toChildren.splice(to.index, 0, nodeCopy);

    node.treeModel.update();
    if (toParent.treeModel !== node.treeModel) {
      toParent.treeModel.update();
    }

    this.fireEvent({ eventName: TREE_EVENTS.copyNode, node: nodeCopy, to: { parent: toParent.data, index: to.index } });
  }

  /**
   * Executes `getState` to return the current serializable tree state snapshot.
   * @zh 执行 `getState`，返回当前树状态的快照对象。
   * @returns Result of type `ITreeState` / 类型为 `ITreeState` 的返回值
   */
  getState(): ITreeState {
    return {
      expandedNodeIds: this.expandedNodeIds,
      selectedLeafNodeIds: this.selectedLeafNodeIds,
      activeNodeIds: this.activeNodeIds,
      hiddenNodeIds: this.hiddenNodeIds,
      focusedNodeId: this.focusedNodeId,
    };
  }

  /**
   * Executes `setState` to restore a tree state snapshot.
   * @zh 执行 `setState`，根据传入的状态快照恢复展开、选中、激活、隐藏与聚焦状态。
   * @param state - state parameter (`ITreeState`) / 状态快照参数（`ITreeState`）
   */
  setState(state: ITreeState | null | undefined): void {
    if (!state) {
      return;
    }
    if (state.expandedNodeIds) {
      this.expandedNodeIds = state.expandedNodeIds;
    }
    if (state.selectedLeafNodeIds) {
      this.selectedLeafNodeIds = state.selectedLeafNodeIds;
    }
    if (state.activeNodeIds) {
      this.activeNodeIds = state.activeNodeIds;
    }
    if (state.hiddenNodeIds) {
      this.hiddenNodeIds = state.hiddenNodeIds;
    }
    if (state.focusedNodeId !== undefined) {
      this.focusedNodeId = state.focusedNodeId;
    }
  }

  /**
   * Executes `subscribeToState` to subscribe to tree state updates without MobX `autorun`.
   * @zh 执行 `subscribeToState`，在零 MobX 模式下立即回调并持续监听树状态变更。
   * @param fn - fn parameter (`(state: ITreeState) => void`) / 状态监听回调参数（`(state: ITreeState) => void`）
   * @returns Result of type `() => void` / 类型为 `() => void` 的返回值
   */
  subscribeToState(fn: (state: ITreeState) => void): () => void {
    this.stateListeners.push(fn);
    fn(this.getState());
    return (): void => {
      const idx = this.stateListeners.indexOf(fn);
      if (idx !== -1) {
        this.stateListeners.splice(idx, 1);
      }
    };
  }

  /**
   * Executes `canMoveNode` to validate whether a node move/copy is allowed.
   * @zh 执行 `canMoveNode`，校验节点是否允许移动至目标位置（防止移入自身后代）。
   * @param node - node parameter (`TreeNode`) / 源节点参数（`TreeNode`）
   * @param to - to parameter (`ITreeDropTarget`) / 目标位置参数（`ITreeDropTarget`）
   * @param fromIndex - from index parameter (`number`) / 源索引参数（`number`）
   * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
   */
  canMoveNode(nodeItem: ITreeNode, to: ITreeDropTarget, fromIndex: number | undefined = undefined): boolean {
    const node = nodeItem as TreeNode;
    const toParent = to.parent as TreeNode;
    if (node.parent === toParent && fromIndex === to.index) {
      return false;
    }
    return !toParent.isDescendantOf(node);
  }

  /**
   * Executes `calculateExpandedNodes` to synchronize expanded IDs from node data `isExpandedField`.
   * @zh 执行 `calculateExpandedNodes`，扫描节点数据中的默认展开字段并同步展开状态。
   */
  calculateExpandedNodes(): void {
    this._calculateExpandedNodes();
  }

  private _filterNode(
    ids: Record<string, boolean>,
    node: TreeNode,
    filterFn: (node: TreeNode) => boolean,
    autoShow: boolean,
  ): boolean {
    let isVisible = filterFn(node);

    if (node.children) {
      node.children.forEach((child: TreeNode) => {
        if (this._filterNode(ids, child, filterFn, autoShow)) {
          isVisible = true;
        }
      });
    }

    if (!isVisible) {
      ids[String(node.id)] = true;
    }
    if (autoShow && isVisible) {
      node.ensureVisible();
    }
    return isVisible;
  }

  private _calculateExpandedNodes(): void {
    const newExpanded: Record<string, boolean> = { ...this._expandedNodeIdsSig() };
    const nodesToLoad: TreeNode[] = [];

    const traverse = (node: TreeNode): void => {
      // 当发现数据中要求节点默认展开时
      if (node.data && node.data[this.options.isExpandedField]) {
        newExpanded[String(node.id)] = true;
        if (node.hasChildren && (node.data.children === undefined || node.data.children === null)) {
          nodesToLoad.push(node);
        }
      }
      if (node.children) {
        node.children.forEach(traverse);
      }
    };

    const vRoot = this._virtualRootSig();
    if (vRoot) {
      traverse(vRoot);
    }

    this._expandedNodeIdsSig.set(newExpanded);
    this._notifyLayoutListeners();
    this._notifyStateListeners();

    if (nodesToLoad.length > 0) {
      setTimeout(() => {
        nodesToLoad.forEach((node: TreeNode) => {
          void node.loadNodeChildren();
        });
      }, 10);
    }
  }

  private _setActiveNodeSingle(node: TreeNode, value: boolean): void {
    this.activeNodes
      .filter((activeNode: TreeNode) => activeNode !== node)
      .forEach((activeNode: TreeNode) => {
        this.fireEvent({ eventName: TREE_EVENTS.deactivate, node: activeNode });
        this.fireEvent({ eventName: TREE_EVENTS.nodeDeactivate, node: activeNode });
      });

    if (value) {
      this._activeNodeIdsSig.set({ [String(node.id)]: true });
    } else {
      const emptyActive: Record<string, boolean> = {};
      this._activeNodeIdsSig.set(emptyActive);
    }
    this._notifyStateListeners();
  }

  private _setActiveNodeMulti(node: TreeNode, value: boolean): void {
    const key = String(node.id);
    this._activeNodeIdsSig.update((prev: Record<string, boolean>) => {
      if (value) {
        if (prev[key]) {
          return prev;
        }
        return { ...prev, [key]: true };
      }
      if (!prev[key]) {
        return prev;
      }
      const next = { ...prev };
      delete next[key];
      return next;
    });
    this._notifyStateListeners();
  }
}
