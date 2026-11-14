/**
 * @fileoverview Module `src/ui/menu/menu-item.directive.ts` providing menu item directive definitions and implementation.
 * @zh 模块文件 `src/ui/menu/menu-item.directive.ts`，提供菜单条目指令相关的定义与实现。
 */


import { Directive, ViewContainerRef } from '@angular/core';

/**
 * Angular directive `MenuDirective` (selector: '[menu-host]') attaching menu directive behavior to host DOM elements.
 * @zh Angular 指令 `MenuDirective`（selector: '[menu-host]'），为宿主 DOM 元素附加菜单指令行为。
 */
@Directive({
  selector: '[menu-host]',
  standalone: false,
})
export class MenuDirective {
  /**
   * Creates an instance of `MenuDirective` and initializes its dependencies and internal state.
   * @zh 创建 `MenuDirective` 实例，并初始化其依赖项与内部状态。
   * @param viewContainerRef - Injected or initial view container ref (`ViewContainerRef`) / 注入或传入的视图容器引用（`ViewContainerRef`）
   */
  constructor(public viewContainerRef: ViewContainerRef) { }
}
