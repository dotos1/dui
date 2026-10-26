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
   * Property `componentFactoryMap` (`Map<string, ComponentFactory<any>>`) storing component factory map.
   * @zh 属性 `componentFactoryMap`（类型：`Map<string, ComponentFactory<any>>`），用于存储或配置组件工厂映射表。
   */
  private static componentFactoryMap: Map<string, ComponentFactory<unknown>>=  new Map<string, ComponentFactory<unknown>>();

  /**
   * Executes `registerComponentFactory` to handle register component factory.
   * @zh 执行 `registerComponentFactory`，用于注册组件工厂。
   * @param componentFactoryResolver - component factory resolver parameter (`ComponentFactoryResolver`) / 组件工厂解析器参数（`ComponentFactoryResolver`）
   * @param components - components parameter (`Type<any>[]`) / 组件列表参数（`Type<any>[]`）
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
   * @returns Result of type `ComponentFactory<any>` / 类型为 `ComponentFactory<any>` 的返回值
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
   * @param item - item parameter (`any`) / 条目参数（`any`）
   * @param array - array parameter (`any`) / 数组参数（`any`）
   */
  public static toggleInArray(item, array): void {
    if (array.indexOf(item) === -1) {
      array.push(item);
    } else {
      array.splice(array.indexOf(item), 1);
    }
  }

  /**
   * Executes `handleize` to handle handleize.
   * @zh 执行 `handleize`，用于handleize。
   * @param text - text parameter (`any`) / 文本参数（`any`）
   * @returns Result of type `string` / 类型为 `string` 的返回值
   */
  public static handleize(text): string {
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
   * @param o - o parameter (`any`) / o参数（`any`）
   * @param c - c parameter (`any`) / c参数（`any`）
   * @param defaults - defaults parameter (`any`) / 默认值集合参数（`any`）
   */
  public static apply(o, c, defaults?) {
    if (defaults) {
      DuiBase.apply(o, defaults);
    }
    if (o && c && typeof c === 'object') {
      for (const p in c) {
        if (DuiBase.isUnsafeKey(p)) {
          continue;
        }
        try {
          o[p] = c[p];
        } catch (error) {
          console.error(error + ':' + p);
        }
      }
    }
    return o;
  }

  /**
   * Executes `applyIf` to handle apply if.
   * @zh 执行 `applyIf`，用于应用If。
   * @param o - o parameter (`any`) / o参数（`any`）
   * @param c - c parameter (`any`) / c参数（`any`）
   */
  public static applyIf(o, c) {
    if (o) {
      for (const p in c) {
        if (DuiBase.isUnsafeKey(p)) {
          continue;
        }
        if (isUndefined(o[p])) {
          o[p] = c[p];
        }
      }
    }
    return o;
  }

  /**
   * Executes `override` to handle override.
   * @zh 执行 `override`，用于override。
   * @param origclass - origclass parameter (`any`) / origclass参数（`any`）
   * @param overrides - overrides parameter (`any`) / overrides参数（`any`）
   */
  public static override(origclass, overrides) {
    if (overrides) {
      const p = origclass.prototype;
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
  public static getKey(controlKey: string, actualKey: string) {
    return actualKey ? actualKey + '.' + controlKey : controlKey;
  }

  /**
   * Executes `reverseDeepMerge` to handle reverse deep merge.
   * @zh 执行 `reverseDeepMerge`，用于反向Deep合并。
   * @param dest - dest parameter (`any`) / 目标路径参数（`any`）
   * @param args - args parameter (`any[]`) / 参数列表参数（`any[]`）
   */
  public static reverseDeepMerge(dest, ...args) {
    args.forEach(src => {
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
          DuiBase.reverseDeepMerge(dest[srcArg], src[srcArg]);
        }
      }
    });
    return dest;
  }
  /**
   * Executes `defineHiddenProp` to handle define hidden prop.
   * @zh 执行 `defineHiddenProp`，用于define隐藏属性。
   * @param field - field parameter (`any`) / 字段参数（`any`）
   * @param prop - prop parameter (`any`) / 属性参数（`any`）
   * @param defaultValue - default value parameter (`any`) / 默认值参数（`any`）
   */
  public static defineHiddenProp(field, prop, defaultValue) {
    Object.defineProperty(field, prop, { enumerable: false, writable: true, configurable: true });
    field[prop] = defaultValue;
  }
  /**
   * Executes `objAndSameType` to handle obj and same type.
   * @zh 执行 `objAndSameType`，用于对象And相同类型。
   * @param obj1 - obj1 parameter (`any`) / obj1参数（`any`）
   * @param obj2 - obj2 parameter (`any`) / obj2参数（`any`）
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
  public static stringIsInteger(str: string) {
    return (!isUndefined(str) && !isNull(str)) && /^\d+$/.test(str);
  }

  /**
   * Executes `evalFunctionExpression` to handle eval function expression.
   * @zh 执行 `evalFunctionExpression`，用于eval函数表达式。
   * @param expression - expression parameter (`string`) / 表达式参数（`string`）
   * @param argNames - arg names parameter (`string[]`) / 参数名称列表参数（`string[]`）
   */
  public static evalFunctionExpression(expression: string, argNames: string[]) {
    try {
      return Function(...argNames, `${expression}`);
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }

  /**
   * Executes `evalStringExpression` to handle eval string expression.
   * @zh 执行 `evalStringExpression`，用于eval字符串表达式。
   * @param expression - expression parameter (`string`) / 表达式参数（`string`）
   * @param argNames - arg names parameter (`string[]`) / 参数名称列表参数（`string[]`）
   */
  public static evalStringExpression(expression: string, argNames: string[]) {

    try {
      return Function(...argNames, `return ${expression};`);
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }

  /**
   * Executes `evalExpressionValueSetter` to handle eval expression value setter.
   * @zh 执行 `evalExpressionValueSetter`，用于eval表达式值Setter。
   * @param expression - expression parameter (`string`) / 表达式参数（`string`）
   * @param argNames - arg names parameter (`string[]`) / 参数名称列表参数（`string[]`）
   */
  public static evalExpressionValueSetter(expression: string, argNames: string[]) {
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
   * @zh 执行 `evalExpression`，用于eval表达式。
   * @param expression - expression parameter (`string | Function | boolean`) / 表达式参数（`string | Function | boolean`）
   * @param thisArg - this arg parameter (`any`) / this参数参数（`any`）
   * @param argVal - arg val parameter (`any[]`) / 参数值参数（`any[]`）
   * @returns Result of type `any` / 类型为 `any` 的返回值
   */
  public static evalExpression(expression: string | Function | boolean, thisArg: unknown, argVal: unknown[]) {
    if (expression instanceof Function) {
      return expression.apply(thisArg, argVal);
    } else {
      return expression ? true : false;
    }
  }

  /**
   * Executes `copyTo` to handle copy to.
   * @zh 执行 `copyTo`，用于复制转换为。
   * @param dest - dest parameter (`any`) / 目标路径参数（`any`）
   * @param source - source parameter (`any`) / 源参数（`any`）
   * @param names - names parameter (`any`) / 名称列表参数（`any`）
   */
  public static copyTo(dest, source, names) {
    if (typeof names == 'string') {
      names = names.split(/[,;\s]/);
    }
    each(names, (name) => {
      if (source.hasOwnProperty(name)) {
        dest[name] = source[name];
      }
    });
    return dest;
  }
  /**
   * Executes `isEmpty` to handle is empty.
   * @zh 执行 `isEmpty`，用于是否为空。
   * @param v - v parameter (`any`) / v参数（`any`）
   * @param allowBlank - allow blank parameter (`any`) / 允许Blank参数（`any`）
   */
  public static isEmpty(v, allowBlank?) {
    if (isObjectLike(v)) {
      let empty = true;
      for (const i in v) {
        if (v[i]) {
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
   * @param s - s parameter (`any`) / s参数（`any`）
   */
  public static escapeRe(s) {
    return s.replace(/([-.*+?^${}()|[\]\/\\])/g, '\\$1');
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  /**
   * Executes `destroy` to handle destroy.
   * @zh 执行 `destroy`，用于销毁。
   * @param args - args parameter (`any`) / 参数列表参数（`any`）
   */
  static destroy(...args) {
    each(arguments, (arg) => {
      if (arg) {
        if (isArray(arg)) {
          // eslint-disable-next-line prefer-spread
          this.destroy.apply(this, arg);
        } else if (typeof arg.destroy === 'function') {
          arg.destroy();
        } else if (arg.dom) {
          arg.remove();
        }
      }
    });
  }
  /**
   * Executes `intercept` to handle intercept.
   * @zh 执行 `intercept`，用于intercept。
   * @param o - o parameter (`any`) / o参数（`any`）
   * @param name - name parameter (`any`) / 名称参数（`any`）
   * @param fn - fn parameter (`any`) / 函数参数（`any`）
   * @param scope - scope parameter (`any`) / scope参数（`any`）
   */
  public static intercept(o, name, fn, scope?) {
    o[name] = o[name].createInterceptor(fn, scope);
  }


  /**
   * Executes `callback` to handle callback.
   * @zh 执行 `callback`，用于回调函数。
   * @param cb - cb parameter (`any`) / cb参数（`any`）
   * @param scope - scope parameter (`any`) / scope参数（`any`）
   * @param args - args parameter (`any`) / 参数列表参数（`any`）
   * @param delay - delay parameter (`any`) / 延迟参数（`any`）
   */
  public static callback(cb, scope, args, delay?) {
    if (typeof cb === 'function') {
      if (delay) {
        cb.defer(delay, scope, args || []);
      } else {
        cb.apply(scope, args || []);
      }
    }
  }


  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  /**
   * Executes `format` to handle format.
   * @zh 执行 `format`，用于格式化。
   * @param var_args - var args parameter (`any`) / var参数列表参数（`any`）
   */
  public static format(...var_args) {
    const format = DuiBase.toArray(arguments)[0];
    const args = DuiBase.toArray(arguments, 1);
    return format.replace(/\{(\d+)\}/g, function (m, i) {
      return args[i];
    });
  }

  /**
   * Executes `toArray` to handle to array.
   * @zh 执行 `toArray`，用于转换为数组。
   * @param a - a parameter (`any`) / a参数（`any`）
   * @param i - i parameter (`any`) / i参数（`any`）
   * @param j - j parameter (`any`) / j参数（`any`）
   */
  public static toArray(a, i?, j?) {
    return Array.prototype.slice.call(a, i || 0, j || a.length);
  }

  /**
   * Executes `filterArrayByString` to handle filter array by string.
   * @zh 执行 `filterArrayByString`，用于过滤数组按字符串。
   * @param mainArr - main arr parameter (`any`) / 主Arr参数（`any`）
   * @param searchText - search text parameter (`any`) / 搜索文本参数（`any`）
   * @returns Result of type `any` / 类型为 `any` 的返回值
   */
  public static filterArrayByString(mainArr, searchText) {
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
   * @param itemObj - item obj parameter (`any`) / 条目对象参数（`any`）
   * @param searchText - search text parameter (`any`) / 搜索文本参数（`any`）
   * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
   */
  public static searchInObj(itemObj, searchText): boolean {
    for (const prop in itemObj) {
      if (!itemObj.hasOwnProperty(prop)) {
        continue;
      }

      const value = itemObj[prop];

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
  public static searchInArray(arr, searchText): boolean {
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
   * @param value - value parameter (`any`) / 值参数（`any`）
   * @param searchText - search text parameter (`any`) / 搜索文本参数（`any`）
   * @returns Result of type `any` / 类型为 `any` 的返回值
   */
  public static searchInString(value, searchText): boolean {
    return value.toLowerCase().includes(searchText);
  }
}
