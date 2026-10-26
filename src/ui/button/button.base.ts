/**
 * @fileoverview Module `src/ui/button/button.base.ts` providing button base definitions and implementation.
 * @zh 模块文件 `src/ui/button/button.base.ts`，提供按钮基础相关的定义与实现。
 */

import {
    ChangeDetectorRef,
    ComponentFactoryResolver,
    ElementRef,
    EventEmitter,
    Injector,
    QueryList,
    Renderer2,
    ViewContainerRef
} from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatTooltip } from '@angular/material/tooltip';
import {isString}  from 'lodash-es';

import { ComponentBase } from '@dotos/dui/core';

/**
 * Class `ButtonBase` encapsulating button base data structures and logic in `src/ui/button`.
 * @zh 类 `ButtonBase`，封装 `src/ui/button` 中的按钮基础数据结构与处理逻辑。
 */
export class ButtonBase extends ComponentBase {

   /**
    * Property `matTooltip` (`MatTooltip`) storing mat tooltip.
    * @zh 属性 `matTooltip`（类型：`MatTooltip`），用于存储或配置Material悬浮提示。
    */
   matTooltip: MatTooltip;

   /**
    * Property `config` (`any`) storing config (default: `{}`).
    * @zh 属性 `config`（类型：`any`），用于存储或配置配置（默认值：`{}`）。
    */
   config = {};

   /**
    * Property `data` (`any`) storing data.
    * @zh 属性 `data`（类型：`any`），用于存储或配置数据。
    */
   data;

   /**
    * Property `ownerCt` (`any`) storing owner ct.
    * @zh 属性 `ownerCt`（类型：`any`），用于存储或配置所属者Ct。
    */
   override ownerCt;

   /**
    * Property `click` (`EventEmitter`) storing click (default: `new EventEmitter<any>()`).
    * @zh 属性 `click`（类型：`EventEmitter`），用于存储或配置点击（默认值：`new EventEmitter<any>()`）。
    */
   click = new EventEmitter();

  /**
   * Property `type` (`string`) storing type (default: `'mat-button'`).
   * @zh 属性 `type`（类型：`string`），用于存储或配置类型（默认值：`'mat-button'`）。
   */
  public type = 'mat-button';

  /**
   * Gets the current items (`items: any`).
   * @zh 获取当前条目列表（`items: any`）。
   */
  public get items(){
    return this._items;
  }

  /**
   * Sets the items (`items`).
   * @zh 设置条目列表（`items`）。
   * @param items - New items value (`any`) / 新的条目列表值（`any`）
   */
  public set items(items){
    this.processItems(items);
     this._items=items;
     this.changeDetectorRef.detectChanges();
  }

  /**
   * Property `_items` (`Array<any>`) storing items (default: `[]`).
   * @zh 属性 `_items`（类型：`Array<any>`），用于存储或配置条目列表（默认值：`[]`）。
   */
  public _items = [];

  /**
   * Property `flex` (`any`) storing flex.
   * @zh 属性 `flex`（类型：`any`），用于存储或配置flex。
   */
  public flex;

  /**
   * Property `title` (`any`) storing title.
   * @zh 属性 `title`（类型：`any`），用于存储或配置标题。
   */
  public title;

  /**
   * Property `text` (`any`) storing text.
   * @zh 属性 `text`（类型：`any`），用于存储或配置文本。
   */
  public text;

  /**
   * Property `value` (`any`) storing value.
   * @zh 属性 `value`（类型：`any`），用于存储或配置值。
   */
  public value;

  /**
   * Property `default` (`any`) storing default.
   * @zh 属性 `default`（类型：`any`），用于存储或配置默认。
   */
  public default;

  /**
   * Property `disableRipple` (`boolean`) storing disable ripple (default: `false`).
   * @zh 属性 `disableRipple`（类型：`boolean`），用于存储或配置禁用Ripple（默认值：`false`）。
   */
  public disableRipple: boolean = false;

  /**
   * Property `color` (`string`) storing color (default: `''`).
   * @zh 属性 `color`（类型：`string`），用于存储或配置颜色（默认值：`''`）。
   */
  public color: string = '';

  /**
   * Property `toolTip` (`any`) storing tool tip.
   * @zh 属性 `toolTip`（类型：`any`），用于存储或配置tool提示。
   */
  public toolTip;

  /**
   * Property `icon` (`any`) storing icon.
   * @zh 属性 `icon`（类型：`any`），用于存储或配置图标。
   */
  public icon;

  /**
   * Property `iconType` (`string`) storing icon type (default: `"FONT"`).
   * @zh 属性 `iconType`（类型：`string`），用于存储或配置图标类型（默认值：`"FONT"`）。
   */
  public iconType = "FONT";

  /**
   * Property `svgIcon` (`string`) storing svg icon (default: `""`).
   * @zh 属性 `svgIcon`（类型：`string`），用于存储或配置SVG矢量图图标（默认值：`""`）。
   */
  public svgIcon = "";

