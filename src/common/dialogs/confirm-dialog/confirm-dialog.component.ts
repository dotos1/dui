/**
 * @fileoverview Module `src/common/dialogs/confirm-dialog/confirm-dialog.component.ts` providing confirm dialog component definitions and implementation.
 * @zh 模块文件 `src/common/dialogs/confirm-dialog/confirm-dialog.component.ts`，提供confirm对话框组件相关的定义与实现。
 */

import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

/**
 * Accept/cancel confirmation dialog; normally opened via {@link DialogService.openConfirm}.
 * @zh 接受/取消确认对话框；通常通过 {@link DialogService.openConfirm} 打开。
 */
@Component({
  selector: 'dui-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss'],

})
export class ConfirmDialogComponent {
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
   * Property `cancelButton` (`string`) storing cancel button (default: `'CANCEL'`).
   * @zh 取消按钮的文字，默认为 `'CANCEL'`。
   * @zh 取消按钮的文字，默认为 `'CANCEL'`。
   */
  cancelButton = 'CANCEL';
  /**
   * Property `acceptButton` (`string`) storing accept button (default: `'ACCEPT'`).
   * @zh 确认按钮的文字，默认为 `'ACCEPT'`。
   * @zh 确认按钮的文字，默认为 `'ACCEPT'`。
   */
  acceptButton = 'ACCEPT';
  /**
   * Property `isDestructive` (`boolean`) storing is destructive (default: `false`).
   * @zh 是否将确认按钮渲染为破坏性操作样式（如红色警示色）。
   * @zh 是否将确认按钮渲染为破坏性操作样式（如红色警示色）。
   */
  isDestructive = false;

  /**
   * Creates an instance of `ConfirmDialogComponent` and initializes its dependencies and internal state.
   * @zh 创建 `ConfirmDialogComponent` 实例，并初始化其依赖项与内部状态。
   * @param _dialogRef - Injected or initial dialog ref (`MatDialogRef<ConfirmDialogComponent>`) / 注入或传入的对话框引用（`MatDialogRef<ConfirmDialogComponent>`）
   */
  constructor(private _dialogRef: MatDialogRef<ConfirmDialogComponent>) {}

  /**
   * Closes the dialog, resolving with `false`.
   * @zh 关闭对话框，返回结果 `false`。
   */
  cancel(): void {
    this._dialogRef.close(false);
  }

  /**
   * Closes the dialog, resolving with `true`.
   * @zh 关闭对话框，返回结果 `true`。
   */
  accept(): void {
    this._dialogRef.close(true);
  }
}
