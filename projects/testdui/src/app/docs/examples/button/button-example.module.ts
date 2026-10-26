/**
 * @fileoverview Module `projects/testdui/src/app/docs/examples/button/button-example.module.ts` providing button example module definitions and implementation.
 * @zh 模块文件 `projects/testdui/src/app/docs/examples/button/button-example.module.ts`，提供按钮example模块相关的定义与实现。
 */

import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ButtonModule } from '@dotos/dui/ui/button';
import { HighlightModule } from '@dotos/dui/ux/highlight';

/**
 * Angular component `ButtonExampleComponent` (selector: 'app-button-example') providing button example component presentation and interaction in `projects/testdui/src/app/docs/examples/button`.
 * @zh Angular 组件 `ButtonExampleComponent`（selector: 'app-button-example'），提供按钮Example组件的视图渲染与交互逻辑（位于 `projects/testdui/src/app/docs/examples/button`）。
 */
@Component({
  selector: 'app-button-example',
  template: `
    <h2>按钮示例</h2>
    <div style="display:flex; gap:16px; align-items:center; margin-bottom:16px;">
      <dui-button type="mat-raised-button" color="primary" text="主要按钮" (click)="log('主要按钮')"></dui-button>
      <dui-button type="mat-button" text="文本按钮" (click)="log('文本按钮')"></dui-button>
      <dui-button type="mat-icon-button" icon="favorite" (click)="log('图标按钮')"></dui-button>
    </div>
    <p>最近点击：{{ lastClicked || '（尚未点击）' }}</p>

    <h3>示例代码</h3>
    <dui-highlight [content]="exampleSource" [codeLang]="'html'" [copyCodeToClipboard]="true"></dui-highlight>
  `,
})
export class ButtonExampleComponent {
  /**
   * Property `lastClicked` (`string`) storing last clicked (default: `''`).
   * @zh 属性 `lastClicked`（类型：`string`），用于存储或配置末尾点击（默认值：`''`）。
   */
  lastClicked = '';

  /**
   * Property `exampleSource` (`string`) storing example source.
   * @zh 属性 `exampleSource`（类型：`string`），用于存储或配置example源。
   */
  readonly exampleSource = `<dui-button type="mat-raised-button" color="primary" text="主要按钮" (click)="log('主要按钮')"></dui-button>
<dui-button type="mat-button" text="文本按钮" (click)="log('文本按钮')"></dui-button>
<dui-button type="mat-icon-button" icon="favorite" (click)="log('图标按钮')"></dui-button>`;

  /**
   * Executes `log` to handle log.
   * @zh 执行 `log`，用于日志。
   * @param label - label parameter (`string`) / 标签参数（`string`）
   */
  log(label: string): void {
    this.lastClicked = label;
  }
}

/**
 * Constant/variable `routes` defining routes in `projects/testdui/src/app/docs/examples/button`.
 * @zh 常量/变量 `routes`，定义 `projects/testdui/src/app/docs/examples/button` 中的routes。
 */
const routes: Routes = [{ path: '', component: ButtonExampleComponent }];

/**
 * Angular module `ButtonExampleModule` declaring and exporting button example module components, directives, pipes, and providers.
 * @zh Angular 模块 `ButtonExampleModule`，声明并导出按钮Example模块相关的组件、指令、管道与服务提供者。
 */
@NgModule({
  declarations: [ButtonExampleComponent],
  imports: [CommonModule, ButtonModule, HighlightModule, RouterModule.forChild(routes)],
})
export class ButtonExampleModule {}
