/**
 * @fileoverview Module `src/ux/windows/window/components/named-outlet/named-outlet.directive.ts` providing named outlet directive definitions and implementation.
 * @zh 模块文件 `src/ux/windows/window/components/named-outlet/named-outlet.directive.ts`，提供已名称outlet指令相关的定义与实现。
 */

import { ChangeDetectorRef, ComponentFactoryResolver, Directive, EventEmitter, Input,  OnDestroy,  OnInit, Output, ViewContainerRef } from '@angular/core';
import { ChildrenOutletContexts,  Router, RouterOutlet } from '@angular/router';
import { RouteService } from './route.service';

/**
 * Angular directive `NamedOutletDirective` (selector: 'named-outlet') attaching named outlet directive behavior to host DOM elements.
 * @zh Angular 指令 `NamedOutletDirective`（selector: 'named-outlet'），为宿主 DOM 元素附加已名称Outlet指令行为。
 */
@Directive({
  selector: 'named-outlet',
  exportAs: 'outlet'
})
export class NamedOutletDirective implements OnInit,OnDestroy {
  /**
   * Property `outlet` (`RouterOutlet`) storing outlet.
   * @zh 属性 `outlet`（类型：`RouterOutlet`），用于存储或配置outlet。
   */
  public outlet!: RouterOutlet;
  /**
   * Input property `name` (`string`) configuring name.
   * @zh 输入属性 `name`（类型：`string`），用于配置名称。
   */
  @Input() public name!: string;
  /**
   * Output event emitter `initialized` (`EventEmitter<boolean>`) firing when initialized occurs.
   * @zh 输出事件 `initialized`（类型：`EventEmitter<boolean>`），当触发已初始化时向外发出事件。
   */
  @Output() public initialized = new EventEmitter<boolean>();

  /**
   * Creates an instance of `NamedOutletDirective` and initializes its dependencies and internal state.
   * @zh 创建 `NamedOutletDirective` 实例，并初始化其依赖项与内部状态。
   * @param parentContexts - Injected or initial parent contexts (`ChildrenOutletContexts`) / 注入或传入的父级上下文（`ChildrenOutletContexts`）
   * @param location - Injected or initial location (`ViewContainerRef`) / 注入或传入的location（`ViewContainerRef`）
   * @param resolver - Injected or initial resolver (`ComponentFactoryResolver`) / 注入或传入的解析器（`ComponentFactoryResolver`）
   * @param changeDetector - Injected or initial change detector (`ChangeDetectorRef`) / 注入或传入的变更检测器（`ChangeDetectorRef`）
   * @param router - Injected or initial router (`Router`) / 注入或传入的router（`Router`）
   * @param route - Injected or initial route (`RouteService`) / 注入或传入的route（`RouteService`）
   */
  constructor(
    private parentContexts: ChildrenOutletContexts,
    private location: ViewContainerRef,
    private resolver: ComponentFactoryResolver,
    private changeDetector: ChangeDetectorRef,
    protected router: Router,
    private route: RouteService
  ) { }

  /**
   * Angular lifecycle hook invoked once after component or directive inputs are initialized.
   * @zh Angular 生命周期钩子：在组件或指令的输入属性初始化完成后调用一次。
   */
  ngOnInit(): void {
    this.outlet = this.route.createRouterOutlet(this.parentContexts, this.location, this.resolver, this.name, this.changeDetector);
    this.outlet.ngOnInit();
    this.initialized.next(true);
  }

  /**
   * Angular lifecycle hook invoked just before the component, directive, or service is destroyed to release subscriptions and resources.
   * @zh Angular 生命周期钩子：在组件、指令或服务销毁前调用，用于释放订阅与清理资源。
   */
  ngOnDestroy(): void {
    this.route.clearRouterOutlet(this.name);
    this.outlet.ngOnDestroy();
  }
}
