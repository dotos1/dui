/**
 * @fileoverview Module `src/ui/context-menu/context-menu-item.component.ts` providing context menu item component definitions and implementation.
 * @zh 模块文件 `src/ui/context-menu/context-menu-item.component.ts`，提供上下文菜单条目组件相关的定义与实现。
 */


import { Component, Input, ViewEncapsulation, Injector, ChangeDetectorRef, DoCheck, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { MenuModel,MenuBase } from '@dotos/dui/ui/menu';

/**
 * Angular component `ContextMenuItemComponent` (selector: 'dui-context-menu-item') providing context menu item component presentation and interaction in `src/ui/context-menu`.
 * @zh Angular 组件 `ContextMenuItemComponent`（selector: 'dui-context-menu-item'），提供上下文菜单条目组件的视图渲染与交互逻辑（位于 `src/ui/context-menu`）。
 */
@Component({
  selector: 'dui-context-menu-item',
  templateUrl: 'context-menu-item.component.html',
  encapsulation: ViewEncapsulation.None,
  host: { class: 'app-context-menu-item', 
    hostID: 'dui-context-menu-item' + Math.random().toString(36).substring(2, 15)
  },
  standalone: false,
  changeDetection: ChangeDetectionStrategy.Default,
})
export class ContextMenuItemComponent extends MenuBase implements OnInit,DoCheck {
  /**
   * Input property `menuItem` (`MenuModel`) configuring menu item.
   * @zh 输入属性 `menuItem`（类型：`MenuModel`），用于配置菜单条目。
   */
  @Input()
  menuItem: MenuModel;

  /**
   * Creates an instance of `ContextMenuItemComponent` and initializes its dependencies and internal state.
   * @zh 创建 `ContextMenuItemComponent` 实例，并初始化其依赖项与内部状态。
   * @param _changeDetectorRef - Injected or initial change detector ref (`ChangeDetectorRef`) / 注入或传入的变更检测器引用（`ChangeDetectorRef`）
   * @param router - Injected or initial router (`Router`) / 注入或传入的router（`Router`）
   * @param resolver - Injected or initial resolver (`ComponentFactoryResolver`) / 注入或传入的解析器（`ComponentFactoryResolver`）
   * @param injector - Injected or initial injector (`Injector`) / 注入或传入的注入器（`Injector`）
   */
  constructor(
    protected _changeDetectorRef: ChangeDetectorRef,
    protected override router: Router,
    protected override injector: Injector) {
    super(router, _changeDetectorRef, injector);
  }

  /**
   * Angular lifecycle hook invoked during every change-detection run for custom change detection.
   * @zh Angular 生命周期钩子：在每次变更检测周期中调用，用于执行自定义变更检测。
   */
  override ngDoCheck() {
    if(this.menuItem.doCheck){
      this.menuItem.doCheck(this.menuItem);
    }
    this.checkMenuExpressionChange(this.menuItem, this.ownerCt);
    this.checkMenuVisibilityChange(this.menuItem, this.ownerCt);
    this.changeDetectorRef.markForCheck();
  }
  /**
   * Angular lifecycle hook invoked once after component or directive inputs are initialized.
   * @zh Angular 生命周期钩子：在组件或指令的输入属性初始化完成后调用一次。
   */
  ngOnInit() {
    this.initFieldExpression(this.menuItem);
    if(this.menuItem.children){
      this.menuItem.children.forEach(item => {
        this.initFieldExpression(item);
      });
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
