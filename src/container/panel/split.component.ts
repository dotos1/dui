/**
 * @fileoverview Module `src/container/panel/split.component.ts` providing split component definitions and implementation.
 * @zh 模块文件 `src/container/panel/split.component.ts`，提供分割面板组件相关的定义与实现。
 */

import { Component, Input, ElementRef, Renderer2 } from '@angular/core';


/**
 * Angular component `SplitComponent` (selector: 'split-gutter') providing split component presentation and interaction in `src/container/panel`.
 * @zh Angular 组件 `SplitComponent`（selector: 'split-gutter'），提供分割面板组件的视图渲染与交互逻辑（位于 `src/container/panel`）。
 */
@Component({
  selector: 'split-gutter',
  styleUrls: ['./split.component.scss'],
  template: '<span class="Resizer"></span>',
  host: {
    hostID: 'dui-split-gutter' + Math.random().toString(36).substring(2, 15),
  }
})
export class SplitComponent {

  /**
   * Input setter `order` updating order.
   * @zh 输入属性 `order` 的设置器，用于更新顺序。
   * @param v - New order value (`number`) / 新的顺序值（`number`）
   */
  @Input() set order(v: number) {
    this.renderer.setStyle(this.elRef.nativeElement, 'order', v);
  }

  /**
   * Property `_fxLayout` (`'row' | 'column'`) storing fx layout.
   * @zh 属性 `_fxLayout`（类型：`'row' | 'column'`），用于存储或配置fx布局。
   */
  private _fxLayout: 'row' | 'column';

  /**
   * Input setter `direction` updating direction.
   * @zh 输入属性 `direction` 的设置器，用于更新方向。
   * @param v - New direction value (`'row' | 'column'`) / 新的方向值（`'row' | 'column'`）
   */
  @Input() set direction(v: 'row' | 'column') {
    this._fxLayout = v;
    this.refreshStyle();
  }

  /**
   * Gets the current direction (`direction: 'row' | 'column'`).
   * @zh 获取当前方向（`direction: 'row' | 'column'`）。
   */
  get direction(): 'row' | 'column' {
    return this._fxLayout;
  }

  /**
   * Property `_disabled` (`boolean`) storing disabled (default: `false`).
   * @zh 属性 `_disabled`（类型：`boolean`），用于存储或配置已禁用（默认值：`false`）。
   */
  private _disabled: boolean = false;

  /**
   * Input setter `disabled` updating disabled.
   * @zh 输入属性 `disabled` 的设置器，用于更新已禁用。
   * @param v - New disabled value (`boolean`) / 新的已禁用值（`boolean`）
   */
  @Input() set disabled(v: boolean) {
    this._disabled = v;
    this.refreshStyle();
  }

  /**
   * Gets the current disabled (`disabled: boolean`).
   * @zh 获取当前已禁用（`disabled: boolean`）。
   */
  get disabled(): boolean {
    return this._disabled;
  }

  /**
   * Input setter `useTransition` updating use transition.
   * @zh 输入属性 `useTransition` 的设置器，用于更新使用过渡动画。
   * @param v - New use transition value (`boolean`) / 新的使用过渡动画值（`boolean`）
   */
  @Input() set useTransition(v: boolean) {
    if (v) {
      this.renderer.setStyle(this.elRef.nativeElement, 'transition', `flex-basis 0.3s`);
    } else {
      this.renderer.removeStyle(this.elRef.nativeElement, 'transition');
    }
  }

  /**
   * Property `_size` (`number`) storing size.
   * @zh 属性 `_size`（类型：`number`），用于存储或配置尺寸。
   */
  private _size: number;

  /**
   * Input setter `size` updating size.
   * @zh 输入属性 `size` 的设置器，用于更新尺寸。
   * @param v - New size value (`number`) / 新的尺寸值（`number`）
   */
  @Input() set size(v: number) {
    this._size = v;
    this.refreshStyle();
  }

  /**
   * Gets the current size (`size: number`).
   * @zh 获取当前尺寸（`size: number`）。
   */
  get size(): number {
    return this._size;
  }

  /**
   * Creates an instance of `SplitComponent` and initializes its dependencies and internal state.
   * @zh 创建 `SplitComponent` 实例，并初始化其依赖项与内部状态。
   * @param elRef - Injected or initial el ref (`ElementRef`) / 注入或传入的DOM元素引用（`ElementRef`）
   * @param renderer - Injected or initial renderer (`Renderer2`) / 注入或传入的渲染器（`Renderer2`）
   */
  constructor(private elRef: ElementRef,
    private renderer: Renderer2) { }


  /**
   * Property `_color` (`string`) storing color.
   * @zh 属性 `_color`（类型：`string`），用于存储或配置颜色。
   */
  private _color: string;

  /**
   * Input setter `color` updating color.
   * @zh 输入属性 `color` 的设置器，用于更新颜色。
   * @param v - New color value (`string`) / 新的颜色值（`string`）
   */
  @Input() set color(v: string) {
    this._color = v;
    this.refreshStyle();
  }

  /**
   * Gets the current color (`color: string`).
   * @zh 获取当前颜色（`color: string`）。
   */
  get color(): string {
    return this._color;
  }

  /**
   * Executes `refreshStyle` to handle refresh style.
   * @zh 执行 `refreshStyle`，用于刷新样式。
   */
  private refreshStyle(): void {
    const span = this.elRef.nativeElement.children[0];
    this.renderer.setStyle(this.elRef.nativeElement, 'flex-basis', `${this.size}px`);
    this.renderer.setStyle(this.elRef.nativeElement, 'background-color', (this.color !== '') ? this.color : `#eeeeee`);
    const state: 'disabled' | 'row' | 'column' = (this.disabled === true) ? 'disabled' : this.direction;
    this.renderer.addClass(span, this.getCSS(state));
    this.renderer.setStyle(this.elRef.nativeElement, 'cursor', this.getCursor(state));
  }
  /**
   * Executes `getCSS` to handle get css.
   * @zh 执行 `getCSS`，用于获取CSS样式。
   * @param state - state parameter (`'disabled' | 'row' | 'column'`) / 状态参数（`'disabled' | 'row' | 'column'`）
   * @returns Result of type `string` / 类型为 `string` 的返回值
   */
  private getCSS(state: 'disabled' | 'row' | 'column'): string {
      switch (state) {
          case 'row':
              return 'vertical';
          case 'column':
              return 'horizontal';
          case 'disabled':
              return '';
      }
  }
  /**
   * Executes `getCursor` to handle get cursor.
   * @zh 执行 `getCursor`，用于获取光标。
   * @param state - state parameter (`'disabled' | 'row' | 'column'`) / 状态参数（`'disabled' | 'row' | 'column'`）
   * @returns Result of type `string` / 类型为 `string` 的返回值
   */
  private getCursor(state: 'disabled' | 'row' | 'column'): string {
    switch (state) {
      case 'row':
        return 'col-resize';
      case 'column':
        return 'row-resize';
      case 'disabled':
        return 'default';
    }
  }
}
