/**
 * @fileoverview Module `src/ux/editor/utils/isNil.ts` providing is nil definitions and implementation.
 * @zh 模块文件 `src/ux/editor/utils/isNil.ts`，提供是否为Nil相关的定义与实现。
 */

/**
 * Constant/variable `isNil` defining is nil in `src/ux/editor/utils`.
 * @zh 常量/变量 `isNil`，定义 `src/ux/editor/utils` 中的是否为Nil。
 */
const isNil = (val: unknown): boolean => {
  return typeof val === 'undefined' || val === null;
};

export default isNil;
