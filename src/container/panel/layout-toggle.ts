/**
 * @fileoverview Module `src/container/panel/layout-toggle.ts` providing layout toggle definitions and implementation.
 * @zh 模块文件 `src/container/panel/layout-toggle.ts`，提供布局开关相关的定义与实现。
 */

import { Input, HostListener, Renderer2, ElementRef, AfterViewInit, OnDestroy, Directive } from '@angular/core';
import { ICanDisable, mixinDisabled } from '@dotos/dui/core/behaviors';

import { Subscription } from 'rxjs';

/**
 * Interface `ILayoutTogglable` defining the contract and properties for i layout togglable.
 * @zh 接口 `ILayoutTogglable`，定义I布局Togglable的数据结构契约与属性规范。
 */
export interface ILayoutTogglable {
  /**
   * Property `opened` (`boolean`) storing opened.
   * @zh 属性 `opened`（类型：`boolean`），用于存储或配置是否展开。
   */
  opened: boolean;

}

/**
 * Class `LayoutToggleBase` encapsulating layout toggle base data structures and logic in `src/container/panel`.
 * @zh 类 `LayoutToggleBase`，封装 `src/container/panel` 中的布局开关基础数据结构与处理逻辑。
 */
export class LayoutToggleBase { }

/* tslint:disable-next-line */
/**
 * Constant/variable `_DuiLayoutToggleMixinBase` defining dui layout toggle mixin base in `src/container/panel`.
 * @zh 常量/变量 `_DuiLayoutToggleMixinBase`，定义 `src/container/panel` 中的DUI布局开关Mixin基础。
 */
export const _DuiLayoutToggleMixinBase = mixinDisabled(LayoutToggleBase);

/**
 * Angular directive `LayoutToggle` attaching layout toggle behavior to host DOM elements.
 * @zh Angular 指令 `LayoutToggle`，为宿主 DOM 元素附加布局开关行为。
 */
@Directive()
export abstract class LayoutToggle extends _DuiLayoutToggleMixinBase implements AfterViewInit, OnDestroy, ICanDisable {

  /**
   * Property `_toggleSubs` (`Subscription`) storing toggle subs.
   * @zh 属性 `_toggleSubs`（类型：`Subscription`），用于存储或配置开关子。
   */
  private _toggleSubs: Subscription;

  /**
   * Property `_initialized` (`boolean`) storing initialized (default: `false`).
   * @zh 属性 `_initialized`（类型：`boolean`），用于存储或配置已初始化（默认值：`false`）。
   */
  private _initialized: boolean = false;

  /**
   * Property `_hideWhenOpened` (`boolean`) storing hide when opened (default: `false`).
   * @zh 属性 `_hideWhenOpened`（类型：`boolean`），用于存储或配置隐藏When是否展开（默认值：`false`）。
   */
  private _hideWhenOpened: boolean = false;


  /**
   * Input setter `hideWhenOpened` updating hide when opened.
   * @zh 输入属性 `hideWhenOpened` 的设置器，用于更新隐藏When是否展开。
   * @param hideWhenOpened - New hide when opened value (`boolean`) / 新的隐藏When是否展开值（`boolean`）
   */
  @Input('hideWhenOpened')
  set hideWhenOpened(hideWhenOpened: boolean) {
    this._hideWhenOpened = hideWhenOpened;
    if (this._initialized) {
      this._toggleVisibility();
    }
  }

  /**
   * Creates an instance of `LayoutToggle` and initializes its dependencies and internal state.
   * @zh 创建 `LayoutToggle` 实例，并初始化其依赖项与内部状态。
   * @param _panel - Injected or initial panel (`ILayoutTogglable`) / 注入或传入的面板（`ILayoutTogglable`）
   * @param _renderer - Injected or initial renderer (`Renderer2`) / 注入或传入的渲染器（`Renderer2`）
   * @param _elementRef - Injected or initial element ref (`ElementRef<any>`) / 注入或传入的元素引用（`ElementRef<any>`）
   */
  constructor(protected _panel: ILayoutTogglable,
    private _renderer: Renderer2,
    private _elementRef: ElementRef) {
    super();
    this._renderer.addClass(this._elementRef.nativeElement, 'dui-layout-menu-button');
  }

  /**
   * Angular lifecycle hook invoked once after the component's view and child views are initialized.
   * @zh Angular 生命周期钩子：在组件视图及其子视图初始化完成后调用一次。
   */
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

  /**
   * Angular lifecycle hook invoked just before the component, directive, or service is destroyed to release subscriptions and resources.
   * @zh Angular 生命周期钩子：在组件、指令或服务销毁前调用，用于释放订阅与清理资源。
   */
  ngOnDestroy(): void {
    if (this._toggleSubs) {
      this._toggleSubs.unsubscribe();
      this._toggleSubs = undefined;
    }
  }

  /**
   * Listens to host click event to trigger the layout toggle

   * @zh 宿主事件监听方法 `clickListener`，响应 `click` 事件以处理点击监听器。
   */
  @HostListener('click', ['$event'])
  clickListener(event: Event): void {
    event.preventDefault();
    if (!this.disabled) {
      this.onClick();
    }
  }

  /**
   * Executes `onClick` to handle on click.
   * @zh 执行 `onClick`，用于当点击。
   */
  abstract onClick(): void;

  /**
   * Executes `_toggleVisibility` to handle toggle visibility.
   * @zh 执行 `_toggleVisibility`，用于开关Visibility。
   */
  private _toggleVisibility(): void {
    // let sidenav = this._panel.sidenav.first.sidenav;
    // if (sidenav.opened && this._hideWhenOpened) {
    //   this._renderer.setStyle(this._elementRef.nativeElement, 'display', 'none');
    // } else {
    //   this._renderer.setStyle(this._elementRef.nativeElement, 'display', '');
    // }
  }
}
