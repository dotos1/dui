/**
 * @fileoverview Module `src/form/daterangepicker/daterangepicker.config.ts` providing daterangepicker config definitions and implementation.
 * @zh 模块文件 `src/form/daterangepicker/daterangepicker.config.ts`，提供daterangepicker配置相关的定义与实现。
 */

import { InjectionToken } from '@angular/core';
import dayjs from 'dayjs/esm';
import localeData from 'dayjs/esm/plugin/localeData';
dayjs.extend(localeData);

/**
 * Angular dependency-injection token `LOCALE_CONFIG` for providing locale config.
 * @zh Angular 依赖注入令牌 `LOCALE_CONFIG`，用于提供与注入语言区域配置。
 */
export const LOCALE_CONFIG = new InjectionToken<LocaleConfig>('daterangepicker.config');

/**
 * Interface `LocaleConfig` defining the contract and properties for locale config.
 * @zh 接口 `LocaleConfig`，定义语言区域配置的数据结构契约与属性规范。
 */
export interface LocaleConfig {
  /**
   * Property `direction` (`string`) storing direction.
   * @zh 属性 `direction`（类型：`string`），用于存储或配置方向。
   */
  direction?: string;
  /**
   * Property `separator` (`string`) storing separator.
   * @zh 属性 `separator`（类型：`string`），用于存储或配置separator。
   */
  separator?: string;
  /**
   * Property `weekLabel` (`string`) storing week label.
   * @zh 属性 `weekLabel`（类型：`string`），用于存储或配置周标签。
   */
  weekLabel?: string;
  /**
   * Property `applyLabel` (`string`) storing apply label.
   * @zh 属性 `applyLabel`（类型：`string`），用于存储或配置应用标签。
   */
  applyLabel?: string;
  /**
   * Property `cancelLabel` (`string`) storing cancel label.
   * @zh 属性 `cancelLabel`（类型：`string`），用于存储或配置取消标签。
   */
  cancelLabel?: string;
  /**
   * Property `clearLabel` (`string`) storing clear label.
   * @zh 属性 `clearLabel`（类型：`string`），用于存储或配置清空标签。
   */
  clearLabel?: string;
  /**
   * Property `customRangeLabel` (`string`) storing custom range label.
   * @zh 属性 `customRangeLabel`（类型：`string`），用于存储或配置自定义范围标签。
   */
  customRangeLabel?: string;
  /**
   * Property `daysOfWeek` (`string[]`) storing days of week.
   * @zh 属性 `daysOfWeek`（类型：`string[]`），用于存储或配置天数的周。
   */
  daysOfWeek?: string[];
  /**
   * Property `monthNames` (`string[]`) storing month names.
   * @zh 属性 `monthNames`（类型：`string[]`），用于存储或配置月名称列表。
   */
  monthNames?: string[];
  /**
   * Property `firstDay` (`number`) storing first day.
   * @zh 属性 `firstDay`（类型：`number`），用于存储或配置首个日。
   */
  firstDay?: number;
  /**
   * Property `format` (`string`) storing format.
   * @zh 属性 `format`（类型：`string`），用于存储或配置格式化。
   */
  format?: string;
  /**
   * Property `displayFormat` (`string`) storing display format.
   * @zh 属性 `displayFormat`（类型：`string`），用于存储或配置display格式化。
   */
  displayFormat?: string;
  /**
   * Property `locale` (`any`) storing locale.
   * @zh 属性 `locale`（类型：`any`），用于存储或配置语言区域。
   */
  locale?;
}
/**
 *  DefaultLocaleConfig

 * @zh 常量/变量 `DefaultLocaleConfig`，定义 `src/form/daterangepicker` 中的默认语言区域配置。
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export const DefaultLocaleConfig: LocaleConfig = {
  direction: 'ltr',
  separator: ' - ',
  weekLabel: 'W',
  applyLabel: 'Apply',
  cancelLabel: 'Cancel',
  clearLabel: 'Clear',
  customRangeLabel: 'Custom range',
  daysOfWeek: dayjs.weekdaysMin(),
  monthNames: dayjs.monthsShort(),
  firstDay: dayjs.localeData().firstDayOfWeek()
};
