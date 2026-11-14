/**
 * @fileoverview Module `src/core/mobx/directives/mobx-reaction.directive.ts` providing a zero-MobX Angular Signal-compatible reaction directive.
 * @zh 模块文件 `src/core/mobx/directives/mobx-reaction.directive.ts`，提供零 MobX 依赖、兼容原生 Angular Signal 变更检测的派生响应指令实现。
 */

import { Directive, EmbeddedViewRef, Input, Renderer2, TemplateRef, ViewContainerRef } from '@angular/core';
import { MobxAutorunDirective } from './mobx-autorun.directive';

/**
 * Angular directive `MobxReactionDirective` (selector: '[mobxReaction]') attaching Signal-compatible embedded template rendering.
 * @zh Angular 指令 `MobxReactionDirective`（selector: '[mobxReaction]'），在零 MobX 模式下挂载内嵌模板并交由 Angular Signal 跟踪刷新。
 */
@Directive({ selector: '[mobxReaction]', standalone: false })
export class MobxReactionDirective extends MobxAutorunDirective {
  /**
   * Input property `mobxReaction` (`() => unknown`) configuring tracked expression.
   * @zh 输入属性 `mobxReaction`（类型：`() => unknown`），配置派生求值表达式。
   */
  @Input() mobxReaction: (() => unknown) | null = null;

  /**
   * Creates an instance of `MobxReactionDirective` and initializes its dependencies and internal state.
   * @zh 创建 `MobxReactionDirective` 实例，并初始化其依赖项与内部状态。
   * @param templateRef - Injected or initial template ref (`TemplateRef<unknown>`) / 注入或传入的模板引用（`TemplateRef<unknown>`）
   * @param viewContainer - Injected or initial view container (`ViewContainerRef`) / 注入或传入的视图容器（`ViewContainerRef`）
   * @param renderer - Injected or initial renderer (`Renderer2`) / 注入或传入的渲染器（`Renderer2`）
   */
  constructor(
    protected override templateRef: TemplateRef<unknown>,
    protected override viewContainer: ViewContainerRef,
    protected override renderer: Renderer2,
  ) {
    super(templateRef, viewContainer, renderer);
  }

  /**
   * Executes `autoDetect` to evaluate initial reaction expression if provided and register view cleanup.
   * @zh 执行 `autoDetect`，在初始化时按需执行追踪函数并注册内嵌视图清理回调。
   * @param view - view parameter (`EmbeddedViewRef<unknown>`) / 视图参数（`EmbeddedViewRef<unknown>`）
   */
  override autoDetect(view: EmbeddedViewRef<unknown>): void {
    if (typeof this.mobxReaction === 'function') {
      this.mobxReaction();
    }
    super.autoDetect(view);
  }
}
