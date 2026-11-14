/**
 * @fileoverview Module `src/tree/models/tree-node.model.ts` providing Signal-backed tree node model without MobX.
 * @zh 模块文件 `src/tree/models/tree-node.model.ts`，提供基于原生 Angular Signal 的树节点数据结构与派生状态实现（零 MobX 依赖，遵循护栏 A 100% 向下兼容）。
 */

import { computed, signal } from '@angular/core';
import { TranslateService } from '@dotos/dui/translator';
import { concat, every, first, last, some } from 'lodash-es';

import { TREE_EVENTS } from '../constants/events';
import { IDType, ITreeNode } from '../defs/api';
import { TreeOptions } from './tree-options.model';
import { TreeModel } from './tree.model';

/**
 * Class `TreeNode` encapsulating Signal-driven tree node state and traversal logic in `src/tree/models`.
 * @zh 类 `TreeNode`，使用原生 Angular Signal 封装 `src/tree/models` 中的树节点状态、父子联动勾选与遍历逻辑（护栏 A 保持公开属性兼容）。
 */
export class TreeNode implements ITreeNode {
  // 底层私有 WritableSignal 状态（护栏 A：对外保留同名 get / set 访问器）
  private readonly _childrenSig = signal<TreeNode[] | null>(null);
  private readonly _indexSig = signal<number>(0);
  private readonly _positionSig = signal<number>(0);
  private readonly _heightSig = signal<number>(0);

  // 底层派生 computed Signal（替代原 MobX @computed）
  private readonly _isHiddenComputed = computed<boolean>(() => this.treeModel.isHidden(this));
  private readonly _isExpandedComputed = computed<boolean>(() => this.treeModel.isExpanded(this));
  private readonly _isActiveComputed = computed<boolean>(() => this.treeModel.isActive(this));
  private readonly _isFocusedComputed = computed<boolean>(() => this.treeModel.isNodeFocused(this));

  private readonly _isSelectedComputed = computed<boolean>(() => {
    if (this.isSelectable()) {
      return this.treeModel.isSelected(this);
    }
    const children = this._childrenSig();
    return Boolean(children && some(children, (node: TreeNode) => node.isSelected));
  });

  private readonly _isAllSelectedComputed = computed<boolean>(() => {
    if (this.isSelectable()) {
      return this.treeModel.isSelected(this);
    }
    const children = this._childrenSig();
    return Boolean(children && children.length > 0 && every(children, (node: TreeNode) => node.isAllSelected));
  });

  private readonly _isPartiallySelectedComputed = computed<boolean>(() => this.isSelected && !this.isAllSelected);

  private readonly _visibleChildrenComputed = computed<TreeNode[]>(() => {
    const children = this._childrenSig();
    return (children || []).filter((node: TreeNode) => !node.isHidden);
  });

  private readonly _levelComputed = computed<number>(() => (this.parent ? this.parent.level + 1 : 0));

  private readonly _pathComputed = computed<string[]>(() =>
    this.parent ? [...this.parent.path, String(this.id)] : [],
  );

  /**
   * Gets the current `isHidden` (`boolean`).
   * @zh 获取当前节点是否隐藏（`boolean`）。
   */
  get isHidden(): boolean {
    return this._isHiddenComputed();
  }

  /**
   * Sets the `isHidden` (`isHidden`).
   * @zh 设置节点是否隐藏（`isHidden`）。
   * @param value - New isHidden value (`boolean`) / 新的隐藏状态（`boolean`）
   */
  set isHidden(value: boolean) {
    this.setIsHidden(value);
  }

  /**
   * Gets the current `isExpanded` (`boolean`).
   * @zh 获取当前节点是否展开（`boolean`）。
   */
  get isExpanded(): boolean {
    return this._isExpandedComputed();
  }

  /**
   * Sets the `isExpanded` (`isExpanded`).
   * @zh 设置当前节点展开状态（`isExpanded`）。
   * @param value - New isExpanded value (`boolean`) / 新的展开状态（`boolean`）
   */
  set isExpanded(value: boolean) {
    this.setIsExpanded(value, false);
  }

  /**
   * Gets the current `isActive` (`boolean`).
   * @zh 获取当前节点是否处于激活状态（`boolean`）。
   */
  get isActive(): boolean {
    return this._isActiveComputed();
  }

  /**
   * Sets the `isActive` (`isActive`).
   * @zh 设置当前节点激活状态（`isActive`）。
   * @param value - New isActive value (`boolean`) / 新的激活状态（`boolean`）
   */
  set isActive(value: boolean) {
    this.setIsActive(value);
  }

  /**
   * Gets the current `isFocused` (`boolean`).
   * @zh 获取当前节点是否处于键盘聚焦状态（`boolean`）。
   */
  get isFocused(): boolean {
    return this._isFocusedComputed();
  }

  /**
   * Gets the current `isSelected` (`boolean`).
   * @zh 获取当前节点是否勾选（`boolean`）。
   */
  get isSelected(): boolean {
    return this._isSelectedComputed();
  }

  /**
   * Sets the `isSelected` (`isSelected`).
   * @zh 设置当前节点勾选状态（`isSelected`）。
   * @param value - New isSelected value (`boolean`) / 新的勾选状态（`boolean`）
   */
  set isSelected(value: boolean) {
    this.setIsSelected(value);
  }

  /**
   * Gets the current `isAllSelected` (`boolean`).
   * @zh 获取当前节点及其全部后代是否完全勾选（`boolean`）。
   */
  get isAllSelected(): boolean {
    return this._isAllSelectedComputed();
  }

