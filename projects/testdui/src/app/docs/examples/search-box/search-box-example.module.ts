/**
 * @fileoverview Module `projects/testdui/src/app/docs/examples/search-box/search-box-example.module.ts` providing search box example module definitions and implementation.
 * @zh 模块文件 `projects/testdui/src/app/docs/examples/search-box/search-box-example.module.ts`，提供搜索盒子容器example模块相关的定义与实现。
 */

import { CommonModule } from '@angular/common';
import { Component, NgModule, ChangeDetectionStrategy } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SearchBoxModule } from '@dotos/dui/common/search-box';
import { HighlightModule } from '@dotos/dui/ux/highlight';

/**
 * Angular component `SearchBoxExampleComponent` (selector: 'app-search-box-example') providing search box example component presentation and interaction in `projects/testdui/src/app/docs/examples/search-box`.
 * @zh Angular 组件 `SearchBoxExampleComponent`（selector: 'app-search-box-example'），提供搜索盒子容器Example组件的视图渲染与交互逻辑（位于 `projects/testdui/src/app/docs/examples/search-box`）。
 */
@Component({
  selector: 'app-search-box-example',
  template: `
    <h2>搜索框示例</h2>
    <search-box style="display:block; max-width:320px;" placeholder="输入关键字搜索..."
      (onSearch)="lastSearch = $event" (onClear)="lastSearch = ''"></search-box>
    <p style="margin-top:12px;">当前搜索词：{{ lastSearch || '（空）' }}</p>

    <h3>示例代码</h3>
    <dui-highlight [content]="exampleSource" [codeLang]="'html'" [copyCodeToClipboard]="true"></dui-highlight>
  `,
  standalone: false,
  changeDetection: ChangeDetectionStrategy.Default,
})
export class SearchBoxExampleComponent {
  /**
   * Property `lastSearch` (`string`) storing last search (default: `''`).
   * @zh 属性 `lastSearch`（类型：`string`），用于存储或配置末尾搜索（默认值：`''`）。
   */
  lastSearch = '';

  /**
   * Property `exampleSource` (`string`) storing example source.
   * @zh 属性 `exampleSource`（类型：`string`），用于存储或配置example源。
   */
  readonly exampleSource = `<search-box placeholder="输入关键字搜索..."
  (onSearch)="onSearch($event)" (onClear)="onClear()"></search-box>`;
}

/**
 * Constant/variable `routes` defining routes in `projects/testdui/src/app/docs/examples/search-box`.
 * @zh 常量/变量 `routes`，定义 `projects/testdui/src/app/docs/examples/search-box` 中的routes。
 */
const routes: Routes = [{ path: '', component: SearchBoxExampleComponent }];

/**
 * Angular module `SearchBoxExampleModule` declaring and exporting search box example module components, directives, pipes, and providers.
 * @zh Angular 模块 `SearchBoxExampleModule`，声明并导出搜索盒子容器Example模块相关的组件、指令、管道与服务提供者。
 */
@NgModule({
  declarations: [SearchBoxExampleComponent],
  imports: [CommonModule, SearchBoxModule, HighlightModule, RouterModule.forChild(routes)],
})
export class SearchBoxExampleModule {}
