/**
 * Welcome to ng2tree

 * @zh 类型别名 `IDType`，表示唯一标识类型（`string | number`）。
 */
export type IDType = string | number;
/**
 * Type alias `IDTypeDictionary` representing id type dictionary (`{ [id: string]: boolean } | { [id: number]: boolean }`).
 * @zh 类型别名 `IDTypeDictionary`，表示唯一标识类型字典（`{ [id: string]: boolean } | { [id: number]: boolean }`）。
 */
export type IDTypeDictionary = { [id: string]: boolean } | { [id: number]: boolean };

/**
 * See ITreeNode for documentation

 * @zh 类型别名 `TreeNode`，表示树形控件节点（`any`）。
 */
export declare type TreeNode = unknown;

/**
 * Interface `IAllowDropFn` defining the contract and properties for i allow drop fn.
 * @zh 接口 `IAllowDropFn`，定义I允许放置函数的数据结构契约与属性规范。
 */
export interface IAllowDropFn {
  (element, to: { parent: TreeNode, index: number }, $event?): boolean;
}

/**
 * Interface `INodeHeightFn` defining the contract and properties for i node height fn.
 * @zh 接口 `INodeHeightFn`，定义I节点高度函数的数据结构契约与属性规范。
 */
export interface INodeHeightFn {
  (node: TreeNode): number;
}

/**
 * Interface `IAllowDragFn` defining the contract and properties for i allow drag fn.
 * @zh 接口 `IAllowDragFn`，定义I允许拖拽函数的数据结构契约与属性规范。
 */
export interface IAllowDragFn {
  (node: TreeNode): boolean;
}


/**
 * Interface `ITreeState` defining the contract and properties for i tree state.
 * @zh 接口 `ITreeState`，定义I树形控件状态的数据结构契约与属性规范。
 */
export interface ITreeState {
  /**
   * Property `expandedNodeIds` (`IDTypeDictionary`) storing expanded node ids.
   * @zh 属性 `expandedNodeIds`（类型：`IDTypeDictionary`），用于存储或配置已展开节点标识列表。
   */
  expandedNodeIds?: IDTypeDictionary;
  /**
   * Property `selectedNodeIds` (`IDTypeDictionary`) storing selected node ids.
   * @zh 属性 `selectedNodeIds`（类型：`IDTypeDictionary`），用于存储或配置已选中节点标识列表。
   */
  selectedNodeIds?: IDTypeDictionary;
  /**
   * Property `activeNodeIds` (`IDTypeDictionary`) storing active node ids.
   * @zh 属性 `activeNodeIds`（类型：`IDTypeDictionary`），用于存储或配置激活节点标识列表。
   */
  activeNodeIds?: IDTypeDictionary;
  /**
   * Property `hiddenNodeIds` (`IDTypeDictionary`) storing hidden node ids.
   * @zh 属性 `hiddenNodeIds`（类型：`IDTypeDictionary`），用于存储或配置隐藏节点标识列表。
   */
  hiddenNodeIds?: IDTypeDictionary;
  /**
   * Property `selectedLeafNodeIds` (`IDTypeDictionary`) storing selected leaf node ids.
   * @zh 属性 `selectedLeafNodeIds`（类型：`IDTypeDictionary`），用于存储或配置已选中叶子节点节点标识列表。
   */
  selectedLeafNodeIds?: IDTypeDictionary;
  /**
   * Property `focusedNodeId` (`IDType`) storing focused node id.
   * @zh 属性 `focusedNodeId`（类型：`IDType`），用于存储或配置已聚焦节点唯一标识。
   */
  focusedNodeId?: IDType;
}

/**
 * Interface `ITreeOptions` defining the contract and properties for i tree options.
 * @zh 接口 `ITreeOptions`，定义I树形控件配置选项的数据结构契约与属性规范。
 */
