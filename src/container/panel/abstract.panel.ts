/**
 * @fileoverview Module `src/container/panel/abstract.panel.ts` providing abstract panel definitions and implementation.
 * @zh 模块文件 `src/container/panel/abstract.panel.ts`，提供abstract面板相关的定义与实现。
 */


import { ComponentBase } from '@dotos/dui/core';
import { AfterViewInit, ChangeDetectorRef, ComponentFactoryResolver, Directive, ElementRef, HostBinding, Injector, Input, OnDestroy, Renderer2, ViewChild, ViewContainerRef } from '@angular/core';
import {isObjectLike,isArray,each}  from 'lodash-es';
import { Container } from '../container.main';
import { IArea } from './interface/IArea';

/**
 * Angular directive `AbstractPanel` attaching abstract panel behavior to host DOM elements.
 * @zh Angular 指令 `AbstractPanel`，为宿主 DOM 元素附加Abstract面板行为。
 */
@Directive()
export class AbstractPanel extends Container implements AfterViewInit,OnDestroy{


  /**
   * Input property `config` (`any`) configuring config (default: `{}`).
   * @zh 输入属性 `config`（类型：`any`），用于配置配置（默认值：`{}`）。
   */
  @Input() config = {};

  /**
   * Property `state` (`string`) storing state (default: `'none'`).
   * @zh 属性 `state`（类型：`string`），用于存储或配置状态（默认值：`'none'`）。
   */
  public state = 'none';

  /**
   * Property `autoLoad` (`any`) storing auto load.
   * @zh 属性 `autoLoad`（类型：`any`），用于存储或配置自动加载。
   */
  public autoLoad;


  /**
   * Property `collapsed` (`boolean`) storing collapsed (default: `false`).
   * @zh 属性 `collapsed`（类型：`boolean`），用于存储或配置已折叠（默认值：`false`）。
   */
  public collapsed = false;


  /**
   * Property `flex` (`string`) storing flex (default: `''`).
   * @zh 属性 `flex`（类型：`string`），用于存储或配置flex（默认值：`''`）。
   */
  public flex: string = '';

  /**
   * Property `el` (`any`) storing el.
   * @zh 属性 `el`（类型：`any`），用于存储或配置DOM元素。
   */
  el;


  /**
   * Property `style` (`any`) storing style.
   * @zh 属性 `style`（类型：`any`），用于存储或配置样式。
   */
  public override style;

  /**
   * Property `inTab` (`boolean`) storing in tab (default: `false`).
   * @zh 属性 `inTab`（类型：`boolean`），用于存储或配置在选项卡（默认值：`false`）。
   */
  public inTab: boolean = false;

  /**
   * Input property `overflowX` (`string`) configuring overflow x (default: `"auto"`).
   * @zh 输入属性 `overflowX`（类型：`string`），用于配置overflowX坐标（默认值：`"auto"`）。
   */
  @Input()
  public overflowX: string = "auto";

  /**
   * Input property `overflowY` (`string`) configuring overflow y (default: `"auto"`).
   * @zh 输入属性 `overflowY`（类型：`string`），用于配置overflowY坐标（默认值：`"auto"`）。
   */
  @Input()
  public overflowY: string = "auto";

  /**
   * Template/content query reference `viewContainer` (`@ViewChild`) targeting view container.
   * @zh 模板/内容视图查询引用 `viewContainer`（`@ViewChild`），指向视图容器。
   */
  @ViewChild('panel', { read: ViewContainerRef }) public override viewContainer: ViewContainerRef;

  /**
   * Host-bound getter `cssFlexdirection` (`style.flex-direction`) computing css flexdirection.
   * @zh 宿主绑定读取器 `cssFlexdirection`（绑定至 `style.flex-direction`），计算并返回CSS样式Flexdirection。
   */
  @HostBinding('style.flex-direction') get cssFlexdirection() {
    return (this.fxLayout === 'row') ? 'row' : 'column';
  }
  /**
   * Host-bound getter `cssMinwidth` (`style.min-width`) computing css minwidth.
   * @zh 宿主绑定读取器 `cssMinwidth`（绑定至 `style.min-width`），计算并返回CSS样式Minwidth。
   */
  @HostBinding('style.min-width') get cssMinwidth() {
    return (this.fxLayout === 'row') ? `${this._getNbGutters() * this.gutterSize}px` : null;
  }

