/**
 * @fileoverview Module `src/ux/windows/window/data/dynamic-window-shared-config.provider.ts` providing dynamic window shared config provider definitions and implementation.
 * @zh 模块文件 `src/ux/windows/window/data/dynamic-window-shared-config.provider.ts`，提供动态窗口共享配置提供者相关的定义与实现。
 */

import { Provider } from '@angular/core';
import { DynamicWindowSharedConfigService } from '../services/shared-config.service';
import { DYNAMIC_WINDOW_SHARED_CONFIG } from './shared-dynamic-window-config.token';

/**
 * Constant/variable `ɵDYNAMIC_WINDOW_SHARED_CONFIG_PROVIDER` defining ɵdynamic window shared config provider in `src/ux/windows/window/data`.
 * @internal
 * @zh 常量/变量 `ɵDYNAMIC_WINDOW_SHARED_CONFIG_PROVIDER`，定义 `src/ux/windows/window/data` 中的ɵDYNAMIC窗口共享配置提供者。
 */
export const ɵDYNAMIC_WINDOW_SHARED_CONFIG_PROVIDER: Provider = {
    provide: DYNAMIC_WINDOW_SHARED_CONFIG,
    useFactory: (service: DynamicWindowSharedConfigService) => service.data$,
    deps: [DynamicWindowSharedConfigService]
};