export interface ITreeOptions {
  /**
   * A string representing the attribute of the node that indicates whether there are child nodes.

   * **Default value: `hasChildren`.**

   For example, if your nodes have an `isDirectory` attribute that indicates whether there are children, use:
   ```
     options = { hasChildrenField: 'isDirectory' }
   ```

   * @zh 属性 `hasChildrenField`（类型：`string`），用于存储或配置是否包含子级列表字段。
   */
  hasChildrenField?: string;
  /**
   * A string representing the attribute of the node that contains the array of children.

   * **Default value: `children`.**

   For example, if your nodes have a `nodes` attribute, that contains the children, use:
   ```
     options = { childrenField: 'nodes' }
   ```

   * @zh 属性 `childrenField`（类型：`string`），用于存储或配置子级列表字段。
   */
  childrenField?: string;
  /**
   * A string representing the attribute of the node to display.

   * **Default value: `name`**

     For example, if your nodes have a `title` attribute that should be displayed, use:
     ```
       options = { displayField: 'title' }
     ```

   * @zh 属性 `displayField`（类型：`string`），用于存储或配置display字段。
   */
  displayField?: string;
  /**
   * A string representing the attribute of the node that contains the unique ID.
     This will be used to construct the `path`, which is an array of IDs that point to the node.

     * **Default value: `id`.**

     For example, if your nodes have a `uuid` attribute, that contains the unique key, use:
     ```
       options = { idField: 'uuid' }
     ```

   * @zh 属性 `idField`（类型：`string`），用于存储或配置唯一标识字段。
   */
  idField?: string;
  /**
   * A string representing the attribute of the node that contains whether the node starts as expanded.

     * **Default value: `isExpanded`.**

     For example, if your nodes have an `expanded` attribute, that contains a boolean value, use:
     ```
       options = { isExpandedField: 'expanded' }
     ```

   * @zh 属性 `isExpandedField`（类型：`string`），用于存储或配置是否为已展开字段。
   */
  isExpandedField?: string;
  /**
   * Function for loading a node's children.
     The function receives a TreeNode, and returns a value or a promise that resolves to the node's children.

     This function will be called whenever a node is expanded, the `hasChildren` (`options.hasChildrenField`)
     field is true, and the `children` field is empty.
     The result will be loaded into the node's children attribute.

     Example:
     ```
     * options = {
     *   getChildren: (node:TreeNode) => {
     *     return request('/api/children/' + node.id);
     *   }
     * }
     ```

   * @zh 属性 `getChildren`（类型：`(node: TreeNode) => any`），用于存储或配置获取子级列表。
   */
  getChildren?: { (node: TreeNode) };
  /**
   * Rewire which trigger causes which action using this attribute, or create custom actions / event bindings.
   * See the [Action Mapping Section](https://angular2-tree.readme.io/docs/action-mapping) for more details.

   * @zh 属性 `actionMapping`（类型：`any`），用于存储或配置动作映射。
   */
  actionMapping?;
  /**
   * Specify if dragging tree nodes is allowed.
   * This could be a boolean, or a function that receives a TreeNode and returns a boolean

   * **Default value: false**

   Example:
   ```
   * options = {
   *  allowDrag: true
   * }
   ```

   * @zh 属性 `allowDrag`（类型：`boolean | IAllowDragFn`），用于存储或配置允许拖拽。
   */
  allowDrag?: boolean | IAllowDragFn;
  /**
   * Specify whether dropping inside the tree is allowed. Optional types:
   *  - boolean
   *  - (element:any, to:{parent:TreeNode, index:number}):boolean
        A function that receives the dragged element, and the drop location (parent node and index inside the parent),
        and returns true or false.

   * **Default Value: true**

   example:
   ```
   * options = {
   *  allowDrop: (element, {parent, index}) => parent.isLeaf
   * }
   ```

   * @zh 属性 `allowDrop`（类型：`boolean | IAllowDropFn`），用于存储或配置允许放置。
   */
  allowDrop?: boolean | IAllowDropFn;
   /**
    boolean flag to allow adding and removing is-dragging-over and is-dragging-over-disabled classes.

    If set to false it will not add the above mentioned classes and you should handle the styling yourself with css and in
    the actionMapping -> mouse -> dragEnter, dragLeave

    * **Default Value: true**

    example:
    ```
    * options = {
    *   allowDrop: true,
    *   allowDragoverStyling: false
    * }
    ```

    * @zh 属性 `allowDragoverStyling`（类型：`boolean`），用于存储或配置允许Dragover样式。
    */
   allowDragoverStyling?: boolean;

