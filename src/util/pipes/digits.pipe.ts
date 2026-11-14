/**
 * @fileoverview Module `src/util/pipes/digits.pipe.ts` providing digits pipe definitions and implementation.
 * @zh 模块文件 `src/util/pipes/digits.pipe.ts`，提供数字位管道相关的定义与实现。
 */

import { Pipe, PipeTransform, Inject, LOCALE_ID } from '@angular/core';
import { DecimalPipe } from '@angular/common';

/**
 * Angular pipe `DigitsPipe` (name: 'digits') transforming values for digits pipe display in templates.
 * @zh Angular 管道 `DigitsPipe`（name: 'digits'），在模板中转换数据以用于数字位管道展示。
 */
@Pipe({
  name: 'digits',
  standalone: false,
})

export class DigitsPipe implements PipeTransform {

  /**
   * Property `_decimalPipe` (`DecimalPipe`) storing decimal pipe.
   * @zh 属性 `_decimalPipe`（类型：`DecimalPipe`），用于存储或配置decimal管道。
   */
  private _decimalPipe: DecimalPipe;

  /**
   * Creates an instance of `DigitsPipe` and initializes its dependencies and internal state.
   * @zh 创建 `DigitsPipe` 实例，并初始化其依赖项与内部状态。
   * @param _locale - Injected or initial locale (`string`) / 注入或传入的语言区域（`string`）
   */
  constructor(@Inject(LOCALE_ID) private _locale: string = 'en') {
    this._decimalPipe = new DecimalPipe(this._locale);
  }

  /**
   * Executes `transform` to handle transform.
   * @zh 执行 `transform`，用于转换。
   * @param digits - digits parameter (`any`) / 数字位参数（`any`）
   * @param precision - precision parameter (`number`) / precision参数（`number`）
   * @returns Result of type `string` / 类型为 `string` 的返回值
   */
  transform(digits, precision: number = 1): string {
    
    if (digits === 0) {
      return '0';
    } else if (isNaN(parseInt(digits, 10))) {
      /* If not a valid number, return the value */
      return digits;
    } else if (digits < 1) {
      return this._decimalPipe.transform(digits.toFixed(precision));
    }
    const k: number = 1000;
    const sizes: string[] = ['', 'K', 'M', 'B', 'T', 'Q'];
    const i: number = Math.floor(Math.log(digits) / Math.log(k));
    const size: string = sizes[i];
    return this._decimalPipe.transform(parseFloat((digits / Math.pow(k, i)).toFixed(precision))) + (size ? ' ' + size : '');
  }
}
