/**
 * @fileoverview Module `projects/testdui/src/app/docs/examples/tree/tree-example.module.ts` providing tree example module definitions and implementation.
 * @zh 模块文件 `projects/testdui/src/app/docs/examples/tree/tree-example.module.ts`，提供树形控件example模块相关的定义与实现。
 */

import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TreeModule } from '@dotos/dui/tree';
import { TranslateModule } from '@dotos/dui/translator';
import { HighlightModule } from '@dotos/dui/ux/highlight';

/**
 * Angular component `TreeExampleComponent` (selector: 'app-tree-example') providing tree example component presentation and interaction in `projects/testdui/src/app/docs/examples/tree`.
 * @zh Angular 组件 `TreeExampleComponent`（selector: 'app-tree-example'），提供树形控件Example组件的视图渲染与交互逻辑（位于 `projects/testdui/src/app/docs/examples/tree`）。
 */
@Component({
  selector: 'app-tree-example',
  template: `
    <h2>树形视图示例</h2>
    <tree-root style="display:block; height:300px;" [nodes]="nodes"></tree-root>

    <h3>示例代码</h3>
    <dui-highlight [content]="exampleSource" [codeLang]="'typescript'" [copyCodeToClipboard]="true"></dui-highlight>
  `,
})
export class TreeExampleComponent {
  /**
   * Property `nodes` (`any[]`) storing nodes.
   * @zh 属性 `nodes`（类型：`any[]`），用于存储或配置节点列表。
   */
  nodes = [
    {
      id: 1,
      name: '根节点',
      children: [
        { id: 2, name: '子节点 A' },
        { id: 3, name: '子节点 B', children: [{ id: 4, name: '孙节点 B-1' }] },
      ],
    },
  ];

  /**
   * Property `exampleSource` (`string`) storing example source.
   * @zh 属性 `exampleSource`（类型：`string`），用于存储或配置example源。
   */
  readonly exampleSource = `<tree-root [nodes]="nodes"></tree-root>

nodes = [
  {
    id: 1,
    name: '根节点',
    children: [
      { id: 2, name: '子节点 A' },
      { id: 3, name: '子节点 B', children: [{ id: 4, name: '孙节点 B-1' }] },
    ],
  },
];`;
}

/**
 * Constant/variable `routes` defining routes in `projects/testdui/src/app/docs/examples/tree`.
 * @zh 常量/变量 `routes`，定义 `projects/testdui/src/app/docs/examples/tree` 中的routes。
 */
const routes: Routes = [{ path: '', component: TreeExampleComponent }];

/**
 * Angular module `TreeExampleModule` declaring and exporting tree example module components, directives, pipes, and providers.
 * @zh Angular 模块 `TreeExampleModule`，声明并导出树形控件Example模块相关的组件、指令、管道与服务提供者。
 */
@NgModule({
  declarations: [TreeExampleComponent],
  imports: [CommonModule, TranslateModule, TreeModule, HighlightModule, RouterModule.forChild(routes)],
})
export class TreeExampleModule {}
