/**
 * @fileoverview Module `projects/testdui/src/app/docs/examples/monaco-editor/monaco-editor-example.module.ts` providing monaco editor example module definitions and implementation.
 * @zh 模块文件 `projects/testdui/src/app/docs/examples/monaco-editor/monaco-editor-example.module.ts`，提供Monaco编辑器编辑器example模块相关的定义与实现。
 */

import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { MonacoEditorModule } from '@dotos/dui/ux/monaco-editor';
import { HighlightModule } from '@dotos/dui/ux/highlight';

/**
 * Angular component `MonacoEditorExampleComponent` (selector: 'app-monaco-editor-example') providing monaco editor example component presentation and interaction in `projects/testdui/src/app/docs/examples/monaco-editor`.
 * @zh Angular 组件 `MonacoEditorExampleComponent`（selector: 'app-monaco-editor-example'），提供Monaco编辑器编辑器Example组件的视图渲染与交互逻辑（位于 `projects/testdui/src/app/docs/examples/monaco-editor`）。
 */
@Component({
  selector: 'app-monaco-editor-example',
  template: `
    <h2>代码编辑器示例（Monaco）</h2>
    <monaco-editor style="display:block; height:300px;"
      [options]="{ language: 'json', theme: 'vs-dark' }"
      [(ngModel)]="code"></monaco-editor>

    <h3>示例代码</h3>
    <dui-highlight [content]="exampleSource" [codeLang]="'html'" [copyCodeToClipboard]="true"></dui-highlight>
  `,
})
export class MonacoEditorExampleComponent {
  /**
   * Property `code` (`string`) storing code (default: `'{\n "hello": "world"\n}'`).
   * @zh 属性 `code`（类型：`string`），用于存储或配置编码（默认值：`'{\n "hello": "world"\n}'`）。
   */
  code = '{\n  "hello": "world"\n}';

  /**
   * Property `exampleSource` (`string`) storing example source.
   * @zh 属性 `exampleSource`（类型：`string`），用于存储或配置example源。
   */
  readonly exampleSource = `<monaco-editor
  [options]="{ language: 'json', theme: 'vs-dark' }"
  [(ngModel)]="code"></monaco-editor>`;
}

/**
 * Constant/variable `routes` defining routes in `projects/testdui/src/app/docs/examples/monaco-editor`.
 * @zh 常量/变量 `routes`，定义 `projects/testdui/src/app/docs/examples/monaco-editor` 中的routes。
 */
const routes: Routes = [{ path: '', component: MonacoEditorExampleComponent }];

/**
 * Angular module `MonacoEditorExampleModule` declaring and exporting monaco editor example module components, directives, pipes, and providers.
 * @zh Angular 模块 `MonacoEditorExampleModule`，声明并导出Monaco编辑器编辑器Example模块相关的组件、指令、管道与服务提供者。
 */
@NgModule({
  declarations: [MonacoEditorExampleComponent],
  imports: [CommonModule, FormsModule, MonacoEditorModule.forRoot({}), HighlightModule, RouterModule.forChild(routes)],
})
export class MonacoEditorExampleModule {}