  /**
  * Specify padding per node (integer).
   Each node will have padding-left value of level * levelPadding, instead of using the default padding for children.

   This option is good for example for allowing whole row selection, etc.

   You can alternatively use the tree-node-level-X classes to give padding on a per-level basis.

   * **Default value: 0**

   * @zh 属性 `levelPadding`（类型：`number`），用于存储或配置层级内边距。
   */

  levelPadding?: number;
  /**
   * Specify a function that returns a class per node. Useful for styling the nodes individually.

     Example:
     ```
     * options = {
     *   nodeClass: (node:TreeNode) => {
     *     return 'icon-' + node.data.icon;
     *   }
     * }
     ```

   * @zh 属性 `nodeClass`（类型：`(node: TreeNode) => string`），用于存储或配置节点类名。
   */
  nodeClass?: (node: TreeNode) => string;
  /**
   boolean flag to use the virtual scroll option.

   To use this option, you must supply the height of the container, and the height of each node in the tree.

   You can also specify height for the dropSlot which is located between nodes.

   * **Default Value: false**

   example:
   ```
   * options = {
   *   useVirtualScroll: true,
   *   nodeHeight: (node: TreeNode) => node.myHeight,
   *   dropSlotHeight: 3
   * }
   ```

   * @zh 属性 `useVirtualScroll`（类型：`boolean`），用于存储或配置使用虚拟滚动滚动。
   */
  useVirtualScroll?: boolean;
  /**
   * For use with `useVirtualScroll` option.
   * Specify a height for nodes in pixels. Could be either:
   * - number
   * - (node: TreeNode) => number

   * **Default Value: 22**

   * @zh 属性 `nodeHeight`（类型：`number | INodeHeightFn`），用于存储或配置节点高度。
   */
  nodeHeight?: number | INodeHeightFn;
  /**
   * For use with `useVirtualScroll` option.
   * Specify a height for drop slots (located between nodes) in pixels

   * **Default Value: 2**

   * @zh 属性 `dropSlotHeight`（类型：`number`），用于存储或配置放置Slot高度。
   */
  dropSlotHeight?: number;
  /**
   * boolean whether or not to animate expand / collapse of nodes.

   * **Default Value: false**

   * @zh 属性 `animateExpand`（类型：`boolean`），用于存储或配置animate展开。
   */
  animateExpand?: boolean;
  /**
   * Speed of expand animation (described in pixels per 17 ms).

   * **Default Value: 30**

   * @zh 属性 `animateSpeed`（类型：`number`），用于存储或配置animate速度。
   */
  animateSpeed?: number;
  /**
   * Increase of expand animation speed (described in multiply per 17 ms).

   * **Default Value: 1.2**

   * @zh 属性 `animateAcceleration`（类型：`number`），用于存储或配置animateAcceleration。
   */
  animateAcceleration?: number;

