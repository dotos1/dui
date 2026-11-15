/**
 * @fileoverview Module `src/tree/models/tree-node.model.ts` providing tree node model definitions and implementation.
 * @zh 模块文件 `src/tree/models/tree-node.model.ts`，提供树形控件节点模型相关的定义与实现。
 */

import { TranslateService } from '@dotos/dui/translator';
import { concat, first, last, some, every } from 'lodash-es';
import { IReactionDisposer, action, computed, makeObservable, observable, reaction } from 'mobx';

import { TREE_EVENTS } from '../constants/events';
import { IDType, ITreeNode } from '../defs/api';
import { TreeOptions } from './tree-options.model';
import { TreeModel } from './tree.model';

/**
 * Class `TreeNode` encapsulating tree node data structures and logic in `src/tree/models`.
 * @zh 类 `TreeNode`，封装 `src/tree/models` 中的树形控件节点数据结构与处理逻辑。
 */
export class TreeNode implements ITreeNode {
  /**
   * Property `handler` (`IReactionDisposer`) storing handler.
   * @zh 属性 `handler`（类型：`IReactionDisposer`），用于存储或配置处理器。
   */
  private handler: IReactionDisposer;
  
  /**
   * Gets the current is hidden (`isHidden: boolean`).
   * @zh 获取当前是否为隐藏（`isHidden: boolean`）。
   */
  @computed get isHidden(): boolean { return this.treeModel.isHidden(this); }
  /**
   * Gets the current is expanded (`isExpanded: boolean`).
   * @zh 获取当前是否为已展开（`isExpanded: boolean`）。
   */
  @computed get isExpanded(): boolean { return this.treeModel.isExpanded(this); }
  /**
   * Gets the current is active (`isActive: boolean`).
   * @zh 获取当前是否为激活（`isActive: boolean`）。
   */
  @computed get isActive(): boolean { return this.treeModel.isActive(this); }
  /**
   * Gets the current is focused (`isFocused: boolean`).
   * @zh 获取当前是否为已聚焦（`isFocused: boolean`）。
   */
  @computed get isFocused(): boolean { return this.treeModel.isNodeFocused(this); }

  /**
   * Gets the current is selected (`isSelected: boolean`).
   * @zh 获取当前是否为已选中（`isSelected: boolean`）。
   */
  @computed get isSelected(): boolean {
    if (this.isSelectable()) {
      return this.treeModel.isSelected(this);
    } else {
      return some(this.children, (node) => node.isSelected);
    }
  }
  
  /**
   * Gets the current is all selected (`isAllSelected: boolean`).
   * @zh 获取当前是否为全部已选中（`isAllSelected: boolean`）。
   */
  @computed get isAllSelected(): boolean {
    if (this.isSelectable()) {
      return this.treeModel.isSelected(this);
    } else {
      return every(this.children, (node) => node.isAllSelected);
    }
  }
  
  /**
   * Gets the current is partially selected (`isPartiallySelected: boolean`).
   * @zh 获取当前是否为Partially已选中（`isPartiallySelected: boolean`）。
   */
  @computed get isPartiallySelected(): boolean {
    return this.isSelected && !this.isAllSelected;
  }

  /**
   * Property `children` (`TreeNode[]`) storing children.
   * @zh 属性 `children`（类型：`TreeNode[]`），用于存储或配置子级列表。
   */
  @observable children: TreeNode[] = undefined;
  /**
   * Property `index` (`number`) storing index.
   * @zh 属性 `index`（类型：`number`），用于存储或配置索引。
   */
  @observable index: number = undefined;
  /**
   * Property `position` (`number`) storing position (default: `0`).
   * @zh 属性 `position`（类型：`number`），用于存储或配置位置（默认值：`0`）。
   */
  @observable position = 0;
  /**
   * Property `height` (`number`) storing height.
   * @zh 属性 `height`（类型：`number`），用于存储或配置高度。
   */
  @observable height: number = undefined;
  
  /**
   * Gets the current level (`level: number`).
   * @zh 获取当前层级（`level: number`）。
   */
  @computed get level(): number {
    return this.parent ? this.parent.level + 1 : 0;
  }
  /**
   * Gets the current path (`path: string[]`).
   * @zh 获取当前路径（`path: string[]`）。
   */
  @computed get path(): string[] {
    return this.parent ? [...this.parent.path, String(this.id)] : [];
  }