  /**
   * Host-bound getter `cssMinheight` (`style.min-height`) computing css minheight.
   * @zh 宿主绑定读取器 `cssMinheight`（绑定至 `style.min-height`），计算并返回CSS样式Minheight。
   */
  @HostBinding('style.min-height') get cssMinheight() {
    return (this.fxLayout === 'column') ? `${this._getNbGutters() * this.gutterSize}px` : null;
  }
  /**
   * Host-bound getter `cssWidth` (`style.width`) computing css width.
   * @zh 宿主绑定读取器 `cssWidth`（绑定至 `style.width`），计算并返回CSS样式宽度。
   */
  @HostBinding('style.width') get cssWidth() {
    if(this.width){
      return `${this.width}px`;
    }else if(this._fxLayout=='row'&&this.size!=null){
      return (this.size*100)+'%';
    }else{
      return '100%'
    }
  }

  /**
   * Host-bound getter `cssHeight` (`style.height`) computing css height.
   * @zh 宿主绑定读取器 `cssHeight`（绑定至 `style.height`），计算并返回CSS样式高度。
   */
  @HostBinding('style.height') get cssHeight() {
    if(this.height){
      return `${this.height}px`;
    }else if(this._fxLayout=='column'&&this.size!=null){
      return (this.size*100)+'%';
    }else{
      return '100%'
    }
  }

  /**
   * Host-bound getter `cssOverflowX` (`style.overflow-x`) computing css overflow x.
   * @zh 宿主绑定读取器 `cssOverflowX`（绑定至 `style.overflow-x`），计算并返回CSS样式OverflowX坐标。
   */
  @HostBinding('style.overflow-x') get cssOverflowX() {
    return this.overflowX ? `${this.overflowX}` : 'auto';
  }

  /**
   * Host-bound getter `cssOverflowY` (`style.overflow-y`) computing css overflow y.
   * @zh 宿主绑定读取器 `cssOverflowY`（绑定至 `style.overflow-y`），计算并返回CSS样式OverflowY坐标。
   */
  @HostBinding('style.overflow-y') get cssOverflowY() {
    return this.overflowY ? `${this.overflowY}` : 'auto';
  }

  /**
   * Input property `opened` (`boolean`) configuring opened (default: `false`).
   * @zh 输入属性 `opened`（类型：`boolean`），用于配置是否展开（默认值：`false`）。
   */
  @Input('opened') opened: boolean = false;

  /**
   * Property `_gutterSize` (`number`) storing gutter size (default: `1`).
   * @zh 属性 `_gutterSize`（类型：`number`），用于存储或配置分隔槽尺寸（默认值：`1`）。
   */
  private _gutterSize: number = 1;
  /**
   * Input setter `gutterSize` updating gutter size.
   * @zh 输入属性 `gutterSize` 的设置器，用于更新分隔槽尺寸。
   * @param v - New gutter size value (`number`) / 新的分隔槽尺寸值（`number`）
   */
  @Input() set gutterSize(v: number) {
    v = Number(v);
    this._gutterSize = (!isNaN(v) && v > 0) ? v : 1;
    this.doLayout(false, false);
  }
  /**
   * Gets the current gutter size (`gutterSize: number`).
   * @zh 获取当前分隔槽尺寸（`gutterSize: number`）。
   */
  get gutterSize(): number {
    return this._gutterSize;
  }

   /**
    * Input property `disabled` (`boolean`) configuring disabled (default: `false`).
    * @zh 输入属性 `disabled`（类型：`boolean`），用于配置已禁用（默认值：`false`）。
    */
   @Input()   override disabled: boolean = false;

