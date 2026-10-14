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

export interface ILoadingConfig {
  name: string;
  type?: LoadingType;
  mode?: LoadingMode;
  color?: 'primary' | 'accent' | 'warn';
}

export class LoadingConfig implements ILoadingConfig {
  name: string;
  type?: LoadingType;
  mode?: LoadingMode;
  color?: 'primary' | 'accent' | 'warn';

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

export interface ILoadingDirectiveConfig extends ILoadingConfig {
  strategy?: LoadingStrategy;
}

export class LoadingDirectiveConfig
  extends LoadingConfig
  implements ILoadingDirectiveConfig
{
  strategy: LoadingStrategy;

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
  private _context: { [key: string]: ILoadingRef } = {};
  private _timeouts: { [key: string]: any } = {};

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
      this._context[name].subject.unsubscribe();
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

  private _clearTimeout(name: string): void {
    clearTimeout(this._timeouts[name]);
    delete this._timeouts[name];
  }
}

export function LOADING_PROVIDER_FACTORY(
  parent: LoadingService,
  loadingFactory: LoadingFactory
): LoadingService {
  return parent || new LoadingService(loadingFactory);
}

export const LOADING_PROVIDER: Provider = {
  provide: LoadingService,
  deps: [[new Optional(), new SkipSelf(), LoadingService], LoadingFactory],
  useFactory: LOADING_PROVIDER_FACTORY,
};