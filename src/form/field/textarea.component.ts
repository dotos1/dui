/**
 * @fileoverview Module `src/form/field/textarea.component.ts` providing textarea component definitions and implementation.
 * @zh 模块文件 `src/form/field/textarea.component.ts`，提供textarea组件相关的定义与实现。
 */

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TextFieldComponent } from './textfield.component';
import { MAT_INPUT_VALUE_ACCESSOR } from '@angular/material/input';

/**
 * Angular component `TextAreaComponent` (selector: 'textarea-field') providing text area component presentation and interaction in `src/form/field`.
 * @zh Angular 组件 `TextAreaComponent`（selector: 'textarea-field'），提供文本区域组件的视图渲染与交互逻辑（位于 `src/form/field`）。
 */
@Component({
  selector: 'textarea-field',
  templateUrl: './textarea.component.html',
  providers: [
    { provide: MAT_INPUT_VALUE_ACCESSOR, useExisting: TextAreaComponent },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host:{
    hostID: 'textarea-field' + Math.random().toString(36).substring(2, 15),
  },
  standalone: false
})
export class TextAreaComponent extends TextFieldComponent {
  /**
   * Property `defaultOptions` (`{ cols: number; rows: number; }`) storing default options (default: `{ cols: 1, rows: 3, }`).
   * @zh 属性 `defaultOptions`（类型：`{ cols: number; rows: number; }`），用于存储或配置默认配置选项（默认值：`{ cols: 1, rows: 3, }`）。
   */
  override defaultOptions = {
    cols: 1,
    rows: 3,
  };
}
