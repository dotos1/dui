/**
 * @fileoverview Module `src/tree/components/tree.component.ts` providing tree component definitions and implementation.
 * @zh 模块文件 `src/tree/components/tree.component.ts`，提供树形控件组件相关的定义与实现。
 */

import { HttpClient } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ContentChild,
    EventEmitter,
    HostListener,
    Input,
    NgZone,
    OnChanges,
    Output,
    TemplateRef,
    ViewChild,
     ElementRef ,
    ViewEncapsulation,
    inject
} from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { isPhoneTerminal } from '@dotos/dui/base';
import { LocalStorageService } from '@dotos/dui/core/storage';
import { TranslateService } from '@dotos/dui/translator';
import { includes, pick}  from 'lodash-es';
import { BehaviorSubject } from 'rxjs';

import { TREE_EVENTS } from '../constants/events';
import { ITreeOptions } from '../defs/api';
import { TreeDraggedElement } from '../models';
import { TreeNode } from '../models/tree-node.model';
import { TreeModel } from '../models/tree.model';
import { TreeViewportComponent } from './tree-viewport.component';


/**
 * Interface `ITreeConfig` defining the contract and properties for i tree config.
 * @zh 接口 `ITreeConfig`，定义I树形控件配置的数据结构契约与属性规范。
 */
export interface ITreeConfig {
  /**
   * Property `click` (`Function`) storing click.
   * @zh 属性 `click`（类型：`Function`），用于存储或配置点击。
   */
  click: Function;
  /**
   * Property `rootUrl` (`string`) storing root url.
   * @zh 属性 `rootUrl`（类型：`string`），用于存储或配置根节点链接地址。
   */
  rootUrl?: string;
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
   * Property `rootParams` (`any`) storing root params.
   * @zh 属性 `rootParams`（类型：`any`），用于存储或配置根节点参数集合。
   */
  rootParams?
}

/**
 * Angular component `TreeComponent` (selector: 'Tree, tree-root') providing tree component presentation and interaction in `src/tree/components`.
 * @zh Angular 组件 `TreeComponent`（selector: 'Tree, tree-root'），提供树形控件组件的视图渲染与交互逻辑（位于 `src/tree/components`）。
 */
@Component({
  selector: 'Tree, tree-root',
  providers: [TreeModel],
  styleUrls: ['../tree.component.scss'],
  templateUrl: 'tree.component.html',
  encapsulation: ViewEncapsulation.None,

  host: {
    hostID: 'tree-root' + Math.random().toString(36).substring(2, 15),  
  }
})
export class TreeComponent implements OnChanges {


  /**
   * Template/content query reference `loadingTemplate` (`TemplateRef<unknown>`) targeting loading template.
   * @zh 模板/内容视图查询引用 `loadingTemplate`（`@ContentChild`），指向加载中模板。
   */
  @ContentChild('loadingTemplate', { static: false }) loadingTemplate: TemplateRef<unknown>;
  /**
   * Template/content query reference `treeNodeTemplate` (`TemplateRef<unknown>`) targeting tree node template.
   * @zh 模板/内容视图查询引用 `treeNodeTemplate`（`@ContentChild`），指向树形控件节点模板。
   */
  @ContentChild('treeNodeTemplate', { static: false }) treeNodeTemplate: TemplateRef<unknown>;
  /**
   * Template/content query reference `treeNodeWrapperTemplate` (`TemplateRef<unknown>`) targeting tree node wrapper template.
   * @zh 模板/内容视图查询引用 `treeNodeWrapperTemplate`（`@ContentChild`），指向树形控件节点包装器模板。
   */
  @ContentChild('treeNodeWrapperTemplate', { static: false }) treeNodeWrapperTemplate: TemplateRef<unknown>;
  /**
   * Template/content query reference `treeNodeFullTemplate` (`TemplateRef<unknown>`) targeting tree node full template.
   * @zh 模板/内容视图查询引用 `treeNodeFullTemplate`（`@ContentChild`），指向树形控件节点完整模板。
   */
  @ContentChild('treeNodeFullTemplate', { static: false }) treeNodeFullTemplate: TemplateRef<unknown>;
  /**
   * Template/content query reference `viewportComponent` (`TreeViewportComponent`) targeting viewport component.
   * @zh 模板/内容视图查询引用 `viewportComponent`（`@ViewChild`），指向视口组件。
   */
  @ViewChild('viewport', { static: true }) viewportComponent: TreeViewportComponent;

