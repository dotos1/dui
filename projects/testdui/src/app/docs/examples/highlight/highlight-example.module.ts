/**
 * @fileoverview Module `projects/testdui/src/app/docs/examples/highlight/highlight-example.module.ts` providing syntax highlight example module definitions and implementation.
 * @zh 模块文件 `projects/testdui/src/app/docs/examples/highlight/highlight-example.module.ts`，提供代码语法高亮（`HighlightModule`）可交互示例模块相关的定义与实现。
 */

import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { HighlightModule } from '@dotos/dui/ux/highlight';

/**
 * Angular component `HighlightExampleComponent` (selector: 'app-highlight-example') providing multi-language syntax highlight demo.
 * @zh Angular 组件 `HighlightExampleComponent`（selector: 'app-highlight-example'），提供多语言代码高亮与一键复制示例组件的视图渲染与交互逻辑。
 */
@Component({
  selector: 'app-highlight-example',
  template: `
    <h2>代码语法高亮与一键复制示例 (dui-highlight)</h2>
    <div style="display:flex; gap:12px; margin-bottom:16px;">
      <button mat-stroked-button [color]="activeLang === 'typescript' ? 'primary' : undefined" (click)="selectSnippet('typescript')">
        TypeScript
      </button>
      <button mat-stroked-button [color]="activeLang === 'html' ? 'primary' : undefined" (click)="selectSnippet('html')">
        HTML
      </button>
      <button mat-stroked-button [color]="activeLang === 'json' ? 'primary' : undefined" (click)="selectSnippet('json')">
        JSON
      </button>
    </div>

    <dui-highlight
      [content]="snippets[activeLang]"
      [codeLang]="activeLang"
      [copyCodeToClipboard]="true"
      [copyCodeTooltips]="{ copy: '复制代码', copied: '已复制！' }">
    </dui-highlight>

    <h3>用法代码</h3>
    <dui-highlight [content]="usageSource" [codeLang]="'html'" [copyCodeToClipboard]="true"></dui-highlight>
  `,
  standalone: false,
})
export class HighlightExampleComponent {
  /**
   * Property `activeLang` (`'typescript' | 'html' | 'json'`) storing currently selected language tab.
   * @zh 属性 `activeLang`（类型：`'typescript' | 'html' | 'json'`），用于存储当前选中的代码语言。
   */
  activeLang: 'typescript' | 'html' | 'json' = 'typescript';

  /**
   * Property `snippets` (`Record<'typescript' | 'html' | 'json', string>`) storing sample code snippets.
   * @zh 属性 `snippets`（类型：`Record<'typescript' | 'html' | 'json', string>`），用于存储不同语言的代码片段。
   */
  readonly snippets: Record<'typescript' | 'html' | 'json', string> = {
    typescript: `import { Component } from '@angular/core';
import { ThemeService } from '@dotos/dui/theme';

@Component({ selector: 'app-demo', template: '<dui-button text="Run"></dui-button>' })
export class DemoComponent {
  constructor(private theme: ThemeService) {}
}`,
    html: `<dui-highlight
  [content]="codeSnippet"
  [codeLang]="'typescript'"
  [copyCodeToClipboard]="true">
</dui-highlight>`,
    json: `{
  "package": "@dotos/dui",
  "entryPoints": 96,
  "bilingualDocs": true
}`,
  };

  /**
   * Property `usageSource` (`string`) storing component usage snippet.
   * @zh 属性 `usageSource`（类型：`string`），用于存储组件调用示例片段。
   */
  readonly usageSource = `<dui-highlight
  [content]="snippets[activeLang]"
  [codeLang]="activeLang"
  [copyCodeToClipboard]="true"
  [copyCodeTooltips]="{ copy: '复制代码', copied: '已复制！' }">
</dui-highlight>`;

  /**
   * Switches the active code snippet language.
   * @zh 切换当前展示的代码语言类型。
   * @param lang - Language key (`'typescript' | 'html' | 'json'`) / 语言键名（`'typescript' | 'html' | 'json'`）
   */
  selectSnippet(lang: 'typescript' | 'html' | 'json'): void {
    this.activeLang = lang;
  }
}

/**
 * Constant `routes` defining child routes for the highlight example module.
 * @zh 常量 `routes`，定义代码高亮示例模块的子路由。
 */
const routes: Routes = [{ path: '', component: HighlightExampleComponent }];

/**
 * Angular module `HighlightExampleModule` declaring and exporting the highlight interactive example.
 * @zh Angular 模块 `HighlightExampleModule`，声明并导出代码高亮可交互示例组件。
 */
@NgModule({
  declarations: [HighlightExampleComponent],
  imports: [CommonModule, MatButtonModule, HighlightModule, RouterModule.forChild(routes)],
})
export class HighlightExampleModule {}
