/**
 * @fileoverview Module `src/common/loading/services/loading.service.ts` providing loading service definitions and implementation.
 * @zh 模块文件 `src/common/loading/services/loading.service.ts`，提供加载中服务相关的定义与实现。
 */

import { Injectable, Provider, SkipSelf, Optional } from '@angular/core';
import { ViewContainerRef, TemplateRef } from '@angular/core';

import { LoadingContext } from '../directives/loading.directive';
import {
  LoadingComponent,
  LoadingMode,
  LoadingStrategy,
  LoadingType,
} from '../loading.component';
import { LoadingFactory, ILoadingRef } from './loading.factory';

/**
 * Interface `ILoadingConfig` defining the contract and properties for i loading config.
 * @zh 接口 `ILoadingConfig`，定义I加载中配置的数据结构契约与属性规范。
 */
export interface ILoadingConfig {
  /**
   * Property `name` (`string`) storing name.
   * @zh 属性 `name`（类型：`string`），用于存储或配置名称。
   */
  name: string;
  /**
   * Property `type` (`LoadingType`) storing type.
   * @zh 属性 `type`（类型：`LoadingType`），用于存储或配置类型。
   */
  type?: LoadingType;
  /**
   * Property `mode` (`LoadingMode`) storing mode.
   * @zh 属性 `mode`（类型：`LoadingMode`），用于存储或配置模式。
   */
  mode?: LoadingMode;
  /**
   * Property `color` (`'primary' | 'accent' | 'warn'`) storing color.
   * @zh 属性 `color`（类型：`'primary' | 'accent' | 'warn'`），用于存储或配置颜色。
   */
  color?: 'primary' | 'accent' | 'warn';
}

/**
 * Class `LoadingConfig` encapsulating loading config data structures and logic in `src/common/loading/services`.
 * @zh 类 `LoadingConfig`，封装 `src/common/loading/services` 中的加载中配置数据结构与处理逻辑。
 */
export class LoadingConfig implements ILoadingConfig {
  /**
   * Property `name` (`string`) storing name.
   * @zh 属性 `name`（类型：`string`），用于存储或配置名称。
   */
  name: string;
  /**
   * Property `type` (`LoadingType`) storing type.
   * @zh 属性 `type`（类型：`LoadingType`），用于存储或配置类型。
   */
  type?: LoadingType;
  /**
   * Property `mode` (`LoadingMode`) storing mode.
   * @zh 属性 `mode`（类型：`LoadingMode`），用于存储或配置模式。
   */
  mode?: LoadingMode;
  /**
   * Property `color` (`'primary' | 'accent' | 'warn'`) storing color.
   * @zh 属性 `color`（类型：`'primary' | 'accent' | 'warn'`），用于存储或配置颜色。
   */
  color?: 'primary' | 'accent' | 'warn';

  /**
   * Creates an instance of `LoadingConfig` and initializes its dependencies and internal state.
   * @zh 创建 `LoadingConfig` 实例，并初始化其依赖项与内部状态。
   * @param config - Injected or initial config (`ILoadingConfig`) / 注入或传入的配置（`ILoadingConfig`）
   */
  constructor(config: ILoadingConfig) {
    this.name = config.name;
    if (!this.name) {
      throw Error('Name is required for [DuiLoading] configuration.');
    }
    this.mode = config.mode ? config.mode : LoadingMode.Indeterminate;
    this.type = config.type ? config.type : LoadingType.Circular;
    this.color = config.color ? config.color : 'primary';
  }
}

/**
 * Interface `ILoadingDirectiveConfig` defining the contract and properties for i loading directive config.
 * @zh 接口 `ILoadingDirectiveConfig`，定义I加载中指令配置的数据结构契约与属性规范。
 */
export interface ILoadingDirectiveConfig extends ILoadingConfig {
  /**
   * Property `strategy` (`LoadingStrategy`) storing strategy.
   * @zh 属性 `strategy`（类型：`LoadingStrategy`），用于存储或配置策略。
   */
  strategy?: LoadingStrategy;
}

/**
 * Class `LoadingDirectiveConfig` encapsulating loading directive config data structures and logic in `src/common/loading/services`.
 * @zh 类 `LoadingDirectiveConfig`，封装 `src/common/loading/services` 中的加载中指令配置数据结构与处理逻辑。
 */