     /**
    * Whether to scroll to the node to make it visible when it is activated.

    * **Default Value: true**

      * @zh 属性 `scrollOnActivate`（类型：`boolean`），用于存储或配置滚动当激活。
      */
   scrollOnActivate?: boolean;
  /**
   * Function to clone a node.
   * Receives a TreeNode object, and returns a node object (only the data).
   * This callback will be called when copying a node inside the tree,
   * by either calling copyNode, or by dragging and holding the ctrl key
   *
   * For example:
     ```
       options: ITreeOptions = {
         getNodeClone: (node) => ({
           ...node.data,
           id: uuid.v4(),
           name: `copy of ${node.data.name}`
         })
       };
     ```
   *
   * **Default Value: clone the node using Object.assign, and remove 'id' property**

   * @zh 属性 `getNodeClone`（类型：`(node: TreeNode) => any`），用于存储或配置获取节点克隆。
   */
  getNodeClone?: { (node: TreeNode) };
  /**
   * Makes the tree right-to-left.
   * This include direction, expander style, and change key binding (right key collapse and left key expands instead of vice-versa)

   * @zh 属性 `rtl`（类型：`boolean`），用于存储或配置rtl。
   */
  rtl?: boolean;
  /**
   * Specifies id of root node (virtualRoot)

   * @zh 属性 `rootId`（类型：`any`），用于存储或配置根节点唯一标识。
   */
  rootId?;
  /**
   * Whether to display a checkbox next to the node or not

   * @zh 属性 `useCheckbox`（类型：`boolean`），用于存储或配置使用复选框。
   */
  useCheckbox?: boolean;
    /**
     * Whether to use master checkboxes mechanism if the useCheckbox is set to true

     * @zh 属性 `useTriState`（类型：`boolean`），用于存储或配置使用Tri状态。
     */
    useTriState?: boolean;


    /**
     * Property `scrollContainer` (`HTMLElement`) storing scroll container.
     * @zh 属性 `scrollContainer`（类型：`HTMLElement`），用于存储或配置滚动容器。
     */
    scrollContainer?: HTMLElement;

  /**
   * define the expand align to left or right

   * @zh 属性 `expanderAlign`（类型：`"left" | "right"`），用于存储或配置展开器对齐。
   */
  expanderAlign?: 'left' | 'right';

  /**
   * Property `dropZones` (`string[]`) storing drop zones.
   * @zh 属性 `dropZones`（类型：`string[]`），用于存储或配置放置区域(NgZone)。
   */
  dropZones?: Array<string>;

  /**
   * Property `storeName` (`string`) storing store name.
   * @zh 属性 `storeName`（类型：`string`），用于存储或配置状态仓库名称。
   */
  storeName?: string;

  /**
   * Property `apiBase` (`string`) storing api base.
   * @zh 属性 `apiBase`（类型：`string`），用于存储或配置API接口基础。
   */
  apiBase?: string;

  /**
   * Property `cascadeSelect` (`boolean`) storing cascade select.
   * @zh 属性 `cascadeSelect`（类型：`boolean`），用于存储或配置cascade下拉选择。
   */
  cascadeSelect?: boolean;

}

/**
 * Interface `ITreeNode` defining the contract and properties for i tree node.
 * @zh 接口 `ITreeNode`，定义I树形控件节点的数据结构契约与属性规范。
 */
export interface ITreeNode {
  // properties
  /**
   * Parent node

   * @zh 属性 `parent`（类型：`ITreeNode`），用于存储或配置父级。
   */
  parent?: ITreeNode;

  /**
   * The value of the node's field that is used for displaying its content.
   * By default 'name', unless stated otherwise in the options

   * @zh 属性 `displayField`（类型：`string`），用于存储或配置display字段。
   */
  displayField: string;

  /**
   * Property `checkable` (`boolean`) storing checkable.
   * @zh 属性 `checkable`（类型：`boolean`），用于存储或配置checkable。
   */
  checkable: boolean;

  /**
   * Property `editable` (`boolean`) storing editable.
   * @zh 属性 `editable`（类型：`boolean`），用于存储或配置是否可编辑。
   */
  editable: boolean;

  /**
   * Property `icon` (`string`) storing icon.
   * @zh 属性 `icon`（类型：`string`），用于存储或配置图标。
   */
  icon: string;

  /**
   * Property `expandedIcon` (`string`) storing expanded icon.
   * @zh 属性 `expandedIcon`（类型：`string`），用于存储或配置已展开图标。
   */
  expandedIcon: string;

