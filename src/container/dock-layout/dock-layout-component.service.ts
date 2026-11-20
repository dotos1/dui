/**
 * @fileoverview Module `src/container/dock-layout/dock-layout-component.service.ts` providing dock layout component service definitions and implementation.
 * @zh 模块文件 `src/container/dock-layout/dock-layout-component.service.ts`，提供停靠面板布局组件服务相关的定义与实现。
 */

import {
  createComponent,
  EnvironmentInjector,
  Injectable,
  Injector,
  StaticProvider,
} from '@angular/core';
import { DockLayoutContainerInjectionToken } from './injection-tokens';
import { ComponentContainer } from './container/component-container';
import { Dui } from '@dotos1/dui/core';

/**
 * Injectable Angular service `DockLayoutComponentService` managing dock layout component service state and operations in `src/container/dock-layout`.
 * @zh 可注入的 Angular 服务 `DockLayoutComponentService`，管理 `src/container/dock-layout` 中的停靠面板布局组件服务状态与业务操作。
 */
@Injectable({
  providedIn: 'root',
})
export class DockLayoutComponentService {
  /**
   * Creates an instance of `DockLayoutComponentService` and initializes its dependencies and internal state.
   * @zh 创建 `DockLayoutComponentService` 实例，并初始化其依赖项与内部状态。
   * @param _envInjector - Injected or initial environment injector (`EnvironmentInjector`) / 注入或传入的环境注入器（`EnvironmentInjector`）
   */
  constructor(
    private _envInjector: EnvironmentInjector
  ) {}

  /**
   * Executes `createComponent` to handle create component.
   * @zh 执行 `createComponent`，用于创建组件。
   * @param config - config parameter (`any`) / 配置参数（`any`）
   * @param container - container parameter (`ComponentContainer`) / 容器参数（`ComponentContainer`）
   */
  createComponent(config, container: ComponentContainer) {
    if (config.rendered) {
      return config.reference;
    } else if(config.xtype){
      const factory = Dui.getComponentFactory(config.xtype);
      if (factory === undefined) {
        throw new Error(`Unknown component type of ${config}`);
      } else {
        const component = factory.componentType;
        const provider: StaticProvider = {
          provide: DockLayoutContainerInjectionToken,
          useValue: container,
        };
        const injector = Injector.create({
          providers: [provider],
          parent: this._envInjector,
        });
        const ref = createComponent(component, {
          environmentInjector: this._envInjector,
          elementInjector: injector,
        });
        // 与 Dui.create 一致：按 xtype 建的组件用其配置调一次 init。面板的 componentState 也一并传入（state 字段），
        // 这样面板组件不必依赖注入令牌就能拿到自己的内容
        const instance = ref.instance as { init?: (cfg: unknown) => void };
        if (typeof instance?.init === 'function') {
          instance.init({ ...config, state: container.initialState });
        }
        return ref;
      }
    }
  }
}
