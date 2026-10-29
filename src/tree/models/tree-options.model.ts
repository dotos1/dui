/**
 * @fileoverview Module `src/tree/models/tree-options.model.ts` providing tree options model definitions and implementation.
 * @zh 模块文件 `src/tree/models/tree-options.model.ts`，提供树形控件配置选项模型相关的定义与实现。
 */

/* eslint-disable @typescript-eslint/no-unused-vars */
import { KEYS } from '../constants/keys';
import { ITreeOptions } from '../defs/api';
import { TreeNode } from './tree-node.model';
import { TreeModel } from './tree.model';
import {get,isNumber}  from 'lodash-es';

/**
 * Interface `IActionHandler` defining the contract and properties for i action handler.
 * @zh 接口 `IActionHandler`，定义I动作处理器的数据结构契约与属性规范。
 */
export interface IActionHandler {
  (tree: TreeModel, node: TreeNode, $event, ...rest);
}

/**
 * Constant/variable `TREE_ACTIONS` defining tree actions in `src/tree/models`.
 * @zh 常量/变量 `TREE_ACTIONS`，定义 `src/tree/models` 中的树形控件动作列表。
 */
export const TREE_ACTIONS = {
  TOGGLE_ACTIVE: (tree: TreeModel, node: TreeNode, $event) => node && node.toggleActivated(),
  TOGGLE_ACTIVE_MULTI: (tree: TreeModel, node: TreeNode, $event) => node && node.toggleActivated(true),
  TOGGLE_SELECTED: (tree: TreeModel, node: TreeNode, $event) => node && node.toggleSelected(),
  ACTIVATE: (tree: TreeModel, node: TreeNode, $event) => node.setIsActive(true),
  DEACTIVATE: (tree: TreeModel, node: TreeNode, $event) => node.setIsActive(false),
  SELECT: (tree: TreeModel, node: TreeNode, $event) => node.setIsActive(true),
  DESELECT: (tree: TreeModel, node: TreeNode, $event) => node.setIsActive(false),
  FOCUS: (tree: TreeModel, node: TreeNode, $event) => node.focus(),
  TOGGLE_EXPANDED: (tree: TreeModel, node: TreeNode, $event) => node.hasChildren && node.toggleExpanded(false),
  EXPAND: (tree: TreeModel, node: TreeNode, $event) => node.expand(),
  COLLAPSE: (tree: TreeModel, node: TreeNode, $event) => node.collapse(),
  DRILL_DOWN: (tree: TreeModel, node: TreeNode, $event) => tree.focusDrillDown(),
  DRILL_UP: (tree: TreeModel, node: TreeNode, $event) => tree.focusDrillUp(),
  NEXT_NODE: (tree: TreeModel, node: TreeNode, $event) => tree.focusNextNode(),
  PREVIOUS_NODE: (tree: TreeModel, node: TreeNode, $event) => tree.focusPreviousNode(),
  MOVE_NODE: (tree: TreeModel, node: TreeNode, $event: { ctrlKey? },data) => {
    if(data){
      let { from, to }=data;
      if ($event.ctrlKey) {
        tree.copyNode(from, to);
      } else {
        tree.moveNode(from, to);
      }
    }
  }
};

/**
 * Constant/variable `defaultActionMapping` defining default action mapping in `src/tree/models`.
 * @zh 常量/变量 `defaultActionMapping`，定义 `src/tree/models` 中的默认动作映射。
 */
const defaultActionMapping: IActionMapping = {
  mouse: {
    click: TREE_ACTIONS.TOGGLE_ACTIVE,
    dblClick: null,
    contextMenu: null,
    expanderClick: TREE_ACTIONS.TOGGLE_EXPANDED,
    checkboxClick: TREE_ACTIONS.TOGGLE_SELECTED,
    drop: TREE_ACTIONS.MOVE_NODE
  },
  keys: {
    [KEYS.RIGHT]: TREE_ACTIONS.DRILL_DOWN,
    [KEYS.LEFT]: TREE_ACTIONS.DRILL_UP,
    [KEYS.DOWN]: TREE_ACTIONS.NEXT_NODE,
    [KEYS.UP]: TREE_ACTIONS.PREVIOUS_NODE,
    [KEYS.SPACE]: TREE_ACTIONS.TOGGLE_ACTIVE,
    [KEYS.ENTER]: TREE_ACTIONS.TOGGLE_ACTIVE
  }
};