  /**
   * Whether the terminal is a phone: the tree renders as a drill-down list instead of a tree control.
   * @zh 是否手机类：不渲染树控件，逐级下钻（施工图 M2-14）。桌面为 false，模板与原来一致。
   */
  readonly phone = isPhoneTerminal();

  /**
   * Drill-down path on a phone.
   * @zh 手机下钻路径。
   */
  phoneStack: TreeNode[] = [];

  /**
   * Search term on a phone.
   * @zh 手机搜索词。
   */
  phoneTerm = '';

  private readonly _phoneDialogRef = inject<MatDialogRef<unknown>>(MatDialogRef, { optional: true });

  // Will be handled in ngOnChanges
  /**
   * Input setter `nodes` updating nodes.
   * @zh 输入属性 `nodes` 的设置器，用于更新节点列表。
   * @param nodes - New nodes value (`any`) / 新的节点列表值（`any`）
   */
  @Input() set nodes(nodes) {

  }
  /**
   * Input setter `options` updating options.
   * @zh 输入属性 `options` 的设置器，用于更新配置选项。
   * @param options - New options value (`ITreeOptions`) / 新的配置选项值（`ITreeOptions`）
   */
  @Input() set options(options: ITreeOptions) {

  }
  /**
   * Input setter `focused` updating focused.
   * @zh 输入属性 `focused` 的设置器，用于更新已聚焦。
   * @param value - New focused value (`boolean`) / 新的已聚焦值（`boolean`）
   */
  @Input() set focused(value: boolean) {
    this.treeModel.setFocus(value);
  }

  /**
   * Input setter `state` updating state.
   * @zh 输入属性 `state` 的设置器，用于更新状态。
   * @param state - New state value (`any`) / 新的状态值（`any`）
   */
  @Input() set state(state) {
    this.treeModel.setState(state);
  }

  /**
   * Input property `config` (`ITreeConfig`) configuring config.
   * @zh 输入属性 `config`（类型：`ITreeConfig`），用于配置配置。
   */
  @Input() config: ITreeConfig = {
    click: () => { },
    rootUrl: '',
    storeName: '',
    apiBase: '/api/',
    rootParams: {}
  };

