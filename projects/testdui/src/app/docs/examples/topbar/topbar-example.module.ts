/**
 * @fileoverview Module `projects/testdui/src/app/docs/examples/topbar/topbar-example.module.ts` providing topbar example module definitions and implementation.
 * @zh 模块文件 `projects/testdui/src/app/docs/examples/topbar/topbar-example.module.ts`，提供顶栏example模块相关的定义与实现。
 */

import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TopbarModule } from '@dotos/dui/ui/topbar';
import { HighlightModule } from '@dotos/dui/ux/highlight';

/**
 * Angular component `TopbarExampleComponent` (selector: 'app-topbar-example') providing topbar example component presentation and interaction in `projects/testdui/src/app/docs/examples/topbar`.
 * @zh Angular 组件 `TopbarExampleComponent`（selector: 'app-topbar-example'），提供顶栏Example组件的视图渲染与交互逻辑（位于 `projects/testdui/src/app/docs/examples/topbar`）。
 */
@Component({
  selector: 'app-topbar-example',
  template: `
    <h2>顶部工具栏示例</h2>
    <dui-topbar title="示例标题" color="primary" style="display:block; border-radius:4px; overflow:hidden;">
      <span style="flex:1 1 auto"></span>
      <span>右侧内容</span>
    </dui-topbar>

    <h3>示例代码</h3>
    <dui-highlight [content]="exampleSource" [codeLang]="'html'" [copyCodeToClipboard]="true"></dui-highlight>
  `,
  standalone: false,
})
export class TopbarExampleComponent {
  /**
   * Property `exampleSource` (`string`) storing example source.
   * @zh 属性 `exampleSource`（类型：`string`），用于存储或配置example源。
   */
  readonly exampleSource = `<dui-topbar title="示例标题" color="primary">
  <span style="flex:1 1 auto"></span>
  <span>右侧内容</span>
</dui-topbar>`;
}

/**
 * Constant/variable `routes` defining routes in `projects/testdui/src/app/docs/examples/topbar`.
 * @zh 常量/变量 `routes`，定义 `projects/testdui/src/app/docs/examples/topbar` 中的routes。
 */
const routes: Routes = [{ path: '', component: TopbarExampleComponent }];

/**
 * Angular module `TopbarExampleModule` declaring and exporting topbar example module components, directives, pipes, and providers.
 * @zh Angular 模块 `TopbarExampleModule`，声明并导出顶栏Example模块相关的组件、指令、管道与服务提供者。
 */
@NgModule({
  declarations: [TopbarExampleComponent],
  imports: [CommonModule, TopbarModule, HighlightModule, RouterModule.forChild(routes)],
})
export class TopbarExampleModule {}