  /**
   * Gets the current `isPartiallySelected` (`boolean`).
   * @zh 获取当前节点是否处于半选状态（`boolean`）。
   */
  get isPartiallySelected(): boolean {
    return this._isPartiallySelectedComputed();
  }

  /**
   * Gets the current `children` (`TreeNode[]`).
   * @zh 获取子节点数组（`TreeNode[]`）。
   */
  get children(): TreeNode[] {
    return this._childrenSig() as TreeNode[];
  }

  /**
   * Sets the `children` (`children`).
   * @zh 设置子节点数组（`children`）。
   * @param value - New children value (`TreeNode[]`) / 新的子节点数组（`TreeNode[]`）
   */
  set children(value: TreeNode[] | null) {
    this._childrenSig.set(value);
  }

  /**
   * Gets the current `index` (`number`).
   * @zh 获取节点在同级中的位置索引（`number`）。
   */
  get index(): number {
    return this._indexSig();
  }

  /**
   * Sets the `index` (`index`).
   * @zh 设置节点在同级中的位置索引（`index`）。
   * @param value - New index value (`number`) / 新的索引值（`number`）
   */
  set index(value: number) {
    this._indexSig.set(value ?? 0);
  }

  /**
   * Gets the current `position` (`number`).
   * @zh 获取虚拟滚动纵向像素位置（`number`）。
   */
  get position(): number {
    return this._positionSig();
  }

  /**
   * Sets the `position` (`position`).
   * @zh 设置虚拟滚动纵向像素位置（`position`）。
   * @param value - New position value (`number`) / 新的纵向位置（`number`）
   */
  set position(value: number) {
    this._positionSig.set(value ?? 0);
  }

  /**
   * Gets the current `height` (`number`).
   * @zh 获取虚拟滚动子树渲染高度（`number`）。
   */
  get height(): number {
    return this._heightSig();
  }

  /**
   * Sets the `height` (`height`).
   * @zh 设置虚拟滚动子树渲染高度（`height`）。
   * @param value - New height value (`number`) / 新的高度值（`number`）
   */
  set height(value: number) {
    this._heightSig.set(value ?? 0);
  }

  /**
   * Gets the current `level` (`number`).
   * @zh 获取当前节点在树中的深度层级（`number`）。
   */
  get level(): number {
    return this._levelComputed();
  }

  /**
   * Gets the current `path` (`string[]`).
   * @zh 获取从根到当前节点的 ID 路径（`string[]`）。
   */
  get path(): string[] {
    return this._pathComputed();
  }

  /**
   * Gets `elementRef` (throws deprecation notice per virtual scroll design).
   * @zh 访问已废弃的 `elementRef` 时抛出虚拟滚动提示异常。
   */
  get elementRef(): never {
    throw new Error(
      `Element Ref is no longer supported since introducing virtual scroll\nYou may use a template to obtain a reference to the element`,
    );
  }

  private _originalNode: unknown;
  /**
   * Gets the `originalNode` (`unknown`).
   * @zh 获取原始节点引用（`unknown`）。
   */
  get originalNode(): unknown {
    return this._originalNode;
  }

  private translator?: TranslateService;

  /**
   * Creates an instance of `TreeNode` and registers it into `treeModel.nodeRegistry`.
   * @zh 创建 `TreeNode` 实例，注册进 `nodeRegistry` 并初始化子节点与选中态。
   * @param data - Injected or initial data (`any`) / 节点业务数据（`any`）
   * @param parent - Injected or initial parent (`TreeNode`) / 父节点引用（`TreeNode`）
   * @param treeModel - Injected or initial tree model (`TreeModel`) / 所属树模型实例（`TreeModel`）
   * @param index - Injected or initial index (`number`) / 同级索引位置（`number`）
   */
  constructor(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public data: any,
    public parent: TreeNode | null,
    public treeModel: TreeModel,
    index?: number,
  ) {
    if (this.id === undefined || this.id === null) {
      this.id = uuid();
    }

    // ✨ 核心机制：在实例化时，将本节点注入到全局 Map 进行缓存
    this.treeModel.nodeRegistry.set(this.id.toString(), this);

    this.index = index ?? 0;
    this.translator = treeModel.translator;
    if (this.getField('children')) {
      this._initChildren();
    }

    if (this.data && this.data['isSelected']) {
      this.setIsSelected(true, true);
    } else {
      this.setIsSelected(false, true);
    }
    this.autoLoadChildren();
  }

  /**
   * Gets the current `hasChildren` (`boolean`).
   * @zh 获取当前节点是否包含子节点（`boolean`）。
   */
  get hasChildren(): boolean {
    return Boolean(this.getField('hasChildren') || (this.children && this.children.length > 0));
  }

  /**
   * Gets the current `isCollapsed` (`boolean`).
   * @zh 获取当前节点是否处于折叠状态（`boolean`）。
   */
  get isCollapsed(): boolean {
    return !this.isExpanded;
  }

  /**
   * Gets the current `isLeaf` (`boolean`).
   * @zh 获取当前节点是否为叶子节点（`boolean`）。
   */
  get isLeaf(): boolean {
    return !this.hasChildren;
  }

  /**
   * Gets the current `isRoot` (`boolean`).
   * @zh 获取当前节点是否为顶层根节点（`boolean`）。
   */
  get isRoot(): boolean {
    return this.parent == null || Boolean(this.parent.data && this.parent.data.virtual);
  }

  /**
   * Gets the current `realParent` (`TreeNode`).
   * @zh 获取非虚拟父节点（`TreeNode | null`）。
   */
  get realParent(): TreeNode | null {
    return this.isRoot ? null : this.parent;
  }

  /**
   * Gets the current `options` (`TreeOptions`).
   * @zh 获取所属树模型的配置选项（`TreeOptions`）。
   */
  get options(): TreeOptions {
    return this.treeModel.options;
  }

