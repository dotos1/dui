import {
  Component, Input, Output, OnChanges, EventEmitter, ChangeDetectorRef, ViewEncapsulation,
  ContentChild, TemplateRef, HostListener, ViewChild
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as _ from 'lodash';
import { BehaviorSubject } from 'rxjs';
import { LocalStorageService } from '@dotos/dui/core/storage';
import { TranslateService } from '@dotos/dui/translator';

import { TreeModel } from '../models/tree.model';
import { TreeNode } from '../models/tree-node.model';
import { TreeViewportComponent } from './tree-viewport.component';
import { TreeDraggedElement } from '../models';
import { ITreeOptions } from '../defs/api';
import { TREE_EVENTS } from '../constants/events';

const { includes, pick } = _;

export interface ITreeConfig {
  click: Function;
  rootUrl?: string;
  storeName?: string;
  apiBase?: string;
  rootParams?: any
}

@Component({
  selector: 'Tree, tree-root',
  providers: [TreeModel],
  styleUrls: ['../tree.component.scss'],
  templateUrl: 'tree.component.html',
  encapsulation: ViewEncapsulation.None
})
export class TreeComponent implements OnChanges {


  @ContentChild('loadingTemplate', { static: false }) loadingTemplate: TemplateRef<any>;
  @ContentChild('treeNodeTemplate', { static: false }) treeNodeTemplate: TemplateRef<any>;
  @ContentChild('treeNodeWrapperTemplate', { static: false }) treeNodeWrapperTemplate: TemplateRef<any>;
  @ContentChild('treeNodeFullTemplate', { static: false }) treeNodeFullTemplate: TemplateRef<any>;
  @ViewChild('viewport', { static: true }) viewportComponent: TreeViewportComponent;

  // Will be handled in ngOnChanges
  @Input() set nodes(nodes: any[]) {

  }
  @Input() set options(options: ITreeOptions) {

  }
  @Input() set focused(value: boolean) {
    this.treeModel.setFocus(value);
  }

  @Input() set state(state) {
    this.treeModel.setState(state);
  }

  @Input() config: ITreeConfig = {
    click: () => { },
    rootUrl: '',
    storeName: '',
    apiBase: '/api/',
    rootParams: {}
  };

  @Output() toggleExpanded;
  @Output() activate;
  @Output() deactivate;
  @Output() nodeActivate;
  @Output() nodeDeactivate;
  @Output() select;
  @Output() deselect;
  @Output() focus;
  @Output() blur;
  @Output() updateData;
  @Output() initialized;
  @Output() moveNode;
  @Output() copyNode;
  @Output() loadNodeChildren;
  @Output() changeFilter;
  @Output() event;
  @Output() stateChange;

  constructor(
    public treeModel: TreeModel,
    public treeDraggedElement: TreeDraggedElement,
    public localStore: LocalStorageService,
    protected http: HttpClient,
    public translator:TranslateService,
    protected _changeDetectorRef: ChangeDetectorRef) {
    treeModel.eventNames.forEach((name) => this[name] = new EventEmitter());
    treeModel.subscribeToState((state) => this.stateChange.emit(state));
    treeModel.setEvents(pick(this, this.treeModel.eventNames));
  }

  get selectedNodes() {
    return this.treeModel.activeNodes;
  }

  @HostListener('body: keydown', ['$event'])
  onKeydown($event) {
    if (!this.treeModel.isFocused) { return; }
    if (includes(['input', 'textarea'],
      document.activeElement.tagName.toLowerCase())) { return; }
    const focusedNode = this.treeModel.getFocusedNode();
    this.treeModel.performKeyAction(focusedNode, $event);
  }

  @HostListener('body: mousedown', ['$event'])
  onMousedown($event) {
    function isOutsideClick(startElement: Element, nodeName: string) {
      return !startElement ? true : startElement.localName === nodeName ? false : isOutsideClick(startElement.parentElement, nodeName);
    }
    if (isOutsideClick($event.target, 'tree-root')) {
      this.treeModel.setFocus(false);
    }
  }

  loadParentNode(fn) {
    try {
      let currentNode = this.treeModel.getActiveNode();
      currentNode = currentNode.parent;
      currentNode.setIsActive(true);
      fn(currentNode);
      currentNode.loadNodeChildren();
    } catch (e) { console.log(e); }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  loadSelfNode(id) {
    try {
      let currentNode = this.treeModel.getActiveNode();
      if(currentNode.isRoot){
        currentNode.loadNodeChildren();
      }else{
        currentNode = currentNode.parent;
        let subscription;
        let fn=(event) => {
          this.setAcvitNode(id, event);
          subscription.unsubscribe();
        }
        subscription = this.treeModel.subscribe('loadNodeChildren',fn );
        currentNode.loadNodeChildren();
      }     
    } catch (e) { console.log(e); }
  }

  setActiveNodeLabel(label: string) {
    let treeNode = this.treeModel.getActiveNode();
    treeNode.data[this.treeModel.options.displayField] = label;
    this._changeDetectorRef.detectChanges();
  }

  setActiveNodeIcon(icon: string) {
    let treeNode = this.treeModel.getActiveNode();
    treeNode.icon = icon;
    this._changeDetectorRef.detectChanges();
  }

  dropActiveNode(fn) {
    try {
      let currentNode = this.treeModel.getActiveNode();
      let parentNode = currentNode.parent;
      parentNode.setIsActive(true);
      fn(parentNode);
      parentNode.treeModel.removeNode(currentNode);
      this._changeDetectorRef.detectChanges();
    } catch (e) { console.log(e); }
  }

  refresh() {
    this._changeDetectorRef.detectChanges();
  }

  loadSubNode(id) {
    try {
      let subscription;
      let fn=(event) => {
        this.setAcvitNode(id, event);
        subscription.unsubscribe();
      }
      subscription = this.treeModel.subscribe('loadNodeChildren', fn);
      const currentNode = this.treeModel.getActiveNode();
      currentNode.loadNodeChildren();
    } catch (e) { console.log(e); }
  }

  setAcvitNode(id, event) {
    const node = event.node;
    node.expand();
    let NNode = node.getFirstChild();
    while (NNode.id !== id && NNode.index !== NNode.parent.children.length - 1) {
      NNode = NNode.findNextNode();
    }
    NNode.setIsActive(true);
    this.config.click(NNode);
  }

  getChildren(node: TreeNode) {
    if (node.data.virtual) {
      return [this.getTree(this.config.rootUrl, {})];
    } else {
      return this.getTree(node.data.url);
    }
  }

  public exeHistoryNode(nowNode?) {
    let inNode = nowNode;
    let treeModel = this.treeModel;
    if (!nowNode) {
      nowNode = treeModel.getFirstRoot();
    }
    if (nowNode.data.params) {
      this.config.click(nowNode);
      treeModel.setActiveNode(nowNode, true);
      return;
    } else if (nowNode._parent === '0' && nowNode.index() === nowNode.parent.children.length - 1) {
      return;
    } else {
      let newNode: TreeNode = nowNode.findNextNode(true, false);
      if (!newNode && newNode != inNode)//avoid endless loop
        this.exeHistoryNode(newNode);
    }
  }

  public  loadNodeByPath(paths,startNode){
    let treeModel = this.treeModel;
    let activeNode;
    let subject:BehaviorSubject<any>=new BehaviorSubject<any>(undefined);

    if(paths.length==1){
      let lastnode = treeModel.getNodeByPath([paths[0]], startNode)
      if (lastnode) {
        if(lastnode.hasChildren&&lastnode.children==undefined){
          lastnode.expand();
        }
        activeNode = lastnode;
      }
      subject.next(activeNode);
    }else{
      let lastnode = treeModel.getNodeByPath([paths[0]], startNode);
      let subscription;
      if (lastnode) {
        subscription = treeModel.subscribe(TREE_EVENTS.loadNodeChildren, (node) => {
           paths.splice(0,1);
           let subject1:BehaviorSubject<any>=this.loadNodeByPath(paths,node.node);
           subject1.subscribe((activeNode)=>{
            subject.next(activeNode);
           });
           subscription.unsubscribe();
        });
        if(lastnode.hasChildren){
          if(lastnode.children==undefined){
             lastnode.loadNodeChildren();
          }else{
            paths.splice(0,1);
            let subject1:BehaviorSubject<any>=this.loadNodeByPath(paths,lastnode);
            subject1.subscribe((activeNode)=>{
              subject.next(activeNode);
             });
          }
        }
      }
    }
    return subject;
  }

  public loadPath(paths) {
    let treeModel = this.treeModel;
    let startNode = null;
    for (let i = 0; i < paths.length; i++) {
      let lastnode = treeModel.getNodeByPath([paths[i]], startNode)
      if (lastnode) {
        lastnode.expand();
        if (i == paths.length - 1){
          lastnode.setIsActive(true);
        }
        startNode = lastnode;
      } else {
        if (startNode)
          startNode.loadNodeChildren().then(() => this.loadPath(paths));
        break;
      }
    }
  }

  public getTree(url: string, params?: any) {
    return this.http.get(this.config.apiBase + url, { withCredentials: true, params: params })
      .toPromise()
      .then(res => <Object[]>res)
  }
  ngOnChanges(changes) {
    if (changes.options || changes.nodes) {
      this.treeModel.setData({
        nodes: changes.nodes && changes.nodes.currentValue,
        options: changes.options && changes.options.currentValue,
        events: pick(this, this.treeModel.eventNames)
      });

      if (this.treeModel.options.getChildren == undefined) {
        this.treeModel.options.getChildren = this.getChildren.bind(this);
      }
    }
  }

  sizeChanged() {
    this.viewportComponent.setViewport();
  }
}
