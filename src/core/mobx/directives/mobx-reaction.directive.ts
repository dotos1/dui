/**
 * @fileoverview Module `src/core/mobx/directives/mobx-reaction.directive.ts` providing mobx reaction directive definitions and implementation.
 * @zh 模块文件 `src/core/mobx/directives/mobx-reaction.directive.ts`，提供mobxreaction指令相关的定义与实现。
 */

import { Directive, ViewContainerRef, TemplateRef, Input, Renderer2 } from '@angular/core';
import { reaction } from 'mobx';
import {MobxAutorunDirective} from './mobx-autorun.directive';

/**
 * Angular directive `MobxReactionDirective` (selector: '[mobxReaction]') attaching mobx reaction directive behavior to host DOM elements.
 * @zh Angular 指令 `MobxReactionDirective`（selector: '[mobxReaction]'），为宿主 DOM 元素附加MobxReaction指令行为。
 */
@Directive({ selector: '[mobxReaction]' })
export class MobxReactionDirective extends MobxAutorunDirective {
  /**
   * Input property `mobxReaction` (`any`) configuring mobx reaction.
   * @zh 输入属性 `mobxReaction`（类型：`any`），用于配置mobxReaction。
   */
  @Input() mobxReaction;

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
    protected override renderer: Renderer2) {super(templateRef, viewContainer, renderer); }

  /**
   * Executes `autoDetect` to handle auto detect.
   * @zh 执行 `autoDetect`，用于自动检测。
   * @param view - view parameter (`any`) / 视图参数（`any`）
   */
  override autoDetect(view) {
    this.dispose = reaction(this.mobxReaction, () => view.detectChanges(), { fireImmediately: true });
  }
}
