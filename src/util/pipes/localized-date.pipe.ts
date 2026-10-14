

import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import { TranslationService } from '@dotos/dui/translator';
@Pipe({
  name: 'LocalizedDate',
  pure: false
})
export class LocalizedDatePipe implements PipeTransform {

  static DEFAULT_DATE_FORMAT = 'mediumDate';
  defaultFormat: string = LocalizedDatePipe.DEFAULT_DATE_FORMAT;

  private cachedPipe?: DatePipe;
  private cachedLocale?: string;

  constructor(private translateService: TranslationService) {
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  transform(value: any, format?: string, locale?: string): any {
    const actualFormat = format || this.defaultFormat;
    const actualLocale = (locale || this.translateService.userLang || 'en-US').replace('_', '-');
    if (!this.cachedPipe || this.cachedLocale !== actualLocale) {
      this.cachedLocale = actualLocale;
      this.cachedPipe = new DatePipe(actualLocale);
    }
    return this.cachedPipe.transform(value, actualFormat);
  }
}
