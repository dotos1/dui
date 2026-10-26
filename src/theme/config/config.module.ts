/**
 * @fileoverview Module `src/theme/config/config.module.ts` providing config module definitions and implementation.
 * @zh 模块文件 `src/theme/config/config.module.ts`，提供配置模块相关的定义与实现。
 */

import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { DOTOS_CONFIG } from './config.service';
import { LocalStorageService } from '@dotos/dui/core/storage';

/**
 * Angular module `DotosConfigModule` declaring and exporting dotos config module components, directives, pipes, and providers.
 * @zh Angular 模块 `DotosConfigModule`，声明并导出DotOS配置模块相关的组件、指令、管道与服务提供者。
 */
@NgModule()
export class DotosConfigModule {
  /**
   * Creates an instance of `DotosConfigModule` and initializes its dependencies and internal state.
   * @zh 创建 `DotosConfigModule` 实例，并初始化其依赖项与内部状态。
   * @param parentModule - Injected or initial parent module (`DotosConfigModule`) / 注入或传入的父级模块（`DotosConfigModule`）
   */
  constructor(@Optional() @SkipSelf() parentModule: DotosConfigModule) {
    if (parentModule) {
      throw new Error('DotosModule is already loaded. Import it in the AppModule only!');
    }
  }
  /**
   * Executes `forRoot` to handle for root.
   * @zh 执行 `forRoot`，用于用于根节点。
   * @param config - config parameter (`any`) / 配置参数（`any`）
   * @returns Result of type `ModuleWithProviders<DotosConfigModule>` / 类型为 `ModuleWithProviders<DotosConfigModule>` 的返回值
   */
  static forRoot(config): ModuleWithProviders<DotosConfigModule> {
    return {
      ngModule: DotosConfigModule,
      providers: [
        LocalStorageService,
        {
          provide: 'LOCAL_STORAGE_SERVICE_CONFIG',
          useValue: {
            prefix: 'dotos',
            storageType: 'localStorage'
          }
        },
        {
          provide: DOTOS_CONFIG,
          useValue: config
        }
      ]
    };
  }
}