/**
 * Interface `IActionMapping` defining the contract and properties for i action mapping.
 * @zh 接口 `IActionMapping`，定义I动作映射的数据结构契约与属性规范。
 */
export interface IActionMapping {
  /**
   * Property `mouse` (`{…}`) storing mouse.
   * @zh 属性 `mouse`（类型：`{…}`），用于存储或配置鼠标。
   */
  mouse?: {
    click?: IActionHandler,
    dblClick?: IActionHandler,
    contextMenu?: IActionHandler,
    expanderClick?: IActionHandler,
    checkboxClick?: IActionHandler,
    dragStart?: IActionHandler,
    drag?: IActionHandler,
    dragEnd?: IActionHandler,
    dragOver?: IActionHandler,
    dragLeave?: IActionHandler,
    dragEnter?: IActionHandler,
    drop?: IActionHandler,
    mouseOver?: IActionHandler,
    mouseOut?: IActionHandler
  };
  /**
   * Property `keys` (`{ [key: number]: IActionHandler; }`) storing keys.
   * @zh 属性 `keys`（类型：`{ [key: number]: IActionHandler; }`），用于存储或配置键列表。
   */
  keys?: {
    [key: number]: IActionHandler
  };
}

/**
 * Class `TreeOptions` encapsulating tree options data structures and logic in `src/tree/models`.
 * @zh 类 `TreeOptions`，封装 `src/tree/models` 中的树形控件配置选项数据结构与处理逻辑。
 */
export class TreeOptions {
  /**
   * Gets the current has children field (`hasChildrenField: string`).
   * @zh 获取当前是否包含子级列表字段（`hasChildrenField: string`）。
   */
  get hasChildrenField(): string { return this.options.hasChildrenField || 'hasChildren'; }
  /**
   * Gets the current children field (`childrenField: string`).
   * @zh 获取当前子级列表字段（`childrenField: string`）。
   */
  get childrenField(): string { return this.options.childrenField || 'children'; }
  /**
   * Gets the current display field (`displayField: string`).
   * @zh 获取当前display字段（`displayField: string`）。
   */
  get displayField(): string { return this.options.displayField || 'name'; }
  /**
   * Gets the current id field (`idField: string`).
   * @zh 获取当前唯一标识字段（`idField: string`）。
   */
  get idField(): string { return this.options.idField || 'id'; }
  /**
   * Gets the current is expanded field (`isExpandedField: string`).
   * @zh 获取当前是否为已展开字段（`isExpandedField: string`）。
   */
  get isExpandedField(): string {    
    return this.options.isExpandedField || 'isExpanded'; }
  /**
   * Gets the current get children (`getChildren: any`).
   * @zh 获取当前获取子级列表（`getChildren: any`）。
   */
  get getChildren() { return this.options.getChildren; }
  /**
   * Gets the current level padding (`levelPadding: number`).
   * @zh 获取当前层级内边距（`levelPadding: number`）。
   */
  get levelPadding(): number { return this.options.levelPadding || 0; }
  /**
   * Gets the current use virtual scroll (`useVirtualScroll: boolean`).
   * @zh 获取当前使用虚拟滚动滚动（`useVirtualScroll: boolean`）。
   */
  get useVirtualScroll(): boolean { return this.options.useVirtualScroll; }
  /**
   * Gets the current animate expand (`animateExpand: boolean`).
   * @zh 获取当前animate展开（`animateExpand: boolean`）。
   */
  get animateExpand(): boolean { return this.options.animateExpand ||false; }
  /**
   * Gets the current animate speed (`animateSpeed: number`).
   * @zh 获取当前animate速度（`animateSpeed: number`）。
   */
  get animateSpeed(): number { return this.options.animateSpeed || 1; }
  /**
   * Gets the current animate acceleration (`animateAcceleration: number`).
   * @zh 获取当前animateAcceleration（`animateAcceleration: number`）。
   */
  get animateAcceleration(): number { return this.options.animateAcceleration || 1.2; }
  /**
   * Gets the current scroll on activate (`scrollOnActivate: boolean`).
   * @zh 获取当前滚动当激活（`scrollOnActivate: boolean`）。
   */
  get scrollOnActivate(): boolean { return this.options.scrollOnActivate === undefined ? true : this.options.scrollOnActivate; }
  /**
   * Gets the current rtl (`rtl: boolean`).
   * @zh 获取当前rtl（`rtl: boolean`）。
   */
  get rtl(): boolean { return !!this.options.rtl; }
  /**
   * Gets the current root id (`rootId: any`).
   * @zh 获取当前根节点唯一标识（`rootId: any`）。
   */
  get rootId() { return this.options.rootId; }
  /**
   * Gets the current use checkbox (`useCheckbox: boolean`).
   * @zh 获取当前使用复选框（`useCheckbox: boolean`）。
   */
  get useCheckbox(): boolean { return this.options.useCheckbox; }
  /**
   * Gets the current use tri state (`useTriState: boolean`).
   * @zh 获取当前使用Tri状态（`useTriState: boolean`）。
   */
  get useTriState(): boolean { return this.options.useTriState === undefined ? true : this.options.useTriState; }
  /**
   * Gets the current cascade select (`cascadeSelect: boolean`).
   * @zh 获取当前cascade下拉选择（`cascadeSelect: boolean`）。
   */
  get cascadeSelect(): boolean {
      return this.options.cascadeSelect==undefined? true:this.options.cascadeSelect;
    }
  /**
   * Gets the current expander align (`expanderAlign: 'left' | 'right'`).
   * @zh 获取当前展开器对齐（`expanderAlign: 'left' | 'right'`）。
   */
  get expanderAlign(): 'left' | 'right' { return this.options.expanderAlign; }

