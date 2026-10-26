/**
 * @fileoverview Module `src/base/object-utils.ts` providing object utils definitions and implementation.
 * @zh 模块文件 `src/base/object-utils.ts`，提供对象工具集相关的定义与实现。
 */

/**
 * Class `ObjectUtils` encapsulating object utils data structures and logic in `src/base`.
 * @zh 类 `ObjectUtils`，封装 `src/base` 中的对象工具集数据结构与处理逻辑。
 */
export class ObjectUtils {

  /**
   * Executes `getValue` to handle get value.
   * @zh 执行 `getValue`，用于获取值。
   * @param target - target parameter (`any`) / 目标参数（`any`）
   * @param key - key parameter (`string`) / 键参数（`string`）
   * @returns Result of type `any` / 类型为 `any` 的返回值
   */
  static getValue(target, key: string) {

    if (!target) {
      return undefined;
    }

    const keys = key.split('.');
    key = '';

    do {
      key += keys.shift();
      const value = target[key];
      if (value !== undefined && (typeof value === 'object' || !keys.length)) {
        target = value;
        key = '';
      } else if (!keys.length) {
        target = undefined;
      } else {
        key += '.';
      }
    } while (keys.length);

    return target;
  }

  /**
   * Executes `isUnsafeKey` to handle is unsafe key.
   * @zh 执行 `isUnsafeKey`，用于是否为Unsafe键。
   * @param key - key parameter (`string`) / 键参数（`string`）
   * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
   */
  private static isUnsafeKey(key: string): boolean {
    return key === '__proto__' || key === 'constructor' || key === 'prototype';
  }

  /**
   * Executes `merge` to handle merge.
   * @zh 执行 `merge`，用于合并。
   * @param objects - objects parameter (`any`) / 对象参数（`any`）
   * @returns Result of type `any` / 类型为 `any` 的返回值
   */
  static merge(...objects) {
    const result = {};

    objects.forEach((source) => {
      if (!source || typeof source !== 'object') {
        return;
      }
      Object.keys(source).forEach((prop) => {
        if (ObjectUtils.isUnsafeKey(prop)) {
          return;
        }
        if (Object.prototype.hasOwnProperty.call(result, prop) && Array.isArray(result[prop])) {
          result[prop] = result[prop].concat(source[prop]);
        } else if (Object.prototype.hasOwnProperty.call(result, prop) && result[prop] && typeof result[prop] === 'object') {
          result[prop] = ObjectUtils.merge(result[prop], source[prop]);
        } else {
          result[prop] = source[prop];
        }
      });
    });
    return result;
  }

  /**
   * Executes `resolve` to handle resolve.
   * @zh 执行 `resolve`，用于解析。
   * @param obj - obj parameter (`object`) / 对象参数（`object`）
   * @param key - key parameter (`string`) / 键参数（`string`）
   * @returns Result of type `any` / 类型为 `any` 的返回值
   */
  static resolve(obj: object, key: string) {
    const keysArray = key
      .replace(/\[/g, '.')
      .replace(/\]/g, '')
      .split('.');
    let current = obj;
    while (keysArray.length) {
      if (typeof current !== 'object') {
        return undefined;
      }
      current = current[keysArray.shift()];
    }

    return current;
  }

  /**
   * Executes `isObject` to handle is object.
   * @zh 执行 `isObject`，用于是否为对象。
   * @param item - item parameter (`object`) / 条目参数（`object`）
   */
  static isObject(item: object) {
    return (
      item &&
      typeof item === 'object' &&
      !Array.isArray(item) &&
      item !== null &&
      !(item instanceof Date)
    );
  }

  /**
   * Executes `mergeDeep` to handle merge deep.
   * @zh 执行 `mergeDeep`，用于合并Deep。
   * @param target - target parameter (`object`) / 目标参数（`object`）
   * @param source - source parameter (`object`) / 源参数（`object`）
   * @param ignoreUndefined - ignore undefined parameter (`any`) / 忽略未定义参数（`any`）
   * @returns Result of type `any` / 类型为 `any` 的返回值
   */
  static mergeDeep(
    target: object,
    source: object,
    ignoreUndefined = false
  ) {
    const output = Object.assign({}, target);
    if (ObjectUtils.isObject(target) && ObjectUtils.isObject(source)) {
      Object.keys(source)
        .filter(key => !ObjectUtils.isUnsafeKey(key) && (!ignoreUndefined || source[key] !== undefined))
        .forEach(key => {
          if (ObjectUtils.isObject(source[key])) {
            if (!Object.prototype.hasOwnProperty.call(target, key)) {
              Object.assign(output, { [key]: source[key] });
            } else {
              output[key] = ObjectUtils.mergeDeep(
                target[key],
                source[key],
                ignoreUndefined
              );
            }
          } else {
            Object.assign(output, { [key]: source[key] });
          }
        });
    }
    return output;
  }