  /**
   * Property `toolTip` (`string`) storing tool tip.
   * @zh 属性 `toolTip`（类型：`string`），用于存储或配置tool提示。
   */
  toolTip?: string;

  /**
   * The children of the node.
   * By default is determined by 'node.data.children', unless stated otherwise in the options

   * @zh 属性 `children`（类型：`ITreeNode[]`），用于存储或配置子级列表。
   */
  children: ITreeNode[];
  /**
   * Pointer to the original data.

   * @zh 属性 `data`（类型：`any`），用于存储或配置数据。
   */
  data;
  /**
   * Pointer to the ElementRef of the TreeNodeComponent that's displaying this node

   * @zh 属性 `elementRef`（类型：`any`），用于存储或配置元素引用。
   */
  elementRef;
  /**
   * Level in the tree (starts from 1).

   * @zh 属性 `level`（类型：`number`），用于存储或配置层级。
   */
  level: number;

  /**
   * Property `path` (`string[]`) storing path.
   * @zh 属性 `path`（类型：`string[]`），用于存储或配置路径。
   */
  path: string[];

  /**
   * Property `index` (`number`) storing index.
   * @zh 属性 `index`（类型：`number`），用于存储或配置索引。
   */
  index: number;
  /**
   * A unique key of this node among its siblings.
   * By default it's the 'id' of the original node, unless stated otherwise in options.idField

   * @zh 属性 `id`（类型：`IDType`），用于存储或配置唯一标识。
   */
  id: IDType;

  // helpers
  /**
   * Property `isExpanded` (`boolean`) storing is expanded.
   * @zh 属性 `isExpanded`（类型：`boolean`），用于存储或配置是否为已展开。
   */
  isExpanded: boolean;
  /**
   * Property `isActive` (`boolean`) storing is active.
   * @zh 属性 `isActive`（类型：`boolean`），用于存储或配置是否为激活。
   */
  isActive: boolean;
  /**
   * Property `isFocused` (`boolean`) storing is focused.
   * @zh 属性 `isFocused`（类型：`boolean`），用于存储或配置是否为已聚焦。
   */
  isFocused: boolean;
  /**
   * Property `isCollapsed` (`boolean`) storing is collapsed.
   * @zh 属性 `isCollapsed`（类型：`boolean`），用于存储或配置是否为已折叠。
   */
  isCollapsed: boolean;
  /**
   * Property `isLeaf` (`boolean`) storing is leaf.
   * @zh 属性 `isLeaf`（类型：`boolean`），用于存储或配置是否为叶子节点。
   */
  isLeaf: boolean;
  /**
   * Property `hasChildren` (`boolean`) storing has children.
   * @zh 属性 `hasChildren`（类型：`boolean`），用于存储或配置是否包含子级列表。
   */
  hasChildren: boolean;
  /**
   * Property `isRoot` (`boolean`) storing is root.
   * @zh 属性 `isRoot`（类型：`boolean`），用于存储或配置是否为根节点。
   */
  isRoot: boolean;

  // traversing
  /**
   * param skipHidden whether to skip hidden nodes
   *  next sibling (or null)

   * @zh 执行 `findNextSibling`，用于查找下一个兄弟节点。
   */
  findNextSibling(skipHidden): ITreeNode;
  /**
   * param skipHidden whether to skip hidden nodes
   *  previous sibling (or null)

   * @zh 执行 `findPreviousSibling`，用于查找上一个兄弟节点。
   */
  findPreviousSibling(skipHidden): ITreeNode;
  /**
   * param skipHidden whether to skip hidden nodes
   *  first child (or null)

   * @zh 执行 `getFirstChild`，用于获取首个子级。
   */
  getFirstChild(skipHidden): ITreeNode;
  /**
   * param skipHidden whether to skip hidden nodes
   *  last child (or null)

   * @zh 执行 `getLastChild`，用于获取末尾子级。
   */
  getLastChild(skipHidden): ITreeNode;
  /**
   * Finds the visually next node in the tree.
   * param goInside whether to look for children or just siblings
   *  next node.

   * @zh 执行 `findNextNode`，用于查找下一个节点。
   */
  findNextNode(goInside: boolean): ITreeNode;
  /**
   * Finds the visually previous node in the tree.
   * param skipHidden whether to skip hidden nodes
   *  previous node.

   * @zh 执行 `findPreviousNode`，用于查找上一个节点。
   */
  findPreviousNode(skipHidden): ITreeNode;

