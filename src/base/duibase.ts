/**
 * @fileoverview Module `src/base/duibase.ts` providing duibase definitions and implementation.
 * @zh 模块文件 `src/base/duibase.ts`，提供duibase相关的定义与实现。
 */

import { ComponentFactory, ComponentFactoryResolver, Type } from '@angular/core';
import { clone, each, isArray, isFunction, isNull, isObjectLike, isUndefined } from 'lodash-es';
import { isBlankString, isNullOrUndefined } from '../base';

// @dynamic
/**
 * Class `DuiBase` encapsulating dui base data structures and logic in `src/base`.
 * @zh 类 `DuiBase`，封装 `src/base` 中的DUI基础数据结构与处理逻辑。
 */
export class DuiBase {

  /**
   * Property `componentFactoryMap` (`Map<string, ComponentFactory<unknown>>`) storing component factory map.
   * @zh 属性 `componentFactoryMap`（类型：`Map<string, ComponentFactory<unknown>>`），用于存储或配置组件工厂映射表。
   */
  private static componentFactoryMap: Map<string, ComponentFactory<unknown>>=  new Map<string, ComponentFactory<unknown>>();

  /**
   * Executes `registerComponentFactory` to handle register component factory.
   * @zh 执行 `registerComponentFactory`，用于注册组件工厂。
   * @param componentFactoryResolver - component factory resolver parameter (`ComponentFactoryResolver`) / 组件工厂解析器参数（`ComponentFactoryResolver`）
   * @param components - components parameter (`Type<unknown>[]`) / 组件列表参数（`Type<unknown>[]`）
   */
  static registerComponentFactory(
    componentFactoryResolver: ComponentFactoryResolver, 
    components:Type<unknown>[]) {
    if ( Array.isArray(components) && components.length > 0) {
      components.forEach(compType => {
        const componentFactory= componentFactoryResolver.resolveComponentFactory(compType);
        DuiBase.componentFactoryMap.set(componentFactory.selector,componentFactory);
      });
    }
  }

  /**
   * Executes `hasComponentFactory` to handle has component factory.
   * @zh 执行 `hasComponentFactory`，用于是否包含组件工厂。
   * @param type - type parameter (`string`) / 类型参数（`string`）
   * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
   */
  static hasComponentFactory(type: string): boolean {
    return DuiBase.componentFactoryMap.has(type);
  }

  /**
   * Executes `getComponentFactory` to handle get component factory.
   * @zh 执行 `getComponentFactory`，用于获取组件工厂。
   * @param selector - selector parameter (`string`) / 选择器参数（`string`）
   * @returns Result of type `ComponentFactory<unknown>` / 类型为 `ComponentFactory<unknown>` 的返回值
   */
  static getComponentFactory(selector: string): ComponentFactory<unknown> {
    return DuiBase.componentFactoryMap.get(selector);
  }


  /**
   * Executes `emptyFn` to handle empty fn.
   * @zh 执行 `emptyFn`，用于空函数。
   */
  public static emptyFn() { }

  /**
   * Executes `toggleInArray` to handle toggle in array.
   * @zh 执行 `toggleInArray`，用于开关在数组。
   * @param item - item parameter (`T`) / 条目参数（`T`）
   * @param array - array parameter (`T[]`) / 数组参数（`T[]`）
   */
  public static toggleInArray<T>(item: T, array: T[]): void {
    if (array.indexOf(item) === -1) {
      array.push(item);
    } else {
      array.splice(array.indexOf(item), 1);
    }
  }

