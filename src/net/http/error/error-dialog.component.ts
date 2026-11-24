/**
 * @fileoverview 严重错误对话框：显示文案、字段明细、请求号，带「复制请求号」「报告问题」。
 * @zh 严重错误对话框组件。
 */

import { ChangeDetectionStrategy, Component, Inject, signal } from '@angular/core';
import { Clipboard } from '@angular/cdk/clipboard';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { PlatformError } from './platform-error';

/** 对话框数据 */
export interface ErrorDialogData {
  error: PlatformError;
  /** 已翻译的文案 */
  texts: { title: string; requestId: string; copy: string; copied: string; report: string; close: string };
  /** 提供时显示「报告问题」按钮 */
  onReport?: (error: PlatformError) => void;
}

/**
 * 严重错误对话框，由 `ErrorNotifyService` 打开。
 * @zh 严重错误对话框。
 */
@Component({
  selector: 'dui-error-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h2 mat-dialog-title>{{ data.texts.title }}</h2>
    <mat-dialog-content class="dui-error-dialog__body">
      <p class="dui-error-dialog__message">{{ data.error.message }}</p>
      @if (data.error.hint) {
        <p class="dui-error-dialog__hint">{{ data.error.hint }}</p>
      }
      @if (data.error.details?.length) {
        <ul class="dui-error-dialog__details">
          @for (d of data.error.details; track $index) {
            <li>{{ d.field ? d.field + '：' : '' }}{{ d.message }}</li>
          }
        </ul>
      }
      @if (data.error.requestId) {
        <p class="dui-error-dialog__rid">{{ data.texts.requestId }}：<code>{{ data.error.requestId }}</code></p>
      }
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      @if (data.error.requestId) {
        <button mat-button type="button" (click)="copy()">{{ copied() ? data.texts.copied : data.texts.copy }}</button>
      }
      @if (data.onReport) {
        <button mat-button type="button" (click)="report()">{{ data.texts.report }}</button>
      }
      <button mat-flat-button type="button" mat-dialog-close>{{ data.texts.close }}</button>
    </mat-dialog-actions>
  `,
  styles: [`
    .dui-error-dialog__body { max-inline-size: 32rem; }
    .dui-error-dialog__message { margin-block: 0 0.5rem; overflow-wrap: anywhere; }
    .dui-error-dialog__hint { margin-block: 0 0.5rem; opacity: 0.75; }
    .dui-error-dialog__details { margin-block: 0 0.5rem; padding-inline-start: 1.25rem; }
    .dui-error-dialog__rid { margin-block: 0; opacity: 0.75; overflow-wrap: anywhere; }
  `]
})
export class ErrorDialogComponent {
  /** 复制成功标记（按钮文案切为「已复制」） */
  readonly copied = signal(false);

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ErrorDialogData,
    private readonly clipboard: Clipboard,
    private readonly ref: MatDialogRef<ErrorDialogComponent>
  ) {}

  /** 复制请求号 */
  copy(): void {
    if (this.data.error.requestId && this.clipboard.copy(this.data.error.requestId)) {
      this.copied.set(true);
    }
  }

  /** 触发「报告问题」钩子并关闭 */
  report(): void {
    this.data.onReport?.(this.data.error);
    this.ref.close('report');
  }
}
