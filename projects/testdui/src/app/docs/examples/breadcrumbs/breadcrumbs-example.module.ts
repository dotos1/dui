/**
 * @fileoverview Module `projects/testdui/src/app/docs/examples/breadcrumbs/breadcrumbs-example.module.ts` providing breadcrumbs example module definitions and implementation.
 * @zh 模块文件 `projects/testdui/src/app/docs/examples/breadcrumbs/breadcrumbs-example.module.ts`，提供面包屑导航（`BreadcrumbsModule`）可交互示例模块相关的定义与实现。
 */

import { CommonModule } from '@angular/common';
import { Component, NgModule, ChangeDetectionStrategy } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { BreadcrumbsModule } from '@dotos1/dui/common/breadcrumbs';
import { HighlightModule } from '@dotos1/dui/ux/highlight';

/**
 * Angular component `BreadcrumbsExampleComponent` (selector: 'app-breadcrumbs-example') providing breadcrumbs presentation and interaction.
 * @zh Angular 组件 `BreadcrumbsExampleComponent`（selector: 'app-breadcrumbs-example'），提供面包屑导航示例组件的视图渲染与交互逻辑。
 */
@Component({
  selector: 'app-breadcrumbs-example',
  template: `
    <h2>面包屑导航示例 (dui-breadcrumbs)</h2>
    <div style="display:flex; gap:12px; align-items:center; margin-bottom:16px;">
      <button mat-stroked-button (click)="separator = 'chevron_right'">默认箭头 (chevron_right)</button>
      <button mat-stroked-button (click)="separator = 'navigate_next'">斜杠箭头 (navigate_next)</button>
      <button mat-stroked-button (click)="separator = 'arrow_forward_ios'">双箭头 (arrow_forward_ios)</button>
    </div>

    <div style="padding:12px 16px; border:1px solid rgba(128,128,128,0.25); border-radius:6px; margin-bottom:12px;">
      <dui-breadcrumbs [separatorIcon]="separator">
        <a dui-breadcrumb *ngFor="let crumb of crumbs" (click)="activeCrumb = crumb">{{ crumb }}</a>
      </dui-breadcrumbs>
    </div>
    <p>当前点击路径节点：<strong>{{ activeCrumb }}</strong></p>

    <h3>示例代码</h3>
    <dui-highlight [content]="exampleSource" [codeLang]="'html'" [copyCodeToClipboard]="true"></dui-highlight>
  `,
  standalone: false,
  changeDetection: ChangeDetectionStrategy.Default,
})
export class BreadcrumbsExampleComponent {
  /**
   * Property `separator` (`string`) storing the Material icon name for breadcrumb separators.
   * @zh 属性 `separator`（类型：`string`），用于存储或配置面包屑分隔符图标名称。
   */
  separator = 'chevron_right';

  /**
   * Property `crumbs` (`string[]`) storing breadcrumb trail labels.
   * @zh 属性 `crumbs`（类型：`string[]`），用于存储面包屑层级节点名称列表。
   */
  crumbs = ['Dotos 平台', '采购管理', '采购订单', '订单详情 #202610'];

  /**
   * Property `activeCrumb` (`string`) storing the last clicked breadcrumb item.
   * @zh 属性 `activeCrumb`（类型：`string`），用于存储最近点击的面包屑节点。
   */
  activeCrumb = '订单详情 #202610';

  /**
   * Property `exampleSource` (`string`) storing example source code snippet.
   * @zh 属性 `exampleSource`（类型：`string`），用于存储或配置示例代码片段。
   */
  readonly exampleSource = `<dui-breadcrumbs [separatorIcon]="separator">
  <a dui-breadcrumb *ngFor="let crumb of crumbs" (click)="activeCrumb = crumb">
    {{ crumb }}
  </a>
</dui-breadcrumbs>`;
}

/**
 * Constant `routes` defining child routes for the breadcrumbs example module.
 * @zh 常量 `routes`，定义面包屑导航示例模块的子路由。
 */
const routes: Routes = [{ path: '', component: BreadcrumbsExampleComponent }];

/**
 * Angular module `BreadcrumbsExampleModule` declaring and exporting the breadcrumbs interactive example.
 * @zh Angular 模块 `BreadcrumbsExampleModule`，声明并导出面包屑导航可交互示例组件。
 */
@NgModule({
  declarations: [BreadcrumbsExampleComponent],
  imports: [CommonModule, MatButtonModule, BreadcrumbsModule, HighlightModule, RouterModule.forChild(routes)],
})
export class BreadcrumbsExampleModule {}
