/**
 * @fileoverview Module `src/tree/models/tree-virtual-scroll.model.ts` providing Signal-driven virtual scroll state and viewport calculations for trees.
 * @zh 模块文件 `src/tree/models/tree-virtual-scroll.model.ts`，提供基于原生 Angular Signal 的树形虚拟滚动状态管理与视口节点计算逻辑（零 MobX 依赖）。
 */

import { computed, Injectable, signal } from '@angular/core';
import { TREE_EVENTS } from '../constants/events';
import { TreeNode } from './tree-node.model';
import { TreeModel } from './tree.model';

/**
 * Constant/variable `Y_OFFSET` defining extra buffer pixels outside viewport in `src/tree/models`.
 * @zh 常量/变量 `Y_OFFSET`，定义视口上下两侧额外预渲染的缓冲像素高度。
 */
const Y_OFFSET = 300;
/**
 * Constant/variable `Y_EPSILON` defining minimum scroll delta to recalculate viewport nodes in `src/tree/models`.
 * @zh 常量/变量 `Y_EPSILON`，定义触发视口可见节点重算的最小纵向滚动步进像素。
 */
const Y_EPSILON = 50;

/**
 * Injectable Angular service `TreeVirtualScroll` managing Signal-based tree virtual scroll state and operations in `src/tree/models`.
 * @zh 可注入的 Angular 服务 `TreeVirtualScroll`，基于原生 Signal 管理 `src/tree/models` 中的树形控件虚拟滚动状态与节点位置计算。
 */
@Injectable()
export class TreeVirtualScroll {
  // 清理回调列表（替代原 MobX reaction disposer）
  private _dispose: Array<() => void> = [];
  // 底层私有 WritableSignal 状态（护栏 A：对外保留同名 get/set 访问器）
  private readonly _yBlocksSig = signal<number>(0);
  private readonly _xSig = signal<number>(0);
  private readonly _viewportHeightSig = signal<number | null>(null);
  private readonly _totalHeightSig = signal<number>(0);
  private readonly _yComputed = computed<number>(() => this._yBlocksSig() * Y_EPSILON);
  private readonly _totalHeightComputed = computed<number>(() =>
    this.treeModel && this.treeModel.virtualRoot ? this._totalHeightSig() : 0,
  );

  /**
   * Property `viewport` (`HTMLElement`) storing mounted viewport DOM element (default: `null`).
   * @zh 属性 `viewport`（类型：`HTMLElement`），存储当前挂载的视口 DOM 元素（默认值：`null`）。
   */
  viewport: HTMLElement | null = null;

  /**
   * Gets the current `yBlocks` (`number`).
   * @zh 获取当前纵向滚动分块索引（`number`）。
   */
  get yBlocks(): number {
    return this._yBlocksSig();
  }

  /**
   * Sets the `yBlocks` (`yBlocks`).
   * @zh 设置纵向滚动分块索引（`yBlocks`）。
   * @param value - New yBlocks value (`number`) / 新的分块索引值（`number`）
   */
  set yBlocks(value: number) {
    this._yBlocksSig.set(value);
  }

  /**
   * Gets the current `x` (`number`).
   * @zh 获取当前横向滚动偏移（`number`）。
   */
  get x(): number {
    return this._xSig();
  }

  /**
   * Sets the `x` (`x`).
   * @zh 设置横向滚动偏移（`x`）。
   * @param value - New x value (`number`) / 新的横向偏移值（`number`）
   */
  set x(value: number) {
    this._xSig.set(value);
  }

  /**
   * Gets the current `viewportHeight` (`number`).
   * @zh 获取当前视口高度（`number | null`）。
   */
  get viewportHeight(): number | null {
    return this._viewportHeightSig();
  }

  /**
   * Sets the `viewportHeight` (`viewportHeight`).
   * @zh 设置视口高度（`viewportHeight`）。
   * @param value - New viewportHeight value (`number`) / 新的视口高度值（`number`）
   */
  set viewportHeight(value: number | null) {
    this._viewportHeightSig.set(value);
  }

  /**
   * Gets the current `_totalHeight` (`number`).
   * @zh 获取内部记录的总高度（`number`）。
   */
  get _totalHeight(): number {
    return this._totalHeightSig();
  }

  /**
   * Sets the `_totalHeight` (`_totalHeight`).
   * @zh 设置内部记录的总高度（`_totalHeight`）。
   * @param value - New _totalHeight value (`number`) / 新的内部总高度值（`number`）
   */
  set _totalHeight(value: number) {
    this._totalHeightSig.set(value);
  }

