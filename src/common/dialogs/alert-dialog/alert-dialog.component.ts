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
  title?: string;
  message?: string;
  closeButton?: string = 'CLOSE';

  constructor(private _dialogRef: MatDialogRef<AlertDialogComponent>) {}

  close(): void {
    this._dialogRef.close();
  }
}