  /**
   * Gets the current element ref (`elementRef: never`).
   * @zh 获取当前元素引用（`elementRef: never`）。
   */
  get elementRef(): never {
    throw new Error(`Element Ref is no longer supported since introducing virtual scroll\n
      You may use a template to obtain a reference to the element`);
  }

  /**
   * Property `_originalNode` (`any`) storing original node.
   * @zh 属性 `_originalNode`（类型：`any`），用于存储或配置原始节点。
   */
  private _originalNode;
  /**
   * Gets the current original node (`originalNode: unknown`).
   * @zh 获取当前原始节点（`originalNode: unknown`）。
   */
  get originalNode(): unknown { return this._originalNode; }
  /**
   * Property `translator` (`TranslateService`) storing translator.
   * @zh 属性 `translator`（类型：`TranslateService`），用于存储或配置翻译器。
   */
  private translator: TranslateService;
  
  /**
   * Creates an instance of `TreeNode` and initializes its dependencies and internal state.
   * @zh 创建 `TreeNode` 实例，并初始化其依赖项与内部状态。
   * @param data - Injected or initial data (`any`) / 注入或传入的数据（`any`）
   * @param parent - Injected or initial parent (`TreeNode`) / 注入或传入的父级（`TreeNode`）
   * @param treeModel - Injected or initial tree model (`TreeModel`) / 注入或传入的树形控件模型（`TreeModel`）
   * @param index - Injected or initial index (`number`) / 注入或传入的索引（`number`）
   */
  constructor(public data, public parent: TreeNode, public treeModel: TreeModel, index?: number) {
    makeObservable(this);
    if (this.id === undefined || this.id === null) {
      this.id = uuid();
    }

    // ✨ 核心机制：在实例化时，将本节点注入到全局 Map 进行缓存
    this.treeModel.nodeRegistry.set(this.id.toString(), this);

    this.index = index;
    this.translator = treeModel.translator;
    if (this.getField('children')) {
      this._initChildren();
    }

    if (this.data['isSelected']) {
      this.setIsSelected(true);
    } else {
      this.setIsSelected(false);
    }
    this.autoLoadChildren();
  }

  // helper get functions:
  /**
   * Gets the current has children (`hasChildren: boolean`).
   * @zh 获取当前是否包含子级列表（`hasChildren: boolean`）。
   */
  get hasChildren(): boolean {
    return !!(this.getField('hasChildren') || (this.children && this.children.length > 0));
  }
  /**
   * Gets the current is collapsed (`isCollapsed: boolean`).
   * @zh 获取当前是否为已折叠（`isCollapsed: boolean`）。
   */
  get isCollapsed(): boolean { return !this.isExpanded; }
  /**
   * Gets the current is leaf (`isLeaf: boolean`).
   * @zh 获取当前是否为叶子节点（`isLeaf: boolean`）。
   */
  get isLeaf(): boolean { return !this.hasChildren; }
  /**
   * Gets the current is root (`isRoot: boolean`).
   * @zh 获取当前是否为根节点（`isRoot: boolean`）。
   */
  get isRoot(): boolean { return this.parent == null || this.parent.data.virtual; }
  /**
   * Gets the current real parent (`realParent: TreeNode`).
   * @zh 获取当前real父级（`realParent: TreeNode`）。
   */
  get realParent(): TreeNode { return this.isRoot ? null : this.parent; }

  // proxy functions:
  /**
   * Gets the current options (`options: TreeOptions`).
   * @zh 获取当前配置选项（`options: TreeOptions`）。
   */
  get options(): TreeOptions { return this.treeModel.options; }

  /**
   * Executes `fireEvent` to handle fire event.
   * @zh 执行 `fireEvent`，用于触发事件。
   * @param event - event parameter (`any`) / 事件参数（`any`）
   */
  fireEvent(event) { this.treeModel.fireEvent(event); }

  /**
   * Gets the current display field (`displayField: string`).
   * @zh 获取当前display字段（`displayField: string`）。
   */
  get displayField(): string {
    return this.translator.instant(this.getField('display'));
  }

  /**
   * Gets the current id (`id: IDType`).
   * @zh 获取当前唯一标识（`id: IDType`）。
   */
  get id(): IDType {
    return this.getField('id');
  }

