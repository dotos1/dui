/**
 * @fileoverview Module `src/common/toastr/toastr/toastr.module.ts` providing toastr module definitions and implementation.
 * @zh 模块文件 `src/common/toastr/toastr/toastr.module.ts`，提供轻提示模块相关的定义与实现。
 */

import { ModuleWithProviders, NgModule } from '@angular/core';

import { Toast } from './toast.component';
import { DefaultNoComponentGlobalConfig, GlobalConfig, TOAST_CONFIG } from './toastr-config';
import { provideToastr } from './toast.provider';
import { CommonModule } from '@angular/common';
import { MatSnackBarModule } from '@angular/material/snack-bar';


/**
 * Angular module `ToastrModule` declaring and exporting toastr module components, directives, pipes, and providers.
 * @zh Angular 模块 `ToastrModule`，声明并导出轻提示模块相关的组件、指令、管道与服务提供者。
 */
@NgModule({
  imports: [
    CommonModule,
    MatSnackBarModule
  ],
  declarations: [Toast],
  exports: [Toast],
})
export class ToastrModule {
  /**
   * Executes `forRoot` to handle for root.
   * @zh 执行 `forRoot`，用于用于根节点。
   * @param config - config parameter (`Partial<GlobalConfig>`) / 配置参数（`Partial<GlobalConfig>`）
   * @returns Result of type `ModuleWithProviders<ToastrModule>` / 类型为 `ModuleWithProviders<ToastrModule>` 的返回值
   */
  static forRoot(config: Partial<GlobalConfig> = {}): ModuleWithProviders<ToastrModule> {
    return {
      ngModule: ToastrModule,
      providers: [provideToastr(config)],
    };
  }
}

/**
 * Angular module `ToastrComponentlessModule` declaring and exporting toastr componentless module components, directives, pipes, and providers.
 * @zh Angular 模块 `ToastrComponentlessModule`，声明并导出轻提示Componentless模块相关的组件、指令、管道与服务提供者。
 */
@NgModule({})
export class ToastrComponentlessModule {
  /**
   * Executes `forRoot` to handle for root.
   * @zh 执行 `forRoot`，用于用于根节点。
   * @param config - config parameter (`Partial<GlobalConfig>`) / 配置参数（`Partial<GlobalConfig>`）
   * @returns Result of type `ModuleWithProviders<ToastrModule>` / 类型为 `ModuleWithProviders<ToastrModule>` 的返回值
   */
  static forRoot(config: Partial<GlobalConfig> = {}): ModuleWithProviders<ToastrModule> {
    return {
      ngModule: ToastrModule,
      providers: [
        {
          provide: TOAST_CONFIG,
          useValue: {
            default: DefaultNoComponentGlobalConfig,
            config,
          },
        },
      ],
    };
  }
}