  /**
   * Property `_width` (`number | null`) storing width (default: `null`).
   * @zh 属性 `_width`（类型：`number | null`），用于存储或配置宽度（默认值：`null`）。
   */
  private _width: number | null = null;

  /**
   * Input setter `width` updating width.
   * @zh 输入属性 `width` 的设置器，用于更新宽度。
   * @param v - New width value (`any`) / 新的宽度值（`any`）
   */
  @Input() set width(v) {
    v = Number(v);
    this._width = (!isNaN(v) && v > 0) ? v : null;
    this.doLayout(false, false);
  }

  /**
   * Gets the current width (`width: any`).
   * @zh 获取当前宽度（`width: any`）。
   */
  get width() {
    return this._width;
  }

  /**
   * Property `_height` (`any`) storing height (default: `null`).
   * @zh 属性 `_height`（类型：`any`），用于存储或配置高度（默认值：`null`）。
   */
  private _height = null;
  /**
   * Input setter `height` updating height.
   * @zh 输入属性 `height` 的设置器，用于更新高度。
   * @param v - New height value (`any`) / 新的高度值（`any`）
   */
  @Input() set height(v) {
    v = Number(v);
    this._height = (!isNaN(v) && v > 0) ? v : null;
    this.doLayout(false, false);
  }
  /**
   * Gets the current height (`height: any`).
   * @zh 获取当前高度（`height: any`）。
   */
  get height() {
    return this._height;
  }

  /**
   * Property `_order` (`number | null`) storing order (default: `null`).
   * @zh 属性 `_order`（类型：`number | null`），用于存储或配置顺序（默认值：`null`）。
   */
  private _order: number | null = null;

  /**
   * Input setter `order` updating order.
   * @zh 输入属性 `order` 的设置器，用于更新顺序。
   * @param v - New order value (`number | null`) / 新的顺序值（`number | null`）
   */
  @Input() set order(v: number | null) {
    v = Number(v);
    this._order = !isNaN(v) ? v : null;
    if (this.ownerCt && typeof this.ownerCt.updateArea === 'function') {
      this.ownerCt.updateArea(this, true, false);
    }
  }

  /**
   * Gets the current order (`order: number | null`).
   * @zh 获取当前顺序（`order: number | null`）。
   */
  get order(): number | null {
    return this._order;
  }


  /**
   * Property `_size` (`number | null`) storing size (default: `null`).
   * @zh 属性 `_size`（类型：`number | null`），用于存储或配置尺寸（默认值：`null`）。
   */
  private _size: number | null = null;

  /**
   * Input setter `size` updating size.
   * @zh 输入属性 `size` 的设置器，用于更新尺寸。
   * @param v - New size value (`number | null`) / 新的尺寸值（`number | null`）
   */
  @Input() set size(v: number | null) {
    v = Number(v);
    this._size = (!isNaN(v) && v >= 0 && v <= 100) ? (v / 100) : null;
    if (this.ownerCt && typeof this.ownerCt.updateArea === 'function') {
      this.ownerCt.updateArea(this, false, true);
    }
  }

  /**
   * Gets the current size (`size: number | null`).
   * @zh 获取当前尺寸（`size: number | null`）。
   */
  get size(): number | null {
    return this._size;
  }

  /**
   * Property `_minSize` (`number`) storing min size (default: `0`).
   * @zh 属性 `_minSize`（类型：`number`），用于存储或配置最小值尺寸（默认值：`0`）。
   */
  private _minSize: number = 0;

  /**
   * Input setter `minSize` updating min size.
   * @zh 输入属性 `minSize` 的设置器，用于更新最小值尺寸。
   * @param v - New min size value (`number`) / 新的最小值尺寸值（`number`）
   */
  @Input() set minSize(v: number) {
    v = Number(v);
    this._minSize = (!isNaN(v) && v > 0) ? v : 0;
    if (this.ownerCt && typeof this.ownerCt.updateArea === 'function') {
      this.ownerCt.updateArea(this, false, true);
    }
  }

