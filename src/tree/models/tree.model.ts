/**
 * @fileoverview Module `src/tree/models/tree.model.ts` providing tree model definitions and implementation.
 * @zh 模块文件 `src/tree/models/tree.model.ts`，提供树形控件模型相关的定义与实现。
 */

import { Injectable, OnDestroy } from '@angular/core';
import { TranslateService } from '@dotos/dui/translator';

import { Subscription } from 'rxjs';
import { TREE_EVENTS } from '../constants/events';
import { IDType, IDTypeDictionary, ITreeModel, ITreeOptions } from '../defs/api';
import { TreeNode } from './tree-node.model';
import { TreeOptions } from './tree-options.model';
import { TreeVirtualScroll } from './tree-virtual-scroll.model';
import { first, last, compact, find, isString, isFunction } from 'lodash-es';
import { action, autorun, computed, makeObservable, observable, set, remove, get } from 'mobx';

interface TreeEventEmitterLike {
  emit(event: unknown): void;
  subscribe(fn: (event: unknown) => void): Subscription;
  unsubscribe?(fn: (event: unknown) => void): void;
}

type TreeEventMap = {
  event?: TreeEventEmitterLike;
  [key: string]: TreeEventEmitterLike;
};
/**
 * Injectable Angular service `TreeModel` managing tree model state and operations in `src/tree/models`.
 * @zh 可注入的 Angular 服务 `TreeModel`，管理 `src/tree/models` 中的树形控件模型状态与业务操作。
 */
@Injectable()
export class TreeModel implements ITreeModel, OnDestroy {
  /**
   * Property `focusedTree` (`any`) storing focused tree (default: `null`).
   * @zh 属性 `focusedTree`（类型：`any`），用于存储或配置已聚焦树形控件（默认值：`null`）。
   */
  static focusedTree = null;

  /**
   * Property `options` (`TreeOptions`) storing options (default: `new TreeOptions()`).
   * @zh 属性 `options`（类型：`TreeOptions`），用于存储或配置配置选项（默认值：`new TreeOptions()`）。
   */
  options: TreeOptions = new TreeOptions();
  /**
   * Property `nodes` (`any`) storing nodes.
   * @zh 属性 `nodes`（类型：`any`），用于存储或配置节点列表。
   */
  nodes;
  /**
   * Property `eventNames` (`string[]`) storing event names (default: `Object.keys(TREE_EVENTS)`).
   * @zh 属性 `eventNames`（类型：`string[]`），用于存储或配置事件名称列表（默认值：`Object.keys(TREE_EVENTS)`）。
   */
  eventNames = Object.keys(TREE_EVENTS);
  /**
   * Property `virtualScroll` (`TreeVirtualScroll`) storing virtual scroll.
   * @zh 属性 `virtualScroll`（类型：`TreeVirtualScroll`），用于存储或配置虚拟滚动滚动。
   */
  virtualScroll: TreeVirtualScroll;

  /**
   * Property `roots` (`TreeNode[]`) storing roots.
   * @zh 属性 `roots`（类型：`TreeNode[]`），用于存储或配置根节点。
   */
  @observable roots: TreeNode[] = undefined;
  /**
   * Property `expandedNodeIds` (`IDTypeDictionary`) storing expanded node ids (default: `{}`).
   * @zh 属性 `expandedNodeIds`（类型：`IDTypeDictionary`），用于存储或配置已展开节点标识列表（默认值：`{}`）。
   */
  @observable expandedNodeIds: IDTypeDictionary = {};
  /**
   * Property `selectedLeafNodeIds` (`IDTypeDictionary`) storing selected leaf node ids (default: `{}`).
   * @zh 属性 `selectedLeafNodeIds`（类型：`IDTypeDictionary`），用于存储或配置已选中叶子节点节点标识列表（默认值：`{}`）。
   */
  @observable selectedLeafNodeIds: IDTypeDictionary = {};
  /**
   * Property `activeNodeIds` (`IDTypeDictionary`) storing active node ids (default: `{}`).
   * @zh 属性 `activeNodeIds`（类型：`IDTypeDictionary`），用于存储或配置激活节点标识列表（默认值：`{}`）。
   */
  @observable activeNodeIds: IDTypeDictionary = {};
  /**
   * Property `hiddenNodeIds` (`IDTypeDictionary`) storing hidden node ids (default: `{}`).
   * @zh 属性 `hiddenNodeIds`（类型：`IDTypeDictionary`），用于存储或配置隐藏节点标识列表（默认值：`{}`）。
   */
  @observable hiddenNodeIds: IDTypeDictionary = {};
  /**
   * Property `focusedNodeId` (`IDType`) storing focused node id (default: `null`).
   * @zh 属性 `focusedNodeId`（类型：`IDType`），用于存储或配置已聚焦节点唯一标识（默认值：`null`）。
   */
  @observable focusedNodeId: IDType = null;
  /**
   * Property `virtualRoot` (`TreeNode`) storing virtual root.
   * @zh 属性 `virtualRoot`（类型：`TreeNode`），用于存储或配置虚拟滚动根节点。
   */
  @observable virtualRoot: TreeNode = undefined;

