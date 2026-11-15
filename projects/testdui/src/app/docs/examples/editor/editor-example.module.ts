/**
 * @fileoverview Module `projects/testdui/src/app/docs/examples/editor/editor-example.module.ts` providing editor example module definitions and implementation.
 * @zh 模块文件 `projects/testdui/src/app/docs/examples/editor/editor-example.module.ts`，提供编辑器example模块相关的定义与实现。
 */

import { CommonModule } from '@angular/common';
import { Component, NgModule, ChangeDetectionStrategy } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Editor, EditorModule } from '@dotos/dui/ux/editor';
import { HighlightModule } from '@dotos/dui/ux/highlight';

/**
 * Angular component `EditorExampleComponent` (selector: 'app-editor-example') providing editor example component presentation and interaction in `projects/testdui/src/app/docs/examples/editor`.
 * @zh Angular 组件 `EditorExampleComponent`（selector: 'app-editor-example'），提供编辑器Example组件的视图渲染与交互逻辑（位于 `projects/testdui/src/app/docs/examples/editor`）。
 */
@Component({
  selector: 'app-editor-example',
  template: `
    <h2>富文本编辑器示例</h2>
    <dui-editor [editor]="editor" style="display:block; border:1px solid rgba(0,0,0,.1); min-height:200px;"></dui-editor>

    <h3>示例代码</h3>
    <dui-highlight [content]="exampleSource" [codeLang]="'typescript'" [copyCodeToClipboard]="true"></dui-highlight>
  `,
  standalone: false,
  changeDetection: ChangeDetectionStrategy.Default,
})
export class EditorExampleComponent {
  /**
   * Property `editor` (`Editor`) storing editor.
   * @zh 属性 `editor`（类型：`Editor`），用于存储或配置编辑器。
   */
  editor = new Editor({ content: '<p>在这里输入 <strong>富文本</strong> 内容。</p>' } as any);

  /**
   * Property `exampleSource` (`string`) storing example source.
   * @zh 属性 `exampleSource`（类型：`string`），用于存储或配置example源。
   */
  readonly exampleSource = `<dui-editor [editor]="editor"></dui-editor>

editor = new Editor({ content: '<p>在这里输入 <strong>富文本</strong> 内容。</p>' });`;
}

/**
 * Constant/variable `routes` defining routes in `projects/testdui/src/app/docs/examples/editor`.
 * @zh 常量/变量 `routes`，定义 `projects/testdui/src/app/docs/examples/editor` 中的routes。
 */
const routes: Routes = [{ path: '', component: EditorExampleComponent }];

/**
 * Angular module `EditorExampleModule` declaring and exporting editor example module components, directives, pipes, and providers.
 * @zh Angular 模块 `EditorExampleModule`，声明并导出编辑器Example模块相关的组件、指令、管道与服务提供者。
 */
@NgModule({
  declarations: [EditorExampleComponent],
  imports: [CommonModule, EditorModule.forRoot(), HighlightModule, RouterModule.forChild(routes)],
})
export class EditorExampleModule {}