  /**
   * Executes `removeUndefined` to handle remove undefined.
   * @zh 执行 `removeUndefined`，用于移除未定义。
   * @param obj - obj parameter (`object`) / 对象参数（`object`）
   * @returns Result of type `any` / 类型为 `any` 的返回值
   */
  static removeUndefined(obj: object) {
    const output = {};
    if (ObjectUtils.isObject(obj)) {
      Object.keys(obj)
        .filter(key => obj[key] !== undefined)
        .forEach(key => {
          if (ObjectUtils.isObject(obj[key]) || Array.isArray(obj[key])) {
            output[key] = ObjectUtils.removeUndefined(obj[key]);
          } else {
            output[key] = obj[key];
          }
        });

      return output;
    }

    if (Array.isArray(obj)) {
      return obj.map(o => ObjectUtils.removeUndefined(o));
    }

    return obj;
  }

  /**
   * Executes `copyDeep` to handle copy deep.
   * @zh 执行 `copyDeep`，用于复制Deep。
   * @param src - src parameter (`any`) / 源路径参数（`any`）
   * @returns Result of type `any` / 类型为 `any` 的返回值
   */
  static copyDeep(src) {
    const target = Array.isArray(src) ? [] : {};
    for (const prop in src) {
      if (src.hasOwnProperty(prop)) {
        const value = src[prop];
        if (value && typeof value === 'object') {
          target[prop] = this.copyDeep(value);
        } else {
          target[prop] = value;
        }
      }
    }
    return target;
  }

  /**
   * Executes `removeNull` to handle remove null.
   * @zh 执行 `removeNull`，用于移除空值。
   * @param obj - obj parameter (`object`) / 对象参数（`object`）
   * @returns Result of type `any` / 类型为 `any` 的返回值
   */
  static removeNull(obj: object) {
    const output = {};
    if (ObjectUtils.isObject(obj)) {
      Object.keys(obj)
        .filter(key => obj[key] !== null)
        .forEach(key => {
          if (ObjectUtils.isObject(obj[key]) || Array.isArray(obj[key])) {
            output[key] = ObjectUtils.removeNull(obj[key]);
          } else {
            output[key] = obj[key];
          }
        });

      return output;
    }

    if (Array.isArray(obj)) {
      return obj.map(o => ObjectUtils.removeNull(o));
    }

    return obj;
  }

  /**
   * Executes `naturalCompare` to handle natural compare.
   * @zh 执行 `naturalCompare`，用于natural比较。
   * @param a - a parameter (`any`) / a参数（`any`）
   * @param b - b parameter (`any`) / b参数（`any`）
   * @param direction - direction parameter (`any`) / 方向参数（`any`）
   * @param nullFirst - null first parameter (`any`) / 空值首个参数（`any`）
   */
  static naturalCompare(a, b, direction = 'asc', nullFirst = false) {
    if (direction === 'desc') {
      b = [a, (a = b)][0];
    }

    if (a === undefined || a === null || a === '') {
      if (direction === 'desc') {
        return nullFirst ? -1 : 1;
      }
      return nullFirst ? 1 : -1;
    }
    if (b === undefined || b === null || b === '') {
      if (direction === 'desc') {
        return nullFirst ? 1 : -1;
      }
      return nullFirst ? -1 : 1;
    }

    const ax = [];
    const bx = [];
    a = '' + a;
    b = '' + b;

    a.replace(/(\d+)|(\D+)/g, (_, $1, $2) => {
      ax.push([$1 || Infinity, $2 || '']);
    });

    b.replace(/(\d+)|(\D+)/g, (_, $1, $2) => {
      bx.push([$1 || Infinity, $2 || '']);
    });

    while (ax.length && bx.length) {
      const an = ax.shift();
      const bn = bx.shift();
      const nn = an[0] - bn[0] || an[1].localeCompare(bn[1]);
      if (nn) {
        return nn;
      }
    }

    return ax.length - bx.length;
  }

  /**
   * Return true if two object are equivalent.
   * Objects are considered equivalent if they have the same properties and
   * if all of their properties (first-level only) share the same value.
   * @param obj1 First object
   * @param obj2 Second object
   * @returns Whether two objects arer equivalent

   * @zh 执行 `objectsAreEquivalent`，用于对象AreEquivalent。
   */
  static objectsAreEquivalent(obj1: object, obj2: object): boolean {
    if (obj1 === obj2) {
      return true;
    }

    const obj1Props = Object.getOwnPropertyNames(obj1);
    const obj2Props = Object.getOwnPropertyNames(obj2);
    if (obj1Props.length !== obj2Props.length) {
      return false;
    }

    for (const prop of obj1Props) {
      if (obj1[prop] !== obj2[prop]) {
        return false;
      }
    }

    return true;
  }

  /**
   * Return a new object with an array of keys removed
   * @param obj Source object
   * @param keys Keys to remove
   * @returns A new object

   * @zh 执行 `removeKeys`，用于移除键列表。
   */
  static removeKeys(obj: object, keys: string[]): object {
    const newObj = Object.keys(obj)
      .filter(key => keys.indexOf(key) < 0)
      .reduce((_obj, key) => {
        _obj[key] = obj[key];
        return _obj;
      }, {});

    return newObj;
  }
}