  /**
   * Gets the current min size (`minSize: number`).
   * @zh 获取当前最小值尺寸（`minSize: number`）。
   */
  get minSize(): number {
    return this._minSize;
  }


  /**
   * Property `_maxSize` (`number`) storing max size (default: `0`).
   * @zh 属性 `_maxSize`（类型：`number`），用于存储或配置最大值尺寸（默认值：`0`）。
   */
  private _maxSize: number = 0;

  /**
   * Input setter `maxSize` updating max size.
   * @zh 输入属性 `maxSize` 的设置器，用于更新最大值尺寸。
   * @param v - New max size value (`number`) / 新的最大值尺寸值（`number`）
   */
  @Input() set maxSize(v: number) {
    v = Number(v);
    this._maxSize = (!isNaN(v) && v > 0) ? v : 0;
    if (this.ownerCt && typeof this.ownerCt.updateArea === 'function') {
      this.ownerCt.updateArea(this, false, true);
    }
  }

  /**
   * Gets the current max size (`maxSize: number`).
   * @zh 获取当前最大值尺寸（`maxSize: number`）。
   */
  get maxSize(): number {
    return this._maxSize;
  }


  /**
   * Property `_visible` (`boolean`) storing visible (default: `true`).
   * @zh 属性 `_visible`（类型：`boolean`），用于存储或配置可见（默认值：`true`）。
   */
  private _visible: boolean = true;

  /**
   * Input setter `visible` updating visible.
   * @zh 输入属性 `visible` 的设置器，用于更新可见。
   * @param v - New visible value (`boolean`) / 新的可见值（`boolean`）
   */
  @Input() set visible(v: boolean) {
    v = (typeof (v) === 'boolean') ? v : (v === 'false' ? false : true);
    this._visible = v;
    if (this.ownerCt) {
      if (this.visible && typeof this.ownerCt.showArea === 'function') {
        this.ownerCt.showArea(this);
      } else if (!this.visible && typeof this.ownerCt.hideArea === 'function') {
        this.ownerCt.hideArea(this);
      }
    }
  }

  /**
   * Gets the current visible (`visible: boolean`).
   * @zh 获取当前可见（`visible: boolean`）。
   */
  get visible(): boolean {
    return this._visible;
  }

  /**
   * Property `_split` (`boolean`) storing split (default: `false`).
   * @zh 属性 `_split`（类型：`boolean`），用于存储或配置分割面板（默认值：`false`）。
   */
  private _split: boolean = false;

  /**
   * Input setter `split` updating split.
   * @zh 输入属性 `split` 的设置器，用于更新分割面板。
   * @param v - New split value (`boolean`) / 新的分割面板值（`boolean`）
   */
  @Input() set split(v: boolean) {
    this._split = v;
  }

  /**
   * Gets the current split (`split: boolean`).
   * @zh 获取当前分割面板（`split: boolean`）。
   */
  get split(): boolean {
    return this._split;
  }

  /**
   * Property `_dir` (`'ltr' | 'rtl'`) storing dir (default: `'ltr'`).
   * @zh 属性 `_dir`（类型：`'ltr' | 'rtl'`），用于存储或配置目录（默认值：`'ltr'`）。
   */
  private _dir: 'ltr' | 'rtl' = 'ltr';

  /**
   * Input setter `dir` updating dir.
   * @zh 输入属性 `dir` 的设置器，用于更新目录。
   * @param v - New dir value (`'ltr' | 'rtl'`) / 新的目录值（`'ltr' | 'rtl'`）
   */
  @Input() set dir(v: 'ltr' | 'rtl') {
    v = (v === 'rtl') ? 'rtl' : 'ltr';
    this._dir = v;
  }

