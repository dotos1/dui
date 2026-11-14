/**
 * @fileoverview Module `projects/testdui/src/app/docs/examples/toastr/toastr-example.module.ts` providing toastr example module definitions and implementation.
 * @zh 模块文件 `projects/testdui/src/app/docs/examples/toastr/toastr-example.module.ts`，提供轻提示example模块相关的定义与实现。
 */

import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { ToastrService } from '@dotos/dui/common/toastr';
import { HighlightModule } from '@dotos/dui/ux/highlight';

/**
 * Angular component `ToastrExampleComponent` (selector: 'app-toastr-example') providing toastr example component presentation and interaction in `projects/testdui/src/app/docs/examples/toastr`.
 * @zh Angular 组件 `ToastrExampleComponent`（selector: 'app-toastr-example'），提供轻提示Example组件的视图渲染与交互逻辑（位于 `projects/testdui/src/app/docs/examples/toastr`）。
 */
@Component({
  selector: 'app-toastr-example',
  template: `
    <h2>消息通知示例</h2>
    <div style="display:flex; gap:12px;">
      <button mat-raised-button color="primary" (click)="toastr.success('操作已成功', '成功')">成功</button>
      <button mat-raised-button color="warn" (click)="toastr.error('发生了一个错误', '错误')">错误</button>
      <button mat-raised-button (click)="toastr.info('这是一条提示信息', '提示')">提示</button>
      <button mat-raised-button (click)="toastr.warning('请注意', '警告')">警告</button>
    </div>

    <h3>示例代码</h3>
    <dui-highlight [content]="exampleSource" [codeLang]="'typescript'" [copyCodeToClipboard]="true"></dui-highlight>
  `,
  standalone: false,
})
export class ToastrExampleComponent {
  /**
   * Property `exampleSource` (`string`) storing example source.
   * @zh 属性 `exampleSource`（类型：`string`），用于存储或配置example源。
   */
  readonly exampleSource = `constructor(public toastr: ToastrService) {}

<button (click)="toastr.success('操作已成功', '成功')">成功</button>
<button (click)="toastr.error('发生了一个错误', '错误')">错误</button>
<button (click)="toastr.info('这是一条提示信息', '提示')">提示</button>
<button (click)="toastr.warning('请注意', '警告')">警告</button>`;

  /**
   * Creates an instance of `ToastrExampleComponent` and initializes its dependencies and internal state.
   * @zh 创建 `ToastrExampleComponent` 实例，并初始化其依赖项与内部状态。
   * @param toastr - Injected or initial toastr (`ToastrService`) / 注入或传入的轻提示（`ToastrService`）
   */
  constructor(public toastr: ToastrService) {}
}

/**
 * Constant/variable `routes` defining routes in `projects/testdui/src/app/docs/examples/toastr`.
 * @zh 常量/变量 `routes`，定义 `projects/testdui/src/app/docs/examples/toastr` 中的routes。
 */
const routes: Routes = [{ path: '', component: ToastrExampleComponent }];

/**
 * Angular module `ToastrExampleModule` declaring and exporting toastr example module components, directives, pipes, and providers.
 * @zh Angular 模块 `ToastrExampleModule`，声明并导出轻提示Example模块相关的组件、指令、管道与服务提供者。
 */
@NgModule({
  declarations: [ToastrExampleComponent],
  imports: [CommonModule, MatButtonModule, HighlightModule, RouterModule.forChild(routes)],
})
export class ToastrExampleModule {}
