/**
 * @fileoverview Module `src/ux/avatar/avatar-config.service.ts` providing avatar config service definitions and implementation.
 * @zh 模块文件 `src/ux/avatar/avatar-config.service.ts`，提供头像配置服务相关的定义与实现。
 */

import { Injectable, Inject, Optional } from '@angular/core';
import { AVATAR_CONFIG } from './avatar-config.token';
import { AvatarConfig } from './avatar-config';

/**
 * Injectable Angular service `AvatarConfigService` managing avatar config service state and operations in `src/ux/avatar`.
 * @zh 可注入的 Angular 服务 `AvatarConfigService`，管理 `src/ux/avatar` 中的头像配置服务状态与业务操作。
 */
@Injectable()
export class AvatarConfigService {
  /**
   * Creates an instance of `AvatarConfigService` and initializes its dependencies and internal state.
   * @zh 创建 `AvatarConfigService` 实例，并初始化其依赖项与内部状态。
   * @param userConfig - Injected or initial user config (`AvatarConfig`) / 注入或传入的用户配置（`AvatarConfig`）
   */
  constructor(
    @Optional()
    @Inject(AVATAR_CONFIG)
    public userConfig: AvatarConfig
  ) {}

  /**
   * Executes `getAvatarColors` to handle get avatar colors.
   * @zh 执行 `getAvatarColors`，用于获取头像颜色列表。
   * @param defaultColors - default colors parameter (`string[]`) / 默认颜色列表参数（`string[]`）
   * @returns Result of type `string[]` / 类型为 `string[]` 的返回值
   */
  public getAvatarColors(defaultColors: string[]): string[] {
    const colors = this.userConfig?.colors;
    return colors?.length ? colors : defaultColors;
  }
}