  /**
   * Executes `fireEvent` to dispatch a tree event via `treeModel`.
   * @zh 执行 `fireEvent`，通过所属 `treeModel` 派发树事件。
   * @param event - event parameter (`Record<string, unknown>`) / 事件载荷参数（`Record<string, unknown>`）
   */
  fireEvent(event: Record<string, unknown>): void {
    this.treeModel.fireEvent(event);
  }

  /**
   * Gets the current `displayField` (`string`).
   * @zh 获取经过国际化翻译处理后的节点显示文本（`string`）。
   */
  get displayField(): string {
    const raw = this.getField('display');
    if (this.translator && typeof this.translator.instant === 'function' && raw !== undefined && raw !== null) {
      return this.translator.instant(String(raw));
    }
    return raw !== undefined && raw !== null ? String(raw) : '';
  }

  /**
   * Gets the current `id` (`IDType`).
   * @zh 获取节点唯一标识（`IDType`）。
   */
  get id(): IDType {
    return this.getField('id') as IDType;
  }

  // ✨ 核心机制修复：处理运行时 ID 变更的异常情况，保障 Map 数据一致性
  /**
   * Sets the `id` (`id`) and keeps `nodeRegistry` synchronized.
   * @zh 设置节点唯一标识（`id`），并同步更新全局 `nodeRegistry` 索引。
   * @param value - New id value (`IDType`) / 新的节点标识（`IDType`）
   */
  set id(value: IDType) {
    const oldId = this.getField('id');
    if (oldId !== undefined && oldId !== null && this.treeModel) {
      this.treeModel.nodeRegistry.delete(oldId.toString());
    }
    this.setField('id', value);
    if (value !== undefined && value !== null && this.treeModel) {
      this.treeModel.nodeRegistry.set(value.toString(), this);
    }
  }

  /**
   * Gets the current `expandedIcon` (`string`).
   * @zh 获取节点展开态图标名称（`string`）。
   */
  get expandedIcon(): string {
    return this.data ? (this.data['expandedIcon'] as string) : '';
  }

  /**
   * Gets the current `icon` (`string`).
   * @zh 获取节点图标名称（`string`）。
   */
  get icon(): string {
    return this.data ? (this.data['icon'] as string) : '';
  }

  /**
   * Sets the `icon` (`icon`).
   * @zh 设置节点图标名称（`icon`）。
   * @param icon - New icon value (`string`) / 新的图标名称（`string`）
   */
  set icon(icon: string) {
    if (this.data) {
      this.data['icon'] = icon;
    }
  }

  /**
   * Gets the current `toolTip` (`string`).
   * @zh 获取节点悬浮提示文案（`string | undefined`）。
   */
  get toolTip(): string | undefined {
    const tip = this.data ? this.data['toolTip'] : undefined;
    if (!tip) {
      return undefined;
    }
    return this.translator && typeof this.translator.instant === 'function'
      ? this.translator.instant(String(tip))
      : String(tip);
  }

  /**
   * Sets the `toolTip` (`toolTip`).
   * @zh 设置节点悬浮提示文案（`toolTip`）。
   * @param toolTip - New toolTip value (`string`) / 新的提示文案（`string`）
   */
  set toolTip(toolTip: string | undefined) {
    if (this.data) {
      this.data['toolTip'] = toolTip;
    }
  }

  /**
   * Gets the current `checkable` (`boolean`).
   * @zh 获取当前节点是否显示复选框（`boolean`）。
   */
  get checkable(): boolean {
    if (!this.data || this.data['checkable'] === undefined) {
      return true;
    }
    return Boolean(this.data['checkable']);
  }

  /**
   * Sets the `checkable` (`checkable`).
   * @zh 设置当前节点是否可勾选（`checkable`）。
   * @param c - New checkable value (`boolean`) / 是否可勾选（`boolean`）
   */
  set checkable(c: boolean) {
    if (this.data) {
      this.data['checkable'] = c;
    }
  }

  /**
   * Gets the current `editable` (`boolean`).
   * @zh 获取当前节点是否可编辑（`boolean`）。
   */
  get editable(): boolean {
    if (!this.data || this.data['editable'] === undefined) {
      return false;
    }
    return Boolean(this.data['editable']);
  }

  /**
   * Sets the `editable` (`editable`).
   * @zh 设置当前节点是否可编辑（`editable`）。
   * @param c - New editable value (`boolean`) / 是否可编辑（`boolean`）
   */
  set editable(c: boolean) {
    if (this.data) {
      this.data['editable'] = c;
    }
  }

  private _resolveFieldName(key: string): string {
    switch (key) {
      case 'id':
        return this.options.idField;
      case 'display':
        return this.options.displayField;
      case 'children':
        return this.options.childrenField;
      case 'isExpanded':
        return this.options.isExpandedField;
      case 'hasChildren':
        return this.options.hasChildrenField;
      default:
        return `${key}Field`;
    }
  }

  /**
   * Executes `getField` to read a mapped field from `data`.
   * @zh 执行 `getField`，根据 `options` 字段名映射读取 `data` 中的对应属性。
   * @param key - key parameter (`string`) / 逻辑字段键名（`string`）
   * @returns Result of type `unknown` / 类型为 `unknown` 的返回值
   */
  getField(key: string): unknown {
    const fieldName = this._resolveFieldName(key);
    return this.data ? this.data[fieldName] : undefined;
  }

