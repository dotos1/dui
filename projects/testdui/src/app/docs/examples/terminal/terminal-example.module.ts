/**
 * @fileoverview Module `projects/testdui/src/app/docs/examples/terminal/terminal-example.module.ts` providing terminal example module definitions and implementation.
 * @zh 模块文件 `projects/testdui/src/app/docs/examples/terminal/terminal-example.module.ts`，提供终端example模块相关的定义与实现。
 */

import { CommonModule } from '@angular/common';
import { Component, NgModule, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TerminalModule, TerminalComponent } from '@dotos1/dui/ux/terminal';
import { HighlightModule } from '@dotos1/dui/ux/highlight';

/**
 * Angular component `TerminalExampleComponent` (selector: 'app-terminal-example') providing terminal example component presentation and interaction in `projects/testdui/src/app/docs/examples/terminal`.
 * @zh Angular 组件 `TerminalExampleComponent`（selector: 'app-terminal-example'），提供终端Example组件的视图渲染与交互逻辑（位于 `projects/testdui/src/app/docs/examples/terminal`）。
 */
@Component({
  selector: 'app-terminal-example',
  template: `
    <h2>终端示例</h2>
    <p>这是一个本地回显终端（不连接真实后端），输入任意字符会直接显示在终端里。</p>
    <div style="width:100%; max-width:600px; height:300px;">
      <dui-terminal #term (keyInput)="onInput($event)"></dui-terminal>
    </div>

    <h3>示例代码</h3>
    <dui-highlight [content]="exampleSource" [codeLang]="'typescript'" [copyCodeToClipboard]="true"></dui-highlight>
  `,
  standalone: false,
  changeDetection: ChangeDetectionStrategy.Default,
})
export class TerminalExampleComponent {
  /**
   * Template/content query reference `term` (`@ViewChild`) targeting term.
   * @zh 模板/内容视图查询引用 `term`（`@ViewChild`），指向term。
   */
  @ViewChild('term') term!: TerminalComponent;

  /**
   * Property `exampleSource` (`string`) storing example source.
   * @zh 属性 `exampleSource`（类型：`string`），用于存储或配置example源。
   */
  readonly exampleSource = `<dui-terminal #term (keyInput)="onInput($event)"></dui-terminal>

@ViewChild('term') term!: TerminalComponent;

onInput(char: string): void {
  this.term.write(char);
}`;

  /**
   * Executes `onInput` to handle on input.
   * @zh 执行 `onInput`，用于当输入属性。
   * @param char - char parameter (`string`) / 字符参数（`string`）
   */
  onInput(char: string): void {
    this.term.write(char);
  }
}

/**
 * Constant/variable `routes` defining routes in `projects/testdui/src/app/docs/examples/terminal`.
 * @zh 常量/变量 `routes`，定义 `projects/testdui/src/app/docs/examples/terminal` 中的routes。
 */
const routes: Routes = [{ path: '', component: TerminalExampleComponent }];

/**
 * Angular module `TerminalExampleModule` declaring and exporting terminal example module components, directives, pipes, and providers.
 * @zh Angular 模块 `TerminalExampleModule`，声明并导出终端Example模块相关的组件、指令、管道与服务提供者。
 */
@NgModule({
  declarations: [TerminalExampleComponent],
  imports: [CommonModule, TerminalModule, HighlightModule, RouterModule.forChild(routes)],
})
export class TerminalExampleModule {}
