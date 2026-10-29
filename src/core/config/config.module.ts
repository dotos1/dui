/**
 * @fileoverview Module `src/core/config/config.module.ts` providing config module definitions and implementation.
 * @zh 模块文件 `src/core/config/config.module.ts`，提供配置模块相关的定义与实现。
 */


import { APP_INITIALIZER, Inject, InjectionToken, ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ConfigLoader, ConfigStaticLoader } from './config.loader';
import { ConfigPipe } from './config.pipe';
import { ConfigService } from './config.service';
import { FeatureDirective } from './feature.directive';


/**
 * Constant/variable `configFactory` defining config factory in `src/core/config`.
 * @zh 常量/变量 `configFactory`，定义 `src/core/config` 中的配置工厂。
 */
export const configFactory = () =>{ 
  return new ConfigStaticLoader()
};

/**
 * Constant/variable `initializerFactory` defining initializer factory in `src/core/config`.
 * @zh 常量/变量 `initializerFactory`，定义 `src/core/config` 中的initializer工厂。
 */
export const initializerFactory = (config: ConfigService) => {
  const res = () => config.init();
  return res;
};

/**
 * Angular dependency-injection token `CONFIG_FORROOT_GUARD` for providing config forroot guard.
 * @zh Angular 依赖注入令牌 `CONFIG_FORROOT_GUARD`，用于提供与注入配置FORROOT路由守卫。
 */
export const CONFIG_FORROOT_GUARD = new InjectionToken('CONFIG_FORROOT_GUARD');

/**
 * Executes `provideForRootGuard` to handle provide for root guard.
 * @zh 执行 `provideForRootGuard`，用于提供用于根节点路由守卫。
 * @param config - config parameter (`ConfigService`) / 配置参数（`ConfigService`）
 * @returns Result of type `string` / 类型为 `string` 的返回值
 */
export function provideForRootGuard(config?: ConfigService) {
  if (config) {
    throw new Error(`ConfigModule.forRoot() called twice. Lazy loaded modules should use ConfigModule.forChild() instead.`);
  }
  return 'guarded';
}
/**
 * Angular module `ConfigModule` declaring and exporting config module components, directives, pipes, and providers.
 * @zh Angular 模块 `ConfigModule`，声明并导出配置模块相关的组件、指令、管道与服务提供者。
 */
@NgModule({
  imports: [
    CommonModule,
    MatProgressSpinnerModule
  ],
  declarations: [ConfigPipe, FeatureDirective],
  exports: [ConfigPipe, FeatureDirective]
})
export class ConfigModule {
  /**
   * Executes `forRoot` to handle for root.
   * @zh 执行 `forRoot`，用于用于根节点。
   * @param configuredProvider - configured provider parameter (`{ provide: typeof ConfigLoader; useFactory: () => ConfigStaticLoader; }`) / configured提供者参数（`{ provide: typeof ConfigLoader; useFactory: () => ConfigStaticLoader; }`）
   * @returns Result of type `ModuleWithProviders<ConfigModule>` / 类型为 `ModuleWithProviders<ConfigModule>` 的返回值
   */
  static forRoot(
    configuredProvider = {
      provide: ConfigLoader,
      useFactory: configFactory
    }
  ): ModuleWithProviders<ConfigModule> {
    return {
      ngModule: ConfigModule,
      providers: [
        configuredProvider,
        ConfigService,
        {
          provide: APP_INITIALIZER,
          useFactory: initializerFactory,
          deps: [ConfigService],
          multi: true
        },
        {
          provide: CONFIG_FORROOT_GUARD,
          useFactory: provideForRootGuard,
          deps: [[ConfigService, new Optional(), new SkipSelf()]]
        }
      ]
    };
  }
  /**
   * Executes `forChild` to handle for child.
   * @zh 执行 `forChild`，用于用于子级。
   * @returns Result of type `ModuleWithProviders<ConfigModule>` / 类型为 `ModuleWithProviders<ConfigModule>` 的返回值
   */
  static forChild(): ModuleWithProviders<ConfigModule> {
    return {
      ngModule: ConfigModule
    };
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  /**
   * Creates an instance of `ConfigModule` and initializes its dependencies and internal state.
   * @zh 创建 `ConfigModule` 实例，并初始化其依赖项与内部状态。
   * @param guard - Injected or initial guard (`any`) / 注入或传入的路由守卫（`any`）
   */
  constructor(@Optional() @Inject(CONFIG_FORROOT_GUARD) guard) {}
}
