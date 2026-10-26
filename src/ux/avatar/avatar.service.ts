/**
 * @fileoverview Module `src/ux/avatar/avatar.service.ts` providing avatar service definitions and implementation.
 * @zh 模块文件 `src/ux/avatar/avatar.service.ts`，提供头像服务相关的定义与实现。
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AvatarConfigService } from './avatar-config.service';
import { IAVatar } from './avatar.interface';

/**
 * Constant/variable `defaultColors` defining default colors in `src/ux/avatar`.
 * @zh 常量/变量 `defaultColors`，定义 `src/ux/avatar` 中的默认颜色列表。
 */
export const defaultColors = [
  '#1abc9c',
  '#3498db',
  '#f1c40f',
  '#8e44ad',
  '#e74c3c',
  '#d35400',
  '#2c3e50',
  '#7f8c8d'
];

/**
 * Provides utilities methods related to Avatar component

 * @zh 可注入的 Angular 服务 `AvatarService`，管理 `src/ux/avatar` 中的头像服务状态与业务操作。
 */
@Injectable()
export class AvatarService {
  /**
   * Property `avatarColors` (`string[]`) storing avatar colors (default: `defaultColors`).
   * @zh 属性 `avatarColors`（类型：`string[]`），用于存储或配置头像颜色列表（默认值：`defaultColors`）。
   */
  public avatarColors: string[] = defaultColors;

  /**
   * Property `failedSources` (`Map`) storing failed sources (default: `new Map<string, IAVatar>()`).
   * @zh 属性 `failedSources`（类型：`Map`），用于存储或配置失败源（默认值：`new Map<string, IAVatar>()`）。
   */
  private readonly failedSources = new Map<string, IAVatar>();

  /**
   * Creates an instance of `AvatarService` and initializes its dependencies and internal state.
   * @zh 创建 `AvatarService` 实例，并初始化其依赖项与内部状态。
   * @param http - Injected or initial http (`HttpClient`) / 注入或传入的HTTP（`HttpClient`）
   * @param avatarConfigService - Injected or initial avatar config service (`AvatarConfigService`) / 注入或传入的头像配置服务（`AvatarConfigService`）
   */
  constructor(
    private http: HttpClient,
    private avatarConfigService: AvatarConfigService
  ) {
    this.overrideAvatarColors();
  }

  /**
   * Executes `fetchAvatar` to handle fetch avatar.
   * @zh 执行 `fetchAvatar`，用于获取头像。
   * @param avatarUrl - avatar url parameter (`string`) / 头像链接地址参数（`string`）
   * @returns Result of type `Observable<unknown>` / 类型为 `Observable<unknown>` 的返回值
   */
  public fetchAvatar(avatarUrl: string): Observable<unknown> {
    return this.http.get(avatarUrl);
  }

  /**
   * Executes `getRandomColor` to handle get random color.
   * @zh 执行 `getRandomColor`，用于获取随机颜色。
   * @param avatarText - avatar text parameter (`string`) / 头像文本参数（`string`）
   * @returns Result of type `string` / 类型为 `string` 的返回值
   */
  public getRandomColor(avatarText: string): string {
    if (!avatarText) {
      return 'transparent';
    }
    const asciiCodeSum = this.calculateAsciiCode(avatarText);
    return this.avatarColors[asciiCodeSum % this.avatarColors.length];
  }

  /**
   * Executes `isTextAvatar` to handle is text avatar.
   * @zh 执行 `isTextAvatar`，用于是否为文本头像。
   * @param source - source parameter (`IAVatar`) / 源参数（`IAVatar`）
   * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
   */
  public isTextAvatar(source: IAVatar): boolean {
    return source.src==undefined;
  }

  /**
   * Executes `overrideAvatarColors` to handle override avatar colors.
   * @zh 执行 `overrideAvatarColors`，用于override头像颜色列表。
   */
  private overrideAvatarColors(): void {
    this.avatarColors = this.avatarConfigService.getAvatarColors(defaultColors);
  }

  /**
   * Executes `calculateAsciiCode` to handle calculate ascii code.
   * @zh 执行 `calculateAsciiCode`，用于计算Ascii编码。
   * @param value - value parameter (`string`) / 值参数（`string`）
   * @returns Result of type `number` / 类型为 `number` 的返回值
   */
  private calculateAsciiCode(value: string): number {
    return value
      .split('')
      .map(letter => letter.charCodeAt(0))
      .reduce((previous, current) => previous + current);
  }
}
