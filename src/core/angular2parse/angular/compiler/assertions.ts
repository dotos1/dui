/**
 * @fileoverview Module `src/core/angular2parse/angular/compiler/assertions.ts` providing assertions definitions and implementation.
 * @zh 模块文件 `src/core/angular2parse/angular/compiler/assertions.ts`，提供断言列表相关的定义与实现。
 */



import {isBlank, isPresent} from '../facade/lang';

/**
 * Constant/variable `isDevMode` defining is dev mode in `src/core/angular2parse/angular/compiler`.
 * @zh 常量/变量 `isDevMode`，定义 `src/core/angular2parse/angular/compiler` 中的是否为Dev模式。
 */
const isDevMode = () => false;

/**
 * Executes `assertArrayOfStrings` to handle assert array of strings.
 * @zh 执行 `assertArrayOfStrings`，用于断言数组的字符串。
 * @param identifier - identifier parameter (`string`) / identifier参数（`string`）
 * @param value - value parameter (`any`) / 值参数（`any`）
 */
export function assertArrayOfStrings(identifier: string, value) {
    if (!isDevMode() || isBlank(value)) {
        return;
    }
    if (!Array.isArray(value)) {
        throw new Error(`Expected '${identifier}' to be an array of strings.`);
    }
    for (let i = 0; i < value.length; i += 1) {
        if (typeof value[i] !== 'string') {
            throw new Error(`Expected '${identifier}' to be an array of strings.`);
        }
    }
}

/**
 * Constant/variable `INTERPOLATION_BLACKLIST_REGEXPS` defining interpolation blacklist regexps in `src/core/angular2parse/angular/compiler`.
 * @zh 常量/变量 `INTERPOLATION_BLACKLIST_REGEXPS`，定义 `src/core/angular2parse/angular/compiler` 中的INTERPOLATIONBLACKLISTREGEXPS。
 */
const INTERPOLATION_BLACKLIST_REGEXPS = [
    /^\s*$/,        // empty
    /[<>]/,         // html tag
    /^[{}]$/,       // i18n expansion
    /&(#|[a-z])/i,  // character reference,
    /^\/\//,        // comment
];

/**
 * Executes `assertInterpolationSymbols` to handle assert interpolation symbols.
 * @zh 执行 `assertInterpolationSymbols`，用于断言InterpolationSymbols。
 * @param identifier - identifier parameter (`string`) / identifier参数（`string`）
 * @param value - value parameter (`any`) / 值参数（`any`）
 */
export function assertInterpolationSymbols(identifier: string, value): void {
    if (isPresent(value) && !(Array.isArray(value) && value.length == 2)) {
        throw new Error(`Expected '${identifier}' to be an array, [start, end].`);
    } else if (isDevMode() && !isBlank(value)) {
        const start = value[0] as string;
        const end = value[1] as string;
        // black list checking
        INTERPOLATION_BLACKLIST_REGEXPS.forEach(regexp => {
            if (regexp.test(start) || regexp.test(end)) {
                throw new Error(`['${start}', '${end}'] contains unusable interpolation symbol.`);
            }
        });
    }
}