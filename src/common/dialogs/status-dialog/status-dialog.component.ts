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
  // Label of the close button in the footer
  closeButton?: string = 'CLOSE';
  // Message to be displayed in the dialog
  message?: string;
  // State of the status dialog
  state?: StatusDialogStates = 'error';
  // Title of the status dialog
  title?: string;
  // Additional details to be displayed after the dialog message
  details?: string;
  // Toggles the additional details section
  showDetails? = false;
  // Labels for the toggle details link
  detailsLabels?: StatusDialogDetailsLabels = {
    showDetailsLabel: 'Show details',
    hideDetailsLabel: 'Hide details',
  };

  constructor(private _dialogRef: MatDialogRef<StatusDialogComponent>) {}

  close(): void {
    this._dialogRef.close();
  }

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

  toggleDetails(): void {
    this.showDetails = !this.showDetails;
  }
}
