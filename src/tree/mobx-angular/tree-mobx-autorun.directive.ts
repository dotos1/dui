/**
 * @fileoverview Module `src/tree/mobx-angular/tree-mobx-autorun.directive.ts` providing a zero-MobX structural directive for tree templates.
 * @zh 模块文件 `src/tree/mobx-angular/tree-mobx-autorun.directive.ts`，为树形控件模板提供零 MobX 依赖的原生 Angular Signal 视图渲染兼容指令。
 */

import {
  Directive,
  EmbeddedViewRef,
  Input,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';

/**
 * Interface `TreeAutorunOptions` defining optional configuration passed to `[treeMobxAutorun]`.
 * @zh 接口 `TreeAutorunOptions`，定义传入 `[treeMobxAutorun]` 的可选配置参数。
 */
export interface TreeAutorunOptions {
  /**
   * Optional property `detach` (`boolean`) storing legacy detach flag.
   * @zh 可选属性 `detach`（类型：`boolean`），表示历史兼容的视图分离标记。
   */
  detach?: boolean;
  /**
   * Optional property `dontDetach` (`boolean`) storing dontDetach flag.
   * @zh 可选属性 `dontDetach`（类型：`boolean`），表示保持视图挂载以参与原生 Signal 变更检测。
   */
  dontDetach?: boolean;
}

/**
 * Angular directive `TreeMobxAutorunDirective` (selector: '[treeMobxAutorun]') rendering tree templates natively via Angular Signal change detection.
 * @zh Angular 指令 `TreeMobxAutorunDirective`（selector: '[treeMobxAutorun]'），通过原生视图容器渲染树模板并由 Angular Signal 驱动按需更新（零 MobX 依赖）。
 */
@Directive({ selector: '[treeMobxAutorun]', standalone: false })
export class TreeMobxAutorunDirective implements OnInit, OnDestroy {
  /**
   * Property `templateBindings` (`Record<string, unknown>`) storing template bindings.
   * @zh 属性 `templateBindings`（类型：`Record<string, unknown>`），存储模板绑定上下文。
   */
  protected templateBindings: Record<string, unknown> = {};
  /**
   * Property `dispose` (`() => void`) storing cleanup callback (default: `null`).
   * @zh 属性 `dispose`（类型：`() => void`），存储销毁释放回调（默认值：`null`）。
   */
  protected dispose: (() => void) | null = null;
  /**
   * Property `view` (`EmbeddedViewRef<unknown>`) storing embedded view reference (default: `null`).
   * @zh 属性 `view`（类型：`EmbeddedViewRef<unknown>`），存储内嵌视图引用（默认值：`null`）。
   */
  protected view: EmbeddedViewRef<unknown> | null = null;
  /**
   * Input property `treeMobxAutorun` (`string | TreeAutorunOptions`) configuring directive options.
   * @zh 输入属性 `treeMobxAutorun`（类型：`string | TreeAutorunOptions`），配置指令参数。
   */
  @Input() treeMobxAutorun: TreeAutorunOptions | string | null = null;

  /**
   * Creates an instance of `TreeMobxAutorunDirective` and initializes its dependencies and internal state.
   * @zh 创建 `TreeMobxAutorunDirective` 实例，并初始化其依赖项与内部状态。
   * @param templateRef - Injected or initial template ref (`TemplateRef<unknown>`) / 注入或传入的模板引用（`TemplateRef<unknown>`）
   * @param viewContainer - Injected or initial view container (`ViewContainerRef`) / 注入或传入的视图容器（`ViewContainerRef`）
   */
  constructor(
    protected templateRef: TemplateRef<unknown>,
    protected viewContainer: ViewContainerRef,
  ) {}

  /**
   * Angular lifecycle hook invoked once after component or directive inputs are initialized.
   * @zh Angular 生命周期钩子：在组件或指令的输入属性初始化完成后调用一次。
   */
  ngOnInit(): void {
    if (this.dispose) {
      this.dispose();
    }
    this.view = this.viewContainer.createEmbeddedView(this.templateRef);
    this.autoDetect(this.view);
  }

  /**
   * Executes `shouldDetach` to check whether legacy detach flag was set.
   * @zh 执行 `shouldDetach`，检查是否配置了分离标记。
   * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
   */
  shouldDetach(): boolean {
    return typeof this.treeMobxAutorun === 'object' && this.treeMobxAutorun !== null && Boolean(this.treeMobxAutorun.detach);
  }

  /**
   * Executes `autoDetect` to register view cleanup without MobX `autorun`.
   * @zh 执行 `autoDetect`，保持内嵌视图挂载以响应 Signal 变更并注册销毁释放函数。
   * @param view - view parameter (`EmbeddedViewRef<unknown>`) / 视图参数（`EmbeddedViewRef<unknown>`）
   */
  autoDetect(view: EmbeddedViewRef<unknown>): void {
    this.dispose = (): void => {
      if (!view.destroyed) {
        view.destroy();
      }
    };
  }

  /**
   * Angular lifecycle hook invoked just before the component, directive, or service is destroyed to release subscriptions and resources.
   * @zh Angular 生命周期钩子：在组件、指令或服务销毁前调用，释放内嵌视图资源。
   */
  ngOnDestroy(): void {
    if (this.dispose) {
      this.dispose();
      this.dispose = null;
    }
    this.view = null;
  }
}
