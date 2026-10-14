import {
  Directive,
  Input,
  OnDestroy,
  TemplateRef,
  ViewContainerRef,
  Renderer2,
  NgZone,
} from '@angular/core';

const EASE_ACCELERATION = 1.005;

@Directive({
  selector: '[treeAnimateOpen]',
})
export class TreeAnimateOpenDirective implements OnDestroy {
  private _isOpen: boolean;
  private _timeoutId: any;
  private _intervalId: any;

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
    private viewContainerRef: ViewContainerRef,
    private ngZone: NgZone,
  ) {}

  ngOnDestroy() {
    this._clearTimers();
  }

  private _clearTimers() {
    if (this._timeoutId) {
      clearTimeout(this._timeoutId);
      this._timeoutId = null;
    }
    if (this._intervalId) {
      clearInterval(this._intervalId);
      this._intervalId = null;
    }
  }

  private _show() {
    if (this.innerElement) {
        this.renderer.removeStyle(this.innerElement, 'display');
      return;
    }
    this.innerElement = this.viewContainerRef.createEmbeddedView(
      this.templateRef,
    ).rootNodes[0];
  }

  private _hide() {
    this._clearTimers();
     if (this.innerElement) {
      this.renderer.setStyle(this.innerElement, 'display', 'none');
      this.renderer.removeStyle(this.innerElement, 'max-height');
    }
  }

  private _animateOpen() {
    this._clearTimers();
    let delta = this.animateSpeed;
    let ease = this.animateAcceleration;
    let maxHeight = 0;

    this.renderer.setStyle(this.innerElement, 'max-height', 'none');
    const targetHeight = this.innerElement.scrollHeight|| 0;;
    this.renderer.setStyle(this.innerElement, 'max-height', '0px');

  
    this.ngZone.runOutsideAngular(() => {
      this._timeoutId = setTimeout(() => {
        this._timeoutId = null;
        // Allow inner element to create its content
        this._intervalId = setInterval(() => {
          if (!this._isOpen || !this.innerElement) {
            return this._clearTimers();
          }

          maxHeight += delta;
          const roundedMaxHeight = Math.round(maxHeight);

          this.renderer.setStyle(
            this.innerElement,
            'max-height',
            `${roundedMaxHeight}px`,
          );

          delta *= ease;
          ease *= EASE_ACCELERATION;
          if (roundedMaxHeight >= targetHeight) {
            this.renderer.removeStyle(this.innerElement, 'max-height');
            this._clearTimers();
          }
        }, 16);
      });
    });
  }

  private _animateClose() {
    this._clearTimers();
    if (!this.innerElement) {
      return;
    }

    let delta = this.animateSpeed;
    let ease = this.animateAcceleration;
    let height = this.innerElement.getBoundingClientRect().height; // TBD use renderer

    // slowly decrease maxHeight to 0, starting from current height
    this.ngZone.runOutsideAngular(() => {
      this._intervalId = setInterval(() => {
        if (this._isOpen || !this.innerElement) {
          return this._clearTimers();
        }

        height -= delta;
        this.renderer.setStyle(this.innerElement, 'max-height', `${height}px`);
        delta *= ease;
        ease *= EASE_ACCELERATION;

        if (height <= 0) {
          this._clearTimers();
          this.ngZone.run(() => {
             this._hide();
          });
        }
      }, 16);
    });
  }
}
