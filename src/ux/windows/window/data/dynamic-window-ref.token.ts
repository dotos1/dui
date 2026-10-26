/**
 * @fileoverview Module `src/ux/windows/window/data/dynamic-window-ref.token.ts` providing dynamic window ref token definitions and implementation.
 * @zh 模块文件 `src/ux/windows/window/data/dynamic-window-ref.token.ts`，提供动态窗口引用令牌相关的定义与实现。
 */

import { InjectionToken } from '@angular/core';
import { DynamicWindowRef } from '../interfaces';

/**
 * An injection token that can be used to get window reference inside your component
 * @zh Angular 依赖注入令牌 `DYNAMIC_WINDOW_REF`，用于提供与注入动态窗口引用。
 */
export const DYNAMIC_WINDOW_REF: InjectionToken<DynamicWindowRef> = new InjectionToken(
    'DYNAMIC_WINDOW_REF'
);
