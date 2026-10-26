/**
 * @fileoverview Module `src/util/pipes/bytes.pipe.ts` providing bytes pipe definitions and implementation.
 * @zh 模块文件 `src/util/pipes/bytes.pipe.ts`，提供bytes管道相关的定义与实现。
 */

import { Pipe, PipeTransform } from '@angular/core';

/**
 * Angular pipe `BytesPipe` (name: 'bytes') transforming values for bytes pipe display in templates.
 * @zh Angular 管道 `BytesPipe`（name: 'bytes'），在模板中转换数据以用于Bytes管道展示。
 */
@Pipe({
  name: 'bytes',
})

export class BytesPipe implements PipeTransform {
  /* `bytes` needs to be `any` or TypeScript complains
  Tried both `number` and `number | string` */
  /**
   * Executes `transform` to handle transform.
   * @zh 执行 `transform`，用于转换。
   * @param bytes - bytes parameter (`any`) / bytes参数（`any`）
   * @param precision - precision parameter (`number`) / precision参数（`number`）
   * @returns Result of type `string` / 类型为 `string` 的返回值
   */
  transform(bytes, precision: number = 2): string {
    if (bytes === 0) {
      return '0 B';
    } else if (isNaN(parseInt(bytes, 10))) {
      /* If not a valid number, return 'Invalid Number' */
      return 'Invalid Number';
    }
    const k: number = 1024;
    const sizes: string[] = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i: number = Math.floor(Math.log(bytes) / Math.log(k));
    // if less than 1
    if (i < 0) {
      return 'Invalid Number';
    }
    return parseFloat((bytes / Math.pow(k, i)).toFixed(precision)) + ' ' + sizes[i];
  }
}
