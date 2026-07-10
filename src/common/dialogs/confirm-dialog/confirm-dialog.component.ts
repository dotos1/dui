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
  /** @zh 对话框标题。 */
  title?: string;
  /** @zh 对话框消息内容。 */
  message?: string;
  /** @zh 取消按钮的文字，默认为 `'CANCEL'`。 */
  cancelButton = 'CANCEL';
  /** @zh 确认按钮的文字，默认为 `'ACCEPT'`。 */
  acceptButton = 'ACCEPT';
  /** @zh 是否将确认按钮渲染为破坏性操作样式（如红色警示色）。 */
  isDestructive = false;

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
