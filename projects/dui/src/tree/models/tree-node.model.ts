import { observable, computed, reaction,  action, IReactionDisposer } from 'mobx';
import * as _ from 'lodash';
import { TranslateService } from '@dotos/dui/i18n';

import { TreeModel } from './tree.model';
import { TreeOptions } from './tree-options.model';
import { ITreeNode } from '../defs/api';
import { TREE_EVENTS } from '../constants/events';

const { first, last, some, every } = _;

export class TreeNode implements ITreeNode {
  private handler: IReactionDisposer;
  @computed get isHidden() { return this.treeModel.isHidden(this); }
  @computed get isExpanded() {
    return this.treeModel.isExpanded(this);
  }
  @computed get isActive() { return this.treeModel.isActive(this); }
  @computed get isFocused() { return this.treeModel.isNodeFocused(this); }
  @computed get isSelected():boolean {
    if (this.isSelectable()) {
      return this.treeModel.isSelected(this);
    } else {
      return some(this.children, (node) => node.isSelected);
    }
  }
  @computed get isAllSelected() {
    if (this.isSelectable()) {
      return this.treeModel.isSelected(this);
    } else {
      return every(this.children, (node) => node.isAllSelected);
    }
  }
  @computed get isPartiallySelected() {
    return this.isSelected && !this.isAllSelected;
  }

  @observable children: TreeNode[];
  @observable index: number;
  @observable position = 0;
  @observable height: number;
  @computed get level(): number {
    return this.parent ? this.parent.level + 1 : 0;
  }
  @computed get path(): string[] {
    return this.parent ? [...this.parent.path, this.id] : [];
  }

  get elementRef(): any {
    throw new Error(`Element Ref is no longer supported since introducing virtual scroll\n
      You may use a template to obtain a reference to the element`);
  }

  private _originalNode: any;
  get originalNode() { return this._originalNode; }
  private  translator:TranslateService;
  
