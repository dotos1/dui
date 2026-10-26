/**
 * @fileoverview Module `src/ui/context-menu/direction.token.ts` providing direction token definitions and implementation.
 * @zh 模块文件 `src/ui/context-menu/direction.token.ts`，提供方向令牌相关的定义与实现。
 */


import { InjectionToken } from '@angular/core';

/**
 * Angular dependency-injection token `CONTEXT_MENU_DIRECTION` for providing context menu direction.
 * @zh Angular 依赖注入令牌 `CONTEXT_MENU_DIRECTION`，用于提供与注入上下文菜单方向。
 */
export const CONTEXT_MENU_DIRECTION = new InjectionToken(
  'CONTEXT_MENU_DIRECTION',
  {
    providedIn: 'root',
    factory: () => 'ltr'
  }
);
