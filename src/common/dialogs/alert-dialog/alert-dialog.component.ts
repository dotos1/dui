/**
 * @fileoverview Module `src/common/dialogs/alert-dialog/alert-dialog.component.ts` providing alert dialog component definitions and implementation.
 * @zh 模块文件 `src/common/dialogs/alert-dialog/alert-dialog.component.ts`，提供警告框对话框组件相关的定义与实现。
 */

import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

/**
 * Simple alert dialog with a message and a single close button; normally opened via
 * {@link DialogService.openAlert}.
 * @zh 简单的提示对话框，带一条消息和一个关闭按钮；通常通过 {@link DialogService.openAlert} 打开。
 */
@Component({
  selector: 'dui-alert-dialog',
  templateUrl: './alert-dialog.component.html',
  styleUrls: ['./alert-dialog.component.scss'],

})
export class AlertDialogComponent {
  /**
   * Property `title` (`string`) storing title.
   * @zh 对话框标题。
   * @zh 对话框标题。
   */
  title?: string;
  /**
   * Property `message` (`string`) storing message.
   * @zh 对话框消息内容。
   * @zh 对话框消息内容。
   */
  message?: string;
  /**
   * Property `closeButton` (`string`) storing close button (default: `'CLOSE'`).
   * @zh 关闭按钮的文字，默认为 `'CLOSE'`。
   * @zh 关闭按钮的文字，默认为 `'CLOSE'`。
   */
  closeButton?: string = 'CLOSE';

  /**
   * Creates an instance of `AlertDialogComponent` and initializes its dependencies and internal state.
   * @zh 创建 `AlertDialogComponent` 实例，并初始化其依赖项与内部状态。
   * @param _dialogRef - Injected or initial dialog ref (`MatDialogRef<AlertDialogComponent>`) / 注入或传入的对话框引用（`MatDialogRef<AlertDialogComponent>`）
   */
  constructor(private _dialogRef: MatDialogRef<AlertDialogComponent>) {}

  /**
   * Closes the dialog.
   * @zh 关闭对话框。
   */
  close(): void {
    this._dialogRef.close();
  }
}