  /**
   * Executes `setField` to write a mapped field to `data` safely (ignoring read-only getters).
   * @zh 执行 `setField`，安全写入映射字段到 `data`（遇到只读计算属性时自动忽略异常）。
   * @param key - key parameter (`string`) / 逻辑字段键名（`string`）
   * @param value - value parameter (`unknown`) / 字段新值（`unknown`）
   */
  setField(key: string, value: unknown): void {
    const field = this._resolveFieldName(key);
    if (this.data === undefined || this.data === null || this.data[field] === value) {
      return;
    }
    /*
     * **节点的 data 可能是个模型对象,这一项是算出来的、写不进去。**
     * 目录树的节点就是这样:data 是 sdos 的 CatalogGroup,`hasChildren` 由成员数量派生,
     * 删一个图层时 removeNode 顺手回写它,只读访问器会抛异常——
     * 而这类属性本来就不用写,成员变了它自己就变了。
     */
    try {
      this.data[field] = value;
    } catch {
      // 只读/计算属性,忽略
    }
  }

  /**
   * Executes `clear` to dispose and clear child nodes.
   * @zh 执行 `clear`，释放并清空当前节点的所有子节点。
   */
  public clear(): void {
    const children = this._childrenSig();
    if (children) {
      children.forEach((c: TreeNode) => c.dispose());
    }
    this._childrenSig.set([]);
  }

  /**
   * Executes `addNode` to append a new child node reactively.
   * @zh 执行 `addNode`，创建并以 Signal 不可变方式追加子节点。
   * @param node - node parameter (`Record<string, unknown>`) / 新子节点原始数据（`Record<string, unknown>`）
   * @returns Result of type `TreeNode` / 类型为 `TreeNode` 的返回值
   */
  public addNode(node: Record<string, unknown>): TreeNode {
    const current = this._childrenSig() ?? [];
    const treeNode = new TreeNode(node, this, this.treeModel, current.length);
    this._childrenSig.set([...current, treeNode]);
    return treeNode;
  }

  /**
   * Executes `destroy` to remove this node from its parent and dispose resources.
   * @zh 执行 `destroy`，从父节点移除自身并释放关联资源。
   */
  public destroy(): void {
    if (this.parent && this.parent.children) {
      const nextChildren = this.parent.children.filter((child: TreeNode) => child.id !== this.id);
      this.parent.children = nextChildren;
      this.parent.setIsActive(true);
    }
    // 被销毁时，将自己释放
    this.dispose();
  }

  /**
   * Executes `_findAdjacentSibling` to locate a sibling offset by `steps`.
   * @zh 执行 `_findAdjacentSibling`，按偏移步长查找相邻同级节点。
   * @param steps - steps parameter (`number`) / 偏移步长（`number`）
   * @param skipHidden - skip hidden parameter (`boolean`) / 是否跳过隐藏节点（`boolean`）
   * @returns Result of type `TreeNode` / 类型为 `TreeNode` 的返回值
   */
  _findAdjacentSibling(steps: number, skipHidden = false): TreeNode | null {
    const siblings = this._getParentsChildren(skipHidden);
    const idx = siblings.indexOf(this);
    const targetIdx = idx + steps;
    return targetIdx >= 0 && targetIdx < siblings.length ? siblings[targetIdx] : null;
  }

  /**
   * Executes `findNextSibling` to find the next sibling node.
   * @zh 执行 `findNextSibling`，查找下一个兄弟节点。
   * @param skipHidden - skip hidden parameter (`boolean`) / 是否跳过隐藏节点（`boolean`）
   * @returns Result of type `TreeNode` / 类型为 `TreeNode` 的返回值
   */
  findNextSibling(skipHidden = false): TreeNode | null {
    return this._findAdjacentSibling(+1, skipHidden);
  }

  /**
   * Executes `findPreviousSibling` to find the previous sibling node.
   * @zh 执行 `findPreviousSibling`，查找上一个兄弟节点。
   * @param skipHidden - skip hidden parameter (`boolean`) / 是否跳过隐藏节点（`boolean`）
   * @returns Result of type `TreeNode` / 类型为 `TreeNode` 的返回值
   */
  findPreviousSibling(skipHidden = false): TreeNode | null {
    return this._findAdjacentSibling(-1, skipHidden);
  }

  /**
   * Executes `getVisibleChildren` to return visible child nodes.
   * @zh 执行 `getVisibleChildren`，返回当前节点的可见子节点数组。
   * @returns Result of type `TreeNode[]` / 类型为 `TreeNode[]` 的返回值
   */
  getVisibleChildren(): TreeNode[] {
    return this.visibleChildren;
  }

  /**
   * Executes `getPathValue` to collect a named data field along the ancestor path.
   * @zh 执行 `getPathValue`，沿祖先链收集指定字段名的值列表。
   * @param val - val parameter (`string[]`) / 初始累加数组（`string[]`）
   * @param name - name parameter (`string`) / 数据字段名（`string`）
   * @returns Result of type `string[]` / 类型为 `string[]` 的返回值
   */
  getPathValue(val: string[], name: string): string[] {
    let acc = val;
    if (this.parent) {
      acc = this.parent.getPathValue(acc, name);
    }
    if (this.data && this.data[name]) {
      acc = concat(acc, [String(this.data[name])]);
    } else {
      acc = concat(acc, []);
    }
    return acc;
  }

  /**
   * Gets the current `visibleChildren` (`TreeNode[]`).
   * @zh 获取当前节点的可见子节点列表（`TreeNode[]`）。
   */
  get visibleChildren(): TreeNode[] {
    return this._visibleChildrenComputed();
  }

  /**
   * Executes `getFirstChild` to get the first child node.
   * @zh 执行 `getFirstChild`，获取第一个子节点。
   * @param skipHidden - skip hidden parameter (`boolean`) / 是否跳过隐藏节点（`boolean`）
   * @returns Result of type `TreeNode` / 类型为 `TreeNode` 的返回值
   */
  getFirstChild(skipHidden = false): TreeNode | undefined {
    const children = skipHidden ? this.visibleChildren : this.children;
    return first(children || []);
  }

