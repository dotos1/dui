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
  title?: string;
  message?: string;
  cancelButton = 'CANCEL';
  acceptButton = 'ACCEPT';
  isDestructive = false;

  constructor(private _dialogRef: MatDialogRef<ConfirmDialogComponent>) {}

  cancel(): void {
    this._dialogRef.close(false);
  }

  accept(): void {
    this._dialogRef.close(true);
  }
}
