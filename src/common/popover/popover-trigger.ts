/**
 * @fileoverview Module `src/common/popover/popover-trigger.ts` providing popover trigger definitions and implementation.
 * @zh 模块文件 `src/common/popover/popover-trigger.ts`，提供气泡卡片触发相关的定义与实现。
 */

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
  exportAs: 'popoverTrigger',
  standalone: false
})
export class PopoverTrigger implements AfterViewInit, OnDestroy {

  /**
   * Property `popoverOpened` (`Subject<void>`) storing popover opened (default: `new Subject<void>()`).
   * @zh 弹出层打开时发出。
   * @zh 弹出层打开时发出。
   */
  popoverOpened = new Subject<void>();
  /**
   * Property `popoverClosed` (`Subject<void>`) storing popover closed (default: `new Subject<void>()`).
   * @zh 弹出层关闭时发出。
   * @zh 弹出层关闭时发出。
   */
  popoverClosed = new Subject<void>();

  /**
   * Property `_portal` (`any`) storing portal.
   * @zh 属性 `_portal`（类型：`any`），用于存储或配置传送门容器。
   */
  private _portal;
  /**
   * Property `_overlayRef` (`OverlayRef`) storing overlay ref (default: `null`).
   * @zh 属性 `_overlayRef`（类型：`OverlayRef`），用于存储或配置浮层引用（默认值：`null`）。
   */
  private _overlayRef: OverlayRef | null = null;
  /**
   * Property `_popoverOpen` (`boolean`) storing popover open (default: `false`).
   * @zh 属性 `_popoverOpen`（类型：`boolean`），用于存储或配置气泡卡片打开（默认值：`false`）。
   */
  private _popoverOpen = false;
  /**
   * Property `_halt` (`boolean`) storing halt (default: `false`).
   * @zh 属性 `_halt`（类型：`boolean`），用于存储或配置halt（默认值：`false`）。
   */
  private _halt = false;
  /**
   * Property `_backdropSubscription` (`Subscription`) storing backdrop subscription.
   * @zh 属性 `_backdropSubscription`（类型：`Subscription`），用于存储或配置背景遮罩订阅对象。
   */
  private _backdropSubscription: Subscription;
  /**
   * Property `_positionSubscription` (`Subscription`) storing position subscription.
   * @zh 属性 `_positionSubscription`（类型：`Subscription`），用于存储或配置位置订阅对象。
   */
  private _positionSubscription: Subscription;
  /**
   * Property `_detachmentsSubscription` (`Subscription`) storing detachments subscription.
   * @zh 属性 `_detachmentsSubscription`（类型：`Subscription`），用于存储或配置detachments订阅对象。
   */
  private _detachmentsSubscription: Subscription;

  /**
   * Property `_mouseoverTimer` (`any`) storing mouseover timer.
   * @zh 属性 `_mouseoverTimer`（类型：`any`），用于存储或配置mouseover定时器。
   */
  private _mouseoverTimer;
  /**
   * Property `_mouseleaveTimer` (`any`) storing mouseleave timer.
   * @zh 属性 `_mouseleaveTimer`（类型：`any`），用于存储或配置鼠标离开定时器。
   */
  private _mouseleaveTimer;

  /**
   * Property `_openedByMouse` (`boolean`) storing opened by mouse (default: `false`).
   * @zh 属性 `_openedByMouse`（类型：`boolean`），用于存储或配置是否展开按鼠标（默认值：`false`）。
   */
  private _openedByMouse = false;

  /**
   * Property `_onDestroy` (`Subject<void>`) storing on destroy (default: `new Subject<void>()`).
   * @zh 属性 `_onDestroy`（类型：`Subject<void>`），用于存储或配置当销毁（默认值：`new Subject<void>()`）。
   */
  private _onDestroy = new Subject<void>();

  /**
   * Input property `name` (`string`) configuring name.
   * @zh 触发器实例的名称，供程序化查找/引用使用。
   * @zh 触发器实例的名称，供程序化查找/引用使用。
   */
  @Input('name') name: string;