  /**
   * Output event emitter `toggleExpanded` (`any`) firing when toggle expanded occurs.
   * @zh 输出事件 `toggleExpanded`（类型：`any`），当触发开关已展开时向外发出事件。
   */
  @Output() toggleExpanded;
  /**
   * Output event emitter `activate` (`any`) firing when activate occurs.
   * @zh 输出事件 `activate`（类型：`any`），当触发激活时向外发出事件。
   */
  @Output() activate;
  /**
   * Output event emitter `deactivate` (`any`) firing when deactivate occurs.
   * @zh 输出事件 `deactivate`（类型：`any`），当触发deactivate时向外发出事件。
   */
  @Output() deactivate;
  /**
   * Output event emitter `nodeActivate` (`any`) firing when node activate occurs.
   * @zh 输出事件 `nodeActivate`（类型：`any`），当触发节点激活时向外发出事件。
   */
  @Output() nodeActivate;
  /**
   * Output event emitter `nodeDeactivate` (`any`) firing when node deactivate occurs.
   * @zh 输出事件 `nodeDeactivate`（类型：`any`），当触发节点Deactivate时向外发出事件。
   */
  @Output() nodeDeactivate;
  /**
   * Output event emitter `select` (`any`) firing when select occurs.
   * @zh 输出事件 `select`（类型：`any`），当触发下拉选择时向外发出事件。
   */
  @Output() select;
  /**
   * Output event emitter `deselect` (`any`) firing when deselect occurs.
   * @zh 输出事件 `deselect`（类型：`any`），当触发取消选中时向外发出事件。
   */
  @Output() deselect;
  /**
   * Output event emitter `focus` (`any`) firing when focus occurs.
   * @zh 输出事件 `focus`（类型：`any`），当触发聚焦时向外发出事件。
   */
  @Output() focus;
  /**
   * Output event emitter `blur` (`any`) firing when blur occurs.
   * @zh 输出事件 `blur`（类型：`any`），当触发失焦时向外发出事件。
   */
  @Output() blur;
  /**
   * Output event emitter `updateData` (`any`) firing when update data occurs.
   * @zh 输出事件 `updateData`（类型：`any`），当触发更新数据时向外发出事件。
   */
  @Output() updateData;
  /**
   * Output event emitter `initialized` (`any`) firing when initialized occurs.
   * @zh 输出事件 `initialized`（类型：`any`），当触发已初始化时向外发出事件。
   */
  @Output() initialized;
  /**
   * Output event emitter `moveNode` (`any`) firing when move node occurs.
   * @zh 输出事件 `moveNode`（类型：`any`），当触发移动节点时向外发出事件。
   */
  @Output() moveNode;
  /**
   * Output event emitter `copyNode` (`any`) firing when copy node occurs.
   * @zh 输出事件 `copyNode`（类型：`any`），当触发复制节点时向外发出事件。
   */
  @Output() copyNode;
  /**
   * Output event emitter `loadNodeChildren` (`any`) firing when load node children occurs.
   * @zh 输出事件 `loadNodeChildren`（类型：`any`），当触发加载节点子级列表时向外发出事件。
   */
  @Output() loadNodeChildren;
  /**
   * Output event emitter `changeFilter` (`any`) firing when change filter occurs.
   * @zh 输出事件 `changeFilter`（类型：`any`），当触发变更过滤时向外发出事件。
   */
  @Output() changeFilter;
  /**
   * Output event emitter `event` (`any`) firing when event occurs.
   * @zh 输出事件 `event`（类型：`any`），当触发事件时向外发出事件。
   */
  @Output() event;
  /**
   * Output event emitter `stateChange` (`any`) firing when state change occurs.
   * @zh 输出事件 `stateChange`（类型：`any`），当触发状态变更时向外发出事件。
   */
  @Output() stateChange;

   /**
    * Property `globalListeners` (`(() => void)[]`) storing global listeners (default: `[]`).
    * @zh 属性 `globalListeners`（类型：`(() => void)[]`），用于存储或配置全局监听器列表（默认值：`[]`）。
    */
   private globalListeners: (() => void)[] =[];

  /**
   * Creates an instance of `TreeComponent` and initializes its dependencies and internal state.
   * @zh 创建 `TreeComponent` 实例，并初始化其依赖项与内部状态。
   * @param treeModel - Injected or initial tree model (`TreeModel`) / 注入或传入的树形控件模型（`TreeModel`）
   * @param treeDraggedElement - Injected or initial tree dragged element (`TreeDraggedElement`) / 注入或传入的树形控件Dragged元素（`TreeDraggedElement`）
   * @param localStore - Injected or initial local store (`LocalStorageService`) / 注入或传入的本地状态仓库（`LocalStorageService`）
   * @param http - Injected or initial http (`HttpClient`) / 注入或传入的HTTP（`HttpClient`）
   * @param translator - Injected or initial translator (`TranslateService`) / 注入或传入的翻译器（`TranslateService`）
   * @param ngZone - Injected or initial ng zone (`NgZone`) / 注入或传入的Angular区域(NgZone)（`NgZone`）
   * @param el - Injected or initial el (`ElementRef<any>`) / 注入或传入的DOM元素（`ElementRef<any>`）
   * @param _changeDetectorRef - Injected or initial change detector ref (`ChangeDetectorRef`) / 注入或传入的变更检测器引用（`ChangeDetectorRef`）
   */
  constructor(
    public treeModel: TreeModel,
    public treeDraggedElement: TreeDraggedElement,
    public localStore: LocalStorageService,
    protected http: HttpClient,
    public translator:TranslateService,
     private ngZone: NgZone ,
      private el: ElementRef,
    protected _changeDetectorRef: ChangeDetectorRef) {
    treeModel.eventNames.forEach((name) => this[name] = new EventEmitter());
    treeModel.subscribeToState((state) => this.stateChange.emit(state));
    treeModel.setEvents(pick(this, this.treeModel.eventNames));
  }

