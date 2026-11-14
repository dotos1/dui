/**
 * @fileoverview Module `src/core/component.base.ts` providing component base definitions and implementation.
 * @zh 模块文件 `src/core/component.base.ts`，提供组件基础相关的定义与实现。
 */


import { AfterContentChecked, AfterContentInit, AfterViewChecked, AfterViewInit, ChangeDetectorRef, ComponentRef, Directive, DoCheck, HostBinding, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Base, DuiCompiledExpression, DuiConfig, DuiExpression, DuiListeners, DuiPluginConfig, DuiStyle } from '@dotos/dui/base';
import {isFunction,isObjectLike,isString}  from 'lodash-es';
import { Dui } from './dui';

/**
 * Angular directive `ComponentBase` attaching component base behavior to host DOM elements.
 * @zh Angular 指令 `ComponentBase`，为宿主 DOM 元素附加组件基础行为。
 */
/** 已实例化的插件：初始化时拿到宿主组件 */
export interface DuiPlugin {
  init(host: ComponentBase): void;
  ptype?: string;
}

@Directive({ standalone: false })
export class ComponentBase extends Base<HTMLElement> implements OnInit,DoCheck, OnChanges,OnDestroy, AfterViewChecked, AfterViewInit, AfterContentInit, AfterContentChecked {

  /**
   * Host binding `display` bound to host attribute/property `style.display` for display.
   * @zh 宿主绑定属性 `display`，绑定至宿主元素 `style.display` 以控制display。
   */
  @HostBinding('style.display') display = 'inherit';

  /**
   * Input property `ownerCt` (`any`) configuring owner ct.
   * @zh 输入属性 `ownerCt`（类型：`any`），用于配置所属者Ct。
   */
  // 所属容器。应用会在容器链上挂任意业务字段（ownerCt.ownerCt.param、frameIndex……），
  // 库里给不出静态形状，这里显式保留 any（G-ANY 计数在内）。
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Input() public ownerCt: any;

  /**
   * Input property `disabled` (`boolean`) configuring disabled (default: `false`).
   * @zh 输入属性 `disabled`（类型：`boolean`），用于配置已禁用（默认值：`false`）。
   */
  @Input()  public disabled = false;


  /**
   * Property `id` (`string`) storing id.
   * @zh 属性 `id`（类型：`string`），用于存储或配置唯一标识。
   */
  public id: string;

  /**
   * Property `xtype` (`string`) storing xtype (default: `'component'`).
   * @zh 属性 `xtype`（类型：`string`），用于存储或配置扩展类型（默认值：`'component'`）。
   */
  public xtype = 'component';


  /**
   * Property `reference` (`ComponentRef<ComponentBase>`) storing reference.
   * @zh 属性 `reference`（类型：`ComponentRef<ComponentBase>`），用于存储或配置引用。
   */
  public reference: ComponentRef<ComponentBase>;

  /**
   * Property `_hidden` (`boolean`) storing hidden (default: `false`).
   * @zh 属性 `_hidden`（类型：`boolean`），用于存储或配置隐藏（默认值：`false`）。
   */
  public _hidden = false;

  /**
   * Property `plugins` (`DuiPluginConfig | DuiPluginConfig[] | DuiPlugin | DuiPlugin[]`) storing plugins.
   * @zh 属性 `plugins`（类型：`DuiPluginConfig | DuiPluginConfig[] | DuiPlugin | DuiPlugin[]`），用于存储或配置plugins。
   */
  public plugins: DuiPluginConfig | DuiPluginConfig[] | DuiPlugin | DuiPlugin[];

  /**
   * Property `inited` (`boolean`) storing inited (default: `false`).
   * @zh 属性 `inited`（类型：`boolean`），用于存储或配置已初始化（默认值：`false`）。
   */
  public inited: boolean = false;

  /**
   * Property `ref` (`string`) storing ref (default: `''`).
   * @zh 属性 `ref`（类型：`string`），用于存储或配置引用（默认值：`''`）。
   */
  public ref = '';

  /**
   * Property `style` (`DuiStyle`) storing style.
   * @zh 属性 `style`（类型：`DuiStyle`），用于存储或配置样式。
   */
  public style: DuiStyle;

  /**
   * Property `listeners` (`DuiListeners`) storing listeners.
   * @zh 属性 `listeners`（类型：`DuiListeners`），用于存储或配置监听器列表。
   */
  protected listeners: DuiListeners;