  /**
   * Gets the current dir (`dir: 'ltr' | 'rtl'`).
   * @zh 获取当前目录（`dir: 'ltr' | 'rtl'`）。
   */
  get dir(): 'ltr' | 'rtl' {
    return this._dir;
  }

  /**
   * Property `_fxLayout` (`'row' | 'column'`) storing fx layout (default: `'row'`).
   * @zh 属性 `_fxLayout`（类型：`'row' | 'column'`），用于存储或配置fx布局（默认值：`'row'`）。
   */
  public _fxLayout: 'row' | 'column' = 'row';

  /**
   * Input setter `fxLayout` updating fx layout.
   * @zh 输入属性 `fxLayout` 的设置器，用于更新fx布局。
   * @param v - New fx layout value (`'row' | 'column'`) / 新的fx布局值（`'row' | 'column'`）
   */
  @Input() set fxLayout(v: 'row' | 'column') {
    v = (v === 'row') ? 'row' : 'column';
    this._fxLayout = v;
     this.doLayout(false, false);
  }

  /**
   * Gets the current fx layout (`fxLayout: 'row' | 'column'`).
   * @zh 获取当前fx布局（`fxLayout: 'row' | 'column'`）。
   */
  get fxLayout(): 'row' | 'column' {
    return this._fxLayout;
  }

  /**
   * Sets the displayed areas (`displayedAreas`).
   * @zh 设置已展示区域集合（`displayedAreas`）。
   * @param displayedAreas - New displayed areas value (`IArea[]`) / 新的已展示区域集合值（`IArea[]`）
   */
  set displayedAreas(displayedAreas:IArea[]) {

    this._displayedAreas=displayedAreas;
  }

  /**
   * Gets the current displayed areas (`displayedAreas: IArea[]`).
   * @zh 获取当前已展示区域集合（`displayedAreas: IArea[]`）。
   */
  get displayedAreas():IArea[] {

    return this._displayedAreas;
  }

  /**
   * Property `_displayedAreas` (`IArea[]`) storing displayed areas (default: `[]`).
   * @zh 属性 `_displayedAreas`（类型：`IArea[]`），用于存储或配置已展示区域集合（默认值：`[]`）。
   */
  public  _displayedAreas: IArea[] = [];

  /**
   * Sets the hided areas (`hidedAreas`).
   * @zh 设置已隐藏区域集合（`hidedAreas`）。
   * @param hidedAreas - New hided areas value (`IArea[]`) / 新的已隐藏区域集合值（`IArea[]`）
   */
  set hidedAreas(hidedAreas:IArea[]) {
    this._hidedAreas = hidedAreas;
  }

  /**
   * Gets the current hided areas (`hidedAreas: IArea[]`).
   * @zh 获取当前已隐藏区域集合（`hidedAreas: IArea[]`）。
   */
  get hidedAreas():IArea[] {
    return this._hidedAreas;
  }

  /**
   * Property `_hidedAreas` (`IArea[]`) storing hided areas (default: `[]`).
   * @zh 属性 `_hidedAreas`（类型：`IArea[]`），用于存储或配置已隐藏区域集合（默认值：`[]`）。
   */
  public  _hidedAreas: IArea[] = [];

  /**
   * Property `lockListeners` (`Function[]`) storing lock listeners (default: `[]`).
   * @zh 属性 `lockListeners`（类型：`Function[]`），用于存储或配置锁定监听器列表（默认值：`[]`）。
   */
  private  lockListeners: Function[] = [];

