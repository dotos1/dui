/**
 * @fileoverview Module `projects/testdui/src/app/docs/examples/layout/layout-example.module.ts` providing split layout example module definitions and implementation.
 * @zh 模块文件 `projects/testdui/src/app/docs/examples/layout/layout-example.module.ts`，提供可拖拽分割布局（`DuiLayoutModule`）可交互示例模块相关的定义与实现。
 */

import { CommonModule } from '@angular/common';
import { Component, NgModule, ChangeDetectionStrategy } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { DuiLayoutModule } from '@dotos/dui/container/layout';
import { HighlightModule } from '@dotos/dui/ux/highlight';

/**
 * Angular component `LayoutExampleComponent` (selector: 'app-layout-example') providing split layout presentation and interaction.
 * @zh Angular 组件 `LayoutExampleComponent`（selector: 'app-layout-example'），提供可拖拽分割面板布局示例的视图渲染与交互逻辑。
 */
@Component({
  selector: 'app-layout-example',
  template: `
    <h2>分割面板布局示例 (dui-layout / dui-split-area)</h2>
    <div style="display:flex; gap:12px; align-items:center; margin-bottom:12px;">
      <button mat-stroked-button (click)="toggleDirection()">
        切换方向（当前：{{ direction === 'horizontal' ? '水平 horizontal' : '垂直 vertical' }}）
      </button>
      <span>最近拖拽比例：<code>{{ sizesText }}</code></span>
    </div>

    <div style="height:240px; border:1px solid rgba(128,128,128,0.25); border-radius:6px; overflow:hidden; margin-bottom:16px;">
      <dui-layout [direction]="direction" (dragEnd)="onDragEnd($event)">
        <dui-split-area [size]="30" style="padding:12px; background:rgba(33,150,243,0.08);">
          <strong>导航区 (30%)</strong>
          <p>拖动中间的分隔条可实时调整两侧区域尺寸。</p>
        </dui-split-area>
        <dui-split-area [size]="70" style="padding:12px;">
          <strong>主工作区 (70%)</strong>
          <p>支持百分比（percent）与像素（pixel）两种模式，以及水平与垂直嵌套布局。</p>
        </dui-split-area>
      </dui-layout>
    </div>

    <h3>示例代码</h3>
    <dui-highlight [content]="exampleSource" [codeLang]="'html'" [copyCodeToClipboard]="true"></dui-highlight>
  `,
  standalone: false,
  changeDetection: ChangeDetectionStrategy.Default,
})
export class LayoutExampleComponent {
  /**
   * Property `direction` (`'horizontal' | 'vertical'`) storing split direction.
   * @zh 属性 `direction`（类型：`'horizontal' | 'vertical'`），用于存储或配置分割方向。
   */
  direction: 'horizontal' | 'vertical' = 'horizontal';

  /**
   * Property `sizesText` (`string`) storing formatted area sizes after drag.
   * @zh 属性 `sizesText`（类型：`string`），用于存储拖拽结束后的各区域比例文本。
   */
  sizesText = '30% / 70%';

  /**
   * Property `exampleSource` (`string`) storing example source code snippet.
   * @zh 属性 `exampleSource`（类型：`string`），用于存储或配置示例代码片段。
   */
  readonly exampleSource = `<dui-layout [direction]="direction" (dragEnd)="onDragEnd($event)">
  <dui-split-area [size]="30">左侧/上方区域 (30%)</dui-split-area>
  <dui-split-area [size]="70">右侧/下方区域 (70%)</dui-split-area>
</dui-layout>`;

  /**
   * Toggles between horizontal and vertical split directions.
   * @zh 在水平分割与垂直分割之间切换。
   */
  toggleDirection(): void {
    this.direction = this.direction === 'horizontal' ? 'vertical' : 'horizontal';
  }

  /**
   * Updates displayed area proportions when dragging ends.
   * @zh 处理分隔条拖拽结束事件并更新比例显示。
   * @param event - Output drag data (`any`) / 拖拽结束事件数据（`any`）
   */
  onDragEnd(event: any): void {
    if (event?.sizes) {
      this.sizesText = event.sizes.map((s: number) => `${Math.round(s)}%`).join(' / ');
    }
  }
}

/**
 * Constant `routes` defining child routes for the layout example module.
 * @zh 常量 `routes`，定义分割面板布局示例模块的子路由。
 */
const routes: Routes = [{ path: '', component: LayoutExampleComponent }];

/**
 * Angular module `LayoutExampleModule` declaring and exporting the layout interactive example.
 * @zh Angular 模块 `LayoutExampleModule`，声明并导出分割布局可交互示例组件。
 */
@NgModule({
  declarations: [LayoutExampleComponent],
  imports: [CommonModule, MatButtonModule, DuiLayoutModule, HighlightModule, RouterModule.forChild(routes)],
})
export class LayoutExampleModule {}