  /**
   * Executes `handleize` to handle handleize.
   * @zh 执行 `handleize`，用于handleize。
   * @param text - text parameter (`string | number`) / 文本参数（`string | number`）
   * @returns Result of type `string` / 类型为 `string` 的返回值
   */
  public static handleize(text: string | number): string {
    return text.toString().toLowerCase()
      .replace(/\s+/g, '-')           // Replace spaces with -
      .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
      .replace(/\-\-+/g, '-')         // Replace multiple - with single -
      .replace(/^-+/, '')             // Trim - from start of text
      .replace(/-+$/, '');            // Trim - from end of text
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
   * Executes `apply` to handle apply.
   * @zh 执行 `apply`，用于应用。
   * @param o - o parameter (`T`) / o参数（`T`）
   * @param c - c parameter (`C`) / c参数（`C`）
   * @param defaults - defaults parameter (`object`) / 默认值集合参数（`object`）
   */
  public static apply<T extends object, C extends object>(o: T, c: C, defaults?: object): T & C {
    if (defaults) {
      DuiBase.apply(o, defaults);
    }
    if (o && c && typeof c === 'object') {
      for (const p in c) {
        if (DuiBase.isUnsafeKey(p)) {
          continue;
        }
        try {
          (o as Record<string, unknown>)[p] = c[p];
        } catch (error) {
          console.error(error + ':' + p);
        }
      }
    }
    return o as T & C;
  }

  /**
   * Executes `applyIf` to handle apply if.
   * @zh 执行 `applyIf`，用于应用If。
   * @param o - o parameter (`T`) / o参数（`T`）
   * @param c - c parameter (`C`) / c参数（`C`）
   */
  public static applyIf<T extends object, C extends object>(o: T, c: C): T & C {
    if (o) {
      for (const p in c) {
        if (DuiBase.isUnsafeKey(p)) {
          continue;
        }
        if (isUndefined((o as Record<string, unknown>)[p])) {
          (o as Record<string, unknown>)[p] = c[p];
        }
      }
    }
    return o as T & C;
  }

  /**
   * Executes `override` to handle override.
   * @zh 执行 `override`，用于override。
   * @param origclass - origclass parameter (`Function`) / origclass参数（`Function`）
   * @param overrides - overrides parameter (`object`) / overrides参数（`object`）
   */
  public static override(origclass: Function, overrides: object): void {
    if (overrides) {
      const p: Record<string, unknown> = origclass.prototype;
      DuiBase.apply(p, overrides);
      if (overrides.hasOwnProperty('toString')) {
        p.toString = overrides.toString;
      }
    }
  }
  /**
   * Executes `getFieldByType` to handle get field by type.
   * @zh 执行 `getFieldByType`，用于获取字段按类型。
   * @param type - type parameter (`string`) / 类型参数（`string`）
   */
  public static getFieldByType(type: string) {
    const factory = DuiBase.getComponentFactory(type);
    if (factory) {
      return factory.componentType;
    } else {
      throw new Error(type + ' not exits in factory');
    }
  }

  /**
   * Executes `getCmp` to handle get cmp.
   * @zh 执行 `getCmp`，用于获取Cmp。
   * @param id - id parameter (`string`) / 唯一标识参数（`string`）
   */
  public static getCmp(id: string) {
    const factory = DuiBase.getComponentFactory(id);
    if (factory) {
      return factory.componentType;
    } else {
      throw new Error(id + ' not exits in factory');
    }
  }

  /**
   * Executes `getKey` to handle get key.
   * @zh 执行 `getKey`，用于获取键。
   * @param controlKey - control key parameter (`string`) / 表单控件键参数（`string`）
   * @param actualKey - actual key parameter (`string`) / actual键参数（`string`）
   */
  public static getKey(controlKey: string, actualKey: string): string {
    return actualKey ? actualKey + '.' + controlKey : controlKey;
  }

  /**
   * Executes `reverseDeepMerge` to handle reverse deep merge.
   * @zh 执行 `reverseDeepMerge`，用于反向Deep合并。
   * @param dest - dest parameter (`any`) / 目标路径参数（`any`）
   * @param args - args parameter (`object[]`) / 参数列表参数（`object[]`）
   */
  public static reverseDeepMerge<T extends object>(target: T, ...args: object[]): T {
    const dest = target as Record<string, unknown>;
    args.forEach((source) => {
      const src = source as Record<string, unknown>;
      for (const srcArg in src) {
        if (DuiBase.isUnsafeKey(srcArg)) {
          continue;
        }
        if (isNullOrUndefined(dest[srcArg]) || isBlankString(dest[srcArg])) {
          if (isFunction(src[srcArg])) {
            dest[srcArg] = src[srcArg];
          } else {
            dest[srcArg] = clone(src[srcArg]);
          }
        } else if (DuiBase.objAndSameType(dest[srcArg], src[srcArg])) {
          DuiBase.reverseDeepMerge(dest[srcArg] as object, src[srcArg] as object);
        }
      }
    });
    return target;
  }
  /**
   * Executes `defineHiddenProp` to handle define hidden prop.
   * @zh 执行 `defineHiddenProp`，用于定义隐藏属性。
   * @param field - field parameter (`object`) / 字段参数（`object`）
   * @param prop - prop parameter (`string`) / 属性参数（`string`）
   * @param defaultValue - default value parameter (`unknown`) / 默认值参数（`unknown`）
   */
  public static defineHiddenProp(field: object, prop: string, defaultValue: unknown): void {
    Object.defineProperty(field, prop, { enumerable: false, writable: true, configurable: true });
    (field as Record<string, unknown>)[prop] = defaultValue;
  }
  /**
   * Executes `objAndSameType` to handle obj and same type.
   * @zh 执行 `objAndSameType`，用于对象And相同类型。
   * @param obj1 - obj1 parameter (`unknown`) / obj1参数（`unknown`）
   * @param obj2 - obj2 parameter (`unknown`) / obj2参数（`unknown`）
   */
  public static objAndSameType(obj1: unknown, obj2: unknown): boolean {
    return isObjectLike(obj1) && isObjectLike(obj2)
      && Object.getPrototypeOf(obj1) === Object.getPrototypeOf(obj2)
      && !(Array.isArray(obj1) || Array.isArray(obj2));
  }
  /**
   * Executes `stringIsInteger` to handle string is integer.
   * @zh 执行 `stringIsInteger`，用于字符串是否为Integer。
   * @param str - str parameter (`string`) / 字符串参数（`string`）
   */
  public static stringIsInteger(str: string): boolean {
    return (!isUndefined(str) && !isNull(str)) && /^\d+$/.test(str);
  }

  /**
   * Executes `evalFunctionExpression` to handle eval function expression.
   * @zh 执行 `evalFunctionExpression`，用于求值函数表达式。
   * @param expression - expression parameter (`string`) / 表达式参数（`string`）
   * @param argNames - arg names parameter (`string[]`) / 参数名称列表参数（`string[]`）
   */
  public static evalFunctionExpression(expression: string, argNames: string[]): Function | undefined {
    try {
      return Function(...argNames, `${expression}`);
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }

  /**
   * Executes `evalStringExpression` to handle eval string expression.
   * @zh 执行 `evalStringExpression`，用于求值字符串表达式。
   * @param expression - expression parameter (`string`) / 表达式参数（`string`）
   * @param argNames - arg names parameter (`string[]`) / 参数名称列表参数（`string[]`）
   */
  public static evalStringExpression(expression: string, argNames: string[]): Function | undefined {

    try {
      return Function(...argNames, `return ${expression};`);
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }

  /**
   * Executes `evalExpressionValueSetter` to handle eval expression value setter.
   * @zh 执行 `evalExpressionValueSetter`，用于求值表达式值Setter。
   * @param expression - expression parameter (`string`) / 表达式参数（`string`）
   * @param argNames - arg names parameter (`string[]`) / 参数名称列表参数（`string[]`）
   */
  public static evalExpressionValueSetter(expression: string, argNames: string[]): (...args: unknown[]) => void {
    if (/(?:^|\.|\[['"`]?)(?:__proto__|constructor|prototype)\b/.test(expression)) {
      return () => {};
    }
    try {
      return Function(...argNames, `${expression} = expressionValue;`) as (...args: unknown[]) => void;
    } catch (error) {
      console.error(error);
      return ()=>{};
    }
  }
  /**
   * Executes `evalExpression` to handle eval expression.
   * @zh 执行 `evalExpression`，用于求值表达式。
   * @param expression - expression parameter (`string | boolean | Function`) / 表达式参数（`string | boolean | Function`）
   * @param thisArg - this arg parameter (`unknown`) / this参数参数（`unknown`）
   * @param argVal - arg val parameter (`unknown[]`) / 参数值参数（`unknown[]`）
   * @returns Result of type `unknown` / 类型为 `unknown` 的返回值
   */
  public static evalExpression(expression: string | Function | boolean, thisArg: unknown, argVal: unknown[]): unknown {
    if (expression instanceof Function) {
      return expression.apply(thisArg, argVal);
    } else {
      return expression ? true : false;
    }
  }

  /**
   * Executes `copyTo` to handle copy to.
   * @zh 执行 `copyTo`，用于复制转换为。
   * @param dest - dest parameter (`T`) / 目标路径参数（`T`）
   * @param source - source parameter (`object`) / 源参数（`object`）
   * @param names - names parameter (`string | string[]`) / 名称列表参数（`string | string[]`）
   */
  public static copyTo<T extends object>(dest: T, source: object, names: string | string[]): T {
    const list = typeof names == 'string' ? names.split(/[,;\s]/) : names;
    each(list, (name: string) => {
      if (source.hasOwnProperty(name)) {
        (dest as Record<string, unknown>)[name] = (source as Record<string, unknown>)[name];
      }
    });
    return dest;
  }
  /**
   * Executes `isEmpty` to handle is empty.
   * @zh 执行 `isEmpty`，用于是否为空。
   * @param v - v parameter (`unknown`) / v参数（`unknown`）
   * @param allowBlank - allow blank parameter (`boolean`) / 允许Blank参数（`boolean`）
   */
  public static isEmpty(v: unknown, allowBlank?: boolean): boolean {
    if (isObjectLike(v)) {
      let empty = true;
      for (const i in v as object) {
        if ((v as Record<string, unknown>)[i]) {
          empty = false;
        }
      }
      return empty;
    } else {
      return v === null
        || v === undefined
        || ((Array.isArray(v) && !v.length))
        || (!allowBlank ? v === '' : false);
    }
  }

  /**
   * Executes `escapeRe` to handle escape re.
   * @zh 执行 `escapeRe`，用于escapeRe。
   * @param s - s parameter (`string`) / s参数（`string`）
   */
  public static escapeRe(s: string): string {
    return s.replace(/([-.*+?^${}()|[\]\/\\])/g, '\\$1');
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  /**
   * Executes `destroy` to handle destroy.
   * @zh 执行 `destroy`，用于销毁。
   * @param args - args parameter (`unknown[]`) / 参数列表参数（`unknown[]`）
   */
  static destroy(...args: unknown[]): void {
    each(args, (arg: unknown) => {
      if (!arg) {
        return;
      }
      if (Array.isArray(arg)) {
        this.destroy(...arg);
        return;
      }
      const target = arg as { destroy?: () => void; dom?: unknown; remove?: () => void };
      if (typeof target.destroy === 'function') {
        target.destroy();
      } else if (target.dom) {
        target.remove?.();
      }
    });
  }
  public static intercept(o: object, name: string, fn: Function, scope?: object): void {
    const target = o as Record<string, { createInterceptor: (fn: Function, scope?: object) => unknown }>;
    target[name] = target[name].createInterceptor(fn, scope) as typeof target[string];
  }


  /**
   * Executes `callback` to handle callback.
   * @zh 执行 `callback`，用于回调函数。
   * @param cb - cb parameter (`unknown`) / cb参数（`unknown`）
   * @param scope - scope parameter (`object`) / scope参数（`object`）
   * @param args - args parameter (`unknown[]`) / 参数列表参数（`unknown[]`）
   * @param delay - delay parameter (`number`) / 延迟参数（`number`）
   */
  public static callback(cb: unknown, scope: object, args?: unknown[], delay?: number): void {
    if (typeof cb === 'function') {
      if (delay) {
        (cb as Function & { defer: (delay: number, scope: object, args: unknown[]) => void }).defer(delay, scope, args || []);
      } else {
        cb.apply(scope, args || []);
      }
    }
  }


  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  /**
   * Executes `format` to handle format.
   * @zh 执行 `format`，用于格式化。
   * @param var_args - var args parameter (`unknown[]`) / var参数列表参数（`unknown[]`）
   */
  public static format(...var_args: unknown[]): string {
    const format = String(var_args[0]);
    const args = var_args.slice(1);
    return format.replace(/\{(\d+)\}/g, function (m: string, i: string) {
      return String(args[Number(i)]);
    });
  }

  /**
   * Executes `toArray` to handle to array.
   * @zh 执行 `toArray`，用于转换为数组。
   * @param a - a parameter (`ArrayLike<T>`) / a参数（`ArrayLike<T>`）
   * @param i - i parameter (`number`) / i参数（`number`）
   * @param j - j parameter (`number`) / j参数（`number`）
   */
  public static toArray<T>(a: ArrayLike<T>, i?: number, j?: number): T[] {
    return Array.prototype.slice.call(a, i || 0, j || a.length);
  }

  /**
   * Executes `filterArrayByString` to handle filter array by string.
   * @zh 执行 `filterArrayByString`，用于过滤数组按字符串。
   * @param mainArr - main arr parameter (`T[]`) / 主Arr参数（`T[]`）
   * @param searchText - search text parameter (`string`) / 搜索文本参数（`string`）
   * @returns Result of type `T[]` / 类型为 `T[]` 的返回值
   */
  public static filterArrayByString<T>(mainArr: T[], searchText: string): T[] {
    if (searchText === '') {
      return mainArr;
    }

    searchText = searchText.toLowerCase();

    return mainArr.filter(itemObj => {
      return this.searchInObj(itemObj, searchText);
    });
  }

  /**
   * Executes `searchInObj` to handle search in obj.
   * @zh 执行 `searchInObj`，用于搜索在对象。
   * @param itemObj - item obj parameter (`unknown`) / 条目对象参数（`unknown`）
   * @param searchText - search text parameter (`string`) / 搜索文本参数（`string`）
   * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
   */
  public static searchInObj(itemObj: unknown, searchText: string): boolean {
    for (const prop in itemObj as object) {
      if (!Object.prototype.hasOwnProperty.call(itemObj, prop)) {
        continue;
      }

      const value: unknown = (itemObj as Record<string, unknown>)[prop];

      if (typeof value === 'string') {
        if (this.searchInString(value, searchText)) {
          return true;
        }
      } else if (Array.isArray(value)) {
        if (this.searchInArray(value, searchText)) {
          return true;
        }
      }

      if (typeof value === 'object') {
        if (this.searchInObj(value, searchText)) {
          return true;
        }
      }
    }
    return false;
  }

  /**
   * Search in array
   *
   *  arr
   *  searchText
   *  {boolean}

   * @zh 执行 `searchInArray`，用于搜索在数组。
   */
  public static searchInArray(arr: unknown[], searchText: string): boolean {
    for (const value of arr) {
      if (typeof value === 'string') {
        if (this.searchInString(value, searchText)) {
          return true;
        }
      }
      if (typeof value === 'object') {
        if (this.searchInObj(value, searchText)) {
          return true;
        }
      }
    }
    return false;
  }

  /**
   * Executes `searchInString` to handle search in string.
   * @zh 执行 `searchInString`，用于搜索在字符串。
   * @param value - value parameter (`string`) / 值参数（`string`）
   * @param searchText - search text parameter (`string`) / 搜索文本参数（`string`）
   * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
   */
  public static searchInString(value: string, searchText: string): boolean {
    return value.toLowerCase().includes(searchText);
  }
}
