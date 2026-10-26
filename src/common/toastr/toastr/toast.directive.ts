/**
 * @fileoverview Module `src/common/toastr/toastr/toast.directive.ts` providing toast directive definitions and implementation.
 * @zh 模块文件 `src/common/toastr/toastr/toast.directive.ts`，提供toast指令相关的定义与实现。
 */

import { Directive, ElementRef } from '@angular/core';

/**
 * Angular directive `ToastContainerDirective` (selector: '[toastContainer]') attaching toast container directive behavior to host DOM elements.
 * @zh Angular 指令 `ToastContainerDirective`（selector: '[toastContainer]'），为宿主 DOM 元素附加Toast容器指令行为。
 */
@Directive({
  selector: '[toastContainer]',
  exportAs: 'toastContainer',
  standalone: true
})
export class ToastContainerDirective {
  /**
   * Creates an instance of `ToastContainerDirective` and initializes its dependencies and internal state.
   * @zh 创建 `ToastContainerDirective` 实例，并初始化其依赖项与内部状态。
   * @param el - Injected or initial el (`ElementRef`) / 注入或传入的DOM元素（`ElementRef`）
   */
  constructor(private el: ElementRef) { }
  /**
   * Returns the host element to use as a custom toast container.
   * @zh 返回用作自定义提示容器的宿主元素。
   */
  getContainerElement(): HTMLElement {
    return this.el.nativeElement;
  }
}
