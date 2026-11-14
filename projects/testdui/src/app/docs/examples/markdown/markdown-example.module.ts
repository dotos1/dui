/**
 * @fileoverview Module `projects/testdui/src/app/docs/examples/markdown/markdown-example.module.ts` providing markdown example module definitions and implementation.
 * @zh 模块文件 `projects/testdui/src/app/docs/examples/markdown/markdown-example.module.ts`，提供Markdown文档example模块相关的定义与实现。
 */

import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MarkdownModule } from '@dotos/dui/ux/markdown';
import { HighlightModule } from '@dotos/dui/ux/highlight';

/**
 * Angular component `MarkdownExampleComponent` (selector: 'app-markdown-example') providing markdown example component presentation and interaction in `projects/testdui/src/app/docs/examples/markdown`.
 * @zh Angular 组件 `MarkdownExampleComponent`（selector: 'app-markdown-example'），提供Markdown文档Example组件的视图渲染与交互逻辑（位于 `projects/testdui/src/app/docs/examples/markdown`）。
 */
@Component({
  selector: 'app-markdown-example',
  template: `
    <h2>Markdown 渲染示例</h2>
    <dui-markdown [content]="content"></dui-markdown>

    <h3>示例代码</h3>
    <dui-highlight [content]="exampleSource" [codeLang]="'typescript'" [copyCodeToClipboard]="true"></dui-highlight>
  `,
  standalone: false,
})
export class MarkdownExampleComponent {
  /**
   * Property `content` (`any`) storing content.
   * @zh 属性 `content`（类型：`any`），用于存储或配置内容。
   */
  content = [
    '# 标题一',
    '',
    '这是一段 **加粗** 和 *斜体* 文字，还有一个 [链接](https://angular.dev)。',
    '',
    '```typescript',
    "const hello = 'world';",
    '```',
    '',
    '- 列表项一',
    '- 列表项二',
  ].join('\n');

  /**
   * Property `exampleSource` (`string`) storing example source.
   * @zh 属性 `exampleSource`（类型：`string`），用于存储或配置example源。
   */
  readonly exampleSource = `<dui-markdown [content]="content"></dui-markdown>

content = '# 标题一\\n\\n这是一段 **加粗** 文字，还有一个 [链接](https://angular.dev)。';`;
}

/**
 * Constant/variable `routes` defining routes in `projects/testdui/src/app/docs/examples/markdown`.
 * @zh 常量/变量 `routes`，定义 `projects/testdui/src/app/docs/examples/markdown` 中的routes。
 */
const routes: Routes = [{ path: '', component: MarkdownExampleComponent }];

/**
 * Angular module `MarkdownExampleModule` declaring and exporting markdown example module components, directives, pipes, and providers.
 * @zh Angular 模块 `MarkdownExampleModule`，声明并导出Markdown文档Example模块相关的组件、指令、管道与服务提供者。
 */
@NgModule({
  declarations: [MarkdownExampleComponent],
  imports: [CommonModule, MarkdownModule, HighlightModule, RouterModule.forChild(routes)],
})
export class MarkdownExampleModule {}
