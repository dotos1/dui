import { ComponentFactory, ComponentFactoryResolver, Type } from '@angular/core';
import {isUndefined,isFunction,clone,isObjectLike,isNull,each,isArray} from 'lodash';
import { isBlankString, isNullOrUndefined } from '../base';

// @dynamic
export class DuiBase {

  private static componentFactoryMap: Map<string, ComponentFactory<any>>=  new Map<string, ComponentFactory<any>>();

  static registerComponentFactory(
    componentFactoryResolver: ComponentFactoryResolver, 
    components:Type<any>[]) {
    if ( Array.isArray(components) && components.length > 0) {
      components.forEach(compType => {
        const componentFactory= componentFactoryResolver.resolveComponentFactory(compType);
        DuiBase.componentFactoryMap.set(componentFactory.selector,componentFactory);
      });
    }
  }

  static hasComponentFactory(type: string): boolean {
    return DuiBase.componentFactoryMap.has(type);
  }

  static getComponentFactory(selector: string): ComponentFactory<any> {
    return DuiBase.componentFactoryMap.get(selector);
  }


  public static emptyFn() { }

  public static toggleInArray(item, array): void {
    if (array.indexOf(item) === -1) {
      array.push(item);
    } else {
      array.splice(array.indexOf(item), 1);
    }
  }

  public static handleize(text): string {
    return text.toString().toLowerCase()
      .replace(/\s+/g, '-')           // Replace spaces with -
      .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
      .replace(/\-\-+/g, '-')         // Replace multiple - with single -
      .replace(/^-+/, '')             // Trim - from start of text
      .replace(/-+$/, '');            // Trim - from end of text
  }

  public static apply(o, c, defaults?) {
    if (defaults) {
      DuiBase.apply(o, defaults);
    }
    if (o && c && typeof c === 'object') {
      for (const p in c) {
        try {
          o[p] = c[p];
        } catch (error) {
          console.error(error + ':' + p);
        }
      }
    }
    return o;
  }

  public static applyIf(o, c) {
    if (o) {
      for (const p in c) {
        if (isUndefined(o[p])) {
          o[p] = c[p];
        }
      }
    }
    return o;
  }

  public static override(origclass, overrides) {
    if (overrides) {
      const p = origclass.prototype;
      DuiBase.apply(p, overrides);
      if (overrides.hasOwnProperty('toString')) {
        p.toString = overrides.toString;
      }
    }
  }
  public static getFieldByType(type: string) {
    const factory: any = DuiBase.getComponentFactory(type);
    if (factory) {
      return factory.componentType;
    } else {
      throw new Error(type + ' not exits in factory');
    }
  }

  public static getCmp(id: string) {
    const factory: any = DuiBase.getComponentFactory(id);
    if (factory) {
      return factory.componentType;
    } else {
      throw new Error(id + ' not exits in factory');
    }
  }

  public static getKey(controlKey: string, actualKey: string) {
    return actualKey ? actualKey + '.' + controlKey : controlKey;
  }

  public static reverseDeepMerge(dest: any, ...args: any[]) {
    args.forEach(src => {
      for (const srcArg in src) {
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
  public static defineHiddenProp(field, prop, defaultValue) {
    Object.defineProperty(field, prop, { enumerable: false, writable: true, configurable: true });
    field[prop] = defaultValue;
  }
  public static objAndSameType(obj1: any, obj2: any) {
    return isObjectLike(obj1) && isObjectLike(obj2)
      && Object.getPrototypeOf(obj1) === Object.getPrototypeOf(obj2)
      && !(Array.isArray(obj1) || Array.isArray(obj2));
  }
  public static stringIsInteger(str: string) {
    return (!isUndefined(str)||!isNull(str)) && /^\d+$/.test(str);
  }

  public static evalFunctionExpression(expression: string, argNames: string[]) {
    try {
      return Function(...argNames, `${expression}`) as any;
    } catch (error) {
      console.error(error);
    }
  }

  public static evalStringExpression(expression: string, argNames: string[]) {

    try {
      return Function(...argNames, `return ${expression};`) as any;
    } catch (error) {
      console.error(error);
    }
  }

  public static evalExpressionValueSetter(expression: string, argNames: string[]) {
    try {
      return Function(...argNames, `${expression} = expressionValue;`) as (value: any) => void;
    } catch (error) {
      console.error(error);
      return ()=>{};
    }
  }
  public static evalExpression(expression: string | Function | boolean, thisArg: any, argVal: any[]): any {
    if (expression instanceof Function) {
      return expression.apply(thisArg, argVal);
    } else {
      return expression ? true : false;
    }
  }

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

  public static escapeRe(s) {
    return s.replace(/([-.*+?^${}()|[\]\/\\])/g, '\\$1');
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
  public static intercept(o, name, fn, scope?) {
    o[name] = o[name].createInterceptor(fn, scope);
  }


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
  public static format(...var_args) {
    const format = DuiBase.toArray(arguments)[0];
    const args = DuiBase.toArray(arguments, 1);
    return format.replace(/\{(\d+)\}/g, function (m, i) {
      return args[i];
    });
  }

  public static toArray(a, i?, j?) {
    return Array.prototype.slice.call(a, i || 0, j || a.length);
  }

  public static filterArrayByString(mainArr, searchText): any {
    if (searchText === '') {
      return mainArr;
    }

    searchText = searchText.toLowerCase();

    return mainArr.filter(itemObj => {
      return this.searchInObj(itemObj, searchText);
    });
  }

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

  public static searchInString(value, searchText): any {
    return value.toLowerCase().includes(searchText);
  }
}
