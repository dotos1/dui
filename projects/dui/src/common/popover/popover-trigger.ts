import {
  AfterViewInit,
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  Optional,
  Output,
  ViewContainerRef,
  HostListener,
  ChangeDetectorRef,
  Renderer2,
  Inject,
} from '@angular/core';

import { isFakeMousedownFromScreenReader } from '@angular/cdk/a11y';
import { Direction, Directionality } from '@angular/cdk/bidi';
import {
  Overlay,
  OverlayRef,
  OverlayConfig,
  HorizontalConnectionPos,
  VerticalConnectionPos,
  FlexibleConnectedPositionStrategy,
  ScrollStrategy
} from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';

import { Subject, Subscription } from 'rxjs';

import { DuiPopoverPanel, DuiTarget } from './popover-interfaces';
import { DuiPopoverPositionX, DuiPopoverPositionY, DuiPopoverTriggerEvent, DuiPopoverScrollStrategy } from './popover-types';
import { throwDuiPopoverMissingError } from './popover-errors';
import { takeUntil } from 'rxjs/operators';
import { DOCUMENT } from '@angular/common';


@Directive({
  selector: '[duiPopoverTriggerFor]',
  exportAs: 'duiPopoverTrigger'
})
export class DuiPopoverTrigger implements AfterViewInit, OnDestroy {

  popoverOpened = new Subject<void>();
  popoverClosed = new Subject<void>();

  private _portal: TemplatePortal<any>;
  private _overlayRef: OverlayRef | null = null;
  private _popoverOpen = false;
  private _halt = false;
  private _backdropSubscription: Subscription;
  private _positionSubscription: Subscription;
  private _detachmentsSubscription: Subscription;

  private _mouseoverTimer: any;

  private _openedByMouse = false;

  private _onDestroy = new Subject<void>();

  /** References the popover instance that the trigger is associated with. */
  @Input('duiPopoverTriggerFor') popover: DuiPopoverPanel;

  /** References the popover target instance that the trigger is associated with. */
  @Input('duiPopoverTargetAt') targetElement: DuiTarget;

  /** Position of the popover in the X axis */
  @Input('duiPopoverPositionX') positionX: DuiPopoverPositionX;

  /** Position of the popover in the Y axis */
  @Input('duiPopoverPositionY') positionY: DuiPopoverPositionY;

  /** Popover trigger event */
  @Input('duiPopoverTriggerOn') triggerEvent: DuiPopoverTriggerEvent;

  /** Popover delay */
  @Input('duiPopoverEnterDelay') enterDelay: number;

  /** Popover delay */
  @Input('duiPopoverLeaveDelay') leaveDelay: number;

  /** Popover overlap trigger */
  @Input('duiPopoverOverlapTrigger') overlapTrigger: boolean;

  /** Popover target offset x */
  @Input('duiPopoverOffsetX') targetOffsetX: number;

  /** Popover target offset y */
  @Input('duiPopoverOffsetY') targetOffsetY: number;

  /** Popover arrow offset x */
  @Input('duiPopoverArrowOffsetX') arrowOffsetX: number;


  /** Popover arrow width */
  @Input('duiPopoverArrowWidth') arrowWidth: number;


  /** Popover arrow color */
  @Input('duiPopoverArrowColor') arrowColor: string;


  /** Popover container close on click */
  @Input('duiPopoverCloseOnClick') closeOnClick: boolean;


  /** Popover backdrop close on click */
  @Input('duiPopoverBackdropCloseOnClick') backdropCloseOnClick = true;

  @Input('showPopOver') showPopOver: boolean=true;

  @Output() opened = new EventEmitter<void>();

  @Output() closed = new EventEmitter<void>();


  constructor(
            private renderer: Renderer2,
            private _overlay: Overlay, public _elementRef: ElementRef,
            private _viewContainerRef: ViewContainerRef,
            @Optional() private _dir: Directionality,
            private _changeDetectorRef: ChangeDetectorRef,
            @Inject(DOCUMENT) private _document: HTMLDocument) { }

  ngAfterViewInit() {
      this._checkPopover();
      this._setCurrentConfig();
      this.popover.close.subscribe(() => this.closePopover());
  }

  ngOnDestroy() {
    this.destroyPopover();
  }

