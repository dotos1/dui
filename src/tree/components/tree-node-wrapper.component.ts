/**
 * @fileoverview Module `src/tree/components/tree-node-wrapper.component.ts` providing tree node wrapper component definitions and implementation.
 * @zh 模块文件 `src/tree/components/tree-node-wrapper.component.ts`，提供树形控件节点包装器组件相关的定义与实现。
 */

import { 
  Component, 
  Input, 
  ViewEncapsulation, 
  ChangeDetectionStrategy, 
  ElementRef, 
  NgZone, 
  OnInit, 
  OnDestroy 
} from '@angular/core';
import { action, observable } from '@dotos/dui/core/mobx';
import { TreeNode } from '../models/tree-node.model';

/**
 * Angular component `TreeNodeWrapperComponent` (selector: 'tree-node-wrapper') providing tree node wrapper component presentation and interaction in `src/tree/components`.
 * @zh Angular 组件 `TreeNodeWrapperComponent`（selector: 'tree-node-wrapper'），提供树形控件节点包装器组件的视图渲染与交互逻辑（位于 `src/tree/components`）。
 */
@Component({
  selector: 'tree-node-wrapper',
  encapsulation: ViewEncapsulation.None,
  styles:[],
  templateUrl: 'tree-node-wrapper.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush, 
  host: {
    hostID: 'tree-node-wrapper' + Math.random().toString(36).substring(2, 15) 
  }
})
export class TreeNodeWrapperComponent implements OnInit, OnDestroy {
  //同 TreeNodeChildrenComponent：模板在 treeMobxAutorun 里，换实例必须走 observable
  /**
   * Getter for input property `node` (`any`) returning node.
   * @zh 输入属性 `node`（类型：`any`）的读取器，返回当前节点。
   */
  @Input()
  get node() {
    return this._node;
  }
  /**
   * Sets the node (`node`).
   * @zh 设置节点（`node`）。
   * @param node - New node value (`any`) / 新的节点值（`any`）
   */
  set node(node) {
    this.setNode(node);
  }
  /**
   * Executes `setNode` to handle set node.
   * @zh 执行 `setNode`，用于集合节点。
   * @param node - node parameter (`any`) / 节点参数（`any`）
   */
  @action setNode(node) {
    this._node = node;
  }
  /**
   * Property `_node` (`TreeNode`) storing node.
   * @zh 属性 `_node`（类型：`TreeNode`），用于存储或配置节点。
   */
  @observable _node: TreeNode;

  /**
   * Input property `index` (`number`) configuring index.
   * @zh 输入属性 `index`（类型：`number`），用于配置索引。
   */
  @Input() index: number;
  /**
   * Input property `templates` (`any`) configuring templates.
   * @zh 输入属性 `templates`（类型：`any`），用于配置模板。
   */
  @Input() templates;

  /**
   * Property `cleanupListeners` (`(() => void)[]`) storing cleanup listeners (default: `[]`).
   * @zh 属性 `cleanupListeners`（类型：`(() => void)[]`），用于存储或配置cleanup监听器列表（默认值：`[]`）。
   */
  private cleanupListeners: (() => void)[] =[];

  /**
   * Creates an instance of `TreeNodeWrapperComponent` and initializes its dependencies and internal state.
   * @zh 创建 `TreeNodeWrapperComponent` 实例，并初始化其依赖项与内部状态。
   * @param el - Injected or initial el (`ElementRef`) / 注入或传入的DOM元素（`ElementRef`）
   * @param ngZone - Injected or initial ng zone (`NgZone`) / 注入或传入的Angular区域(NgZone)（`NgZone`）
   */
  constructor(
    private el: ElementRef,
    private ngZone: NgZone
  ) { }
 /**
  * Angular lifecycle hook invoked once after component or directive inputs are initialized.
  * @zh Angular 生命周期钩子：在组件或指令的输入属性初始化完成后调用一次。
  */
 ngOnInit() {
    this.ngZone.runOutsideAngular(() => {
      const nativeEl = this.el.nativeElement;
      const createHandler = (actionName: string, runInZone: boolean) => (event: MouseEvent) => {
        const wrapper = nativeEl.querySelector('.node-content-wrapper');
        if (wrapper && wrapper.contains(event.target as Node)) {
          if (this.node && this.node.mouseAction) {
            if (runInZone) {
                setTimeout(() => {
                  this.ngZone.run(() => {
                    this.node.mouseAction(actionName, event);
                  });
                }, 0);
            } else {
               this.node.mouseAction(actionName, event);
            }
          }
        }
      };

      const clickHandler = createHandler('click', true);
      const dblClickHandler = createHandler('dblClick', true);
      const contextMenuHandler = createHandler('contextMenu', true);
      
      const mouseOverHandler = createHandler('mouseOver', false);
      const mouseOutHandler = createHandler('mouseOut', false);

      nativeEl.addEventListener('click', clickHandler);
      nativeEl.addEventListener('dblclick', dblClickHandler);
      nativeEl.addEventListener('contextmenu', contextMenuHandler);
      nativeEl.addEventListener('mouseover', mouseOverHandler);
      nativeEl.addEventListener('mouseout', mouseOutHandler);

      this.cleanupListeners =[
        () => nativeEl.removeEventListener('click', clickHandler),
        () => nativeEl.removeEventListener('dblclick', dblClickHandler),
        () => nativeEl.removeEventListener('contextmenu', contextMenuHandler),
        () => nativeEl.removeEventListener('mouseover', mouseOverHandler),
        () => nativeEl.removeEventListener('mouseout', mouseOutHandler)
      ];
    });
  }

  /**
   * Angular lifecycle hook invoked just before the component, directive, or service is destroyed to release subscriptions and resources.
   * @zh Angular 生命周期钩子：在组件、指令或服务销毁前调用，用于释放订阅与清理资源。
   */
  ngOnDestroy() {
    this.cleanupListeners.forEach(cleanup => cleanup());
    this.cleanupListeners = [];
  }
}