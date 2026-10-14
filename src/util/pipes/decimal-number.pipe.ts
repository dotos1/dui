

import { DecimalPipe } from '@angular/common';
import { Pipe, PipeTransform, OnDestroy } from '@angular/core';
import { ConfigService } from '@dotos/dui/core/config';
import { DecimalNumberModel } from '@dotos/dui/util';
import { Subject } from 'rxjs';

@Pipe({
  name: 'DecimalNumber',
  pure: false
})
export class DecimalNumberPipe implements PipeTransform, OnDestroy {

  static DEFAULT_LOCALE = 'en-US';
  static DEFAULT_MIN_INTEGER_DIGITS = 1;
  static DEFAULT_MIN_FRACTION_DIGITS = 0;
  static DEFAULT_MAX_FRACTION_DIGITS = 2;

  defaultLocale: string = DecimalNumberPipe.DEFAULT_LOCALE;
  defaultMinIntegerDigits: number = DecimalNumberPipe.DEFAULT_MIN_INTEGER_DIGITS;
  defaultMinFractionDigits: number = DecimalNumberPipe.DEFAULT_MIN_FRACTION_DIGITS;
  defaultMaxFractionDigits: number = DecimalNumberPipe.DEFAULT_MAX_FRACTION_DIGITS;

  onDestroy$: Subject<boolean> = new Subject<boolean>();

  constructor(public appConfig?: ConfigService) {

    if (this.appConfig) {
      this.defaultLocale = this.appConfig.get<string>('dateValues.locale', DecimalNumberPipe.DEFAULT_LOCALE);
      this.defaultMinIntegerDigits = this.appConfig.get<number>('decimalValues.minIntegerDigits', DecimalNumberPipe.DEFAULT_MIN_INTEGER_DIGITS);
      this.defaultMinFractionDigits = this.appConfig.get<number>('decimalValues.minFractionDigits', DecimalNumberPipe.DEFAULT_MIN_FRACTION_DIGITS);
      this.defaultMaxFractionDigits = this.appConfig.get<number>('decimalValues.maxFractionDigits', DecimalNumberPipe.DEFAULT_MAX_FRACTION_DIGITS);
    }
  }

  private cachedPipe?: DecimalPipe;
  private cachedLocale?: string;

  transform(value: any, digitsInfo?: DecimalNumberModel, locale?: string): any {
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

  ngOnDestroy(): void {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }
}
