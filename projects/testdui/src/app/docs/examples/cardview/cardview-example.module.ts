/**
 * @fileoverview Module `projects/testdui/src/app/docs/examples/cardview/cardview-example.module.ts` providing cardview example module definitions and implementation.
 * @zh 模块文件 `projects/testdui/src/app/docs/examples/cardview/cardview-example.module.ts`，提供卡片属性视图（`CardViewModule`）可交互示例模块相关的定义与实现。
 */

import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import {
  CardViewBoolItemModel,
  CardViewItem,
  CardViewModule,
  CardViewTextItemModel,
} from '@dotos/dui/data/cardview';
import { HighlightModule } from '@dotos/dui/ux/highlight';

/**
 * Angular component `CardviewExampleComponent` (selector: 'app-cardview-example') providing cardview presentation and interaction.
 * @zh Angular 组件 `CardviewExampleComponent`（selector: 'app-cardview-example'），提供卡片属性视图示例组件的视图渲染与交互逻辑。
 */
@Component({
  selector: 'app-cardview-example',
  template: `
    <h2>属性卡片视图示例 (dui-card-view)</h2>
    <div style="margin-bottom:16px;">
      <mat-slide-toggle [checked]="editable" (change)="editable = $event.checked">
        允许行内编辑 (editable = {{ editable }})
      </mat-slide-toggle>
    </div>

    <div style="max-width:560px; padding:16px; border:1px solid rgba(128,128,128,0.25); border-radius:6px; margin-bottom:16px;">
      <dui-card-view [properties]="properties" [editable]="editable" [copyToClipboardAction]="true"></dui-card-view>
    </div>

    <h3>示例代码</h3>
    <dui-highlight [content]="exampleSource" [codeLang]="'typescript'" [copyCodeToClipboard]="true"></dui-highlight>
  `,
  standalone: false,
})
export class CardviewExampleComponent {
  /**
   * Property `editable` (`boolean`) controlling whether card view items can be edited inline.
   * @zh 属性 `editable`（类型：`boolean`），控制卡片视图字段是否允许行内编辑。
   */
  editable = true;

  /**
   * Property `properties` (`CardViewItem[]`) storing the card view field models.
   * @zh 属性 `properties`（类型：`CardViewItem[]`），存储卡片视图展示的属性字段模型列表。
   */
  properties: CardViewItem[] = [
    new CardViewTextItemModel({
      label: '应用名称',
      value: 'Dotos ERP 企业智能底座',
      key: 'appName',
      editable: true,
      icon: 'apps',
    }),
    new CardViewTextItemModel({
      label: '所属模块',
      value: '@dotos/dui/data/cardview',
      key: 'modulePath',
      editable: false,
      icon: 'folder',
    }),
    new CardViewBoolItemModel({
      label: '启用审计日志',
      value: true,
      key: 'auditEnabled',
      editable: true,
    }),
  ];

  /**
   * Property `exampleSource` (`string`) storing example source code snippet.
   * @zh 属性 `exampleSource`（类型：`string`），用于存储或配置示例代码片段。
   */
  readonly exampleSource = `import { CardViewBoolItemModel, CardViewItem, CardViewTextItemModel } from '@dotos/dui/data/cardview';

properties: CardViewItem[] = [
  new CardViewTextItemModel({ label: '应用名称', value: 'Dotos ERP', key: 'appName', editable: true }),
  new CardViewBoolItemModel({ label: '启用审计日志', value: true, key: 'auditEnabled', editable: true }),
];

// 模板：
// <dui-card-view [properties]="properties" [editable]="editable"></dui-card-view>`;
}

/**
 * Constant `routes` defining child routes for the cardview example module.
 * @zh 常量 `routes`，定义卡片属性视图示例模块的子路由。
 */
const routes: Routes = [{ path: '', component: CardviewExampleComponent }];

/**
 * Angular module `CardviewExampleModule` declaring and exporting the cardview interactive example.
 * @zh Angular 模块 `CardviewExampleModule`，声明并导出卡片属性视图可交互示例组件。
 */
@NgModule({
  declarations: [CardviewExampleComponent],
  imports: [CommonModule, MatSlideToggleModule, CardViewModule, HighlightModule, RouterModule.forChild(routes)],
})
export class CardviewExampleModule {}
