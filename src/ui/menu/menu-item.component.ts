/**
 * @fileoverview Module `src/ui/menu/menu-item.component.ts` providing menu item component definitions and implementation.
 * @zh 模块文件 `src/ui/menu/menu-item.component.ts`，提供菜单条目组件相关的定义与实现。
 */

import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ComponentFactoryResolver,
  DoCheck,
  Injector,
  Input,
  OnInit, QueryList,
  ViewChild,
  ViewChildren,
  ViewEncapsulation,
} from '@angular/core';
import { MatMenu } from '@angular/material/menu';
import { Router } from '@angular/router';
import { Dui } from '@dotos/dui/core';
import { MenuBase } from './menu-base';
import { MenuDirective } from './menu-item.directive';
import { MenuModel } from './menu-model';

/**
 * Angular component `MenuItemComponent` (selector: 'dui-menu-item') providing menu item component presentation and interaction in `src/ui/menu`.
 * @zh Angular 组件 `MenuItemComponent`（selector: 'dui-menu-item'），提供菜单条目组件的视图渲染与交互逻辑（位于 `src/ui/menu`）。
 */
@Component({
  selector: 'dui-menu-item',
  templateUrl: './menu-item.component.html',
  styleUrls: ['./menu-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
  encapsulation: ViewEncapsulation.None,
  host:{hostID: 'dui-menu-item' + Math.random().toString(36).substring(2, 15)},
})
export class MenuItemComponent extends MenuBase implements OnInit,DoCheck,AfterViewInit {

  /**
   * Template/content query reference `extendMenus` (`@ViewChildren`) targeting extend menus.
   * @zh 模板/内容视图查询引用 `extendMenus`（`@ViewChildren`），指向extend菜单。
   */
  @ViewChildren(MenuDirective) extendMenus: QueryList<MenuDirective>;

  /**
   * Input setter `children` updating children.
   * @zh 输入属性 `children` 的设置器，用于更新子级列表。
   * @param c - New children value (`any`) / 新的子级列表值（`any`）
   */
  @Input() override set children(c){
    this._children=c;
    this.processItem();
  }
   /**
    * Gets the current children (`children: any`).
    * @zh 获取当前子级列表（`children: any`）。
    */
   override get children(){
    return this._children;
  }

  /**
   * Input property `ownerCt` (`any`) configuring owner ct.
   * @zh 输入属性 `ownerCt`（类型：`any`），用于配置所属者Ct。
   */
  @Input() declare ownerCt;

  /**
   * Input property `value` (`any`) configuring value.
   * @zh 输入属性 `value`（类型：`any`），用于配置值。
   */
  @Input() value;

  /**
   * Template/content query reference `childMenu` (`@ViewChild`) targeting child menu.
   * @zh 模板/内容视图查询引用 `childMenu`（`@ViewChild`），指向子级菜单。
   */
  @ViewChild('childMenu', { static: true }) public childMenu: MatMenu;


  /**
   * Property `comps` (`any[]`) storing comps (default: `[]`).
   * @zh 属性 `comps`（类型：`any[]`），用于存储或配置组件（默认值：`[]`）。
   */
  protected comps = [];

  /**
   * Property `xPosition` (`string`) storing x position (default: `'after'`).
   * @zh 属性 `xPosition`（类型：`string`），用于存储或配置X坐标位置（默认值：`'after'`）。
   */
  public xPosition = 'after';

  /**
   * Property `yPosition` (`string`) storing y position (default: `'below'`).
   * @zh 属性 `yPosition`（类型：`string`），用于存储或配置Y坐标位置（默认值：`'below'`）。
   */
  public yPosition = 'below';

  /**
   * Property `menuClasses` (`string[]`) storing menu classes (default: `['menu-bar-item-menu']`).
   * @zh 属性 `menuClasses`（类型：`string[]`），用于存储或配置菜单类名集合（默认值：`['menu-bar-item-menu']`）。
   */
  menuClasses: string[] = ['menu-bar-item-menu'];

  /**
   * Property `_dense` (`boolean`) storing dense (default: `false`).
   * @zh 属性 `_dense`（类型：`boolean`），用于存储或配置dense（默认值：`false`）。
   */
  private _dense = false;

  /**
   * Gets the current dense (`dense: boolean`).
   * @zh 获取当前dense（`dense: boolean`）。
   */
  get dense(): boolean {
    return this._dense;
  }
  /**
   * Input setter `dense` updating dense.
   * @zh 输入属性 `dense` 的设置器，用于更新dense。
   * @param value - New dense value (`boolean`) / 新的dense值（`boolean`）
   */
  @Input()
  set dense(value: boolean) {
    this._dense = value;
    if (value) {
      if (!(this.menuClasses.indexOf('menu-bar-item-menu--dense') > -1)) {
        this.menuClasses.push('menu-bar-item-menu--dense');
      }
    } else {
      if (this.menuClasses.indexOf('menu-bar-item-menu--dense') > -1) {
        this.menuClasses = this.menuClasses.filter(e => e !== 'menu-bar-item-menu--dense');
      }
    }
  }

  /**
   * Gets the current only icon (`onlyIcon: boolean`).
   * @zh 获取当前only图标（`onlyIcon: boolean`）。
   */
  get onlyIcon(): boolean {
    return this._onlyIcon;
  }
  /**
   * Input setter `onlyIcon` updating only icon.
   * @zh 输入属性 `onlyIcon` 的设置器，用于更新only图标。
   * @param value - New only icon value (`boolean`) / 新的only图标值（`boolean`）
   */
  @Input()
  set onlyIcon(value: boolean) {
    this._onlyIcon = value;
    if (value) {
      if (!(this.menuClasses.indexOf('only-icon-menu') > -1)) {
        this.menuClasses.push(`only-icon-menu`);
      }
    } else {
      if (this.menuClasses.indexOf('only-icon-menu') > -1) {
        this.menuClasses = this.menuClasses.filter(e => e !== 'only-icon-menu');
      }
    }
  }
  /**
   * Property `_onlyIcon` (`boolean`) storing only icon (default: `false`).
   * @zh 属性 `_onlyIcon`（类型：`boolean`），用于存储或配置only图标（默认值：`false`）。
   */
  private _onlyIcon=false;

  /**
   * Gets the current menu class (`menuClass: string`).
   * @zh 获取当前菜单类名（`menuClass: string`）。
   */
  get menuClass(): string {
    return this.menuClasses.join(' ');
  }

  /**
   * Input property `showIcon` (`boolean`) configuring show icon (default: `true`).
   * @zh 输入属性 `showIcon`（类型：`boolean`），用于配置显示图标（默认值：`true`）。
   */
  @Input()
  public showIcon=true;

  /**
   * Input setter `panelClass` updating panel class.
   * @zh 输入属性 `panelClass` 的设置器，用于更新面板类名。
   * @param panelClass - New panel class value (`any`) / 新的面板类名值（`any`）
   */
  @Input()
  set panelClass(panelClass) {
    this.menuClasses.push(panelClass);
  }

  /**
   * Gets the current panel class (`panelClass: string`).
   * @zh 获取当前面板类名（`panelClass: string`）。
   */
  get panelClass(): string {
    return this.menuClass;
  }

  /**
   * Property `parentItem` (`any`) storing parent item.
   * @zh 属性 `parentItem`（类型：`any`），用于存储或配置父级条目。
   */
  public parentItem;

  /**
   * Creates an instance of `MenuItemComponent` and initializes its dependencies and internal state.
   * @zh 创建 `MenuItemComponent` 实例，并初始化其依赖项与内部状态。
   * @param _changeDetectorRef - Injected or initial change detector ref (`ChangeDetectorRef`) / 注入或传入的变更检测器引用（`ChangeDetectorRef`）
   * @param router - Injected or initial router (`Router`) / 注入或传入的router（`Router`）
   * @param resolver - Injected or initial resolver (`ComponentFactoryResolver`) / 注入或传入的解析器（`ComponentFactoryResolver`）
   * @param injector - Injected or initial injector (`Injector`) / 注入或传入的注入器（`Injector`）
   */
  constructor(
    protected _changeDetectorRef: ChangeDetectorRef,
    protected override router: Router,
    protected override resolver: ComponentFactoryResolver,
    protected override injector: Injector) {
    super(router,_changeDetectorRef, resolver, injector);
  }

  /**
   * Executes `init` to handle init.
   * @zh 执行 `init`，用于初始化。
   * @param config - config parameter (`any`) / 配置参数（`any`）
   */
  override init(config) {
    if (config && config.children) {
      this.children = config.children;
    }
    this._changeDetectorRef.detectChanges();
  }

  /**
   * Angular lifecycle hook invoked during every change-detection run for custom change detection.
   * @zh Angular 生命周期钩子：在每次变更检测周期中调用，用于执行自定义变更检测。
   */
  override ngDoCheck() {
    super.ngDoCheck();
    this.checkExpressionChange();
    this._changeDetectorRef.markForCheck();
  }
  /**
   * Angular lifecycle hook invoked once after component or directive inputs are initialized.
   * @zh Angular 生命周期钩子：在组件或指令的输入属性初始化完成后调用一次。
   */
  ngOnInit() {
    this.processItem();
  }
  /**
   * Executes `processItem` to handle process item.
   * @zh 执行 `processItem`，用于处理条目。
   */
  processItem(){
    if(this.children){
      this.children.forEach(item => {
        if (item.xtype && item.xtype == 'menuitem' && !item.handler) {
          item.handler = () => { };
        }
        if(item.title==undefined&&item.text!=undefined){
          item.title=item.text;
        }
        this.initFieldExpression(item);
      });
    }
  }
  /**
   * Angular lifecycle hook invoked once after the component's view and child views are initialized.
   * @zh Angular 生命周期钩子：在组件视图及其子视图初始化完成后调用一次。
   */
  ngAfterViewInit() {
    let k = 0;
    this.extendMenus.forEach((menuHost) => {
      const viewContainerRef = menuHost.viewContainerRef;
      viewContainerRef.clear();
      if (this.comps[k]?.reference?.hostView) {
        viewContainerRef.insert(this.comps[k].reference.hostView, 0);
      }
      k++;
    })
  }
  /**
   * Executes `click` to handle click.
   * @zh 执行 `click`，用于点击。
   * @param menu - menu parameter (`any`) / 菜单参数（`any`）
   * @param comp - comp parameter (`any`) / 组件参数（`any`）
   */
  public click(menu, comp?) {
    if(menu.parentItem&&menu.parentItem.dropdown){
      this.parentItem=menu.parentItem;
      const newValue = menu.value;
      this.parentItem.value = menu.value;
      if (this.parentItem.onValueChange) {
        this.parentItem.onValueChange(newValue,menu);
      }
    }
    if (menu.handler) {
      menu.handler(menu, comp,this);
    }
  }
  /**
   * Executes `onRadioMenuItemClick` to handle on radio menu item click.
   * @zh 执行 `onRadioMenuItemClick`，用于当单选框菜单条目点击。
   * @param parentItem - parent item parameter (`MenuModel`) / 父级条目参数（`MenuModel`）
   * @param item - item parameter (`MenuModel`) / 条目参数（`MenuModel`）
   * @param ev - ev parameter (`Event`) / 事件参数（`Event`）
   */
  onRadioMenuItemClick(parentItem: MenuModel, item: MenuModel, ev: Event) {
    this.parentItem=parentItem;
    if (item.onClick) {
      item.onClick(item, ev);
    }
    const newValue = item.value;
    this.parentItem.value = item.value;
    if (this.parentItem.onValueChange) {
      this.parentItem.onValueChange( newValue,item);
    }
  }

  /**
   * Executes `onCheckboxMenuItemClick` to handle on checkbox menu item click.
   * @zh 执行 `onCheckboxMenuItemClick`，用于当复选框菜单条目点击。
   * @param item - item parameter (`MenuModel`) / 条目参数（`MenuModel`）
   * @param ev - ev parameter (`Event`) / 事件参数（`Event`）
   */
  onCheckboxMenuItemClick(item: MenuModel, ev: Event) {
    if (item.onClick) {
      item.onClick(item, ev);
    }
    const newValue = !item.value;
    item.value = !item.value;
    if (item.onValueChange) {
      item.onValueChange( newValue,item);
    }
  }
}
