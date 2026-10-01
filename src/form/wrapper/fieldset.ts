import { Component, Input, Output, EventEmitter, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'dui-fieldset',
  template: `
        <fieldset [ngClass]="{'dui-fieldset widget widget-content dui-corner-all': true, 'dui-fieldset-toggleable': toggleable}" [ngStyle]="style" [class]="styleClass">
            <legend class="dui-fieldset-legend dui-corner-all dui-state-default dui-unselectable-text" (click)="toggle($event)">
                <span *ngIf="toggleable" class="dui-fieldset-toggler fa fa-w" [ngClass]="{'fa-minus': !collapsed,'fa-plus':collapsed}"></span>
                {{legend|translate}}
                <ng-content select="p-header"></ng-content>
            </legend>
            <div class="dui-fieldset-content-wrapper" [@fieldsetContent]="collapsed ? 'hidden' : 'visible'"
                        [ngClass]="{'dui-fieldset-content-wrapper-overflown': collapsed||animating}"
                         (@fieldsetContent.done)="onToggleDone($event)">
                <div class="dui-fieldset-content">
                    <ng-content></ng-content>
                </div>
            </div>
        </fieldset>
    `,
  animations: [
    trigger('fieldsetContent', [
      state('hidden', style({
        height: '0px'
      })),
      state('visible', style({
        height: '*'
      })),
      transition('visible => hidden', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)')),
      transition('hidden => visible', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)'))
    ])
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    hostID: 'dui-fieldset' + Math.random().toString(36).substring(2, 15),
  }
})
export class Fieldset {

  @Input() legend: string;

  @Input() toggleable: boolean;

  @Input() collapsed: boolean = false;

  @Output() onBeforeToggle: EventEmitter<any> = new EventEmitter();

  @Output() onAfterToggle: EventEmitter<any> = new EventEmitter();

  @Input() style: any;

  @Input() styleClass: string;

  public animating: boolean;

  constructor(private el: ElementRef) { }

  toggle(event) {
    if (this.toggleable) {
      if (this.animating) {
        return ;
      }

      this.animating = true;
      this.onBeforeToggle.emit({ originalEvent: event, collapsed: this.collapsed });

      if (this.collapsed) {
        this.expand(event);
      } else {
        this.collapse(event);
      }

      this.onAfterToggle.emit({ originalEvent: event, collapsed: this.collapsed });
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  expand(event) {
    this.collapsed = false;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  collapse(event) {
    this.collapsed = true;
  }
  getBlockableElement(): HTMLElement {
    return this.el.nativeElement.children[0];
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onToggleDone(event) {
    this.animating = false;
  }
}
