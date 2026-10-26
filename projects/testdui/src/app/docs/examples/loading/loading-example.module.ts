/**
 * @fileoverview Module `projects/testdui/src/app/docs/examples/loading/loading-example.module.ts` providing loading indicator example module definitions and implementation.
 * @zh 模块文件 `projects/testdui/src/app/docs/examples/loading/loading-example.module.ts`，提供加载指示器（`LoadingModule`）可交互示例模块相关的定义与实现。
 */

import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { LoadingMode, LoadingModule, LoadingStrategy, LoadingType } from '@dotos/dui/common/loading';
import { HighlightModule } from '@dotos/dui/ux/highlight';

/**
 * Angular component `LoadingExampleComponent` (selector: 'app-loading-example') providing loading directive presentation and interaction.
 * @zh Angular 组件 `LoadingExampleComponent`（selector: 'app-loading-example'），提供加载指示器与遮罩指令示例组件的视图渲染与交互逻辑。
 */
@Component({
  selector: 'app-loading-example',
  template: `
    <h2>加载指示器示例 (duiLoading 指令)</h2>
    <div style="display:flex; gap:12px; align-items:center; margin-bottom:16px;">
      <button mat-raised-button color="primary" (click)="toggleLoading()">
        {{ contentLoaded ? '触发加载态 (Loading)' : '完成加载 (Resolve)' }}
      </button>
      <button mat-stroked-button (click)="toggleType()">
        切换样式（当前：{{ loadingType === LoadingType.Circular ? '圆形 Circular' : '线性 Linear' }}）
      </button>
    </div>

    <div
      *duiLoading="'demoLoading'; until: contentLoaded; type: loadingType; mode: LoadingMode.Indeterminate; strategy: LoadingStrategy.Overlay; color: 'primary'"
      style="padding:20px; border:1px solid rgba(128,128,128,0.25); border-radius:6px; min-height:100px; margin-bottom:16px;">
      <h4 style="margin-top:0;">业务数据卡片</h4>
      <p>当 <code>duiLoadingUntil</code> 为 <code>false</code> 时，会在当前容器上方渲染遮罩加载动画；变为 <code>true</code> 后自动恢复交互。</p>
    </div>

    <h3>示例代码</h3>
    <dui-highlight [content]="exampleSource" [codeLang]="'html'" [copyCodeToClipboard]="true"></dui-highlight>
  `,
})
export class LoadingExampleComponent {
  /**
   * Property `contentLoaded` (`boolean`) controlling the `duiLoadingUntil` state.
   * @zh 属性 `contentLoaded`（类型：`boolean`），用于控制 `duiLoadingUntil` 是否已完成加载。
   */
  contentLoaded = true;

  /**
   * Property `LoadingType` referencing `LoadingType` enum for template binding.
   * @zh 属性 `LoadingType`，在模板中引用 `LoadingType` 枚举。
   */
  readonly LoadingType = LoadingType;

  /**
   * Property `LoadingMode` referencing `LoadingMode` enum for template binding.
   * @zh 属性 `LoadingMode`，在模板中引用 `LoadingMode` 枚举。
   */
  readonly LoadingMode = LoadingMode;

  /**
   * Property `LoadingStrategy` referencing `LoadingStrategy` enum for template binding.
   * @zh 属性 `LoadingStrategy`，在模板中引用 `LoadingStrategy` 枚举。
   */
  readonly LoadingStrategy = LoadingStrategy;

  /**
   * Property `loadingType` (`LoadingType`) storing current indicator type.
   * @zh 属性 `loadingType`（类型：`LoadingType`），用于存储当前指示器类型（圆形或线性）。
   */
  loadingType: LoadingType = LoadingType.Circular;

  /**
   * Property `exampleSource` (`string`) storing example source code snippet.
   * @zh 属性 `exampleSource`（类型：`string`），用于存储或配置示例代码片段。
   */
  readonly exampleSource = `<div *duiLoading="'demoLoading';
                  until: contentLoaded;
                  type: loadingType;
                  strategy: LoadingStrategy.Overlay;
                  color: 'primary'">
  <h4>业务数据卡片</h4>
  <p>受控的业务视图区域</p>
</div>`;

  /**
   * Toggles the loading state of the demo card.
   * @zh 切换示例卡片的加载状态。
   */
  toggleLoading(): void {
    this.contentLoaded = !this.contentLoaded;
  }

  /**
   * Toggles between circular and linear loading indicator styles.
   * @zh 在圆形加载指示器与线性进度条样式之间切换。
   */
  toggleType(): void {
    this.loadingType =
      this.loadingType === LoadingType.Circular ? LoadingType.Linear : LoadingType.Circular;
  }
}

/**
 * Constant `routes` defining child routes for the loading example module.
 * @zh 常量 `routes`，定义加载指示器示例模块的子路由。
 */
const routes: Routes = [{ path: '', component: LoadingExampleComponent }];

/**
 * Angular module `LoadingExampleModule` declaring and exporting the loading interactive example.
 * @zh Angular 模块 `LoadingExampleModule`，声明并导出加载指示器可交互示例组件。
 */
@NgModule({
  declarations: [LoadingExampleComponent],
  imports: [CommonModule, MatButtonModule, LoadingModule, HighlightModule, RouterModule.forChild(routes)],
})
export class LoadingExampleModule {}
