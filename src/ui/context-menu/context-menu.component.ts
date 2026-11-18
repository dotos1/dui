/**
 * @fileoverview Module `src/ui/context-menu/context-menu.component.ts` providing context menu component definitions and implementation.
 * @zh 模块文件 `src/ui/context-menu/context-menu.component.ts`，提供上下文菜单组件相关的定义与实现。
 */


import {
  Component,
  ViewEncapsulation,
  Injector,
  OnDestroy,
  HostListener,
  ViewChild,
  AfterViewInit,
  Inject,
  Input,
  ChangeDetectorRef,
  ViewChildren,
  QueryList,
  DoCheck,
  OnInit, ChangeDetectionStrategy
} from '@angular/core';
import { Directionality } from '@angular/cdk/bidi';
import { MatMenuTrigger } from '@angular/material/menu';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { MenuBase,MenuDirective } from '@dotos1/dui/ui/menu';

import { ContextMenuOverlayRef } from './context-menu-overlay';
import { CONTEXT_MENU_DIRECTION } from './direction.token';

/**
 * Angular component `ContextMenuComponent` (selector: 'dui-context-menu') providing context menu component presentation and interaction in `src/ui/context-menu`.
 * @zh Angular 组件 `ContextMenuComponent`（selector: 'dui-context-menu'），提供上下文菜单组件的视图渲染与交互逻辑（位于 `src/ui/context-menu`）。
 */
@Component({
  selector: 'dui-context-menu',
  templateUrl: './context-menu.component.html',
  styleUrls: ['./context-menu.component.scss'],
  host: {
    class: 'dui-context-menu-holder',
    hostID: 'dui-context-menu' + Math.random().toString(36).substring(2, 15)
  },
  encapsulation: ViewEncapsulation.None,
  standalone: false,
  changeDetection: ChangeDetectionStrategy.Default,

})
export class ContextMenuComponent extends MenuBase implements OnInit,OnDestroy,DoCheck, AfterViewInit {

  /**
   * Template/content query reference `extendMenus` (`QueryList<MenuDirective>`) targeting extend menus.
   * @zh 模板/内容视图查询引用 `extendMenus`（`@ViewChildren`），指向extend菜单。
   */
  @ViewChildren(MenuDirective) extendMenus: QueryList<MenuDirective>;

  /**
   * Property `onDestroy$` (`Subject<boolean>`) storing on destroy (default: `new Subject<boolean>()`).
   * @zh 属性 `onDestroy$`（类型：`Subject<boolean>`），用于存储或配置当销毁（默认值：`new Subject<boolean>()`）。
   */
  private onDestroy$: Subject<boolean> = new Subject<boolean>();

  /**
   * Input property `popup` (`boolean`) configuring popup (default: `true`).
   * @zh 输入属性 `popup`（类型：`boolean`），用于配置弹窗（默认值：`true`）。
   */
  @Input()
  public popup=true;

  /**
   * Input setter `children` updating children.
   * @zh 输入属性 `children` 的设置器，用于更新子级列表。
   * @param c - New children value (`MenuModel[]`) / 新的子级列表值（`MenuModel[]`）
   */
  @Input() override set children(c){
    this._children=c;
  }
   /**
    * Gets the current children (`children: any`).
    * @zh 获取当前子级列表（`children: any`）。
    */
   override get children(){
    return this._children;
  }

  /**
   * Template/content query reference `menuTrigger` (`MatMenuTrigger`) targeting menu trigger.
   * @zh 模板/内容视图查询引用 `menuTrigger`（`@ViewChild`），指向菜单触发。
   */
  @ViewChild(MatMenuTrigger,{static:false})
  menuTrigger: MatMenuTrigger;

  /**
   * Property `source` (`any`) storing source.
   * @zh 属性 `source`（类型：`any`），用于存储或配置源。
   */
  public source;

  /**
   * Host event listener `handleKeydownEscape` handling `document:keydown.Escape` events for handle keydown escape.
   * @zh 宿主事件监听方法 `handleKeydownEscape`，响应 `document:keydown.Escape` 事件以处理连接手柄按键按下Escape。
   * @param event - event parameter (`KeyboardEvent`) / 事件参数（`KeyboardEvent`）
   */
  @HostListener('document:keydown.Escape', ['$event'])
  handleKeydownEscape(event: KeyboardEvent) {
    if (event) {
      if (this.contextMenuOverlayRef) {
        this.contextMenuOverlayRef.close();
      }
    }
  }