  /**
   * Property `handler` (`any`) storing handler.
   * @zh 属性 `handler`（类型：`any`），用于存储或配置处理器。
   */
  public handler;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  /**
   * Property `change` (`any`) storing change (default: `(value)=>{}`).
   * @zh 属性 `change`（类型：`any`），用于存储或配置变更（默认值：`(value)=>{}`）。
   */
  public change=(value)=>{};

  /**
   * Property `tabIndex` (`number`) storing tab index (default: `0`).
   * @zh 属性 `tabIndex`（类型：`number`），用于存储或配置选项卡索引（默认值：`0`）。
   */
  public tabIndex: number = 0;

  /**
   * Property `menu` (`any`) storing menu.
   * @zh 属性 `menu`（类型：`any`），用于存储或配置菜单。
   */
  public menu;

  /**
   * Property `style` (`any`) storing style.
   * @zh 属性 `style`（类型：`any`），用于存储或配置样式。
   */
  public override style;

  /**
   * Property `checked` (`boolean`) storing checked (default: `false`).
   * @zh 属性 `checked`（类型：`boolean`），用于存储或配置已勾选（默认值：`false`）。
   */
  public checked:boolean=false;

  /**
   * Property `dropdown` (`boolean`) storing dropdown (default: `false`).
   * @zh 属性 `dropdown`（类型：`boolean`），用于存储或配置下拉框（默认值：`false`）。
   */
  public dropdown:boolean=false;

  /**
   * Property `iconPosition` (`string`) storing icon position (default: `'before'`).
   * @zh 属性 `iconPosition`（类型：`string`），用于存储或配置图标位置（默认值：`'before'`）。
   */
  public iconPosition = 'before';

   /**
    * Property `_container` (`ViewContainerRef`) storing container.
    * @zh 属性 `_container`（类型：`ViewContainerRef`），用于存储或配置容器。
    */
   public _container: ViewContainerRef;

  /**
   * Property `triggers` (`QueryList<MatMenuTrigger>`) storing triggers.
   * @zh 属性 `triggers`（类型：`QueryList<MatMenuTrigger>`），用于存储或配置触发。
   */
  triggers: QueryList<MatMenuTrigger>;

  /**
   * Creates an instance of `ButtonBase` and initializes its dependencies and internal state.
   * @zh 创建 `ButtonBase` 实例，并初始化其依赖项与内部状态。
   * @param _element - Injected or initial element (`ElementRef`) / 注入或传入的元素（`ElementRef`）
   * @param renderer - Injected or initial renderer (`Renderer2`) / 注入或传入的渲染器（`Renderer2`）
   * @param changeDetectorRef - Injected or initial change detector ref (`ChangeDetectorRef`) / 注入或传入的变更检测器引用（`ChangeDetectorRef`）
   * @param resolver - Injected or initial resolver (`ComponentFactoryResolver`) / 注入或传入的解析器（`ComponentFactoryResolver`）
   * @param injector - Injected or initial injector (`Injector`) / 注入或传入的注入器（`Injector`）
   */
  constructor(
    public _element: ElementRef,
    public renderer: Renderer2,
    public changeDetectorRef: ChangeDetectorRef,
    public resolver: ComponentFactoryResolver,
    public injector: Injector,) {
    super(changeDetectorRef);
  }

  /**
   * Executes `getEl` to handle get el.
   * @zh 执行 `getEl`，用于获取DOM元素。
   */
  getEl() {
    return this._element.nativeElement;
  }

  /**
   * Executes `init` to handle init.
   * @zh 执行 `init`，用于初始化。
   * @param config - config parameter (`any`) / 配置参数（`any`）
   */
  override init(config) {
    super.init(config);
    this.config=config;
    if (config && config.children) {
      this.items = config.children;
    }
    if (config && config.iconPosition) {
      this.iconPosition = config.iconPosition;
    }
    this.default=this.value;
    this.processItems(this.items);
     this.changeDetectorRef.detectChanges();
     this.checkExpressionChange();
  }
  /**
   * Executes `processItems` to handle process items.
   * @zh 执行 `processItems`，用于处理条目列表。
   * @param items - items parameter (`any`) / 条目列表参数（`any`）
   */
  processItems(items){
    for (let i = 0; i < items.length; i++) {
      if (isString(items[i]) && items[i] === '-') {
        items[i] = { type: 'divider' };
      }
      if (!items[i].xtype) {
        items[i].xtype = 'menuitem';
      }
      if(this.dropdown){
        if (items[i].value==this.value&&items[i].text!=undefined) {
          this.title=this.text=items[i].text?items[i].text:items[i].title;
       }
       if (items[i].value==this.value&&items[i].icon!=undefined) {
           this.icon=items[i].icon;
       }
       items[i].parentItem=this;
      }
    }
  }
  /**
   * Executes `openMenu` to handle open menu.
   * @zh 执行 `openMenu`，用于打开菜单。
   * @param trigger - trigger parameter (`MatMenuTrigger`) / 触发参数（`MatMenuTrigger`）
   * @param level - level parameter (`number`) / 层级参数（`number`）
   */
  openMenu(trigger: MatMenuTrigger, level: number) {
    this.triggers
      .filter((x) => x['_element'].nativeElement.dataset.level >= level && x !== trigger)
      .forEach(x => {
        x.closeMenu();
      });
    trigger.triggersSubmenu();
  }

