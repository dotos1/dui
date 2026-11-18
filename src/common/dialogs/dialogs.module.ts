/**
 * @fileoverview Module `src/common/dialogs/dialogs.module.ts` providing dialogs module definitions and implementation.
 * @zh 模块文件 `src/common/dialogs/dialogs.module.ts`，提供对话框模块相关的定义与实现。
 */

import { Type } from '@angular/core';
import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import {
  duiDialogComponent,
  duiDialogTitleDirective,
  duiDialogActionsDirective,
  duiDialogContentDirective,
  duiDialogStatusDirective,
} from './dialog.component';
import { AlertDialogComponent } from './alert-dialog/alert-dialog.component';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { PromptDialogComponent } from './prompt-dialog/prompt-dialog.component';
import { StatusDialogComponent } from './status-dialog/status-dialog.component';
import { DialogService } from './services/dialog.service';
import { WindowDialogComponent } from './window-dialog/window-dialog.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@dotos1/dui/translator';
import { Dui } from '@dotos1/dui/core';

/**
 * Constant/variable `DIALOGS` defining dialogs in `src/common/dialogs`.
 * @zh 常量/变量 `DIALOGS`，定义 `src/common/dialogs` 中的对话框。
 */
const DIALOGS = [
  AlertDialogComponent,
  ConfirmDialogComponent,
  PromptDialogComponent,
  duiDialogComponent,
  duiDialogStatusDirective,
  duiDialogTitleDirective,
  duiDialogActionsDirective,
  duiDialogContentDirective,
  WindowDialogComponent,
  AlertDialogComponent,
  ConfirmDialogComponent,
  PromptDialogComponent,
  StatusDialogComponent,
];
/**
 * Constant/variable `DIALOGS_ENTRY_COMPONENTS` defining dialogs entry components in `src/common/dialogs`.
 * @zh 常量/变量 `DIALOGS_ENTRY_COMPONENTS`，定义 `src/common/dialogs` 中的对话框条目组件列表。
 */
const DIALOGS_ENTRY_COMPONENTS = [
  AlertDialogComponent,
  ConfirmDialogComponent,
  PromptDialogComponent
];
/**
 * Registers all of the dialogs library's dialog components/directives
 * ({@link AlertDialogComponent}, {@link ConfirmDialogComponent}, {@link PromptDialogComponent},
 * {@link StatusDialogComponent}, {@link WindowDialogComponent}, `dui-dialog`) and provides
 * {@link DialogService}.
 * @zh 注册对话框库的全部对话框组件/指令（{@link AlertDialogComponent}、{@link ConfirmDialogComponent}、
 * {@link PromptDialogComponent}、{@link StatusDialogComponent}、{@link WindowDialogComponent}、
 * `dui-dialog`），并提供 {@link DialogService}。
 */
@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    MatDialogModule,
    MatInputModule,
    MatButtonModule,
    MatToolbarModule,
    MatTooltipModule,
    MatIconModule,
    ReactiveFormsModule,
    TranslateModule,
  ],
  declarations: [...DIALOGS],
  exports: [...DIALOGS],
  providers: [DialogService],
})
export class DialogsModule {
  /**
   * Property `entryComponents` (`(typeof AlertDialogComponent | typeof ConfirmDialogComponent | typeof PromptDialogComponent)[]`) storing entry components (default: `DIALOGS_ENTRY_COMPONENTS`).
   * @zh 属性 `entryComponents`（类型：`(typeof AlertDialogComponent | typeof ConfirmDialogComponent | typeof PromptDialogComponent)[]`），用于存储或配置条目组件列表（默认值：`DIALOGS_ENTRY_COMPONENTS`）。
   */
  entryComponents = DIALOGS_ENTRY_COMPONENTS;
  /**
   * Creates an instance of `DialogsModule` and initializes its dependencies and internal state.
   * @zh 创建 `DialogsModule` 实例，并初始化其依赖项与内部状态。
   * @param componentFactoryResolver - Injected or initial component factory resolver (`ComponentFactoryResolver`) / 注入或传入的组件工厂解析器（`ComponentFactoryResolver`）
   */
  constructor() {
    Dui.registerComponentFactory(this.entryComponents);
  }
}
