
import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
  ElementRef,
  ChangeDetectionStrategy,
  HostBinding,
  NgZone
} from '@angular/core';

import { AnimationEvent } from '@angular/animations';

import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { ESCAPE } from '@angular/cdk/keycodes';

import { PopoverPositionX, PopoverPositionY, PopoverTriggerEvent, PopoverScrollStrategy } from './popover-types';
import { throwPopoverInvalidPositionX, throwPopoverInvalidPositionY } from './popover-errors';
import { PopoverPanel } from './popover-interfaces';
import { transformPopover } from './popover-animations';


/**
 * The floating panel content of a popover; paired with {@link PopoverTrigger} on a host
 * element to control when/where it opens.
 * @zh 弹出层的浮动面板内容；需要与宿主元素上的 {@link PopoverTrigger} 配合使用，以控制其打开的时机和位置。
 */
@Component({
  selector: 'popover',
  templateUrl: './popover.html',
  styleUrls: ['./popover.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  animations: [
    transformPopover
  ],
  exportAs: 'duiPopover',
  host: {hostID: 'popover' + Math.random().toString(36).substring(2, 15)},

})

export class Popover implements PopoverPanel, OnDestroy {

  /** @zh 内部使用，绑定弹出层宿主的无障碍 `role` 属性。 */
  @HostBinding('attr.role') role = 'dialog';

  /** Settings for popover, view setters and getters for more detail */
  private _positionX: PopoverPositionX = 'after';
  private _positionY: PopoverPositionY = 'below';
  private _triggerEvent: PopoverTriggerEvent = 'hover';
  private _scrollStrategy: PopoverScrollStrategy = 'reposition';
  private _enterDelay = 200;
  private _leaveDelay = 200;
  private _overlapTrigger = true;
  private _disableAnimation = false;
  private _targetOffsetX = 0;
  private _targetOffsetY = 0;
  private _arrowOffsetX = 20;
  private _arrowWidth = 8;
  private _arrowColor = 'rgba(0, 0, 0, 0.12)';
  private _closeOnClick = true;
  private _focusTrapEnabled = true;
  private _focusTrapAutoCaptureEnabled = true;

  /** Config object to be passed into the popover's ngClass
   * @zh 传递给弹出层 `ngClass` 的配置对象。 */
  _classList: {[key: string]: boolean} = {};

  /** Whether the popover's positioning accounts for a containing element rather than the viewport.
   * @zh 弹出层定位时是否考虑所在容器元素，而不是视口。 */
  public containerPositioning = false;

  /** Closing disabled on popover */
  public closeDisabled = false;

  /** Config object to be passed into the popover's arrow ngStyle */
  public popoverPanelStyles: {};

  /** Config object to be passed into the popover's arrow ngStyle */
  public popoverArrowStyles: {};

  /** Config object to be passed into the popover's content ngStyle */
  public popoverContentStyles: {};

  /** Emits the current animation state whenever it changes. */
  _onAnimationStateChange = new EventEmitter<AnimationEvent>();


  /** Position of the popover in the X axis.
   * @zh 弹出层在 X 轴上的位置。 */
  @Input('popoverPositionX')
  get positionX() { return this._positionX; }
  /** Position of the popover in the X axis.
   * @zh 弹出层在 X 轴上的位置。 */
  set positionX(value: PopoverPositionX) {
    if (value !== 'before' && value !== 'after') {
      throwPopoverInvalidPositionX();
    }
    this._positionX = value;
    this.setPositionClasses();
  }

  /** Position of the popover in the Y axis.
   * @zh 弹出层在 Y 轴上的位置。 */
  @Input('popoverPositionY')
  get positionY() { return this._positionY; }
  /** Position of the popover in the Y axis.
   * @zh 弹出层在 Y 轴上的位置。 */
  set positionY(value: PopoverPositionY) {
    if (value !== 'above' && value !== 'below') {
      throwPopoverInvalidPositionY();
    }
    this._positionY = value;
    this.setPositionClasses();
  }

  /** Popover trigger event
   * @zh 触发弹出层显示的事件类型。 */
  @Input('popoverTriggerOn')
  get triggerEvent(): PopoverTriggerEvent { return this._triggerEvent; }
  /** Popover trigger event
   * @zh 触发弹出层显示的事件类型。 */
  set triggerEvent(value: PopoverTriggerEvent) { this._triggerEvent = value; }

