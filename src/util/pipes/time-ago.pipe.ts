import { Pipe, PipeTransform } from '@angular/core';
import { TranslationService } from '@dotos/dui/translator';

@Pipe({
  name: 'timeAgo',
})
export class TimeAgoPipe implements PipeTransform {

  constructor(
    public readonly translation: TranslationService) {
  }

  transform(time: any, reference: any): string {
    time = new Date(time);
    const ref: Date = new Date(reference);
    if (!time.getTime()) {
      return this.translation.instant('PIPE.Invalid_Date');
    }

    const startTime: number = isNaN(ref.getTime()) ? Date.now() : ref.getTime();
    let diff: number = Math.floor((startTime - time.getTime()) / 1000);

    if (diff < 2) {
      return '1 '+this.translation.instant('PIPE.SECOND_AGO') ;
    }
    if (diff < 60) {
      return Math.floor(diff) +this.translation.instant('PIPE.SECOND_AGO');
    }
    // Minutes
    diff = diff / 60;
    if (diff < 2) {
      return '1 '+this.translation.instant('PIPE.MINUTE_AGO');
    }
    if (diff < 60) {
      return Math.floor(diff) + this.translation.instant('PIPE.MINUTE_AGO');
    }
    // Hours
    diff = diff / 60;
    if (diff < 2) {
      return '1 '+this.translation.instant('PIPE.HOUR_AGO');
    }
    if (diff < 24) {
      return Math.floor(diff) + this.translation.instant('PIPE.HOUR_AGO');
    }
    // Days
    diff = diff / 24;
    if (diff < 2) {
      return '1 '+this.translation.instant('PIPE.DAY_AGO');
    }
    if (diff < 30) {
      return Math.floor(diff) +this.translation.instant('PIPE.DAY_AGO');
    }
    // Months
    diff = diff / 30;
    if (diff < 2) {
      return '1 '+this.translation.instant('PIPE.MONTH_AGO');
    }
    if (diff < 12) {
      return Math.floor(diff) + this.translation.instant('PIPE.MONTH_AGO');
    }
    // Years
    diff = diff / 12;
    if (diff < 2) {
      return '1 '+this.translation.instant('PIPE.YEAR_AGO');
    } else {
      return Math.floor(diff) +this.translation.instant('PIPE.YEAR_AGO');
    }
  }
}
