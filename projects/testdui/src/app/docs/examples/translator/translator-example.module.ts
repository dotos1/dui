/**
 * @fileoverview Module `projects/testdui/src/app/docs/examples/translator/translator-example.module.ts` providing translator example module definitions and implementation.
 * @zh 模块文件 `projects/testdui/src/app/docs/examples/translator/translator-example.module.ts`，提供国际化翻译服务与管道可交互示例模块相关的定义与实现。
 */

import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { TranslateModule, TranslationService } from '@dotos/dui/translator';
import { HighlightModule } from '@dotos/dui/ux/highlight';

/**
 * Angular component `TranslatorExampleComponent` (selector: 'app-translator-example') providing live i18n language switching interaction.
 * @zh Angular 组件 `TranslatorExampleComponent`（selector: 'app-translator-example'），提供多语言切换与 `translate` 管道示例的视图渲染与交互逻辑。
 */
@Component({
  selector: 'app-translator-example',
  template: `
    <h2>国际化多语言切换示例 (TranslationService / TranslatePipe)</h2>
    <p>通过 <code>TranslationService.use()</code> 动态切换语言，模板中的 <code>| translate</code> 管道会自动重新求值：</p>

    <div style="display:flex; gap:12px; margin-bottom:16px;">
      <button mat-raised-button color="primary" (click)="switchLang('zh_CN')">简体中文 (zh_CN)</button>
      <button mat-raised-button color="accent" (click)="switchLang('en_US')">English (en_US)</button>
    </div>

    <mat-card style="margin-bottom:16px; max-width:560px;">
      <mat-card-content>
        <p><strong>当前语言 (userLang)：</strong> <code>{{ translation.userLang }}</code></p>
        <p><strong>NAV.HOME：</strong> {{ 'NAV.HOME' | translate }}</p>
        <p><strong>NAV.TUTORIAL：</strong> {{ 'NAV.TUTORIAL' | translate }}</p>
        <p><strong>HOME.TAGLINE：</strong> {{ 'HOME.TAGLINE' | translate }}</p>
      </mat-card-content>
    </mat-card>

    <h3>示例代码</h3>
    <dui-highlight [content]="exampleSource" [codeLang]="'typescript'" [copyCodeToClipboard]="true"></dui-highlight>
  `,
  standalone: false,
})
export class TranslatorExampleComponent {
  /**
   * Property `exampleSource` (`string`) storing example source code snippet.
   * @zh 属性 `exampleSource`（类型：`string`），用于存储或配置示例代码片段。
   */
  readonly exampleSource = `import { TranslationService } from '@dotos/dui/translator';

constructor(public translation: TranslationService) {}

switchLang(lang: 'zh_CN' | 'en_US'): void {
  this.translation.use(lang).subscribe();
}

// 模板中使用 translate 管道：
// <span>{{ 'HOME.TAGLINE' | translate }}</span>`;

  /**
   * Creates an instance of `TranslatorExampleComponent`.
   * @zh 创建 `TranslatorExampleComponent` 实例，并注入 `TranslationService`。
   * @param translation - Injected `TranslationService` / 注入的国际化翻译服务（`TranslationService`）
   */
  constructor(public translation: TranslationService) {}

  /**
   * Switches the active language via `TranslationService`.
   * @zh 切换当前激活的界面语言。
   * @param lang - Target locale code (`string`) / 目标语言代码（`string`）
   */
  switchLang(lang: string): void {
    this.translation.use(lang).subscribe();
  }
}

/**
 * Constant `routes` defining child routes for the translator example module.
 * @zh 常量 `routes`，定义国际化示例模块的子路由。
 */
const routes: Routes = [{ path: '', component: TranslatorExampleComponent }];

/**
 * Angular module `TranslatorExampleModule` declaring and exporting the translator interactive example.
 * @zh Angular 模块 `TranslatorExampleModule`，声明并导出国际化翻译服务可交互示例组件。
 */
@NgModule({
  declarations: [TranslatorExampleComponent],
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    TranslateModule.forChild(),
    HighlightModule,
    RouterModule.forChild(routes),
  ],
})
export class TranslatorExampleModule {}
