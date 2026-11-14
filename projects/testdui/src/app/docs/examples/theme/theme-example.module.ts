/**
 * @fileoverview Module `projects/testdui/src/app/docs/examples/theme/theme-example.module.ts` providing theme example module definitions and implementation.
 * @zh 模块文件 `projects/testdui/src/app/docs/examples/theme/theme-example.module.ts`，提供主题与配色方案可交互示例模块相关的定义与实现。
 */

import { CommonModule } from '@angular/common';
import { Component, NgModule, OnDestroy, OnInit } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DotosConfigService, ThemeService } from '@dotos/dui/theme';
import { HighlightModule } from '@dotos/dui/ux/highlight';

/**
 * Angular component `ThemeExampleComponent` (selector: 'app-theme-example') providing live theme switching interaction.
 * @zh Angular 组件 `ThemeExampleComponent`（selector: 'app-theme-example'），提供主题运行时切换示例组件的视图渲染与交互逻辑。
 */
@Component({
  selector: 'app-theme-example',
  template: `
    <h2>运行时主题切换示例 (ThemeService / DotosConfigService)</h2>
    <p>点击下方按钮即可在运行时切换明暗模式与主题色板（无需重新编译样式表）：</p>

    <div style="display:flex; flex-wrap:wrap; gap:12px; margin-bottom:16px;">
      <button mat-raised-button (click)="setMode('light')">浅色模式 (Light)</button>
      <button mat-raised-button (click)="setMode('dark')">深色模式 (Dark)</button>
      <button mat-raised-button (click)="setMode('darkblue')">深蓝模式 (Dark Blue)</button>
      <button mat-stroked-button color="primary" (click)="setPalette('blue-500', 'orange-500')">经典蓝橙</button>
      <button mat-stroked-button color="accent" (click)="setPalette('teal-500', 'amber-500')">青色琥珀</button>
      <button mat-stroked-button color="warn" (click)="resetTheme()">重置默认主题</button>
    </div>

    <mat-card style="margin-bottom:16px; max-width:520px;">
      <mat-card-content>
        <div><strong>当前模式：</strong> <code>{{ currentTheme?.type }}</code></div>
        <div><strong>主色 (Primary)：</strong> <code>{{ currentTheme?.primary }}</code></div>
        <div><strong>辅助色 (Accent)：</strong> <code>{{ currentTheme?.accent }}</code></div>
        <div><strong>警示色 (Warn)：</strong> <code>{{ currentTheme?.warn }}</code></div>
      </mat-card-content>
    </mat-card>

    <h3>示例代码</h3>
    <dui-highlight [content]="exampleSource" [codeLang]="'typescript'" [copyCodeToClipboard]="true"></dui-highlight>
  `,
  standalone: false,
})
export class ThemeExampleComponent implements OnInit, OnDestroy {
  /**
   * Property `currentTheme` (`any`) storing active theme config snapshot.
   * @zh 属性 `currentTheme`（类型：`any`），用于存储当前激活的主题配置快照。
   */
  currentTheme: any = {};

  /**
   * Property `destroy$` (`Subject<void>`) managing subscription teardown.
   * @zh 属性 `destroy$`（类型：`Subject<void>`），用于在组件销毁时清理 RxJS 订阅。
   */
  private readonly destroy$ = new Subject<void>();

  /**
   * Property `exampleSource` (`string`) storing example source code snippet.
   * @zh 属性 `exampleSource`（类型：`string`），用于存储或配置示例代码片段。
   */
  readonly exampleSource = `import { DotosConfigService, ThemeService } from '@dotos/dui/theme';

constructor(
  private dotosConfig: DotosConfigService,
  public themeService: ThemeService
) {}

// 切换明暗模式 ('light' | 'dark' | 'darkblue')
setMode(type: 'light' | 'dark' | 'darkblue'): void {
  this.dotosConfig.config = { theme: { ...this.currentTheme, type } };
}

// 切换主色与辅助色色板
setPalette(primary: string, accent: string): void {
  this.dotosConfig.config = { theme: { ...this.currentTheme, primary, accent } };
}`;

  /**
   * Creates an instance of `ThemeExampleComponent`.
   * @zh 创建 `ThemeExampleComponent` 实例，并注入主题配置服务。
   * @param dotosConfigService - Injected `DotosConfigService` / 注入的 `DotosConfigService`
   * @param themeService - Injected `ThemeService` / 注入的 `ThemeService`
   */
  constructor(
    private dotosConfigService: DotosConfigService,
    public themeService: ThemeService
  ) {}

  /**
   * Subscribes to theme configuration changes on initialization.
   * @zh 组件初始化时订阅全局主题配置变更流。
   */
  ngOnInit(): void {
    this.dotosConfigService.config.pipe(takeUntil(this.destroy$)).subscribe((cfg: any) => {
      this.currentTheme = cfg?.theme || {};
    });
  }

  /**
   * Updates the active theme mode.
   * @zh 切换主题明暗模式。
   * @param type - Theme mode (`'light' | 'dark' | 'darkblue'`) / 主题模式（`'light' | 'dark' | 'darkblue'`）
   */
  setMode(type: 'light' | 'dark' | 'darkblue'): void {
    this.dotosConfigService.config = {
      theme: { ...this.currentTheme, type },
    };
  }

  /**
   * Updates the primary and accent palettes.
   * @zh 切换主色与辅助色色板。
   * @param primary - Primary palette key (`string`) / 主色色板名（`string`）
   * @param accent - Accent palette key (`string`) / 辅助色色板名（`string`）
   */
  setPalette(primary: string, accent: string): void {
    this.dotosConfigService.config = {
      theme: { ...this.currentTheme, primary, accent },
    };
  }

  /**
   * Resets theme configuration to platform defaults.
   * @zh 重置为默认主题配置。
   */
  resetTheme(): void {
    this.dotosConfigService.resetToDefaults();
  }

  /**
   * Cleans up active subscriptions when the component is destroyed.
   * @zh 组件销毁时释放所有订阅资源。
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

/**
 * Constant `routes` defining child routes for the theme example module.
 * @zh 常量 `routes`，定义主题示例模块的子路由。
 */
const routes: Routes = [{ path: '', component: ThemeExampleComponent }];

/**
 * Angular module `ThemeExampleModule` declaring and exporting the theme interactive example.
 * @zh Angular 模块 `ThemeExampleModule`，声明并导出主题运行时切换可交互示例组件。
 */
@NgModule({
  declarations: [ThemeExampleComponent],
  imports: [CommonModule, MatButtonModule, MatCardModule, HighlightModule, RouterModule.forChild(routes)],
})
export class ThemeExampleModule {}