  // ✨ 核心机制修复：处理运行时 ID 变更的异常情况，保障 Map 数据一致性
  /**
   * Sets the id (`id`).
   * @zh 设置唯一标识（`id`）。
   * @param value - New id value (`IDType`) / 新的唯一标识值（`IDType`）
   */
  set id(value: IDType) {
    const oldId = this.getField('id');
    // 如果原先有旧的ID，先从字典里清除
    if (oldId !== undefined && oldId !== null && this.treeModel) {
      this.treeModel.nodeRegistry.delete(oldId.toString());
    }
    this.setField('id', value);
    // 更新后重新写进字典
    if (value !== undefined && value !== null && this.treeModel) {
      this.treeModel.nodeRegistry.set(value.toString(), this);
    }
  }

  /**
   * Gets the current expanded icon (`expandedIcon: string`).
   * @zh 获取当前已展开图标（`expandedIcon: string`）。
   */
  get expandedIcon(): string {
    return this.data['expandedIcon'];
  }

  /**
   * Gets the current icon (`icon: string`).
   * @zh 获取当前图标（`icon: string`）。
   */
  get icon(): string {
    return this.data['icon'];
  }

  /**
   * Sets the icon (`icon`).
   * @zh 设置图标（`icon`）。
   * @param icon - New icon value (`string`) / 新的图标值（`string`）
   */
  set icon(icon: string) {
    this.data['icon'] = icon;
  }

  /**
   * Gets the current tool tip (`toolTip: string`).
   * @zh 获取当前tool提示（`toolTip: string`）。
   */
  get toolTip(): string {
    return this.data['toolTip'] ? this.translator.instant(this.data['toolTip']) : undefined;
  }

  /**
   * Sets the tool tip (`toolTip`).
   * @zh 设置tool提示（`toolTip`）。
   * @param toolTip - New tool tip value (`string`) / 新的tool提示值（`string`）
   */
  set toolTip(toolTip: string) {
    this.data['toolTip'] = toolTip;
  }

  /**
   * Gets the current checkable (`checkable: boolean`).
   * @zh 获取当前checkable（`checkable: boolean`）。
   */
  get checkable(): boolean {
    if (this.data['checkable'] == undefined) {
      return true;
    } else {
      return this.data['checkable'];
    }
  }

  /**
   * Sets the checkable (`checkable`).
   * @zh 设置checkable（`checkable`）。
   * @param c - New checkable value (`boolean`) / 新的checkable值（`boolean`）
   */
  set checkable(c: boolean) { this.data['checkable'] = c; }

  /**
   * Gets the current editable (`editable: boolean`).
   * @zh 获取当前是否可编辑（`editable: boolean`）。
   */
  get editable(): boolean {
    if (this.data['editable'] == undefined) {
      return false;
    } else {
      return this.data['editable'];
    }
  }

  /**
   * Sets the editable (`editable`).
   * @zh 设置是否可编辑（`editable`）。
   * @param c - New editable value (`boolean`) / 新的是否可编辑值（`boolean`）
   */
  set editable(c: boolean) { this.data['editable'] = c; }

  /**
   * Executes `getField` to handle get field.
   * @zh 执行 `getField`，用于获取字段。
   * @param key - key parameter (`any`) / 键参数（`any`）
   */
  getField(key) {
    return this.data[this.options[`${key}Field`]];
  }

  /**
   * Executes `setField` to handle set field.
   * @zh 执行 `setField`，用于集合字段。
   * @param key - key parameter (`any`) / 键参数（`any`）
   * @param value - value parameter (`any`) / 值参数（`any`）
   */
  setField(key, value) {
    const field = this.options[`${key}Field`];
    if (this.data == undefined || this.data[field] === value) {
      return;
    }
    /*
     * **节点的 data 可能是个模型对象,这一项是算出来的、写不进去。**
     * 目录树的节点就是这样:data 是 sdos 的 CatalogGroup,`hasChildren` 由成员数量派生
     * (mobx 的 computed),删一个图层时 removeNode 顺手回写它,mobx 直接抛
     * 「It is not possible to assign a new value to a computed value」——
     * 而这类属性本来就不用写,成员变了它自己就变了。
     */
    try {
      this.data[field] = value;
    } catch (e) {
      // 只读/计算属性,忽略
    }
  }
  
  /**
   * Executes `clear` to handle clear.
   * @zh 执行 `clear`，用于清空。
   */
  public clear() {
    if (this.children) {
      this.children.forEach(c => c.dispose());
    }
    this.children =[];
  }
  
