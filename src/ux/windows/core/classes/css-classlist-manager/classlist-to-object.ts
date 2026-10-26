/**
 * @fileoverview Module `src/ux/windows/core/classes/css-classlist-manager/classlist-to-object.ts` providing classlist to object definitions and implementation.
 * @zh 模块文件 `src/ux/windows/core/classes/css-classlist-manager/classlist-to-object.ts`，提供classlist转换为对象相关的定义与实现。
 */

import { ɵRawObject } from '../../types';


    /**
     * Executes `transform` to handle transform.
     * @zh 执行 `transform`，用于转换。
     * @param classList - class list parameter (`string | string[] | object`) / 类名列表参数（`string | string[] | object`）
     * @returns Result of type `object` / 类型为 `object` 的返回值
     */
    export function transform(classList: string | string[] | object): object {
        if (typeof classList === 'string') {
            return fromString(classList);
        } else if (Array.isArray(classList)) {
            return fromArray(classList);
        } else if (classList === Object(classList)) {
            return classList;
        }

        throw new Error('Unsupported format for classList');
    }

    /**
     * Executes `fromString` to handle from string.
     * @zh 执行 `fromString`，用于从字符串。
     * @param classList - class list parameter (`string`) / 类名列表参数（`string`）
     * @returns Result of type `object` / 类型为 `object` 的返回值
     */
    export function fromString(classList: string): object {
        const classListAsArray = classList.split(' ');

        return fromArray(classListAsArray);
    }

    /**
     * Executes `fromArray` to handle from array.
     * @zh 执行 `fromArray`，用于从数组。
     * @param classList - class list parameter (`string[]`) / 类名列表参数（`string[]`）
     * @returns Result of type `object` / 类型为 `object` 的返回值
     */
    export function fromArray(classList: string[]): object {
        return classList
            .filter((className) => className)
            .reduce((accumulator, className) => {
                accumulator[className] = true;

                return accumulator;
            }, {} as ɵRawObject<boolean>);
    }
