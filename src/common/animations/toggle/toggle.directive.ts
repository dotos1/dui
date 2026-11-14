/**
 * @fileoverview Module `src/common/animations/toggle/toggle.directive.ts` providing toggle directive definitions and implementation.
 * @zh 模块文件 `src/common/animations/toggle/toggle.directive.ts`，提供基于原生 Web Animations API / CSS 的显隐过渡指令实现。
 */

import { ChangeDetectorRef, Directive, ElementRef, HostBinding, Input, OnDestroy, Renderer2 } from '@angular/core';

/**
 * Shows/hides the host element with an animated height transition, driven by the
 * `duiToggle` boolean input (`true` hides, `false` shows).
 * Uses the native Web Animations API (`Element.animate`) with deterministic fallback in JSDOM/SSR.
 * @zh 通过带高度过渡动画的方式显示/隐藏宿主元素，由 `duiToggle` 布尔输入驱动
 * （`true` 隐藏，`false` 显示）。基于原生 Web Animations API 实现，并对无 `el.animate` 的 JSDOM 环境提供安全降级。
 */
@Directive({
  selector: '[duiToggle]',
  standalone: false,
})
export class ToggleDirective implements OnDestroy {
  /**
   * Duration (ms) of the show/hide height animation.
   * @zh 显示/隐藏高度动画的持续时间（毫秒）。
   */
  @Input() duration = 150;

  /**
   * Property `_state` (`boolean`) storing current collapsed/hidden state.
   * @zh 属性 `_state`（类型：`boolean`），用于存储当前隐藏状态。
   */
  private _state = false;

  /**
   * Property `_defaultOverflow` (`string`) storing initial overflow style.
   * @zh 属性 `_defaultOverflow`（类型：`string`），用于存储初始 overflow 样式。
   */
  private _defaultOverflow: string;

  /**
   * Property `_defaultDisplay` (`string`) storing initial display style.
   * @zh 属性 `_defaultDisplay`（类型：`string`），用于存储初始 display 样式。
   */
  private _defaultDisplay: string;

  /**
   * Active Web Animation player when hiding.
   * @zh 隐藏过程中的原生 Web Animation 实例。
   */
  private _activeHideAnimation?: Animation;

  /**
   * Active Web Animation player when showing.
   * @zh 显示过程中的原生 Web Animation 实例。
   */
  private _activeShowAnimation?: Animation;

  /**
   * Fallback timer handle for deterministic completion.
   * @zh 动画兜底定时器句柄，确保状态切换确定性收敛。
   */
  private _fallbackTimer?: ReturnType<typeof setTimeout>;

  /**
   * Toggles element: hides if `true`, shows if `false`.
   * @zh 输入属性 `state` 的设置器，`true` 隐藏宿主元素，`false` 显示宿主元素。
   */
  @Input('duiToggle')
  set state(state: boolean) {
    this._state = Boolean(state);
    this._cancelPending();
    if (this._state) {
      this.hide();
    } else {
      this.show();
    }
  }

  /**
   * Binds native `aria-expanded` attribute.
   * @zh 宿主绑定读取器 `ariaExpandedBinding`（绑定至 `attr.aria-expanded`）。
   */
  @HostBinding('attr.aria-expanded')
  get ariaExpandedBinding(): boolean {
    return !this._state;
  }

  /**
   * Binds native `aria-hidden` attribute.
   * @zh 宿主绑定读取器 `ariaHiddenBinding`（绑定至 `attr.aria-hidden`）。
   */
  @HostBinding('attr.aria-hidden')
  get ariaHiddenBinding(): boolean {
    return this._state;
  }

