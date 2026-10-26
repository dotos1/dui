/**
 * @fileoverview Module `src/util/pipes/time-ago.pipe.ts` providing time ago pipe definitions and implementation.
 * @zh 模块文件 `src/util/pipes/time-ago.pipe.ts`，提供时间ago管道相关的定义与实现。
 */

import { Pipe, PipeTransform } from '@angular/core';
import { TranslationService } from '@dotos/dui/translator';

/**
 * Angular pipe `TimeAgoPipe` (name: 'timeAgo') transforming values for time ago pipe display in templates.
 * @zh Angular 管道 `TimeAgoPipe`（name: 'timeAgo'），在模板中转换数据以用于时间Ago管道展示。
 */
@Pipe({
  name: 'timeAgo',
})
export class TimeAgoPipe implements PipeTransform {

  /**
   * Creates an instance of `TimeAgoPipe` and initializes its dependencies and internal state.
   * @zh 创建 `TimeAgoPipe` 实例，并初始化其依赖项与内部状态。
   * @param translation - Injected or initial translation (`TranslationService`) / 注入或传入的翻译文本（`TranslationService`）
   */
  constructor(
    public readonly translation: TranslationService) {
  }

  /**
   * Executes `transform` to handle transform.
   * @zh 执行 `transform`，用于转换。
   * @param time - time parameter (`any`) / 时间参数（`any`）
   * @param reference - reference parameter (`any`) / 引用参数（`any`）
   * @returns Result of type `string` / 类型为 `string` 的返回值
   */
  transform(time, reference): string {
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
