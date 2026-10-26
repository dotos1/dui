/**
 * @fileoverview Module `src/ux/editor/utils/toStyleString.ts` providing to style string definitions and implementation.
 * @zh 模块文件 `src/ux/editor/utils/toStyleString.ts`，提供转换为样式字符串相关的定义与实现。
 */

/**
 * Constant/variable `camelToDashed` defining camel to dashed in `src/ux/editor/utils`.
 * @zh 常量/变量 `camelToDashed`，定义 `src/ux/editor/utils` 中的camel转换为Dashed。
 */
const camelToDashed = (str: string): string => {
  return str.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);
};

/**
 * Constant/variable `cleanObject` defining clean object in `src/ux/editor/utils`.
 * @zh 常量/变量 `cleanObject`，定义 `src/ux/editor/utils` 中的clean对象。
 */
const cleanObject = (obj) => {
  const cleanObj: Record<string, string> = {};
  Object.keys(obj).forEach((prop) => {
    if (obj[prop]) {
      cleanObj[prop] = obj[prop];
    }
  });
  return cleanObj;
};

/**
 * Constant/variable `toStyleString` defining to style string in `src/ux/editor/utils`.
 * @zh 常量/变量 `toStyleString`，定义 `src/ux/editor/utils` 中的转换为样式字符串。
 */
const toStyleString = (obj: Partial<CSSStyleDeclaration>): string => {
  const styles = cleanObject(obj);
  return Object.entries(styles).map(([k, v]) => `${camelToDashed(k)}:${v}`).join(';');
};

export default toStyleString;
