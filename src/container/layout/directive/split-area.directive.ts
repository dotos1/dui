/**
 * @fileoverview Module `src/container/layout/directive/split-area.directive.ts` providing split area directive definitions and implementation.
 * @zh 模块文件 `src/container/layout/directive/split-area.directive.ts`，提供分割面板区域指令相关的定义与实现。
 */

import { Directive, ElementRef, Input, NgZone, OnDestroy, OnInit, Renderer2 } from '@angular/core'

import { LayoutComponent } from '../component/layout.component'
import { getInputboolean, getInputPositiveNumber } from '../utils'

/**
 * Angular directive `SplitAreaDirective` (selector: 'dui-split-area, [dui-split-area]') attaching split area directive behavior to host DOM elements.
 * @zh Angular 指令 `SplitAreaDirective`（selector: 'dui-split-area, [dui-split-area]'），为宿主 DOM 元素附加分割面板区域指令行为。
 */
@Directive({
  selector: 'dui-split-area, [dui-split-area]',
  exportAs: 'asSplitArea',
})
export class SplitAreaDirective implements OnInit, OnDestroy {
  /**
   * Property `_order` (`number`) storing order (default: `null`).
   * @zh 属性 `_order`（类型：`number`），用于存储或配置顺序（默认值：`null`）。
   */
  private _order: number | null = null;

  /**
   * Property `_id` (`string`) storing id (default: `null`).
   * @zh 属性 `_id`（类型：`string`），用于存储或配置唯一标识（默认值：`null`）。
   */
  private _id: string = null;

  /**
   * Input setter `id` updating id.
   * @zh 输入属性 `id` 的设置器，用于更新唯一标识。
   * @param v - New id value (`string`) / 新的唯一标识值（`string`）
   */
  @Input() set id(v: string) {
    this._id =v ;
  }
  
  /**
   * Gets the current id (`id: string`).
   * @zh 获取当前唯一标识（`id: string`）。
   */
  get id(): string {
    return this._id
  }

  /**
   * Input setter `order` updating order.
   * @zh 输入属性 `order` 的设置器，用于更新顺序。
   * @param v - New order value (`number`) / 新的顺序值（`number`）
   */
  @Input() set order(v: number | null) {
    this._order = getInputPositiveNumber(v, null)
    this.split.updateArea(this, true, false)
  }

  /**
   * Gets the current order (`order: number | null`).
   * @zh 获取当前顺序（`order: number | null`）。
   */
  get order(): number | null {
    return this._order
  }

  /**
   * Property `_size` (`number`) storing size (default: `null`).
   * @zh 属性 `_size`（类型：`number`），用于存储或配置尺寸（默认值：`null`）。
   */
  private _size: number | null = null

  /**
   * Input setter `size` updating size.
   * @zh 输入属性 `size` 的设置器，用于更新尺寸。
   * @param v - New size value (`number`) / 新的尺寸值（`number`）
   */
  @Input() set size(v: number | null) {
    this._size = getInputPositiveNumber(v, null)
    this.split.updateArea(this, false, true)
  }

  /**
   * Gets the current size (`size: number | null`).
   * @zh 获取当前尺寸（`size: number | null`）。
   */
  get size(): number | null {
    return this._size
  }

  /**
   * Property `_minSize` (`number`) storing min size (default: `null`).
   * @zh 属性 `_minSize`（类型：`number`），用于存储或配置最小值尺寸（默认值：`null`）。
   */
  private _minSize: number | null = null

  /**
   * Input setter `minSize` updating min size.
   * @zh 输入属性 `minSize` 的设置器，用于更新最小值尺寸。
   * @param v - New min size value (`number`) / 新的最小值尺寸值（`number`）
   */
  @Input() set minSize(v: number | null) {
    this._minSize = getInputPositiveNumber(v, null)
    this.split.updateArea(this, false, true)
  }

  /**
   * Gets the current min size (`minSize: number | null`).
   * @zh 获取当前最小值尺寸（`minSize: number | null`）。
   */
  get minSize(): number | null {
    return this._minSize
  }