  /**
   * Property `hideExpression` (`DuiExpression`) storing hide expression.
   * @zh 属性 `hideExpression`（类型：`DuiExpression`），用于存储或配置隐藏表达式。
   */
  hideExpression?: DuiExpression;

  /**
   * Property `disableExpression` (`DuiExpression`) storing disable expression.
   * @zh 属性 `disableExpression`（类型：`DuiExpression`），用于存储或配置禁用表达式。
   */
  disableExpression?: DuiExpression;

  /**
   * Property `expressionProperties` (`{ [propertyPath: string]: DuiCompiledExpression; }`) storing expression properties.
   * @zh 属性 `expressionProperties`（类型：`{ [propertyPath: string]: DuiCompiledExpression; }`），用于存储或配置表达式属性列表。
   */
  /** 初始化（initFieldExpression）后的表达式属性：每项都已编译 */
  expressionProperties?: { [propertyPath: string]: DuiCompiledExpression };

  /**
   * Gets the current hidden (`hidden: any`).
   * @zh 获取当前隐藏（`hidden: any`）。
   */
  get hidden(): boolean {
    return this._hidden;
  }
  /**
   * Sets the hidden (`hidden`).
   * @zh 设置隐藏（`hidden`）。
   * @param hidden - New hidden value (`boolean`) / 新的隐藏值（`boolean`）
   */
  set hidden(hidden: boolean) {
    this.detectRef.markForCheck();
    if (hidden) {
      this.display = 'none';
    } else {
      this.display = 'inherit';
    }
    this._hidden = hidden;
    this.detectRef.detectChanges();
  }


  /**
   * Executes `show` to handle show.
   * @zh 执行 `show`，用于显示。
   */
  show() {
    this.hidden = false;
  }

  /**
   * Executes `hide` to handle hide.
   * @zh 执行 `hide`，用于隐藏。
   */
  hide() {
    this.hidden = true;
  }


  /**
   * Gets the current disable (`disable: boolean`).
   * @zh 获取当前禁用（`disable: boolean`）。
   */
  get disable(): boolean {
    return this.disabled;
  }

  /**
   * Sets the disable (`disable`).
   * @zh 设置禁用（`disable`）。
   * @param opts - New disable value (`boolean`) / 新的禁用值（`boolean`）
   */
  set disable(opts: boolean) {
    this.disabled = opts;
    this.detectRef.detectChanges();
  }

  /**
   * Creates an instance of `ComponentBase` and initializes its dependencies and internal state.
   * @zh 创建 `ComponentBase` 实例，并初始化其依赖项与内部状态。
   * @param detectRef - Injected or initial detect ref (`ChangeDetectorRef`) / 注入或传入的检测引用（`ChangeDetectorRef`）
   */
  constructor(
    public detectRef: ChangeDetectorRef,
  ) {
    super();
  }

  /**
   * Angular lifecycle hook invoked once after component or directive inputs are initialized.
   * @zh Angular 生命周期钩子：在组件或指令的输入属性初始化完成后调用一次。
   */
  ngOnInit() {
    this.inited = true;
    this.trigger('onInit', this);
  }

  /**
   * Angular lifecycle hook invoked just before the component, directive, or service is destroyed to release subscriptions and resources.
   * @zh Angular 生命周期钩子：在组件、指令或服务销毁前调用，用于释放订阅与清理资源。
   */
  ngOnDestroy() {
    this.trigger('onDestroy', this);
    this.detectRef.detach();
    this.onDestroy();
    this.destroy();
  }

  /**
   * Angular lifecycle hook invoked after every check of the component's view and child views.
   * @zh Angular 生命周期钩子：在每次检查完组件视图及其子视图后调用。
   */
  ngAfterViewChecked() {
    this.trigger('afterViewChecked', this);
  }
  /**
   * Angular lifecycle hook invoked once after the component's view and child views are initialized.
   * @zh Angular 生命周期钩子：在组件视图及其子视图初始化完成后调用一次。
   */
  ngAfterViewInit() {
    this.trigger('afterViewInit', this);
  }
  /**
   * Angular lifecycle hook invoked once after projected content (`ng-content`) is initialized.
   * @zh Angular 生命周期钩子：在投影内容（`ng-content`）初始化完成后调用一次。
   */
  ngAfterContentInit() {
    this.trigger('afterContentInit', this);
  }
  /**
   * Angular lifecycle hook invoked after every check of projected content.
   * @zh Angular 生命周期钩子：在每次检查完投影内容后调用。
   */
  ngAfterContentChecked() {
    this.trigger('afterContentChecked', this);
    // this.detectRef.detectChanges();
  }

