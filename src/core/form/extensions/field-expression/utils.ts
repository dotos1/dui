/**
 * @fileoverview Module `src/core/form/extensions/field-expression/utils.ts` providing utils definitions and implementation.
 * @zh 模块文件 `src/core/form/extensions/field-expression/utils.ts`，提供工具集相关的定义与实现。
 */

import { DuiBase } from '@dotos1/dui/base';

/**
 * Executes `evalStringExpression` to handle eval string expression.
 * @zh 执行 `evalStringExpression`，用于求值字符串表达式。
 * @param expression - expression parameter (`string`) / 表达式参数（`string`）
 * @param argNames - arg names parameter (`string[]`) / 参数名称列表参数（`string[]`）
 */
export function evalStringExpression(expression: string, argNames: string[]): Function | undefined {
  return DuiBase.evalStringExpression(expression, argNames);
}

/**
 * Executes `evalExpression` to handle eval expression.
 * @zh 执行 `evalExpression`，用于求值表达式。
 * @param expression - expression parameter (`string | boolean | Function`) / 表达式参数（`string | boolean | Function`）
 * @param thisArg - this arg parameter (`any`) / this参数参数（`any`）
 * @param argVal - arg val parameter (`any`) / 参数值参数（`any`）
 * @returns Result of type `any` / 类型为 `any` 的返回值
 */
export function evalExpression(expression: string | Function | boolean, thisArg, argVal) {
  if (typeof expression === 'function') {
    return expression.apply(thisArg, argVal);
  } else {
    return expression ? true : false;
  }
}
