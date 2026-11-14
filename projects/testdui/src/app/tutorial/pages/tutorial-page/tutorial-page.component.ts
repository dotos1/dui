/**
 * @fileoverview Module `projects/testdui/src/app/tutorial/pages/tutorial-page/tutorial-page.component.ts` providing tutorial page component definitions and implementation.
 * @zh 模块文件 `projects/testdui/src/app/tutorial/pages/tutorial-page/tutorial-page.component.ts`，提供tutorial页面组件相关的定义与实现。
 */

import { Component } from '@angular/core';

/**
 * Angular component `TutorialPageComponent` (selector: 'app-tutorial-page') providing tutorial page component presentation and interaction in `projects/testdui/src/app/tutorial/pages/tutorial-page`.
 * @zh Angular 组件 `TutorialPageComponent`（selector: 'app-tutorial-page'），提供Tutorial页面组件的视图渲染与交互逻辑（位于 `projects/testdui/src/app/tutorial/pages/tutorial-page`）。
 */
@Component({
  selector: 'app-tutorial-page',
  templateUrl: './tutorial-page.component.html',
  styleUrls: ['./tutorial-page.component.scss'],
  standalone: false,
})
export class TutorialPageComponent {
  /**
   * Property `installSnippet` (`string`) storing install snippet.
   * @zh 属性 `installSnippet`（类型：`string`），用于存储或配置installSnippet。
   */
  readonly installSnippet = `# npm
npm install @dotos/dui

# yarn
yarn add @dotos/dui`;

  /**
   * Property `peerDepsSnippet` (`string`) storing peer deps snippet.
   * @zh 属性 `peerDepsSnippet`（类型：`string`），用于存储或配置peerDepsSnippet。
   */
  readonly peerDepsSnippet = `npm install @angular/animations @angular/cdk @angular/material`;

  /**
   * Property `appModuleSnippet` (`string`) storing app module snippet.
   * @zh 属性 `appModuleSnippet`（类型：`string`），用于存储或配置app模块Snippet。
   */
  readonly appModuleSnippet = `import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@dotos/dui/translator';
import { DotosConfigModule, dotosConfig } from '@dotos/dui/theme';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    TranslateModule.forRoot(),
    DotosConfigModule.forRoot(dotosConfig),
  ],
})
export class AppModule {}`;

  /**
   * Property `featureModuleSnippet` (`string`) storing feature module snippet.
   * @zh 属性 `featureModuleSnippet`（类型：`string`），用于存储或配置feature模块Snippet。
   */
  readonly featureModuleSnippet = `import { ButtonModule } from '@dotos/dui/ui/button';
import { DatatableModule } from '@dotos/dui/data/datatable';

@NgModule({
  imports: [ButtonModule, DatatableModule],
})
export class FeatureModule {}`;

  /**
   * Property `usageSnippet` (`string`) storing usage snippet.
   * @zh 属性 `usageSnippet`（类型：`string`），用于存储或配置usageSnippet。
   */
  readonly usageSnippet = `<dui-button [config]="{ text: '提交', type: 'raised', color: 'primary' }"
            (onClick)="submit()"></dui-button>`;

  /**
   * Property `i18nSnippet` (`string`) storing i18n snippet.
   * @zh 属性 `i18nSnippet`（类型：`string`），用于存储或配置国际化Snippet。
   */
  readonly i18nSnippet = `constructor(private translation: TranslationService) {
  // register this module's own translation folder (zh_CN / en_US built in)
  this.translation.addTranslationFolder('dui', 'i18n');
}

// switch language
this.translation.use('en_US');`;

  /**
   * Property `themeSnippet` (`string`) storing theme snippet.
   * @zh 属性 `themeSnippet`（类型：`string`），用于存储或配置主题Snippet。
   */
  readonly themeSnippet = `constructor(private themeService: ThemeService) {}

// primary, accent, warn accept any hex color; type is 'light' | 'dark'
this.themeService.changeTheme('#3f51b5', '#ff4081', '#f44336', 'light');`;

  /**
   * Property `entryPointSnippet` (`string`) storing secondary entry point structure snippet.
   * @zh 属性 `entryPointSnippet`（类型：`string`），用于存储二级入口打包规范代码片段。
   */
  readonly entryPointSnippet = `// src/<category>/<feature>/ng-package.json
{
  "$schema": "../../../node_modules/ng-packagr/ng-package.schema.json",
  "lib": {
    "entryFile": "index.ts"
  }
}

// 跨二级入口引入必须使用包名路径，严禁相对路径跨入口引用：
import { Dui } from '@dotos/dui/core';
import { TranslateModule } from '@dotos/dui/translator';`;

  /**
   * Property `lifecycleSnippet` (`string`) storing RxJS teardown and OnPush best-practice snippet.
   * @zh 属性 `lifecycleSnippet`（类型：`string`），用于存储 RxJS 订阅生命周期清理与 OnPush 规范片段。
   */
  readonly lifecycleSnippet = `import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'dui-example-widget',
  templateUrl: './example-widget.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExampleWidgetComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.configService.config.pipe(takeUntil(this.destroy$)).subscribe((cfg) => {
      // handle update safely
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}`;

  /**
   * Property `jsdocSnippet` (`string`) storing bilingual JSDoc and docs generation snippet.
   * @zh 属性 `jsdocSnippet`（类型：`string`），用于存储中英双语 JSDoc 注释与文档生成命令片段。
   */
  readonly jsdocSnippet = `/**
 * Primary action button component supporting icon, menu, and toggle modes.
 * @zh 主操作按钮组件，支持图标、下拉菜单与开关切换模式。
 */
@Component({ selector: 'dui-button', ... })
export class ButtonComponent {
  /**
   * Button display label text.
   * @zh 按钮显示的文本标签。
   */
  @Input() text: string;
}

# 重新扫描 96+ 个二级入口并生成双语 API JSON 文档：
npm run docs:generate`;
}
