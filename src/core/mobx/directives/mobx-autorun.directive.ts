/**
 * @fileoverview Module `src/core/mobx/directives/mobx-autorun.directive.ts` providing mobx autorun directive definitions and implementation.
 * @zh 模块文件 `src/core/mobx/directives/mobx-autorun.directive.ts`，提供mobxautorun指令相关的定义与实现。
 */

import { Directive, ViewContainerRef, TemplateRef, OnInit, OnDestroy, Input, Renderer2,
  EmbeddedViewRef } from '@angular/core';
import { autorun } from 'mobx';

/**
 * Angular directive `MobxAutorunDirective` (selector: '[mobxAutorun]') attaching mobx autorun directive behavior to host DOM elements.
 * @zh Angular 指令 `MobxAutorunDirective`（selector: '[mobxAutorun]'），为宿主 DOM 元素附加MobxAutorun指令行为。
 */
@Directive({ selector: '[mobxAutorun]' })
export class MobxAutorunDirective implements OnInit, OnDestroy {
  /**
   * Property `templateBindings` (`any`) storing template bindings (default: `{}`).
   * @zh 属性 `templateBindings`（类型：`any`），用于存储或配置模板Bindings（默认值：`{}`）。
   */
  protected templateBindings: Record<string, unknown> = {};
  /**
   * Property `dispose` (`any`) storing dispose.
   * @zh 属性 `dispose`（类型：`any`），用于存储或配置释放。
   */
  protected dispose;
  /**
   * Property `view` (`EmbeddedViewRef<any>`) storing view.
   * @zh 属性 `view`（类型：`EmbeddedViewRef<any>`），用于存储或配置视图。
   */
  protected view;
  /**
   * Input property `mobxAutorun` (`any`) configuring mobx autorun.
   * @zh 输入属性 `mobxAutorun`（类型：`any`），用于配置mobxAutorun。
   */
  @Input() mobxAutorun;

  /**
   * Creates an instance of `MobxAutorunDirective` and initializes its dependencies and internal state.
   * @zh 创建 `MobxAutorunDirective` 实例，并初始化其依赖项与内部状态。
   * @param templateRef - Injected or initial template ref (`TemplateRef<any>`) / 注入或传入的模板引用（`TemplateRef<any>`）
   * @param viewContainer - Injected or initial view container (`ViewContainerRef`) / 注入或传入的视图容器（`ViewContainerRef`）
   * @param renderer - Injected or initial renderer (`Renderer2`) / 注入或传入的渲染器（`Renderer2`）
   */
  constructor(
    protected templateRef: TemplateRef<unknown>,
    protected viewContainer: ViewContainerRef,
    protected renderer: Renderer2) {
    }

  /**
   * Angular lifecycle hook invoked once after component or directive inputs are initialized.
   * @zh Angular 生命周期钩子：在组件或指令的输入属性初始化完成后调用一次。
   */
  ngOnInit() {
    this.view = this.viewContainer.createEmbeddedView(this.templateRef);

    if (this.dispose) { this.dispose(); }

    if (this.shouldDetach()) {
      this.view.detach();
    }
    this.autoDetect(this.view);
    // mobxAngularDebug(this.view, this.renderer, this.dispose);
  }

  /**
   * Executes `shouldDetach` to handle should detach.
   * @zh 执行 `shouldDetach`，用于是否应当卸载。
   */
  shouldDetach() {
    return this.mobxAutorun && this.mobxAutorun.detach;
  }

  /**
   * Executes `autoDetect` to handle auto detect.
   * @zh 执行 `autoDetect`，用于自动检测。
   * @param view - view parameter (`EmbeddedViewRef<any>`) / 视图参数（`EmbeddedViewRef<any>`）
   */
  autoDetect(view) {
    this.dispose = autorun(() => view.detectChanges());
  }

  /**
   * Angular lifecycle hook invoked just before the component, directive, or service is destroyed to release subscriptions and resources.
   * @zh Angular 生命周期钩子：在组件、指令或服务销毁前调用，用于释放订阅与清理资源。
   */
  ngOnDestroy() {
    if (this.dispose) { this.dispose(); }
  }
}
