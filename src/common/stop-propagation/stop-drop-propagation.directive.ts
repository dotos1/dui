import { Directive, HostListener } from '@angular/core';

/**
 * Prevents the default action and stops propagation of the native `drop` event on the host element.
 * @zh 阻止宿主元素上原生 `drop` 事件的默认行为并停止其冒泡传播。
 */
@Directive({
  selector: '[duiStopDropPropagation]'
})
export class StopDropPropagationDirective {
  /**
   * Handles the native `drop` event: prevents its default action and stops propagation.
   * @zh 处理原生 `drop` 事件：阻止其默认行为并停止冒泡传播。
   */
  @HostListener('drop', ['$event'])
  public onDrop(event: any): void {
    event.preventDefault();
    event.stopPropagation();
  }
}
