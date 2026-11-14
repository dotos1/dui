/**
 * @fileoverview Module `src/tree/components/loading.component.ts` providing loading component definitions and implementation.
 * @zh 模块文件 `src/tree/components/loading.component.ts`，提供加载中组件相关的定义与实现。
 */

import { ChangeDetectionStrategy, Component, Input, TemplateRef, ViewEncapsulation } from '@angular/core';
import { TreeNode } from '../models/tree-node.model';

/**
 * Angular component `LoadingComponent` (selector: 'tree-loading-component') providing loading component presentation and interaction in `src/tree/components`.
 * @zh Angular 组件 `LoadingComponent`（selector: 'tree-loading-component'），提供加载中组件的视图渲染与交互逻辑（位于 `src/tree/components`）。
 */
@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'tree-loading-component',
  templateUrl: 'loading.component.html',
  host: {
    hostID: 'tree-loading-component' + Math.random().toString(36).substring(2, 15)
  },
  standalone: false
})
export class LoadingComponent {
  /**
   * Input property `template` (`TemplateRef<unknown>`) configuring template.
   * @zh 输入属性 `template`（类型：`TemplateRef<unknown>`），用于配置模板。
   */
  @Input() template: TemplateRef<unknown>;
  /**
   * Input property `node` (`TreeNode`) configuring node.
   * @zh 输入属性 `node`（类型：`TreeNode`），用于配置节点。
   */
  @Input() node: TreeNode;
}
