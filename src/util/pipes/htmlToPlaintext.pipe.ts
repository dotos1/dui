/**
 * @fileoverview Module `src/util/pipes/htmlToPlaintext.pipe.ts` providing html to plaintext pipe definitions and implementation.
 * @zh 模块文件 `src/util/pipes/htmlToPlaintext.pipe.ts`，提供HTML内容转换为Plaintext管道相关的定义与实现。
 */

import { Pipe, PipeTransform } from '@angular/core';

/**
 * Angular pipe `HtmlToPlaintextPipe` (name: 'htmlToPlaintext') transforming values for html to plaintext pipe display in templates.
 * @zh Angular 管道 `HtmlToPlaintextPipe`（name: 'htmlToPlaintext'），在模板中转换数据以用于HTML内容转换为Plaintext管道展示。
 */
@Pipe({ name: 'htmlToPlaintext' })
export class HtmlToPlaintextPipe implements PipeTransform {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    /**
     * Executes `transform` to handle transform.
     * @zh 执行 `transform`，用于转换。
     * @param value - value parameter (`string`) / 值参数（`string`）
     * @param args - args parameter (`unknown[]`) / 参数列表参数（`unknown[]`）
     * @returns Result of type `string` / 类型为 `string` 的返回值
     */
    transform(value: string, args: unknown[] = []): string {
        return value ? String(value).replace(/<[^>]+>/gm, '') : '';
    }
}
