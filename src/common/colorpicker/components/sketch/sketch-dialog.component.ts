
import {  ChangeDetectionStrategy,  Component,  Input, ViewChild,
} from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { SketchComponent} from './sketch.component'
@Component({
  selector: 'color-sketch-dialog',
  template: `
     <mat-dialog-content>
      <color-sketch></color-sketch>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button #closeBtn (click)="cancel()">{{cancelButton|translate}}</button>
      <button mat-button color="accent" #acceptBtn  (click)="accept()">{{acceptButton|translate}}</button>
    </mat-dialog-actions>
  `,
  styles: [ 
    `
    .shade-slider {
      position: relative;
    }
  `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false,
  host: { 'hostID': 'sketch-dialog-' + Math.random().toString(36).substring(2, 15) }
})
/**
 * A Material dialog wrapping a {@link SketchComponent} color picker with cancel/accept actions.
 * @zh 一个 Material 对话框，内嵌 {@link SketchComponent} 颜色选择器，带取消/确认操作。
 */
export class SketchDialogComponent  {
  /** @zh 内嵌的 {@link SketchComponent} 实例引用。 */
  @ViewChild(SketchComponent) sc: SketchComponent;


  /** @zh 取消按钮的文字（翻译键）。 */
  cancelButton: string = 'COMMON.CANCEL';
  /** @zh 确认按钮的文字（翻译键）。 */
  acceptButton: string = 'COMMON.OK';

  constructor(public _dialogRef: MatDialogRef<SketchDialogComponent>) { }

  /** @zh 内部使用，预留的选择器变化处理钩子（当前为空实现）。 */
  handlePickerChange({ data, $event }) {
  }
  /**
   * Closes the dialog, resolving with `false`.
   * @zh 关闭对话框，返回结果 `false`。
   */
  cancel(): void {
    this._dialogRef.close(false);
  }

  /**
   * Closes the dialog, resolving with the selected hex color.
   * @zh 关闭对话框，返回选中的十六进制颜色值。
   */
  accept(): void {
    this._dialogRef.close(this.sc.hex);
  }
}
