/**
 * @fileoverview Module `src/core/storage/local-storage.module.ts` providing local storage module definitions and implementation.
 * @zh 模块文件 `src/core/storage/local-storage.module.ts`，提供本地存储模块相关的定义与实现。
 */

import { ModuleWithProviders, NgModule } from '@angular/core';

import { LocalStorageService } from './local-storage.service';
import { ILocalStorageServiceConfig } from './local-storage.config.interface';

/**
 * Angular module `LocalStorageModule` declaring and exporting local storage module components, directives, pipes, and providers.
 * @zh Angular 模块 `LocalStorageModule`，声明并导出本地存储模块相关的组件、指令、管道与服务提供者。
 */
@NgModule({
    providers: [
        LocalStorageService
    ]
})
export class LocalStorageModule {
    /**
     * Executes `withConfig` to handle with config.
     * @zh 执行 `withConfig`，用于带有配置。
     * @param userConfig - user config parameter (`ILocalStorageServiceConfig`) / 用户配置参数（`ILocalStorageServiceConfig`）
     * @returns Result of type `ModuleWithProviders<LocalStorageModule>` / 类型为 `ModuleWithProviders<LocalStorageModule>` 的返回值
     */
    static withConfig(userConfig: ILocalStorageServiceConfig = {}): ModuleWithProviders<LocalStorageModule> {
        return {
            ngModule: LocalStorageModule,
            providers: [
                { provide: 'LOCAL_STORAGE_SERVICE_CONFIG', useValue: userConfig }
            ]
        };
    }
}