  constructor(public data: any, public parent: TreeNode, public treeModel: TreeModel, index?: number) {
    if (this.id === undefined || this.id === null) {
      this.id = uuid();
    }
    this.index = index;
    this.translator=treeModel.translator;
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
  get hasChildren(): boolean {
    return !!(this.getField('hasChildren') || (this.children && this.children.length > 0));
  }
  get isCollapsed(): boolean { return !this.isExpanded; }
  get isLeaf(): boolean { return !this.hasChildren; }
  get isRoot(): boolean { return this.parent.data.virtual; }
  get realParent(): TreeNode { return this.isRoot ? null : this.parent; }

  // proxy functions:
  get options(): TreeOptions { return this.treeModel.options; }

  fireEvent(event) { this.treeModel.fireEvent(event); }

  // field accessors:
  get displayField() {
    return  this.translator.instant(this.getField('display'));
  }
  get id() {
    return this.getField('id');
  }
  set id(value) {
    this.setField('id', value);
  }
  // field accessors:
  get expandedIcon() {
    return this.data['expandedIcon'];
  }

  // field accessors:
  get icon() {
    return this.data['icon'];
  }

  set icon(icon) {
    this.data['icon'] = icon;
  }

  // field accessors:
  get toolTip() {
    return this.data['toolTip']?this.translator.instant(this.data['toolTip']):undefined;
  }

  set toolTip(toolTip) {
    this.data['toolTip'] = toolTip;
  }

  get checkable() {
    if (this.data['checkable'] == undefined) {
      return true;
    } else {
      return this.data['checkable'];
    }
  }

  set checkable(c) { this.data['checkable'] = c; }

  get editable() {
    if (this.data['editable'] == undefined) {
      return false;
    } else {
      return this.data['editable'];
    }
  }

  set editable(c) { this.data['editable'] = c; }

  getField(key) {
    return this.data[this.options[`${key}Field`]];
  }

  setField(key, value) {
    this.data[this.options[`${key}Field`]] = value;
  }

  // traversing:
  _findAdjacentSibling(steps, skipHidden = false) {
    const siblings = this._getParentsChildren(skipHidden);
    const index = siblings.indexOf(this);
    return siblings.length > index + steps ? siblings[index + steps] : null;
  }

  findNextSibling(skipHidden = false) {
    return this._findAdjacentSibling(+1, skipHidden);
  }

  findPreviousSibling(skipHidden = false) {
    return this._findAdjacentSibling(-1, skipHidden);
  }

  getVisibleChildren() {
    return this.visibleChildren;
  }


  getPathValue(val, name): string[] {
    if (this.parent) {
      val = this.parent.getPathValue(val, name);
    }
    if (this.data[name]) {
      val = _.concat(val, [this.data[name]]);
    } else {
      val = _.concat(val, []);
    }
    return val;
  }

  @computed get visibleChildren() {
    return (this.children || []).filter((node) => !node.isHidden);
  }

  getFirstChild(skipHidden = false) {
    const children = skipHidden ? this.visibleChildren : this.children;
    return first(children || []);
  }

  getLastChild(skipHidden = false) {
    const children = skipHidden ? this.visibleChildren : this.children;
    return last(children || []);
  }

  findNextNode(goInside = true, skipHidden = false) {
    return goInside && this.isExpanded && this.getFirstChild(skipHidden) ||
      this.findNextSibling(skipHidden) ||
      this.parent && this.parent.findNextNode(false, skipHidden);
  }

  findPreviousNode(skipHidden = false) {
    const previousSibling = this.findPreviousSibling(skipHidden);
    if (!previousSibling) {
      return this.realParent;
    }
    return previousSibling._getLastOpenDescendant(skipHidden);
  }

  _getLastOpenDescendant(skipHidden = false) {
    const lastChild = this.getLastChild(skipHidden);
    return (this.isCollapsed || !lastChild)
      ? this
      : lastChild._getLastOpenDescendant(skipHidden);
  }

  private _getParentsChildren(skipHidden = false): any[] {
    const children = this.parent &&
      (skipHidden ? this.parent.getVisibleChildren() : this.parent.children);
    return children || [];
  }

  public getRoot(node?:TreeNode) {
    if(node==undefined)
      node=this;
    if(node.isRoot) return node;
    if(node.parent&&node.parent.isRoot){
      return node.parent;
    }else{
      return this.getRoot(node.parent);
    }
 }

  public getAllParents(result:TreeNode[]) {
     if(this.parent){
      result.push(this.parent);
      this.parent.getAllParents(result);
     }
  }
  public getAllChildren(result:TreeNode[]) {
    if(this.children){
      this.children.forEach((child)=>{
        result.push(child);
        if(child.children){
          child.getAllChildren(result);
        }
      })
    }
 }

  getIndexInParent(skipHidden = false) {
    return this._getParentsChildren(skipHidden).indexOf(this);
  }

  isDescendantOf(node: TreeNode) {
    if (this === node) {
      return true;
    } else { return this.parent && this.parent.isDescendantOf(node); }
  }

  getNodePadding(): string {
    return this.options.levelPadding * (this.level - 1) + 'px';
  }

  getClass(): string {
    return [this.options.nodeClass(this), `tree-node-level-${this.level}`].join(' ');
  }

  onDrop($event) {
    this.mouseAction('drop', $event.event, {
      from: $event.element,
      to: { parent: this, index: 0, dropOnNode: true }
    });
  }

  allowDrop = (element, $event?) => {
    return this.options.allowDrop(element, { parent: this, index: 0 }, $event);
  }

  allowDragoverStyling = () => {
    return this.options.allowDragoverStyling;
  }

  allowDrag() {
    return this.options.allowDrag(this);
  }

  // dropZones() {
  //   return this.options.dropZones;
  // }

  setNodeChildren(children){
   
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
        }}).then(() => {
          this.fireEvent({
            eventName: TREE_EVENTS.loadNodeChildren,
            node: this
          });
      });
  }

  expand() {
    if (!this.isExpanded) {
      this.toggleExpanded();
    }
    return this;
  }

  collapse() {
    if (this.isExpanded) {
      this.toggleExpanded();
    }
    return this;
  }

  doForAll(fn: (node: ITreeNode) => any) {
    Promise.resolve(fn(this)).then(() => {
      if (this.children) {
        this.children.forEach((child) => child.doForAll(fn));
      }
    });
  }

  expandAll() {
    this.doForAll((node) => node.expand());
  }

  collapseAll() {
    this.doForAll((node) => node.collapse());
  }

  ensureVisible() {
    if (this.realParent) {
      this.realParent.expand();
      this.realParent.ensureVisible();
    }

    return this;
  }

  toggleExpanded() {
    this.setIsExpanded(!this.isExpanded);
    return this;
  }

  setIsExpanded(value) {
    if (this.hasChildren) {
      this.treeModel.setExpandedNode(this, value);
    }
    return this;
  }

  autoLoadChildren() {
   this.handler =
    reaction(
      () => this.isExpanded,
      (isExpanded) => {
        if (!this.children && this.hasChildren && isExpanded) {
          this.loadNodeChildren();
        }
      },
      { fireImmediately: true }
    );
  }

  dispose() {
    if (this.children) {
      this.children.forEach((child) => child.dispose());
    }
    if (this.handler) {
      this.handler();
    }
    this.parent = null;
    this.children = null;
  }

  setIsActive(value, multi = false) {
    this.treeModel.setActiveNode(this, value, multi);
    if (value) {
      this.focus();
    }
    return this;
  }

  isSelectable() {
    return this.isLeaf || !this.children || !this.options.useTriState;
  }
  @action  setIsSelected(value) {

    if (this.options.cascadeSelect) {
      if (this.isLeaf) {
        this.treeModel.setSelectedNode(this, value);
      } else if (this.children) {
        this.children.forEach((child) => child.setIsSelected(value));
      } else {
        this.treeModel.setSelectedNode(this, value);
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

  toggleSelected() {
    this.setIsSelected(!this.isSelected);
    return this;
  }

  toggleActivated(multi = false) {
    this.setIsActive(!this.isActive, multi);
    return this;
  }

  setActiveAndVisible(multi = false) {
    this.setIsActive(true, multi)
      .ensureVisible();
    setTimeout(this.scrollIntoView.bind(this));
    return this;
  }

  scrollIntoView(force = false) {
    this.treeModel.virtualScroll.scrollIntoView(this, force);
  }

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

  blur() {
    const previousNode = this.treeModel.getFocusedNode();
    this.treeModel.setFocusedNode(null);
    if (previousNode) {
      this.fireEvent({ eventName: TREE_EVENTS.blur, node: this });
    }
    return this;
  }

  setIsHidden(value) {
    this.treeModel.setIsHidden(this, value);
  }

  hide() {
    this.setIsHidden(true);
  }

  show() {
    this.setIsHidden(false);
  }

  mouseAction(actionName: string, $event, data: any = null) {
    this.treeModel.setFocus(true);

    const actionMapping = this.options.actionMapping.mouse;
    const action = actionMapping[actionName];

    if (action) {
      action(this.treeModel, this, $event, data);
    }
  }

  getSelfHeight() {
    return this.options.nodeHeight(this);
  }

  @action _initChildren() {
    this.children = this.getField('children')
      .map((c, index) => new TreeNode(c,this,this.treeModel, index));
  }
}

function uuid() {
  return Math.floor(Math.random() * 10000000000000);
}