  /**
   * References the popover instance that the trigger is associated with.
   * @zh 输入属性 `popoverTriggerFor`（类型：`PopoverPanel`），用于配置气泡卡片。
   */
  @Input('popoverTriggerFor') popover: PopoverPanel;

  /**
   * Input property `popoverTargetAt` (`PopoverTargetInterface`) configuring target element.
   * @zh 覆盖用于定位的目标元素（默认使用宿主元素自身）。
   * @zh 覆盖用于定位的目标元素（默认使用宿主元素自身）。
   */
  @Input('popoverTargetAt') targetElement: PopoverTargetInterface;

  /**
   * Position of the popover in the X axis
   * @zh 输入属性 `popoverPositionX`（类型：`PopoverPositionX`），用于配置位置X坐标。
   */
  @Input('popoverPositionX') positionX: PopoverPositionX;

  /**
   * Position of the popover in the Y axis
   * @zh 输入属性 `popoverPositionY`（类型：`PopoverPositionY`），用于配置位置Y坐标。
   */
  @Input('popoverPositionY') positionY: PopoverPositionY;

  /**
   * Popover trigger event
   * @zh 输入属性 `popoverTriggerOn`（类型：`PopoverTriggerEvent`），用于配置触发事件。
   */
  @Input('popoverTriggerOn') triggerEvent: PopoverTriggerEvent;

  /**
   * Popover delay
   * @zh 输入属性 `popoverEnterDelay`（类型：`number`），用于配置进入延迟。
   */
  @Input('popoverEnterDelay') enterDelay: number;

  /**
   * Popover delay
   * @zh 输入属性 `popoverLeaveDelay`（类型：`number`），用于配置离开延迟。
   */
  @Input('popoverLeaveDelay') leaveDelay: number;

  /**
   * Popover overlap trigger
   * @zh 输入属性 `popoverOverlapTrigger`（类型：`boolean`），用于配置overlap触发。
   */
  @Input('popoverOverlapTrigger') overlapTrigger: boolean;

  /**
   * Popover target offset x
   * @zh 输入属性 `popoverOffsetX`（类型：`number`），用于配置目标偏移量X坐标。
   */
  @Input('popoverOffsetX') targetOffsetX: number;

  /**
   * Popover target offset y
   * @zh 输入属性 `popoverOffsetY`（类型：`number`），用于配置目标偏移量Y坐标。
   */
  @Input('popoverOffsetY') targetOffsetY: number;

  /**
   * Popover arrow offset x
   * @zh 输入属性 `popoverArrowOffsetX`（类型：`number`），用于配置箭头偏移量X坐标。
   */
  @Input('popoverArrowOffsetX') arrowOffsetX: number;


  /**
   * Popover arrow width
   * @zh 输入属性 `popoverArrowWidth`（类型：`number`），用于配置箭头宽度。
   */
  @Input('popoverArrowWidth') arrowWidth: number;


  /**
   * Popover arrow color
   * @zh 输入属性 `popoverArrowColor`（类型：`string`），用于配置箭头颜色。
   */
  @Input('popoverArrowColor') arrowColor: string;


  /**
   * Popover container close on click
   * @zh 输入属性 `popoverCloseOnClick`（类型：`boolean`），用于配置关闭当点击。
   */
  @Input('popoverCloseOnClick') closeOnClick: boolean;


  /**
   * Input property `popoverBackdropCloseOnClick` (`boolean`) configuring backdrop close on click (default: `true`).
   * @zh 点击遮罩层（背景）时是否关闭弹出层（仅 `click` 触发方式下的遮罩层）。
   * @zh 点击遮罩层（背景）时是否关闭弹出层（仅 `click` 触发方式下的遮罩层）。
   */
  @Input('popoverBackdropCloseOnClick') backdropCloseOnClick = true;

  /**
   * Input property `showPopOver` (`boolean`) configuring show pop over (default: `true`).
   * @zh 是否允许打开弹出层（`false` 时触发操作不会打开弹出层）。
   * @zh 是否允许打开弹出层（`false` 时触发操作不会打开弹出层）。
   */
  @Input('showPopOver') showPopOver: boolean=true;

