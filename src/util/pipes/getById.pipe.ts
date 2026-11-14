/**
 * @fileoverview Module `src/util/pipes/getById.pipe.ts` providing get by id pipe definitions and implementation.
 * @zh 模块文件 `src/util/pipes/getById.pipe.ts`，提供获取按唯一标识管道相关的定义与实现。
 */

import { Pipe, PipeTransform } from '@angular/core';

/**
 * Angular pipe `GetByIdPipe` (name: 'getById') transforming values for get by id pipe display in templates.
 * @zh Angular 管道 `GetByIdPipe`（name: 'getById'），在模板中转换数据以用于获取按唯一标识管道展示。
 */
@Pipe({
    name: 'getById',
    pure: false,
    standalone: false
})
export class GetByIdPipe implements PipeTransform {

    /**
     * Executes `transform` to handle transform.
     * @zh 执行 `transform`，用于转换。
     * @param value - value parameter (`any`) / 值参数（`any`）
     * @param id - id parameter (`number`) / 唯一标识参数（`number`）
     * @param property - property parameter (`string`) / 属性参数（`string`）
     * @returns Result of type `any` / 类型为 `any` 的返回值
     */
    transform(value, id: number, property: string) {
        if (!Array.isArray(value)) {
            return undefined;
        }
        const foundItem = value.find(item => {
            if (item && item.id !== undefined) {
                return item.id === id;
            }
            return false;
        });
        if (foundItem) {
            return foundItem[property];
        }
        return undefined;
    }
}
