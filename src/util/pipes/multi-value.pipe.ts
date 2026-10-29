/**
 * @fileoverview Module `src/util/pipes/multi-value.pipe.ts` providing multi value pipe definitions and implementation.
 * @zh 模块文件 `src/util/pipes/multi-value.pipe.ts`，提供多值管道相关的定义与实现。
 */



import { Pipe, PipeTransform } from '@angular/core';

/**
 * Angular pipe `MultiValuePipe` (name: 'multiValue') transforming values for multi value pipe display in templates.
 * @zh Angular 管道 `MultiValuePipe`（name: 'multiValue'），在模板中转换数据以用于多值管道展示。
 */
@Pipe({ name: 'multiValue' })
export class MultiValuePipe implements PipeTransform {

    /**
     * Property `DEFAULT_SEPARATOR` (`string`) storing default separator (default: `', '`).
     * @zh 属性 `DEFAULT_SEPARATOR`（类型：`string`），用于存储或配置默认SEPARATOR（默认值：`', '`）。
     */
    static DEFAULT_SEPARATOR = ', ';

    /**
     * Executes `transform` to handle transform.
     * @zh 执行 `transform`，用于转换。
     * @param values - values parameter (`string | string[]`) / 值列表参数（`string | string[]`）
     * @param valueSeparator - value separator parameter (`string`) / 值Separator参数（`string`）
     * @returns Result of type `string` / 类型为 `string` 的返回值
     */
    transform(values: string | string [], valueSeparator: string = MultiValuePipe.DEFAULT_SEPARATOR): string {

        if (values && values instanceof Array) {
            const valueList = values.map((value) => value.trim());
            return valueList.join(valueSeparator);
        }

        return <string> values;
    }
}
