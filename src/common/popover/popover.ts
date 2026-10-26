/**
 * @fileoverview Module `src/common/popover/popover.ts` providing popover definitions and implementation.
 * @zh 模块文件 `src/common/popover/popover.ts`，提供气泡卡片相关的定义与实现。
 */


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

  /**
   * Host binding `role` bound to host attribute/property `attr.role` for role.
   * @zh 内部使用，绑定弹出层宿主的无障碍 `role` 属性。
   * @zh 内部使用，绑定弹出层宿主的无障碍 `role` 属性。
   */
  @HostBinding('attr.role') role = 'dialog';

  /**
   * Settings for popover, view setters and getters for more detail
   * @zh 属性 `_positionX`（类型：`PopoverPositionX`），用于存储或配置位置X坐标（默认值：`'after'`）。
   */
  private _positionX: PopoverPositionX = 'after';
  /**
   * Property `_positionY` (`PopoverPositionY`) storing position y (default: `'below'`).
   * @zh 属性 `_positionY`（类型：`PopoverPositionY`），用于存储或配置位置Y坐标（默认值：`'below'`）。
   */
  private _positionY: PopoverPositionY = 'below';
  /**
   * Property `_triggerEvent` (`PopoverTriggerEvent`) storing trigger event (default: `'hover'`).
   * @zh 属性 `_triggerEvent`（类型：`PopoverTriggerEvent`），用于存储或配置触发事件（默认值：`'hover'`）。
   */
  private _triggerEvent: PopoverTriggerEvent = 'hover';
  /**
   * Property `_scrollStrategy` (`PopoverScrollStrategy`) storing scroll strategy (default: `'reposition'`).
   * @zh 属性 `_scrollStrategy`（类型：`PopoverScrollStrategy`），用于存储或配置滚动策略（默认值：`'reposition'`）。
   */
  private _scrollStrategy: PopoverScrollStrategy = 'reposition';
  /**
   * Property `_enterDelay` (`number`) storing enter delay (default: `200`).
   * @zh 属性 `_enterDelay`（类型：`number`），用于存储或配置进入延迟（默认值：`200`）。
   */
  private _enterDelay = 200;
  /**
   * Property `_leaveDelay` (`number`) storing leave delay (default: `200`).
   * @zh 属性 `_leaveDelay`（类型：`number`），用于存储或配置离开延迟（默认值：`200`）。
   */
  private _leaveDelay = 200;
  /**
   * Property `_overlapTrigger` (`boolean`) storing overlap trigger (default: `true`).
   * @zh 属性 `_overlapTrigger`（类型：`boolean`），用于存储或配置overlap触发（默认值：`true`）。
   */
  private _overlapTrigger = true;
  /**
   * Property `_disableAnimation` (`boolean`) storing disable animation (default: `false`).
   * @zh 属性 `_disableAnimation`（类型：`boolean`），用于存储或配置禁用动画（默认值：`false`）。
   */
  private _disableAnimation = false;
  /**
   * Property `_targetOffsetX` (`number`) storing target offset x (default: `0`).
   * @zh 属性 `_targetOffsetX`（类型：`number`），用于存储或配置目标偏移量X坐标（默认值：`0`）。
   */
  private _targetOffsetX = 0;
  /**
   * Property `_targetOffsetY` (`number`) storing target offset y (default: `0`).
   * @zh 属性 `_targetOffsetY`（类型：`number`），用于存储或配置目标偏移量Y坐标（默认值：`0`）。
   */
  private _targetOffsetY = 0;
  /**
   * Property `_arrowOffsetX` (`number`) storing arrow offset x (default: `20`).
   * @zh 属性 `_arrowOffsetX`（类型：`number`），用于存储或配置箭头偏移量X坐标（默认值：`20`）。
   */
  private _arrowOffsetX = 20;
  /**
   * Property `_arrowWidth` (`number`) storing arrow width (default: `8`).
   * @zh 属性 `_arrowWidth`（类型：`number`），用于存储或配置箭头宽度（默认值：`8`）。
   */
  private _arrowWidth = 8;
  /**
   * Property `_arrowColor` (`string`) storing arrow color (default: `'rgba(0, 0, 0, 0.12)'`).
   * @zh 属性 `_arrowColor`（类型：`string`），用于存储或配置箭头颜色（默认值：`'rgba(0, 0, 0, 0.12)'`）。
   */
  private _arrowColor = 'rgba(0, 0, 0, 0.12)';
  /**
   * Property `_closeOnClick` (`boolean`) storing close on click (default: `true`).
   * @zh 属性 `_closeOnClick`（类型：`boolean`），用于存储或配置关闭当点击（默认值：`true`）。
   */
  private _closeOnClick = true;
  /**
   * Property `_focusTrapEnabled` (`boolean`) storing focus trap enabled (default: `true`).
   * @zh 属性 `_focusTrapEnabled`（类型：`boolean`），用于存储或配置聚焦Trap已启用（默认值：`true`）。
   */
  private _focusTrapEnabled = true;
  /**
   * Property `_focusTrapAutoCaptureEnabled` (`boolean`) storing focus trap auto capture enabled (default: `true`).
   * @zh 属性 `_focusTrapAutoCaptureEnabled`（类型：`boolean`），用于存储或配置聚焦Trap自动Capture已启用（默认值：`true`）。
   */
  private _focusTrapAutoCaptureEnabled = true;

  /** Config object to be passed into the popover's ngClass
   * @zh 传递给弹出层 `ngClass` 的配置对象。 */
  _classList: {[key: string]: boolean} = {};

  /** Whether the popover's positioning accounts for a containing element rather than the viewport.
   * @zh 弹出层定位时是否考虑所在容器元素，而不是视口。 */
  public containerPositioning = false;

  /**
   * Closing disabled on popover
   * @zh 属性 `closeDisabled`（类型：`boolean`），用于存储或配置关闭已禁用（默认值：`false`）。
   */
  public closeDisabled = false;

  /**
   * Config object to be passed into the popover's arrow ngStyle
   * @zh 属性 `popoverPanelStyles`（类型：`{}`），用于存储或配置气泡卡片面板样式集合。
   */
  public popoverPanelStyles: {};

  /**
   * Config object to be passed into the popover's arrow ngStyle
   * @zh 属性 `popoverArrowStyles`（类型：`{}`），用于存储或配置气泡卡片箭头样式集合。
   */
  public popoverArrowStyles: {};

  /**
   * Config object to be passed into the popover's content ngStyle
   * @zh 属性 `popoverContentStyles`（类型：`{}`），用于存储或配置气泡卡片内容样式集合。
   */
  public popoverContentStyles: {};

  /**
   * Emits the current animation state whenever it changes.
   * @zh 属性 `_onAnimationStateChange`（类型：`EventEmitter`），用于存储或配置当动画状态变更（默认值：`new EventEmitter<AnimationEvent>()`）。
   */
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

  /**
   * Getter for input property `arrowColor` (`string`) returning arrow color.
   * @zh 箭头指示器的颜色。
   * @zh 箭头指示器的颜色。
   */
  @Input('popoverArrowColor')
  get arrowColor(): string { return this._arrowColor; }
  /**
   * Sets the arrow color (`arrowColor`).
   * @zh 箭头指示器的颜色。
   * @zh 箭头指示器的颜色。
   */
  set arrowColor(value: string) { this._arrowColor = value; }

  /**
   * Getter for input property `closeOnClick` (`boolean`) returning close on click.
   * @zh 点击弹出层内部时是否自动关闭。
   * @zh 点击弹出层内部时是否自动关闭。
   */
  @Input('popoverCloseOnClick')
  get closeOnClick(): boolean { return this._closeOnClick; }
  /**
   * Sets the close on click (`closeOnClick`).
   * @zh 点击弹出层内部时是否自动关闭。
   * @zh 点击弹出层内部时是否自动关闭。
   */
  set closeOnClick(value: boolean) { this._closeOnClick = coerceBooleanProperty(value); }

  /**
   * Getter for input property `disableAnimation` (`boolean`) returning disable animation.
   * @zh 是否禁用弹出层的开关动画。
   * @zh 是否禁用弹出层的开关动画。
   */
  @Input('popoverDisableAnimation')
  get disableAnimation(): boolean { return this._disableAnimation; }
  /**
   * Sets the disable animation (`disableAnimation`).
   * @zh 是否禁用弹出层的开关动画。
   * @zh 是否禁用弹出层的开关动画。
   */
  set disableAnimation(value: boolean) { this._disableAnimation = coerceBooleanProperty(value); }

  /**
   * @zh 弹出层打开时是否启用焦点陷阱（Tab 键循环限制在弹出层内）。
   * @zh 弹出层打开时是否启用焦点陷阱（Tab 键循环限制在弹出层内）。
   */
  @Input('focusTrapEnabled')
  get focusTrapEnabled(): boolean { return this._focusTrapEnabled; }
  /**
   * @zh 弹出层打开时是否启用焦点陷阱（Tab 键循环限制在弹出层内）。
   * @zh 弹出层打开时是否启用焦点陷阱（Tab 键循环限制在弹出层内）。
   */
  set focusTrapEnabled(value: boolean) { this._focusTrapEnabled = coerceBooleanProperty(value); }

  /**
   * Getter for input property `focusTrapAutoCaptureEnabled` (`boolean`) returning focus trap auto capture enabled.
   * @zh 启用焦点陷阱时，弹出层打开后是否自动将焦点移入。
   * @zh 启用焦点陷阱时，弹出层打开后是否自动将焦点移入。
   */
  @Input('focusTrapAutoCaptureEnabled')
  get focusTrapAutoCaptureEnabled(): boolean { return this._focusTrapAutoCaptureEnabled; }
  /**
   * Sets the focus trap auto capture enabled (`focusTrapAutoCaptureEnabled`).
   * @zh 启用焦点陷阱时，弹出层打开后是否自动将焦点移入。
   * @zh 启用焦点陷阱时，弹出层打开后是否自动将焦点移入。
   */
  set focusTrapAutoCaptureEnabled(value: boolean) { this._focusTrapAutoCaptureEnabled = coerceBooleanProperty(value); }

  /**
   * CSS class(es) applied to the popover panel.
   * @zh 应用到弹出层面板上的 CSS 类名。
   */
  @Input('class')
  set panelClass(classes: string) {
    if (classes && classes.length) {
      this._classList = classes.split(' ').reduce((obj, className: string) => {
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

  /**
   * Event emitted when the popover is closed.
   * @zh 输出事件 `close`（类型：`EventEmitter`），当触发关闭时向外发出事件。
   */
  @Output() close = new EventEmitter<void>();

  /**
   * Template/content query reference `templateRef` (`@ViewChild`) targeting template ref.
   * @zh 弹出层内容的模板引用。
   * @zh 弹出层内容的模板引用。
   */
  @ViewChild(TemplateRef) templateRef: TemplateRef<unknown>;

  /**
   * Creates an instance of `Popover` and initializes its dependencies and internal state.
   * @zh 创建 `Popover` 实例，并初始化其依赖项与内部状态。
   * @param _elementRef - Injected or initial element ref (`ElementRef`) / 注入或传入的元素引用（`ElementRef`）
   * @param zone - Injected or initial zone (`NgZone`) / 注入或传入的区域(NgZone)（`NgZone`）
   */
  constructor(private _elementRef: ElementRef, public zone: NgZone) {
    this.setPositionClasses();
  }

  /**
   * Angular lifecycle hook invoked just before the component, directive, or service is destroyed to release subscriptions and resources.
   * @zh Angular 生命周期钩子：在组件、指令或服务销毁前调用，用于释放订阅与清理资源。
   */
  ngOnDestroy() {
    this._emitCloseEvent();
    this.close.complete();
  }


  /**
   * Handle a keyboard event from the popover, delegating to the appropriate action.
   * @zh 执行 `_handleKeydown`，用于连接手柄按键按下。
   */
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

   * @zh 执行 `_emitCloseEvent`，用于发出关闭事件。
   */
  _emitCloseEvent(): void {
    this.close.emit();
  }

  /**
   * Close popover on click if closeOnClick is true
   * @zh 执行 `onClick`，用于当点击。
   */
  onClick() {
    if (this.closeOnClick) {
      this._emitCloseEvent();
    }
  }


  /**
   * Disables close of popover when leaving trigger element and mouse over the popover
   * @zh 执行 `onMouseOver`，用于当鼠标越过。
   */
  onMouseOver() {
    if (this.triggerEvent === 'hover') {
      this.closeDisabled = true;
    }
  }
  /**
   * Enables close of popover when mouse leaving popover element
   * @zh 执行 `onMouseLeave`，用于当鼠标离开。
   */
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

   * @zh 执行 `setPositionClasses`，用于集合位置类名集合。
   */
  setPositionClasses(posX = this.positionX, posY = this.positionY): void {
    this._classList['popover-before'] = posX === 'before';
    this._classList['popover-after'] = posX === 'after';
    this._classList['popover-above'] = posY === 'above';
    this._classList['popover-below'] = posY === 'below';
  }
}
