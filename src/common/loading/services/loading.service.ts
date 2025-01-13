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

@Injectable()
export class LoadingService {
  private _context: { [key: string]: ILoadingRef } = {};
  private _timeouts: { [key: string]: any } = {};

  constructor(private _loadingFactory: LoadingFactory) {
    this.create({
      name: 'dui-loading-main',
    });
  }

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


  public create(config: ILoadingConfig): void {
    const fullscreenConfig: LoadingConfig = new LoadingConfig(config);
    this.removeComponent(fullscreenConfig.name);
    this._context[fullscreenConfig.name] =
      this._loadingFactory.createFullScreenComponent(fullscreenConfig);
  }


  public removeComponent(name: string): void {
    if (this._context[name]) {
      this._context[name].subject.unsubscribe();
      if (this._context[name].componentRef) {
        this._context[name].componentRef?.destroy();
      }
      delete this._context[name];
    }
  }


  public register(
    name: string = 'dui-loading-main',
    registers: number = 1
  ): boolean {
    // try registering into the service if the loading component has been instanciated or if it exists.
    if (this._context[name]) {
      registers = registers < 1 ? 1 : registers;
      this._context[name].times += registers;
      this._context[name].subject.next(this._context[name].times);
      return true;
    } else {
      if (!this._timeouts[name]) {
        this._timeouts[name] = setTimeout(() => {
          this.register(name, registers);
        });
      } else {
        // if it timeout occured and still doesnt exist, it means the tiemout wasnt needed so we clear it.
        this._clearTimeout(name);
      }
    }
    return false;
  }


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