  /**
   * Angular lifecycle hook invoked during every change-detection run for custom change detection.
   * @zh Angular 生命周期钩子：在每次变更检测周期中调用，用于执行自定义变更检测。
   */
  ngDoCheck() {
     this.trigger('doCheck', this);
    this.checkExpressionChange();
  }
  /**
   * Angular lifecycle hook invoked when data-bound input properties change.
   * @zh Angular 生命周期钩子：当数据绑定的输入属性发生变更时调用。
   * @param changes - changes parameter (`SimpleChanges`) / 变更集合参数（`SimpleChanges`）
   */
  ngOnChanges(changes: SimpleChanges) {
    this.trigger('onChanges', changes);
  }

  /**
   * Executes `initFieldExpression` to handle init field expression.
   * @zh 执行 `initFieldExpression`，用于初始化字段表达式。
   * @param config - config parameter (`DuiConfig`) / 配置参数（`DuiConfig`）
   */
  public initFieldExpression(config: DuiConfig): void {
    if (config.expressionProperties) {
      for (const key in config.expressionProperties) {
        const raw = config.expressionProperties[key];
        if (typeof raw === 'string' || typeof raw === 'function') {
          config.expressionProperties[key] = {
            expression: typeof raw === 'function' ? raw : Dui.evalStringExpression(raw, ['comp', 'owner']),
            expressionValueSetter: Dui.evalExpressionValueSetter(key, ['expressionValue', 'comp', 'owner']),
          };
        }
      }
    }
    if (config.hideExpression) {
      if (typeof config.hideExpression === 'string') {
        config.hideExpression = Dui.evalStringExpression(config.hideExpression, ['comp', 'owner']);
      }
    }
    if (config.disableExpression) {
      if (typeof config.disableExpression === 'string') {
        config.disableExpression = Dui.evalStringExpression(config.disableExpression, ['comp', 'owner']);
      }
    }
  }

  /**
   * Executes `checkExpressionChange` to handle check expression change.
   * @zh 执行 `checkExpressionChange`，用于检查表达式变更。
   */
  public checkExpressionChange() {
    this.checkCompExpressionChange(this, this.ownerCt);
    this.checkCompVisibilityChange(this, this.ownerCt);
    this.checkCompDisableChange(this, this.ownerCt);
  }

  /**
   * Executes `checkCompExpressionChange` to handle check comp expression change.
   * @zh 执行 `checkCompExpressionChange`，用于检查组件表达式变更。
   * @param comp - comp parameter (`ComponentBase`) / 组件参数（`ComponentBase`）
   * @param owner - owner parameter (`ComponentBase`) / 所属者参数（`ComponentBase`）
   */
  public checkCompExpressionChange(comp: ComponentBase, owner: ComponentBase) {
    if (!comp || !comp.expressionProperties) {
      return;
    }
    const expressionProperties = comp.expressionProperties;
    for (const key in expressionProperties) {
      const expressionValue = Dui.evalExpression(
        expressionProperties[key].expression,
        { comp },
        [comp, owner],
      );
      if (
        expressionProperties[key].expressionValue !== expressionValue
        && (!isObjectLike(expressionValue) || JSON.stringify(expressionValue) !== JSON.stringify(expressionProperties[key].expressionValue))
      ) {
        expressionProperties[key].expressionValue = expressionValue;
        Dui.evalExpression(
          expressionProperties[key].expressionValueSetter,
          { comp },
          [expressionValue, comp, owner],
        );
      }
    }
  }

  /**
   * Executes `checkCompVisibilityChange` to handle check comp visibility change.
   * @zh 执行 `checkCompVisibilityChange`，用于检查组件Visibility变更。
   * @param comp - comp parameter (`ComponentBase`) / 组件参数（`ComponentBase`）
   * @param owner - owner parameter (`ComponentBase`) / 所属者参数（`ComponentBase`）
   */
  public checkCompVisibilityChange(comp: ComponentBase, owner: ComponentBase) {
    if (!comp || !comp.hideExpression) {
      return;
    }
    const hideExpressionResult: boolean = !!Dui.evalExpression(
      comp.hideExpression,
      { comp },
      [comp, owner],
    );
    if (hideExpressionResult !== comp.hidden) {
      comp.hidden = hideExpressionResult;
    }
  }
  /**
   * Executes `checkCompDisableChange` to handle check comp disable change.
   * @zh 执行 `checkCompDisableChange`，用于检查组件禁用变更。
   * @param comp - comp parameter (`ComponentBase`) / 组件参数（`ComponentBase`）
   * @param owner - owner parameter (`ComponentBase`) / 所属者参数（`ComponentBase`）
   */
  public checkCompDisableChange(comp: ComponentBase, owner: ComponentBase) {
    if (!comp || !comp.disableExpression) {
      return;
    }
    const disableExpressionResult: boolean = !!Dui.evalExpression(
      comp.disableExpression,
      { comp },
      [comp, owner],
    );
    if (disableExpressionResult !== comp.disable) {
      comp.disable = disableExpressionResult;
    }
  }
  
