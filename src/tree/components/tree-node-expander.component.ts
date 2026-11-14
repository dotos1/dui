/**
 * @fileoverview Module `src/tree/components/tree-node-expander.component.ts` providing Signal-backed tree node expander component.
 * @zh 模块文件 `src/tree/components/tree-node-expander.component.ts`，提供基于原生 Angular Signal 的树节点展开器组件实现（零 MobX 依赖）。
 */

import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { TreeNode } from '../models/tree-node.model';

/**
 * Angular component `TreeNodeExpanderComponent` (selector: 'tree-node-expander') providing tree node expander presentation and interaction in `src/tree/components`.
 * @zh Angular 组件 `TreeNodeExpanderComponent`（selector: 'tree-node-expander'），提供树形控件节点展开箭头的视图渲染与点击切换逻辑。
 */
@Component({
  selector: 'tree-node-expander',
  encapsulation: ViewEncapsulation.None,
  templateUrl: 'tree-node-expander.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    hostID: 'tree-node-expander' + Math.random().toString(36).substring(2, 15),
  },
  standalone: false,
})
export class TreeNodeExpanderComponent implements OnInit, OnDestroy {
  // 私有 Signal 追踪当前节点引用
  private readonly _nodeSig = signal<TreeNode | null>(null);

  /**
   * Getter for input property `node` (`TreeNode`) returning current node.
   * @zh 输入属性 `node`（类型：`TreeNode`）的读取器，返回当前节点。
   */
  @Input()
  get node(): TreeNode {
    return this._nodeSig() as TreeNode;
  }

  /**
   * Sets the `node` (`node`).
   * @zh 设置节点（`node`）。
   * @param node - New node value (`TreeNode`) / 新的节点值（`TreeNode`）
   */
  set node(node: TreeNode) {
    this.setNode(node);
  }

  /**
   * Executes `setNode` to update the node Signal.
   * @zh 执行 `setNode`，更新内部节点 Signal。
   * @param node - node parameter (`TreeNode`) / 节点参数（`TreeNode`）
   */
  setNode(node: TreeNode): void {
    this._nodeSig.set(node);
  }

  /**
   * Gets `_node` (`TreeNode`) for backward compatibility.
   * @zh 获取 `_node`（类型：`TreeNode`），保留兼容读取器。
   */
  get _node(): TreeNode {
    return this._nodeSig() as TreeNode;
  }

  /**
   * Sets `_node` (`_node`) for backward compatibility.
   * @zh 设置 `_node`（`_node`），保留兼容写入器。
   * @param value - New _node value (`TreeNode`) / 新的节点值（`TreeNode`）
   */
  set _node(value: TreeNode) {
    this._nodeSig.set(value);
  }

  private clickListener?: (event: MouseEvent) => void;

  /**
   * Creates an instance of `TreeNodeExpanderComponent` and initializes its dependencies and internal state.
   * @zh 创建 `TreeNodeExpanderComponent` 实例，并初始化 DOM 与区域引用。
   * @param el - Injected or initial el (`ElementRef<HTMLElement>`) / 注入或传入的宿主元素引用（`ElementRef<HTMLElement>`）
   * @param ngZone - Injected or initial ng zone (`NgZone`) / 注入或传入的 Angular 区域（`NgZone`）
   */
  constructor(
    private el: ElementRef<HTMLElement>,
    private ngZone: NgZone,
  ) {}

  /**
   * Angular lifecycle hook invoked once after component or directive inputs are initialized.
   * @zh Angular 生命周期钩子：初始化展开图标点击监听。
   */
  ngOnInit(): void {
    this.clickListener = (event: MouseEvent): void => {
      const wrapper = this.el.nativeElement.querySelector('.toggle-children-wrapper');
      if (wrapper && wrapper.contains(event.target as Node)) {
        const currentNode = this.node;
        if (currentNode && currentNode.hasChildren && currentNode.mouseAction) {
          this.ngZone.run(() => {
            currentNode.mouseAction('expanderClick', event);
          });
        }
      }
    };

    this.ngZone.runOutsideAngular(() => {
      if (this.clickListener) {
        this.el.nativeElement.addEventListener('click', this.clickListener);
      }
    });
  }

  /**
   * Angular lifecycle hook invoked just before the component, directive, or service is destroyed to release subscriptions and resources.
   * @zh Angular 生命周期钩子：移除点击事件监听。
   */
  ngOnDestroy(): void {
    if (this.clickListener) {
      this.el.nativeElement.removeEventListener('click', this.clickListener);
    }
  }
}