  /**
   *       true if this node is a descendant of the parameter node

   * @zh 执行 `isDescendantOf`，用于是否为后代节点的。
   */
  isDescendantOf(node: ITreeNode): boolean;

  /**
   *       in case levelPadding option is supplied, returns the current node's padding

   * @zh 执行 `getNodePadding`，用于获取节点内边距。
   */
  getNodePadding(): string;

  /**
   *       in case nodeClass option is supplied, returns the current node's class

   * @zh 执行 `getClass`，用于获取类名。
   */
  getClass(): string;

  // actions
  /**
   * Expands / Collapses the node

   * @zh 执行 `toggleExpanded`，用于开关已展开。
   */
  toggleExpanded(silient);
  /**
   * Expands the node

   * @zh 执行 `expand`，用于展开。
   */
  expand(silient?);
  /**
   * Collapses the node

   * @zh 执行 `collapse`，用于折叠。
   */
  collapse();
  /**
   * Expands all ancestors of the node

   * @zh 执行 `ensureVisible`，用于确保可见。
   */
  ensureVisible();
  /**
   * Activates / Deactivates the node (selects / deselects)

   * @zh 执行 `toggleActivated`，用于开关已激活。
   */
  toggleActivated(multi);
  /**
   * Focus on the node

   * @zh 执行 `focus`，用于聚焦。
   */
  focus();
  /**
   * Blur (unfocus) the node

   * @zh 执行 `blur`，用于失焦。
   */
  blur();
  /**
   * Hides the node

   * @zh 执行 `hide`，用于隐藏。
   */
  hide();
  /**
   * Makes the node visible

   * @zh 执行 `show`，用于显示。
   */
  show();
  /**
   * param value  if true makes the node hidden, otherwise visible

   * @zh 执行 `setIsHidden`，用于集合是否为隐藏。
   */
  setIsHidden(value: boolean);
  /**
   * Scroll the screen to make the node visible

   * @zh 执行 `scrollIntoView`，用于滚动进入视图。
   */
  scrollIntoView();
  /**
   * Fire an event to the renderer of the tree (if it was registered)

   * @zh 执行 `fireEvent`，用于触发事件。
   */
  fireEvent(event);
  /**
   * Invokes a method for every node under this one - depth first
   * param fn  a function that receives the node

   * @zh 执行 `doForAll`，用于执行用于全部。
   */
  doForAll(fn: { (node: ITreeNode) });
  /**
   * expand all nodes under this one

   * @zh 执行 `expandAll`，用于展开全部。
   */
  expandAll();
  /**
   * collapse all nodes under this one

   * @zh 执行 `collapseAll`，用于折叠全部。
   */
  collapseAll();
  /**
   * sets the node to active / inactive according to the value.
   * If multi is true (default false) - does a multiselect.

   * @zh 执行 `setIsActive`，用于集合是否为激活。
   */
  setIsActive(value: boolean, multi?: boolean);
  /**
   * sets the node to be active and makes sure it's visible by expanding all nodes above it and scrolling it into view.
   * Very similar to calling `activate`, `ensureVisible` and `scrollIntoView` methods.
   * If multi is true (default false) - does a multiselect.

   * @zh 执行 `setActiveAndVisible`，用于集合激活And可见。
   */
  setActiveAndVisible(multi: boolean);
}