  /**
   * Property `firstUpdate` (`boolean`) storing first update (default: `true`).
   * @zh 属性 `firstUpdate`（类型：`boolean`），用于存储或配置首个更新（默认值：`true`）。
   */
  public firstUpdate = true;
  /**
   * Property `events` (`TreeEventMap`) storing events (default: `{}`).
   * @zh 属性 `events`（类型：`TreeEventMap`），用于存储或配置事件集合（默认值：`{}`）。
   */
  private events: TreeEventMap = {};
  /**
   * Property `subscriptions` (`Subscription[]`) storing subscriptions (default: `[]`).
   * @zh 属性 `subscriptions`（类型：`Subscription[]`），用于存储或配置订阅集合（默认值：`[]`）。
   */
  private subscriptions: Subscription[] =[];
  /**
   * Property `mobxDisposers` (`(() => void)[]`) storing mobx disposers (default: `[]`).
   * @zh 属性 `mobxDisposers`（类型：`(() => void)[]`），用于存储或配置mobxDisposers（默认值：`[]`）。
   */
  private mobxDisposers: Array<() => void> = [];

  /**
   * Property `idSet` (`Set<string>`) storing id set (default: `new Set()`).
   * @zh 属性 `idSet`（类型：`Set<string>`），用于存储或配置唯一标识集合（默认值：`new Set()`）。
   */
  public idSet: Set<string> = new Set();
  
  // ✨ 核心优化：新增 O(1) 复杂度的节点注册表缓存
  /**
   * Property `nodeRegistry` (`Map<string, TreeNode>`) storing node registry (default: `new Map<string, TreeNode>()`).
   * @zh 属性 `nodeRegistry`（类型：`Map<string, TreeNode>`），用于存储或配置节点Registry（默认值：`new Map<string, TreeNode>()`）。
   */
  public nodeRegistry = new Map<string, TreeNode>();

  /**
   * Creates an instance of `TreeModel` and initializes its dependencies and internal state.
   * @zh 创建 `TreeModel` 实例，并初始化其依赖项与内部状态。
   * @param translator - Injected or initial translator (`TranslateService`) / 注入或传入的翻译器（`TranslateService`）
   */
  constructor(public translator: TranslateService) {
    makeObservable(this);
  }

  // events
  /**
   * Executes `fireEvent` to handle fire event.
   * @zh 执行 `fireEvent`，用于触发事件。
   * @param event - event parameter (`any`) / 事件参数（`any`）
   */
  fireEvent(event) {
    event.treeModel = this;
    if (this.events[event.eventName]) {
      this.events[event.eventName].emit(event);
      this.events.event.emit(event);
    }
  }

