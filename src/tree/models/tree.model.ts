import { Injectable, OnDestroy } from '@angular/core';
import { TranslateService } from '@dotos/dui/translator';

import { Subscription } from 'rxjs';
import { TREE_EVENTS } from '../constants/events';
import { IDType, IDTypeDictionary, ITreeModel } from '../defs/api';
import { TreeNode } from './tree-node.model';
import { TreeOptions } from './tree-options.model';
import { TreeVirtualScroll } from './tree-virtual-scroll.model';
import { first, last, compact, find, isString, isFunction } from 'lodash-es';
import { action, autorun, computed, observable, set, remove, get } from 'mobx';
@Injectable()
export class TreeModel implements ITreeModel, OnDestroy {
  static focusedTree = null;

  options: TreeOptions = new TreeOptions();
  nodes: any[];
  eventNames = Object.keys(TREE_EVENTS);
  virtualScroll: TreeVirtualScroll;

  @observable roots: TreeNode[];
  @observable expandedNodeIds: IDTypeDictionary = {};
  @observable selectedLeafNodeIds: IDTypeDictionary = {};
  @observable activeNodeIds: IDTypeDictionary = {};
  @observable hiddenNodeIds: IDTypeDictionary = {};
  @observable focusedNodeId: IDType = null;
  @observable virtualRoot: TreeNode;

  public firstUpdate = true;
  private events: any = {};
  private subscriptions: Subscription[] =[];
  private mobxDisposers: Array<() => void> = [];

  public idSet: Set<string> = new Set();
  
  // ✨ 核心优化：新增 O(1) 复杂度的节点注册表缓存
  public nodeRegistry = new Map<string, TreeNode>();

  constructor(public translator: TranslateService) {}

  // events
  fireEvent(event) {
    event.treeModel = this;
    if (this.events[event.eventName]) {
      this.events[event.eventName].emit(event);
      this.events.event.emit(event);
    }
  }

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

  unsubscribe(eventName, fn) {
    return this.events[eventName].unsubscribe(fn);
  }

  // getters
  getFocusedNode(): TreeNode {
    return this.focusedNode;
  }

  getActiveNode(): TreeNode {
    return this.activeNodes[0];
  }

  getActiveNodes(): TreeNode[] {
    return this.activeNodes;
  }

  getVisibleRoots() {
    return this.virtualRoot.visibleChildren;
  }

  getFirstRoot(skipHidden = false) {
    return first(skipHidden ? this.getVisibleRoots() : this.roots);
  }

  getLastRoot(skipHidden = false) {
    return last(skipHidden ? this.getVisibleRoots() : this.roots);
  }

  get isFocused() {
    return TreeModel.focusedTree === this;
  }

  isNodeFocused(node) {
    return this.focusedNode === node;
  }

  isEmptyTree(): boolean {
    return this.roots && this.roots.length === 0;
  }

  @computed get focusedNode() {
    return this.focusedNodeId ? this.getNodeById(this.focusedNodeId) : null;
  }

  @computed get expandedNodes() {
      const nodes = Object.keys(this.expandedNodeIds || {})
      .filter((id) => get(this.expandedNodeIds, id))
      .map((id) => this.getNodeById(id));

    return compact(nodes);
  }

  @computed get activeNodes() {
   const nodes = Object.keys(this.activeNodeIds || {})
      .filter((id) => get(this.activeNodeIds, id))
      .map((id) => this.getNodeById(id));

    return compact(nodes);
  }

  @computed get hiddenNodes() {
 const nodes = Object.keys(this.hiddenNodeIds || {})
      .filter((id) => get(this.hiddenNodeIds, id))
      .map((id) => this.getNodeById(id));

    return nodes.filter(Boolean);
  }
  