   /**
    * Angular lifecycle hook invoked once after component or directive inputs are initialized.
    * @zh Angular 生命周期钩子：在组件或指令的输入属性初始化完成后调用一次。
    */
   ngOnInit() {

    this.ngZone.runOutsideAngular(() => {
      const mouseDownHandler = (e: MouseEvent) => this.onMousedown(e);
      const keyDownHandler = (e: KeyboardEvent) => this.onKeydown(e);
      document.body.addEventListener('mousedown', mouseDownHandler);
      document.body.addEventListener('keydown', keyDownHandler);
      this.globalListeners.push(
        () => document.body.removeEventListener('mousedown', mouseDownHandler),
        () => document.body.removeEventListener('keydown', keyDownHandler)
      );
    });
  }

  /**
   * Angular lifecycle hook invoked just before the component, directive, or service is destroyed to release subscriptions and resources.
   * @zh Angular 生命周期钩子：在组件、指令或服务销毁前调用，用于释放订阅与清理资源。
   */
  ngOnDestroy() {
    this.globalListeners.forEach(cleanup => cleanup());
  }

  /**
   * Gets the current selected nodes (`selectedNodes: any`).
   * @zh 获取当前已选中节点列表（`selectedNodes: any`）。
   */
  get selectedNodes() {
    return this.treeModel.activeNodes;
  }


  /**
   * Executes `onKeydown` to handle on keydown.
   * @zh 执行 `onKeydown`，用于当按键按下。
   * @param $event - event parameter (`any`) / 事件参数（`any`）
   */
  onKeydown($event) {
    if (!this.treeModel.isFocused) { return; }
    if (includes(['input', 'textarea'],
      document.activeElement.tagName.toLowerCase())) { return; }
    const focusedNode = this.treeModel.getFocusedNode();
    this.treeModel.performKeyAction(focusedNode, $event);
  }

  // @HostListener('body: mousedown', ['$event'])
  /**
   * Executes `onMousedown` to handle on mousedown.
   * @zh 执行 `onMousedown`，用于当鼠标按下。
   * @param $event - event parameter (`any`) / 事件参数（`any`）
   */
  onMousedown($event) {
   if (this.el.nativeElement && !this.el.nativeElement.contains($event.target as Node)) {
      if (this.treeModel.isFocused) {
        this.ngZone.run(() => {
          this.treeModel.setFocus(false);
        });
      }
    }
  }

  /**
   * Executes `loadParentNode` to handle load parent node.
   * @zh 执行 `loadParentNode`，用于加载父级节点。
   * @param fn - fn parameter (`any`) / 函数参数（`any`）
   */
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
  /**
   * Executes `loadSelfNode` to handle load self node.
   * @zh 执行 `loadSelfNode`，用于加载自身节点。
   * @param id - id parameter (`any`) / 唯一标识参数（`any`）
   */
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

/**
 * Executes `setActiveNodeLabel` to handle set active node label.
 * @zh 执行 `setActiveNodeLabel`，用于集合激活节点标签。
 * @param label - label parameter (`string`) / 标签参数（`string`）
 */
setActiveNodeLabel(label: string) {
      let treeNode = this.treeModel.getActiveNode();
    if (treeNode) {
      treeNode.data[this.treeModel.options.displayField] = label;
      this._changeDetectorRef.detectChanges(); 
      this.treeModel.fireEvent({ eventName: 'updateData', node: treeNode });
      
    }
  }

  /**
   * Executes `setActiveNodeIcon` to handle set active node icon.
   * @zh 执行 `setActiveNodeIcon`，用于集合激活节点图标。
   * @param icon - icon parameter (`string`) / 图标参数（`string`）
   */
  setActiveNodeIcon(icon: string) {
    let treeNode = this.treeModel.getActiveNode();
    if (treeNode) {
      treeNode.icon = icon;
       this._changeDetectorRef.detectChanges(); 
      this.treeModel.fireEvent({ eventName: 'updateData', node: treeNode });
    }
  }

