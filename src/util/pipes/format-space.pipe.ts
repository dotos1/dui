/**
 * @fileoverview Module `src/util/pipes/format-space.pipe.ts` providing format space pipe definitions and implementation.
 * @zh 模块文件 `src/util/pipes/format-space.pipe.ts`，提供格式化space管道相关的定义与实现。
 */


import { Pipe, PipeTransform } from '@angular/core';

/**
 * Angular pipe `FormatSpacePipe` (name: 'formatSpace') transforming values for format space pipe display in templates.
 * @zh Angular 管道 `FormatSpacePipe`（name: 'formatSpace'），在模板中转换数据以用于格式化Space管道展示。
 */
@Pipe({
    name: 'formatSpace',
    standalone: false
})
export class FormatSpacePipe implements PipeTransform {

    /**
     * Executes `transform` to handle transform.
     * @zh 执行 `transform`，用于转换。
     * @param inputValue - input value parameter (`string`) / 输入属性值参数（`string`）
     * @param replaceChar - replace char parameter (`string`) / 替换字符参数（`string`）
     * @param lowerCase - lower case parameter (`boolean`) / 下限Case参数（`boolean`）
     * @returns Result of type `string` / 类型为 `string` 的返回值
     */
    transform(inputValue: string, replaceChar: string = '_', lowerCase: boolean = true): string {
        let transformedString = '';
        if (inputValue) {
            transformedString = lowerCase ? inputValue.trim().split(' ').join(replaceChar).toLocaleLowerCase() :
                inputValue.trim().split(' ').join(replaceChar);
        }
        return transformedString;
    }

}
