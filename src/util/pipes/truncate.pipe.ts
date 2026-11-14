/**
 * @fileoverview Module `src/util/pipes/truncate.pipe.ts` providing truncate pipe definitions and implementation.
 * @zh 模块文件 `src/util/pipes/truncate.pipe.ts`，提供truncate管道相关的定义与实现。
 */

import { Pipe, PipeTransform } from '@angular/core';

/**
 * Angular pipe `TruncatePipe` (name: 'truncate') transforming values for truncate pipe display in templates.
 * @zh Angular 管道 `TruncatePipe`（name: 'truncate'），在模板中转换数据以用于Truncate管道展示。
 */
@Pipe({
  name: 'truncate',
  standalone: false,
})

export class TruncatePipe implements PipeTransform {
  /**
   * Executes `transform` to handle transform.
   * @zh 执行 `transform`，用于转换。
   * @param text - text parameter (`unknown`) / 文本参数（`unknown`）
   * @param length - length parameter (`number`) / 长度参数（`number`）
   * @returns Result of type `string` / 类型为 `string` 的返回值
   */
  transform(text: unknown, length: number): string {
    if (typeof text !== 'string') {
      return '';
    }
    let truncated: string = text.substr(0, length);
    if (text.length > length) {
      if (truncated.lastIndexOf(' ') > 0) {
        truncated = truncated.trim();
      }
      truncated += '…';
    }
    return truncated;
  }
}