  /** Popover scroll strategy
   * @zh 弹出层打开期间滚动页面时的处理策略。 */
  @Input('popoverScrollStrategy')
  get scrollStrategy(): PopoverScrollStrategy { return this._scrollStrategy; }
  /** Popover scroll strategy
   * @zh 弹出层打开期间滚动页面时的处理策略。 */
  set scrollStrategy(value: PopoverScrollStrategy) { this._scrollStrategy = value; }

  /** Popover enter delay
   * @zh 弹出层显示前的延迟时间（毫秒）。 */
  @Input('popoverEnterDelay')
  get enterDelay(): number { return this._enterDelay; }
  /** Popover enter delay
   * @zh 弹出层显示前的延迟时间（毫秒）。 */
  set enterDelay(value: number) { this._enterDelay = value; }

  /** Popover leave delay
   * @zh 弹出层隐藏前的延迟时间（毫秒）。 */
  @Input('popoverLeaveDelay')
  get leaveDelay(): number { return this._leaveDelay; }
  /** Popover leave delay
   * @zh 弹出层隐藏前的延迟时间（毫秒）。 */
  set leaveDelay(value: number) { this._leaveDelay = value; }

  /** Popover overlap trigger
   * @zh 弹出层是否与触发元素重叠显示。 */
  @Input('popoverOverlapTrigger')
  get overlapTrigger(): boolean { return this._overlapTrigger; }
  /** Popover overlap trigger
   * @zh 弹出层是否与触发元素重叠显示。 */
  set overlapTrigger(value: boolean) { this._overlapTrigger = value; }

  /** Popover target offset x
   * @zh 弹出层相对于触发元素在 X 轴上的偏移量。 */
  @Input('popoverOffsetX')
  get targetOffsetX(): number { return this._targetOffsetX; }
  /** Popover target offset x
   * @zh 弹出层相对于触发元素在 X 轴上的偏移量。 */
  set targetOffsetX(value: number) { this._targetOffsetX = value; }

  /** Popover target offset y
   * @zh 弹出层相对于触发元素在 Y 轴上的偏移量。 */
  @Input('popoverOffsetY')
  get targetOffsetY(): number { return this._targetOffsetY; }
  /** Popover target offset y
   * @zh 弹出层相对于触发元素在 Y 轴上的偏移量。 */
  set targetOffsetY(value: number) { this._targetOffsetY = value; }

  /** Popover arrow offset x
   * @zh 箭头指示器在 X 轴上的偏移量。 */
  @Input('popoverArrowOffsetX')
  get arrowOffsetX(): number { return this._arrowOffsetX; }
  /** Popover arrow offset x
   * @zh 箭头指示器在 X 轴上的偏移量。 */
  set arrowOffsetX(value: number) { this._arrowOffsetX = value; }

  /** Popover arrow width
   * @zh 箭头指示器的宽度。 */
  @Input('popoverArrowWidth')
  get arrowWidth(): number { return this._arrowWidth; }
  /** Popover arrow width
   * @zh 箭头指示器的宽度。 */
  set arrowWidth(value: number) { this._arrowWidth = value; }

  /** @zh 箭头指示器的颜色。 */
  @Input('popoverArrowColor')
  get arrowColor(): string { return this._arrowColor; }
  /** @zh 箭头指示器的颜色。 */
  set arrowColor(value: string) { this._arrowColor = value; }

  /** @zh 点击弹出层内部时是否自动关闭。 */
  @Input('popoverCloseOnClick')
  get closeOnClick(): boolean { return this._closeOnClick; }
  /** @zh 点击弹出层内部时是否自动关闭。 */
  set closeOnClick(value: boolean) { this._closeOnClick = coerceBooleanProperty(value); }

  /** @zh 是否禁用弹出层的开关动画。 */
  @Input('popoverDisableAnimation')
  get disableAnimation(): boolean { return this._disableAnimation; }
  /** @zh 是否禁用弹出层的开关动画。 */
  set disableAnimation(value: boolean) { this._disableAnimation = coerceBooleanProperty(value); }

  /** @zh 弹出层打开时是否启用焦点陷阱（Tab 键循环限制在弹出层内）。 */
  @Input('focusTrapEnabled')
  get focusTrapEnabled(): boolean { return this._focusTrapEnabled; }
  /** @zh 弹出层打开时是否启用焦点陷阱（Tab 键循环限制在弹出层内）。 */
  set focusTrapEnabled(value: boolean) { this._focusTrapEnabled = coerceBooleanProperty(value); }