  private _setCurrentConfig() {

      if (this.positionX === 'before' || this.positionX === 'after') {
        this.popover.positionX = this.positionX;
      }

      if (this.positionY === 'above' || this.positionY === 'below') {
        this.popover.positionY = this.positionY;
      }

      if (this.triggerEvent) {
          this.popover.triggerEvent = this.triggerEvent;
      }

      if (this.enterDelay) {
        this.popover.enterDelay = this.enterDelay;
      }

      if (this.leaveDelay) {
        this.popover.leaveDelay = this.leaveDelay;
      }

      if (this.overlapTrigger === true || this.overlapTrigger === false) {
          this.popover.overlapTrigger = this.overlapTrigger;
      }

      if (this.targetOffsetX) {
          this.popover.targetOffsetX = this.targetOffsetX;
      }

      if (this.targetOffsetY) {
          this.popover.targetOffsetY = this.targetOffsetY;
      }

      if (this.arrowOffsetX) {
          this.popover.arrowOffsetX = this.arrowOffsetX;
      }

      if (this.arrowWidth) {
          this.popover.arrowWidth = this.arrowWidth;
      }

      if (this.arrowColor) {
          this.popover.arrowColor = this.arrowColor;
      }

      if (this.closeOnClick === true || this.closeOnClick === false) {
          this.popover.closeOnClick = this.closeOnClick;
      }

      this.popover.setCurrentStyles();
  }

  get popoverOpen(): boolean { return this._popoverOpen; }

  @HostListener('click', ['$event'])
  onClick(): void {
    if (this.popover.triggerEvent === 'click') {
      this.togglePopover();
    }
  }

  @HostListener('mouseenter', ['$event'])
  onMouseEnter(): void {
    this._halt = false;
    if (this.popover.triggerEvent === 'hover') {
      this._mouseoverTimer = setTimeout(() => {
        this.openPopover();
      }, this.popover.enterDelay);
    }
  }

  @HostListener('mouseleave', ['$event'])
  onMouseLeave(): void {
    if (this.popover.triggerEvent === 'hover') {
      if (this._mouseoverTimer) {
        clearTimeout(this._mouseoverTimer);
        this._mouseoverTimer = null;
      }
      if (this._popoverOpen) {
        setTimeout(() => {
          if (!this.popover.closeDisabled) {
              this.closePopover();
          }
        }, this.popover.leaveDelay);
      } else {
        this._halt = true;
      }
    }
  }

  togglePopover(): void {
      return this._popoverOpen ? this.closePopover() : this.openPopover();
  }

  openPopover(): void {
    if(this.showPopOver){
      if (!this._popoverOpen && !this._halt) {
        this._createOverlay().attach(this._portal);
        this._subscribeToBackdrop();
        this._subscribeToDetachments();
        this._initPopover();
      }
    }
  }

  closePopover(): void {
      if (this._overlayRef) {
        this._overlayRef.detach();
        this._resetPopover();
      }
  }

  destroyPopover(): void {
      if (this._mouseoverTimer) {
          clearTimeout(this._mouseoverTimer);
          this._mouseoverTimer = null;
      }
      if (this._overlayRef) {
        this._overlayRef.dispose();
        this._overlayRef = null;
        this._cleanUpSubscriptions();
      }

      this._onDestroy.next();
      this._onDestroy.complete();
  }

  focus() {
      this._elementRef.nativeElement.focus();
  }

  get dir(): Direction {
      return this._dir && this._dir.value === 'rtl' ? 'rtl' : 'ltr';
  }


  private _subscribeToBackdrop(): void {
    if (this._overlayRef) {
      if (this.triggerEvent === 'click' && this.backdropCloseOnClick === true) {
        this._overlayRef.backdropClick()
        .pipe(
          takeUntil(this.popoverClosed),
          takeUntil(this._onDestroy),
        )
        .subscribe(() => {
          this.popover._emitCloseEvent();
        });
      }
    }
  }

  private _subscribeToDetachments(): void {
    if (this._overlayRef) {
      this._overlayRef.detachments()
        .pipe(
          takeUntil(this.popoverClosed),
          takeUntil(this._onDestroy),
        )
        .subscribe(() => {
          this._setPopoverClosed();
        });
    }
  }


  private _initPopover(): void {
      this._setPopoverOpened();
  }

  private _resetPopover(): void {
      this._setPopoverClosed();
      if (!this._openedByMouse) {
        this.focus();
      }
      this._openedByMouse = false;
  }

  private _setPopoverOpened(): void {
    if (!this._popoverOpen) {
      this._popoverOpen = true;
      this.popoverOpened.next();
      this.opened.emit()
    }
  }


  private _setPopoverClosed(): void {
    if (this._popoverOpen) {
      this._popoverOpen = false;
      this.popoverClosed.next();
      this.closed.emit();
    }
  }


  private _checkPopover() {
      if (!this.popover) {
        throwDuiPopoverMissingError();
      }
  }


  private _createOverlay(): OverlayRef {
      if (!this._overlayRef) {
        this._portal = new TemplatePortal(this.popover.templateRef, this._viewContainerRef);
        const config = this._getOverlayConfig();
        this.subscribeToPositions(config.positionStrategy as FlexibleConnectedPositionStrategy);
        this._overlayRef = this._overlay.create(config);
        this._overlayRef
      }else{
        this.renderer.setStyle(this._overlayRef.overlayElement, 'transform', "translateX("+this.targetOffsetX+"px) translateY("+this.targetOffsetY+"px)");
        // this._overlayRef.updatePosition();
      }
      return this._overlayRef;
  }


