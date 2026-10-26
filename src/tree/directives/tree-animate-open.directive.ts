/**
 * @fileoverview Module `src/tree/directives/tree-animate-open.directive.ts` providing tree animate open directive definitions and implementation.
 * @zh 模块文件 `src/tree/directives/tree-animate-open.directive.ts`，提供树形控件animate打开指令相关的定义与实现。
 */

import {
  Directive,
  Input,
  OnDestroy,
  TemplateRef,
  ViewContainerRef,
  Renderer2,
  NgZone,
} from '@angular/core';

/**
 * Constant/variable `EASE_ACCELERATION` defining ease acceleration in `src/tree/directives`.
 * @zh 常量/变量 `EASE_ACCELERATION`，定义 `src/tree/directives` 中的EASEACCELERATION。
 */
const EASE_ACCELERATION = 1.005;

/**
 * Angular directive `TreeAnimateOpenDirective` (selector: '[treeAnimateOpen]') attaching tree animate open directive behavior to host DOM elements.
 * @zh Angular 指令 `TreeAnimateOpenDirective`（selector: '[treeAnimateOpen]'），为宿主 DOM 元素附加树形控件Animate打开指令行为。
 */
@Directive({
  selector: '[treeAnimateOpen]',
})
export class TreeAnimateOpenDirective implements OnDestroy {
  /**
   * Property `_isOpen` (`boolean`) storing is open.
   * @zh 属性 `_isOpen`（类型：`boolean`），用于存储或配置是否为打开。
   */
  private _isOpen: boolean;
  /**
   * Property `_timeoutId` (`any`) storing timeout id.
   * @zh 属性 `_timeoutId`（类型：`any`），用于存储或配置延时器唯一标识。
   */
  private _timeoutId;
  /**
   * Property `_intervalId` (`any`) storing interval id.
   * @zh 属性 `_intervalId`（类型：`any`），用于存储或配置间隔定时器唯一标识。
   */
  private _intervalId;

  /**
   * Input property `treeAnimateOpenSpeed` (`number`) configuring animate speed.
   * @zh 输入属性 `treeAnimateOpenSpeed`（类型：`number`），用于配置animate速度。
   */
  @Input('treeAnimateOpenSpeed') animateSpeed: number;
  /**
   * Input property `treeAnimateOpenAcceleration` (`number`) configuring animate acceleration.
   * @zh 输入属性 `treeAnimateOpenAcceleration`（类型：`number`），用于配置animateAcceleration。
   */
  @Input('treeAnimateOpenAcceleration') animateAcceleration: number;
  /**
   * Input property `treeAnimateOpenEnabled` (`boolean`) configuring is enabled.
   * @zh 输入属性 `treeAnimateOpenEnabled`（类型：`boolean`），用于配置是否为已启用。
   */
  @Input('treeAnimateOpenEnabled') isEnabled: boolean;

  /**
   * Input setter `isOpen` updating is open.
   * @zh 输入属性 `isOpen` 的设置器，用于更新是否为打开。
   * @param value - New is open value (`boolean`) / 新的是否为打开值（`boolean`）
   */
  @Input('treeAnimateOpen')
  set isOpen(value: boolean) {
    if (value) {
      this._show();
      if (this.isEnabled && this._isOpen === false) {
        this._animateOpen();
      }
    } else {
      this.isEnabled ? this._animateClose() : this._hide();
    }
    this._isOpen = !!value;
  }

  /**
   * Property `innerElement` (`any`) storing inner element.
   * @zh 属性 `innerElement`（类型：`any`），用于存储或配置内部元素。
   */
  private innerElement;

  /**
   * Creates an instance of `TreeAnimateOpenDirective` and initializes its dependencies and internal state.
   * @zh 创建 `TreeAnimateOpenDirective` 实例，并初始化其依赖项与内部状态。
   * @param renderer - Injected or initial renderer (`Renderer2`) / 注入或传入的渲染器（`Renderer2`）
   * @param templateRef - Injected or initial template ref (`TemplateRef<any>`) / 注入或传入的模板引用（`TemplateRef<any>`）
   * @param viewContainerRef - Injected or initial view container ref (`ViewContainerRef`) / 注入或传入的视图容器引用（`ViewContainerRef`）
   * @param ngZone - Injected or initial ng zone (`NgZone`) / 注入或传入的Angular区域(NgZone)（`NgZone`）
   */
  constructor(
    private renderer: Renderer2,
    private templateRef: TemplateRef<unknown>,
    private viewContainerRef: ViewContainerRef,
    private ngZone: NgZone,
  ) {}

