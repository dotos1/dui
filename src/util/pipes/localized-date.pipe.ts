/**
 * @fileoverview Module `src/util/pipes/localized-date.pipe.ts` providing localized date pipe definitions and implementation.
 * @zh 模块文件 `src/util/pipes/localized-date.pipe.ts`，提供localized日期管道相关的定义与实现。
 */



import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import { TranslationService } from '@dotos1/dui/translator';
/**
 * Angular pipe `LocalizedDatePipe` (name: 'LocalizedDate') transforming values for localized date pipe display in templates.
 * @zh Angular 管道 `LocalizedDatePipe`（name: 'LocalizedDate'），在模板中转换数据以用于Localized日期管道展示。
 */
@Pipe({
  name: 'LocalizedDate',
  pure: false,
  standalone: false
})
export class LocalizedDatePipe implements PipeTransform {

  /**
   * Property `DEFAULT_DATE_FORMAT` (`string`) storing default date format (default: `'mediumDate'`).
   * @zh 属性 `DEFAULT_DATE_FORMAT`（类型：`string`），用于存储或配置默认日期格式化（默认值：`'mediumDate'`）。
   */
  static DEFAULT_DATE_FORMAT = 'mediumDate';
  /**
   * Property `defaultFormat` (`string`) storing default format (default: `LocalizedDatePipe.DEFAULT_DATE_FORMAT`).
   * @zh 属性 `defaultFormat`（类型：`string`），用于存储或配置默认格式化（默认值：`LocalizedDatePipe.DEFAULT_DATE_FORMAT`）。
   */
  defaultFormat: string = LocalizedDatePipe.DEFAULT_DATE_FORMAT;

  /**
   * Property `cachedPipe` (`DatePipe`) storing cached pipe.
   * @zh 属性 `cachedPipe`（类型：`DatePipe`），用于存储或配置已缓存管道。
   */
  private cachedPipe?: DatePipe;
  /**
   * Property `cachedLocale` (`string`) storing cached locale.
   * @zh 属性 `cachedLocale`（类型：`string`），用于存储或配置已缓存语言区域。
   */
  private cachedLocale?: string;

  /**
   * Creates an instance of `LocalizedDatePipe` and initializes its dependencies and internal state.
   * @zh 创建 `LocalizedDatePipe` 实例，并初始化其依赖项与内部状态。
   * @param translateService - Injected or initial translate service (`TranslationService`) / 注入或传入的翻译服务（`TranslationService`）
   */
  constructor(private translateService: TranslationService) {
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  /**
   * Executes `transform` to handle transform.
   * @zh 执行 `transform`，用于转换。
   * @param value - value parameter (`any`) / 值参数（`any`）
   * @param format - format parameter (`string`) / 格式化参数（`string`）
   * @param locale - locale parameter (`string`) / 语言区域参数（`string`）
   * @returns Result of type `string` / 类型为 `string` 的返回值
   */
  transform(value, format?: string, locale?: string) {
    const actualFormat = format || this.defaultFormat;
    const actualLocale = (locale || this.translateService.userLang || 'en-US').replace('_', '-');
    if (!this.cachedPipe || this.cachedLocale !== actualLocale) {
      this.cachedLocale = actualLocale;
      this.cachedPipe = new DatePipe(actualLocale);
    }
    return this.cachedPipe.transform(value, actualFormat);
  }
}