  /**
   * Output event emitter `opened` (`EventEmitter<void>`) firing when opened occurs.
   * @zh 弹出层打开时发出。
   * @zh 弹出层打开时发出。
   */
  @Output() opened = new EventEmitter<void>();

  /**
   * Output event emitter `closed` (`EventEmitter<void>`) firing when closed occurs.
   * @zh 弹出层关闭时发出。
   * @zh 弹出层关闭时发出。
   */
  @Output() closed = new EventEmitter<void>();


  /**
   * Creates an instance of `PopoverTrigger` and initializes its dependencies and internal state.
   * @zh 创建 `PopoverTrigger` 实例，并初始化其依赖项与内部状态。
   * @param renderer - Injected or initial renderer (`Renderer2`) / 注入或传入的渲染器（`Renderer2`）
   * @param _overlay - Injected or initial overlay (`Overlay`) / 注入或传入的浮层（`Overlay`）
   * @param _elementRef - Injected or initial element ref (`ElementRef<any>`) / 注入或传入的元素引用（`ElementRef<any>`）
   * @param viewContainerRef - Injected or initial view container ref (`ViewContainerRef`) / 注入或传入的视图容器引用（`ViewContainerRef`）
   * @param _dir - Injected or initial dir (`Directionality`) / 注入或传入的目录（`Directionality`）
   * @param _changeDetectorRef - Injected or initial change detector ref (`ChangeDetectorRef`) / 注入或传入的变更检测器引用（`ChangeDetectorRef`）
   * @param _document - Injected or initial document (`HTMLDocument`) / 注入或传入的文档对象（`HTMLDocument`）
   */
  constructor(
            private renderer: Renderer2,
            private _overlay: Overlay, public _elementRef: ElementRef,
            public viewContainerRef: ViewContainerRef,
            @Optional() private _dir: Directionality,
            private _changeDetectorRef: ChangeDetectorRef,
            @Inject(DOCUMENT) private _document: HTMLDocument) { }

  /**
   * Angular lifecycle hook invoked once after the component's view and child views are initialized.
   * @zh Angular 生命周期钩子：在组件视图及其子视图初始化完成后调用一次。
   */
  ngAfterViewInit() {
      this._checkPopover();
      this._setCurrentConfig();
      this.popover.close
        .pipe(takeUntil(this._onDestroy))
        .subscribe(() => this.closePopover());
  }

  /**
   * Angular lifecycle hook invoked just before the component, directive, or service is destroyed to release subscriptions and resources.
   * @zh Angular 生命周期钩子：在组件、指令或服务销毁前调用，用于释放订阅与清理资源。
   */
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

