/**
 * @fileoverview Module `src/tree/components/tree-node-wrapper.component.ts` providing Signal-backed tree node wrapper component.
 * @zh 模块文件 `src/tree/components/tree-node-wrapper.component.ts`，提供基于原生 Angular Signal 的树节点包裹行组件实现（零 MobX 依赖）。
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
import { TreeNodeTemplates } from '../defs/tree-node-templates';

/**
 * Angular component `TreeNodeWrapperComponent` (selector: 'tree-node-wrapper') providing tree node wrapper presentation and interaction in `src/tree/components`.
 * @zh Angular 组件 `TreeNodeWrapperComponent`（selector: 'tree-node-wrapper'），提供树形控件节点包裹行渲染及鼠标动作派发。
 */
@Component({
  selector: 'tree-node-wrapper',
  encapsulation: ViewEncapsulation.None,
  styles: [],
  templateUrl: 'tree-node-wrapper.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    hostID: 'tree-node-wrapper' + Math.random().toString(36).substring(2, 15),
  },
  standalone: false,
})
export class TreeNodeWrapperComponent implements OnInit, OnDestroy {
  // 私有 Signal 追踪输入节点引用
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

  /**
   * Input property `index` (`number`) configuring sibling index.
   * @zh 输入属性 `index`（类型：`number`），配置节点在当前集合中的索引。
   */
  @Input() index = 0;

  /**
   * Input property `templates` (`TreeNodeTemplates`) configuring custom node templates.
   * @zh 输入属性 `templates`（类型：`TreeNodeTemplates`），配置树节点自定义模板集合。
   */
  @Input() templates!: TreeNodeTemplates;

  private cleanupListeners: Array<() => void> = [];

  /**
   * Creates an instance of `TreeNodeWrapperComponent` and initializes its dependencies and internal state.
   * @zh 创建 `TreeNodeWrapperComponent` 实例，并初始化 DOM 与区域引用。
   * @param el - Injected or initial el (`ElementRef<HTMLElement>`) / 注入或传入的宿主元素引用（`ElementRef<HTMLElement>`）
   * @param ngZone - Injected or initial ng zone (`NgZone`) / 注入或传入的 Angular 区域（`NgZone`）
   */
  constructor(
    private el: ElementRef<HTMLElement>,
    private ngZone: NgZone,
  ) {}

  /**
   * Angular lifecycle hook invoked once after component or directive inputs are initialized.
   * @zh Angular 生命周期钩子：绑定行级点击、双击、右键菜单及悬停事件。
   */
  ngOnInit(): void {
    this.ngZone.runOutsideAngular(() => {
      const nativeEl = this.el.nativeElement;
      const createHandler = (actionName: string, runInZone: boolean) => (event: MouseEvent): void => {
        const wrapper = nativeEl.querySelector('.node-content-wrapper');
        if (wrapper && wrapper.contains(event.target as Node)) {
          const currentNode = this.node;
          if (currentNode && currentNode.mouseAction) {
            if (runInZone) {
              setTimeout(() => {
                this.ngZone.run(() => {
                  currentNode.mouseAction(actionName, event);
                });
              }, 0);
            } else {
              currentNode.mouseAction(actionName, event);
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

      this.cleanupListeners = [
        (): void => nativeEl.removeEventListener('click', clickHandler),
        (): void => nativeEl.removeEventListener('dblclick', dblClickHandler),
        (): void => nativeEl.removeEventListener('contextmenu', contextMenuHandler),
        (): void => nativeEl.removeEventListener('mouseover', mouseOverHandler),
        (): void => nativeEl.removeEventListener('mouseout', mouseOutHandler),
      ];
    });
  }

  /**
   * Angular lifecycle hook invoked just before the component, directive, or service is destroyed to release subscriptions and resources.
   * @zh Angular 生命周期钩子：卸载所有原生鼠标事件监听器。
   */
  ngOnDestroy(): void {
    this.cleanupListeners.forEach((cleanup: () => void) => cleanup());
    this.cleanupListeners = [];
  }
}