  /**
   * Property `comps` (`any[]`) storing comps (default: `[]`).
   * @zh 属性 `comps`（类型：`any[]`），用于存储或配置组件（默认值：`[]`）。
   */
  protected comps = [];

  /**
   * Creates an instance of `ContextMenuComponent` and initializes its dependencies and internal state.
   * @zh 创建 `ContextMenuComponent` 实例，并初始化其依赖项与内部状态。
   * @param router - Injected or initial router (`Router`) / 注入或传入的router（`Router`）
   * @param resolver - Injected or initial resolver (`ComponentFactoryResolver`) / 注入或传入的解析器（`ComponentFactoryResolver`）
   * @param injector - Injected or initial injector (`Injector`) / 注入或传入的注入器（`Injector`）
   * @param changeDetectorRef - Injected or initial change detector ref (`ChangeDetectorRef`) / 注入或传入的变更检测器引用（`ChangeDetectorRef`）
   * @param contextMenuOverlayRef - Injected or initial context menu overlay ref (`ContextMenuOverlayRef`) / 注入或传入的上下文菜单浮层引用（`ContextMenuOverlayRef`）
   * @param direction - Injected or initial direction (`Directionality`) / 注入或传入的方向（`Directionality`）
   */
  constructor(
    protected override router: Router,
    protected override injector: Injector,
    public override changeDetectorRef: ChangeDetectorRef,
    private contextMenuOverlayRef: ContextMenuOverlayRef,
    @Inject(CONTEXT_MENU_DIRECTION) public direction: Directionality
  ) {
    super(router, changeDetectorRef, injector);
  }

  /**
   * Angular lifecycle hook invoked during every change-detection run for custom change detection.
   * @zh Angular 生命周期钩子：在每次变更检测周期中调用，用于执行自定义变更检测。
   */
  override ngDoCheck() {
    super.ngDoCheck();
    this.changeDetectorRef.markForCheck();
  }

  /**
   * Angular lifecycle hook invoked once after component or directive inputs are initialized.
   * @zh Angular 生命周期钩子：在组件或指令的输入属性初始化完成后调用一次。
   */
  ngOnInit() {

    this.children.forEach(item => {
      if (item.xtype && item.xtype == 'menu' && !item.handler) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        item.handler = (item) => { };
      }
      this.initFieldExpression(item);
    });
  }

  /**
   * Executes `onClickOutsideEvent` to handle on click outside event.
   * @zh 执行 `onClickOutsideEvent`，用于当点击外部事件。
   */
  onClickOutsideEvent() {
    if (this.contextMenuOverlayRef) {
      this.contextMenuOverlayRef.close();
    }
  }

  /**
   * Executes `runAction` to handle run action.
   * @zh 执行 `runAction`，用于运行动作。
   * @param menu - menu parameter (`any`) / 菜单参数（`any`）
   * @param event - event parameter (`any`) / 事件参数（`any`）
   */
  runAction(menu,event) {
    if (menu.handler) {
      menu.handler(menu,event);
    }
  }

  /**
   * Angular lifecycle hook invoked just before the component, directive, or service is destroyed to release subscriptions and resources.
   * @zh Angular 生命周期钩子：在组件、指令或服务销毁前调用，用于释放订阅与清理资源。
   */
  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
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
    if (this.menuTrigger) {
      this.menuTrigger.menuClosed
        .pipe(takeUntil(this.onDestroy$))
        .subscribe(() => {
          if (this.contextMenuOverlayRef) {
            this.contextMenuOverlayRef.close();
          }
        });
    }
    if(this.popup){
      this.menuTrigger.openMenu();
      this.changeDetectorRef.detectChanges();
    }
  }

  /**
   * Executes `trackById` to handle track by id.
   * @zh 执行 `trackById`，用于跟踪按唯一标识。
   * @param _ - _ parameter (`number`) / _参数（`number`）
   * @param obj - obj parameter (`{ id: string; }`) / 对象参数（`{ id: string; }`）
   */
  trackById(_: number, obj: { id: string }) {
    return obj.id;
  }

  /**
   * Executes `contextMenu` to handle context menu.
   * @zh 执行 `contextMenu`，用于上下文菜单。
   */
  contextMenu(){
    return false;
  }
}