  /**
   * Executes `getLastChild` to get the last child node.
   * @zh 执行 `getLastChild`，获取最后一个子节点。
   * @param skipHidden - skip hidden parameter (`boolean`) / 是否跳过隐藏节点（`boolean`）
   * @returns Result of type `TreeNode` / 类型为 `TreeNode` 的返回值
   */
  getLastChild(skipHidden = false): TreeNode | undefined {
    const children = skipHidden ? this.visibleChildren : this.children;
    return last(children || []);
  }

  /**
   * Executes `findNextNode` to locate the next node in visual tree order.
   * @zh 执行 `findNextNode`，按视觉顺序查找下一个树节点。
   * @param goInside - go inside parameter (`boolean`) / 是否深入已展开子节点（`boolean`）
   * @param skipHidden - skip hidden parameter (`boolean`) / 是否跳过隐藏节点（`boolean`）
   * @returns Result of type `TreeNode` / 类型为 `TreeNode` 的返回值
   */
  findNextNode(goInside = true, skipHidden = false): TreeNode | null | undefined {
    return (
      (goInside && this.isExpanded && this.getFirstChild(skipHidden)) ||
      this.findNextSibling(skipHidden) ||
      (this.parent && this.parent.findNextNode(false, skipHidden))
    );
  }

  /**
   * Executes `findPreviousNode` to locate the previous node in visual tree order.
   * @zh 执行 `findPreviousNode`，按视觉顺序查找上一个树节点。
   * @param skipHidden - skip hidden parameter (`boolean`) / 是否跳过隐藏节点（`boolean`）
   * @returns Result of type `TreeNode` / 类型为 `TreeNode` 的返回值
   */
  findPreviousNode(skipHidden = false): TreeNode | null {
    const previousSibling = this.findPreviousSibling(skipHidden);
    if (!previousSibling) {
      return this.realParent;
    }
    return previousSibling._getLastOpenDescendant(skipHidden);
  }

  /**
   * Executes `_getLastOpenDescendant` to find the deepest visible expanded descendant.
   * @zh 执行 `_getLastOpenDescendant`，查找最后一个展开可见的后代节点。
   * @param skipHidden - skip hidden parameter (`boolean`) / 是否跳过隐藏节点（`boolean`）
   * @returns Result of type `TreeNode` / 类型为 `TreeNode` 的返回值
   */
  _getLastOpenDescendant(skipHidden = false): TreeNode {
    const lastChild = this.getLastChild(skipHidden);
    return this.isCollapsed || !lastChild ? this : lastChild._getLastOpenDescendant(skipHidden);
  }

  private _getParentsChildren(skipHidden = false): TreeNode[] {
    const children = this.parent && (skipHidden ? this.parent.getVisibleChildren() : this.parent.children);
    return children || [];
  }

  /**
   * Executes `getRoot` to find the top-level root ancestor of this node.
   * @zh 执行 `getRoot`，向上追溯并返回顶层根节点。
   * @param node - node parameter (`TreeNode`) / 起始节点（`TreeNode`）
   * @returns Result of type `TreeNode` / 类型为 `TreeNode` 的返回值
   */
  public getRoot(node?: TreeNode): TreeNode {
    const current = node ?? this;
    if (current.isRoot) {
      return current;
    }
    if (current.parent && current.parent.isRoot) {
      return current.parent;
    }
    return current.parent ? this.getRoot(current.parent) : current;
  }

  /**
   * Executes `getAllParents` to collect all parent nodes into `result`.
   * @zh 执行 `getAllParents`，收集所有父级祖先节点到结果数组中。
   * @param result - result parameter (`TreeNode[]`) / 结果收集数组（`TreeNode[]`）
   */
  public getAllParents(result: TreeNode[]): void {
    if (this.parent) {
      result.push(this.parent);
      this.parent.getAllParents(result);
    }
  }

  /**
   * Executes `getAllChildren` to collect all descendant nodes into `result`.
   * @zh 执行 `getAllChildren`，递归收集全部后代子节点到结果数组中。
   * @param result - result parameter (`TreeNode[]`) / 结果收集数组（`TreeNode[]`）
   */
  public getAllChildren(result: TreeNode[]): void {
    if (this.children) {
      this.children.forEach((child: TreeNode) => {
        result.push(child);
        if (child.children) {
          child.getAllChildren(result);
        }
      });
    }
  }

  /**
   * Executes `getIndexInParent` to find this node's index within its parent's children.
   * @zh 执行 `getIndexInParent`，获取当前节点在父节点子列表中的位置索引。
   * @param skipHidden - skip hidden parameter (`boolean`) / 是否跳过隐藏节点（`boolean`）
   * @returns Result of type `number` / 类型为 `number` 的返回值
   */
  getIndexInParent(skipHidden = false): number {
    return this._getParentsChildren(skipHidden).indexOf(this);
  }

  /**
   * Executes `isDescendantOf` to check whether this node is `node` or a descendant of `node`.
   * @zh 执行 `isDescendantOf`，判断当前节点是否为目标节点或其后代。
   * @param node - node parameter (`ITreeNode`) / 目标节点参数（`ITreeNode`）
   * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
   */
  isDescendantOf(node: ITreeNode): boolean {
    if (this === node) {
      return true;
    }
    return Boolean(this.parent && this.parent.isDescendantOf(node));
  }