  /**
   * Property `_maxSize` (`number`) storing max size (default: `null`).
   * @zh 属性 `_maxSize`（类型：`number`），用于存储或配置最大值尺寸（默认值：`null`）。
   */
  private _maxSize: number | null = null

  /**
   * Input setter `maxSize` updating max size.
   * @zh 输入属性 `maxSize` 的设置器，用于更新最大值尺寸。
   * @param v - New max size value (`number`) / 新的最大值尺寸值（`number`）
   */
  @Input() set maxSize(v: number | null) {
    this._maxSize = getInputPositiveNumber(v, null)
    this.split.updateArea(this, false, true)
  }

  /**
   * Gets the current max size (`maxSize: number | null`).
   * @zh 获取当前最大值尺寸（`maxSize: number | null`）。
   */
  get maxSize(): number | null {
    return this._maxSize
  }

  /**
   * Property `_lockSize` (`boolean`) storing lock size (default: `false`).
   * @zh 属性 `_lockSize`（类型：`boolean`），用于存储或配置锁定尺寸（默认值：`false`）。
   */
  private _lockSize = false

  /**
   * Input setter `lockSize` updating lock size.
   * @zh 输入属性 `lockSize` 的设置器，用于更新锁定尺寸。
   * @param v - New lock size value (`boolean`) / 新的锁定尺寸值（`boolean`）
   */
  @Input() set lockSize(v: boolean) {
    this._lockSize = getInputboolean(v)
    this.split.updateArea(this, false, true)
  }

  /**
   * Gets the current lock size (`lockSize: boolean`).
   * @zh 获取当前锁定尺寸（`lockSize: boolean`）。
   */
  get lockSize(): boolean {
    return this._lockSize
  }

  /**
   * Property `_visible` (`boolean`) storing visible (default: `true`).
   * @zh 属性 `_visible`（类型：`boolean`），用于存储或配置可见（默认值：`true`）。
   */
  private _visible = true

  /**
   * Input setter `visible` updating visible.
   * @zh 输入属性 `visible` 的设置器，用于更新可见。
   * @param v - New visible value (`boolean`) / 新的可见值（`boolean`）
   */
  @Input() set visible(v: boolean) {
    this._visible = getInputboolean(v)

    if (this._visible) {
      this.split.showArea(this)
      this.renderer.removeClass(this.elRef.nativeElement, 'dui-hidden')
    } else {
      this.split.hideArea(this)
      this.renderer.addClass(this.elRef.nativeElement, 'dui-hidden')
    }
  }

  /**
   * Gets the current visible (`visible: boolean`).
   * @zh 获取当前可见（`visible: boolean`）。
   */
  get visible(): boolean {
    return this._visible
  }

  /**
   * Property `transitionListener` (`Function`) storing transition listener.
   * @zh 属性 `transitionListener`（类型：`Function`），用于存储或配置过渡动画监听器。
   */
  private transitionListener: Function
  /**
   * Property `lockListeners` (`Function[]`) storing lock listeners (default: `[]`).
   * @zh 属性 `lockListeners`（类型：`Function[]`），用于存储或配置锁定监听器列表（默认值：`[]`）。
   */
  private readonly lockListeners: Array<Function> = []

  /**
   * Creates an instance of `SplitAreaDirective` and initializes its dependencies and internal state.
   * @zh 创建 `SplitAreaDirective` 实例，并初始化其依赖项与内部状态。
   * @param ngZone - Injected or initial ng zone (`NgZone`) / 注入或传入的Angular区域(NgZone)（`NgZone`）
   * @param elRef - Injected or initial el ref (`ElementRef<any>`) / 注入或传入的DOM元素引用（`ElementRef<any>`）
   * @param renderer - Injected or initial renderer (`Renderer2`) / 注入或传入的渲染器（`Renderer2`）
   * @param split - Injected or initial split (`LayoutComponent`) / 注入或传入的分割面板（`LayoutComponent`）
   */
  constructor(
    private ngZone: NgZone,
    public elRef: ElementRef,
    private renderer: Renderer2,
    private split: LayoutComponent,
  ) {
    this.renderer.addClass(this.elRef.nativeElement, 'dui-split-area')
  }

