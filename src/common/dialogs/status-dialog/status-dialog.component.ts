import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

export type StatusDialogStates = 'error' | 'positive' | 'warning';

export type StatusDialogDetailsLabels = {
  showDetailsLabel: string;
  hideDetailsLabel: string;
};

/**
 * Result/status dialog (error/positive/warning) with an optional collapsible details section;
 * normally opened via {@link DialogService.openStatus}.
 * @zh 结果/状态对话框（error/positive/warning），可选带可折叠的详情区域；
 * 通常通过 {@link DialogService.openStatus} 打开。
 */
@Component({
  selector: 'dui-status-dialog',
  templateUrl: './status-dialog.component.html',
  styleUrls: ['./status-dialog.component.scss'],

})
export class StatusDialogComponent {
  /** @zh 底部关闭按钮的文字。 */
  closeButton?: string = 'CLOSE';
  /** @zh 对话框消息内容。 */
  message?: string;
  /** @zh 对话框状态：`'error'`、`'positive'` 或 `'warning'`。 */
  state?: StatusDialogStates = 'error';
  /** @zh 对话框标题。 */
  title?: string;
  /** @zh 消息之后显示的附加详情内容。 */
  details?: string;
  /** @zh 附加详情区域是否展开。 */
  showDetails? = false;
  /** @zh 展开/收起详情链接的文案。 */
  detailsLabels?: StatusDialogDetailsLabels = {
    showDetailsLabel: 'Show details',
    hideDetailsLabel: 'Hide details',
  };

  constructor(private _dialogRef: MatDialogRef<StatusDialogComponent>) {}

  /**
   * Closes the dialog.
   * @zh 关闭对话框。
   */
  close(): void {
    this._dialogRef.close();
  }

  /**
   * The Material icon name corresponding to the current `state`.
   * @zh 与当前 `state` 对应的 Material 图标名称。
   */
  getStatusIcon(): string {
    switch (this.state) {
      case 'positive':
        return 'check';
      case 'error':
      case 'warning':
        return this.state;
      default:
        return 'error';
    }
  }

  /**
   * Toggles whether the additional details section is shown.
   * @zh 切换附加详情区域的展开/收起状态。
   */
  toggleDetails(): void {
    this.showDetails = !this.showDetails;
  }
}
