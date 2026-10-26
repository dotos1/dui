/**
 * @fileoverview Module `src/util/func.util.ts` providing func util definitions and implementation.
 * @zh 模块文件 `src/util/func.util.ts`，提供func工具相关的定义与实现。
 */

/**
 * Constant/variable `executeIfFunction` defining execute if function in `src/util`.
 * @zh 常量/变量 `executeIfFunction`，定义 `src/util` 中的执行If函数。
 */
const executeIfFunction = (fn) =>
  typeof fn === 'function' ? fn() : fn;

/**
 * Executes `switchCaseBase` to handle switch case base.
 * @zh 执行 `switchCaseBase`，用于切换开关Case基础。
 * @param cases - cases parameter (`any`) / cases参数（`any`）
 * @returns Result of type `(defaultCase?: any) => (key: any) => any` / 类型为 `(defaultCase?: any) => (key: any) => any` 的返回值
 */
function switchCaseBase(cases) {
  return (defaultCase?) => (key) =>
    cases.hasOwnProperty(key) ? cases[key] : defaultCase;
}

/**
 * Executes `switchCase` to handle switch case.
 * @zh 执行 `switchCase`，用于切换开关Case。
 * @param cases - cases parameter (`any`) / cases参数（`any`）
 * @returns Result of type `(defaultCase?: any) => (key: any) => any` / 类型为 `(defaultCase?: any) => (key: any) => any` 的返回值
 */
export function switchCase(cases) {
  return (defaultCase?) => (key) =>
    executeIfFunction(switchCaseBase(cases)(defaultCase)(key));
}
