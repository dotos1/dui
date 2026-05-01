import { Directive, Input, TemplateRef, ViewContainerRef, Renderer2 } from '@angular/core';

const EASE_ACCELERATION = 1.005;

@Directive({
  selector: '[treeAnimateOpen]',
  
})
export class TreeAnimateOpenDirective {
  private _isOpen: boolean;

  @Input('treeAnimateOpenSpeed') animateSpeed: number;
  @Input('treeAnimateOpenAcceleration') animateAcceleration: number;
  @Input('treeAnimateOpenEnabled') isEnabled: boolean;

  @Input('treeAnimateOpen')
  set isOpen(value: boolean) {
    if (value) {
      this._show();
      if (this.isEnabled && this._isOpen === false) {
        this._animateOpen();
      }
    } else {
      this.isEnabled ? this._animateClose() : this._hide();
    }
    this._isOpen = !!value;
  }

  private innerElement: any;

  constructor(
    private renderer: Renderer2,
    private templateRef: TemplateRef<any>,
    private viewContainerRef: ViewContainerRef) { }

  private _show() {
    if (this.innerElement) { return; }
    this.innerElement = this.viewContainerRef.createEmbeddedView(this.templateRef).rootNodes[0];
  }

  private _hide() {
    this.viewContainerRef.clear();
    this.innerElement = null;
  }

  private _animateOpen() {
    let delta = this.animateSpeed;
    let ease = this.animateAcceleration;
    let maxHeight = 0;

   this.renderer.setStyle(this.innerElement, 'max-height', 'none');
    const targetHeight = this.innerElement.scrollHeight; 
    this.renderer.setStyle(this.innerElement, 'max-height', '0px');

    // increase maxHeight until height doesn't change
    setTimeout(() => { // Allow inner element to create its content
      const i = setInterval(() => {
        if (!this._isOpen || !this.innerElement) { return clearInterval(i); }

        maxHeight += delta;
        const roundedMaxHeight = Math.round(maxHeight);

        this.renderer.setStyle(this.innerElement, 'max-height', `${roundedMaxHeight}px`);

        delta *= ease;
        ease *= EASE_ACCELERATION;
       if (roundedMaxHeight >= targetHeight) {
          this.renderer.removeStyle(this.innerElement, 'max-height');
          clearInterval(i);
        }
      }, 16);
    });
  }

  private _animateClose() {
    if (!this.innerElement) { return; }

    let delta = this.animateSpeed;
    let ease = this.animateAcceleration;
    let height = this.innerElement.getBoundingClientRect().height; // TBD use renderer

    // slowly decrease maxHeight to 0, starting from current height
    const i = setInterval(() => {
      if (this._isOpen || !this.innerElement) { return clearInterval(i); }

      height -= delta;
      this.renderer.setStyle(this.innerElement, 'max-height', `${height}px`);
      delta *= ease;
      ease *= EASE_ACCELERATION;

      if (height <= 0) {
        // after animation complete - remove child element
        this.viewContainerRef.clear();
        this.innerElement = null;
        clearInterval(i);
      }
    }, 17);
  }
}