  private _getOverlayConfig(): OverlayConfig {
      const overlayState = new OverlayConfig();
      overlayState.positionStrategy = this.getPosition();
      if (this.triggerEvent === 'click') {
        overlayState.hasBackdrop = true;
        overlayState.backdropClass = 'cdk-overlay-transparent-backdrop';
      }

      overlayState.direction = this.dir;
      overlayState.scrollStrategy = this._getOverlayScrollStrategy(this.popover.scrollStrategy);

      return overlayState;
  }


  private _getOverlayScrollStrategy(strategy: DuiPopoverScrollStrategy): ScrollStrategy {
    switch(strategy) {
      case 'noop':
        console.log('noop');
        return this._overlay.scrollStrategies.noop();
      case 'close':
        return this._overlay.scrollStrategies.close();
      case 'block':
        return this._overlay.scrollStrategies.block();
      case 'reposition':
      default:
        return this._overlay.scrollStrategies.reposition();
    }
  }

  public subscribeToPositions(position: FlexibleConnectedPositionStrategy): void {
      this._positionSubscription = position.positionChanges.subscribe(change => {
          const posisionX: DuiPopoverPositionX = change.connectionPair.overlayX === 'start' ? 'after' : 'before';
          let posisionY: DuiPopoverPositionY = change.connectionPair.overlayY === 'top' ? 'below' : 'above';

          if (!this.popover.overlapTrigger) {
              posisionY = posisionY === 'below' ? 'above' : 'below';
          }

          this._changeDetectorRef.markForCheck();

          this.popover.zone.run(() => {
              this.popover.positionX = posisionX;
              this.popover.positionY = posisionY;
              this.popover.setCurrentStyles();
              this.popover.setPositionClasses(posisionX, posisionY);
          });
      });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  resetPosition(position){
    // setTimeout(()=>{
    //   let elem=document.querySelectorAll('.cdk-overlay-connected-position-bounding-box');
    //   this.renderer.setStyle(elem, 'top', `${position.y}px`);
    // },500);
  }

  public getPosition(): FlexibleConnectedPositionStrategy {
      const [originX, originFallbackX]: HorizontalConnectionPos[] =
        this.popover.positionX === 'before' ? ['end', 'start'] : ['start', 'end'];
      const [overlayY, overlayFallbackY]: VerticalConnectionPos[] =
        this.popover.positionY === 'above' ? ['bottom', 'top'] : ['top', 'bottom'];

      let originY = overlayY;
      let originFallbackY = overlayFallbackY;

      const overlayX = originX;
      const overlayFallbackX = originFallbackX;

      if (!this.popover.overlapTrigger) {
        originY = overlayY === 'top' ? 'bottom' : 'top';
        originFallbackY = overlayFallbackY === 'top' ? 'bottom' : 'top';
      }

      let offsetX = 0;
      let offsetY = 0;

      if (this.popover.targetOffsetX && !isNaN(Number(this.popover.targetOffsetX))) {
        offsetX = Number(this.popover.targetOffsetX);
        // offsetX = -16;
      }

      if (this.popover.targetOffsetY && !isNaN(Number(this.popover.targetOffsetY))) {
        offsetY = Number(this.popover.targetOffsetY);
        // offsetY = -10;
      }

      let element = this._elementRef;
      if (typeof this.targetElement !== 'undefined') {
          this.popover.containerPositioning = true;
          element = this.targetElement._elementRef;
      }

      return this._overlay.position()
        .flexibleConnectedTo(element)
        .withLockedPosition(true)
        .withPositions([
          {
              originX,
              originY,
              overlayX,
              overlayY,
              offsetY
          },
          {
              originX: originFallbackX,
              originY,
              overlayX: overlayFallbackX,
              overlayY,
              offsetY
          },
          {
            originX,
            originY: originFallbackY,
            overlayX,
            overlayY: overlayFallbackY,
            offsetY: -offsetY
          },
          {
            originX: originFallbackX,
            originY: originFallbackY,
            overlayX: overlayFallbackX,
            overlayY: overlayFallbackY,
            offsetY: -offsetY
          }
        ])
        .withDefaultOffsetX(offsetX)
        .withDefaultOffsetY(offsetY);
  }

  private _cleanUpSubscriptions(): void {
      if (this._backdropSubscription) {
          this._backdropSubscription.unsubscribe();
      }
      if (this._positionSubscription) {
          this._positionSubscription.unsubscribe();
      }
      if (this._detachmentsSubscription) {
        this._detachmentsSubscription.unsubscribe();
      }
  }

  @HostListener('mousedown', ['$event']) _handleMousedown(event: MouseEvent): void {
      if (event && !isFakeMousedownFromScreenReader(event)) {
          this._openedByMouse = true;
      }
  }
}
