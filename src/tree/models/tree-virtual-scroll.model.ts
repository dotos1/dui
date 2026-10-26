/**
 * @fileoverview Module `src/tree/models/tree-virtual-scroll.model.ts` providing tree virtual scroll model definitions and implementation.
 * @zh 模块文件 `src/tree/models/tree-virtual-scroll.model.ts`，提供树形控件虚拟滚动滚动模型相关的定义与实现。
 */

import { Injectable } from '@angular/core';
import { observable, computed, action, autorun, reaction } from 'mobx';
import { TreeModel } from './tree.model';
import { TREE_EVENTS } from '../constants/events';

/**
 * Constant/variable `Y_OFFSET` defining y offset in `src/tree/models`.
 * @zh 常量/变量 `Y_OFFSET`，定义 `src/tree/models` 中的Y坐标偏移量。
 */
const Y_OFFSET = 300; // Extra pixels outside the viewport, in each direction, to render nodes in
/**
 * Constant/variable `Y_EPSILON` defining y epsilon in `src/tree/models`.
 * @zh 常量/变量 `Y_EPSILON`，定义 `src/tree/models` 中的Y坐标EPSILON。
 */
const Y_EPSILON = 50; // Minimum pixel change required to recalculate the rendered nodes

/**
 * Injectable Angular service `TreeVirtualScroll` managing tree virtual scroll state and operations in `src/tree/models`.
 * @zh 可注入的 Angular 服务 `TreeVirtualScroll`，管理 `src/tree/models` 中的树形控件虚拟滚动滚动状态与业务操作。
 */
@Injectable()
export class TreeVirtualScroll {
  /**
   * Property `_dispose` (`any`) storing dispose.
   * @zh 属性 `_dispose`（类型：`any`），用于存储或配置释放。
   */
  private _dispose;

  /**
   * Property `yBlocks` (`number`) storing y blocks (default: `0`).
   * @zh 属性 `yBlocks`（类型：`number`），用于存储或配置Y坐标块列表（默认值：`0`）。
   */
  @observable yBlocks = 0;
  /**
   * Property `x` (`number`) storing x (default: `0`).
   * @zh 属性 `x`（类型：`number`），用于存储或配置X坐标（默认值：`0`）。
   */
  @observable x = 0;
  /**
   * Property `viewportHeight` (`any`) storing viewport height (default: `null`).
   * @zh 属性 `viewportHeight`（类型：`any`），用于存储或配置视口高度（默认值：`null`）。
   */
  @observable viewportHeight = null;
    /**
     * Property `_totalHeight` (`number`) storing total height (default: `0`).
     * @zh 属性 `_totalHeight`（类型：`number`），用于存储或配置总计高度（默认值：`0`）。
     */
    @observable _totalHeight = 0; 
  /**
   * Property `viewport` (`any`) storing viewport (default: `null`).
   * @zh 属性 `viewport`（类型：`any`），用于存储或配置视口（默认值：`null`）。
   */
  viewport = null;

  /**
   * Gets the current y (`y: any`).
   * @zh 获取当前Y坐标（`y: any`）。
   */
  @computed get y() {
    return this.yBlocks * Y_EPSILON;
  }

  /**
   * Gets the current total height (`totalHeight: any`).
   * @zh 获取当前总计高度（`totalHeight: any`）。
   */
  @computed get totalHeight() {
     return this.treeModel.virtualRoot ? this._totalHeight : 0;
  }

  /**
   * Creates an instance of `TreeVirtualScroll` and initializes its dependencies and internal state.
   * @zh 创建 `TreeVirtualScroll` 实例，并初始化其依赖项与内部状态。
   * @param treeModel - Injected or initial tree model (`TreeModel`) / 注入或传入的树形控件模型（`TreeModel`）
   */
  constructor(private treeModel: TreeModel) {
    treeModel.virtualScroll = this;
    this._dispose = [autorun(() => this.fixScroll())];
  }

  /**
   * Executes `fireEvent` to handle fire event.
   * @zh 执行 `fireEvent`，用于触发事件。
   * @param event - event parameter (`any`) / 事件参数（`any`）
   */
  fireEvent(event) {
    this.treeModel.fireEvent(event);
  }

