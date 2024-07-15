

import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[dui-card-view-content-proxy]'
})
export class CardViewContentProxyDirective {
  constructor(public viewContainerRef: ViewContainerRef) { }
}