  /**
   * Creates an instance of `ToggleDirective` and records default inline display/overflow styles.
   * @zh 创建 `ToggleDirective` 实例，并记录宿主元素的默认 display 与 overflow 样式。
   * @param _renderer - Angular renderer (`Renderer2`) / 渲染器（`Renderer2`）
   * @param _element - Host element ref (`ElementRef<HTMLElement>`) / 宿主元素引用（`ElementRef<HTMLElement>`）
   * @param _changeDetectorRef - Change detector ref (`ChangeDetectorRef`) / 变更检测器引用（`ChangeDetectorRef`）
   */
  constructor(
    private _renderer: Renderer2,
    private _element: ElementRef<HTMLElement>,
    private _changeDetectorRef: ChangeDetectorRef,
  ) {
    const el = this._element.nativeElement;
    this._defaultDisplay = el?.style?.display ?? '';
    this._defaultOverflow = el?.style?.overflow ?? '';
  }

  /**
   * Hides element with height transition and sets `display: none` upon completion.
   * @zh 隐藏宿主元素，并在过渡完成后设置 `display: none`。
   */
  hide(): void {
    const el = this._element.nativeElement;
    this._renderer.setStyle(el, 'overflow', 'hidden');
    this._changeDetectorRef.markForCheck();

    if (typeof el?.animate === 'function' && this.duration > 0) {
      const startHeight = `${el.offsetHeight || 0}px`;
      const anim = el.animate(
        [{ height: startHeight }, { height: '0px' }],
        { duration: this.duration, easing: 'ease-in' },
      );
      this._activeHideAnimation = anim;
      let finished = false;
      const done = (): void => {
        if (finished) {
          return;
        }
        finished = true;
        this._clearFallbackTimer();
        this._onHideDone();
      };
      anim.onfinish = done;
      anim.oncancel = (): void => {
        finished = true;
        this._clearFallbackTimer();
      };
      this._fallbackTimer = setTimeout(done, this.duration + 32);
    } else {
      this._onHideDone();
    }
  }

  /**
   * Shows element with height transition and restores overflow style upon completion.
   * @zh 显示宿主元素，并在过渡完成后恢复初始 overflow 样式。
   */
  show(): void {
    const el = this._element.nativeElement;
    this._renderer.setStyle(el, 'display', this._defaultDisplay || '');
    this._renderer.setStyle(el, 'overflow', 'hidden');
    this._changeDetectorRef.markForCheck();

    if (typeof el?.animate === 'function' && this.duration > 0) {
      const targetHeight = `${el.scrollHeight || el.offsetHeight || 0}px`;
      const anim = el.animate(
        [{ height: '0px' }, { height: targetHeight }],
        { duration: this.duration, easing: 'ease-out' },
      );
      this._activeShowAnimation = anim;
      let finished = false;
      const done = (): void => {
        if (finished) {
          return;
        }
        finished = true;
        this._clearFallbackTimer();
        this._onShowDone();
      };
      anim.onfinish = done;
      anim.oncancel = (): void => {
        finished = true;
        this._clearFallbackTimer();
      };
      this._fallbackTimer = setTimeout(done, this.duration + 32);
    } else {
      this._onShowDone();
    }
  }

  /**
   * Releases active animations and timers when directive is destroyed.
   * @zh 指令销毁时清理未完成的动画与定时器。
   */
  ngOnDestroy(): void {
    this._cancelPending();
  }

  private _cancelPending(): void {
    this._clearFallbackTimer();
    if (this._activeHideAnimation) {
      this._activeHideAnimation.cancel();
      this._activeHideAnimation = undefined;
    }
    if (this._activeShowAnimation) {
      this._activeShowAnimation.cancel();
      this._activeShowAnimation = undefined;
    }
  }

  private _clearFallbackTimer(): void {
    if (this._fallbackTimer !== undefined) {
      clearTimeout(this._fallbackTimer);
      this._fallbackTimer = undefined;
    }
  }

  private _onHideDone(): void {
    const el = this._element.nativeElement;
    this._activeHideAnimation = undefined;
    this._renderer.setStyle(el, 'overflow', this._defaultOverflow);
    this._renderer.setStyle(el, 'display', 'none');
    this._changeDetectorRef.markForCheck();
  }

  private _onShowDone(): void {
    const el = this._element.nativeElement;
    this._activeShowAnimation = undefined;
    this._renderer.setStyle(el, 'overflow', this._defaultOverflow);
    this._changeDetectorRef.markForCheck();
  }
}
