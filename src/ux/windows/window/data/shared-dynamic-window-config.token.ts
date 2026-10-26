/**
 * @fileoverview Module `src/ux/windows/window/data/shared-dynamic-window-config.token.ts` providing shared dynamic window config token definitions and implementation.
 * @zh 模块文件 `src/ux/windows/window/data/shared-dynamic-window-config.token.ts`，提供共享动态窗口配置令牌相关的定义与实现。
 */

import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { DynamicWindowConfig } from '../interfaces';

/**
 * An injection token that can be used to get shared config of dynamic windows
 * @zh Angular 依赖注入令牌 `DYNAMIC_WINDOW_SHARED_CONFIG`，用于提供与注入动态窗口共享配置。
 */
export const DYNAMIC_WINDOW_SHARED_CONFIG:
    InjectionToken<Observable<DynamicWindowConfig>> =
    new InjectionToken('DYNAMIC_WINDOW_SHARED_CONFIG');
