/**
 * @fileoverview Module `src/container/layout/component/abstract.panel.ts` providing abstract panel definitions and implementation.
 * @zh 模块文件 `src/container/layout/component/abstract.panel.ts`，提供abstract面板相关的定义与实现。
 */


import { DuiConfig } from '@dotos/dui/base';
import { ComponentBase } from '@dotos/dui/core';
import { ChangeDetectorRef, Directive, ElementRef, Injector, Input, NgZone, OnChanges, OnDestroy, OnInit, Renderer2, SimpleChanges } from '@angular/core';
import { Container } from '@dotos/dui/container';
import {isArray,each}  from 'lodash-es';
import { getInputPositiveNumber, getInputboolean } from '../utils';
import { LayoutComponent } from './layout.component';

/**
 * Angular directive `AbstractPanel` attaching abstract panel behavior to host DOM elements.
 * @zh Angular 指令 `AbstractPanel`，为宿主 DOM 元素附加Abstract面板行为。
 */
@Directive({ standalone: false })
export class AbstractPanel extends Container implements OnChanges,OnInit,OnDestroy {


  /**
   * Input property `config` (`DuiConfig`) configuring config (default: `{}`).
   * @zh 输入属性 `config`（类型：`DuiConfig`），用于配置配置（默认值：`{}`）。
   */
  @Input() config: DuiConfig = {};

  /**
   * Property `el` (`any`) storing el.
   * @zh 属性 `el`（类型：`any`），用于存储或配置DOM元素。
   */
  public el;

  /**
   * Property `style` (`any`) storing style.
   * @zh 属性 `style`（类型：`any`），用于存储或配置样式。
   */
  declare public style;

  /**
   * Property `_order` (`number`) storing order (default: `null`).
   * @zh 属性 `_order`（类型：`number`），用于存储或配置顺序（默认值：`null`）。
   */
  private _order: number | null = null

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
   * Creates an instance of `AbstractPanel` and initializes its dependencies and internal state.
   * @zh 创建 `AbstractPanel` 实例，并初始化其依赖项与内部状态。
   * @param elRef - Injected or initial el ref (`ElementRef<any>`) / 注入或传入的DOM元素引用（`ElementRef<any>`）
   * @param renderer - Injected or initial renderer (`Renderer2`) / 注入或传入的渲染器（`Renderer2`）
   * @param resolver - Injected or initial resolver (`ComponentFactoryResolver`) / 注入或传入的解析器（`ComponentFactoryResolver`）
   * @param injector - Injected or initial injector (`Injector`) / 注入或传入的注入器（`Injector`）
   * @param detectRef - Injected or initial detect ref (`ChangeDetectorRef`) / 注入或传入的检测引用（`ChangeDetectorRef`）
   * @param ngZone - Injected or initial ng zone (`NgZone`) / 注入或传入的Angular区域(NgZone)（`NgZone`）
   * @param split - Injected or initial split (`LayoutComponent`) / 注入或传入的分割面板（`LayoutComponent`）
   */
  constructor(
    public elRef: ElementRef,
    public renderer: Renderer2,
    public override injector: Injector,
    public override detectRef: ChangeDetectorRef,
    private ngZone: NgZone,
    private split: LayoutComponent,
  ) {
    super(injector, detectRef);
    this.el = this.elRef.nativeElement;
    this.renderer.addClass(this.elRef.nativeElement, 'dui-split-area')
  }

  /**
   * Angular lifecycle hook invoked when data-bound input properties change.
   * @zh Angular 生命周期钩子：当数据绑定的输入属性发生变更时调用。
   * @param changes - changes parameter (`{ [propName: string]: SimpleChange<any>; }`) / 变更集合参数（`{ [propName: string]: SimpleChange<any>; }`）
   */
  override ngOnChanges(changes: SimpleChanges) {
    if (changes['config']) {
      this.init(this.config);
    }
  }

  // private
  /**
   * Executes `init` to handle init.
   * @zh 执行 `init`，用于初始化。
   * @param config - config parameter (`any`) / 配置参数（`any`）
   */
  override init(config) {
    super.init(config);
    this.detectRef.detectChanges();
    if (this.viewContainer) {
      this.viewContainer.clear();
    }
    this.addConfiguredItems();
  }

  /**
   * Angular lifecycle hook invoked once after component or directive inputs are initialized.
   * @zh Angular 生命周期钩子：在组件或指令的输入属性初始化完成后调用一次。
   */
  public override ngOnInit(): void {
    this.split.addArea(this)
    this.ngZone.runOutsideAngular(() => {
      this.transitionListener = this.renderer.listen(
        this.elRef.nativeElement,
        'transitionend',
        (event: TransitionEvent) => {
          // Limit only flex-basis transition to trigger the event
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
    // Need 3 separated properties to work on IE11 (https://github.com/angular/flex-layout/issues/323)
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
  public override ngOnDestroy(): void {
    this.unlockEvents()
    if (this.transitionListener) {
      this.transitionListener()
    }
    this.split.removeArea(this)
    super.ngOnDestroy()
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  /**
   * Executes `remove` to handle remove.
   * @zh 执行 `remove`，用于移除。
   * @param c - c parameter (`string | number | ComponentBase`) / c参数（`string | number | ComponentBase`）
   * @param ad - ad parameter (`boolean`) / ad参数（`boolean`）
   * @returns Result of type `ComponentBase` / 类型为 `ComponentBase` 的返回值
   */
  override remove(c: ComponentBase | string | number, ad?: boolean): ComponentBase {
    const comp = super.remove(c, false);
    if (comp) {
      const index = this.viewContainer.indexOf(comp.reference.hostView);
      this.viewContainer.remove(index);
    }
    return comp;
  }

  /**
   * Executes `_addItem` to handle add item.
   * @zh 执行 `_addItem`，用于添加条目。
   * @param comp - comp parameter (`ComponentBase`) / 组件参数（`ComponentBase`）
   * @param index - index parameter (`number`) / 索引参数（`number`）
   */
  protected override _addItem(comp: ComponentBase, index: number): void {
    this.items.add(comp);
    if (comp.onAdded) {
      comp.onAdded(this, index);
    }
    this.viewContainer.insert(comp.reference.hostView);
    this.onAdd(comp);
    this.trigger('add', this);
  }

  /**
   * Executes `havePanel` to handle have panel.
   * @zh 执行 `havePanel`，用于具有面板。
   * @param comp - comp parameter (`any`) / 组件参数（`any`）
   * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
   */
  public havePanel(comp): boolean {
    return this.getComponent(comp) !== undefined;
  }
}