export class LoadingDirectiveConfig
  extends LoadingConfig
  implements ILoadingDirectiveConfig
{
  /**
   * Property `strategy` (`LoadingStrategy`) storing strategy.
   * @zh 属性 `strategy`（类型：`LoadingStrategy`），用于存储或配置策略。
   */
  strategy: LoadingStrategy;

  /**
   * Creates an instance of `LoadingDirectiveConfig` and initializes its dependencies and internal state.
   * @zh 创建 `LoadingDirectiveConfig` 实例，并初始化其依赖项与内部状态。
   * @param config - Injected or initial config (`ILoadingDirectiveConfig`) / 注入或传入的配置（`ILoadingDirectiveConfig`）
   */
  constructor(config: ILoadingDirectiveConfig) {
    super(config);
    this.strategy = config.strategy ? config.strategy : LoadingStrategy.Replace;
  }
}

/**
 * Manages named loading indicators: a full-screen one created at startup, plus any number
 * of directive-driven (overlay or replace-strategy) loading components registered/resolved by name.
 * @zh 管理具名的加载指示器：启动时创建的一个全屏指示器，以及任意数量由指令驱动
 * （overlay 或 replace 策略）、按名称注册/解析的加载组件。
 */
@Injectable()
export class LoadingService {
  /**
   * Property `_context` (`{ [key: string]: ILoadingRef }`) storing context (default: `{}`).
   * @zh 属性 `_context`（类型：`{ [key: string]: ILoadingRef }`），用于存储或配置上下文（默认值：`{}`）。
   */
  private _context: { [key: string]: ILoadingRef } = {};
  /**
   * Property `_timeouts` (`{ [key: string]: any }`) storing timeouts (default: `{}`).
   * @zh 属性 `_timeouts`（类型：`{ [key: string]: any }`），用于存储或配置延时器（默认值：`{}`）。
   */
  private _timeouts: { [key: string]: unknown } = {};

  /**
   * Creates an instance of `LoadingService` and initializes its dependencies and internal state.
   * @zh 创建 `LoadingService` 实例，并初始化其依赖项与内部状态。
   * @param _loadingFactory - Injected or initial loading factory (`LoadingFactory`) / 注入或传入的加载中工厂（`LoadingFactory`）
   */
  constructor(private _loadingFactory: LoadingFactory) {
    this.create({
      name: 'dui-loading-main',
    });
  }

  /**
   * Creates a directive-driven loading component (overlay or replace strategy, per `config.strategy`),
   * registered under `config.name`.
   * @zh 创建由指令驱动的加载组件（根据 `config.strategy` 采用覆盖层或原地替换策略），
   * 以 `config.name` 注册。
   */
  createComponent(
    config: ILoadingDirectiveConfig,
    viewContainerRef: ViewContainerRef,
    templateRef: TemplateRef<object>,
    context: LoadingContext
  ): ILoadingRef {
    const directiveConfig: LoadingDirectiveConfig =
      new LoadingDirectiveConfig(config);
    if (this._context[directiveConfig.name]) {
      throw Error(
        `Name duplication: [DuiLoading] directive has a name conflict with ${directiveConfig.name}.`
      );
    }
    if (directiveConfig.strategy === LoadingStrategy.Overlay) {
      this._context[directiveConfig.name] =
        this._loadingFactory.createOverlayComponent(
          directiveConfig,
          viewContainerRef,
          templateRef
        );
    } else {
      this._context[directiveConfig.name] =
        this._loadingFactory.createReplaceComponent(
          directiveConfig,
          viewContainerRef,
          templateRef,
          context
        );
    }
    return this._context[directiveConfig.name];
  }


  /**
   * Creates (or recreates) a full-screen loading component under the given name.
   * @zh 以指定名称创建（或重建）一个全屏加载组件。
   */
  public create(config: ILoadingConfig): void {
    const fullscreenConfig: LoadingConfig = new LoadingConfig(config);
    this.removeComponent(fullscreenConfig.name);
    this._context[fullscreenConfig.name] =
      this._loadingFactory.createFullScreenComponent(fullscreenConfig);
  }


  /**
   * Unsubscribes and destroys the named loading component.
   * @zh 取消订阅并销毁指定名称的加载组件。
   */
  public removeComponent(name: string): void {
    this._clearTimeout(name);
    if (this._context[name]) {
      this._context[name].times = 0;
      this._context[name].subject.next(0);
      if (this._context[name].overlayRef) {
        this._context[name].overlayRef?.dispose();
      }
      if (this._context[name].contentRef) {
        this._context[name].contentRef?.destroy();
      }
      // complete 而不是 unsubscribe：通知订阅方流已结束，随后删除上下文
      this._context[name].subject.complete();
      if (this._context[name].componentRef) {
        this._context[name].componentRef?.destroy();
      }
      delete this._context[name];
    }
  }