  /**
   * Executes `getNodePadding` to compute left indentation padding CSS value.
   * @zh 执行 `getNodePadding`，计算当前节点层级的左侧缩进像素字符串。
   * @returns Result of type `string` / 类型为 `string` 的返回值
   */
  getNodePadding(): string {
    return this.options.levelPadding * (this.level - 1) + 'px';
  }

  /**
   * Executes `getClass` to build custom and level CSS class names for the node.
   * @zh 执行 `getClass`，生成当前节点的自定义类名与层级类名字符串。
   * @returns Result of type `string` / 类型为 `string` 的返回值
   */
  getClass(): string {
    return [this.options.nodeClass(this), `tree-node-level-${this.level}`].join(' ');
  }

  /**
   * Executes `onDrop` to handle drop events on this node.
   * @zh 执行 `onDrop`，处理拖拽放置到当前节点的事件。
   * @param $event - event parameter (`{ event?: unknown; element?: unknown; }`) / 放置事件对象（`{ event?: unknown; element?: unknown; }`）
   */
  onDrop($event: { event?: unknown; element?: unknown }): void {
    this.mouseAction('drop', $event.event, {
      from: $event.element,
      to: { parent: this, index: 0, dropOnNode: true },
    });
  }

  /**
   * Property `allowDrop` evaluating whether an element can be dropped onto this node.
   * @zh 属性函数 `allowDrop`，校验被拖拽元素是否允许放置到当前节点。
   */
  allowDrop = (element: unknown, $event?: unknown): boolean => {
    return this.options.allowDrop(element, { parent: this, index: 0 }, $event);
  };

  /**
   * Property `allowDragoverStyling` returning dragover styling flag from options.
   * @zh 属性函数 `allowDragoverStyling`，返回是否启用拖拽悬停样式。
   */
  allowDragoverStyling = (): boolean => {
    return this.options.allowDragoverStyling;
  };

  /**
   * Executes `allowDrag` to check whether dragging this node is allowed.
   * @zh 执行 `allowDrag`，判断当前节点是否允许被拖拽。
   * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
   */
  allowDrag(): boolean {
    return this.options.allowDrag(this);
  }

  /**
   * Executes `setNodeChildren` to set child data array and initialize `TreeNode` instances.
   * @zh 执行 `setNodeChildren`，写入子节点数据并初始化子节点实例列表。
   * @param children - children parameter (`Record<string, unknown>[]`) / 子节点原始数组（`Record<string, unknown>[]`）
   */
  setNodeChildren(children: Record<string, unknown>[]): void {
    if (children) {
      this.setField('hasChildren', children.length > 0);
      this.setField('children', children);
      this._initChildren();
      this.children.forEach((child: TreeNode) => {
        if (child.getField('isExpanded') && child.hasChildren) {
          child.expand();
        }
      });
    }
    this.fireEvent({
      eventName: TREE_EVENTS.loadNodeChildren,
      node: this,
    });
  }

  /**
   * Executes `loadNodeChildren` to asynchronously fetch children via `options.getChildren`.
   * @zh 执行 `loadNodeChildren`，通过 `options.getChildren` 异步加载子节点并同步级联勾选态。
   * @returns Result of type `Promise<void>` / 类型为 `Promise<void>` 的返回值
   */
  loadNodeChildren(): Promise<void> {
    if (!this.options.getChildren) {
      return Promise.resolve();
    }
    return Promise.resolve(this.options.getChildren(this))
      .then((children: Record<string, unknown>[]) => {
        if (children) {
          this.setField('hasChildren', children.length > 0);
          this.setField('children', children);
          this._initChildren();
          if (this.options.useTriState && this.treeModel.isSelected(this)) {
            this.setIsSelected(true);
          }
          this.children.forEach((child: TreeNode) => {
            if (child.getField('isExpanded') && child.hasChildren) {
              child.expand();
            }
          });
        }
      })
      .then(() => {
        this.fireEvent({
          eventName: TREE_EVENTS.loadNodeChildren,
          node: this,
        });
      });
  }

  /**
   * Executes `expand` to expand this node.
   * @zh 执行 `expand`，展开当前节点。
   * @param silent - silent parameter (`boolean`) / 是否静默不派发事件（`boolean`）
   * @returns Result of type `this` / 类型为 `this` 的返回值
   */
  expand(silent = false): this {
    if (!this.isExpanded) {
      this.toggleExpanded(silent);
    }
    return this;
  }

  /**
   * Executes `collapse` to collapse this node.
   * @zh 执行 `collapse`，折叠当前节点。
   * @param silent - silent parameter (`boolean`) / 是否静默不派发事件（`boolean`）
   * @returns Result of type `this` / 类型为 `this` 的返回值
   */
  collapse(silent = false): this {
    if (this.isExpanded) {
      this.toggleExpanded(silent);
    }
    return this;
  }

  /**
   * Executes `doForAll` to run a callback depth-first on this node and its descendants.
   * @zh 执行 `doForAll`，对当前节点及所有后代执行深度优先回调。
   * @param fn - fn parameter (`(node: ITreeNode) => unknown`) / 回调函数参数（`(node: ITreeNode) => unknown`）
   */
  doForAll(fn: (node: ITreeNode) => unknown): void {
    void Promise.resolve(fn(this)).then(() => {
      if (this.children) {
        this.children.forEach((child: TreeNode) => child.doForAll(fn));
      }
    });
  }

  /**
   * Executes `doForAncestors` to run a callback on this node and all ancestors.
   * @zh 执行 `doForAncestors`，对当前节点及所有父级祖先依次执行回调。
   * @param fn - fn parameter (`(node: ITreeNode) => unknown`) / 回调函数参数（`(node: ITreeNode) => unknown`）
   */
  doForAncestors(fn: (node: ITreeNode) => unknown): void {
    void Promise.resolve(fn(this)).then(() => {
      if (this.parent) {
        this.parent.doForAncestors(fn);
      }
    });
  }

