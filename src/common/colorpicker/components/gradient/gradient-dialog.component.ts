/**
 * @fileoverview Module `src/common/colorpicker/components/gradient/gradient-dialog.component.ts` providing gradient dialog component definitions and implementation.
 * @zh 模块文件 `src/common/colorpicker/components/gradient/gradient-dialog.component.ts`，提供渐变对话框组件相关的定义与实现。
 */


import {  ChangeDetectionStrategy,  Component,  Input, ViewChild,
} from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import {GradientComponent} from './gradient.component'

/**
 * Angular component `GradientDialogComponent` (selector: 'color-gradient-dialog') providing gradient dialog component presentation and interaction in `src/common/colorpicker/components/gradient`.
 * @zh Angular 组件 `GradientDialogComponent`（selector: 'color-gradient-dialog'），提供渐变对话框组件的视图渲染与交互逻辑（位于 `src/common/colorpicker/components/gradient`）。
 */
@Component({
  selector: 'color-gradient-dialog',
  template: `
    <color-gradient></color-gradient>
    <button mat-button #closeBtn (click)="cancel()">{{cancelButton}}</button>
    <button mat-button color="accent" #acceptBtn  (click)="accept()">{{acceptButton}}</button>
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
  standalone: false,
  
})
export class GradientDialogComponent  {
  /**
   * Template/content query reference `sc` (`GradientComponent`) targeting sc.
   * @zh 模板/内容视图查询引用 `sc`（`@ViewChild`），指向sc。
   */
  @ViewChild(GradientComponent) sc:GradientComponent;
  /**
   * Input property `width` (`string | number`) configuring width (default: `316`).
   * @zh 输入属性 `width`（类型：`string | number`），用于配置宽度（默认值：`316`）。
   */
  @Input() width: string | number = 316;
  /**
   * Input property `height` (`string | number`) configuring height (default: `16`).
   * @zh 输入属性 `height`（类型：`string | number`），用于配置高度（默认值：`16`）。
   */
  @Input() height: string | number = 16;
  /**
   * Property `cancelButton` (`string`) storing cancel button (default: `'CANCEL'`).
   * @zh 属性 `cancelButton`（类型：`string`），用于存储或配置取消按钮（默认值：`'CANCEL'`）。
   */
  cancelButton: string = 'CANCEL';
  /**
   * Property `acceptButton` (`string`) storing accept button (default: `'ACCEPT'`).
   * @zh 属性 `acceptButton`（类型：`string`），用于存储或配置accept按钮（默认值：`'ACCEPT'`）。
   */
  acceptButton: string = 'ACCEPT';



  /**
   * Creates an instance of `GradientDialogComponent` and initializes its dependencies and internal state.
   * @zh 创建 `GradientDialogComponent` 实例，并初始化其依赖项与内部状态。
   * @param _dialogRef - Injected or initial dialog ref (`MatDialogRef<GradientDialogComponent, any>`) / 注入或传入的对话框引用（`MatDialogRef<GradientDialogComponent, any>`）
   */
  constructor(public _dialogRef: MatDialogRef<GradientDialogComponent>) { }

  /**
   * Executes `handlePickerChange` to handle handle picker change.
   * @zh 执行 `handlePickerChange`，用于连接手柄选择器变更。
   * @param options - { data, event } parameter (`any`) / {data,事件}参数（`any`）
   */
  handlePickerChange({ data, $event }) {
  }
  /**
   * Executes `cancel` to handle cancel.
   * @zh 执行 `cancel`，用于取消。
   */
  cancel(): void {
    this._dialogRef.close(false);
  }

  /**
   * Executes `accept` to handle accept.
   * @zh 执行 `accept`，用于accept。
   */
  accept(): void {
    this._dialogRef.close(this.sc['hex']);
  }
}
