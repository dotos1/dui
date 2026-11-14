/**
 * @fileoverview Module `src/core/mobx/directives/mobx-autorun.directive.ts` providing a zero-MobX Angular Signal-compatible structural directive.
 * @zh 模块文件 `src/core/mobx/directives/mobx-autorun.directive.ts`，提供零 MobX 依赖、兼容原生 Angular Signal 变更检测的结构型指令实现。
 */

import {
  Directive,
  EmbeddedViewRef,
  Input,
  OnDestroy,
  OnInit,
  Renderer2,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';

/**
 * Interface `MobxAutorunOptions` defining optional configuration passed to `[mobxAutorun]`.
 * @zh 接口 `MobxAutorunOptions`，定义传入 `[mobxAutorun]` 的可选配置项契约。
 */
export interface MobxAutorunOptions {
  /**
   * Optional property `detach` (`boolean`) indicating legacy detach flag.
   * @zh 可选属性 `detach`（类型：`boolean`），表示历史兼容的视图分离标记。
   */
  detach?: boolean;
  /**
   * Optional property `dontDetach` (`boolean`) indicating view stays attached to Angular change detection.
   * @zh 可选属性 `dontDetach`（类型：`boolean`），表示保持视图挂载以参与原生 Signal 变更检测。
   */
  dontDetach?: boolean;
}

/**
 * Angular directive `MobxAutorunDirective` (selector: '[mobxAutorun]') rendering embedded templates natively via Angular Signal change detection without MobX.
 * @zh Angular 指令 `MobxAutorunDirective`（selector: '[mobxAutorun]'），通过原生视图容器挂载模板并由 Angular Signal 驱动更新（零 MobX 依赖）。
 */
@Directive({ selector: '[mobxAutorun]', standalone: false })
export class MobxAutorunDirective implements OnInit, OnDestroy {
  /**
   * Property `templateBindings` (`Record<string, unknown>`) storing template bindings.
   * @zh 属性 `templateBindings`（类型：`Record<string, unknown>`），存储模板绑定上下文。
   */
  protected templateBindings: Record<string, unknown> = {};
  /**
   * Property `dispose` (`() => void`) storing cleanup callback (default: `null`).
   * @zh 属性 `dispose`（类型：`() => void`），存储资源释放回调（默认值：`null`）。
   */
  protected dispose: (() => void) | null = null;
  /**
   * Property `view` (`EmbeddedViewRef<unknown>`) storing created embedded view (default: `null`).
   * @zh 属性 `view`（类型：`EmbeddedViewRef<unknown>`），存储已创建的内嵌视图引用（默认值：`null`）。
   */
  protected view: EmbeddedViewRef<unknown> | null = null;
  /**
   * Input property `mobxAutorun` (`string | MobxAutorunOptions`) configuring directive options.
   * @zh 输入属性 `mobxAutorun`（类型：`string | MobxAutorunOptions`），配置指令参数。
   */
  @Input() mobxAutorun: MobxAutorunOptions | string | null = null;

  /**
   * Creates an instance of `MobxAutorunDirective` and initializes its dependencies and internal state.
   * @zh 创建 `MobxAutorunDirective` 实例，并初始化其依赖项与内部状态。
   * @param templateRef - Injected or initial template ref (`TemplateRef<unknown>`) / 注入或传入的模板引用（`TemplateRef<unknown>`）
   * @param viewContainer - Injected or initial view container (`ViewContainerRef`) / 注入或传入的视图容器（`ViewContainerRef`）
   * @param renderer - Injected or initial renderer (`Renderer2`) / 注入或传入的渲染器（`Renderer2`）
   */
  constructor(
    protected templateRef: TemplateRef<unknown>,
    protected viewContainer: ViewContainerRef,
    protected renderer: Renderer2,
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
   * Executes `shouldDetach` to check whether detach option was explicitly requested.
   * @zh 执行 `shouldDetach`，检查是否显式指定了分离选项。
   * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
   */
  shouldDetach(): boolean {
    return typeof this.mobxAutorun === 'object' && this.mobxAutorun !== null && Boolean(this.mobxAutorun.detach);
  }

  /**
   * Executes `autoDetect` to register view cleanup without MobX `autorun`.
   * @zh 执行 `autoDetect`，在零 MobX 模式下保持视图挂载并注册销毁清理回调。
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
   * @zh Angular 生命周期钩子：在组件、指令或服务销毁前调用，释放内嵌视图与资源。
   */
  ngOnDestroy(): void {
    if (this.dispose) {
      this.dispose();
      this.dispose = null;
    }
    this.view = null;
  }
}