  /**
   * Executes `addNode` to handle add node.
   * @zh 执行 `addNode`，用于添加节点。
   * @param node - node parameter (`any`) / 节点参数（`any`）
   */
  public addNode(node) {
    if (this.children == undefined) {
      this.children =[];
    }
    let treeNode = new TreeNode(node, this, this.treeModel, this.children.length);
    this.children.push(treeNode);
    return treeNode;
  }

  /**
   * Executes `destroy` to handle destroy.
   * @zh 执行 `destroy`，用于销毁。
   */
  public destroy() {
    let children = this.parent.children;
    for (let k = 0; k < children.length; k++) {
      if (children[k].id == this.id) {
        children.splice(k, 1); // 修复原生BUG: 这里应该是 splice(k, 1)
      }
    }
    this.parent.setIsActive(true);
    // 被销毁时，将自己释放
    this.dispose();
  }

  // traversing:
  /**
   * Executes `_findAdjacentSibling` to handle find adjacent sibling.
   * @zh 执行 `_findAdjacentSibling`，用于查找Adjacent兄弟节点。
   * @param steps - steps parameter (`any`) / 步骤参数（`any`）
   * @param skipHidden - skip hidden parameter (`boolean`) / skip隐藏参数（`boolean`）
   */
  _findAdjacentSibling(steps, skipHidden = false) {
    const siblings = this._getParentsChildren(skipHidden);
    const index = siblings.indexOf(this);
    return siblings.length > index + steps ? siblings[index + steps] : null;
  }

  /**
   * Executes `findNextSibling` to handle find next sibling.
   * @zh 执行 `findNextSibling`，用于查找下一个兄弟节点。
   * @param skipHidden - skip hidden parameter (`boolean`) / skip隐藏参数（`boolean`）
   */
  findNextSibling(skipHidden = false) {
    return this._findAdjacentSibling(+1, skipHidden);
  }

  /**
   * Executes `findPreviousSibling` to handle find previous sibling.
   * @zh 执行 `findPreviousSibling`，用于查找上一个兄弟节点。
   * @param skipHidden - skip hidden parameter (`boolean`) / skip隐藏参数（`boolean`）
   */
  findPreviousSibling(skipHidden = false) {
    return this._findAdjacentSibling(-1, skipHidden);
  }

  /**
   * Executes `getVisibleChildren` to handle get visible children.
   * @zh 执行 `getVisibleChildren`，用于获取可见子级列表。
   */
  getVisibleChildren() {
    return this.visibleChildren;
  }

  /**
   * Executes `getPathValue` to handle get path value.
   * @zh 执行 `getPathValue`，用于获取路径值。
   * @param val - val parameter (`any`) / 值参数（`any`）
   * @param name - name parameter (`any`) / 名称参数（`any`）
   * @returns Result of type `string[]` / 类型为 `string[]` 的返回值
   */
  getPathValue(val, name): string[] {
    if (this.parent) {
      val = this.parent.getPathValue(val, name);
    }
    if (this.data[name]) {
      val = concat(val, [this.data[name]]);
    } else {
      val = concat(val,[]);
    }
    return val;
  }

  /**
   * Gets the current visible children (`visibleChildren: TreeNode[]`).
   * @zh 获取当前可见子级列表（`visibleChildren: TreeNode[]`）。
   */
  @computed get visibleChildren(): TreeNode[] {
    return (this.children ||[]).filter((node) => !node.isHidden);
  }

  /**
   * Executes `getFirstChild` to handle get first child.
   * @zh 执行 `getFirstChild`，用于获取首个子级。
   * @param skipHidden - skip hidden parameter (`boolean`) / skip隐藏参数（`boolean`）
   */
  getFirstChild(skipHidden = false) {
    const children = skipHidden ? this.visibleChildren : this.children;
    return first(children ||[]);
  }

  /**
   * Executes `getLastChild` to handle get last child.
   * @zh 执行 `getLastChild`，用于获取末尾子级。
   * @param skipHidden - skip hidden parameter (`boolean`) / skip隐藏参数（`boolean`）
   */
  getLastChild(skipHidden = false) {
    const children = skipHidden ? this.visibleChildren : this.children;
    return last(children ||[]);
  }

