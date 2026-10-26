/**
 * @fileoverview Module `src/ux/avatar/avatar-config.token.ts` providing avatar config token definitions and implementation.
 * @zh 模块文件 `src/ux/avatar/avatar-config.token.ts`，提供头像配置令牌相关的定义与实现。
 */

import { InjectionToken } from '@angular/core';

import { AvatarConfig } from './avatar-config';

/**
 * Angular dependency-injection token `AVATAR_CONFIG` for providing avatar config.
 * @zh Angular 依赖注入令牌 `AVATAR_CONFIG`，用于提供与注入头像配置。
 */
export const AVATAR_CONFIG = new InjectionToken<AvatarConfig>('avatar.config');