  /**
   * Executes `expandAncestors` to expand this node and its ancestors.
   * @zh 执行 `expandAncestors`，展开当前节点及其所有父级祖先。
   */
  expandAncestors(): void {
    this.doForAncestors((node: ITreeNode) => node.expand());
  }

  /**
   * Executes `expandAll` to expand this subtree.
   * @zh 执行 `expandAll`，展开当前子树下所有节点。
   */
  expandAll(): void {
    this.doForAll((node: ITreeNode) => node.expand());
  }

  /**
   * Executes `collapseAll` to collapse this subtree.
   * @zh 执行 `collapseAll`，折叠当前子树下所有节点。
   */
  collapseAll(): void {
    this.doForAll((node: ITreeNode) => node.collapse());
  }

  /**
   * Executes `ensureVisible` to expand all real parent nodes above this node.
   * @zh 执行 `ensureVisible`，逐层展开所有真实父节点以确保本节点可见。
   * @returns Result of type `this` / 类型为 `this` 的返回值
   */
  ensureVisible(): this {
    if (this.realParent) {
      this.realParent.expand();
      this.realParent.ensureVisible();
    }
    return this;
  }

  /**
   * Executes `toggleExpanded` to toggle expansion state.
   * @zh 执行 `toggleExpanded`，切换当前节点的展开/折叠状态。
   * @param silent - silent parameter (`boolean`) / 是否静默不派发事件（`boolean`）
   * @returns Result of type `this` / 类型为 `this` 的返回值
   */
  toggleExpanded(silent = false): this {
    this.setIsExpanded(!this.isExpanded, silent);
    return this;
  }

  /**
   * Executes `setIsExpanded` to explicitly set expansion state if the node has children.
   * @zh 执行 `setIsExpanded`，在具备子节点时设置展开状态。
   * @param value - value parameter (`boolean`) / 是否展开（`boolean`）
   * @param silent - silent parameter (`boolean`) / 是否静默不派发事件（`boolean`）
   * @returns Result of type `this` / 类型为 `this` 的返回值
   */
  setIsExpanded(value: boolean, silent = false): this {
    if (this.hasChildren) {
      this.treeModel.setExpandedNode(this, value, silent);
    }
    return this;
  }

  /**
   * Executes `_checkAutoLoadChildren` to trigger lazy child loading when expanded without loaded children.
   * @zh 执行 `_checkAutoLoadChildren`，当节点处于展开态且尚未加载子节点时触发懒加载。
   */
  _checkAutoLoadChildren(): void {
    if (!this._childrenSig() && this.hasChildren && this.isExpanded) {
      void this.loadNodeChildren();
    }
  }

  /**
   * Executes `autoLoadChildren` to perform initial lazy-load check without MobX `reaction`.
   * @zh 执行 `autoLoadChildren`，初始化检查是否需要自动异步加载子节点（零 MobX 依赖）。
   */
  autoLoadChildren(): void {
    this._checkAutoLoadChildren();
  }

  // ✨ 核心机制：在组件或节点被卸载时，释放 Map 中的引用，防止内存泄漏
  /**
   * Executes `dispose` to recursively dispose children and unregister from `nodeRegistry`.
   * @zh 执行 `dispose`，递归销毁子节点并从 `nodeRegistry` 移除自身引用。
   */
  dispose(): void {
    const children = this._childrenSig();
    if (children) {
      children.forEach((child: TreeNode) => child.dispose());
    }

    if (this.id !== undefined && this.id !== null && this.treeModel) {
      this.treeModel.nodeRegistry.delete(this.id.toString());
    }

    this.parent = null;
    this._childrenSig.set(null);
  }

  /**
   * Executes `setIsActive` to set active state and focus when activated.
   * @zh 执行 `setIsActive`，设置激活状态并在激活时聚焦节点。
   * @param value - value parameter (`boolean`) / 是否激活（`boolean`）
   * @param multi - multi parameter (`boolean`) / 是否多选激活（`boolean`）
   * @returns Result of type `this` / 类型为 `this` 的返回值
   */
  setIsActive(value: boolean, multi = false): this {
    this.treeModel.setActiveNode(this, value, multi);
    if (value) {
      this.focus();
    }
    return this;
  }

  /**
   * Executes `isSelectable` to determine if this node stores its own leaf selection flag.
   * @zh 执行 `isSelectable`，判断当前节点是否作为独立可勾选叶子节点处理。
   * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
   */
  isSelectable(): boolean {
    return this.isLeaf || !this.children || !this.options.useTriState;
  }

  /**
   * Executes `setIsSelected` to set checkbox selection (with tri-state cascade when configured).
   * @zh 执行 `setIsSelected`，设置复选框选中态（支持父子级联勾选）。
   * @param value - value parameter (`boolean`) / 是否勾选（`boolean`）
   * @param silent - silent parameter (`boolean`) / 是否静默不派发事件（`boolean`）
   * @returns Result of type `this` / 类型为 `this` 的返回值
   */
  setIsSelected(value: boolean, silent?: boolean): this {
    if (this.options.cascadeSelect) {
      if (this.isLeaf) {
        this.treeModel.setSelectedNode(this, value, silent);
      } else if (this.children) {
        this.children.forEach((child: TreeNode) => child.setIsSelected(value, silent));
      } else {
        this.treeModel.setSelectedNode(this, value, silent);
      }
    } else if (this.isSelectable()) {
      this.treeModel.setSelectedNode(this, value, silent);
    } else {
      this.visibleChildren.forEach((child: TreeNode) => child.setIsSelected(value, silent));
    }
    return this;
  }