  /**
   * Creates an instance of `AbstractPanel` and initializes its dependencies and internal state.
   * @zh 创建 `AbstractPanel` 实例，并初始化其依赖项与内部状态。
   * @param _element - Injected or initial element (`ElementRef`) / 注入或传入的元素（`ElementRef`）
   * @param renderer - Injected or initial renderer (`Renderer2`) / 注入或传入的渲染器（`Renderer2`）
   * @param resolver - Injected or initial resolver (`ComponentFactoryResolver`) / 注入或传入的解析器（`ComponentFactoryResolver`）
   * @param injector - Injected or initial injector (`Injector`) / 注入或传入的注入器（`Injector`）
   * @param detectRef - Injected or initial detect ref (`ChangeDetectorRef`) / 注入或传入的检测引用（`ChangeDetectorRef`）
   */
  constructor(
    protected _element: ElementRef,
    protected renderer: Renderer2,
    public override resolver: ComponentFactoryResolver,
    public override injector: Injector,
    public override detectRef: ChangeDetectorRef
  ) {
    super(resolver, injector, detectRef);
    this.el = this._element.nativeElement;
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
    this.doLayout(true, true);
  }

  /**
   * Angular lifecycle hook invoked once after the component's view and child views are initialized.
   * @zh Angular 生命周期钩子：在组件视图及其子视图初始化完成后调用一次。
   */
  public override ngAfterViewInit() {
    super.ngAfterViewInit();
    this.doLayout(true, true);
  }

  /**
   * Angular lifecycle hook invoked just before the component, directive, or service is destroyed to release subscriptions and resources.
   * @zh Angular 生命周期钩子：在组件、指令或服务销毁前调用，用于释放订阅与清理资源。
   */
  public override ngOnDestroy(): void {
    this.unlockEvents();
    this.detectRef.detach();
    if (this.ownerCt && this.ownerCt.xtype === 'panel' && typeof this.ownerCt.removeArea === 'function') {
      this.ownerCt.removeArea(this);
    }
    super.ngOnDestroy();
  }

  /**
   * Executes `setActive` to handle set active.
   * @zh 执行 `setActive`，用于集合激活。
   * @param comp - comp parameter (`any`) / 组件参数（`any`）
   */
  public setActive(comp): void {
    if (isObjectLike(comp)) {
      comp = comp['id'];
    }
    if (this.items) {
      this.items.each(item => {
        if (item.id === comp) {
          item.show()
        } else {
          item.hide();
        }
      });
    }
    this.detectRef.markForCheck();
  }

  /**
   * Executes `_getNbGutters` to handle get nb gutters.
   * @zh 执行 `_getNbGutters`，用于获取Nb分隔槽。
   * @returns Result of type `number` / 类型为 `number` 的返回值
   */
  protected _getNbGutters(): number {
    return this.displayedAreas.length - 1;
  }

  /**
   * Executes `lockEvents` to handle lock events.
   * @zh 执行 `lockEvents`，用于锁定事件集合。
   */
  public lockEvents(): void {
    this.lockListeners.push(this.renderer.listen(this.el, 'selectstart', () => false));
    this.lockListeners.push(this.renderer.listen(this.el, 'dragstart', () => false));
  }
  /**
   * Executes `unlockEvents` to handle unlock events.
   * @zh 执行 `unlockEvents`，用于解锁事件集合。
   */
  public unlockEvents(): void {
    while (this.lockListeners.length > 0) {
      const fct = this.lockListeners.pop();
      if (fct) {
        fct();
      }
    }
  }

  /**
   * Executes `setStyleVisibleAndDir` to handle set style visible and dir.
   * @zh 执行 `setStyleVisibleAndDir`，用于集合样式可见And目录。
   * @param isVisible - is visible parameter (`boolean`) / 是否为可见参数（`boolean`）
   * @param isDragging - is dragging parameter (`boolean`) / 是否为拖拽中参数（`boolean`）
   * @param direction - direction parameter (`'row' | 'column'`) / 方向参数（`'row' | 'column'`）
   */
  public setStyleVisibleAndDir(isVisible: boolean, isDragging: boolean, direction: 'row' | 'column'): void {
    if (isVisible === false) {
      this.setStyleFlexbasis('0', isDragging);
      this.renderer.setStyle(this.el, 'overflow-x', 'hidden');
      this.renderer.setStyle(this.el, 'overflow-y', 'hidden');
      if (direction === 'column') {
        this.renderer.setStyle(this.el, 'max-width', '0');
      }
    } else {
      this.renderer.setStyle(this.el, 'overflow-x', 'hidden');
      this.renderer.setStyle(this.el, 'overflow-y', 'auto');
      this.renderer.removeStyle(this.el, 'max-width');
    }
    if (direction === 'row') {
      this.renderer.setStyle(this.el, 'height', '100%');
      this.renderer.removeStyle(this.el, 'width');
    } else {
      this.renderer.setStyle(this.el, 'width', '100%');
      this.renderer.removeStyle(this.el, 'height');
    }
  }

