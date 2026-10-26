/**
 * @fileoverview Module `projects/testdui/src/app/docs/examples/container/container-example.module.ts` providing container example module definitions and implementation.
 * @zh 模块文件 `projects/testdui/src/app/docs/examples/container/container-example.module.ts`，提供容器example模块相关的定义与实现。
 */

import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PanelModule, DuiTabsModule } from '@dotos/dui/container';
import { HighlightModule } from '@dotos/dui/ux/highlight';

/**
 * Angular component `ContainerExampleComponent` (selector: 'app-container-example') providing container example component presentation and interaction in `projects/testdui/src/app/docs/examples/container`.
 * @zh Angular 组件 `ContainerExampleComponent`（selector: 'app-container-example'），提供容器Example组件的视图渲染与交互逻辑（位于 `projects/testdui/src/app/docs/examples/container`）。
 */
@Component({
  selector: 'app-container-example',
  template: `
    <h2>面板 / 标签页示例</h2>
    <tabpanel style="display:block; height:280px;" [config]="config"></tabpanel>

    <h3>示例代码</h3>
    <dui-highlight [content]="exampleSource" [codeLang]="'typescript'" [copyCodeToClipboard]="true"></dui-highlight>
  `,
})
export class ContainerExampleComponent {
  /**
   * Property `config` (`any`) storing config.
   * @zh 属性 `config`（类型：`any`），用于存储或配置配置。
   */
  config = {
    items: [
      { xtype: 'panel', titile: '标签一', html: '<p style="padding:12px;">第一个标签页的内容。</p>' },
      { xtype: 'panel', titile: '标签二', html: '<p style="padding:12px;">第二个标签页的内容。</p>' },
      { xtype: 'panel', titile: '标签三', html: '<p style="padding:12px;">第三个标签页的内容。</p>' },
    ],
  };

  /**
   * Property `exampleSource` (`string`) storing example source.
   * @zh 属性 `exampleSource`（类型：`string`），用于存储或配置example源。
   */
  readonly exampleSource = `<tabpanel [config]="config"></tabpanel>

config = {
  items: [
    { xtype: 'panel', titile: '标签一', html: '...' },
    { xtype: 'panel', titile: '标签二', html: '...' },
  ],
};`;
}

/**
 * Constant/variable `routes` defining routes in `projects/testdui/src/app/docs/examples/container`.
 * @zh 常量/变量 `routes`，定义 `projects/testdui/src/app/docs/examples/container` 中的routes。
 */
const routes: Routes = [{ path: '', component: ContainerExampleComponent }];

/**
 * Angular module `ContainerExampleModule` declaring and exporting container example module components, directives, pipes, and providers.
 * @zh Angular 模块 `ContainerExampleModule`，声明并导出容器Example模块相关的组件、指令、管道与服务提供者。
 */
@NgModule({
  declarations: [ContainerExampleComponent],
  imports: [CommonModule, PanelModule, DuiTabsModule, HighlightModule, RouterModule.forChild(routes)],
})
export class ContainerExampleModule {}
