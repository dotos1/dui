/**
 * @fileoverview Module `src/core/meta/public-api.ts` providing public api definitions and implementation.
 * @zh 模块文件 `src/core/meta/public-api.ts`，提供publicAPI接口相关的定义与实现。
 */

// angular
import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';

// module
import { MetaGuard } from './meta.guard';
import { MetaLoader, MetaStaticLoader } from './meta.loader';
import { MetaService } from './meta.service';

export * from './models/meta-settings';
export * from './models/page-title-positioning';
export * from './meta.guard';
export * from './meta.loader';
export * from './meta.service';

// for AoT compilation
/**
 * Executes `metaFactory` to handle meta factory.
 * @zh 执行 `metaFactory`，用于元数据工厂。
 * @returns Result of type `MetaLoader` / 类型为 `MetaLoader` 的返回值
 */
export function metaFactory(): MetaLoader {
  return new MetaStaticLoader();
}

/**
 * Angular module `MetaModule` declaring and exporting meta module components, directives, pipes, and providers.
 * @zh Angular 模块 `MetaModule`，声明并导出元数据模块相关的组件、指令、管道与服务提供者。
 */
@NgModule()
export class MetaModule {
  /**
   * Executes `forRoot` to handle for root.
   * @zh 执行 `forRoot`，用于用于根节点。
   * @param configuredProvider - configured provider parameter (`any`) / configured提供者参数（`any`）
   * @returns Result of type `ModuleWithProviders<MetaModule>` / 类型为 `ModuleWithProviders<MetaModule>` 的返回值
   */
  static forRoot(configuredProvider = {
    provide: MetaLoader,
    useFactory: (metaFactory)
  }): ModuleWithProviders<MetaModule> {
    return {
      ngModule: MetaModule,
      providers: [
        configuredProvider,
        MetaGuard,
        MetaService
      ]
    };
  }

  /**
   * Creates an instance of `MetaModule` and initializes its dependencies and internal state.
   * @zh 创建 `MetaModule` 实例，并初始化其依赖项与内部状态。
   * @param parentModule - Injected or initial parent module (`MetaModule`) / 注入或传入的父级模块（`MetaModule`）
   */
  constructor(@Optional() @SkipSelf() parentModule: MetaModule) {
    if (parentModule)
      throw new Error('MetaModule already loaded; import in root module only.');
  }
}
