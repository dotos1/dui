import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[toastContainer]',
  exportAs: 'toastContainer',
  standalone: true
})
export class ToastContainerDirective {
  constructor(private el: ElementRef) { }
  /**
   * Returns the host element to use as a custom toast container.
   * @zh 返回用作自定义提示容器的宿主元素。
   */
  getContainerElement(): HTMLElement {
    return this.el.nativeElement;
  }
}
