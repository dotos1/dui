/**
 * @fileoverview Module `src/container/panel/layout.directives.ts` providing layout directives definitions and implementation.
 * @zh 模块文件 `src/container/panel/layout.directives.ts`，提供布局指令相关的定义与实现。
 */

import { Directive, Input, Renderer2, ElementRef, Inject, forwardRef } from '@angular/core';
import { PanelComponent } from './panel.component';
import { LayoutToggle } from './layout-toggle';

/**
 * Angular directive `DuiLayoutToggleDirective` (selector: '[duiLayoutToggle]') attaching dui layout toggle directive behavior to host DOM elements.
 * @zh Angular 指令 `DuiLayoutToggleDirective`（selector: '[duiLayoutToggle]'），为宿主 DOM 元素附加DUI布局开关指令行为。
 */
@Directive({
  selector: '[duiLayoutToggle]',
})
export class DuiLayoutToggleDirective extends LayoutToggle {

  /**
   * Input setter `duiLayoutToggle` updating dui layout toggle.
   * @zh 输入属性 `duiLayoutToggle` 的设置器，用于更新DUI布局开关。
   * @param duiLayoutToggle - New dui layout toggle value (`boolean`) / 新的DUI布局开关值（`boolean`）
   */
  @Input('duiLayoutToggle')
  set duiLayoutToggle(duiLayoutToggle: boolean) {
    this.disabled = !(<unknown>duiLayoutToggle === '' || duiLayoutToggle);
  }

  /**
   * Creates an instance of `DuiLayoutToggleDirective` and initializes its dependencies and internal state.
   * @zh 创建 `DuiLayoutToggleDirective` 实例，并初始化其依赖项与内部状态。
   * @param panel - Injected or initial panel (`PanelComponent`) / 注入或传入的面板（`PanelComponent`）
   * @param renderer - Injected or initial renderer (`Renderer2`) / 注入或传入的渲染器（`Renderer2`）
   * @param elementRef - Injected or initial element ref (`ElementRef<any>`) / 注入或传入的元素引用（`ElementRef<any>`）
   */
  constructor(@Inject(forwardRef(() => PanelComponent)) panel: PanelComponent,
    renderer: Renderer2,
    elementRef: ElementRef) {
    super(panel, renderer, elementRef);
  }

  /**
   * Executes `onClick` to handle on click.
   * @zh 执行 `onClick`，用于当点击。
   */
  onClick(): void {
    // this._panel.toggle();
  }
}

/**
 * Angular directive `DuiLayoutCloseDirective` (selector: '[duiLayoutClose]') attaching dui layout close directive behavior to host DOM elements.
 * @zh Angular 指令 `DuiLayoutCloseDirective`（selector: '[duiLayoutClose]'），为宿主 DOM 元素附加DUI布局关闭指令行为。
 */
@Directive({
  selector: '[duiLayoutClose]',
})
export class DuiLayoutCloseDirective extends LayoutToggle {

  /**
   * Input setter `duiLayoutClose` updating dui layout close.
   * @zh 输入属性 `duiLayoutClose` 的设置器，用于更新DUI布局关闭。
   * @param duiLayoutClose - New dui layout close value (`boolean`) / 新的DUI布局关闭值（`boolean`）
   */
  @Input('duiLayoutClose')
  set duiLayoutClose(duiLayoutClose: boolean) {
    this.disabled = !(<unknown>duiLayoutClose === '' || duiLayoutClose);
  }

  /**
   * Creates an instance of `DuiLayoutCloseDirective` and initializes its dependencies and internal state.
   * @zh 创建 `DuiLayoutCloseDirective` 实例，并初始化其依赖项与内部状态。
   * @param panel - Injected or initial panel (`PanelComponent`) / 注入或传入的面板（`PanelComponent`）
   * @param renderer - Injected or initial renderer (`Renderer2`) / 注入或传入的渲染器（`Renderer2`）
   * @param elementRef - Injected or initial element ref (`ElementRef<any>`) / 注入或传入的元素引用（`ElementRef<any>`）
   */
  constructor(@Inject(forwardRef(() => PanelComponent)) panel: PanelComponent,
    renderer: Renderer2,
    elementRef: ElementRef) {
    super(panel, renderer, elementRef);
  }

  /**
   * Executes `onClick` to handle on click.
   * @zh 执行 `onClick`，用于当点击。
   */
  onClick(): void {
    // this._panel.collapse();
  }
}

/**
 * Angular directive `DuiLayoutOpenDirective` (selector: '[duiLayoutOpen]') attaching dui layout open directive behavior to host DOM elements.
 * @zh Angular 指令 `DuiLayoutOpenDirective`（selector: '[duiLayoutOpen]'），为宿主 DOM 元素附加DUI布局打开指令行为。
 */
@Directive({
  selector: '[duiLayoutOpen]',
})
export class DuiLayoutOpenDirective extends LayoutToggle {

  /**
   * Input setter `duiLayoutClose` updating dui layout close.
   * @zh 输入属性 `duiLayoutClose` 的设置器，用于更新DUI布局关闭。
   * @param duiLayoutOpen - New dui layout close value (`boolean`) / 新的DUI布局关闭值（`boolean`）
   */
  @Input('duiLayoutOpen')
  set duiLayoutClose(duiLayoutOpen: boolean) {
    this.disabled = !(<unknown>duiLayoutOpen === '' || duiLayoutOpen);
  }

  /**
   * Creates an instance of `DuiLayoutOpenDirective` and initializes its dependencies and internal state.
   * @zh 创建 `DuiLayoutOpenDirective` 实例，并初始化其依赖项与内部状态。
   * @param panel - Injected or initial panel (`PanelComponent`) / 注入或传入的面板（`PanelComponent`）
   * @param renderer - Injected or initial renderer (`Renderer2`) / 注入或传入的渲染器（`Renderer2`）
   * @param elementRef - Injected or initial element ref (`ElementRef<any>`) / 注入或传入的元素引用（`ElementRef<any>`）
   */
  constructor(@Inject(forwardRef(() => PanelComponent)) panel: PanelComponent,
    renderer: Renderer2,
    elementRef: ElementRef) {
    super(panel, renderer, elementRef);
  }

  /**
   * Executes `onClick` to handle on click.
   * @zh 执行 `onClick`，用于当点击。
   */
  onClick(): void {
    //  this._panel.expand();
  }
}