  /**
   * Executes `init` to handle init.
   * @zh 执行 `init`，用于初始化。
   * @param config - config parameter (`DuiConfig`) / 配置参数（`DuiConfig`）
   */
  init(config?: DuiConfig): void {
    config = config || {};
    this.initFieldExpression(config);
    Dui.apply(this, config);

    this.initComponent();
    if (this.plugins) {
      if (Array.isArray(this.plugins)) {
        for (let i = 0, len = this.plugins.length; i < len; i++) {
          this.plugins[i] = this.initPlugin(this.plugins[i]);
        }
      } else {
        this.plugins = this.initPlugin(this.plugins);
      }
    }
    if (this.inited) {
      if (config.listeners && config.listeners['onInit'] != undefined) {
        this.trigger('onInit', this);
        this.trigger('afterViewInit', this);
        this.trigger('afterContentInit', this);
      }
    }
    this.trigger('change', this);
  }

  /**
   * Executes `initComponent` to handle init component.
   * @zh 执行 `initComponent`，用于初始化组件。
   */
  initComponent() {
    if (this.listeners) {
      for (const e in this.listeners) {
        const oe = this.listeners[e];
        this.addEventListener(e, typeof oe === 'function' ? oe : oe.fn);
      }
      delete this.listeners;
    }
  }
  /**
   * Executes `initPlugin` to handle init plugin.
   * @zh 执行 `initPlugin`，用于初始化Plugin。
   * @param p - p parameter (`DuiPluginConfig | DuiPlugin`) / p参数（`DuiPluginConfig | DuiPlugin`）
   */
  initPlugin(p: DuiPluginConfig | DuiPlugin): DuiPlugin {
    let plugin: DuiPlugin;
    if (typeof p === 'string') {
      plugin = Dui.createPlugin({ ptype: p });
    } else if (p.ptype && !isFunction(p.init)) {
      plugin = Dui.createPlugin(p);
    } else {
      plugin = p as DuiPlugin;
    }
    plugin.init(this);
    return plugin;
  }
  /**
   * Executes `on` to handle on.
   * @zh 执行 `on`，用于当。
   * @param eventName - event name parameter (`string`) / 事件名称参数（`string`）
   * @param handler - handler parameter (`Function`) / 处理器参数（`Function`）
   */
  public override on(eventName: string, handler: Function): void {
    this.addEventListener(eventName, handler);
  }

