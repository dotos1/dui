/**
 * @fileoverview Module `src/data/datatable/utils/prefixes.ts` providing prefixes definitions and implementation.
 * @zh 模块文件 `src/data/datatable/utils/prefixes.ts`，提供前缀相关的定义与实现。
 */

import { camelCase } from './camel-case';

/**
 * Constant/variable `cache` defining cache in `src/data/datatable/utils`.
 * @zh 常量/变量 `cache`，定义 `src/data/datatable/utils` 中的缓存。
 */
const cache: Record<string, string> = {};
/**
 * Constant/variable `testStyle` defining test style in `src/data/datatable/utils`.
 * @zh 常量/变量 `testStyle`，定义 `src/data/datatable/utils` 中的测试样式。
 */
const testStyle = typeof document !== 'undefined' ? document.createElement('div').style : undefined;


/**
 * Constant/variable `prefix` defining prefix in `src/data/datatable/utils`.
 * @zh 常量/变量 `prefix`，定义 `src/data/datatable/utils` 中的前缀。
 */
const prefix = (function() {
  const styles = typeof window !== 'undefined' ? window.getComputedStyle(document.documentElement, '') : undefined;
  const match =
    typeof styles !== 'undefined'
      ? Array.prototype.slice
          .call(styles)
          .join('')
          .match(/-(moz|webkit|ms)-/)
      : null;
  const pre = match !== null ? match[1] : undefined;
  // tslint:disable-next-line: tsr-detect-non-literal-regexp
  const dom = typeof pre !== 'undefined' ? 'WebKit|Moz|MS|O'.match(new RegExp('(' + pre + ')', 'i'))[1] : undefined;

  return dom
    ? {
        dom,
        lowercase: pre,
        css: `-${pre}-`,
        js: pre[0].toUpperCase() + pre.substr(1)
      }
    : undefined;
})();

/**
 * Executes `getVendorPrefixedName` to handle get vendor prefixed name.
 * @zh 执行 `getVendorPrefixedName`，用于获取Vendor已前缀名称。
 * @param property - property parameter (`string`) / 属性参数（`string`）
 */
export function getVendorPrefixedName(property: string) {
  const name = camelCase(property);

  if (!cache[name]) {
    if (prefix !== undefined && testStyle[prefix.css + property] !== undefined) {
      cache[name] = prefix.css + property;
    } else if (testStyle[property] !== undefined) {
      cache[name] = property;
    }
  }

  return cache[name];
}