  /**
   * Gets the current scroll container (`scrollContainer: HTMLElement`).
   * @zh 获取当前滚动容器（`scrollContainer: HTMLElement`）。
   */
  get scrollContainer(): HTMLElement { return this.options.scrollContainer; }
  /**
   * Gets the current allow dragover styling (`allowDragoverStyling: boolean`).
   * @zh 获取当前允许Dragover样式（`allowDragoverStyling: boolean`）。
   */
  get allowDragoverStyling(): boolean { return this.options.allowDragoverStyling === undefined ? true : this.options.allowDragoverStyling; }

  // eslint-disable-next-line @typescript-eslint/adjacent-overload-signatures
  /**
   * Sets the get children (`getChildren`).
   * @zh 设置获取子级列表（`getChildren`）。
   * @param func - New get children value (`(node: TreeNode) => any`) / 新的获取子级列表值（`(node: TreeNode) => any`）
   */
  set getChildren(func) { this.options.getChildren = func }

  /**
   * Property `actionMapping` (`IActionMapping`) storing action mapping.
   * @zh 属性 `actionMapping`（类型：`IActionMapping`），用于存储或配置动作映射。
   */
  actionMapping: IActionMapping;

  /**
   * Creates an instance of `TreeOptions` and initializes its dependencies and internal state.
   * @zh 创建 `TreeOptions` 实例，并初始化其依赖项与内部状态。
   * @param options - Injected or initial options (`ITreeOptions`) / 注入或传入的配置选项（`ITreeOptions`）
   */
  constructor(public options: ITreeOptions = {}) {
    this.actionMapping = {
      mouse: {
        click: this.options?.actionMapping?.mouse?.click ?? defaultActionMapping.mouse.click,
        dblClick: this.options?.actionMapping?.mouse?.dblClick ?? defaultActionMapping.mouse.dblClick,
        contextMenu: this.options?.actionMapping?.mouse?.contextMenu ?? defaultActionMapping.mouse.contextMenu,
        expanderClick: this.options?.actionMapping?.mouse?.expanderClick ?? defaultActionMapping.mouse.expanderClick,
        checkboxClick: this.options?.actionMapping?.mouse?.checkboxClick ?? defaultActionMapping.mouse.checkboxClick,
        drop: this.options?.actionMapping?.mouse?.drop ?? defaultActionMapping.mouse.drop,
        dragStart: this.options?.actionMapping?.mouse?.dragStart ?? undefined,
        drag: this.options?.actionMapping?.mouse?.drag ?? undefined,
        dragEnd: this.options?.actionMapping?.mouse?.dragEnd ?? undefined,
        dragOver: this.options?.actionMapping?.mouse?.dragOver ?? undefined,
        dragLeave: this.options?.actionMapping?.mouse?.dragLeave ?? undefined,
        dragEnter: this.options?.actionMapping?.mouse?.dragEnter ?? undefined,
        mouseOver: this.options?.actionMapping?.mouse?.mouseOver ?? undefined,
        mouseOut: this.options?.actionMapping?.mouse?.mouseOut ?? undefined,
      },
      keys: {
        [KEYS.RIGHT]: TREE_ACTIONS.DRILL_DOWN,
        [KEYS.LEFT]: TREE_ACTIONS.DRILL_UP,
        [KEYS.DOWN]: TREE_ACTIONS.NEXT_NODE,
        [KEYS.UP]: TREE_ACTIONS.PREVIOUS_NODE,
        [KEYS.SPACE]: TREE_ACTIONS.TOGGLE_ACTIVE,
        [KEYS.ENTER]: TREE_ACTIONS.TOGGLE_ACTIVE
      }
    }

    if (this.options?.actionMapping?.keys) {
      this.actionMapping.keys = {
        ...this.actionMapping.keys,
        ...this.options.actionMapping.keys
      }
    }

    if (options.rtl) {
      this.actionMapping.keys[KEYS.RIGHT] = <IActionHandler>get(options, ['actionMapping', 'keys', KEYS.RIGHT]) || TREE_ACTIONS.DRILL_UP;
      this.actionMapping.keys[KEYS.LEFT] = <IActionHandler>get(options, ['actionMapping', 'keys', KEYS.LEFT]) || TREE_ACTIONS.DRILL_DOWN;
    }
  }