  /**
   * Increments the named loading indicator's pending-operation counter, showing it while
   * the counter is above zero. Retries via `setTimeout` if the component isn't created yet.
   * @zh 增加指定名称加载指示器的"待完成操作"计数器，计数大于零时显示指示器。
   * 若组件尚未创建，会通过 `setTimeout` 重试。
   */
  public register(
    name: string = 'dui-loading-main',
    registers: number = 1,
    blocking: boolean = false
  ): boolean {
    // try registering into the service if the loading component has been instanciated or if it exists.
    if (this._context[name]) {
      registers = registers < 1 ? 1 : registers;
      this._context[name].times += registers;
      // #1001：是否阻塞交互由调用方决定，缺省(false)为非阻塞——加载指示器仅作状态显示，
      // 用户在加载过程中仍可操作；仅当显式传入 blocking=true 时才锁定屏幕交互。
      this._context[name].blocking = blocking;
      this._context[name].subject.next(this._context[name].times);
      return true;
    } else {
      if (!this._timeouts[name]) {
        this._timeouts[name] = setTimeout(() => {
          this.register(name, registers, blocking);
        });
      } else {
        // if it timeout occured and still doesnt exist, it means the tiemout wasnt needed so we clear it.
        this._clearTimeout(name);
      }
    }
    return false;
  }


  /**
   * Decrements the named loading indicator's pending-operation counter, hiding it once
   * it reaches zero.
   * @zh 减少指定名称加载指示器的"待完成操作"计数器，计数归零时隐藏指示器。
   */
  public resolve(
    name: string = 'dui-loading-main',
    resolves: number = 1
  ): boolean {
    // clear timeout if the loading component is "resolved" before its "registered"
    this._clearTimeout(name);
    if (this._context[name]) {
      resolves = resolves < 1 ? 1 : resolves;
      if (this._context[name].times) {
        let times: number = this._context[name].times;
        times -= resolves;
        this._context[name].times = times < 0 ? 0 : times;
      }
      this._context[name].subject?.next(this._context[name].times);
      return true;
    }
    return false;
  }


  /**
   * Immediately resets the named loading indicator's pending-operation counter to zero, hiding it.
   * @zh 立即将指定名称加载指示器的"待完成操作"计数器归零并隐藏它。
   */
  public resolveAll(name: string = 'dui-loading-main'): boolean {
    // clear timeout if the loading component is "resolved" before its "registered"
    this._clearTimeout(name);
    if (this._context[name]) {
      this._context[name].times = 0;
      this._context[name].subject?.next(this._context[name].times);
      return true;
    }
    return false;
  }

  /**
   * Sets the named loading indicator's progress value (only takes effect in determinate mode
   * while it's currently shown).
   * @zh 设置指定名称加载指示器的进度值（仅在确定模式且当前正在显示时生效）。
   */
  public setValue(name: string, value: number): boolean {
    if (this._context[name]) {
      const instance: LoadingComponent =
        this._context[name].componentRef?.instance;
      if (instance.mode === LoadingMode.Determinate && instance.animation) {
        instance.value = value;
        return true;
      }
    }
    return false;
  }

  /**
   * Executes `_clearTimeout` to handle clear timeout.
   * @zh 执行 `_clearTimeout`，用于清空延时器。
   * @param name - name parameter (`string`) / 名称参数（`string`）
   */
  private _clearTimeout(name: string): void {
    clearTimeout(this._timeouts[name] as number);
    delete this._timeouts[name];
  }
}

/**
 * Executes `LOADING_PROVIDER_FACTORY` to handle loading provider factory.
 * @zh 执行 `LOADING_PROVIDER_FACTORY`，用于加载中提供者工厂。
 * @param parent - parent parameter (`LoadingService`) / 父级参数（`LoadingService`）
 * @param loadingFactory - loading factory parameter (`LoadingFactory`) / 加载中工厂参数（`LoadingFactory`）
 * @returns Result of type `LoadingService` / 类型为 `LoadingService` 的返回值
 */
export function LOADING_PROVIDER_FACTORY(
  parent: LoadingService,
  loadingFactory: LoadingFactory
): LoadingService {
  return parent || new LoadingService(loadingFactory);
}

/**
 * Constant/variable `LOADING_PROVIDER` defining loading provider in `src/common/loading/services`.
 * @zh 常量/变量 `LOADING_PROVIDER`，定义 `src/common/loading/services` 中的加载中提供者。
 */
export const LOADING_PROVIDER: Provider = {
  provide: LoadingService,
  deps: [[new Optional(), new SkipSelf(), LoadingService], LoadingFactory],
  useFactory: LOADING_PROVIDER_FACTORY,
};