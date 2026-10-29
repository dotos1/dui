/**
 * @fileoverview Module `src/core/angular2parse/util/lang.ts` providing lang definitions and implementation.
 * @zh 模块文件 `src/core/angular2parse/util/lang.ts`，提供语言相关的定义与实现。
 */

/**
 * Executes `compileToJSON` to handle compile to json.
 * @zh 执行 `compileToJSON`，用于编译转换为JSON。
 * @param json - json parameter (`any`) / JSON参数（`any`）
 */
export function compileToJSON(json) {
    return JSON.stringify(json).replace(/"/g, '');
}

// export function isPresent(obj: any) {
//     return obj !== null && obj !== undefined;
// }

// export function isJsObject(obj: any) {
//     return obj !== null && (typeof obj === 'function' || typeof obj === 'object');
// }

/**
 * Executes `isFunction` to handle is function.
 * @zh 执行 `isFunction`，用于是否为函数。
 * @param val - val parameter (`any`) / 值参数（`any`）
 */
export function isFunction(val) {
    return typeof val === 'function';
}