  /** @zh 启用焦点陷阱时，弹出层打开后是否自动将焦点移入。 */
  @Input('focusTrapAutoCaptureEnabled')
  get focusTrapAutoCaptureEnabled(): boolean { return this._focusTrapAutoCaptureEnabled; }
  /** @zh 启用焦点陷阱时，弹出层打开后是否自动将焦点移入。 */
  set focusTrapAutoCaptureEnabled(value: boolean) { this._focusTrapAutoCaptureEnabled = coerceBooleanProperty(value); }

  /**
   * CSS class(es) applied to the popover panel.
   * @zh 应用到弹出层面板上的 CSS 类名。
   */
  @Input('class')
  set panelClass(classes: string) {
    if (classes && classes.length) {
      this._classList = classes.split(' ').reduce((obj: any, className: string) => {
        obj[className] = true;
        return obj;
      }, {});

      this._elementRef.nativeElement.className = '';
      this.setPositionClasses();
    }
  }


  /**
   * Alias for `panelClass`.
   * @zh `panelClass` 的别名。
   */
  @Input()
  get classList(): string { return this.panelClass; }
  /**
   * Alias for `panelClass`.
   * @zh `panelClass` 的别名。
   */
  set classList(classes: string) { this.panelClass = classes; }

  /** Event emitted when the popover is closed. */
  @Output() close = new EventEmitter<void>();

  /** @zh 弹出层内容的模板引用。 */
  @ViewChild(TemplateRef) templateRef: TemplateRef<any>;

  constructor(private _elementRef: ElementRef, public zone: NgZone) {
    this.setPositionClasses();
  }

  ngOnDestroy() {
    this._emitCloseEvent();
    this.close.complete();
  }


  /** Handle a keyboard event from the popover, delegating to the appropriate action. */
  _handleKeydown(event: KeyboardEvent) {
    switch (event.keyCode) {
      case ESCAPE:
        this._emitCloseEvent();
        return;
    }
  }

  /**
   * This emits a close event to which the trigger is subscribed. When emitted, the
   * trigger will close the popover.
   */
  _emitCloseEvent(): void {
    this.close.emit();
  }

  /** Close popover on click if closeOnClick is true */
  onClick() {
    if (this.closeOnClick) {
      this._emitCloseEvent();
    }
  }


  /** Disables close of popover when leaving trigger element and mouse over the popover */
  onMouseOver() {
    if (this.triggerEvent === 'hover') {
      this.closeDisabled = true;
    }
  }
  /** Enables close of popover when mouse leaving popover element */
  onMouseLeave() {
    if (this.triggerEvent === 'hover') {
      this.closeDisabled = false;
      this._emitCloseEvent();
    }
  }


  /**
   * Recomputes the panel/arrow/content inline styles based on the current position/overlap/arrow settings.
   * @zh 根据当前的位置/重叠/箭头设置，重新计算面板/箭头/内容的内联样式。
   */
  setCurrentStyles() {

    this.popoverArrowStyles = {
      'right': this.positionX === 'before' ? (this.arrowOffsetX - this.arrowWidth) + 'px' : '',
      'left': this.positionX === 'after' ? (this.arrowOffsetX - this.arrowWidth) + 'px' : '',
      'border-top': this.positionY === 'below' ?
        this.arrowWidth + 'px solid ' + this.arrowColor : '0px solid transparent',
      'border-right': 'undefined' === undefined ?
        this.arrowWidth + 'px solid ' + this.arrowColor :
        this.arrowWidth + 'px solid transparent',
      'border-bottom': this.positionY === 'above' ?
        this.arrowWidth + 'px solid ' + this.arrowColor :
        this.arrowWidth + 'px solid transparent',
      'border-left': 'undefined' === undefined ?
        this.arrowWidth + 'px solid ' + this.arrowColor :
        this.arrowWidth + 'px solid transparent',
    };

    // TODO: Remove if flex order is added.
    this.popoverContentStyles = {
      'padding-top': this.overlapTrigger === true ? '0px' : this.arrowWidth + 'px',
      'padding-bottom': this.overlapTrigger === true ? '0px' : (this.arrowWidth) + 'px',
      'margin-top': this.overlapTrigger === false && this.positionY === 'below' && this.containerPositioning === false ?
        -(this.arrowWidth * 2) + 'px' : '0px'
    };
  }

  /**
   * It's necessary to set position-based classes to ensure the popover panel animation
   * folds out from the correct direction.
   */
  setPositionClasses(posX = this.positionX, posY = this.positionY): void {
    this._classList['popover-before'] = posX === 'before';
    this._classList['popover-after'] = posX === 'after';
    this._classList['popover-above'] = posY === 'above';
    this._classList['popover-below'] = posY === 'below';
  }
}
