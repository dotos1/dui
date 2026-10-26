/**
 * @fileoverview Module `src/tree/components/tree-node-expander.component.ts` providing tree node expander component definitions and implementation.
 * @zh 模块文件 `src/tree/components/tree-node-expander.component.ts`，提供树形控件节点展开器组件相关的定义与实现。
 */

import { Component, Input, ViewEncapsulation,ChangeDetectionStrategy } from '@angular/core';
import { action, observable } from '@dotos/dui/core/mobx';
import { TreeNode } from '../models/tree-node.model';
import { 
  ElementRef, 
  NgZone, 
  OnInit, 
  OnDestroy 
} from '@angular/core';

/**
 * Angular component `TreeNodeExpanderComponent` (selector: 'tree-node-expander') providing tree node expander component presentation and interaction in `src/tree/components`.
 * @zh Angular 组件 `TreeNodeExpanderComponent`（selector: 'tree-node-expander'），提供树形控件节点展开器组件的视图渲染与交互逻辑（位于 `src/tree/components`）。
 */
@Component({
  selector: 'tree-node-expander',
  encapsulation: ViewEncapsulation.None,
  templateUrl: 'tree-node-expander.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush, 
  host: {
    hostID: 'tree-node-expander' + Math.random().toString(36).substring(2, 15)
  }
})
export class TreeNodeExpanderComponent implements OnInit, OnDestroy {
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
   * Property `clickListener` (`(event: MouseEvent) => void`) storing click listener.
   * @zh 属性 `clickListener`（类型：`(event: MouseEvent) => void`），用于存储或配置点击监听器。
   */
  private clickListener: (event: MouseEvent) => void;

  /**
   * Creates an instance of `TreeNodeExpanderComponent` and initializes its dependencies and internal state.
   * @zh 创建 `TreeNodeExpanderComponent` 实例，并初始化其依赖项与内部状态。
   * @param el - Injected or initial el (`ElementRef`) / 注入或传入的DOM元素（`ElementRef`）
   * @param ngZone - Injected or initial ng zone (`NgZone`) / 注入或传入的Angular区域(NgZone)（`NgZone`）
   */
  constructor(
    private el: ElementRef, 
    private ngZone: NgZone
  ) {}

  /**
   * Angular lifecycle hook invoked once after component or directive inputs are initialized.
   * @zh Angular 生命周期钩子：在组件或指令的输入属性初始化完成后调用一次。
   */
  ngOnInit() {
    this.clickListener = (event: MouseEvent) => {
      const wrapper = this.el.nativeElement.querySelector('.toggle-children-wrapper');
      if (wrapper && wrapper.contains(event.target as Node)) {
        if (this.node && this.node.hasChildren && this.node.mouseAction) {
          this.node.mouseAction('expanderClick', event);
        }
      }
    };

    this.ngZone.runOutsideAngular(() => {
      this.el.nativeElement.addEventListener('click', this.clickListener);
    });
  }

  /**
   * Angular lifecycle hook invoked just before the component, directive, or service is destroyed to release subscriptions and resources.
   * @zh Angular 生命周期钩子：在组件、指令或服务销毁前调用，用于释放订阅与清理资源。
   */
  ngOnDestroy() {
    if (this.clickListener) {
      this.el.nativeElement.removeEventListener('click', this.clickListener);
    }
  }
}