  /**
   * Executes `init` to handle init.
   * @zh 执行 `init`，用于初始化。
   */
  init() {
    const fn = this.recalcPositions.bind(this);

    fn();
    this._dispose = [
      ...this._dispose,
      reaction(() => this.treeModel.roots, fn),
      reaction(() => this.treeModel.expandedNodeIds, fn),
      reaction(() => this.treeModel.hiddenNodeIds, fn)
    ];
    this.treeModel.subscribe(TREE_EVENTS.loadNodeChildren, fn);
  }

  /**
   * Executes `isEnabled` to handle is enabled.
   * @zh 执行 `isEnabled`，用于是否为已启用。
   */
  isEnabled() {
    return this.treeModel.options.useVirtualScroll;
  }

  /**
   * Executes `_setYBlocks` to handle set y blocks.
   * @zh 执行 `_setYBlocks`，用于集合Y坐标块列表。
   * @param value - value parameter (`any`) / 值参数（`any`）
   */
  @action private _setYBlocks(value) {
    this.yBlocks = value;
  }

  /**
   * Executes `recalcPositions` to handle recalc positions.
   * @zh 执行 `recalcPositions`，用于recalc位置。
   */
  @action recalcPositions() {
     if (
      !this.treeModel || 
      !this.treeModel.virtualRoot || 
      !this.treeModel.virtualRoot.visibleChildren
    ) {
      return; 
    }
    const newHeight = this._getPositionAfter(this.treeModel.getVisibleRoots(), 0);
    this.treeModel.virtualRoot.height = newHeight;
    this._totalHeight = newHeight;
  }

  /**
   * Executes `_getPositionAfter` to handle get position after.
   * @zh 执行 `_getPositionAfter`，用于获取位置之后。
   * @param nodes - nodes parameter (`any`) / 节点列表参数（`any`）
   * @param startPos - start pos parameter (`any`) / 开始位置参数（`any`）
   */
  private _getPositionAfter(nodes, startPos) {
    let position = startPos;
    nodes.forEach((node) => {
      node.position = position;
      position = this._getPositionAfterNode(node, position);
    });
    return position;
  }

  /**
   * Executes `_getPositionAfterNode` to handle get position after node.
   * @zh 执行 `_getPositionAfterNode`，用于获取位置之后节点。
   * @param node - node parameter (`any`) / 节点参数（`any`）
   * @param startPos - start pos parameter (`any`) / 开始位置参数（`any`）
   */
  private _getPositionAfterNode(node, startPos) {
    let position = node.getSelfHeight() + startPos;
    if (node.children && node.isExpanded) {
      position = this._getPositionAfter(node.visibleChildren, position);
    }
    node.height = position - startPos;
    return position;
  }


  /**
   * Executes `clear` to handle clear.
   * @zh 执行 `clear`，用于清空。
   */
  clear() {
    this._dispose.forEach((d) => d());
  }

  /**
   * Executes `setViewport` to handle set viewport.
   * @zh 执行 `setViewport`，用于集合视口。
   * @param viewport - viewport parameter (`any`) / 视口参数（`any`）
   */
  @action setViewport(viewport) {
  const currentHeight = viewport.clientHeight || (viewport.getBoundingClientRect ? viewport.getBoundingClientRect().height : 0);
    Object.assign(this, {
      viewport,
      x: viewport.scrollLeft,
      yBlocks: Math.round(viewport.scrollTop / Y_EPSILON),
      viewportHeight: currentHeight
    });
  }

