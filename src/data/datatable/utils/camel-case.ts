/**
 * @fileoverview Module `src/data/datatable/utils/camel-case.ts` providing camel case definitions and implementation.
 * @zh 模块文件 `src/data/datatable/utils/camel-case.ts`，提供camelcase相关的定义与实现。
 */


/**
 * Executes `camelCase` to handle camel case.
 * @zh 执行 `camelCase`，用于camelCase。
 * @param str - str parameter (`string`) / 字符串参数（`string`）
 * @returns Result of type `string` / 类型为 `string` 的返回值
 */
export function camelCase(str: string): string {
  // Replace special characters with a space
  str = str.replace(/[^a-zA-Z0-9 ]/g, ' ');
  // put a space before an uppercase letter
  str = str.replace(/([a-z](?=[A-Z]))/g, '$1 ');

  // Lower case first character and some other stuff
  str = str
    .replace(/([^a-zA-Z0-9 ])|^[0-9]+/g, '')
    .trim()
    .toLowerCase();

  // uppercase characters preceded by a space or number
  str = str.replace(/([ 0-9]+)([a-zA-Z])/g, function(a, b, c) {
    return b.trim() + c.toUpperCase();
  });

  return str;
}

/**
 * Converts strings from camel case to words
 * http://stackoverflow.com/questions/7225407/convert-camelcasetext-to-camel-case-text

 * @zh 执行 `deCamelCase`，用于deCamelCase。
 */
export function deCamelCase(str: string): string {
  return str.replace(/([A-Z])/g, match => ` ${match}`).replace(/^./, match => match.toUpperCase());
}