  /**
   * Gets the current `y` (`number`).
   * @zh 获取当前纵向滚动像素位置（`number`）。
   */
  get y(): number {
    return this._yComputed();
  }

  /**
   * Gets the current `totalHeight` (`number`).
   * @zh 获取当前树内容总高度（`number`）。
   */
  get totalHeight(): number {
    return this._totalHeightComputed();
  }

  /**
   * Creates an instance of `TreeVirtualScroll` and initializes its dependencies and internal state.
   * @zh 创建 `TreeVirtualScroll` 实例，并将其挂载至所属 `TreeModel`。
   * @param treeModel - Injected or initial tree model (`TreeModel`) / 注入或传入的树形控件模型（`TreeModel`）
   */
  constructor(private treeModel: TreeModel) {
    treeModel.virtualScroll = this;
    this.fixScroll();
  }

  /**
   * Executes `fireEvent` to forward tree events to `TreeModel`.
   * @zh 执行 `fireEvent`，向 `TreeModel` 派发树事件。
   * @param event - event parameter (`Record<string, unknown>`) / 事件参数（`Record<string, unknown>`）
   */
  fireEvent(event: Record<string, unknown>): void {
    this.treeModel.fireEvent(event);
  }

  /**
   * Executes `init` to initialize layout recalculation subscriptions without MobX.
   * @zh 执行 `init`，初始化虚拟滚动位置重算订阅（零 MobX 依赖）。
   */
  init(): void {
    const fn = (): void => {
      this.recalcPositions();
    };
    fn();
    const offLayout = this.treeModel.subscribeToLayout(fn);
    this._dispose.push(offLayout);
    if (this.treeModel.hasEvent(TREE_EVENTS.loadNodeChildren)) {
      const sub = this.treeModel.subscribe(TREE_EVENTS.loadNodeChildren, fn);
      if (sub && typeof sub.unsubscribe === 'function') {
        this._dispose.push(() => sub.unsubscribe());
      }
    }
  }

  /**
   * Executes `isEnabled` to check whether virtual scroll is enabled in options.
   * @zh 执行 `isEnabled`，检查当前树配置是否启用了虚拟滚动。
   * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
   */
  isEnabled(): boolean {
    return Boolean(this.treeModel.options.useVirtualScroll);
  }

  private _setYBlocks(value: number): void {
    this._yBlocksSig.set(value);
  }

  /**
   * Executes `recalcPositions` to recompute node positions and total height.
   * @zh 执行 `recalcPositions`，重算所有可见节点的纵向偏移与总高度。
   */
  recalcPositions(): void {
    if (!this.treeModel || !this.treeModel.virtualRoot || !this.treeModel.virtualRoot.visibleChildren) {
      return;
    }
    const newHeight = this._getPositionAfter(this.treeModel.getVisibleRoots(), 0);
    this.treeModel.virtualRoot.height = newHeight;
    this._totalHeightSig.set(newHeight);
    this.fixScroll();
  }

  private _getPositionAfter(nodes: TreeNode[], startPos: number): number {
    let position = startPos;
    nodes.forEach((node: TreeNode) => {
      node.position = position;
      position = this._getPositionAfterNode(node, position);
    });
    return position;
  }

  private _getPositionAfterNode(node: TreeNode, startPos: number): number {
    let position = node.getSelfHeight() + startPos;
    if (node.children && node.isExpanded) {
      position = this._getPositionAfter(node.visibleChildren, position);
    }
    node.height = position - startPos;
    return position;
  }

  /**
   * Executes `clear` to release layout subscriptions.
   * @zh 执行 `clear`，清理虚拟滚动监听器。
   */
  clear(): void {
    this._dispose.forEach((d: () => void) => d());
    this._dispose = [];
  }

  /**
   * Executes `setViewport` to sync scroll offsets and viewport dimensions from DOM.
   * @zh 执行 `setViewport`，从视口 DOM 元素同步滚动偏移与可视区域高度。
   * @param viewport - viewport parameter (`HTMLElement`) / 视口元素参数（`HTMLElement`）
   */
  setViewport(viewport: HTMLElement | null): void {
    if (!viewport) {
      return;
    }
    const currentHeight =
      viewport.clientHeight || (typeof viewport.getBoundingClientRect === 'function' ? viewport.getBoundingClientRect().height : 0);
    this.viewport = viewport;
    this._xSig.set(viewport.scrollLeft || 0);
    this._yBlocksSig.set(Math.round((viewport.scrollTop || 0) / Y_EPSILON));
    this._viewportHeightSig.set(currentHeight);
    this.fixScroll();
  }

