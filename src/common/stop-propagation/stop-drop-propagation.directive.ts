import { Directive, HostListener } from '@angular/core';

/**
 * Prevents the default action and stops propagation of the native `drop` event on the host element.
 * @zh 阻止宿主元素上原生 `drop` 事件的默认行为并停止其冒泡传播。
 */
@Directive({
  selector: '[duiStopDropPropagation]'
})
export class StopDropPropagationDirective {
  @HostListener('drop', ['$event'])
  public onDrop(event: any): void {
    event.preventDefault();
    event.stopPropagation();
  }
}
