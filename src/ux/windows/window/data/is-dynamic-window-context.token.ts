/**
 * @fileoverview Module `src/ux/windows/window/data/is-dynamic-window-context.token.ts` providing is dynamic window context token definitions and implementation.
 * @zh 模块文件 `src/ux/windows/window/data/is-dynamic-window-context.token.ts`，提供是否为动态窗口上下文令牌相关的定义与实现。
 */

import { InjectionToken } from '@angular/core';


/**
 * Angular dependency-injection token `IS_DYNAMIC_WINDOW_CONTEXT` for providing is dynamic window context.
 * @zh Angular 依赖注入令牌 `IS_DYNAMIC_WINDOW_CONTEXT`，用于提供与注入是否为动态窗口上下文。
 */
export const IS_DYNAMIC_WINDOW_CONTEXT: InjectionToken<boolean> = new InjectionToken(
    'IS_DYNAMIC_WINDOW_CONTEXT',
    { providedIn: 'root', factory: () => false }
);