  /**
   * Executes `subscribe` to handle subscribe.
   * @zh 执行 `subscribe`，用于订阅。
   * @param eventName - event name parameter (`any`) / 事件名称参数（`any`）
   * @param fn - fn parameter (`any`) / 函数参数（`any`）
   */
  subscribe(eventName, fn) {
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
   * Executes `unsubscribe` to handle unsubscribe.
   * @zh 执行 `unsubscribe`，用于取消订阅。
   * @param eventName - event name parameter (`any`) / 事件名称参数（`any`）
   * @param fn - fn parameter (`any`) / 函数参数（`any`）
   */
  unsubscribe(eventName, fn) {
    return this.events[eventName].unsubscribe(fn);
  }

  // getters
  /**
   * Executes `getFocusedNode` to handle get focused node.
   * @zh 执行 `getFocusedNode`，用于获取已聚焦节点。
   * @returns Result of type `TreeNode` / 类型为 `TreeNode` 的返回值
   */
  getFocusedNode(): TreeNode {
    return this.focusedNode;
  }

  /**
   * Executes `getActiveNode` to handle get active node.
   * @zh 执行 `getActiveNode`，用于获取激活节点。
   * @returns Result of type `TreeNode` / 类型为 `TreeNode` 的返回值
   */
  getActiveNode(): TreeNode {
    return this.activeNodes[0];
  }

  /**
   * Executes `getActiveNodes` to handle get active nodes.
   * @zh 执行 `getActiveNodes`，用于获取激活节点列表。
   * @returns Result of type `TreeNode[]` / 类型为 `TreeNode[]` 的返回值
   */
  getActiveNodes(): TreeNode[] {
    return this.activeNodes;
  }

  /**
   * Executes `getVisibleRoots` to handle get visible roots.
   * @zh 执行 `getVisibleRoots`，用于获取可见根节点。
   */
  getVisibleRoots() {
    return this.virtualRoot.visibleChildren;
  }

  /**
   * Executes `getFirstRoot` to handle get first root.
   * @zh 执行 `getFirstRoot`，用于获取首个根节点。
   * @param skipHidden - skip hidden parameter (`boolean`) / skip隐藏参数（`boolean`）
   */
  getFirstRoot(skipHidden = false) {
    return first(skipHidden ? this.getVisibleRoots() : this.roots);
  }

  /**
   * Executes `getLastRoot` to handle get last root.
   * @zh 执行 `getLastRoot`，用于获取末尾根节点。
   * @param skipHidden - skip hidden parameter (`boolean`) / skip隐藏参数（`boolean`）
   */
  getLastRoot(skipHidden = false) {
    return last(skipHidden ? this.getVisibleRoots() : this.roots);
  }

  /**
   * Gets the current is focused (`isFocused: boolean`).
   * @zh 获取当前是否为已聚焦（`isFocused: boolean`）。
   */
  get isFocused(): boolean {
    return TreeModel.focusedTree === this;
  }

  /**
   * Executes `isNodeFocused` to handle is node focused.
   * @zh 执行 `isNodeFocused`，用于是否为节点已聚焦。
   * @param node - node parameter (`TreeNode`) / 节点参数（`TreeNode`）
   */
  isNodeFocused(node: TreeNode): boolean {
    return this.focusedNode === node;
  }

  /**
   * Executes `isEmptyTree` to handle is empty tree.
   * @zh 执行 `isEmptyTree`，用于是否为空树形控件。
   * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
   */
  isEmptyTree(): boolean {
    return this.roots && this.roots.length === 0;
  }

  /**
   * Gets the current focused node (`focusedNode: TreeNode`).
   * @zh 获取当前已聚焦节点（`focusedNode: TreeNode`）。
   */
  @computed get focusedNode(): TreeNode {
    return this.focusedNodeId ? this.getNodeById(this.focusedNodeId) : null;
  }

  /**
   * Gets the current expanded nodes (`expandedNodes: TreeNode[]`).
   * @zh 获取当前已展开节点列表（`expandedNodes: TreeNode[]`）。
   */
  @computed get expandedNodes(): TreeNode[] {
      const nodes = Object.keys(this.expandedNodeIds || {})
      .filter((id) => get(this.expandedNodeIds, id))
      .map((id) => this.getNodeById(id));

    return compact(nodes);
  }

  /**
   * Gets the current active nodes (`activeNodes: TreeNode[]`).
   * @zh 获取当前激活节点列表（`activeNodes: TreeNode[]`）。
   */
  @computed get activeNodes(): TreeNode[] {
   const nodes = Object.keys(this.activeNodeIds || {})
      .filter((id) => get(this.activeNodeIds, id))
      .map((id) => this.getNodeById(id));

    return compact(nodes);
  }

  /**
   * Gets the current hidden nodes (`hiddenNodes: TreeNode[]`).
   * @zh 获取当前隐藏节点列表（`hiddenNodes: TreeNode[]`）。
   */
  @computed get hiddenNodes(): TreeNode[] {
 const nodes = Object.keys(this.hiddenNodeIds || {})
      .filter((id) => get(this.hiddenNodeIds, id))
      .map((id) => this.getNodeById(id));

    return nodes.filter(Boolean);
  }
  
  /**
   * Gets the current selected leaf nodes (`selectedLeafNodes: TreeNode[]`).
   * @zh 获取当前已选中叶子节点节点列表（`selectedLeafNodes: TreeNode[]`）。
   */
  @computed get selectedLeafNodes(): TreeNode[] {
   const nodes = Object.keys(this.selectedLeafNodeIds || {})
      .filter((id) => get(this.selectedLeafNodeIds, id))
      .map((id) => this.getNodeById(id));
    return compact(nodes);
  }

  /**
   * Executes `getNodePath` to handle get node path.
   * @zh 执行 `getNodePath`，用于获取节点路径。
   * @returns Result of type `TreeNode[]` / 类型为 `TreeNode[]` 的返回值
   */
  getNodePath(): Array<TreeNode> {
    let currentNode = this.getFocusedNode();
    let nodes =[];
    if (currentNode != null) {
      nodes.push(currentNode);
      while (currentNode.parent != null) {
        nodes.push(currentNode.parent);
        currentNode = currentNode.parent;
      }
    }
    return nodes.reverse();
  }

  // locating nodes
  /**
   * Executes `getNodeByPath` to handle get node by path.
   * @zh 执行 `getNodeByPath`，用于获取节点按路径。
   * @param path - path parameter (`any`) / 路径参数（`any`）
   * @param startNode - start node parameter (`any`) / 开始节点参数（`any`）
   * @returns Result of type `TreeNode` / 类型为 `TreeNode` 的返回值
   */
  getNodeByPath(path, startNode = null): TreeNode {
    if (!path) { return null; }

    startNode = startNode || this.virtualRoot;
    if (path.length === 0) { return startNode; }

    if (!startNode.children) { return null; }

    const childId = path.shift();
    const childNode = find(startNode.children, { id: childId });

    if (!childNode) { return null; }

    return this.getNodeByPath(path, childNode);
  }

  // ✨ 核心优化：直接从 Map 获取，摒弃全树查找
  /**
   * Executes `getNodeById` to handle get node by id.
   * @zh 执行 `getNodeById`，用于获取节点按唯一标识。
   * @param id - id parameter (`any`) / 唯一标识参数（`any`）
   */
  getNodeById(id) {
    if (id === null || id === undefined) return null;
    return this.nodeRegistry.get(id.toString());
  }

  // 保留原有方法供兼容，但核心业务不再依赖此低效方法
  /**
   * Executes `getNodeBy` to handle get node by.
   * @zh 执行 `getNodeBy`，用于获取节点按。
   * @param predicate - predicate parameter (`any`) / predicate参数（`any`）
   * @param startNode - start node parameter (`any`) / 开始节点参数（`any`）
   */
  getNodeBy(predicate, startNode = null) {
    startNode = startNode || this.virtualRoot;
    if (!startNode.children) { return null; }
    const found = find(startNode.children, predicate);
    if (found) {
      return found;
    } else {
      for (const child of startNode.children) {
        const foundInChildren = this.getNodeBy(predicate, child);
        if (foundInChildren) { return foundInChildren; }
      }
    }
  }

  /**
   * Executes `isExpanded` to handle is expanded.
   * @zh 执行 `isExpanded`，用于是否为已展开。
   * @param node - node parameter (`any`) / 节点参数（`any`）
   */
  isExpanded(node) {
     return !!get(this.expandedNodeIds, String(node.id));
  }

  /**
   * Executes `isHidden` to handle is hidden.
   * @zh 执行 `isHidden`，用于是否为隐藏。
   * @param node - node parameter (`any`) / 节点参数（`any`）
   */
  isHidden(node) {
   return !!get(this.hiddenNodeIds, String(node.id));
  }

  /**
   * Executes `isActive` to handle is active.
   * @zh 执行 `isActive`，用于是否为激活。
   * @param node - node parameter (`any`) / 节点参数（`any`）
   */
  isActive(node) {
    return !!get(this.activeNodeIds, String(node.id));
  }

  /**
   * Executes `isSelected` to handle is selected.
   * @zh 执行 `isSelected`，用于是否为已选中。
   * @param node - node parameter (`any`) / 节点参数（`any`）
   */
  isSelected(node) {
     return !!get(this.selectedLeafNodeIds, String(node.id));
  }

  /**
   * Executes `setEvents` to handle set events.
   * @zh 执行 `setEvents`，用于集合事件集合。
   * @param events - events parameter (`any`) / 事件集合参数（`any`）
   */
  setEvents(events) {
    this.events = events;
  }

  /**
   * Angular lifecycle hook invoked just before the component, directive, or service is destroyed to release subscriptions and resources.
   * @zh Angular 生命周期钩子：在组件、指令或服务销毁前调用，用于释放订阅与清理资源。
   */
  ngOnDestroy() {
    this.dispose();
    this.mobxDisposers.forEach(dispose => dispose());
    this.mobxDisposers = [];
    this.unsubscribeAll();
  }

  /**
   * Executes `dispose` to handle dispose.
   * @zh 执行 `dispose`，用于释放。
   */
  dispose() {
    if (this.virtualRoot) {
      this.virtualRoot.dispose();
    }
    // 清空字典缓存
    this.nodeRegistry.clear();
  }

  /**
   * Executes `unsubscribeAll` to handle unsubscribe all.
   * @zh 执行 `unsubscribeAll`，用于取消订阅全部。
   */
  unsubscribeAll() {
    this.subscriptions.slice().forEach(subscription => subscription.unsubscribe());
    this.subscriptions =[];
  }

  // actions
  /**
   * Executes `setData` to handle set data.
   * @zh 执行 `setData`，用于集合数据。
   * @param data - data parameter (`{ nodes?: unknown; options?: ITreeOptions | TreeOptions | null; events?: Record<string, unknown> | null }`) / 数据参数（`{ nodes?: unknown; options?: ITreeOptions | TreeOptions | null; events?: Record<string, unknown> | null }`）
   */
  @action setData({
    nodes,
    options = null,
    events = null,
  }: {
    nodes?: unknown;
    options?: ITreeOptions | TreeOptions | null;
    events?: Record<string, unknown> | null;
  }) {
    if (options) {
      if (options instanceof TreeOptions) {
        this.options = options;
      } else {
        this.options = new TreeOptions(options);
      }
    }
    if (events) {
      this.events = events as TreeEventMap;
    }
    if (nodes) {
      this.nodes = nodes;
    }
    this.update();
  }

  /**
   * Executes `update` to handle update.
   * @zh 执行 `update`，用于更新。
   */
  @action update() {
     const virtualRootConfig = {
      id: this.options.rootId,
      virtual: true,
      [this.options.childrenField]: this.nodes
    };
    this.dispose();
    this.virtualRoot = new TreeNode(virtualRootConfig, null, this, 0);
    this.roots = this.virtualRoot.children;
    if (this.nodes && this.nodes.length > 0) {
      this._calculateExpandedNodes();
    }
    this.fireEvent({ eventName: TREE_EVENTS.updateData });
  }

  /**
   * Executes `setFocusedNode` to handle set focused node.
   * @zh 执行 `setFocusedNode`，用于集合已聚焦节点。
   * @param node - node parameter (`any`) / 节点参数（`any`）
   */
  @action setFocusedNode(node) {
    this.focusedNodeId = node ? node.id : null;
  }

  /**
   * Executes `setFocus` to handle set focus.
   * @zh 执行 `setFocus`，用于集合聚焦。
   * @param value - value parameter (`any`) / 值参数（`any`）
   */
  @action setFocus(value) {
    TreeModel.focusedTree = value ? this : null;
  }

  /**
   * Executes `doForAll` to handle do for all.
   * @zh 执行 `doForAll`，用于执行用于全部。
   * @param fn - fn parameter (`any`) / 函数参数（`any`）
   */
  @action doForAll(fn) {
    this.roots.forEach((root) => root.doForAll(fn));
  }

  /**
   * Executes `focusNextNode` to handle focus next node.
   * @zh 执行 `focusNextNode`，用于聚焦下一个节点。
   */
  @action focusNextNode() {
    const previousNode = this.getFocusedNode();
    const nextNode = previousNode ? previousNode.findNextNode(true, true) : this.getFirstRoot(true);
    if (nextNode) { nextNode.focus(); }
  }

  /**
   * Executes `focusPreviousNode` to handle focus previous node.
   * @zh 执行 `focusPreviousNode`，用于聚焦上一个节点。
   */
  @action focusPreviousNode() {
    const previousNode = this.getFocusedNode();
    const nextNode = previousNode ? previousNode.findPreviousNode(true) : this.getLastRoot(true);
    if (nextNode) { nextNode.focus(); }
  }

  /**
   * Executes `focusDrillDown` to handle focus drill down.
   * @zh 执行 `focusDrillDown`，用于聚焦Drill向下。
   */
  @action focusDrillDown() {
    const previousNode = this.getFocusedNode();
    if (previousNode && previousNode.isCollapsed && previousNode.hasChildren) {
      previousNode.toggleExpanded(false);
    } else {
      const nextNode = previousNode ? previousNode.getFirstChild(true) : this.getFirstRoot(true);
      if (nextNode) { nextNode.focus(); }
    }
  }

  /**
   * Executes `focusDrillUp` to handle focus drill up.
   * @zh 执行 `focusDrillUp`，用于聚焦Drill向上。
   */
  @action focusDrillUp() {
    const previousNode = this.getFocusedNode();
    if (!previousNode) { return; }
    if (previousNode.isExpanded) {
      previousNode.toggleExpanded(false);
    } else {
      const nextNode = previousNode.realParent;
      if (nextNode) { nextNode.focus(); }
    }
  }

  /**
   * Executes `setActiveNode` to handle set active node.
   * @zh 执行 `setActiveNode`，用于集合激活节点。
   * @param node - node parameter (`any`) / 节点参数（`any`）
   * @param value - value parameter (`any`) / 值参数（`any`）
   * @param multi - multi parameter (`boolean`) / 多参数（`boolean`）
   */
  @action setActiveNode(node, value, multi = false) {
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

  // ✨ 优化点：摒弃 Object.assign，直接用 set / remove 实现 MobX 极细粒度按需刷新
  /**
   * Executes `setSelectedNode` to handle set selected node.
   * @zh 执行 `setSelectedNode`，用于集合已选中节点。
   * @param node - node parameter (`any`) / 节点参数（`any`）
   * @param value - value parameter (`any`) / 值参数（`any`）
   * @param silent - silent parameter (`any`) / silent参数（`any`）
   */
  @action setSelectedNode(node, value, silent?) {
   if (value) {
      set(this.selectedLeafNodeIds, String(node.id), true);
    } else {
      remove(this.selectedLeafNodeIds, String(node.id));
    }

    if (value) {
      node.focus();
      if (!silent) {
        this.fireEvent({ eventName: TREE_EVENTS.select, node });
      }
    } else {
      if (!silent) {
        this.fireEvent({ eventName: TREE_EVENTS.deselect, node });
      }
    }
  }

  // ✨ 优化点：完全解决点击展开时的卡顿
  /**
   * Executes `setExpandedNode` to handle set expanded node.
   * @zh 执行 `setExpandedNode`，用于集合已展开节点。
   * @param node - node parameter (`any`) / 节点参数（`any`）
   * @param value - value parameter (`any`) / 值参数（`any`）
   * @param silent - silent parameter (`any`) / silent参数（`any`）
   */
  @action setExpandedNode(node, value, silent) {
  if (value) {
      set(this.expandedNodeIds, String(node.id), true);
    } else {
      remove(this.expandedNodeIds, String(node.id));
    }
    
    if (!silent) {
      this.fireEvent({ eventName: TREE_EVENTS.toggleExpanded, node, isExpanded: value });
    }
  }

  /**
   * Executes `expandAll` to handle expand all.
   * @zh 执行 `expandAll`，用于展开全部。
   */
  @action expandAll() {
    this.roots.forEach((root) => root.expandAll());
  }

  /**
   * Executes `collapseAll` to handle collapse all.
   * @zh 执行 `collapseAll`，用于折叠全部。
   */
  @action collapseAll() {
    this.roots.forEach((root) => root.collapseAll());
  }

  // ✨ 优化点：消灭 Object.assign
  /**
   * Executes `setIsHidden` to handle set is hidden.
   * @zh 执行 `setIsHidden`，用于集合是否为隐藏。
   * @param node - node parameter (`any`) / 节点参数（`any`）
   * @param value - value parameter (`any`) / 值参数（`any`）
   */
  @action setIsHidden(node, value) {
    if (value) {
      set(this.hiddenNodeIds, String(node.id), true);
    } else {
      remove(this.hiddenNodeIds, String(node.id));
    }
  }

  /**
   * Executes `setHiddenNodeIds` to handle set hidden node ids.
   * @zh 执行 `setHiddenNodeIds`，用于集合隐藏节点标识列表。
   * @param nodeIds - node ids parameter (`any`) / 节点标识列表参数（`any`）
   */
  @action setHiddenNodeIds(nodeIds) {
    const newHidden: { [id: string]: boolean } = {};
    nodeIds.forEach(id => newHidden[id] = true);
    this.hiddenNodeIds = newHidden;
  }

  /**
   * Executes `performKeyAction` to handle perform key action.
   * @zh 执行 `performKeyAction`，用于perform键动作。
   * @param node - node parameter (`any`) / 节点参数（`any`）
   * @param $event - event parameter (`any`) / 事件参数（`any`）
   */
  performKeyAction(node, $event) {
    const keyAction = this.options.actionMapping.keys[$event.keyCode];
    if (keyAction) {
      $event.preventDefault();
      keyAction(this, node, $event);
      return true;
    } else {
      return false;
    }
  }

  /**
   * Executes `filterNodes` to handle filter nodes.
   * @zh 执行 `filterNodes`，用于过滤节点列表。
   * @param filter - filter parameter (`any`) / 过滤参数（`any`）
   * @param autoShow - auto show parameter (`boolean`) / 自动显示参数（`boolean`）
   */
  @action filterNodes(filter, autoShow = true) {
    let filterFn;

    if (!filter) {
      return this.clearFilter();
    }

    if (isString(filter)) {
      filterFn = (node) => node.displayField.toLowerCase().indexOf(filter.toLowerCase()) !== -1;
    } else if (isFunction(filter)) {
      filterFn = filter;
    } else {
      console.error('Don\'t know what to do with filter', filter);
      console.error('Should be either a string or function');
      return;
    }

    const ids: { [id: string]: boolean } = {};
    this.roots.forEach((node) => this._filterNode(ids, node, filterFn, autoShow));
    this.hiddenNodeIds = ids;
    this.fireEvent({ eventName: TREE_EVENTS.changeFilter });
  }

  /**
   * Executes `clearFilter` to handle clear filter.
   * @zh 执行 `clearFilter`，用于清空过滤。
   */
  @action clearFilter() {
    this.hiddenNodeIds = {};
    this.fireEvent({ eventName: TREE_EVENTS.changeFilter });
  }

  /**
   * Executes `moveNode` to handle move node.
   * @zh 执行 `moveNode`，用于移动节点。
   * @param node - node parameter (`any`) / 节点参数（`any`）
   * @param to - to parameter (`any`) / 转换为参数（`any`）
   */
  @action moveNode(node, to) {
    const fromIndex = node.getIndexInParent();
    const fromParent = node.parent;

    if (!this.canMoveNode(node, to, fromIndex)) { return; }

    const fromChildren = fromParent.getField('children');

    if (!to.parent.getField('children')) {
      to.parent.setField('children',[]);
    }
    const toChildren = to.parent.getField('children');

    const originalNode = fromChildren.splice(fromIndex, 1)[0];

    const toIndex = (fromParent === to.parent && to.index > fromIndex) ? to.index - 1 : to.index;

    toChildren.splice(toIndex, 0, originalNode);

    fromParent.treeModel.update();
    if (to.parent.treeModel !== fromParent.treeModel) {
      to.parent.treeModel.update();
    }

    this.fireEvent({
      eventName: TREE_EVENTS.moveNode,
      node: originalNode,
      to: { parent: to.parent.data, index: toIndex },
      from: { parent: fromParent.data, index: fromIndex }
    });
  }

  /**
   * Executes `removeNode` to handle remove node.
   * @zh 执行 `removeNode`，用于移除节点。
   * @param node - node parameter (`any`) / 节点参数（`any`）
   */
  @action removeNode(node) {
    const fromIndex = node.getIndexInParent();
    const fromParent = node.parent;
    const fromChildren = fromParent.getField('children');
    const originalNode = fromChildren.splice(fromIndex, 1)[0];
    fromParent.setField('hasChildren', fromChildren.length > 0);
    fromParent.treeModel.update();
    this.fireEvent({ eventName: TREE_EVENTS.removeNode, node: originalNode });
  }

  /**
   * Executes `copyNode` to handle copy node.
   * @zh 执行 `copyNode`，用于复制节点。
   * @param node - node parameter (`any`) / 节点参数（`any`）
   * @param to - to parameter (`any`) / 转换为参数（`any`）
   */
  @action copyNode(node, to) {
    const fromIndex = node.getIndexInParent();

    if (!this.canMoveNode(node, to, fromIndex)) { return; }

    if (!to.parent.getField('children')) {
      to.parent.setField('children',[]);
    }
    const toChildren = to.parent.getField('children');

    const nodeCopy = this.options.getNodeClone(node);

    toChildren.splice(to.index, 0, nodeCopy);

    node.treeModel.update();
    if (to.parent.treeModel !== node.treeModel) {
      to.parent.treeModel.update();
    }

    this.fireEvent({ eventName: TREE_EVENTS.copyNode, node: nodeCopy, to: { parent: to.parent.data, index: to.index } });
  }

  /**
   * Executes `getState` to handle get state.
   * @zh 执行 `getState`，用于获取状态。
   */
  getState() {
    return {
      expandedNodeIds: this.expandedNodeIds,
      selectedLeafNodeIds: this.selectedLeafNodeIds,
      activeNodeIds: this.activeNodeIds,
      hiddenNodeIds: this.hiddenNodeIds,
      focusedNodeId: this.focusedNodeId
    };
  }

  /**
   * Executes `setState` to handle set state.
   * @zh 执行 `setState`，用于集合状态。
   * @param state - state parameter (`any`) / 状态参数（`any`）
   */
  @action setState(state) {
    if (!state) { return; }
    if (state.expandedNodeIds) this.expandedNodeIds = state.expandedNodeIds;
    if (state.selectedLeafNodeIds) this.selectedLeafNodeIds = state.selectedLeafNodeIds;
    if (state.activeNodeIds) this.activeNodeIds = state.activeNodeIds;
    if (state.hiddenNodeIds) this.hiddenNodeIds = state.hiddenNodeIds;
    if (state.focusedNodeId !== undefined) this.focusedNodeId = state.focusedNodeId;
  }

  /**
   * Executes `subscribeToState` to handle subscribe to state.
   * @zh 执行 `subscribeToState`，用于订阅转换为状态。
   * @param fn - fn parameter (`any`) / 函数参数（`any`）
   */
  subscribeToState(fn) {
    const dispose = autorun(() => fn(this.getState()));
    this.mobxDisposers.push(dispose);
  }

  /**
   * Executes `canMoveNode` to handle can move node.
   * @zh 执行 `canMoveNode`，用于是否可以移动节点。
   * @param node - node parameter (`any`) / 节点参数（`any`）
   * @param to - to parameter (`any`) / 转换为参数（`any`）
   * @param fromIndex - from index parameter (`any`) / 从索引参数（`any`）
   */
  canMoveNode(node, to, fromIndex = undefined) {
    if (node.parent === to.parent && fromIndex === to.index) {
      return false;
    }
    return !to.parent.isDescendantOf(node);
  }

  /**
   * Executes `calculateExpandedNodes` to handle calculate expanded nodes.
   * @zh 执行 `calculateExpandedNodes`，用于计算已展开节点列表。
   */
  calculateExpandedNodes() {
    this._calculateExpandedNodes();
  }

  /**
   * Executes `_filterNode` to handle filter node.
   * @zh 执行 `_filterNode`，用于过滤节点。
   * @param ids - ids parameter (`any`) / 标识列表参数（`any`）
   * @param node - node parameter (`any`) / 节点参数（`any`）
   * @param filterFn - filter fn parameter (`any`) / 过滤函数参数（`any`）
   * @param autoShow - auto show parameter (`any`) / 自动显示参数（`any`）
   */
  private _filterNode(ids, node, filterFn, autoShow) {
    let isVisible = filterFn(node);

    if (node.children) {
      node.children.forEach((child) => {
        if (this._filterNode(ids, child, filterFn, autoShow)) {
          isVisible = true;
        }
      });
    }

    if (!isVisible) {
      ids[node.id] = true;
    }
    if (autoShow && isVisible) {
      node.ensureVisible();
    }
    return isVisible;
  }


  /**
   * Executes `_calculateExpandedNodes` to handle calculate expanded nodes.
   * @zh 执行 `_calculateExpandedNodes`，用于计算已展开节点列表。
   * @param startNode - start node parameter (`any`) / 开始节点参数（`any`）
   */
  private _calculateExpandedNodes(startNode = null) {
    const newExpanded = { ...this.expandedNodeIds };
    const nodesToLoad =[]; 
  
    const traverse = (node) => {
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

  if (this.virtualRoot) {
      traverse(this.virtualRoot);
    }
    

    this.expandedNodeIds = newExpanded;

   if (nodesToLoad.length > 0) {
      setTimeout(() => {
        nodesToLoad.forEach(node => {
          node.loadNodeChildren();
        });
      }, 10);
    }
  }

  /**
   * Executes `_setActiveNodeSingle` to handle set active node single.
   * @zh 执行 `_setActiveNodeSingle`，用于集合激活节点单个。
   * @param node - node parameter (`any`) / 节点参数（`any`）
   * @param value - value parameter (`any`) / 值参数（`any`）
   */
  private _setActiveNodeSingle(node, value) {
      this.activeNodes
      .filter((activeNode) => activeNode !== node)
      .forEach((activeNode) => {
        this.fireEvent({ eventName: TREE_EVENTS.deactivate, node: activeNode });
        this.fireEvent({ eventName: TREE_EVENTS.nodeDeactivate, node: activeNode });
      });

    if (value) {
      this.activeNodeIds = {[String(node.id)]: true };
    } else {
      this.activeNodeIds = {};
    }
  }

  /**
   * Executes `_setActiveNodeMulti` to handle set active node multi.
   * @zh 执行 `_setActiveNodeMulti`，用于集合激活节点多。
   * @param node - node parameter (`any`) / 节点参数（`any`）
   * @param value - value parameter (`any`) / 值参数（`any`）
   */
  private _setActiveNodeMulti(node, value) {
    if (value) {
      set(this.activeNodeIds, String(node.id), true);
    } else {
      remove(this.activeNodeIds, String(node.id));
    }
  }
}