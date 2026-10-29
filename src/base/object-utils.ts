/**
 * @fileoverview Module `src/base/object-utils.ts` providing object utils definitions and implementation.
 * @zh 模块文件 `src/base/object-utils.ts`，提供对象工具集相关的定义与实现。
 */

/**
 * Class `ObjectUtils` encapsulating object utils data structures and logic in `src/base`.
 * @zh 类 `ObjectUtils`，封装 `src/base` 中的对象工具集数据结构与处理逻辑。
 */
/** 任意键值对象 */
type Dict = Record<string, unknown>;

/** 把对象视作键值表读写（这些工具函数本来就按任意键访问） */
const asDict = (o: object): Dict => o as Dict;

export class ObjectUtils {

  /**
   * Executes `getValue` to handle get value.
   * @zh 执行 `getValue`，用于获取值。
   * @param target - target parameter (`any`) / 目标参数（`any`）
   * @param key - key parameter (`string`) / 键参数（`string`）
   * @returns Result of type `any` / 类型为 `any` 的返回值
   */
  static getValue(source: unknown, key: string): unknown {

    if (!source) {
      return undefined;
    }

    let target: unknown = source;
    const keys = key.split('.');
    key = '';

    do {
      key += keys.shift();
      const value = asDict(target as object)[key];
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
  static merge(...objects: unknown[]): Dict {
    const result: Dict = {};

    objects.forEach((source) => {
      if (!source || typeof source !== 'object') {
        return;
      }
      const src = asDict(source);
      Object.keys(src).forEach((prop) => {
        if (ObjectUtils.isUnsafeKey(prop)) {
          return;
        }
        const existing = result[prop];
        if (Object.prototype.hasOwnProperty.call(result, prop) && Array.isArray(existing)) {
          result[prop] = existing.concat(src[prop]);
        } else if (Object.prototype.hasOwnProperty.call(result, prop) && result[prop] && typeof result[prop] === 'object') {
          result[prop] = ObjectUtils.merge(result[prop], src[prop]);
        } else {
          result[prop] = src[prop];
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
  static resolve(obj: object, key: string): unknown {
    const keysArray = key
      .replace(/\[/g, '.')
      .replace(/\]/g, '')
      .split('.');
    let current: unknown = obj;
    while (keysArray.length) {
      if (typeof current !== 'object') {
        return undefined;
      }
      current = asDict(current)[keysArray.shift()];
    }

    return current;
  }

  /**
   * Executes `isObject` to handle is object.
   * @zh 执行 `isObject`，用于是否为对象。
   * @param item - item parameter (`object`) / 条目参数（`object`）
   */
  static isObject(item: unknown): item is object {
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
  ): Dict {
    const output: Dict = Object.assign({}, asDict(target));
    if (ObjectUtils.isObject(target) && ObjectUtils.isObject(source)) {
      const src = asDict(source);
      const tgt = asDict(target);
      Object.keys(src)
        .filter(key => !ObjectUtils.isUnsafeKey(key) && (!ignoreUndefined || src[key] !== undefined))
        .forEach(key => {
          const value = src[key];
          if (ObjectUtils.isObject(value)) {
            if (!Object.prototype.hasOwnProperty.call(target, key)) {
              Object.assign(output, { [key]: value });
            } else {
              output[key] = ObjectUtils.mergeDeep(
                tgt[key] as object,
                value,
                ignoreUndefined
              );
            }
          } else {
            Object.assign(output, { [key]: value });
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
  static removeUndefined(obj: unknown): unknown {
    const output: Dict = {};
    if (ObjectUtils.isObject(obj)) {
      const src = asDict(obj);
      Object.keys(src)
        .filter(key => src[key] !== undefined)
        .forEach(key => {
          const value = src[key];
          if (ObjectUtils.isObject(value) || Array.isArray(value)) {
            output[key] = ObjectUtils.removeUndefined(value);
          } else {
            output[key] = value;
          }
        });

      return output;
    }

    if (Array.isArray(obj)) {
      return obj.map((o: unknown) => ObjectUtils.removeUndefined(o));
    }

    return obj;
  }

  /**
   * Executes `copyDeep` to handle copy deep.
   * @zh 执行 `copyDeep`，用于复制Deep。
   * @param src - src parameter (`any`) / 源路径参数（`any`）
   * @returns Result of type `any` / 类型为 `any` 的返回值
   */
  static copyDeep<T>(src: T): T {
    if (Array.isArray(src)) {
      return src.map((value: unknown) => (value && typeof value === 'object' ? this.copyDeep(value) : value)) as T;
    }
    const target: Dict = {};
    const source = asDict(src as object);
    for (const prop in source) {
      if (Object.prototype.hasOwnProperty.call(source, prop)) {
        const value = source[prop];
        if (value && typeof value === 'object') {
          target[prop] = this.copyDeep(value);
        } else {
          target[prop] = value;
        }
      }
    }
    return target as T;
  }

  /**
   * Executes `removeNull` to handle remove null.
   * @zh 执行 `removeNull`，用于移除空值。
   * @param obj - obj parameter (`object`) / 对象参数（`object`）
   * @returns Result of type `any` / 类型为 `any` 的返回值
   */
  static removeNull(obj: unknown): unknown {
    const output: Dict = {};
    if (ObjectUtils.isObject(obj)) {
      const src = asDict(obj);
      Object.keys(src)
        .filter(key => src[key] !== null)
        .forEach(key => {
          const value = src[key];
          if (ObjectUtils.isObject(value) || Array.isArray(value)) {
            output[key] = ObjectUtils.removeNull(value);
          } else {
            output[key] = value;
          }
        });

      return output;
    }

    if (Array.isArray(obj)) {
      return obj.map((o: unknown) => ObjectUtils.removeNull(o));
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
  static naturalCompare(left: unknown, right: unknown, direction = 'asc', nullFirst = false): number {
    let a = left;
    let b = right;
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

    // 拆成 [数字段, 非数字段] 的序列逐段比较；数字段为空时记 Infinity
    const ax: Array<[number, string]> = [];
    const bx: Array<[number, string]> = [];
    const sa = '' + a;
    const sb = '' + b;

    sa.replace(/(\d+)|(\D+)/g, (_: string, $1: string, $2: string) => {
      ax.push([$1 ? Number($1) : Infinity, $2 || '']);
      return _;
    });

    sb.replace(/(\d+)|(\D+)/g, (_: string, $1: string, $2: string) => {
      bx.push([$1 ? Number($1) : Infinity, $2 || '']);
      return _;
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
      if (asDict(obj1)[prop] !== asDict(obj2)[prop]) {
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
      .reduce((_obj: Dict, key) => {
        _obj[key] = asDict(obj)[key];
        return _obj;
      }, {});

    return newObj;
  }
}
