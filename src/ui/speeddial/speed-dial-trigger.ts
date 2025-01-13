import { Component, HostBinding, HostListener, Injector, Input, } from '@angular/core';
import { SpeedDialComponent } from './speed-dial';

@Component({
  selector: 'speed-dial-trigger',
  template: `
        <ng-content  *ngIf="type==='mat-fab'" select="[mat-fab]"></ng-content>
        <ng-content *ngIf="type==='mat-mini-fab'" select="[mat-mini-fab]"></ng-content>`,
})
export class SpeedDialTriggerComponent {

  private _parent: SpeedDialComponent;

  @Input() disabled: boolean = false;

  @HostBinding('class.eco-spin') get sp() {
    return this.spin;
  }

  @Input() spin = false;

  @Input() type = "mat-fab";

  constructor(injector: Injector) {
    this._parent = injector.get(SpeedDialComponent);
  }

  @HostListener('click', ['$event'])
  _onClick(event: Event): void {
    if (!this._parent.fixed&&!this.disabled) {
      this._parent.toggle();
      event.stopPropagation();
    }
  }
}
