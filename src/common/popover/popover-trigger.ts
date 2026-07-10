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

import { PopoverPanel, PopoverTargetInterface } from './popover-interfaces';
import { PopoverPositionX, PopoverPositionY, PopoverTriggerEvent, PopoverScrollStrategy } from './popover-types';
import { throwPopoverMissingError } from './popover-errors';
import { takeUntil } from 'rxjs/operators';
import { DOCUMENT } from '@angular/common';


/**
 * Attach to any element to open a {@link Popover} on click or hover, positioned relative
 * to the host element via the CDK overlay.
 * @zh 附加到任意元素上，点击或悬停时打开一个 {@link Popover}，通过 CDK overlay 相对宿主元素定位。
 */
@Directive({
  selector: '[popoverTriggerFor]',
  exportAs: 'popoverTrigger'
})
export class PopoverTrigger implements AfterViewInit, OnDestroy {

  /** @zh 弹出层打开时发出。 */
  popoverOpened = new Subject<void>();
  /** @zh 弹出层关闭时发出。 */
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

  /** @zh 触发器实例的名称，供程序化查找/引用使用。 */
  @Input('name') name: string;

  /** References the popover instance that the trigger is associated with. */
  @Input('popoverTriggerFor') popover: PopoverPanel;

  /** @zh 覆盖用于定位的目标元素（默认使用宿主元素自身）。 */
  @Input('popoverTargetAt') targetElement: PopoverTargetInterface;

  /** Position of the popover in the X axis */
  @Input('popoverPositionX') positionX: PopoverPositionX;

  /** Position of the popover in the Y axis */
  @Input('popoverPositionY') positionY: PopoverPositionY;

  /** Popover trigger event */
  @Input('popoverTriggerOn') triggerEvent: PopoverTriggerEvent;

  /** Popover delay */
  @Input('popoverEnterDelay') enterDelay: number;

  /** Popover delay */
  @Input('popoverLeaveDelay') leaveDelay: number;

  /** Popover overlap trigger */
  @Input('popoverOverlapTrigger') overlapTrigger: boolean;

  /** Popover target offset x */
  @Input('popoverOffsetX') targetOffsetX: number;

  /** Popover target offset y */
  @Input('popoverOffsetY') targetOffsetY: number;

  /** Popover arrow offset x */
  @Input('popoverArrowOffsetX') arrowOffsetX: number;


  /** Popover arrow width */
  @Input('popoverArrowWidth') arrowWidth: number;


  /** Popover arrow color */
  @Input('popoverArrowColor') arrowColor: string;


  /** Popover container close on click */
  @Input('popoverCloseOnClick') closeOnClick: boolean;


  /** @zh 点击遮罩层（背景）时是否关闭弹出层（仅 `click` 触发方式下的遮罩层）。 */
  @Input('popoverBackdropCloseOnClick') backdropCloseOnClick = true;

  /** @zh 是否允许打开弹出层（`false` 时触发操作不会打开弹出层）。 */
  @Input('showPopOver') showPopOver: boolean=true;

  /** @zh 弹出层打开时发出。 */
  @Output() opened = new EventEmitter<void>();

  /** @zh 弹出层关闭时发出。 */
  @Output() closed = new EventEmitter<void>();


