/**
 * @fileoverview Module `src/util/pipes/camelCaseToDash.pipe.ts` providing camel case to dash pipe definitions and implementation.
 * @zh 模块文件 `src/util/pipes/camelCaseToDash.pipe.ts`，提供camelCase转换为Dash管道相关的定义与实现。
 */

import { Pipe, PipeTransform } from '@angular/core';

/**
 * Angular pipe `CamelCaseToDashPipe` (name: 'camelCaseToDash') transforming values for camel case to dash pipe display in templates.
 * @zh Angular 管道 `CamelCaseToDashPipe`（name: 'camelCaseToDash'），在模板中转换数据以用于CamelCase转换为Dash管道展示。
 */
@Pipe({ name: 'camelCaseToDash' })
export class CamelCaseToDashPipe implements PipeTransform {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    /**
     * Executes `transform` to handle transform.
     * @zh 执行 `transform`，用于转换。
     * @param value - value parameter (`string`) / 值参数（`string`）
     * @param args - args parameter (`any[]`) / 参数列表参数（`any[]`）
     * @returns Result of type `string` / 类型为 `string` 的返回值
     */
    transform(value: string, args: unknown[] = []): string {
        return value ? String(value).replace(/([A-Z])/g, (g) => `-${g[0].toLowerCase()}`) : '';
    }
}
