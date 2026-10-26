/**
 * @fileoverview Module `projects/testdui/src/app/docs/examples/collapsible/collapsible-example.module.ts` providing collapsible example module definitions and implementation.
 * @zh 模块文件 `projects/testdui/src/app/docs/examples/collapsible/collapsible-example.module.ts`，提供可折叠面板example模块相关的定义与实现。
 */

import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CollapsibleModule } from '@dotos/dui/common/collapsible';
import { HighlightModule } from '@dotos/dui/ux/highlight';

/**
 * Angular component `CollapsibleExampleComponent` (selector: 'app-collapsible-example') providing collapsible example component presentation and interaction in `projects/testdui/src/app/docs/examples/collapsible`.
 * @zh Angular 组件 `CollapsibleExampleComponent`（selector: 'app-collapsible-example'），提供可折叠面板Example组件的视图渲染与交互逻辑（位于 `projects/testdui/src/app/docs/examples/collapsible`）。
 */
@Component({
  selector: 'app-collapsible-example',
  template: `
    <h2>折叠面板示例</h2>
    <p>点击标题右侧的箭头图标展开/收起内容：</p>
    <dui-collapsible title="点击这里展开/收起" style="display:block; border:1px solid rgba(0,0,0,.1); border-radius:4px;">
      <div style="padding: 12px;">这里是可折叠的内容区域。</div>
    </dui-collapsible>

    <h3>示例代码</h3>
    <dui-highlight [content]="exampleSource" [codeLang]="'html'" [copyCodeToClipboard]="true"></dui-highlight>
  `,
})
export class CollapsibleExampleComponent {
  /**
   * Property `exampleSource` (`string`) storing example source.
   * @zh 属性 `exampleSource`（类型：`string`），用于存储或配置example源。
   */
  readonly exampleSource = `<dui-collapsible title="点击这里展开/收起">
  <div>这里是可折叠的内容区域。</div>
</dui-collapsible>`;
}

/**
 * Constant/variable `routes` defining routes in `projects/testdui/src/app/docs/examples/collapsible`.
 * @zh 常量/变量 `routes`，定义 `projects/testdui/src/app/docs/examples/collapsible` 中的routes。
 */
const routes: Routes = [{ path: '', component: CollapsibleExampleComponent }];

/**
 * Angular module `CollapsibleExampleModule` declaring and exporting collapsible example module components, directives, pipes, and providers.
 * @zh Angular 模块 `CollapsibleExampleModule`，声明并导出可折叠面板Example模块相关的组件、指令、管道与服务提供者。
 */
@NgModule({
  declarations: [CollapsibleExampleComponent],
  imports: [CommonModule, CollapsibleModule, HighlightModule, RouterModule.forChild(routes)],
})
export class CollapsibleExampleModule {}