  constructor(
            private renderer: Renderer2,
            private _overlay: Overlay, public _elementRef: ElementRef,
            public viewContainerRef: ViewContainerRef,
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

  /**
   * Re-validates the associated popover and re-applies this trigger's config onto it.
   * @zh 重新校验关联的弹出层，并将本触发器的配置重新应用到其上。
   */
  public refresh(){
    this._checkPopover();
    this._setCurrentConfig();
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

  /**
   * Whether the associated popover is currently open.
   * @zh 关联的弹出层当前是否处于打开状态。
   */
  get popoverOpen(): boolean { return this._popoverOpen; }

  /**
   * @hidden Handles a click on the host element, toggling the popover when `triggerEvent` is `'click'`.
   * @zh 内部使用，处理宿主元素上的点击事件，当 `triggerEvent` 为 `'click'` 时切换弹出层。
   */
  @HostListener('click', ['$event'])
  onClick(): void {
    if (this.popover.triggerEvent === 'click') {
      this.togglePopover();
    }
  }

  /**
   * @hidden Handles the pointer entering the host element, opening the popover (after
   * `enterDelay`) when `triggerEvent` is `'hover'`.
   * @zh 内部使用，处理指针进入宿主元素，当 `triggerEvent` 为 `'hover'` 时（延迟 `enterDelay` 后）打开弹出层。
   */
  @HostListener('mouseenter', ['$event'])
  onMouseEnter(): void {
    this._halt = false;
    if (this.popover.triggerEvent === 'hover') {
      this._mouseoverTimer = setTimeout(() => {
        this.openPopover();
      }, this.popover.enterDelay);
    }
  }

  /**
   * @hidden Handles the pointer leaving the host element, closing the popover (after
   * `leaveDelay`) when `triggerEvent` is `'hover'`.
   * @zh 内部使用，处理指针离开宿主元素，当 `triggerEvent` 为 `'hover'` 时（延迟 `leaveDelay` 后）关闭弹出层。
   */
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

  /**
   * Toggles the popover open/closed.
   * @zh 切换弹出层的打开/关闭状态。
   */
  togglePopover(): void {
      return this._popoverOpen ? this.closePopover() : this.openPopover();
  }

  /**
   * Opens the popover (if `showPopOver` allows it and it isn't already open).
   * @zh 打开弹出层（若 `showPopOver` 允许且当前尚未打开）。
   */
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

  /**
   * Closes the popover.
   * @zh 关闭弹出层。
   */
  closePopover(): void {
      if (this._overlayRef) {
        this._overlayRef.detach();
        this._resetPopover();
      }
  }

  /**
   * Disposes the popover's overlay and cleans up all subscriptions.
   * @zh 销毁弹出层的 overlay 并清理全部订阅。
   */
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

  /**
   * Focuses the host element.
   * @zh 聚焦宿主元素。
   */
  focus() {
      this._elementRef.nativeElement.focus();
  }

  /**
   * The current bidi text direction (`'ltr'` or `'rtl'`).
   * @zh 当前的双向文字方向（`'ltr'` 或 `'rtl'`）。
   */
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
        throwPopoverMissingError();
      }
  }

  /**
   * Returns the popover content's `TemplatePortal` instance.
   * @zh 返回弹出层内容的 `TemplatePortal` 实例。
   */
  public getPortal(){
    return this._portal;
  }

  private _createOverlay(): OverlayRef {
      if (!this._overlayRef) {
        this._portal = new TemplatePortal(this.popover.templateRef, this.viewContainerRef);
   
        const config = this._getOverlayConfig();
        this.subscribeToPositions(config.positionStrategy as FlexibleConnectedPositionStrategy);
        this._overlayRef = this._overlay.create(config);
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


  private _getOverlayScrollStrategy(strategy: PopoverScrollStrategy): ScrollStrategy {
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

  /**
   * Subscribes to the overlay position strategy's changes, syncing the popover's
   * `positionX`/`positionY`/styles/classes to the resolved connection pair.
   * @zh 订阅 overlay 定位策略的变化，将弹出层的 `positionX`/`positionY`/样式/类名
   * 同步为实际解析出的连接对。
   */
  public subscribeToPositions(position: FlexibleConnectedPositionStrategy): void {
      this._positionSubscription = position.positionChanges.subscribe(change => {
          const posisionX: PopoverPositionX = change.connectionPair.overlayX === 'start' ? 'after' : 'before';
          let posisionY: PopoverPositionY = change.connectionPair.overlayY === 'top' ? 'below' : 'above';

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


  /**
   * Builds the CDK `FlexibleConnectedPositionStrategy` for this trigger's target element,
   * based on the popover's current position/overlap/offset settings.
   * @zh 根据弹出层当前的位置/重叠/偏移设置，为该触发器的目标元素构建 CDK
   * `FlexibleConnectedPositionStrategy` 定位策略。
   */
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
