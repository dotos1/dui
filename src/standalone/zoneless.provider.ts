/**
 * @fileoverview Module `src/standalone/zoneless.provider.ts` providing `provideDuiZoneless` helper for Angular 22 Zoneless applications.
 * @zh 模块文件 `src/standalone/zoneless.provider.ts`，提供面向 Angular 22 纯 Zoneless 应用的 `provideDuiZoneless` 环境提供者辅助函数。
 */

import {
  EnvironmentProviders,
  makeEnvironmentProviders,
  provideZonelessChangeDetection,
} from '@angular/core';

/**
 * Provides Angular 22 Zoneless change detection environment providers for `@dotos/dui/standalone`.
 * @zh 为基于 `@dotos/dui/standalone` 的现代应用注册零 `Zone.js`（Zoneless）变更检测环境提供者。
 * @returns Zoneless environment providers (`EnvironmentProviders`) / Zoneless 环境提供者集合（`EnvironmentProviders`）
 */
export function provideDuiZoneless(): EnvironmentProviders {
  return makeEnvironmentProviders([provideZonelessChangeDetection()]);
}
