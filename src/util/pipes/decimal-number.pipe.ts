/**
 * @fileoverview Module `src/util/pipes/decimal-number.pipe.ts` providing decimal number pipe definitions and implementation.
 * @zh 模块文件 `src/util/pipes/decimal-number.pipe.ts`，提供decimal数字管道相关的定义与实现。
 */



import { DecimalPipe } from '@angular/common';
import { Pipe, PipeTransform, OnDestroy } from '@angular/core';
import { ConfigService } from '@dotos/dui/core/config';
import { DecimalNumberModel } from '@dotos/dui/util';
import { Subject } from 'rxjs';

/**
 * Angular pipe `DecimalNumberPipe` (name: 'DecimalNumber') transforming values for decimal number pipe display in templates.
 * @zh Angular 管道 `DecimalNumberPipe`（name: 'DecimalNumber'），在模板中转换数据以用于Decimal数字管道展示。
 */
@Pipe({
  name: 'DecimalNumber',
  pure: false
})
export class DecimalNumberPipe implements PipeTransform, OnDestroy {

  /**
   * Property `DEFAULT_LOCALE` (`string`) storing default locale (default: `'en-US'`).
   * @zh 属性 `DEFAULT_LOCALE`（类型：`string`），用于存储或配置默认语言区域（默认值：`'en-US'`）。
   */
  static DEFAULT_LOCALE = 'en-US';
  /**
   * Property `DEFAULT_MIN_INTEGER_DIGITS` (`number`) storing default min integer digits (default: `1`).
   * @zh 属性 `DEFAULT_MIN_INTEGER_DIGITS`（类型：`number`），用于存储或配置默认最小值INTEGER数字位（默认值：`1`）。
   */
  static DEFAULT_MIN_INTEGER_DIGITS = 1;
  /**
   * Property `DEFAULT_MIN_FRACTION_DIGITS` (`number`) storing default min fraction digits (default: `0`).
   * @zh 属性 `DEFAULT_MIN_FRACTION_DIGITS`（类型：`number`），用于存储或配置默认最小值FRACTION数字位（默认值：`0`）。
   */
  static DEFAULT_MIN_FRACTION_DIGITS = 0;
  /**
   * Property `DEFAULT_MAX_FRACTION_DIGITS` (`number`) storing default max fraction digits (default: `2`).
   * @zh 属性 `DEFAULT_MAX_FRACTION_DIGITS`（类型：`number`），用于存储或配置默认最大值FRACTION数字位（默认值：`2`）。
   */
  static DEFAULT_MAX_FRACTION_DIGITS = 2;

  /**
   * Property `defaultLocale` (`string`) storing default locale (default: `DecimalNumberPipe.DEFAULT_LOCALE`).
   * @zh 属性 `defaultLocale`（类型：`string`），用于存储或配置默认语言区域（默认值：`DecimalNumberPipe.DEFAULT_LOCALE`）。
   */
  defaultLocale: string = DecimalNumberPipe.DEFAULT_LOCALE;
  /**
   * Property `defaultMinIntegerDigits` (`number`) storing default min integer digits.
   * @zh 属性 `defaultMinIntegerDigits`（类型：`number`），用于存储或配置默认最小值Integer数字位。
   */
  defaultMinIntegerDigits: number = DecimalNumberPipe.DEFAULT_MIN_INTEGER_DIGITS;
  /**
   * Property `defaultMinFractionDigits` (`number`) storing default min fraction digits.
   * @zh 属性 `defaultMinFractionDigits`（类型：`number`），用于存储或配置默认最小值Fraction数字位。
   */
  defaultMinFractionDigits: number = DecimalNumberPipe.DEFAULT_MIN_FRACTION_DIGITS;
  /**
   * Property `defaultMaxFractionDigits` (`number`) storing default max fraction digits.
   * @zh 属性 `defaultMaxFractionDigits`（类型：`number`），用于存储或配置默认最大值Fraction数字位。
   */
  defaultMaxFractionDigits: number = DecimalNumberPipe.DEFAULT_MAX_FRACTION_DIGITS;