  /**
   * Executes `scrollIntoView` to scroll a target tree node into the visible area.
   * @zh 执行 `scrollIntoView`，将指定树节点平滑定位至可视区域内。
   * @param node - node parameter (`TreeNode`) / 目标节点参数（`TreeNode`）
   * @param force - force parameter (`boolean`) / 是否强制滚动参数（`boolean`）
   * @param scrollToMiddle - scroll to middle parameter (`boolean`) / 是否居中对齐参数（`boolean`）
   */
  scrollIntoView(node: TreeNode, force: boolean, scrollToMiddle = true): void {
    if (!this.isEnabled()) {
      return;
    }

    if (node.options.scrollContainer && this.viewport) {
      const scrollContainer = node.options.scrollContainer;
      const scrollContainerHeight = scrollContainer.getBoundingClientRect().height;
      const scrollContainerTop = scrollContainer.getBoundingClientRect().top;
      const nodeTop = this.viewport.getBoundingClientRect().top + node.position - scrollContainerTop;

      if (
        force ||
        nodeTop < scrollContainer.scrollTop ||
        nodeTop + node.getSelfHeight() > scrollContainer.scrollTop + scrollContainerHeight
      ) {
        scrollContainer.scrollTop = scrollToMiddle ? nodeTop - scrollContainerHeight / 2 : nodeTop;
      }
    } else {
      const vpHeight = this.viewportHeight ?? 0;
      if (force || node.position < this.y || node.position + node.getSelfHeight() > this.y + vpHeight) {
        if (this.viewport) {
          this.viewport.scrollTop = scrollToMiddle ? node.position - vpHeight / 2 : node.position;
          this._setYBlocks(Math.floor(this.viewport.scrollTop / Y_EPSILON));
        }
      }
    }
  }

  /**
   * Executes `getViewportNodes` to return the visible slice of nodes for the current scroll window.
   * @zh 执行 `getViewportNodes`，根据当前 Signal 视口参数返回需要渲染的节点切片。
   * @param nodes - nodes parameter (`TreeNode[]`) / 待裁剪节点数组参数（`TreeNode[]`）
   * @returns Result of type `TreeNode[]` / 类型为 `TreeNode[]` 的返回值
   */
  getViewportNodes(nodes: TreeNode[] | null | undefined): TreeNode[] {
    if (!nodes) {
      return [];
    }

    const visibleNodes = nodes.filter((node: TreeNode) => !node.isHidden);

    if (!this.isEnabled()) {
      return visibleNodes;
    }

    const vpHeight = this.viewportHeight;
    if (!vpHeight || !visibleNodes.length) {
      return [];
    }

    // 异步加载子节点时尚未完成高度与位置重算，等待 recalcPositions 完成后再推入视口
    const lastVisibleNode = visibleNodes[visibleNodes.length - 1];
    if (!lastVisibleNode.height && lastVisibleNode.position === 0) {
      return [];
    }

    const currentY = this.y;
    const firstIndex = binarySearch(visibleNodes, (node: TreeNode) => {
      return node.position + Y_OFFSET > currentY || node.position + node.height > currentY;
    });

    const lastIndex = binarySearch(
      visibleNodes,
      (node: TreeNode) => {
        return node.position - Y_OFFSET > currentY + vpHeight;
      },
      firstIndex,
    );

    const viewportNodes: TreeNode[] = [];
    for (let i = firstIndex; i <= lastIndex; i++) {
      viewportNodes.push(visibleNodes[i]);
    }

    return viewportNodes;
  }

  /**
   * Executes `fixScroll` to clamp vertical block position within valid bounds.
   * @zh 执行 `fixScroll`，将纵向滚动块位置约束在有效高度范围内。
   */
  fixScroll(): void {
    const vpHeight = this.viewportHeight ?? 0;
    const maxY = Math.max(0, this.totalHeight - vpHeight);

    if (this.y < 0) {
      this._setYBlocks(0);
    }
    if (this.y > maxY) {
      this._setYBlocks(maxY / Y_EPSILON);
    }
  }
}

function binarySearch(nodes: TreeNode[], condition: (node: TreeNode) => boolean, firstIndex = 0): number {
  let index = firstIndex;
  let toIndex = nodes.length - 1;

  while (index !== toIndex) {
    const midIndex = Math.floor((index + toIndex) / 2);

    if (condition(nodes[midIndex])) {
      toIndex = midIndex;
    } else if (index === midIndex) {
      index = toIndex;
    } else {
      index = midIndex;
    }
  }
  return index;
}
