/**
 * @fileoverview Module `src/form/directive/auto-trim.directive.ts` providing auto trim directive definitions and implementation.
 * @zh 模块文件 `src/form/directive/auto-trim.directive.ts`，提供自动去除首尾空白指令相关的定义与实现。
 */

import { Directive } from '@angular/core';
import { HostListener, Host, Optional } from '@angular/core';
import { NgModel } from '@angular/forms';

/**
 * Angular directive `AutoTrimDirective` (selector: '[duiAutoTrim]') attaching auto trim directive behavior to host DOM elements.
 * @zh Angular 指令 `AutoTrimDirective`（selector: '[duiAutoTrim]'），为宿主 DOM 元素附加自动去除首尾空白指令行为。
 */
@Directive({
  selector: '[duiAutoTrim]',
  
})
export class AutoTrimDirective {

  /**
   * Creates an instance of `AutoTrimDirective` and initializes its dependencies and internal state.
   * @zh 创建 `AutoTrimDirective` 实例，并初始化其依赖项与内部状态。
   * @param _model - Injected or initial model (`NgModel`) / 注入或传入的模型（`NgModel`）
   */
  constructor(@Optional() @Host() private _model: NgModel) { }

  /**
   * Listens to host's (blur) event and trims value.

   * @zh 宿主事件监听方法 `onBlur`，响应 `blur` 事件以处理当失焦。
   */
  @HostListener('blur', ['$event'])
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onBlur(event: Event): void {
    if (this._model && this._model.value && typeof (this._model.value) === 'string') {
      this._model.update.emit(this._model.value.trim());
    }
  }
}