  /**
   * Executes `dropActiveNode` to handle drop active node.
   * @zh 执行 `dropActiveNode`，用于放置激活节点。
   * @param fn - fn parameter (`any`) / 函数参数（`any`）
   */
  dropActiveNode(fn) {
    try {
      let currentNode = this.treeModel.getActiveNode();
      if (!currentNode || !currentNode.parent) return;
      let parentNode = currentNode.parent;
      parentNode.setIsActive(true);
      if (fn) {
        fn(parentNode);
      }
      this.treeModel.removeNode(currentNode);
      this._changeDetectorRef.detectChanges();

    } catch (e) { 
      console.log(e); 
    }
  }

  /**
   * Executes `refresh` to handle refresh.
   * @zh 执行 `refresh`，用于刷新。
   */
  refresh() {
    this._changeDetectorRef.detectChanges();
  }

  /**
   * Executes `loadSubNode` to handle load sub node.
   * @zh 执行 `loadSubNode`，用于加载子节点。
   * @param id - id parameter (`any`) / 唯一标识参数（`any`）
   */
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

  /**
   * Executes `setAcvitNode` to handle set acvit node.
   * @zh 执行 `setAcvitNode`，用于集合Acvit节点。
   * @param id - id parameter (`any`) / 唯一标识参数（`any`）
   * @param event - event parameter (`any`) / 事件参数（`any`）
   */
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

  /**
   * Executes `getChildren` to handle get children.
   * @zh 执行 `getChildren`，用于获取子级列表。
   * @param node - node parameter (`TreeNode`) / 节点参数（`TreeNode`）
   */
  getChildren(node: TreeNode) {
    if (node.data.virtual) {
      return [this.getTree(this.config.rootUrl, {})];
    } else {
      return this.getTree(node.data.url);
    }
  }

