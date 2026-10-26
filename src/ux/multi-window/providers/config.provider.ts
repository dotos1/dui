/**
 * @fileoverview Module `src/ux/multi-window/providers/config.provider.ts` providing config provider definitions and implementation.
 * @zh 模块文件 `src/ux/multi-window/providers/config.provider.ts`，提供配置提供者相关的定义与实现。
 */

import { InjectionToken } from '@angular/core';
import { MultiWindowConfig } from '../types/multi-window.config';
import { WindowSaveStrategy } from '../types/window-save-strategy.enum';

/**
 * Angular dependency-injection token `NGXMW_CONFIG` for providing ngxmw config.
 * @zh Angular 依赖注入令牌 `NGXMW_CONFIG`，用于提供与注入NGXMW配置。
 */
export const NGXMW_CONFIG = new InjectionToken<MultiWindowConfig>('dotosmw_config');
/**
 * Constant/variable `defaultMultiWindowConfig` defining default multi window config in `src/ux/multi-window/providers`.
 * @zh 常量/变量 `defaultMultiWindowConfig`，定义 `src/ux/multi-window/providers` 中的默认多窗口配置。
 */
export const defaultMultiWindowConfig: MultiWindowConfig = {
  keyPrefix: 'dotos_',
  heartbeat: 500,
  newWindowScan: 5000,
  messageTimeout: 5000,
  windowTimeout: 15000,
  windowSaveStrategy: WindowSaveStrategy.SAVE_FORCE,
};
