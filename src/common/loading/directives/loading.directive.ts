/**
 * @fileoverview Module `src/common/loading/directives/loading.directive.ts` providing loading directive definitions and implementation.
 * @zh 模块文件 `src/common/loading/directives/loading.directive.ts`，提供加载中指令相关的定义与实现。
 */

import { Directive, Input, OnInit, OnDestroy } from '@angular/core';
import { ViewContainerRef, TemplateRef } from '@angular/core';

import {
  LoadingType,
  LoadingMode,
  LoadingStrategy,
} from '../loading.component';
import { LoadingService } from '../services/loading.service';
import { ILoadingRef } from '../services/loading.factory';


/**
 * Class `LoadingContext` encapsulating loading context data structures and logic in `src/common/loading/directives`.
 * @zh 类 `LoadingContext`，封装 `src/common/loading/directives` 中的加载中上下文数据结构与处理逻辑。
 */
export class LoadingContext {
  /**
   * Property `$implicit` (`any`) storing implicit (default: `undefined`).
   * @zh 属性 `$implicit`（类型：`any`），用于存储或配置implicit（默认值：`undefined`）。
   */
  public $implicit = undefined;
  /**
   * Property `tdLoading` (`any`) storing td loading (default: `undefined`).
   * @zh 属性 `tdLoading`（类型：`any`），用于存储或配置td加载中（默认值：`undefined`）。
   */
  public tdLoading = undefined;
}


/**
 * Constant/variable `TD_LOADING_NEXT_ID` defining td loading next id in `src/common/loading/directives`.
 * @zh 常量/变量 `TD_LOADING_NEXT_ID`，定义 `src/common/loading/directives` 中的TD加载中下一个唯一标识。
 */
let TD_LOADING_NEXT_ID = 0;

/**
 * Structural-style directive that shows a {@link LoadingComponent} over/instead of its host
 * element until the `duiLoadingUntil` condition becomes truthy.
 * @zh 结构型指令，在 `duiLoadingUntil` 条件变为真值之前，于宿主元素之上/取代宿主元素显示 {@link LoadingComponent}。
 */
@Directive({
  selector: '[duiLoading]',
  standalone: false,
})
export class LoadingDirective implements OnInit, OnDestroy {
  /**
   * Property `_context` (`LoadingContext`) storing context (default: `new LoadingContext()`).
   * @zh 属性 `_context`（类型：`LoadingContext`），用于存储或配置上下文（默认值：`new LoadingContext()`）。
   */
  private _context: LoadingContext = new LoadingContext();
  /**
   * Property `_loadingRef` (`ILoadingRef`) storing loading ref.
   * @zh 属性 `_loadingRef`（类型：`ILoadingRef`），用于存储或配置加载中引用。
   */
  private _loadingRef?: ILoadingRef;


  /**
   * Unique name for this loading instance, auto-generated if omitted.
   * @zh 本加载实例的唯一名称，省略时自动生成。
   */
  @Input('duiLoading')
  name!: string;


  /**
   * Shows the loading indicator while this value is falsy; hides it once truthy.
   * @zh 当该值为假时显示加载指示器；变为真值后隐藏。
   */
  @Input('duiLoadingUntil')
  set until(until) {
    if (!this.name) {
      this.name = 'dui-loading-until-' + TD_LOADING_NEXT_ID++;
    }
    this._context.$implicit = this._context.tdLoading = until;
    if (!until) {
      this._loadingService.register(this.name);
    } else {
      this._loadingService.resolveAll(this.name);
    }
  }

  /**
   * Input property `duiLoadingType` (`LoadingType`) configuring type (default: `LoadingType.Circular`).
   * @zh 加载指示器的样式类型：圆形或线性。
   * @zh 加载指示器的样式类型：圆形或线性。
   */
  @Input('duiLoadingType')
  type: LoadingType = LoadingType.Circular;

  /**
   * Input property `duiLoadingMode` (`LoadingMode`) configuring mode (default: `LoadingMode.Indeterminate`).
   * @zh 加载指示器的模式：确定或不确定。
   * @zh 加载指示器的模式：确定或不确定。
   */
  @Input('duiLoadingMode') mode: LoadingMode = LoadingMode.Indeterminate;

  /**
   * @zh 加载指示器的展示策略：覆盖层（Overlay）或原地替换（Replace）。
   * @zh 加载指示器的展示策略：覆盖层（Overlay）或原地替换（Replace）。
   */
  @Input('duiLoadingStrategy')
  strategy: LoadingStrategy.Overlay | LoadingStrategy.Replace =
    LoadingStrategy.Replace;

  /**
   * @zh 加载指示器的 Material 主题色。
   * @zh 加载指示器的 Material 主题色。
   */
  @Input('duiLoadingColor') color: 'primary' | 'accent' | 'warn' = 'primary';

  /**
   * Creates an instance of `LoadingDirective` and initializes its dependencies and internal state.
   * @zh 创建 `LoadingDirective` 实例，并初始化其依赖项与内部状态。
   * @param _viewContainerRef - Injected or initial view container ref (`ViewContainerRef`) / 注入或传入的视图容器引用（`ViewContainerRef`）
   * @param _templateRef - Injected or initial template ref (`TemplateRef<LoadingContext>`) / 注入或传入的模板引用（`TemplateRef<LoadingContext>`）
   * @param _loadingService - Injected or initial loading service (`LoadingService`) / 注入或传入的加载中服务（`LoadingService`）
   */
  constructor(
    private _viewContainerRef: ViewContainerRef,
    private _templateRef: TemplateRef<LoadingContext>,
    private _loadingService: LoadingService
  ) {}

  /**
   * Angular lifecycle hook invoked once after component or directive inputs are initialized.
   * @zh Angular 生命周期钩子：在组件或指令的输入属性初始化完成后调用一次。
   */
  ngOnInit(): void {
    this._registerComponent();
  }


  /**
   * Angular lifecycle hook invoked just before the component, directive, or service is destroyed to release subscriptions and resources.
   * @zh Angular 生命周期钩子：在组件、指令或服务销毁前调用，用于释放订阅与清理资源。
   */
  ngOnDestroy(): void {
    this._loadingService.removeComponent(this.name);
    this._loadingRef = undefined;
  }

  /**
   * Executes `_registerComponent` to handle register component.
   * @zh 执行 `_registerComponent`，用于注册组件。
   */
  private _registerComponent(): void {
    if (!this.name) {
      throw new Error('Name is needed to register loading directive');
    }
  
    if (!this._loadingRef) {
      this._loadingRef = this._loadingService.createComponent(
        {
          name: this.name,
          type: this.type,
          mode: this.mode,
          color: this.color,
          strategy: this.strategy,
        },
        this._viewContainerRef,
        this._templateRef,
        this._context
      );
    }
  }
}
