import { Directive, HostListener } from '@angular/core';

/**
 * Stops propagation of the native `click` event on the host element.
 * @zh 停止宿主元素上原生 `click` 事件的冒泡传播。
 */
@Directive({
  selector: '[duiStopPropagation]'
})
export class StopPropagationDirective {
  @HostListener('click', ['$event'])
  public onClick(event: any): void {
    event.stopPropagation();
  }
}