  /**
   * Executes `findNextNode` to handle find next node.
   * @zh 执行 `findNextNode`，用于查找下一个节点。
   * @param goInside - go inside parameter (`boolean`) / go内部参数（`boolean`）
   * @param skipHidden - skip hidden parameter (`boolean`) / skip隐藏参数（`boolean`）
   */
  findNextNode(goInside = true, skipHidden = false) {
    return goInside && this.isExpanded && this.getFirstChild(skipHidden) ||
      this.findNextSibling(skipHidden) ||
      this.parent && this.parent.findNextNode(false, skipHidden);
  }

  /**
   * Executes `findPreviousNode` to handle find previous node.
   * @zh 执行 `findPreviousNode`，用于查找上一个节点。
   * @param skipHidden - skip hidden parameter (`boolean`) / skip隐藏参数（`boolean`）
   */
  findPreviousNode(skipHidden = false) {
    const previousSibling = this.findPreviousSibling(skipHidden);
    if (!previousSibling) {
      return this.realParent;
    }
    return previousSibling._getLastOpenDescendant(skipHidden);
  }

  /**
   * Executes `_getLastOpenDescendant` to handle get last open descendant.
   * @zh 执行 `_getLastOpenDescendant`，用于获取末尾打开后代节点。
   * @param skipHidden - skip hidden parameter (`boolean`) / skip隐藏参数（`boolean`）
   */
  _getLastOpenDescendant(skipHidden = false) {
    const lastChild = this.getLastChild(skipHidden);
    return (this.isCollapsed || !lastChild)
      ? this
      : lastChild._getLastOpenDescendant(skipHidden);
  }

  /**
   * Executes `_getParentsChildren` to handle get parents children.
   * @zh 执行 `_getParentsChildren`，用于获取父级子级列表。
   * @param skipHidden - skip hidden parameter (`boolean`) / skip隐藏参数（`boolean`）
   * @returns Result of type `TreeNode[]` / 类型为 `TreeNode[]` 的返回值
   */
  private _getParentsChildren(skipHidden = false) {
    const children = this.parent &&
      (skipHidden ? this.parent.getVisibleChildren() : this.parent.children);
    return children ||[];
  }

  /**
   * Executes `getRoot` to handle get root.
   * @zh 执行 `getRoot`，用于获取根节点。
   * @param node - node parameter (`TreeNode`) / 节点参数（`TreeNode`）
   */
  public getRoot(node?: TreeNode) {
    if (node == undefined) node = this;
    if (node.isRoot) return node;
    if (node.parent && node.parent.isRoot) {
      return node.parent;
    } else {
      return this.getRoot(node.parent);
    }
  }

  /**
   * Executes `getAllParents` to handle get all parents.
   * @zh 执行 `getAllParents`，用于获取全部父级。
   * @param result - result parameter (`TreeNode[]`) / 结果参数（`TreeNode[]`）
   */
  public getAllParents(result: TreeNode[]) {
    if (this.parent) {
      result.push(this.parent);
      this.parent.getAllParents(result);
    }
  }
  
  /**
   * Executes `getAllChildren` to handle get all children.
   * @zh 执行 `getAllChildren`，用于获取全部子级列表。
   * @param result - result parameter (`TreeNode[]`) / 结果参数（`TreeNode[]`）
   */
  public getAllChildren(result: TreeNode[]) {
    if (this.children) {
      this.children.forEach((child) => {
        result.push(child);
        if (child.children) {
          child.getAllChildren(result);
        }
      });
    }
  }

  /**
   * Executes `getIndexInParent` to handle get index in parent.
   * @zh 执行 `getIndexInParent`，用于获取索引在父级。
   * @param skipHidden - skip hidden parameter (`boolean`) / skip隐藏参数（`boolean`）
   */
  getIndexInParent(skipHidden = false) {
    return this._getParentsChildren(skipHidden).indexOf(this);
  }

  /**
   * Executes `isDescendantOf` to handle is descendant of.
   * @zh 执行 `isDescendantOf`，用于是否为后代节点的。
   * @param node - node parameter (`TreeNode`) / 节点参数（`TreeNode`）
   */
  isDescendantOf(node: TreeNode) {
    if (this === node) {
      return true;
    } else { return this.parent && this.parent.isDescendantOf(node); }
  }

  /**
   * Executes `getNodePadding` to handle get node padding.
   * @zh 执行 `getNodePadding`，用于获取节点内边距。
   * @returns Result of type `string` / 类型为 `string` 的返回值
   */
  getNodePadding(): string {
    return this.options.levelPadding * (this.level - 1) + 'px';
  }

