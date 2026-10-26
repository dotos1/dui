/**
 * @fileoverview Module `projects/testdui/src/app/docs/examples/dialogs/dialogs-example.module.ts` providing dialogs example module definitions and implementation.
 * @zh 模块文件 `projects/testdui/src/app/docs/examples/dialogs/dialogs-example.module.ts`，提供对话框example模块相关的定义与实现。
 */

import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { DialogsModule, DialogService } from '@dotos/dui/common/dialogs';
import { HighlightModule } from '@dotos/dui/ux/highlight';

/**
 * Angular component `DialogsExampleComponent` (selector: 'app-dialogs-example') providing dialogs example component presentation and interaction in `projects/testdui/src/app/docs/examples/dialogs`.
 * @zh Angular 组件 `DialogsExampleComponent`（selector: 'app-dialogs-example'），提供对话框Example组件的视图渲染与交互逻辑（位于 `projects/testdui/src/app/docs/examples/dialogs`）。
 */
@Component({
  selector: 'app-dialogs-example',
  template: `
    <h2>对话框示例</h2>
    <div style="display:flex; gap:12px;">
      <button mat-raised-button (click)="openAlert()">打开提示框</button>
      <button mat-raised-button (click)="openConfirm()">打开确认框</button>
    </div>
    <p style="margin-top:12px;">最近结果：{{ lastResult }}</p>

    <h3>示例代码</h3>
    <dui-highlight [content]="exampleSource" [codeLang]="'typescript'" [copyCodeToClipboard]="true"></dui-highlight>
  `,
})
export class DialogsExampleComponent {
  /**
   * Property `lastResult` (`string`) storing last result (default: `'（尚未操作）'`).
   * @zh 属性 `lastResult`（类型：`string`），用于存储或配置末尾结果（默认值：`'（尚未操作）'`）。
   */
  lastResult = '（尚未操作）';

  /**
   * Property `exampleSource` (`string`) storing example source.
   * @zh 属性 `exampleSource`（类型：`string`），用于存储或配置example源。
   */
  readonly exampleSource = `constructor(private dialogService: DialogService) {}

openAlert(): void {
  this.dialogService
    .openAlert({ title: '提示', message: '这是一个提示框示例。' })
    .afterClosed()
    .subscribe(() => { /* 已关闭 */ });
}

openConfirm(): void {
  this.dialogService
    .openConfirm({ title: '确认', message: '确定要执行此操作吗？' })
    .afterClosed()
    .subscribe((result: boolean) => { /* result 为 true/false */ });
}`;

  /**
   * Creates an instance of `DialogsExampleComponent` and initializes its dependencies and internal state.
   * @zh 创建 `DialogsExampleComponent` 实例，并初始化其依赖项与内部状态。
   * @param dialogService - Injected or initial dialog service (`DialogService`) / 注入或传入的对话框服务（`DialogService`）
   */
  constructor(private dialogService: DialogService) {}

  /**
   * Executes `openAlert` to handle open alert.
   * @zh 执行 `openAlert`，用于打开警告框。
   */
  openAlert(): void {
    this.dialogService
      .openAlert({ title: '提示', message: '这是一个提示框示例。' } as any)
      .afterClosed()
      .subscribe(() => (this.lastResult = '提示框已关闭'));
  }

  /**
   * Executes `openConfirm` to handle open confirm.
   * @zh 执行 `openConfirm`，用于打开Confirm。
   */
  openConfirm(): void {
    this.dialogService
      .openConfirm({ title: '确认', message: '确定要执行此操作吗？' } as any)
      .afterClosed()
      .subscribe((result: boolean) => (this.lastResult = result ? '用户点击了确认' : '用户取消了'));
  }
}

/**
 * Constant/variable `routes` defining routes in `projects/testdui/src/app/docs/examples/dialogs`.
 * @zh 常量/变量 `routes`，定义 `projects/testdui/src/app/docs/examples/dialogs` 中的routes。
 */
const routes: Routes = [{ path: '', component: DialogsExampleComponent }];

/**
 * Angular module `DialogsExampleModule` declaring and exporting dialogs example module components, directives, pipes, and providers.
 * @zh Angular 模块 `DialogsExampleModule`，声明并导出对话框Example模块相关的组件、指令、管道与服务提供者。
 */
@NgModule({
  declarations: [DialogsExampleComponent],
  imports: [CommonModule, MatButtonModule, DialogsModule, HighlightModule, RouterModule.forChild(routes)],
})
export class DialogsExampleModule {}
