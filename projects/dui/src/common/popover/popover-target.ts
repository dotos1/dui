import { Directive, ElementRef } from '@angular/core';


@Directive({
  selector: 'dui-popover-target, [duiPopoverTarget]',
  exportAs: 'duiPopoverTarget'
})

export class DuiPopoverTarget {
  constructor(public _elementRef: ElementRef) { }
}