  /**
   * Executes `getNodeClone` to handle get node clone.
   * @zh 执行 `getNodeClone`，用于获取节点克隆。
   * @param node - node parameter (`TreeNode`) / 节点参数（`TreeNode`）
   * @returns Result of type `any` / 类型为 `any` 的返回值
   */
  getNodeClone(node: TreeNode) {
    if (this.options.getNodeClone) {
      return this.options.getNodeClone(node);
    }
  //  return omit(Object.assign({}, node.data), ['id']);
 
  const nodeClone = Object.assign({}, node.data);
   if (nodeClone.id) {
    delete nodeClone.id;
  }
  return nodeClone;}

  /**
   * Executes `allowDrop` to handle allow drop.
   * @zh 执行 `allowDrop`，用于允许放置。
   * @param element - element parameter (`any`) / 元素参数（`any`）
   * @param to - to parameter (`any`) / 转换为参数（`any`）
   * @param $event - event parameter (`any`) / 事件参数（`any`）
   * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
   */
  allowDrop(element, to, $event?): boolean {
    if (this.options.allowDrop instanceof Function) {
      return this.options.allowDrop(element, to, $event);
    } else {
      return this.options.allowDrop === undefined ? true : this.options.allowDrop;
    }
  }

  /**
   * Executes `allowDrag` to handle allow drag.
   * @zh 执行 `allowDrag`，用于允许拖拽。
   * @param node - node parameter (`TreeNode`) / 节点参数（`TreeNode`）
   * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
   */
  allowDrag(node: TreeNode): boolean {
    if (this.options.allowDrag instanceof Function) {
      return this.options.allowDrag(node);
    } else {
      return this.options.allowDrag;
    }
  }

  /**
   * Executes `nodeClass` to handle node class.
   * @zh 执行 `nodeClass`，用于节点类名。
   * @param node - node parameter (`TreeNode`) / 节点参数（`TreeNode`）
   * @returns Result of type `string` / 类型为 `string` 的返回值
   */
  nodeClass(node: TreeNode): string {
    return this.options.nodeClass ? this.options.nodeClass(node) : '';
  }

  /**
   * Executes `nodeHeight` to handle node height.
   * @zh 执行 `nodeHeight`，用于节点高度。
   * @param node - node parameter (`TreeNode`) / 节点参数（`TreeNode`）
   * @returns Result of type `number` / 类型为 `number` 的返回值
   */
  nodeHeight(node: TreeNode): number {
    if (node.data.virtual) {
      return 0;
    }

    let nodeHeight = this.options.nodeHeight || 22;

    if (typeof nodeHeight === 'function') {
      nodeHeight = nodeHeight(node);
    }

    // account for drop slots:
    return nodeHeight + (node.index === 0 ?  2 : 1) * this.dropSlotHeight;
  }

  /**
   * Gets the current drop slot height (`dropSlotHeight: number`).
   * @zh 获取当前放置Slot高度（`dropSlotHeight: number`）。
   */
  get dropSlotHeight(): number {
    return isNumber(this.options.dropSlotHeight) ? this.options.dropSlotHeight : 2;
  }
}
