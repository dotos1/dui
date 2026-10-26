/**
 * @fileoverview Module `src/common/dragselect/tokens.ts` providing tokens definitions and implementation.
 * @zh 模块文件 `src/common/dragselect/tokens.ts`，提供设计令牌相关的定义与实现。
 */

import { InjectionToken } from '@angular/core';
import { DragToSelectConfig } from './models';

/**
 * Angular dependency-injection token `CONFIG` for providing config.
 * @zh Angular 依赖注入令牌 `CONFIG`，用于提供与注入配置。
 */
export const CONFIG = new InjectionToken<DragToSelectConfig>('DRAG_TO_SELECT_CONFIG');
/**
 * Angular dependency-injection token `USER_CONFIG` for providing user config.
 * @zh Angular 依赖注入令牌 `USER_CONFIG`，用于提供与注入用户配置。
 */
export const USER_CONFIG = new InjectionToken<DragToSelectConfig>('USER_CONFIG');
