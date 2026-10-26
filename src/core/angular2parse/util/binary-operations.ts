/**
 * @fileoverview Module `src/core/angular2parse/util/binary-operations.ts` providing binary operations definitions and implementation.
 * @zh 模块文件 `src/core/angular2parse/util/binary-operations.ts`，提供binaryoperations相关的定义与实现。
 */

/**
 * Constant/variable `BinaryOperations` defining binary operations in `src/core/angular2parse/util`.
 * @zh 常量/变量 `BinaryOperations`，定义 `src/core/angular2parse/util` 中的BinaryOperations。
 */
export const BinaryOperations = new Map<string, Function>([
    ['==', (left, right) => left == right],
    ['===', (left, right) => left === right],
    ['!=', (left, right) => left != right],
    ['!==', (left, right) => left !== right],
    ['&&', (left, right) => left && right],
    ['||', (left, right) => left || right],
    ['+', (left, right) => left + right],
    ['-', (left, right) => left - right],
    ['/', (left, right) => left / right],
    ['*', (left, right) => left * right],
    ['%', (left, right) => left % right],
    ['<', (left, right) => left < right],
    ['<=', (left, right) => left <= right],
    ['>', (left, right) => left > right],
    ['>=', (left, right) => left >= right],
]);