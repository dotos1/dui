/**
 * @fileoverview Module `src/form/daterangepicker/locale.service.ts` providing locale service definitions and implementation.
 * @zh 模块文件 `src/form/daterangepicker/locale.service.ts`，提供语言区域服务相关的定义与实现。
 */

import { Injectable, Inject } from '@angular/core';
import { LOCALE_CONFIG, DefaultLocaleConfig, LocaleConfig } from './daterangepicker.config';

/**
 * Injectable Angular service `LocaleService` managing locale service state and operations in `src/form/daterangepicker`.
 * @zh 可注入的 Angular 服务 `LocaleService`，管理 `src/form/daterangepicker` 中的语言区域服务状态与业务操作。
 */
@Injectable()
export class LocaleService {
  /**
   * Creates an instance of `LocaleService` and initializes its dependencies and internal state.
   * @zh 创建 `LocaleService` 实例，并初始化其依赖项与内部状态。
   * @param configHolder - Injected or initial config holder (`LocaleConfig`) / 注入或传入的配置Holder（`LocaleConfig`）
   */
  constructor(@Inject(LOCALE_CONFIG) private configHolder: LocaleConfig) {}

  /**
   * Gets the current config (`config: any`).
   * @zh 获取当前配置（`config: any`）。
   */
  get config() {
    if (!this.configHolder) {
      return DefaultLocaleConfig;
    }
    return { ...DefaultLocaleConfig, ...this.configHolder };
  }

  /**
   * Executes `configWithLocale` to handle config with locale.
   * @zh 执行 `configWithLocale`，用于配置带有语言区域。
   * @param locale - locale parameter (`any`) / 语言区域参数（`any`）
   */
  configWithLocale(locale) {
    if (!this.configHolder && !locale) {
      return DefaultLocaleConfig;
    }
    return {
      ...DefaultLocaleConfig,
      ...{ daysOfWeek: locale.weekdaysMin, monthNames: locale.monthsShort, firstDay: locale.weekStart },
      ...this.configHolder
    };
  }
}
