/**
 * @fileoverview Module `projects/testdui/src/app/docs/examples/datatable/datatable-example.module.ts` providing datatable example module definitions and implementation.
 * @zh 模块文件 `projects/testdui/src/app/docs/examples/datatable/datatable-example.module.ts`，提供数据表格example模块相关的定义与实现。
 */

import { CommonModule } from '@angular/common';
import { Component, NgModule, ChangeDetectionStrategy } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DatatableModule } from '@dotos/dui/data/datatable';
import { HighlightModule } from '@dotos/dui/ux/highlight';

/**
 * Angular component `DatatableExampleComponent` (selector: 'app-datatable-example') providing datatable example component presentation and interaction in `projects/testdui/src/app/docs/examples/datatable`.
 * @zh Angular 组件 `DatatableExampleComponent`（selector: 'app-datatable-example'），提供数据表格Example组件的视图渲染与交互逻辑（位于 `projects/testdui/src/app/docs/examples/datatable`）。
 */
@Component({
  selector: 'app-datatable-example',
  template: `
    <h2>数据表格示例</h2>
    <dui-datatable style="display:block; height:300px;" [rows]="rows" [columns]="columns"></dui-datatable>

    <h3>示例代码</h3>
    <dui-highlight [content]="exampleSource" [codeLang]="'typescript'" [copyCodeToClipboard]="true"></dui-highlight>
  `,
  standalone: false,
  changeDetection: ChangeDetectionStrategy.Default,
})
export class DatatableExampleComponent {
  /**
   * Property `columns` (`any[]`) storing columns.
   * @zh 属性 `columns`（类型：`any[]`），用于存储或配置列集合。
   */
  columns = [
    { prop: 'name', name: '姓名' },
    { prop: 'role', name: '角色' },
    { prop: 'age', name: '年龄' },
  ];
  /**
   * Property `rows` (`any[]`) storing rows.
   * @zh 属性 `rows`（类型：`any[]`），用于存储或配置行列表。
   */
  rows = [
    { name: '张三', role: '前端工程师', age: 28 },
    { name: '李四', role: '后端工程师', age: 32 },
    { name: '王五', role: '产品经理', age: 30 },
  ];

  /**
   * Property `exampleSource` (`string`) storing example source.
   * @zh 属性 `exampleSource`（类型：`string`），用于存储或配置example源。
   */
  readonly exampleSource = `<dui-datatable [rows]="rows" [columns]="columns"></dui-datatable>

columns = [
  { prop: 'name', name: '姓名' },
  { prop: 'role', name: '角色' },
];
rows = [
  { name: '张三', role: '前端工程师' },
];`;
}

/**
 * Constant/variable `routes` defining routes in `projects/testdui/src/app/docs/examples/datatable`.
 * @zh 常量/变量 `routes`，定义 `projects/testdui/src/app/docs/examples/datatable` 中的routes。
 */
const routes: Routes = [{ path: '', component: DatatableExampleComponent }];

/**
 * Angular module `DatatableExampleModule` declaring and exporting datatable example module components, directives, pipes, and providers.
 * @zh Angular 模块 `DatatableExampleModule`，声明并导出数据表格Example模块相关的组件、指令、管道与服务提供者。
 */
@NgModule({
  declarations: [DatatableExampleComponent],
  imports: [CommonModule, DatatableModule, HighlightModule, RouterModule.forChild(routes)],
})
export class DatatableExampleModule {}
