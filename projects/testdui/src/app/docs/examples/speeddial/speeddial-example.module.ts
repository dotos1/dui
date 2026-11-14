/**
 * @fileoverview Module `projects/testdui/src/app/docs/examples/speeddial/speeddial-example.module.ts` providing speeddial example module definitions and implementation.
 * @zh 模块文件 `projects/testdui/src/app/docs/examples/speeddial/speeddial-example.module.ts`，提供speeddialexample模块相关的定义与实现。
 */

import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SpeedDialModule } from '@dotos/dui/ui/speeddial';
import { HighlightModule } from '@dotos/dui/ux/highlight';

/**
 * Angular component `SpeeddialExampleComponent` (selector: 'app-speeddial-example') providing speeddial example component presentation and interaction in `projects/testdui/src/app/docs/examples/speeddial`.
 * @zh Angular 组件 `SpeeddialExampleComponent`（selector: 'app-speeddial-example'），提供SpeeddialExample组件的视图渲染与交互逻辑（位于 `projects/testdui/src/app/docs/examples/speeddial`）。
 */
@Component({
  selector: 'app-speeddial-example',
  template: `
    <h2>速度拨号按钮示例</h2>
    <div style="position:relative; height:220px;">
      <speeddial icon="add" direction="up" [items]="items"></speeddial>
    </div>
    <p>最近选择：{{ lastAction || '（尚未点击）' }}</p>

    <h3>示例代码</h3>
    <dui-highlight [content]="exampleSource" [codeLang]="'typescript'" [copyCodeToClipboard]="true"></dui-highlight>
  `,
  standalone: false,
})
export class SpeeddialExampleComponent {
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
    { icon: 'edit', title: '编辑', handler: () => (this.lastAction = '编辑') },
    { icon: 'share', title: '分享', handler: () => (this.lastAction = '分享') },
    { icon: 'delete', title: '删除', handler: () => (this.lastAction = '删除') },
  ];

  /**
   * Property `exampleSource` (`string`) storing example source.
   * @zh 属性 `exampleSource`（类型：`string`），用于存储或配置example源。
   */
  readonly exampleSource = `<speeddial icon="add" direction="up" [items]="items"></speeddial>

items = [
  { icon: 'edit', title: '编辑', handler: () => this.edit() },
  { icon: 'share', title: '分享', handler: () => this.share() },
  { icon: 'delete', title: '删除', handler: () => this.remove() },
];`;
}

/**
 * Constant/variable `routes` defining routes in `projects/testdui/src/app/docs/examples/speeddial`.
 * @zh 常量/变量 `routes`，定义 `projects/testdui/src/app/docs/examples/speeddial` 中的routes。
 */
const routes: Routes = [{ path: '', component: SpeeddialExampleComponent }];

/**
 * Angular module `SpeeddialExampleModule` declaring and exporting speeddial example module components, directives, pipes, and providers.
 * @zh Angular 模块 `SpeeddialExampleModule`，声明并导出SpeeddialExample模块相关的组件、指令、管道与服务提供者。
 */
@NgModule({
  declarations: [SpeeddialExampleComponent],
  imports: [CommonModule, SpeedDialModule, HighlightModule, RouterModule.forChild(routes)],
})
export class SpeeddialExampleModule {}