  /**
   * Executes `getClass` to handle get class.
   * @zh 执行 `getClass`，用于获取类名。
   * @returns Result of type `string` / 类型为 `string` 的返回值
   */
  getClass(): string {
    return[this.options.nodeClass(this), `tree-node-level-${this.level}`].join(' ');
  }

  /**
   * Executes `onDrop` to handle on drop.
   * @zh 执行 `onDrop`，用于当放置。
   * @param $event - event parameter (`any`) / 事件参数（`any`）
   */
  onDrop($event) {
    this.mouseAction('drop', $event.event, {
      from: $event.element,
      to: { parent: this, index: 0, dropOnNode: true }
    });
  }

  /**
   * Property `allowDrop` (`(element: unknown, $event?: unknown) => boolean`) storing allow drop.
   * @zh 属性 `allowDrop`（类型：`(element: unknown, $event?: unknown) => boolean`），用于存储或配置允许放置。
   */
  allowDrop = (element: unknown, $event?: unknown): boolean => {
    return this.options.allowDrop(element, { parent: this, index: 0 }, $event);
  }

  /**
   * Property `allowDragoverStyling` (`() => boolean`) storing allow dragover styling.
   * @zh 属性 `allowDragoverStyling`（类型：`() => boolean`），用于存储或配置允许Dragover样式。
   */
  allowDragoverStyling = () => {
    return this.options.allowDragoverStyling;
  }

  /**
   * Executes `allowDrag` to handle allow drag.
   * @zh 执行 `allowDrag`，用于允许拖拽。
   */
  allowDrag() {
    return this.options.allowDrag(this);
  }

  /**
   * Executes `setNodeChildren` to handle set node children.
   * @zh 执行 `setNodeChildren`，用于集合节点子级列表。
   * @param children - children parameter (`any`) / 子级列表参数（`any`）
   */
  setNodeChildren(children) {
    if (children) {
      this.setField('hasChildren', children.length > 0);
      this.setField('children', children);
      this._initChildren();
      this.children.forEach((child) => {
        if (child.getField('isExpanded') && child.hasChildren) {
          child.expand();
        }
      });
    }
    this.fireEvent({
      eventName: TREE_EVENTS.loadNodeChildren,
      node: this
    });
  }
  
  /**
   * Executes `loadNodeChildren` to handle load node children.
   * @zh 执行 `loadNodeChildren`，用于加载节点子级列表。
   */
  loadNodeChildren() {
    if (!this.options.getChildren) {
      return Promise.resolve();
    }
    return Promise.resolve(this.options.getChildren(this))
      .then((children) => {
        if (children) {
          this.setField('hasChildren', children.length > 0);
          this.setField('children', children);
          this._initChildren();
          if (this.options.useTriState && this.treeModel.isSelected(this)) {
            this.setIsSelected(true);
          }
          this.children.forEach((child) => {
            if (child.getField('isExpanded') && child.hasChildren) {
              child.expand();
            }
          });
        }
      }).then(() => {
        this.fireEvent({
          eventName: TREE_EVENTS.loadNodeChildren,
          node: this
        });
      });
  }

  /**
   * Executes `expand` to handle expand.
   * @zh 执行 `expand`，用于展开。
   * @param silent - silent parameter (`boolean`) / silent参数（`boolean`）
   */
  expand(silent = false) {
    if (!this.isExpanded) {
      this.toggleExpanded(silent);
    }
    return this;
  }

  /**
   * Executes `collapse` to handle collapse.
   * @zh 执行 `collapse`，用于折叠。
   * @param silent - silent parameter (`boolean`) / silent参数（`boolean`）
   */
  collapse(silent = false) {
    if (this.isExpanded) {
      this.toggleExpanded(silent);
    }
    return this;
  }

  /**
   * Executes `doForAll` to handle do for all.
   * @zh 执行 `doForAll`，用于执行用于全部。
   * @param fn - fn parameter (`(node: ITreeNode) => any`) / 函数参数（`(node: ITreeNode) => any`）
   */
  doForAll(fn: { (node: ITreeNode) }) {
    Promise.resolve(fn(this)).then(() => {
      if (this.children) {
        this.children.forEach((child) => child.doForAll(fn));
      }
    });
  }

