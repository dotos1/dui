/**
 * @fileoverview Module `src/ui/menu/menu-bar.component.ts` providing menu bar component definitions and implementation.
 * @zh 模块文件 `src/ui/menu/menu-bar.component.ts`，提供菜单条组件相关的定义与实现。
 */

import { ChangeDetectorRef, Component, DoCheck, HostListener, Injector, Input, OnInit, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { MenuBase } from './menu-base';
import { MenuBarItem } from './menu-model';

/**
 * Angular component `MenuBarComponent` (selector: 'dui-menu-bar') providing menu bar component presentation and interaction in `src/ui/menu`.
 * @zh Angular 组件 `MenuBarComponent`（selector: 'dui-menu-bar'），提供菜单条组件的视图渲染与交互逻辑（位于 `src/ui/menu`）。
 */
@Component({
  selector: 'dui-menu-bar',
  templateUrl: './menu-bar.component.html',
  styleUrls: ['./menu-bar.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: {
    hostID: 'dui-menu-bar' + Math.random().toString(36).substring(2, 15)
  },
  standalone: false,
  changeDetection: ChangeDetectionStrategy.Default,
})
export class MenuBarComponent extends MenuBase implements OnInit,DoCheck{

  /**
   * Input property `dense` (`boolean`) configuring dense (default: `true`).
   * @zh 输入属性 `dense`（类型：`boolean`），用于配置dense（默认值：`true`）。
   */
  @Input() dense: boolean = true;

   /**
    * Input property `items` (`MenuBarItem[]`) configuring items.
    * @zh 输入属性 `items`（类型：`MenuBarItem[]`），用于配置条目列表。
    */
   @Input() declare  items: MenuBarItem[];

  /**
   * Input property `menuClasses` (`any`) configuring menu classes.
   * @zh 输入属性 `menuClasses`（类型：`any`），用于配置菜单类名集合。
   */
  @Input() menuClasses

  /**
   * Host event listener `onRightClick` handling `contextmenu` events for on right click.
   * @zh 宿主事件监听方法 `onRightClick`，响应 `contextmenu` 事件以处理当右侧位置点击。
   * @param event - event parameter (`any`) / 事件参数（`any`）
   */
  @HostListener('contextmenu', ['$event'])
  onRightClick(event) {
    event.preventDefault();
  }

  /**
   * Creates an instance of `MenuBarComponent` and initializes its dependencies and internal state.
   * @zh 创建 `MenuBarComponent` 实例，并初始化其依赖项与内部状态。
   * @param changeDetectorRef - Injected or initial change detector ref (`ChangeDetectorRef`) / 注入或传入的变更检测器引用（`ChangeDetectorRef`）
   * @param router - Injected or initial router (`Router`) / 注入或传入的router（`Router`）
   * @param resolver - Injected or initial resolver (`ComponentFactoryResolver`) / 注入或传入的解析器（`ComponentFactoryResolver`）
   * @param injector - Injected or initial injector (`Injector`) / 注入或传入的注入器（`Injector`）
   */
  constructor(
    public override changeDetectorRef: ChangeDetectorRef,
    protected override router: Router,
    protected override injector: Injector) {
    super(router, changeDetectorRef, injector);
  }

  /**
   * Angular lifecycle hook invoked once after component or directive inputs are initialized.
   * @zh Angular 生命周期钩子：在组件或指令的输入属性初始化完成后调用一次。
   */
  ngOnInit() {
    this.items.forEach(item => {
      this.initFieldExpression(item);
    });
  }


  /**
   * Angular lifecycle hook invoked during every change-detection run for custom change detection.
   * @zh Angular 生命周期钩子：在每次变更检测周期中调用，用于执行自定义变更检测。
   */
  override ngDoCheck() {
    super.ngDoCheck();
  }

  /**
   * Executes `click` to handle click.
   * @zh 执行 `click`，用于点击。
   * @param menu - menu parameter (`any`) / 菜单参数（`any`）
   * @param comp - comp parameter (`any`) / 组件参数（`any`）
   */
  public click(menu, comp?) {
    if (menu.handler) {
      menu.handler(menu, comp);
    }
  }
}