  /**
   * Property `onDestroy$` (`Subject<boolean>`) storing on destroy (default: `new Subject<boolean>()`).
   * @zh 属性 `onDestroy$`（类型：`Subject<boolean>`），用于存储或配置当销毁（默认值：`new Subject<boolean>()`）。
   */
  onDestroy$: Subject<boolean> = new Subject<boolean>();

  /**
   * Creates an instance of `DecimalNumberPipe` and initializes its dependencies and internal state.
   * @zh 创建 `DecimalNumberPipe` 实例，并初始化其依赖项与内部状态。
   * @param appConfig - Injected or initial app config (`ConfigService`) / 注入或传入的app配置（`ConfigService`）
   */
  constructor(public appConfig?: ConfigService) {

    if (this.appConfig) {
      this.defaultLocale = this.appConfig.get<string>('dateValues.locale', DecimalNumberPipe.DEFAULT_LOCALE);
      this.defaultMinIntegerDigits = this.appConfig.get<number>('decimalValues.minIntegerDigits', DecimalNumberPipe.DEFAULT_MIN_INTEGER_DIGITS);
      this.defaultMinFractionDigits = this.appConfig.get<number>('decimalValues.minFractionDigits', DecimalNumberPipe.DEFAULT_MIN_FRACTION_DIGITS);
      this.defaultMaxFractionDigits = this.appConfig.get<number>('decimalValues.maxFractionDigits', DecimalNumberPipe.DEFAULT_MAX_FRACTION_DIGITS);
    }
  }

  /**
   * Property `cachedPipe` (`DecimalPipe`) storing cached pipe.
   * @zh 属性 `cachedPipe`（类型：`DecimalPipe`），用于存储或配置已缓存管道。
   */
  private cachedPipe?: DecimalPipe;
  /**
   * Property `cachedLocale` (`string`) storing cached locale.
   * @zh 属性 `cachedLocale`（类型：`string`），用于存储或配置已缓存语言区域。
   */
  private cachedLocale?: string;

  /**
   * Executes `transform` to handle transform.
   * @zh 执行 `transform`，用于转换。
   * @param value - value parameter (`any`) / 值参数（`any`）
   * @param digitsInfo - digits info parameter (`DecimalNumberModel`) / 数字位信息参数（`DecimalNumberModel`）
   * @param locale - locale parameter (`string`) / 语言区域参数（`string`）
   * @returns Result of type `any` / 类型为 `any` 的返回值
   */
  transform(value, digitsInfo?: DecimalNumberModel, locale?: string) {
    const actualMinIntegerDigits: number =
      digitsInfo && digitsInfo.minIntegerDigits !== undefined && digitsInfo.minIntegerDigits !== null
        ? digitsInfo.minIntegerDigits
        : this.defaultMinIntegerDigits;
    const actualMinFractionDigits: number =
      digitsInfo && digitsInfo.minFractionDigits !== undefined && digitsInfo.minFractionDigits !== null
        ? digitsInfo.minFractionDigits
        : this.defaultMinFractionDigits;
    const actualMaxFractionDigits: number =
      digitsInfo && digitsInfo.maxFractionDigits !== undefined && digitsInfo.maxFractionDigits !== null
        ? digitsInfo.maxFractionDigits
        : this.defaultMaxFractionDigits;

    const actualDigitsInfo = `${actualMinIntegerDigits}.${actualMinFractionDigits}-${actualMaxFractionDigits}`;
    const actualLocale = locale || this.defaultLocale;

    if (!this.cachedPipe || this.cachedLocale !== actualLocale) {
      this.cachedLocale = actualLocale;
      this.cachedPipe = new DecimalPipe(actualLocale);
    }
    return this.cachedPipe.transform(value, actualDigitsInfo);
  }

  /**
   * Angular lifecycle hook invoked just before the component, directive, or service is destroyed to release subscriptions and resources.
   * @zh Angular 生命周期钩子：在组件、指令或服务销毁前调用，用于释放订阅与清理资源。
   */
  ngOnDestroy(): void {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }
}