  /**
   * Executes `toggleSelected` to toggle checkbox selection state.
   * @zh 执行 `toggleSelected`，切换节点勾选状态。
   * @returns Result of type `this` / 类型为 `this` 的返回值
   */
  toggleSelected(): this {
    this.setIsSelected(!this.isSelected);
    return this;
  }

  /**
   * Executes `toggleActivated` to toggle active state.
   * @zh 执行 `toggleActivated`，切换节点激活状态。
   * @param multi - multi parameter (`boolean`) / 是否多选激活（`boolean`）
   * @returns Result of type `this` / 类型为 `this` 的返回值
   */
  toggleActivated(multi = false): this {
    this.setIsActive(!this.isActive, multi);
    return this;
  }

  /**
   * Executes `setActiveAndVisible` to activate node, expand ancestors, and scroll into view.
   * @zh 执行 `setActiveAndVisible`，激活节点、展开祖先链并滚动到可视区域。
   * @param multi - multi parameter (`boolean`) / 是否多选激活（`boolean`）
   * @returns Result of type `this` / 类型为 `this` 的返回值
   */
  setActiveAndVisible(multi = false): this {
    this.setIsActive(true, multi).ensureVisible();
    setTimeout(this.scrollIntoView.bind(this));
    return this;
  }

  /**
   * Executes `scrollIntoView` to scroll this node into the viewport if virtualScroll is attached.
   * @zh 执行 `scrollIntoView`，在已挂载虚拟滚动控制器时将当前节点滚动至可视区。
   * @param force - force parameter (`boolean`) / 是否强制滚动（`boolean`）
   */
  scrollIntoView(force = false): void {
    if (this.treeModel.virtualScroll) {
      this.treeModel.virtualScroll.scrollIntoView(this, force);
    }
  }

  /**
   * Executes `focus` to set keyboard focus on this node.
   * @zh 执行 `focus`，将树焦点设置到当前节点并派发 `focus`/`blur` 事件。
   * @param scroll - scroll parameter (`boolean`) / 是否联动滚动到可视区（`boolean`）
   * @returns Result of type `this` / 类型为 `this` 的返回值
   */
  focus(scroll = true): this {
    const previousNode = this.treeModel.getFocusedNode();
    this.treeModel.setFocusedNode(this);
    if (scroll) {
      this.scrollIntoView();
    }
    if (previousNode) {
      this.fireEvent({ eventName: TREE_EVENTS.blur, node: previousNode });
    }
    this.fireEvent({ eventName: TREE_EVENTS.focus, node: this });
    return this;
  }

  /**
   * Executes `blur` to clear keyboard focus from this node.
   * @zh 执行 `blur`，移除当前节点的聚焦状态。
   * @returns Result of type `this` / 类型为 `this` 的返回值
   */
  blur(): this {
    const previousNode = this.treeModel.getFocusedNode();
    this.treeModel.setFocusedNode(null);
    if (previousNode) {
      this.fireEvent({ eventName: TREE_EVENTS.blur, node: this });
    }
    return this;
  }

  /**
   * Executes `setIsHidden` to hide or show this node.
   * @zh 执行 `setIsHidden`，设置当前节点的隐藏状态。
   * @param value - value parameter (`boolean`) / 是否隐藏（`boolean`）
   */
  setIsHidden(value: boolean): void {
    this.treeModel.setIsHidden(this, value);
  }

  /**
   * Executes `hide` to hide this node.
   * @zh 执行 `hide`，隐藏当前节点。
   */
  hide(): void {
    this.setIsHidden(true);
  }

  /**
   * Executes `show` to make this node visible.
   * @zh 执行 `show`，显示当前节点。
   */
  show(): void {
    this.setIsHidden(false);
  }

  /**
   * Executes `mouseAction` to invoke mapped mouse action handlers.
   * @zh 执行 `mouseAction`，聚焦当前树并调用动作映射表中的鼠标交互处理器。
   * @param actionName - action name parameter (`string`) / 动作名称（`string`）
   * @param $event - event parameter (`unknown`) / 触发事件对象（`unknown`）
   * @param data - data parameter (`unknown`) / 附加数据载荷（`unknown`）
   */
  mouseAction(actionName: string, $event: unknown, data: unknown = null): void {
    this.treeModel.setFocus(true);

    const actionMapping = this.options.actionMapping.mouse as Record<string, ((...args: unknown[]) => void) | undefined>;
    const mouseHandler = actionMapping ? actionMapping[actionName] : undefined;

    if (mouseHandler) {
      mouseHandler(this.treeModel, this, $event, data);
    }
  }

  /**
   * Executes `getSelfHeight` to compute height of this single node row.
   * @zh 执行 `getSelfHeight`，获取当前节点单行高度像素值。
   * @returns Result of type `number` / 类型为 `number` 的返回值
   */
  getSelfHeight(): number {
    return this.options.nodeHeight(this);
  }

  /**
   * Executes `_initChildren` to instantiate child `TreeNode`s from mapped children field.
   * @zh 执行 `_initChildren`，从原始子节点数组构建 `TreeNode` 子实例列表并写入 Signal。
   */
  _initChildren(): void {
    const prev = this._childrenSig();
    if (prev) {
      prev.forEach((c: TreeNode) => c.dispose());
    }
    const childs = (this.getField('children') as Record<string, unknown>[]) || [];
    this._childrenSig.set(
      childs.map((c: Record<string, unknown>, idx: number) => new TreeNode(c, this, this.treeModel, idx)),
    );
  }
}

function uuid(): number {
  return Math.floor(Math.random() * 10000000000000);
}
