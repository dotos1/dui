import { Directive, ElementRef } from '@angular/core';


/**
 * Marks an element as the positioning target for a {@link PopoverTrigger}, used when the
 * popover should be anchored to an element other than the trigger's own host.
 * @zh 将某个元素标记为 {@link PopoverTrigger} 的定位目标，用于弹出层需要锚定在触发元素之外的其他元素上的场景。
 */
@Directive({
  selector: 'popover-target, [popoverTarget]',
  exportAs: 'popoverTarget'
})

export class PopoverTarget {
  constructor(public _elementRef: ElementRef) { }
}
