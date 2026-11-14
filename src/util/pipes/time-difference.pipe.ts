/**
 * @fileoverview Module `src/util/pipes/time-difference.pipe.ts` providing time difference pipe definitions and implementation.
 * @zh 模块文件 `src/util/pipes/time-difference.pipe.ts`，提供时间difference管道相关的定义与实现。
 */

import { Pipe, PipeTransform } from '@angular/core';
import { TranslationService } from '@dotos/dui/translator';

/**
 * Angular pipe `TimeDifferencePipe` (name: 'timeDifference') transforming values for time difference pipe display in templates.
 * @zh Angular 管道 `TimeDifferencePipe`（name: 'timeDifference'），在模板中转换数据以用于时间Difference管道展示。
 */
@Pipe({
  name: 'timeDifference',
  standalone: false,
})

export class TimeDifferencePipe implements PipeTransform {

  /**
   * Creates an instance of `TimeDifferencePipe` and initializes its dependencies and internal state.
   * @zh 创建 `TimeDifferencePipe` 实例，并初始化其依赖项与内部状态。
   * @param translation - Injected or initial translation (`TranslationService`) / 注入或传入的翻译文本（`TranslationService`）
   */
  constructor(
    public readonly translation: TranslationService) {
  }
  
  /**
   * Executes `transform` to handle transform.
   * @zh 执行 `transform`，用于转换。
   * @param start - start parameter (`any`) / 开始参数（`any`）
   * @param end - end parameter (`any`) / 结束参数（`any`）
   * @returns Result of type `string` / 类型为 `string` 的返回值
   */
  transform(start, end): string {
    const startTime: Date = new Date(start);
    let endTime: Date;

    if (end !== undefined) {
      endTime = new Date(end);
    } else {
      endTime = new Date();
    }

    if (!startTime.getTime() || !endTime.getTime()) {
      return 'Invalid Date';
    }

    let diff: number = Math.floor((endTime.getTime() - startTime.getTime()) / 1000);

    const days: number = Math.floor(diff / (60 * 60 * 24));
    diff = diff - (days * (60 * 60 * 24));

    const hours: number = Math.floor(diff / (60 * 60));
    diff = diff - (hours * (60 * 60));

    const minutes: number = Math.floor(diff / (60));
    diff -= minutes * (60);

    const seconds: number = diff;

    const pad: string = '00';

    let daysFormatted: string = '';

    if (days > 0 && days < 2) {
      daysFormatted = ' day - ';
    } else if (days > 1) {
      daysFormatted = ' days - ';
    }

    return (days > 0 ? days + daysFormatted : daysFormatted) +
      pad.substring(0, pad.length - (hours + '').length) + hours + ':' +
      pad.substring(0, pad.length - (minutes + '').length) + minutes + ':' +
      pad.substring(0, pad.length - (seconds + '').length) + seconds;
  }
}
