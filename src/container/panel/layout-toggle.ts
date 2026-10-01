import { Input, HostListener, Renderer2, ElementRef, AfterViewInit, OnDestroy, Directive } from '@angular/core';
import { CanDisable, mixinDisabled } from '@angular/material/core';

import { Subscription } from 'rxjs';

export interface ILayoutTogglable {
  opened: boolean;

}

export class LayoutToggleBase { }

/* tslint:disable-next-line */
export const _DuiLayoutToggleMixinBase = mixinDisabled(LayoutToggleBase);

@Directive()
export abstract class LayoutToggle extends _DuiLayoutToggleMixinBase implements AfterViewInit, OnDestroy, CanDisable {

  private _toggleSubs: Subscription;

  private _initialized: boolean = false;

  private _hideWhenOpened: boolean = false;


  @Input('hideWhenOpened')
  set hideWhenOpened(hideWhenOpened: boolean) {
    this._hideWhenOpened = hideWhenOpened;
    if (this._initialized) {
      this._toggleVisibility();
    }
  }

  constructor(protected _panel: ILayoutTogglable,
    private _renderer: Renderer2,
    private _elementRef: ElementRef) {
    super();
    this._renderer.addClass(this._elementRef.nativeElement, 'dui-layout-menu-button');
  }

  ngAfterViewInit(): void {
    this._initialized = true;
    // if (this._panel.sidenav && this._panel.sidenav.first) {
    //   let sidenav = this._panel.sidenav.first.sidenav;
    //   if (sidenav) {
    //     this._toggleSubs = sidenav._animationStarted.subscribe(() => {
    //       this._toggleVisibility();
    //     });
    //     this._toggleVisibility();
    //   }
    // }
  }

  ngOnDestroy(): void {
    if (this._toggleSubs) {
      this._toggleSubs.unsubscribe();
      this._toggleSubs = undefined;
    }
  }

  /**
   * Listens to host click event to trigger the layout toggle
   */
  @HostListener('click', ['$event'])
  clickListener(event: Event): void {
    event.preventDefault();
    if (!this.disabled) {
      this.onClick();
    }
  }

  abstract onClick(): void;

  private _toggleVisibility(): void {
    // let sidenav = this._panel.sidenav.first.sidenav;
    // if (sidenav.opened && this._hideWhenOpened) {
    //   this._renderer.setStyle(this._elementRef.nativeElement, 'display', 'none');
    // } else {
    //   this._renderer.setStyle(this._elementRef.nativeElement, 'display', '');
    // }
  }
}