  /**
   * Angular lifecycle hook invoked once after component or directive inputs are initialized.
   * @zh Angular 生命周期钩子：在组件或指令的输入属性初始化完成后调用一次。
   */
  public ngOnInit(): void {
    this.split.addArea(this)

    this.ngZone.runOutsideAngular(() => {
      this.transitionListener = this.renderer.listen(
        this.elRef.nativeElement,
        'transitionend',
        (event: TransitionEvent) => {
          if (event.propertyName === 'flex-basis') {
            this.split.notify('transitionEnd', -1)
          }
        },
      )
    })
  }

  /**
   * Executes `setStyleOrder` to handle set style order.
   * @zh 执行 `setStyleOrder`，用于集合样式顺序。
   * @param value - value parameter (`number`) / 值参数（`number`）
   */
  public setStyleOrder(value: number): void {
    this.renderer.setStyle(this.elRef.nativeElement, 'order', value)
  }

  /**
   * Executes `setStyleFlex` to handle set style flex.
   * @zh 执行 `setStyleFlex`，用于集合样式Flex。
   * @param grow - grow parameter (`number`) / grow参数（`number`）
   * @param shrink - shrink parameter (`number`) / shrink参数（`number`）
   * @param basis - basis parameter (`string`) / basis参数（`string`）
   * @param isMin - is min parameter (`boolean`) / 是否为最小值参数（`boolean`）
   * @param isMax - is max parameter (`boolean`) / 是否为最大值参数（`boolean`）
   */
  public setStyleFlex(grow: number, shrink: number, basis: string, isMin: boolean, isMax: boolean): void {
   
    this.renderer.setStyle(this.elRef.nativeElement, 'flex-grow', grow)
    this.renderer.setStyle(this.elRef.nativeElement, 'flex-shrink', shrink)
    this.renderer.setStyle(this.elRef.nativeElement, 'flex-basis', basis)

    if (isMin === true) {
      this.renderer.addClass(this.elRef.nativeElement, 'dui-min')
    } else {
      this.renderer.removeClass(this.elRef.nativeElement, 'dui-min')
    }

    if (isMax === true) {
      this.renderer.addClass(this.elRef.nativeElement, 'dui-max')
    } else {
      this.renderer.removeClass(this.elRef.nativeElement, 'dui-max')
    }
  }

  /**
   * Executes `lockEvents` to handle lock events.
   * @zh 执行 `lockEvents`，用于锁定事件集合。
   */
  public lockEvents(): void {
    this.ngZone.runOutsideAngular(() => {
      this.lockListeners.push(this.renderer.listen(this.elRef.nativeElement, 'selectstart', () => false))
      this.lockListeners.push(this.renderer.listen(this.elRef.nativeElement, 'dragstart', () => false))
    })
  }

  /**
   * Executes `unlockEvents` to handle unlock events.
   * @zh 执行 `unlockEvents`，用于解锁事件集合。
   */
  public unlockEvents(): void {
    while (this.lockListeners.length > 0) {
      const fct = this.lockListeners.pop()
      if (fct) {
        fct()
      }
    }
  }

  /**
   * Angular lifecycle hook invoked just before the component, directive, or service is destroyed to release subscriptions and resources.
   * @zh Angular 生命周期钩子：在组件、指令或服务销毁前调用，用于释放订阅与清理资源。
   */
  public ngOnDestroy(): void {
    this.unlockEvents()

    if (this.transitionListener) {
      this.transitionListener()
    }
    this.split.removeArea(this)
  }

  /**
   * Executes `collapse` to handle collapse.
   * @zh 执行 `collapse`，用于折叠。
   * @param newSize - new size parameter (`number`) / 新尺寸参数（`number`）
   * @param gutter - gutter parameter (`"left" | "right"`) / 分隔槽参数（`"left" | "right"`）
   */
  public collapse(newSize = 0, gutter: 'left' | 'right' = 'right'): void {
    this.split.collapseArea(this, newSize, gutter)
  }

  /**
   * Executes `expand` to handle expand.
   * @zh 执行 `expand`，用于展开。
   */
  public expand(): void {
    this.split.expandArea(this)
  }
}
