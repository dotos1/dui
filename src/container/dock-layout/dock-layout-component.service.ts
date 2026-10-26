/**
 * @fileoverview Module `src/container/dock-layout/dock-layout-component.service.ts` providing dock layout component service definitions and implementation.
 * @zh 模块文件 `src/container/dock-layout/dock-layout-component.service.ts`，提供停靠面板布局组件服务相关的定义与实现。
 */

import {
  ComponentFactoryResolver,
  Injectable,
  Injector,
  StaticProvider,
} from '@angular/core';
import { DockLayoutContainerInjectionToken } from './injection-tokens';
import { ComponentContainer } from './container/component-container';
import { Dui } from '@dotos/dui/core';

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
   * @param _componentFactoryResolver - Injected or initial component factory resolver (`ComponentFactoryResolver`) / 注入或传入的组件工厂解析器（`ComponentFactoryResolver`）
   */
  constructor(
    private _componentFactoryResolver: ComponentFactoryResolver
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
        });
        const componentFactoryRef =
          this._componentFactoryResolver.resolveComponentFactory(
            component
          );
        return componentFactoryRef.create(injector);
      }
    }
  }
}
