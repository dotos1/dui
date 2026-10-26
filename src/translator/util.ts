/**
 * @fileoverview Module `src/translator/util.ts` providing util definitions and implementation.
 * @zh 模块文件 `src/translator/util.ts`，提供工具相关的定义与实现。
 */

/* tslint:disable */
/**
 * Determines if two objects or two values are equivalent.
 *
 * Two objects or values are considered equivalent if at least one of the following is true:
 *
 * * Both objects or values pass `===` comparison.
 * * Both objects or values are of the same type and all of their properties are equal by
 *   comparing them with `equals`.
 *
 * @param o1 Object or value to compare.
 * @param o2 Object or value to compare.
 * @returns true if arguments are equal.

 * @zh 执行 `equals`，用于相等比较。
 */
export function equals(o1, o2): boolean {
  if (o1 === o2) return true;
  if (o1 === null || o2 === null) return false;
  if (o1 !== o1 && o2 !== o2) return true; // NaN === NaN
  let t1 = typeof o1, t2 = typeof o2, length: number, key, keySet;
  if (t1 == t2 && t1 == 'object') {
    if (Array.isArray(o1)) {
      if (!Array.isArray(o2)) return false;
      if ((length = o1.length) == o2.length) {
        for (key = 0; key < length; key++) {
          if (!equals(o1[key], o2[key])) return false;
        }
        return true;
      }
    } else {
      if (Array.isArray(o2)) {
        return false;
      }
      keySet = Object.create(null);
      for (key in o1) {
        if (!equals(o1[key], o2[key])) {
          return false;
        }
        keySet[key] = true;
      }
      for (key in o2) {
        if (!(key in keySet) && typeof o2[key] !== 'undefined') {
          return false;
        }
      }
      return true;
    }
  }
  return false;
}
/* tslint:enable */

/**
 * Executes `isDefined` to handle is defined.
 * @zh 执行 `isDefined`，用于是否为Defined。
 * @param value - value parameter (`any`) / 值参数（`any`）
 * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
 */
export function isDefined(value): boolean {
  return typeof value !== 'undefined' && value !== null;
}

/**
 * Executes `isObject` to handle is object.
 * @zh 执行 `isObject`，用于是否为对象。
 * @param item - item parameter (`any`) / 条目参数（`any`）
 * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
 */
export function isObject(item): boolean {
  return (item && typeof item === 'object' && !Array.isArray(item));
}

/**
 * Executes `mergeDeep` to handle merge deep.
 * @zh 执行 `mergeDeep`，用于合并Deep。
 * @param target - target parameter (`any`) / 目标参数（`any`）
 * @param source - source parameter (`any`) / 源参数（`any`）
 * @returns Result of type `any` / 类型为 `any` 的返回值
 */
export function mergeDeep(target, source) {
  let output = Object.assign({}, target);
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach((key) => {
      if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
        return;
      }
      if (isObject(source[key])) {
        if (!Object.prototype.hasOwnProperty.call(target, key)) {
          Object.assign(output, {[key]: source[key]});
        } else {
          output[key] = mergeDeep(target[key], source[key]);
        }
      } else {
        Object.assign(output, {[key]: source[key]});
      }
    });
  }
  return output;
}
