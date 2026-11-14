/**
 * @fileoverview Module `src/container/accordion/accordion.ts` providing accordion definitions and implementation.
 * @zh 模块文件 `src/container/accordion/accordion.ts`，提供手风琴相关的定义与实现。
 */


import { DuiConfig } from '@dotos/dui/base';
import { Component, SimpleChanges, Input, ViewChild, ViewContainerRef, Injector, ChangeDetectorRef, ElementRef, Renderer2, OnChanges } from '@angular/core';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { Dui } from '@dotos/dui/core';
import { AbstractPanel } from '../panel/abstract.panel';



/**
 * Type alias `AccordionDisplayMode` representing accordion display mode (`'default' | 'flat'`).
 * @zh 类型别名 `AccordionDisplayMode`，表示手风琴Display模式（`'default' | 'flat'`）。
 */
export type AccordionDisplayMode = 'default' | 'flat';

/**
 * Used to generate unique ID for each accordion.
 * @zh 常量/变量 `nextId`，定义 `src/container/accordion` 中的下一个唯一标识。
 */
let nextId = 0;
/**
 * Directive for a Exterial Design Accordion.

 * @zh Angular 组件 `Accordion`（selector: 'accordion'），提供手风琴的视图渲染与交互逻辑（位于 `src/container/accordion`）。
 */
@Component({
  selector: 'accordion',
  inputs: ['multi', 'displayMode', 'hideToggle'],
  styleUrls: ['./accordion.scss'],
  templateUrl: './accordion.html',
  exportAs: 'duiAccordion',
  host: {
    class: 'accordion',
    hostID: 'dui-accordion' + Math.random().toString(36).substring(2, 15),
  }
})
export class Accordion extends AbstractPanel implements OnChanges{

  /**
   * A readonly id value to use for unique selection coordination.
   * @zh 属性 `id`（类型：`string`），用于存储或配置唯一标识（默认值：`'cdk-accordion-${nextId++}'`）。
   */
  override readonly id = `cdk-accordion-${nextId++}`;

  /**
   * Whether the accordion should allow multiple expanded accordion items simulateously.
   * @zh 输入属性 `multi`（类型：`boolean`）的读取器，返回当前多。
   */
  @Input() get multi(): boolean { return this._multi; }
  /**
   * Sets the multi (`multi`).
   * @zh 设置多（`multi`）。
   * @param multi - New multi value (`boolean`) / 新的多值（`boolean`）
   */
  set multi(multi: boolean) { this._multi = coerceBooleanProperty(multi); }
  /**
   * Property `_multi` (`boolean`) storing multi (default: `false`).
   * @zh 属性 `_multi`（类型：`boolean`），用于存储或配置多（默认值：`false`）。
   */
  private _multi: boolean = false;

  /**
   * Whether the expansion indicator should be hidden.
   * @zh 输入属性 `hideToggle`（类型：`boolean`）的读取器，返回当前隐藏开关。
   */
  @Input() get hideToggle(): boolean { return this._hideToggle; }
  /**
   * Sets the hide toggle (`hideToggle`).
   * @zh 设置隐藏开关（`hideToggle`）。
   * @param show - New hide toggle value (`boolean`) / 新的隐藏开关值（`boolean`）
   */
  set hideToggle(show: boolean) { this._hideToggle = coerceBooleanProperty(show); }
  /**
   * Property `_hideToggle` (`boolean`) storing hide toggle (default: `false`).
   * @zh 属性 `_hideToggle`（类型：`boolean`），用于存储或配置隐藏开关（默认值：`false`）。
   */
  private _hideToggle: boolean = false;


  /**
   * Input property `displayMode` (`AccordionDisplayMode`) configuring display mode (default: `'default'`).
   * @zh 输入属性 `displayMode`（类型：`AccordionDisplayMode`），用于配置display模式（默认值：`'default'`）。
   */
  @Input() displayMode: AccordionDisplayMode = 'default';

  /**
   * Input property `config` (`DuiConfig`) configuring config (default: `{}`).
   * @zh 输入属性 `config`（类型：`DuiConfig`），用于配置配置（默认值：`{}`）。
   */
  @Input() override config: DuiConfig = {};

  /**
   * Property `xtype` (`string`) storing xtype (default: `'accordion'`).
   * @zh 属性 `xtype`（类型：`string`），用于存储或配置扩展类型（默认值：`'accordion'`）。
   */
  public override xtype: string = 'accordion';

/**
 * Template/content query reference `viewContainer` (`ViewContainerRef`) targeting view container.
 * @zh 模板/内容视图查询引用 `viewContainer`（`@ViewChild`），指向视图容器。
 */
//@ts-ignore
  @ViewChild('expansiongroup', { read: ViewContainerRef }) public override viewContainer: ViewContainerRef;

  /**
   * Property `_fxLayout` (`"column" | "row"`) storing fx layout (default: `'column'`).
   * @zh 属性 `_fxLayout`（类型：`"column" | "row"`），用于存储或配置fx布局（默认值：`'column'`）。
   */
  public override _fxLayout: 'row' | 'column' = 'column';

  /**
   * Input setter `fxLayout` updating fx layout.
   * @zh 输入属性 `fxLayout` 的设置器，用于更新fx布局。
   * @param v - New fx layout value (`"column" | "row"`) / 新的fx布局值（`"column" | "row"`）
   */
  @Input() override set fxLayout(v: 'row' | 'column') {
    v = (v === 'row') ? 'row' : 'column';
    this._fxLayout = v;
  }

  /**
   * Gets the current fx layout (`fxLayout: 'row' | 'column'`).
   * @zh 获取当前fx布局（`fxLayout: 'row' | 'column'`）。
   */
  override get fxLayout(): 'row' | 'column' {
    return this._fxLayout;
  }

  /**
   * Creates an instance of `Accordion` and initializes its dependencies and internal state.
   * @zh 创建 `Accordion` 实例，并初始化其依赖项与内部状态。
   * @param _element - Injected or initial element (`ElementRef<any>`) / 注入或传入的元素（`ElementRef<any>`）
   * @param renderer - Injected or initial renderer (`Renderer2`) / 注入或传入的渲染器（`Renderer2`）
   * @param resolver - Injected or initial resolver (`ComponentFactoryResolver`) / 注入或传入的解析器（`ComponentFactoryResolver`）
   * @param injector - Injected or initial injector (`Injector`) / 注入或传入的注入器（`Injector`）
   * @param detectRef - Injected or initial detect ref (`ChangeDetectorRef`) / 注入或传入的检测引用（`ChangeDetectorRef`）
   */
  constructor(
    protected override _element: ElementRef,
    protected override renderer: Renderer2,
    public override injector: Injector,
    public override detectRef: ChangeDetectorRef) {
    super(_element, renderer, injector, detectRef);
  }

  /**
   * Angular lifecycle hook invoked when data-bound input properties change.
   * @zh Angular 生命周期钩子：当数据绑定的输入属性发生变更时调用。
   * @param changes - changes parameter (`SimpleChanges`) / 变更集合参数（`SimpleChanges`）
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
    config = config || {};

    this.initFieldExpression(config);
    Dui.apply(this, config);

    if (this.viewContainer) {
      this.viewContainer.clear();
    }
    this.addConfiguredItems();
  }
}