/**
 * Interface `ITreeModel` defining the contract and properties for i tree model.
 * @zh 接口 `ITreeModel`，定义I树形控件模型的数据结构契约与属性规范。
 */
export interface ITreeModel {
  // properties
  /**
   * All root nodes

   * @zh 属性 `roots`（类型：`ITreeNode[]`），用于存储或配置根节点。
   */
  roots: ITreeNode[];
  /**
   * Current focused node

   * @zh 属性 `focusedNode`（类型：`ITreeNode`），用于存储或配置已聚焦节点。
   */
  focusedNode: ITreeNode;
  /**
   * Options that were passed to the tree component

   * @zh 属性 `options`（类型：`ITreeOptions`），用于存储或配置配置选项。
   */
  options: ITreeOptions;

  /**
   * Is the tree currently focused

   * @zh 属性 `isFocused`（类型：`boolean`），用于存储或配置是否为已聚焦。
   */
  isFocused: boolean;

  /**
   *  Current active (selected) nodes

   * @zh 属性 `activeNodes`（类型：`ITreeNode[]`），用于存储或配置激活节点列表。
   */
  activeNodes: ITreeNode[];
  /**
   *  Current expanded nodes

   * @zh 属性 `expandedNodes`（类型：`ITreeNode[]`），用于存储或配置已展开节点列表。
   */
  expandedNodes: ITreeNode[];

  // helpers
  /**
   *  Current active (selected) node. If multiple nodes are active - returns the first one.

   * @zh 执行 `getActiveNode`，用于获取激活节点。
   */
  getActiveNode(): ITreeNode;
  /**
   *  Current focused node (either hovered or traversed with keys)

   * @zh 执行 `getFocusedNode`，用于获取已聚焦节点。
   */
  getFocusedNode(): ITreeNode;
  /**
   * Set focus on a node
   * param value  true or false - whether to set focus or blur.

   * @zh 执行 `setFocusedNode`，用于集合已聚焦节点。
   */
  setFocusedNode(node: ITreeNode);
  /**
   * param skipHidden  true or false - whether to skip hidden nodes
   *       first root of the tree

   * @zh 执行 `getFirstRoot`，用于获取首个根节点。
   */
  getFirstRoot(skipHidden?: boolean): ITreeNode;
  /**
   * param skipHidden  true or false - whether to skip hidden nodes
   *       last root of the tree

   * @zh 执行 `getLastRoot`，用于获取末尾根节点。
   */
  getLastRoot(skipHidden?: boolean): ITreeNode;
  /**
   *       true if the tree is empty

   * @zh 执行 `isEmptyTree`，用于是否为空树形控件。
   */
  isEmptyTree(): boolean;
  /**
   *  All root nodes that pass the current filter

   * @zh 执行 `getVisibleRoots`，用于获取可见根节点。
   */
  getVisibleRoots(): ITreeNode[];