  /**
   * Executes `off` to handle off.
   * @zh 执行 `off`，用于取消监听。
   * @param eventName - event name parameter (`string`) / 事件名称参数（`string`）
   * @param handler - handler parameter (`Function`) / 处理器参数（`Function`）
   */
  public override off(eventName: string, handler: Function): void {
    this.removeEventListener(eventName, handler);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  /**
   * Executes `onAdded` to handle on added.
   * @zh 执行 `onAdded`，用于当已添加。
   * @param container - container parameter (`ComponentBase`) / 容器参数（`ComponentBase`）
   * @param pos - pos parameter (`number`) / 位置参数（`number`）
   */
  onAdded(container: ComponentBase, pos?: number): void {
    this.ownerCt = container;
  }

  /**
   * Executes `onRemoved` to handle on removed.
   * @zh 执行 `onRemoved`，用于当已移除。
   */
  onRemoved() {
    delete this.ownerCt;
  }

  /**
   * Executes `getXType` to handle get x type.
   * @zh 执行 `getXType`，用于获取X坐标类型。
   * @returns Result of type `string` / 类型为 `string` 的返回值
   */
  getXType(): string {
    return this.xtype;
  }

  /**
   * Executes `isXType` to handle is x type.
   * @zh 执行 `isXType`，用于是否为X坐标类型。
   * @param comp - comp parameter (`string | Function | { xtype?: string; }`) / 组件参数（`string | Function | { xtype?: string; }`）
   * @param shallow - shallow parameter (`boolean`) / shallow参数（`boolean`）
   */
  isXType(comp: string | Function | { xtype?: string }, shallow: boolean): boolean {
    type XTyped = { xtype?: string };
    const xtype: string | undefined = typeof comp === 'string'
      ? comp
      : isFunction(comp)
        ? (comp as XTyped).xtype
        : isObjectLike(comp)
          ? ((comp as XTyped).xtype || (comp.constructor as XTyped | undefined)?.xtype)
          : undefined;
    return !shallow ? ('/' + this.getXTypes() + '/').indexOf('/' + xtype + '/') !== -1 : this.xtype === xtype;
  }

  /**
   * Executes `getXTypes` to handle get x types.
   * @zh 执行 `getXTypes`，用于获取X坐标类型列表。
   */
  getXTypes(): string {
    const tc = this.constructor as Function & { xtypes?: string; xtype?: string; superclass?: ComponentBase; xtypeChain?: string[] };
    if (!tc.xtypes) {
      const c = [];
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      let sc: { constructor: Function & { xtype?: string; superclass?: ComponentBase } } = this;
      while (sc && sc.constructor.xtype) {
        c.unshift(sc.constructor.xtype);
        sc = sc.constructor.superclass;
      }
      tc.xtypeChain = c;
      tc.xtypes = c.join('/');
    }
    return tc.xtypes;
  }

  /**
   * Executes `findParentBy` to handle find parent by.
   * @zh 执行 `findParentBy`，用于查找父级按。
   * @param fn - fn parameter (`Function`) / 函数参数（`Function`）
   */
  findParentBy(fn: Function): ComponentBase | null {
    let p: ComponentBase;
    for (p = this.ownerCt; (p != null) && !fn(p, this); p = p.ownerCt) { }
    return p || null;
  }

  /**
   * Executes `findParentByType` to handle find parent by type.
   * @zh 执行 `findParentByType`，用于查找父级按类型。
   * @param xtype - xtype parameter (`string | Object | ComponentBase`) / 扩展类型参数（`string | Object | ComponentBase`）
   * @param shallow - shallow parameter (`boolean`) / shallow参数（`boolean`）
   */
  findParentByType(xtype: string | ComponentBase | Object, shallow: boolean): ComponentBase | null {
    return this.findParentBy(
      function (c: ComponentBase) {
        return c.isXType(xtype, shallow);
      });
  }

  /**
   * Executes `nextSibling` to handle next sibling.
   * @zh 执行 `nextSibling`，用于下一个兄弟节点。
   * @returns Result of type `ComponentBase` / 类型为 `ComponentBase` 的返回值
   */
  nextSibling(): ComponentBase | null {
    if (this.ownerCt) {
      const index: number = this.ownerCt.items.indexOf(this);
      if (index !== -1 && index + 1 < this.ownerCt.items.getCount()) {
        return this.ownerCt.items.itemAt(index + 1);
      }
    }
    return null;
  }

  /**
   * Executes `previousSibling` to handle previous sibling.
   * @zh 执行 `previousSibling`，用于上一个兄弟节点。
   * @returns Result of type `ComponentBase` / 类型为 `ComponentBase` 的返回值
   */
  previousSibling(): ComponentBase | null {
    if (this.ownerCt) {
      const index: number = this.ownerCt.items.indexOf(this);
      if (index > 0) {
        return this.ownerCt.items.itemAt(index - 1);
      }
    }
    return null;
  }

  /*
   * 这里原来有 `getModuleName()` 与 `onPropertyChanged()` 两个方法。
   * 它们是 LEGACY `Base` 的抽象成员,必须实现才能编译 —— 而<b>没有任何调用方</b>
   * (逐个 grep 过:命中的全是各处的实现体,没有一处调用)。
   * `Base` 换成自研版后不再声明这两个抽象成员,实现体也就没有存在理由,
   * 一并删除。见 duix 的 `lib/PEEL-CLEANUP-PLAN.md` §P6。
   *
   * 下游(idos、file-manager 等)还留着几个同名实现体 —— 它们现在是普通的
   * 未调用方法,不影响编译,清理时机随各自仓库。
   */
  // private
  /**
   * Executes `beforeDestroy` to handle before destroy.
   * @zh 执行 `beforeDestroy`，用于之前销毁。
   */
  public beforeDestroy() { }

  // private
  /**
   * Executes `onDestroy` to handle on destroy.
   * @zh 执行 `onDestroy`，用于当销毁。
   */
  public onDestroy() { }
}