  /**
   * Executes `scrollIntoView` to handle scroll into view.
   * @zh 执行 `scrollIntoView`，用于滚动进入视图。
   * @param node - node parameter (`any`) / 节点参数（`any`）
   * @param force - force parameter (`any`) / force参数（`any`）
   * @param scrollToMiddle - scroll to middle parameter (`any`) / 滚动转换为中间参数（`any`）
   */
  @action scrollIntoView(node, force, scrollToMiddle = true) {
     if (!this.isEnabled()) {
      return; 
    }

 if (node.options.scrollContainer) {
      const scrollContainer = node.options.scrollContainer;
      const scrollContainerHeight = scrollContainer.getBoundingClientRect().height;
      const scrollContainerTop = scrollContainer.getBoundingClientRect().top;
      const nodeTop = this.viewport.getBoundingClientRect().top + node.position - scrollContainerTop;

      if (force || // force scroll to node
        nodeTop < scrollContainer.scrollTop || // node is above scroll container
        nodeTop + node.getSelfHeight() > scrollContainer.scrollTop + scrollContainerHeight) { // node is below container
        scrollContainer.scrollTop = scrollToMiddle ?
          nodeTop - scrollContainerHeight / 2 : // scroll to middle
          nodeTop; // scroll to start
      }
    } else {
      if (force || // force scroll to node
        node.position < this.y || // node is above viewport
        node.position + node.getSelfHeight() > this.y + this.viewportHeight) { // node is below viewport
        if (this.viewport) {
          this.viewport.scrollTop = scrollToMiddle ?
          node.position - this.viewportHeight / 2 : // scroll to middle
          node.position; // scroll to start

            this._setYBlocks(Math.floor(this.viewport.scrollTop / Y_EPSILON));
        }
      }
    }
  }

  /**
   * Executes `getViewportNodes` to handle get viewport nodes.
   * @zh 执行 `getViewportNodes`，用于获取视口节点列表。
   * @param nodes - nodes parameter (`any`) / 节点列表参数（`any`）
   */
  getViewportNodes(nodes) {

    if (!nodes) { return []; }

    const visibleNodes = nodes.filter((node) => !node.isHidden);

    if (!this.isEnabled()) { return visibleNodes; }

    if (!this.viewportHeight || !visibleNodes.length) { return []; }

        // When loading children async this method is called before their height and position is calculated.
    // In that case firstIndex === 0 and lastIndex === visibleNodes.length - 1 (e.g. 1000),
    // which means that it loops through every visibleNodes item and push them into viewportNodes array.
    // We can prevent nodes from being pushed to the array and wait for the appropriate calculations to take place
    const lastVisibleNode = visibleNodes.slice(-1)[0]
    if (!lastVisibleNode.height && lastVisibleNode.position === 0) return [];

    // Search for first node in the viewport using binary search
    // Look for first node that starts after the beginning of the viewport (with buffer)
    // Or that ends after the beginning of the viewport
    const firstIndex = binarySearch(visibleNodes, (node) => {
      return (node.position + Y_OFFSET > this.y) ||
        (node.position + node.height > this.y);
    });

    // Search for last node in the viewport using binary search
    // Look for first node that starts after the end of the viewport (with buffer)
    const lastIndex = binarySearch(visibleNodes, (node) => {
      return node.position - Y_OFFSET > this.y + this.viewportHeight;
    }, firstIndex);

    const viewportNodes = [];
    for (let i = firstIndex; i <= lastIndex; i++) {
      viewportNodes.push(visibleNodes[i]);
    }

    return viewportNodes;
  }

  /**
   * Executes `fixScroll` to handle fix scroll.
   * @zh 执行 `fixScroll`，用于fix滚动。
   */
  fixScroll() {
    const maxY = Math.max(0, this.totalHeight - this.viewportHeight);

    if (this.y < 0) { this._setYBlocks(0); }
    if (this.y > maxY) { this._setYBlocks(maxY / Y_EPSILON); }
  }
}

/**
 * Executes `binarySearch` to handle binary search.
 * @zh 执行 `binarySearch`，用于binary搜索。
 * @param nodes - nodes parameter (`any`) / 节点列表参数（`any`）
 * @param condition - condition parameter (`any`) / 条件参数（`any`）
 * @param firstIndex - first index parameter (`any`) / 首个索引参数（`any`）
 */
function binarySearch(nodes, condition, firstIndex = 0) {
  let index = firstIndex;
  let toIndex = nodes.length - 1;

  while (index !== toIndex) {
    const midIndex = Math.floor((index + toIndex) / 2);

    if (condition(nodes[midIndex])) {
      toIndex = midIndex;
    }  else {
      if (index === midIndex) {
         index = toIndex; 
        } else { 
          index = midIndex;
         }
    }
  }
  return index;
}