  /**
   * Executes `doForAncestors` to handle do for ancestors.
   * @zh 执行 `doForAncestors`，用于执行用于祖先节点。
   * @param fn - fn parameter (`(node: ITreeNode) => any`) / 函数参数（`(node: ITreeNode) => any`）
   */
  doForAncestors(fn: { (node: ITreeNode) }) {
    Promise.resolve(fn(this)).then(() => {
      if (this.parent) {
        this.parent.doForAncestors(fn);
      }
    });
  }

  /**
   * Executes `expandAncestors` to handle expand ancestors.
   * @zh 执行 `expandAncestors`，用于展开祖先节点。
   */
  expandAncestors() {
    this.doForAncestors((node) => node.expand());
  }

  /**
   * Executes `expandAll` to handle expand all.
   * @zh 执行 `expandAll`，用于展开全部。
   */
  expandAll() {
    this.doForAll((node) => node.expand());
  }

  /**
   * Executes `collapseAll` to handle collapse all.
   * @zh 执行 `collapseAll`，用于折叠全部。
   */
  collapseAll() {
    this.doForAll((node) => node.collapse());
  }

  /**
   * Executes `ensureVisible` to handle ensure visible.
   * @zh 执行 `ensureVisible`，用于确保可见。
   */
  ensureVisible() {
    if (this.realParent) {
      this.realParent.expand();
      this.realParent.ensureVisible();
    }
    return this;
  }

  /**
   * Executes `toggleExpanded` to handle toggle expanded.
   * @zh 执行 `toggleExpanded`，用于开关已展开。
   * @param silent - silent parameter (`any`) / silent参数（`any`）
   */
  toggleExpanded(silent) {
    this.setIsExpanded(!this.isExpanded, silent);
    return this;
  }

  /**
   * Executes `setIsExpanded` to handle set is expanded.
   * @zh 执行 `setIsExpanded`，用于集合是否为已展开。
   * @param value - value parameter (`any`) / 值参数（`any`）
   * @param silent - silent parameter (`any`) / silent参数（`any`）
   */
  setIsExpanded(value, silent) {
    if (this.hasChildren) {
      this.treeModel.setExpandedNode(this, value, silent);
    }
    return this;
  }

  /**
   * Executes `autoLoadChildren` to handle auto load children.
   * @zh 执行 `autoLoadChildren`，用于自动加载子级列表。
   */
  autoLoadChildren() {
    this.handler = reaction(
      () => this.isExpanded,
      (isExpanded) => {
        if (!this.children && this.hasChildren && isExpanded) {
          this.loadNodeChildren();
        }
      },
      { fireImmediately: true }
    );
  }

  // ✨ 核心机制：在组件或节点被卸载时，释放 Map 中的引用，防止内存泄漏
  /**
   * Executes `dispose` to handle dispose.
   * @zh 执行 `dispose`，用于释放。
   */
  dispose() {
    if (this.children) {
      this.children.forEach((child) => child.dispose());
    }
    if (this.handler) {
      this.handler();
    }

    if (this.id !== undefined && this.id !== null && this.treeModel) {
      this.treeModel.nodeRegistry.delete(this.id.toString());
    }

    this.parent = null;
    this.children = null;
  }

  /**
   * Executes `setIsActive` to handle set is active.
   * @zh 执行 `setIsActive`，用于集合是否为激活。
   * @param value - value parameter (`any`) / 值参数（`any`）
   * @param multi - multi parameter (`boolean`) / 多参数（`boolean`）
   */
  setIsActive(value, multi = false) {
    this.treeModel.setActiveNode(this, value, multi);
    if (value) {
      this.focus();
    }
    return this;
  }

  /**
   * Executes `isSelectable` to handle is selectable.
   * @zh 执行 `isSelectable`，用于是否为是否可选中。
   */
  isSelectable() {
    return this.isLeaf || !this.children || !this.options.useTriState;
  }
  
  /**
   * Executes `setIsSelected` to handle set is selected.
   * @zh 执行 `setIsSelected`，用于集合是否为已选中。
   * @param value - value parameter (`any`) / 值参数（`any`）
   * @param silent - silent parameter (`any`) / silent参数（`any`）
   */
  @action setIsSelected(value, silent?) {
    if (this.options.cascadeSelect) {
      if (this.isLeaf) {
        this.treeModel.setSelectedNode(this, value, silent);
      } else if (this.children) {
        this.children.forEach((child) => child.setIsSelected(value, silent));
      } else {
        this.treeModel.setSelectedNode(this, value, silent);
      }
    } else {
      if (this.isSelectable()) {
        this.treeModel.setSelectedNode(this, value);
      } else {
        this.visibleChildren.forEach((child) => child.setIsSelected(value));
      }
    }
    return this;
  }

