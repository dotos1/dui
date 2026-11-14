/**
 * @fileoverview Module `src/ux/iconpicker/text.directive.ts` providing text directive definitions and implementation.
 * @zh 模块文件 `src/ux/iconpicker/text.directive.ts`，提供文本指令相关的定义与实现。
 */

import { Directive, EventEmitter, Input, Output } from '@angular/core';

/**
 * Angular directive `TextDirective` (selector: '[text]') attaching text directive behavior to host DOM elements.
 * @zh Angular 指令 `TextDirective`（selector: '[text]'），为宿主 DOM 元素附加文本指令行为。
 */
@Directive({
  selector: '[text]',
  host    : {
    '(input)': 'changeInput($event.target.value)'
  },
  standalone: false
})
export class TextDirective {
  /**
   * Output event emitter `newValue` (`EventEmitter<any>`) firing when new value occurs.
   * @zh 输出事件 `newValue`（类型：`EventEmitter<any>`），当触发新值时向外发出事件。
   */
  @Output('newValue') newValue = new EventEmitter();
  /**
   * Input property `text` (`any`) configuring text.
   * @zh 输入属性 `text`（类型：`any`），用于配置文本。
   */
  @Input('text') text;

  /**
   * Executes `changeInput` to handle change input.
   * @zh 执行 `changeInput`，用于变更输入属性。
   * @param value - value parameter (`string`) / 值参数（`string`）
   */
  changeInput(value: string) {
    this.newValue.emit(value);
  }
}