  /**
   * Executes `setStyleOrder` to handle set style order.
   * @zh 执行 `setStyleOrder`，用于集合样式顺序。
   * @param value - value parameter (`number`) / 值参数（`number`）
   */
  public setStyleOrder(value: number): void {
    this.renderer.setStyle(this.el, 'order', value);
  }

  /**
   * Executes `setStyleFlexbasis` to handle set style flexbasis.
   * @zh 执行 `setStyleFlexbasis`，用于集合样式Flexbasis。
   * @param value - value parameter (`string`) / 值参数（`string`）
   * @param isDragging - is dragging parameter (`boolean`) / 是否为拖拽中参数（`boolean`）
   */
  public setStyleFlexbasis(value: string, isDragging: boolean): void {
    // If component not yet initialized or gutter being dragged, disable transition
    if (this.ownerCt && (this.ownerCt.isViewInitialized === false || isDragging === true)) {
      this._setStyleTransition(false);
    } else if (this.ownerCt && this.ownerCt.useTransition !== undefined) {
      this._setStyleTransition(this.ownerCt.useTransition);
    }
    this.renderer.setStyle(this.el, 'flex-basis', value);
  }

  /**
   * Executes `_setStyleTransition` to handle set style transition.
   * @zh 执行 `_setStyleTransition`，用于集合样式过渡动画。
   * @param useTransition - use transition parameter (`boolean`) / 使用过渡动画参数（`boolean`）
   */
  private _setStyleTransition(useTransition: boolean): void {
    if (useTransition) {
      this.renderer.setStyle(this.el, 'transition', `flex-basis 0.3s`);
    } else {
      this.renderer.removeStyle(this.el, 'transition');
    }
  }
  /**
   * Executes `getSizePixel` to handle get size pixel.
   * @zh 执行 `getSizePixel`，用于获取尺寸像素。
   * @param prop - prop parameter (`'offsetWidth' | 'offsetHeight'`) / 属性参数（`'offsetWidth' | 'offsetHeight'`）
   * @returns Result of type `number` / 类型为 `number` 的返回值
   */
  public getSizePixel(prop: 'offsetWidth' | 'offsetHeight'): number {
    return this.el[prop];
  }


  // private
  /**
   * Executes `initEvents` to handle init events.
   * @zh 执行 `initEvents`，用于初始化事件集合。
   */
  initEvents() {

  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  /**
   * Executes `doLayout` to handle do layout.
   * @zh 执行 `doLayout`，用于do布局。
   * @param shallow - shallow parameter (`boolean`) / shallow参数（`boolean`）
   * @param force - force parameter (`boolean`) / force参数（`boolean`）
   */
  doLayout(shallow: boolean, force?: boolean): void {

  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  /**
   * Executes `remove` to handle remove.
   * @zh 执行 `remove`，用于移除。
   * @param c - c parameter (`any`) / c参数（`any`）
   * @param ad - ad parameter (`boolean`) / ad参数（`boolean`）
   * @returns Result of type `any` / 类型为 `any` 的返回值
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
   * @param comp - comp parameter (`any`) / 组件参数（`any`）
   * @param index - index parameter (`any`) / 索引参数（`any`）
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
   * @zh 执行 `havePanel`，用于have面板。
   * @param comp - comp parameter (`any`) / 组件参数（`any`）
   * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
   */
  public havePanel(comp): boolean {
    return this.getComponent(comp) !== undefined;
  }
}
