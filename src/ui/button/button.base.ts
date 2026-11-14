/**
 * @fileoverview Module `src/ui/button/button.base.ts` providing button base definitions and implementation.
 * @zh 模块文件 `src/ui/button/button.base.ts`，提供按钮基础相关的定义与实现。
 */

import {
    ChangeDetectorRef,
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

import { ComponentBase, DuiConfig, DuiStyle } from '@dotos/dui/core';

/** 按钮下拉 / 子菜单项（'-' 表示分隔线） */
export interface DuiButtonMenuItem extends DuiConfig {
  /** 下拉按钮（dropdown）选项值或复选（checkbox）菜单项状态 */
  value?: string | number | boolean;
  /** 分隔线、复选框等特殊项 */
  type?: string;
  /** 嵌套子菜单项 */
  children?: Array<DuiButtonMenuItem | string>;
  /** 下拉模式下指回所属按钮 */
  parentItem?: ComponentBase;
}

/** 按钮配置 */
export interface DuiButtonConfig extends DuiConfig {
  /** 放在哪里：工具栏（缺省）或菜单里 */
  parentType?: 'toolbar' | 'menu' | string;
  color?: string;
  disableRipple?: boolean;
  iconPosition?: 'before' | 'after' | string;
  /** 菜单里显示的快捷键提示 */
  shortcut?: string;
  children?: Array<DuiButtonMenuItem | string>;
  dropdown?: boolean;
}

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
    * Property `config` (`DuiButtonConfig`) storing config (default: `{}`).
    * @zh 属性 `config`（类型：`DuiButtonConfig`），用于存储或配置配置（默认值：`{}`）。
    */
   config: DuiButtonConfig = {};

   /**
    * Property `data` (`unknown`) storing data.
    * @zh 属性 `data`（类型：`unknown`），用于存储或配置数据。
    */
   /** 点击时传给 handler 的数据（缺省传按钮自身） */
   data: unknown;

   /**
    * Property `ownerCt` (`any`) storing owner ct.
    * @zh 属性 `ownerCt`（类型：`any`），用于存储或配置所属者Ct。
    */
   declare ownerCt;

   /**
    * Property `click` (`EventEmitter<any>`) storing click (default: `new EventEmitter<any>()`).
    * @zh 属性 `click`（类型：`EventEmitter<any>`），用于存储或配置点击（默认值：`new EventEmitter<any>()`）。
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
  public get items(): Array<DuiButtonMenuItem | string> {
    return this._items;
  }

  /**
   * Sets the items (`items`).
   * @zh 设置条目列表（`items`）。
   * @param items - New items value (`(string | DuiButtonMenuItem)[]`) / 新的条目列表值（`(string | DuiButtonMenuItem)[]`）
   */
  public set items(items: Array<DuiButtonMenuItem | string>) {
    this.processItems(items);
     this._items=items;
     this.changeDetectorRef.detectChanges();
  }

  /**
   * Property `_items` (`(string | DuiButtonMenuItem)[]`) storing items (default: `[]`).
   * @zh 属性 `_items`（类型：`(string | DuiButtonMenuItem)[]`），用于存储或配置条目列表（默认值：`[]`）。
   */
  public _items: Array<DuiButtonMenuItem | string> = [];

  /**
   * Property `flex` (`string | number`) storing flex.
   * @zh 属性 `flex`（类型：`string | number`），用于存储或配置flex。
   */
  public flex: number | string;

  /**
   * Property `title` (`string`) storing title.
   * @zh 属性 `title`（类型：`string`），用于存储或配置标题。
   */
  public title: string;

  /**
   * Property `text` (`string`) storing text.
   * @zh 属性 `text`（类型：`string`），用于存储或配置文本。
   */
  public text: string;

  /**
   * Property `value` (`string`) storing value.
   * @zh 属性 `value`（类型：`string`），用于存储或配置值。
   */
  public value: string;

  /**
   * Property `default` (`string`) storing default.
   * @zh 属性 `default`（类型：`string`），用于存储或配置默认。
   */
  public default: string;

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
   * Property `toolTip` (`string`) storing tool tip.
   * @zh 属性 `toolTip`（类型：`string`），用于存储或配置tool提示。
   */
  public toolTip: string;

  /**
   * Property `icon` (`string`) storing icon.
   * @zh 属性 `icon`（类型：`string`），用于存储或配置图标。
   */
  public icon: string;

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
   * Property `handler` (`Function`) storing handler.
   * @zh 属性 `handler`（类型：`Function`），用于存储或配置处理器。
   */
  public handler: Function;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  /**
   * Property `change` (`(value: unknown) => void`) storing change (default: `(value)=>{}`).
   * @zh 属性 `change`（类型：`(value: unknown) => void`），用于存储或配置变更（默认值：`(value)=>{}`）。
   */
  public change = (value: unknown): void => {};

  /**
   * Property `tabIndex` (`number`) storing tab index (default: `0`).
   * @zh 属性 `tabIndex`（类型：`number`），用于存储或配置选项卡索引（默认值：`0`）。
   */
  public tabIndex: number = 0;

  /**
   * Property `menu` (`unknown`) storing menu.
   * @zh 属性 `menu`（类型：`unknown`），用于存储或配置菜单。
   */
  public menu: unknown;

  /**
   * Property `style` (`DuiStyle`) storing style.
   * @zh 属性 `style`（类型：`DuiStyle`），用于存储或配置样式。
   */
  declare public style: DuiStyle;

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
   * Legacy compatibility placeholder for component factory resolver.
   * @zh 属性 `resolver`（类型：`unknown`），历史兼容占位字段。
   */
  public resolver?: unknown;

  /**
   * Property `injector` (`Injector`) storing injector.
   * @zh 属性 `injector`（类型：`Injector`），用于存储或配置注入器。
   */
  public injector: Injector;

  constructor(_element: ElementRef, renderer: Renderer2, changeDetectorRef: ChangeDetectorRef, injector: Injector);
  constructor(_element: ElementRef, renderer: Renderer2, changeDetectorRef: ChangeDetectorRef, legacyResolver: unknown, injector: Injector);
  constructor(
    public _element: ElementRef,
    public renderer: Renderer2,
    public changeDetectorRef: ChangeDetectorRef,
    arg3: Injector | unknown,
    arg4?: Injector) {
    super(changeDetectorRef);
    if (arg4 !== undefined) {
      this.resolver = arg3;
      this.injector = arg4;
    } else {
      this.injector = arg3 as Injector;
    }
  }

  /**
   * Executes `getEl` to handle get el.
   * @zh 执行 `getEl`，用于获取DOM元素。
   */
  getEl(): HTMLElement {
    return this._element.nativeElement;
  }

  /**
   * Executes `init` to handle init.
   * @zh 执行 `init`，用于初始化。
   * @param config - config parameter (`DuiButtonConfig`) / 配置参数（`DuiButtonConfig`）
   */
  override init(config?: DuiButtonConfig): void {
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
   * @param items - items parameter (`(string | DuiButtonMenuItem)[]`) / 条目列表参数（`(string | DuiButtonMenuItem)[]`）
   */
  processItems(items: Array<DuiButtonMenuItem | string>): void {
    for (let i = 0; i < items.length; i++) {
      if (isString(items[i]) && items[i] === '-') {
        items[i] = { type: 'divider' };
      }
      const item = items[i];
      if (isString(item)) {
        continue;
      }
      if (!item.xtype) {
        item.xtype = 'menuitem';
      }
      if(this.dropdown){
        if (item.value==this.value&&item.text!=undefined) {
          this.title=this.text=item.text?item.text:item.title;
       }
       if (item.value==this.value&&item.icon!=undefined) {
           this.icon=item.icon;
       }
       item.parentItem=this;
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
      .filter((x) => Number(x['_element'].nativeElement.dataset['level']) >= level && x !== trigger)
      .forEach(x => {
        x.closeMenu();
      });
    trigger.triggersSubmenu();
  }

  /**
   * Executes `onValueChange` to handle on value change.
   * @zh 执行 `onValueChange`，用于当值变更。
   * @param value - value parameter (`unknown`) / 值参数（`unknown`）
   * @param e - e parameter (`unknown`) / e参数（`unknown`）
   */
  public onValueChange(value: unknown, e?: unknown): void {
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
      .filter((x) => Number(x['_element'].nativeElement.dataset['level']) > level)
      .forEach(x => {
        x.closeMenu();
      });
  }

  /**
   * Executes `hasIcon` to handle has icon.
   * @zh 执行 `hasIcon`，用于是否包含图标。
   */
  public hasIcon(): boolean {
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
   * @returns Result of type `string` / 类型为 `string` 的返回值
   */
  getValue(): string {
    return this.value;
  }
  /**
   * Executes `setValue` to handle set value.
   * @zh 执行 `setValue`，用于集合值。
   * @param v - v parameter (`any`) / v参数（`any`）
   */
  setValue(value: unknown): void {
    if(this.dropdown){
      // 下拉项（字符串项只有分隔线 '-'，没有 value）
      const items = this.items.filter((item): item is DuiButtonMenuItem => !isString(item));
      if(value==null||value==undefined){
          for (let i = 0; i < items.length; i++) {
            if (items[i].value==this.default) {
              this.title=this.text=items[i].text?items[i].text:items[i].title;
              this.value=String(items[i].value ?? '');
              this.icon=items[i].icon;
          }
        }
      }else if(isString(value)){
        this.value=value;
        let  inItem=false;
        for (let i = 0; i < items.length; i++) {
            if (items[i].value==value) {
              this.title=this.text=items[i].text?items[i].text:items[i].title;
              this.icon=items[i].icon;
              inItem=true;
           }
        }
        if(!inItem)   this.title=this.text=   this.value;

      }else{
        const v = value as DuiButtonMenuItem;
        if(v.text){
          this.title=this.text=v.text?v.text:v.title;
        }
        if(v.value){
          this.value=String(v.value);
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
   * @param e - e parameter (`Event`) / e参数（`Event`）
   */
  onClick(e?: Event): void {
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
   * @param disabled - disabled parameter (`boolean`) / 已禁用参数（`boolean`）
   */
  onDisableChange(disabled: boolean): void {
    this.disabled = disabled;
  }
}
