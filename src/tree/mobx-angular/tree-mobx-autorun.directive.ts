/**
 * @fileoverview Module `src/tree/mobx-angular/tree-mobx-autorun.directive.ts` providing tree mobx autorun directive definitions and implementation.
 * @zh 模块文件 `src/tree/mobx-angular/tree-mobx-autorun.directive.ts`，提供树形控件mobxautorun指令相关的定义与实现。
 */

import {
  Directive,
  ViewContainerRef,
  TemplateRef,
  OnInit,
  OnDestroy,
  Input,
  EmbeddedViewRef
} from '@angular/core';
import { autorun } from 'mobx';

/**
 * Angular directive `TreeMobxAutorunDirective` (selector: '[treeMobxAutorun]') attaching tree mobx autorun directive behavior to host DOM elements.
 * @zh Angular 指令 `TreeMobxAutorunDirective`（selector: '[treeMobxAutorun]'），为宿主 DOM 元素附加树形控件MobxAutorun指令行为。
 */
@Directive({ selector: '[treeMobxAutorun]' })
export class TreeMobxAutorunDirective implements OnInit, OnDestroy {
  /**
   * Property `templateBindings` (`any`) storing template bindings (default: `{}`).
   * @zh 属性 `templateBindings`（类型：`any`），用于存储或配置模板Bindings（默认值：`{}`）。
   */
  protected templateBindings = {};
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
   * Input property `treeMobxAutorun` (`any`) configuring tree mobx autorun.
   * @zh 输入属性 `treeMobxAutorun`（类型：`any`），用于配置树形控件MobxAutorun。
   */
  @Input() treeMobxAutorun;

  /**
   * Creates an instance of `TreeMobxAutorunDirective` and initializes its dependencies and internal state.
   * @zh 创建 `TreeMobxAutorunDirective` 实例，并初始化其依赖项与内部状态。
   * @param templateRef - Injected or initial template ref (`TemplateRef<any>`) / 注入或传入的模板引用（`TemplateRef<any>`）
   * @param viewContainer - Injected or initial view container (`ViewContainerRef`) / 注入或传入的视图容器（`ViewContainerRef`）
   */
  constructor(
    protected templateRef: TemplateRef<unknown>,
    protected viewContainer: ViewContainerRef
  ) {}

  /**
   * Angular lifecycle hook invoked once after component or directive inputs are initialized.
   * @zh Angular 生命周期钩子：在组件或指令的输入属性初始化完成后调用一次。
   */
  ngOnInit() {
    this.view = this.viewContainer.createEmbeddedView(this.templateRef);

    if (this.dispose) {
      this.dispose();
    }

    if (this.shouldDetach()) {
      this.view.detach();
    }
    this.autoDetect(this.view);
  }

  /**
   * Executes `shouldDetach` to handle should detach.
   * @zh 执行 `shouldDetach`，用于是否应当卸载。
   */
  shouldDetach() {
    return this.treeMobxAutorun && this.treeMobxAutorun.detach;
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
    if (this.dispose) {
      this.dispose();
    }
  }
}