  @computed get selectedLeafNodes() {
   const nodes = Object.keys(this.selectedLeafNodeIds || {})
      .filter((id) => get(this.selectedLeafNodeIds, id))
      .map((id) => this.getNodeById(id));
    return compact(nodes);
  }

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
  getNodeByPath(path: any[], startNode = null): TreeNode {
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
  getNodeById(id) {
    if (id === null || id === undefined) return null;
    return this.nodeRegistry.get(id.toString());
  }

  // 保留原有方法供兼容，但核心业务不再依赖此低效方法
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

  isExpanded(node) {
     return !!get(this.expandedNodeIds, String(node.id));
  }

  isHidden(node) {
   return !!get(this.hiddenNodeIds, String(node.id));
  }

  isActive(node) {
    return !!get(this.activeNodeIds, String(node.id));
  }

  isSelected(node) {
     return !!get(this.selectedLeafNodeIds, String(node.id));
  }

  setEvents(events) {
    this.events = events;
  }

  ngOnDestroy() {
    this.dispose();
    this.mobxDisposers.forEach(dispose => dispose());
    this.mobxDisposers = [];
    this.unsubscribeAll();
  }

  dispose() {
    if (this.virtualRoot) {
      this.virtualRoot.dispose();
    }
    // 清空字典缓存
    this.nodeRegistry.clear();
  }

  unsubscribeAll() {
    this.subscriptions.slice().forEach(subscription => subscription.unsubscribe());
    this.subscriptions =[];
  }

  // actions
  @action setData({ nodes, options = null, events = null }: { nodes?: any, options?: any, events?: any }) {
 if (options) {
      if (options instanceof TreeOptions) {
        this.options = options;
      } else {
        this.options = new TreeOptions(options);
      }
    }
    if (events) {
      this.events = events;
    }
    if (nodes) {
      this.nodes = nodes;
    }
    this.update();
  }

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

  @action setFocusedNode(node) {
    this.focusedNodeId = node ? node.id : null;
  }

  @action setFocus(value) {
    TreeModel.focusedTree = value ? this : null;
  }

  @action doForAll(fn) {
    this.roots.forEach((root) => root.doForAll(fn));
  }

  @action focusNextNode() {
    const previousNode = this.getFocusedNode();
    const nextNode = previousNode ? previousNode.findNextNode(true, true) : this.getFirstRoot(true);
    if (nextNode) { nextNode.focus(); }
  }

  @action focusPreviousNode() {
    const previousNode = this.getFocusedNode();
    const nextNode = previousNode ? previousNode.findPreviousNode(true) : this.getLastRoot(true);
    if (nextNode) { nextNode.focus(); }
  }

  @action focusDrillDown() {
    const previousNode = this.getFocusedNode();
    if (previousNode && previousNode.isCollapsed && previousNode.hasChildren) {
      previousNode.toggleExpanded(false);
    } else {
      const nextNode = previousNode ? previousNode.getFirstChild(true) : this.getFirstRoot(true);
      if (nextNode) { nextNode.focus(); }
    }
  }

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

  @action expandAll() {
    this.roots.forEach((root) => root.expandAll());
  }

  @action collapseAll() {
    this.roots.forEach((root) => root.collapseAll());
  }

  // ✨ 优化点：消灭 Object.assign
  @action setIsHidden(node, value) {
    if (value) {
      set(this.hiddenNodeIds, String(node.id), true);
    } else {
      remove(this.hiddenNodeIds, String(node.id));
    }
  }

  @action setHiddenNodeIds(nodeIds) {
    const newHidden = {};
    nodeIds.forEach(id => newHidden[id] = true);
    this.hiddenNodeIds = newHidden;
  }

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

    const ids = {};
    this.roots.forEach((node) => this._filterNode(ids, node, filterFn, autoShow));
    this.hiddenNodeIds = ids;
    this.fireEvent({ eventName: TREE_EVENTS.changeFilter });
  }

  @action clearFilter() {
    this.hiddenNodeIds = {};
    this.fireEvent({ eventName: TREE_EVENTS.changeFilter });
  }

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

  @action removeNode(node) {
    const fromIndex = node.getIndexInParent();
    const fromParent = node.parent;
    const fromChildren = fromParent.getField('children');
    const originalNode = fromChildren.splice(fromIndex, 1)[0];
    fromParent.setField('hasChildren', fromChildren.length > 0);
    fromParent.treeModel.update();
    this.fireEvent({ eventName: TREE_EVENTS.removeNode, node: originalNode });
  }

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

  getState() {
    return {
      expandedNodeIds: this.expandedNodeIds,
      selectedLeafNodeIds: this.selectedLeafNodeIds,
      activeNodeIds: this.activeNodeIds,
      hiddenNodeIds: this.hiddenNodeIds,
      focusedNodeId: this.focusedNodeId
    };
  }

  @action setState(state) {
    if (!state) { return; }
    if (state.expandedNodeIds) this.expandedNodeIds = state.expandedNodeIds;
    if (state.selectedLeafNodeIds) this.selectedLeafNodeIds = state.selectedLeafNodeIds;
    if (state.activeNodeIds) this.activeNodeIds = state.activeNodeIds;
    if (state.hiddenNodeIds) this.hiddenNodeIds = state.hiddenNodeIds;
    if (state.focusedNodeId !== undefined) this.focusedNodeId = state.focusedNodeId;
  }

  subscribeToState(fn) {
    const dispose = autorun(() => fn(this.getState()));
    this.mobxDisposers.push(dispose);
  }

  canMoveNode(node, to, fromIndex = undefined) {
    if (node.parent === to.parent && fromIndex === to.index) {
      return false;
    }
    return !to.parent.isDescendantOf(node);
  }

  calculateExpandedNodes() {
    this._calculateExpandedNodes();
  }

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

  private _setActiveNodeMulti(node, value) {
    if (value) {
      set(this.activeNodeIds, String(node.id), true);
    } else {
      remove(this.activeNodeIds, String(node.id));
    }
  }
}