  /**
   * Executes `exeHistoryNode` to handle exe history node.
   * @zh 执行 `exeHistoryNode`，用于exe历史记录节点。
   * @param nowNode - now node parameter (`any`) / 当前时间节点参数（`any`）
   */
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
    } else if (nowNode._parent === '0' && nowNode.index === nowNode.parent.children.length - 1) {
      return;
    } else {
      let newNode: TreeNode = nowNode.findNextNode(true, false);
      if (newNode && newNode !== inNode)//avoid endless loop
        this.exeHistoryNode(newNode);
    }
  }

  /**
   * Executes `loadNodeByPath` to handle load node by path.
   * @zh 执行 `loadNodeByPath`，用于加载节点按路径。
   * @param paths - paths parameter (`any`) / 路径参数（`any`）
   * @param startNode - start node parameter (`any`) / 开始节点参数（`any`）
   */
  public  loadNodeByPath(paths,startNode){
    let treeModel = this.treeModel;
    let activeNode;
    let subject=new BehaviorSubject(undefined);

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
      if (lastnode && lastnode.hasChildren) {
        if(lastnode.children==undefined){
          let subscription = treeModel.subscribe(TREE_EVENTS.loadNodeChildren, (node) => {
            paths.splice(0,1);
            let subject1=this.loadNodeByPath(paths,node.node);
            subject1.subscribe((activeNode)=>{
              subject.next(activeNode);
            });
            subscription.unsubscribe();
          });
          lastnode.loadNodeChildren();
        }else{
          paths.splice(0,1);
          let subject1=this.loadNodeByPath(paths,lastnode);
          subject1.subscribe((activeNode)=>{
            subject.next(activeNode);
          });
        }
      }
    }
    return subject;
  }

  /**
   * Executes `loadPath` to handle load path.
   * @zh 执行 `loadPath`，用于加载路径。
   * @param paths - paths parameter (`any`) / 路径参数（`any`）
   */
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

  /**
   * Nodes at the current level on a phone, or matching loaded nodes while searching.
   * @zh 手机当前层的节点；有搜索词时是已加载节点里匹配的。
   */
  phoneNodes(): TreeNode[] {
    const top = this.phoneStack[this.phoneStack.length - 1];
    const level = (top ? top.children : this.treeModel.roots) ?? [];
    const term = this.phoneTerm.trim().toLowerCase();
    if (!term) {
      return level;
    }
    const out: TreeNode[] = [];
    const walk = (list: TreeNode[]) => list.forEach((n) => {
      if (String(n.displayField).toLowerCase().includes(term)) {
        out.push(n);
      }
      if (n.children) {
        walk(n.children);
      }
    });
    walk(level);
    return out;
  }

  /**
   * Path hint on a phone.
   * @zh 手机路径提示。
   */
  phonePath(): string {
    return this.phoneStack.map((n): string => String(n.displayField)).join(' / ');
  }

  /**
   * A node with children can also be a value (e.g. a department): shows a pick button.
   * @zh 有下级的节点也可以取值（如部门）时显示「确定」。
   */
  phoneSelectable(n: TreeNode): boolean {
    return !this.treeModel.options.useCheckbox && !!n.data?.allowSelect;
  }

  /**
   * Tap a row: drill in when it has children, otherwise behave like a click on the node.
   * @zh 点行：有下级就下钻（按需加载子节点），否则等同点击节点（取值走原来的动作映射）。
   */
  phoneTap(n: TreeNode, event: Event): void {
    if (!n.hasChildren) {
      this.phonePick(n, event);
      return;
    }
    const go = () => {
      this.phoneStack = [...this.phoneStack, n];
      this.phoneTerm = '';
      this._changeDetectorRef.markForCheck();
    };
    if (n.children) {
      go();
    } else {
      void n.loadNodeChildren().then(go);
    }
  }

  /**
   * Take a node as the value (same action mapping as the desktop tree).
   * @zh 取节点为值（走与桌面树相同的动作映射）。
   */
  phonePick(n: TreeNode, event: Event): void {
    n.mouseAction('click', event);
  }

  /**
   * Multi-select on a phone (same checkbox action as the desktop tree).
   * @zh 手机多选（走与桌面树相同的勾选动作）。
   */
  phoneCheck(n: TreeNode, event: { checked: boolean }): void {
    n.mouseAction('checkboxClick', event);
  }

  /**
   * Back one level, or close the dialog at the top level.
   * @zh 回上一层；已在顶层时关闭弹窗。
   */
  phoneBack(): void {
    if (this.phoneStack.length) {
      this.phoneStack = this.phoneStack.slice(0, -1);
    } else {
      this._phoneDialogRef?.close();
    }
  }

  /**
   * Executes `getTree` to handle get tree.
   * @zh 执行 `getTree`，用于获取树形控件。
   * @param url - url parameter (`string`) / 链接地址参数（`string`）
   * @param params - params parameter (`any`) / 参数集合参数（`any`）
   */
  public getTree(url: string, params?) {
    return this.http.get(this.config.apiBase + url, { withCredentials: true, params: params })
      .toPromise()
      .then(res => <Object[]>res)
  }
  /**
   * Angular lifecycle hook invoked when data-bound input properties change.
   * @zh Angular 生命周期钩子：当数据绑定的输入属性发生变更时调用。
   * @param changes - changes parameter (`any`) / 变更集合参数（`any`）
   */
  ngOnChanges(changes) {
     if (changes.options || changes.nodes) {
      this.treeModel.setData({
        nodes: changes.nodes ? changes.nodes.currentValue : this.treeModel.nodes,
        options: changes.options ? changes.options.currentValue : undefined,
        events: pick(this, this.treeModel.eventNames)
      });
 
      if (this.treeModel.options) {
        if (this.treeModel.options.options) {
           if (this.treeModel.options.options.getChildren === undefined) {
              this.treeModel.options.options.getChildren = this.getChildren.bind(this);
           }
        } else {
           if ((this.treeModel.options as unknown as { getChildren? }).getChildren === undefined) {
              (this.treeModel.options as unknown as { getChildren? }).getChildren = this.getChildren.bind(this);
           }
        }
      }
      this._changeDetectorRef.detectChanges();
      if (this.viewportComponent) {
        requestAnimationFrame(() => {
          this.viewportComponent.setViewport();
          this._changeDetectorRef.detectChanges(); 
        });
      }
    }
}

  /**
   * Executes `sizeChanged` to handle size changed.
   * @zh 执行 `sizeChanged`，用于尺寸已变更。
   */
  sizeChanged() {
    this.viewportComponent.setViewport();
  }
}
