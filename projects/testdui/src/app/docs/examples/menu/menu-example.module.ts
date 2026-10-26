/**
 * @fileoverview Module `projects/testdui/src/app/docs/examples/menu/menu-example.module.ts` providing menu example module definitions and implementation.
 * @zh 模块文件 `projects/testdui/src/app/docs/examples/menu/menu-example.module.ts`，提供菜单example模块相关的定义与实现。
 */

import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MenuModule } from '@dotos/dui/ui/menu';
import { HighlightModule } from '@dotos/dui/ux/highlight';

/**
 * Angular component `MenuExampleComponent` (selector: 'app-menu-example') providing menu example component presentation and interaction in `projects/testdui/src/app/docs/examples/menu`.
 * @zh Angular 组件 `MenuExampleComponent`（selector: 'app-menu-example'），提供菜单Example组件的视图渲染与交互逻辑（位于 `projects/testdui/src/app/docs/examples/menu`）。
 */
@Component({
  selector: 'app-menu-example',
  template: `
    <h2>菜单栏示例</h2>
    <dui-menu-bar [items]="items"></dui-menu-bar>
    <p style="margin-top:12px;">最近点击：{{ lastAction || '（尚未点击）' }}</p>

    <h3>示例代码</h3>
    <dui-highlight [content]="exampleSource" [codeLang]="'typescript'" [copyCodeToClipboard]="true"></dui-highlight>
  `,
})
export class MenuExampleComponent {
  /**
   * Property `lastAction` (`string`) storing last action (default: `''`).
   * @zh 属性 `lastAction`（类型：`string`），用于存储或配置末尾动作（默认值：`''`）。
   */
  lastAction = '';
  /**
   * Property `items` (`any[]`) storing items.
   * @zh 属性 `items`（类型：`any[]`），用于存储或配置条目列表。
   */
  items = [
    {
      title: '文件',
      children: [
        { title: '新建', handler: () => (this.lastAction = '新建') },
        { title: '打开', handler: () => (this.lastAction = '打开') },
        { type: 'divider' },
        { title: '退出', handler: () => (this.lastAction = '退出') },
      ],
    },
    {
      title: '编辑',
      children: [
        { title: '撤销', handler: () => (this.lastAction = '撤销') },
        { title: '重做', handler: () => (this.lastAction = '重做') },
      ],
    },
  ];

  /**
   * Property `exampleSource` (`string`) storing example source.
   * @zh 属性 `exampleSource`（类型：`string`），用于存储或配置example源。
   */
  readonly exampleSource = `<dui-menu-bar [items]="items"></dui-menu-bar>

items = [
  {
    title: '文件',
    children: [
      { title: '新建', handler: () => this.newFile() },
      { title: '打开', handler: () => this.open() },
      { type: 'divider' },
      { title: '退出', handler: () => this.quit() },
    ],
  },
];`;
}

/**
 * Constant/variable `routes` defining routes in `projects/testdui/src/app/docs/examples/menu`.
 * @zh 常量/变量 `routes`，定义 `projects/testdui/src/app/docs/examples/menu` 中的routes。
 */
const routes: Routes = [{ path: '', component: MenuExampleComponent }];

/**
 * Angular module `MenuExampleModule` declaring and exporting menu example module components, directives, pipes, and providers.
 * @zh Angular 模块 `MenuExampleModule`，声明并导出菜单Example模块相关的组件、指令、管道与服务提供者。
 */
@NgModule({
  declarations: [MenuExampleComponent],
  imports: [CommonModule, MenuModule, HighlightModule, RouterModule.forChild(routes)],
})
export class MenuExampleModule {}
