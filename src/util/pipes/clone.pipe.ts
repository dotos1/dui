/**
 * @fileoverview Module `src/util/pipes/clone.pipe.ts` providing clone pipe definitions and implementation.
 * @zh 模块文件 `src/util/pipes/clone.pipe.ts`，提供克隆管道相关的定义与实现。
 */

import { Pipe, PipeTransform } from '@angular/core';

/**
 * Angular pipe `ClonePipe` (name: 'clone') transforming values for clone pipe display in templates.
 * @zh Angular 管道 `ClonePipe`（name: 'clone'），在模板中转换数据以用于克隆管道展示。
 */
@Pipe({
  name: 'clone'
})
export class ClonePipe implements PipeTransform {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  /**
   * Executes `transform` to handle transform.
   * @zh 执行 `transform`，用于转换。
   * @param value - value parameter (`any`) / 值参数（`any`）
   * @param args - args parameter (`any`) / 参数列表参数（`any`）
   * @returns Result of type `any` / 类型为 `any` 的返回值
   */
  transform(value, args?: unknown) {
    if (value === undefined || value === null || typeof value !== 'object') {
      return value;
    }

    if (value instanceof Array) {
      return value.map(obj =>
        obj !== null && typeof obj === 'object'
          ? Object.assign(Object.create(Object.getPrototypeOf(obj)), obj)
          : obj
      );
    } else {
      return Object.assign(Object.create(Object.getPrototypeOf(value)), value);
    }
  }
}
