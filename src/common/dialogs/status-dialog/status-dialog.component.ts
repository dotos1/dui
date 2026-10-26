/**
 * @fileoverview Module `src/common/dialogs/status-dialog/status-dialog.component.ts` providing status dialog component definitions and implementation.
 * @zh 模块文件 `src/common/dialogs/status-dialog/status-dialog.component.ts`，提供状态对话框组件相关的定义与实现。
 */

import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

/**
 * Type alias `StatusDialogStates` representing status dialog states (`'error' | 'positive' | 'warning'`).
 * @zh 类型别名 `StatusDialogStates`，表示状态对话框状态（`'error' | 'positive' | 'warning'`）。
 */
export type StatusDialogStates = 'error' | 'positive' | 'warning';

/**
 * Type alias `StatusDialogDetailsLabels` representing status dialog details labels (`{ showDetailsLabel: string; hideDetailsLabel: string; }`).
 * @zh 类型别名 `StatusDialogDetailsLabels`，表示状态对话框详情列表标签（`{ showDetailsLabel: string; hideDetailsLabel: string; }`）。
 */
export type StatusDialogDetailsLabels = {
  /**
   * Property `showDetailsLabel` (`string`) storing show details label.
   * @zh 属性 `showDetailsLabel`（类型：`string`），用于存储或配置显示详情列表标签。
   */
  showDetailsLabel: string;
  /**
   * Property `hideDetailsLabel` (`string`) storing hide details label.
   * @zh 属性 `hideDetailsLabel`（类型：`string`），用于存储或配置隐藏详情列表标签。
   */
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
  /**
   * Property `closeButton` (`string`) storing close button (default: `'CLOSE'`).
   * @zh 底部关闭按钮的文字。
   * @zh 底部关闭按钮的文字。
   */
  closeButton?: string = 'CLOSE';
  /**
   * Property `message` (`string`) storing message.
   * @zh 对话框消息内容。
   * @zh 对话框消息内容。
   */
  message?: string;
  /**
   * Property `state` (`StatusDialogStates`) storing state (default: `'error'`).
   * @zh 对话框状态：`'error'`、`'positive'` 或 `'warning'`。
   * @zh 对话框状态：`'error'`、`'positive'` 或 `'warning'`。
   */
  state?: StatusDialogStates = 'error';
  /**
   * Property `title` (`string`) storing title.
   * @zh 对话框标题。
   * @zh 对话框标题。
   */
  title?: string;
  /**
   * Property `details` (`string`) storing details.
   * @zh 消息之后显示的附加详情内容。
   * @zh 消息之后显示的附加详情内容。
   */
  details?: string;
  /**
   * Property `showDetails` (`boolean`) storing show details (default: `false`).
   * @zh 附加详情区域是否展开。
   * @zh 附加详情区域是否展开。
   */
  showDetails? = false;
  /**
   * Property `detailsLabels` (`StatusDialogDetailsLabels`) storing details labels.
   * @zh 展开/收起详情链接的文案。
   * @zh 展开/收起详情链接的文案。
   */
  detailsLabels?: StatusDialogDetailsLabels = {
    showDetailsLabel: 'Show details',
    hideDetailsLabel: 'Hide details',
  };

  /**
   * Creates an instance of `StatusDialogComponent` and initializes its dependencies and internal state.
   * @zh 创建 `StatusDialogComponent` 实例，并初始化其依赖项与内部状态。
   * @param _dialogRef - Injected or initial dialog ref (`MatDialogRef<StatusDialogComponent>`) / 注入或传入的对话框引用（`MatDialogRef<StatusDialogComponent>`）
   */
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