  /**
   * Angular lifecycle hook invoked just before the component, directive, or service is destroyed to release subscriptions and resources.
   * @zh Angular 生命周期钩子：在组件、指令或服务销毁前调用，用于释放订阅与清理资源。
   */
  ngOnDestroy() {
    this._clearTimers();
  }

  /**
   * Executes `_clearTimers` to handle clear timers.
   * @zh 执行 `_clearTimers`，用于清空定时器。
   */
  private _clearTimers() {
    if (this._timeoutId) {
      clearTimeout(this._timeoutId);
      this._timeoutId = null;
    }
    if (this._intervalId) {
      clearInterval(this._intervalId);
      this._intervalId = null;
    }
  }

  /**
   * Executes `_show` to handle show.
   * @zh 执行 `_show`，用于显示。
   */
  private _show() {
    if (this.innerElement) {
        this.renderer.removeStyle(this.innerElement, 'display');
      return;
    }
    this.innerElement = this.viewContainerRef.createEmbeddedView(
      this.templateRef,
    ).rootNodes[0];
  }

  /**
   * Executes `_hide` to handle hide.
   * @zh 执行 `_hide`，用于隐藏。
   */
  private _hide() {
    this._clearTimers();
     if (this.innerElement) {
      this.renderer.setStyle(this.innerElement, 'display', 'none');
      this.renderer.removeStyle(this.innerElement, 'max-height');
    }
  }

  /**
   * Executes `_animateOpen` to handle animate open.
   * @zh 执行 `_animateOpen`，用于animate打开。
   */
  private _animateOpen() {
    this._clearTimers();
    let delta = this.animateSpeed;
    let ease = this.animateAcceleration;
    let maxHeight = 0;

    this.renderer.setStyle(this.innerElement, 'max-height', 'none');
    const targetHeight = this.innerElement.scrollHeight|| 0;;
    this.renderer.setStyle(this.innerElement, 'max-height', '0px');

  
    this.ngZone.runOutsideAngular(() => {
      this._timeoutId = setTimeout(() => {
        this._timeoutId = null;
        // Allow inner element to create its content
        this._intervalId = setInterval(() => {
          if (!this._isOpen || !this.innerElement) {
            return this._clearTimers();
          }

          maxHeight += delta;
          const roundedMaxHeight = Math.round(maxHeight);

          this.renderer.setStyle(
            this.innerElement,
            'max-height',
            `${roundedMaxHeight}px`,
          );

          delta *= ease;
          ease *= EASE_ACCELERATION;
          if (roundedMaxHeight >= targetHeight) {
            this.renderer.removeStyle(this.innerElement, 'max-height');
            this._clearTimers();
          }
        }, 16);
      });
    });
  }

  /**
   * Executes `_animateClose` to handle animate close.
   * @zh 执行 `_animateClose`，用于animate关闭。
   */
  private _animateClose() {
    this._clearTimers();
    if (!this.innerElement) {
      return;
    }

    let delta = this.animateSpeed;
    let ease = this.animateAcceleration;
    let height = this.innerElement.getBoundingClientRect().height; // TBD use renderer

    // slowly decrease maxHeight to 0, starting from current height
    this.ngZone.runOutsideAngular(() => {
      this._intervalId = setInterval(() => {
        if (this._isOpen || !this.innerElement) {
          return this._clearTimers();
        }

        height -= delta;
        this.renderer.setStyle(this.innerElement, 'max-height', `${height}px`);
        delta *= ease;
        ease *= EASE_ACCELERATION;

        if (height <= 0) {
          this._clearTimers();
          this.ngZone.run(() => {
             this._hide();
          });
        }
      }, 16);
    });
  }
}