  /**
   * Executes `getNodeByPath` to handle get node by path.
   * @zh 执行 `getNodeByPath`，用于获取节点按路径。
   * @param path - path parameter (`any`) / 路径参数（`any`）
   * @param startNode - start node parameter (`ITreeNode`) / 开始节点参数（`ITreeNode`）
   * @returns Result of type `ITreeNode` / 类型为 `ITreeNode` 的返回值
   */
  getNodeByPath(path, startNode?: ITreeNode): ITreeNode;
  /**
   * param     id  node ID to find
   *    The node, if found - null otherwise

   * @zh 执行 `getNodeById`，用于获取节点按唯一标识。
   */
  getNodeById(id: IDType): ITreeNode;
  /**
   * param     predicate - either an object or a function, used as a test condition on all nodes.
   *            Could be every predicate that's supported by lodash's `find` method
   * param     statrNode  optional. Which node to start traversing from
   *    First node that matches the predicate, if found - null otherwise

   * @zh 执行 `getNodeBy`，用于获取节点按。
   */
  getNodeBy(predicate, startNode?: ITreeNode): ITreeNode;
  /**
   * get tree state

   * @zh 执行 `getState`，用于获取状态。
   */
  getState(): ITreeState;
  // actions
  /**
   * Focuses or blurs the tree
   * param value  true or false - whether to set focus or blur.

   * @zh 执行 `setFocus`，用于集合聚焦。
   */
  setFocus(value: boolean);
  /**
   * Focuses on the next node in the tree (same as down arrow)

   * @zh 执行 `focusNextNode`，用于聚焦下一个节点。
   */
  focusNextNode();
  /**
   * Focuses on the previous node in the tree (same as up arrow)

   * @zh 执行 `focusPreviousNode`，用于聚焦上一个节点。
   */
  focusPreviousNode();
  /**
   * Focuses on the inner child of the current focused node (same as right arrow on an expanded node)

   * @zh 执行 `focusDrillDown`，用于聚焦Drill向下。
   */
  focusDrillDown();
  /**
   * Focuses on the parent of the current focused node (same as left arrow on a collapsed node)

   * @zh 执行 `focusDrillUp`，用于聚焦Drill向上。
   */
  focusDrillUp();
  /**
   * Marks isHidden field in all nodes recursively according to the filter param.
   * If a node is marked visible, all of its ancestors will be marked visible as well.
   * param filter  either a string or a function.
   *   In case it's a string, it will be searched case insensitively in the node's display attribute
   *   In case it's a function, it will be passed the node, and should return true if the node should be visible, false otherwise
   * param autoShow  if true, make sure all nodes that passed the filter are visible

   * @zh 执行 `filterNodes`，用于过滤节点列表。
   */
  filterNodes(filter, autoShow?: boolean);
  /**
   * Marks all nodes isHidden = false

   * @zh 执行 `clearFilter`，用于清空过滤。
   */
  clearFilter();
  /**
   * moves a node from one location in the tree to another
   * param node describes which node needs to be moved
   * param to describes where to move the node to.
   * Contains a 'parent' node, an 'index', and a 'dropOnNode' - to distinguish between dropping between nodes or on the node

   * @zh 执行 `moveNode`，用于移动节点。
   */
  moveNode(node: ITreeNode, to: { parent: ITreeNode, index: number, dropOnNode: boolean });
  /**
   * Invokes a method for every node of the tree - depth first
   * param fn  a function that receives the node

   * @zh 执行 `doForAll`，用于执行用于全部。
   */
  doForAll(fn: { (node: ITreeNode) });
  /**
   * expand all nodes

   * @zh 执行 `expandAll`，用于展开全部。
   */
  expandAll();
  /**
   * collapse all nodes

   * @zh 执行 `collapseAll`，用于折叠全部。
   */
  collapseAll();
  /**
   * get tree state

   * @zh 执行 `getState`，用于获取状态。
   */
  // eslint-disable-next-line @typescript-eslint/adjacent-overload-signatures
  getState(): ITreeState;
  /**
   * set tree state

   * @zh 执行 `setState`，用于集合状态。
   */
  setState(state: ITreeState);

  /**
   * Executes `subscribeToState` to handle subscribe to state.
   * @zh 执行 `subscribeToState`，用于订阅转换为状态。
   * @param fn - fn parameter (`(state: ITreeState) => any`) / 函数参数（`(state: ITreeState) => any`）
   */
  subscribeToState(fn: { (state: ITreeState) });
}
/**
 * This is the interface of the TreeNodeDrag service

 * @zh 接口 `ITreeNodeDrag`，定义I树形控件节点拖拽的数据结构契约与属性规范。
 */
export interface ITreeNodeDrag {
  /**
   * Gets the current dragged node. Useful for overriding the drop action.
   * param node  The parent node of the current dragged node
   * param index  The index inside parent's children, of the current dragged node

   * @zh 执行 `getDragNode`，用于获取拖拽节点。
   */
  getDragNode(): { node: TreeNode, index: number };
}
