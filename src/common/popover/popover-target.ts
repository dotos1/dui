import { Directive, ElementRef } from '@angular/core';


@Directive({
  selector: 'popover-target, [popoverTarget]',
  exportAs: 'popoverTarget'
})

export class PopoverTarget {
  constructor(public _elementRef: ElementRef) { }
}
