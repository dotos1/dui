/**
 * @fileoverview Module `src/common/toastr/toastr/toast.provider.ts` providing toast provider definitions and implementation.
 * @zh 模块文件 `src/common/toastr/toastr/toast.provider.ts`，提供toast提供者相关的定义与实现。
 */

import { DefaultNoComponentGlobalConfig, GlobalConfig, TOAST_CONFIG } from './toastr-config';
import { EnvironmentProviders, makeEnvironmentProviders, Provider } from '@angular/core';
import { Toast } from './toast.component';

/**
 * Constant/variable `DefaultGlobalConfig` defining default global config in `src/common/toastr/toastr`.
 * @zh 常量/变量 `DefaultGlobalConfig`，定义 `src/common/toastr/toastr` 中的默认全局配置。
 */
export const DefaultGlobalConfig: GlobalConfig = {
  ...DefaultNoComponentGlobalConfig,
  toastComponent: Toast,
};

/**
 * Constant/variable `provideToastr` defining provide toastr in `src/common/toastr/toastr`.
 * @zh 常量/变量 `provideToastr`，定义 `src/common/toastr/toastr` 中的提供轻提示。
 */
export const provideToastr = (config: Partial<GlobalConfig> = {}): EnvironmentProviders => {
  const providers: Provider[] = [
    {
      provide: TOAST_CONFIG,
      useValue: {
        default: DefaultGlobalConfig,
        config,
      }
    }
  ];

  return makeEnvironmentProviders(providers);
};
