/**
 * @fileoverview Module `src/common/animations/toggle/toggle.directive.ts` providing toggle directive definitions and implementation.
 * @zh 模块文件 `src/common/animations/toggle/toggle.directive.ts`，提供开关指令相关的定义与实现。
 */


import { Directive, ElementRef, Input, HostBinding, Renderer2, ChangeDetectorRef } from '@angular/core';
import { animate, AnimationBuilder, AnimationPlayer, AUTO_STYLE, style, animation } from '@angular/animations';

/**
 * Shows/hides the host element with an animated height transition, driven by the
 * `duiToggle` boolean input (`true` hides, `false` shows).
 * @zh 通过带高度过渡动画的方式显示/隐藏宿主元素，由 `duiToggle` 布尔输入驱动
 * （`true` 隐藏，`false` 显示）。
 */
@Directive({
  selector: '[duiToggle]',
  standalone: false,
})
export class ToggleDirective {


  /**
   * Duration (ms) of the show/hide height animation.
   * @zh 显示/隐藏高度动画的持续时间（毫秒）。
   */
  @Input() duration: number = 150;

  /**
   * Property `_state` (`boolean`) storing state.
   * @zh 属性 `_state`（类型：`boolean`），用于存储或配置状态。
   */
  private _state: boolean;
  /**
   * Property `_defaultOverflow` (`string`) storing default overflow.
   * @zh 属性 `_defaultOverflow`（类型：`string`），用于存储或配置默认Overflow。
   */
  private _defaultOverflow: string;
  /**
   * Property `_defaultDisplay` (`string`) storing default display.
   * @zh 属性 `_defaultDisplay`（类型：`string`），用于存储或配置默认Display。
   */
  private _defaultDisplay: string;
  /**
   * Property `_animationShowPlayer` (`AnimationPlayer`) storing animation show player.
   * @zh 属性 `_animationShowPlayer`（类型：`AnimationPlayer`），用于存储或配置动画显示Player。
   */
  private _animationShowPlayer: AnimationPlayer;
  /**
   * Property `_animationHidePlayer` (`AnimationPlayer`) storing animation hide player.
   * @zh 属性 `_animationHidePlayer`（类型：`AnimationPlayer`），用于存储或配置动画隐藏Player。
   */
  private _animationHidePlayer: AnimationPlayer;

  /**
   * duiToggle: boolean
   * Toggles element, hides if its 'true', shows if its 'false'.

   * @zh 输入属性 `state` 的设置器，用于更新状态。
   */
  @Input('duiToggle')
  set state(state: boolean) {
    this._state = state;
    if (state) {
      if (this._animationShowPlayer) {
        this._animationShowPlayer.destroy();
        this._animationShowPlayer = undefined;
      }
      this.hide();
    } else {
      if (this._animationHidePlayer) {
        this._animationHidePlayer.destroy();
        this._animationHidePlayer = undefined;
      }
      this.show();
    }
  }

  /**
   * Binds native 'aria-expanded' attribute.

   * @zh 宿主绑定读取器 `ariaExpandedBinding`（绑定至 `attr.aria-expanded`），计算并返回aria已展开绑定。
   */
  @HostBinding('attr.aria-expanded')
  get ariaExpandedBinding(): boolean {
    return !this._state;
  }

  /**
   * Binds native 'aria-hidden' attribute.

   * @zh 宿主绑定读取器 `ariaHiddenBinding`（绑定至 `attr.aria-hidden`），计算并返回aria隐藏绑定。
   */
  @HostBinding('attr.aria-hidden')
  get ariaHiddenBinding(): boolean {
    return this._state;
  }

  /**
   * Creates an instance of `ToggleDirective` and initializes its dependencies and internal state.
   * @zh 创建 `ToggleDirective` 实例，并初始化其依赖项与内部状态。
   * @param _renderer - Injected or initial renderer (`Renderer2`) / 注入或传入的渲染器（`Renderer2`）
   * @param _element - Injected or initial element (`ElementRef<HTMLElement>`) / 注入或传入的元素（`ElementRef<HTMLElement>`）
   * @param _changeDetectorRef - Injected or initial change detector ref (`ChangeDetectorRef`) / 注入或传入的变更检测器引用（`ChangeDetectorRef`）
   * @param _animationBuilder - Injected or initial animation builder (`AnimationBuilder`) / 注入或传入的动画构建器（`AnimationBuilder`）
   */
  constructor(private _renderer: Renderer2,
              private _element: ElementRef<HTMLElement>,
              private _changeDetectorRef: ChangeDetectorRef,
              private _animationBuilder: AnimationBuilder) {
    this._defaultDisplay = this._element.nativeElement.style.display;
    this._defaultOverflow = this._element.nativeElement.style.overflow;
  }

  /**
   * Hides element: sets "display:[default]" so animation is shown,
   * starts animation and adds "display:'none'" style at the end.

   * @zh 执行 `hide`，用于隐藏。
   */
  hide(): void {
    this._animationHidePlayer = this._animationBuilder.build(animation([
      style({
        height: AUTO_STYLE,
        display: AUTO_STYLE,
      }),
      animate(this.duration + 'ms ease-in', style({height: '0'})),
    ])).create(this._element.nativeElement);
    this._renderer.setStyle(this._element.nativeElement, 'overflow', 'hidden');
    this._changeDetectorRef.markForCheck();
    this._animationHidePlayer.onDone(() => {
      this._onHideDone();
    });
    this._animationHidePlayer.play();
  }

  /**
   * Shows element: sets "display:[default]" so animation is shown,
   * starts animation and adds "overflow:[default]" style again at the end.

   * @zh 执行 `show`，用于显示。
   */
  show(): void {
    this._renderer.setStyle(this._element.nativeElement, 'display', this._defaultDisplay);
    this._changeDetectorRef.markForCheck();
    this._animationShowPlayer = this._animationBuilder.build(animation([
      style({
        height: '0',
        display: 'none',
      }),
      animate(this.duration + 'ms ease-out', style({height: AUTO_STYLE})),
    ])).create(this._element.nativeElement);
    this._renderer.setStyle(this._element.nativeElement, 'overflow', 'hidden');
    this._animationShowPlayer.onDone(() => {
      this._onShowDone();
    });
    this._animationShowPlayer.play();
  }

  /**
   * Executes `_onHideDone` to handle on hide done.
   * @zh 执行 `_onHideDone`，用于当隐藏完成。
   */
  private _onHideDone(): void {
    if (this._animationHidePlayer) {
      this._animationHidePlayer.destroy();
      this._animationHidePlayer = undefined;
      this._renderer.setStyle(this._element.nativeElement, 'overflow', this._defaultOverflow);
      this._renderer.setStyle(this._element.nativeElement, 'display', 'none');
      this._changeDetectorRef.markForCheck();
    }
  }

  /**
   * Executes `_onShowDone` to handle on show done.
   * @zh 执行 `_onShowDone`，用于当显示完成。
   */
  private _onShowDone(): void {
    if (this._animationShowPlayer) {
      this._animationShowPlayer.destroy();
      this._animationShowPlayer = undefined;
      this._renderer.setStyle(this._element.nativeElement, 'overflow', this._defaultOverflow);
      this._changeDetectorRef.markForCheck();
    }
  }
}
