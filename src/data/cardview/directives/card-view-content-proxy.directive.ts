/**
 * @fileoverview Module `src/data/cardview/directives/card-view-content-proxy.directive.ts` providing card view content proxy directive definitions and implementation.
 * @zh 模块文件 `src/data/cardview/directives/card-view-content-proxy.directive.ts`，提供卡片视图内容proxy指令相关的定义与实现。
 */



import { Directive, ViewContainerRef } from '@angular/core';

/**
 * Angular directive `CardViewContentProxyDirective` (selector: '[dui-card-view-content-proxy]') attaching card view content proxy directive behavior to host DOM elements.
 * @zh Angular 指令 `CardViewContentProxyDirective`（selector: '[dui-card-view-content-proxy]'），为宿主 DOM 元素附加卡片视图内容Proxy指令行为。
 */
@Directive({
  selector: '[dui-card-view-content-proxy]'
})
export class CardViewContentProxyDirective {
  /**
   * Creates an instance of `CardViewContentProxyDirective` and initializes its dependencies and internal state.
   * @zh 创建 `CardViewContentProxyDirective` 实例，并初始化其依赖项与内部状态。
   * @param viewContainerRef - Injected or initial view container ref (`ViewContainerRef`) / 注入或传入的视图容器引用（`ViewContainerRef`）
   */
  constructor(public viewContainerRef: ViewContainerRef) { }
}
