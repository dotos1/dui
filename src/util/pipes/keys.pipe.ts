/**
 * @fileoverview Module `src/util/pipes/keys.pipe.ts` providing keys pipe definitions and implementation.
 * @zh 模块文件 `src/util/pipes/keys.pipe.ts`，提供键列表管道相关的定义与实现。
 */

import { Pipe, PipeTransform } from '@angular/core';

/**
 * Angular pipe `KeysPipe` (name: 'keys') transforming values for keys pipe display in templates.
 * @zh Angular 管道 `KeysPipe`（name: 'keys'），在模板中转换数据以用于键列表管道展示。
 */
@Pipe({ name: 'keys' })
export class KeysPipe implements PipeTransform {

    /**
     * Executes `transform` to handle transform.
     * @zh 执行 `transform`，用于转换。
     * @param value - value parameter (`any`) / 值参数（`any`）
     * @returns Result of type `{ key: string; value: unknown; }[]` / 类型为 `{ key: string; value: unknown; }[]` 的返回值
     */
    transform(value) {
        const keys: { key: string; value: unknown }[] = [];
        for (const key in value) {
            if (value.hasOwnProperty(key)) {
                keys.push({
                    key: key,
                    value: value[key]
                });
            }
        }
        return keys;
    }
}
