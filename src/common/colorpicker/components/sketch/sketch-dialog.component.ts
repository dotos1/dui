/**
 * @fileoverview Module `src/common/colorpicker/components/sketch/sketch-dialog.component.ts` providing sketch dialog component definitions and implementation.
 * @zh 模块文件 `src/common/colorpicker/components/sketch/sketch-dialog.component.ts`，提供sketch对话框组件相关的定义与实现。
 */


import {  ChangeDetectionStrategy,  Component,  Input, ViewChild,
} from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { SketchComponent} from './sketch.component'
/**
 * Angular component `SketchDialogComponent` (selector: 'color-sketch-dialog') providing sketch dialog component presentation and interaction in `src/common/colorpicker/components/sketch`.
 * @zh Angular 组件 `SketchDialogComponent`（selector: 'color-sketch-dialog'），提供Sketch对话框组件的视图渲染与交互逻辑（位于 `src/common/colorpicker/components/sketch`）。
 */
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
  host: { 'hostID': 'sketch-dialog-' + Math.random().toString(36).substring(2, 15) },
  standalone: false
})
/**
 * A Material dialog wrapping a {@link SketchComponent} color picker with cancel/accept actions.
 * @zh 一个 Material 对话框，内嵌 {@link SketchComponent} 颜色选择器，带取消/确认操作。
 */
export class SketchDialogComponent  {
  /**
   * @zh 内嵌的 {@link SketchComponent} 实例引用。
   * @zh 内嵌的 {@link SketchComponent} 实例引用。
   */
  @ViewChild(SketchComponent) sc: SketchComponent;


  /**
   * Property `cancelButton` (`string`) storing cancel button (default: `'COMMON.CANCEL'`).
   * @zh 取消按钮的文字（翻译键）。
   * @zh 取消按钮的文字（翻译键）。
   */
  cancelButton: string = 'COMMON.CANCEL';
  /**
   * Property `acceptButton` (`string`) storing accept button (default: `'COMMON.OK'`).
   * @zh 确认按钮的文字（翻译键）。
   * @zh 确认按钮的文字（翻译键）。
   */
  acceptButton: string = 'COMMON.OK';

  /**
   * Creates an instance of `SketchDialogComponent` and initializes its dependencies and internal state.
   * @zh 创建 `SketchDialogComponent` 实例，并初始化其依赖项与内部状态。
   * @param _dialogRef - Injected or initial dialog ref (`MatDialogRef<SketchDialogComponent, any>`) / 注入或传入的对话框引用（`MatDialogRef<SketchDialogComponent, any>`）
   */
  constructor(public _dialogRef: MatDialogRef<SketchDialogComponent>) { }

  /**
   * Executes `handlePickerChange` to handle handle picker change.
   * @zh 内部使用，预留的选择器变化处理钩子（当前为空实现）。
   * @zh 内部使用，预留的选择器变化处理钩子（当前为空实现）。
   */
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
