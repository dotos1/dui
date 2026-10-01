import { Directive, Input, Renderer2, ElementRef, Inject, forwardRef } from '@angular/core';
import { PanelComponent } from './panel.component';
import { LayoutToggle } from './layout-toggle';

@Directive({
  selector: '[duiLayoutToggle]',
})
export class DuiLayoutToggleDirective extends LayoutToggle {

  @Input('duiLayoutToggle')
  set duiLayoutToggle(duiLayoutToggle: boolean) {
    this.disabled = !(<any>duiLayoutToggle === '' || duiLayoutToggle);
  }

  constructor(@Inject(forwardRef(() => PanelComponent)) panel: PanelComponent,
    renderer: Renderer2,
    elementRef: ElementRef) {
    super(panel, renderer, elementRef);
  }

  onClick(): void {
    // this._panel.toggle();
  }
}

@Directive({
  selector: '[duiLayoutClose]',
})
export class DuiLayoutCloseDirective extends LayoutToggle {

  @Input('duiLayoutClose')
  set duiLayoutClose(duiLayoutClose: boolean) {
    this.disabled = !(<any>duiLayoutClose === '' || duiLayoutClose);
  }

  constructor(@Inject(forwardRef(() => PanelComponent)) panel: PanelComponent,
    renderer: Renderer2,
    elementRef: ElementRef) {
    super(panel, renderer, elementRef);
  }

  onClick(): void {
    // this._panel.collapse();
  }
}

@Directive({
  selector: '[duiLayoutOpen]',
})
export class DuiLayoutOpenDirective extends LayoutToggle {

  @Input('duiLayoutOpen')
  set duiLayoutClose(duiLayoutOpen: boolean) {
    this.disabled = !(<any>duiLayoutOpen === '' || duiLayoutOpen);
  }

  constructor(@Inject(forwardRef(() => PanelComponent)) panel: PanelComponent,
    renderer: Renderer2,
    elementRef: ElementRef) {
    super(panel, renderer, elementRef);
  }

  onClick(): void {
    //  this._panel.expand();
  }
}