  /**
   * Executes `_setCurrentConfig` to handle set current config.
   * @zh 执行 `_setCurrentConfig`，用于集合当前配置。
   */
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
  @HostListener('click')
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
  @HostListener('mouseenter')
  onMouseEnter(): void {
    this._halt = false;
    if (this._mouseleaveTimer) {
      clearTimeout(this._mouseleaveTimer);
      this._mouseleaveTimer = null;
    }
    if (this.popover.triggerEvent === 'hover') {
      if (this._mouseoverTimer) {
        clearTimeout(this._mouseoverTimer);
      }
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
  @HostListener('mouseleave')
  onMouseLeave(): void {
    if (this.popover.triggerEvent === 'hover') {
      if (this._mouseoverTimer) {
        clearTimeout(this._mouseoverTimer);
        this._mouseoverTimer = null;
      }
      if (this._popoverOpen) {
        if (this._mouseleaveTimer) {
          clearTimeout(this._mouseleaveTimer);
        }
        this._mouseleaveTimer = setTimeout(() => {
          this._mouseleaveTimer = null;
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
      if (this._mouseleaveTimer) {
          clearTimeout(this._mouseleaveTimer);
          this._mouseleaveTimer = null;
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


  /**
   * Executes `_subscribeToBackdrop` to handle subscribe to backdrop.
   * @zh 执行 `_subscribeToBackdrop`，用于订阅转换为背景遮罩。
   */
  private _subscribeToBackdrop(): void {
    if (this._overlayRef) {
      if ((this.triggerEvent || this.popover.triggerEvent) === 'click' && this.backdropCloseOnClick === true) {
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

  /**
   * Executes `_subscribeToDetachments` to handle subscribe to detachments.
   * @zh 执行 `_subscribeToDetachments`，用于订阅转换为Detachments。
   */
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


  /**
   * Executes `_initPopover` to handle init popover.
   * @zh 执行 `_initPopover`，用于初始化气泡卡片。
   */
  private _initPopover(): void {
      this._setPopoverOpened();
  }

  /**
   * Executes `_resetPopover` to handle reset popover.
   * @zh 执行 `_resetPopover`，用于重置气泡卡片。
   */
  private _resetPopover(): void {
      this._setPopoverClosed();
      if (!this._openedByMouse) {
        this.focus();
      }
      this._openedByMouse = false;
  }

  /**
   * Executes `_setPopoverOpened` to handle set popover opened.
   * @zh 执行 `_setPopoverOpened`，用于集合气泡卡片是否展开。
   */
  private _setPopoverOpened(): void {
    if (!this._popoverOpen) {
      this._popoverOpen = true;
      this.popoverOpened.next();
      this.opened.emit()
    }
  }


  /**
   * Executes `_setPopoverClosed` to handle set popover closed.
   * @zh 执行 `_setPopoverClosed`，用于集合气泡卡片是否关闭。
   */
  private _setPopoverClosed(): void {
    if (this._popoverOpen) {
      this._popoverOpen = false;
      this.popoverClosed.next();
      this.closed.emit();
    }
  }


  /**
   * Executes `_checkPopover` to handle check popover.
   * @zh 执行 `_checkPopover`，用于检查气泡卡片。
   */
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

  /**
   * Executes `_createOverlay` to handle create overlay.
   * @zh 执行 `_createOverlay`，用于创建浮层。
   * @returns Result of type `OverlayRef` / 类型为 `OverlayRef` 的返回值
   */
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


  /**
   * Executes `_getOverlayConfig` to handle get overlay config.
   * @zh 执行 `_getOverlayConfig`，用于获取浮层配置。
   * @returns Result of type `OverlayConfig` / 类型为 `OverlayConfig` 的返回值
   */
  private _getOverlayConfig(): OverlayConfig {
      const overlayState = new OverlayConfig();
      overlayState.positionStrategy = this.getPosition();
      if ((this.triggerEvent || this.popover.triggerEvent) === 'click') {
        overlayState.hasBackdrop = true;
        overlayState.backdropClass = 'cdk-overlay-transparent-backdrop';
      }

      overlayState.direction = this.dir;
      overlayState.scrollStrategy = this._getOverlayScrollStrategy(this.popover.scrollStrategy);

      return overlayState;
  }


  /**
   * Executes `_getOverlayScrollStrategy` to handle get overlay scroll strategy.
   * @zh 执行 `_getOverlayScrollStrategy`，用于获取浮层滚动策略。
   * @param strategy - strategy parameter (`PopoverScrollStrategy`) / 策略参数（`PopoverScrollStrategy`）
   * @returns Result of type `ScrollStrategy` / 类型为 `ScrollStrategy` 的返回值
   */
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

  /**
   * Executes `_cleanUpSubscriptions` to handle clean up subscriptions.
   * @zh 执行 `_cleanUpSubscriptions`，用于清理向上订阅集合。
   */
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

  /**
   * Host event listener `_handleMousedown` handling `mousedown` events for handle mousedown.
   * @zh 宿主事件监听方法 `_handleMousedown`，响应 `mousedown` 事件以处理连接手柄鼠标按下。
   * @param event - event parameter (`MouseEvent`) / 事件参数（`MouseEvent`）
   */
  @HostListener('mousedown', ['$event']) _handleMousedown(event: MouseEvent): void {
      if (event && !isFakeMousedownFromScreenReader(event)) {
          this._openedByMouse = true;
      }
  }
}