  /**
   * Executes `onValueChange` to handle on value change.
   * @zh 执行 `onValueChange`，用于当值变更。
   * @param value - value parameter (`any`) / 值参数（`any`）
   * @param e - e parameter (`any`) / e参数（`any`）
   */
  public onValueChange(value,e?){
    this.setValue(value);
    setTimeout(() => {
      if (this.change) {
        this.change(value);
      }
      this.click.emit(e);
    }, 50);
  }
  /**
   * Executes `closeAllMenu` to handle close all menu.
   * @zh 执行 `closeAllMenu`，用于关闭全部菜单。
   */
  closeAllMenu() {
    this.triggers.forEach(x => {
      x.closeMenu();
    });
  }

  /**
   * Executes `closeSubMenu` to handle close sub menu.
   * @zh 执行 `closeSubMenu`，用于关闭子菜单。
   * @param level - level parameter (`number`) / 层级参数（`number`）
   */
  closeSubMenu(level: number) {
    this.triggers
      .filter((x) => x['_element'].nativeElement.dataset.level > level)
      .forEach(x => {
        x.closeMenu();
      });
  }

  /**
   * Executes `hasIcon` to handle has icon.
   * @zh 执行 `hasIcon`，用于是否包含图标。
   */
  public hasIcon() {
    return this.icon != undefined;
  }

  // private
  /**
   * Executes `onDestroy` to handle on destroy.
   * @zh 执行 `onDestroy`，用于当销毁。
   */
  override onDestroy() {
    super.onDestroy();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  /**
   * Executes `setHandler` to handle set handler.
   * @zh 执行 `setHandler`，用于集合处理器。
   * @param handler - handler parameter (`Function`) / 处理器参数（`Function`）
   * @param scope - scope parameter (`Object`) / scope参数（`Object`）
   */
  setHandler(handler: Function, scope: Object): void {
    this.handler = handler;
  }

  /**
   * Executes `setIcon` to handle set icon.
   * @zh 执行 `setIcon`，用于集合图标。
   * @param icon - icon parameter (`string`) / 图标参数（`string`）
   */
  setIcon(icon: string): void {
    this.icon = icon;
  }
  /**
   * Executes `getValue` to handle get value.
   * @zh 执行 `getValue`，用于获取值。
   * @returns Result of type `any` / 类型为 `any` 的返回值
   */
  getValue() {
    return this.value;
  }
  /**
   * Executes `setValue` to handle set value.
   * @zh 执行 `setValue`，用于集合值。
   * @param v - v parameter (`any`) / v参数（`any`）
   */
  setValue(v): void {
    if(this.dropdown){
      if(v==null||v==undefined){
          for (let i = 0; i < this.items.length; i++) {
            if (this.items[i].value==this.default) {
              this.title=this.text=this.items[i].text?this.items[i].text:this.items[i].title;
              this.value=this.items[i].value;
              this.icon=this.items[i].icon;
          }
        }
      }else if(isString(v)){
        this.value=v;
        let  inItem=false;
        for (let i = 0; i < this.items.length; i++) {
            if (this.items[i].value==v) {
              this.title=this.text=this.items[i].text?this.items[i].text:this.items[i].title;
              this.icon=this.items[i].icon;
              inItem=true;
           }
        }
        if(!inItem)   this.title=this.text=   this.value;

      }else{
        if(v.text){
          this.title=this.text=v.text?v.text:v.title;
        }
        if(v.value){
          this.value=v.value;
        }
        if(v.icon){
          this.icon=v.icon;
        }
      }
      this.changeDetectorRef.detectChanges();
    }
  }
  /**
   * Executes `onClick` to handle on click.
   * @zh 执行 `onClick`，用于当点击。
   * @param e - e parameter (`any`) / e参数（`any`）
   */
  onClick(e) {
    if (e) {
      e.preventDefault();
      if (this.matTooltip&&this.matTooltip.message!='') {
        e.stopPropagation();
        e.stopImmediatePropagation();
        this.matTooltip.hide();
      }
    }
    if (!this.disabled) {
      setTimeout(() => {
        if (this.handler) {
          this.handler.call(this, this.data || this, e);
        }
        this.click.emit(e);
      }, 50);
    }
  }
  // private
  /**
   * Executes `onDisable` to handle on disable.
   * @zh 执行 `onDisable`，用于当禁用。
   */
  onDisable() {
    this.onDisableChange(true);
  }

  // private
  /**
   * Executes `onEnable` to handle on enable.
   * @zh 执行 `onEnable`，用于当启用。
   */
  onEnable() {
    this.onDisableChange(false);
  }

  /**
   * Executes `onDisableChange` to handle on disable change.
   * @zh 执行 `onDisableChange`，用于当禁用变更。
   * @param disabled - disabled parameter (`any`) / 已禁用参数（`any`）
   */
  onDisableChange(disabled) {
    this.disabled = disabled;
  }
}