  /**
   * Executes `toggleSelected` to handle toggle selected.
   * @zh 执行 `toggleSelected`，用于开关已选中。
   */
  toggleSelected() {
    this.setIsSelected(!this.isSelected);
    return this;
  }

  /**
   * Executes `toggleActivated` to handle toggle activated.
   * @zh 执行 `toggleActivated`，用于开关已激活。
   * @param multi - multi parameter (`boolean`) / 多参数（`boolean`）
   */
  toggleActivated(multi = false) {
    this.setIsActive(!this.isActive, multi);
    return this;
  }
  
  /**
   * Executes `setActiveAndVisible` to handle set active and visible.
   * @zh 执行 `setActiveAndVisible`，用于集合激活And可见。
   * @param multi - multi parameter (`boolean`) / 多参数（`boolean`）
   */
  setActiveAndVisible(multi = false) {
    this.setIsActive(true, multi).ensureVisible();
    setTimeout(this.scrollIntoView.bind(this));
    return this;
  }

  /**
   * Executes `scrollIntoView` to handle scroll into view.
   * @zh 执行 `scrollIntoView`，用于滚动进入视图。
   * @param force - force parameter (`boolean`) / force参数（`boolean`）
   */
  scrollIntoView(force = false) {
    this.treeModel.virtualScroll.scrollIntoView(this, force);
  }

  /**
   * Executes `focus` to handle focus.
   * @zh 执行 `focus`，用于聚焦。
   * @param scroll - scroll parameter (`boolean`) / 滚动参数（`boolean`）
   */
  focus(scroll = true) {
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
   * Executes `blur` to handle blur.
   * @zh 执行 `blur`，用于失焦。
   */
  blur() {
    const previousNode = this.treeModel.getFocusedNode();
    this.treeModel.setFocusedNode(null);
    if (previousNode) {
      this.fireEvent({ eventName: TREE_EVENTS.blur, node: this });
    }
    return this;
  }

  /**
   * Executes `setIsHidden` to handle set is hidden.
   * @zh 执行 `setIsHidden`，用于集合是否为隐藏。
   * @param value - value parameter (`any`) / 值参数（`any`）
   */
  setIsHidden(value) {
    this.treeModel.setIsHidden(this, value);
  }

  /**
   * Executes `hide` to handle hide.
   * @zh 执行 `hide`，用于隐藏。
   */
  hide() {
    this.setIsHidden(true);
  }

  /**
   * Executes `show` to handle show.
   * @zh 执行 `show`，用于显示。
   */
  show() {
    this.setIsHidden(false);
  }

  /**
   * Executes `mouseAction` to handle mouse action.
   * @zh 执行 `mouseAction`，用于鼠标动作。
   * @param actionName - action name parameter (`string`) / 动作名称参数（`string`）
   * @param $event - event parameter (`any`) / 事件参数（`any`）
   * @param data - data parameter (`any`) / 数据参数（`any`）
   */
  mouseAction(actionName: string, $event, data = null) {
    this.treeModel.setFocus(true);

    const actionMapping = this.options.actionMapping.mouse;
    const action = actionMapping[actionName];

    if (action) {
      action(this.treeModel, this, $event, data);
    }
  }

  /**
   * Executes `getSelfHeight` to handle get self height.
   * @zh 执行 `getSelfHeight`，用于获取自身高度。
   */
  getSelfHeight() {
    return this.options.nodeHeight(this);
  }

  /**
   * Executes `_initChildren` to handle init children.
   * @zh 执行 `_initChildren`，用于初始化子级列表。
   */
  @action _initChildren() {
    if (this.children) {
      this.children.forEach(c => c.dispose());
    }
    let childs = this.getField('children');
    this.children = childs.map((c, index) => new TreeNode(c, this, this.treeModel, index));
  }
}

/**
 * Executes `uuid` to handle uuid.
 * @zh 执行 `uuid`，用于唯一标识符。
 */
function uuid() {
  return Math.floor(Math.random() * 10000000000000);
}