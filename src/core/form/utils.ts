/**
 * @fileoverview Module `src/core/form/utils.ts` providing utils definitions and implementation.
 * @zh 模块文件 `src/core/form/utils.ts`，提供工具集相关的定义与实现。
 */

import { FieldConfig } from './models/field.config';
import { isObservable } from 'rxjs';
import { AbstractControl } from '@angular/forms';
import { FieldConfigCache } from './models';


/**
 * Executes `isUnsafeKey` to handle is unsafe key.
 * @zh 执行 `isUnsafeKey`，用于是否为Unsafe键。
 * @param key - key parameter (`any`) / 键参数（`any`）
 * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
 */
function isUnsafeKey(key): boolean {
  return key === '__proto__' || key === 'constructor' || key === 'prototype';
}

/**
 * Executes `getFieldId` to handle get field id.
 * @zh 执行 `getFieldId`，用于获取字段唯一标识。
 * @param formId - form id parameter (`string`) / 表单唯一标识参数（`string`）
 * @param field - field parameter (`FieldConfig`) / 字段参数（`FieldConfig`）
 * @param index - index parameter (`string | number`) / 索引参数（`string | number`）
 */
export function getFieldId(formId: string, field: FieldConfig, index: string|number) {
  if (field.id) {
    return field.id;
  }
  let type = field.type;
  if (!type && field.template) {
    type = 'template';
  }
  return [formId, type, field.name, index].join('_');
}

/**
 * Executes `getKeyPath` to handle get key path.
 * @zh 执行 `getKeyPath`，用于获取键路径。
 * @param field - field parameter (`FieldConfigCache`) / 字段参数（`FieldConfigCache`）
 * @returns Result of type `string[]` / 类型为 `string[]` 的返回值
 */
export function getKeyPath(field: FieldConfigCache): string[] {
  if (!field.name) {
    return [];
  }

  /* We store the keyPath in the field for performance reasons. This function will be called frequently. */
  if (!field._keyPath || field._keyPath.key !== field.name) {
    let path: string[] = [];
    if (typeof field.name === 'string') {
      const key = field.name.indexOf('[') === -1 ? field.name : field.name.replace(/\[(\w+)\]/g, '.$1');
      path = key.indexOf('.') !== -1 ? key.split('.') : [key];
    } else if (Array.isArray(field.name)) {
      path = field.name.slice(0);
    } else {
      path = [`${field.name}`];
    }
    defineHiddenProp(field, '_keyPath', { key: field.name, path });
  }

  return field._keyPath.path.slice(0);
}

/**
 * Constant/variable `FORM_VALIDATORS` defining form validators in `src/core/form`.
 * @zh 常量/变量 `FORM_VALIDATORS`，定义 `src/core/form` 中的表单校验器列表。
 */
export const FORM_VALIDATORS = ['required', 'pattern', 'minLength', 'maxLength', 'min', 'max'];

/**
 * Executes `assignFieldValue` to handle assign field value.
 * @zh 执行 `assignFieldValue`，用于赋值字段值。
 * @param field - field parameter (`FieldConfigCache`) / 字段参数（`FieldConfigCache`）
 * @param value - value parameter (`any`) / 值参数（`any`）
 */
export function assignFieldValue(field: FieldConfigCache, value) {
  let paths = getKeyPath(field);
  if (paths.length === 0) {
    return;
  }
  let root = field;
  while (root.parent) {
    root = root.parent;
    paths = [...getKeyPath(root), ...paths];
  }
  if (value === undefined && field['autoClear']) {
    const k = paths.pop();
    if (isUnsafeKey(k)) {
      return;
    }
    const m = paths.reduce((model, path) => (isUnsafeKey(path) ? {} : (model[path] || {})), root.model);
    delete m[k];
    return;
  }
  assignModelValue(root.model, paths, value);
}

/**
 * Executes `assignModelValue` to handle assign model value.
 * @zh 执行 `assignModelValue`，用于赋值模型值。
 * @param model - model parameter (`any`) / 模型参数（`any`）
 * @param paths - paths parameter (`string[]`) / 路径参数（`string[]`）
 * @param value - value parameter (`any`) / 值参数（`any`）
 */
export function assignModelValue(model, paths: string[], value) {
  for (let i = 0; i < (paths.length - 1); i++) {
    const path = paths[i];
    if (isUnsafeKey(path)) {
      return;
    }
    if (!model[path] || !isObject(model[path])) {
      model[path] = /^\d+$/.test(paths[i + 1]) ? [] : {};
    }

    model = model[path];
  }
  const lastPath = paths[paths.length - 1];
  if (isUnsafeKey(lastPath)) {
    return;
  }
  model[lastPath] = clone(value);
}
///move from dui.ts ----- start
/**
 * Executes `getKeyPath2` to handle get key path2.
 * @zh 执行 `getKeyPath2`，用于获取键Path2。
 * @param field - field parameter (`{ name?: string | string[]; fieldGroup?: any; fieldArray?: any; }`) / 字段参数（`{ name?: string | string[]; fieldGroup?: any; fieldArray?: any; }`）
 * @returns Result of type `(string | number)[]` / 类型为 `(string | number)[]` 的返回值
 */
export function getKeyPath2(field: { name?:  string  | string[], fieldGroup?, fieldArray? }): (string | number)[] {
  /* We store the keyPath in the field for performance reasons. This function will be called frequently. */
  if (!(<unknown>field)['_formlyKeyPath'] || (<unknown>field)['_formlyKeyPath'].name !== field.name) {
    let keyPath: (string | number)[] = [];
    if (field.name) {
      /* Also allow for an array key, hence the type check  */
      let pathElements = typeof field.name === 'string' ? field.name.split('.') : field.name;
      for (let pathElement of pathElements) {
        if (typeof pathElement === 'string') {
          /* replace paths of the form names[2] by names.2, cfr. angular formly */
          pathElement = pathElement.replace(/\[(\w+)\]/g, '.$1');
          keyPath = keyPath.concat(pathElement.split('.'));
        } else {
          keyPath.push(pathElement);
        }
      }
      for (let i = 0; i < keyPath.length; i++) {
        let pathElement = keyPath[i];
        if (typeof pathElement === 'string' && /^\d+$/.test(pathElement)) {
          keyPath[i] = parseInt(pathElement);
        }
      }
    }
    (<unknown>field)['_formlyKeyPath'] = {
      name: field.name,
      path: keyPath,
    };
  }
  return (<unknown>field)['_formlyKeyPath'].path.slice(0);
}
/**
 * Executes `assignModelValue2` to handle assign model value2.
 * @zh 执行 `assignModelValue2`，用于赋值模型Value2。
 * @param model - model parameter (`any`) / 模型参数（`any`）
 * @param path - path parameter (`string | (string | number)[]`) / 路径参数（`string | (string | number)[]`）
 * @param value - value parameter (`any`) / 值参数（`any`）
 */
export function assignModelValue2(model, path: string | (string | number)[], value) {
  if (typeof path === 'string') {
    path = getKeyPath2({ name: path });
  }
  if (path.length > 1) {
    const e = path.shift();
    if (isUnsafeKey(e)) {
      return;
    }
    if (!model[e] || !isObject(model[e])) {
      model[e] = typeof path[0] === 'string' ? {} : [];
    }
    assignModelValue2(model[e], path, value);
  } else {
    if (isUnsafeKey(path[0])) {
      return;
    }
    model[path[0]] = value;
  }
}

/**
 * Executes `getValueForKey2` to handle get value for key2.
 * @zh 执行 `getValueForKey2`，用于获取值用于Key2。
 * @param formValue - form value parameter (`any`) / 表单值参数（`any`）
 * @param path - path parameter (`string | (string | number)[]`) / 路径参数（`string | (string | number)[]`）
 * @returns Result of type `any` / 类型为 `any` 的返回值
 */
export function getValueForKey2(formValue, path: string | (string | number)[]) {
  if (typeof path === 'string') {
    path = getKeyPath2({ name: path });
  }
  if (path.length > 1) {
    const e = path.shift();
    if (!formValue[e]) {
      formValue[e] = typeof path[0] === 'string' ? {} : [];
    }
    return getValueForKey2(formValue[e], path);
  } else {
    return formValue[path[0]];
  }
}
///move from dui.ts  ------end
/**
 * Executes `getFieldInitialValue` to handle get field initial value.
 * @zh 执行 `getFieldInitialValue`，用于获取字段初始值。
 * @param field - field parameter (`FieldConfig`) / 字段参数（`FieldConfig`）
 */
export function getFieldInitialValue(field: FieldConfig) {
  let value = field.option['_initialModel'];
  let paths = getKeyPath(field);
  while (field.parent) {
    field = field.parent;
    paths = [...getKeyPath(field), ...paths];
  }

  for (const path of paths) {
    if (!value) {
      return undefined;
    }
    value = value[path];
  }

  return value;
}

/**
 * Executes `getFieldValue` to handle get field value.
 * @zh 执行 `getFieldValue`，用于获取字段值。
 * @param field - field parameter (`FieldConfig`) / 字段参数（`FieldConfig`）
 * @returns Result of type `any` / 类型为 `any` 的返回值
 */
export function getFieldValue(field: FieldConfig) {
  let model = field.parent ? field.parent.model : field.model;
  for (const path of getKeyPath(field)) {
    if (!model) {
      return model;
    }
    model = model[path];
  }
  return model;
}

/**
 * Executes `reverseDeepMerge` to handle reverse deep merge.
 * @zh 执行 `reverseDeepMerge`，用于反向Deep合并。
 * @param dest - dest parameter (`any`) / 目标路径参数（`any`）
 * @param args - args parameter (`any[]`) / 参数列表参数（`any[]`）
 */
export function reverseDeepMerge(dest, ...args) {
  args.forEach((src) => {
    for (const srcArg in src) {
      if (isUnsafeKey(srcArg)) {
        continue;
      }
      if (isNil(dest[srcArg]) || isBlankString(dest[srcArg])) {
        dest[srcArg] = clone(src[srcArg]);
      } else if (objAndSameType(dest[srcArg], src[srcArg])) {
        reverseDeepMerge(dest[srcArg], src[srcArg]);
      }
    }
  });
  return dest;
}

/**
 * Executes `isNil` to handle is nil.
 * @zh 执行 `isNil`，用于是否为Nil。
 * @param value - value parameter (`any`) / 值参数（`any`）
 */
export function isNil(value) {
  return value == null;
}

/**
 * Executes `isUndefined` to handle is undefined.
 * @zh 执行 `isUndefined`，用于是否为未定义。
 * @param value - value parameter (`any`) / 值参数（`any`）
 */
export function isUndefined(value) {
  return value === undefined;
}

/**
 * Executes `isBlankString` to handle is blank string.
 * @zh 执行 `isBlankString`，用于是否为Blank字符串。
 * @param value - value parameter (`any`) / 值参数（`any`）
 */
export function isBlankString(value) {
  return value === '';
}

/**
 * Executes `isFunction` to handle is function.
 * @zh 执行 `isFunction`，用于是否为函数。
 * @param value - value parameter (`any`) / 值参数（`any`）
 */
export function isFunction(value) {
  return typeof(value) === 'function';
}

/**
 * Executes `objAndSameType` to handle obj and same type.
 * @zh 执行 `objAndSameType`，用于对象And相同类型。
 * @param obj1 - obj1 parameter (`any`) / obj1参数（`any`）
 * @param obj2 - obj2 parameter (`any`) / obj2参数（`any`）
 */
export function objAndSameType(obj1, obj2) {
  return (
    isObject(obj1) &&
    isObject(obj2) &&
    Object.getPrototypeOf(obj1) === Object.getPrototypeOf(obj2) &&
    !(Array.isArray(obj1) || Array.isArray(obj2))
  );
}

/**
 * Executes `isObject` to handle is object.
 * @zh 执行 `isObject`，用于是否为对象。
 * @param x - x parameter (`any`) / X坐标参数（`any`）
 */
export function isObject(x) {
  return x != null && typeof x === 'object';
}

/**
 * Executes `isPromise` to handle is promise.
 * @zh 执行 `isPromise`，用于是否为Promise。
 * @param obj - obj parameter (`any`) / 对象参数（`any`）
 * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
 */
export function isPromise(obj) {
  return !!obj && typeof obj.then === 'function';
}

/**
 * Executes `clone` to handle clone.
 * @zh 执行 `clone`，用于克隆。
 * @param value - value parameter (`any`) / 值参数（`any`）
 * @returns Result of type `any` / 类型为 `any` 的返回值
 */
export function clone(value) {
  if (
    !isObject(value)
    || isObservable(value)
    ||  value.changingThisBreaksApplicationSecurity
    || ['RegExp', 'FileList', 'File', 'Blob'].indexOf(value.constructor.name) !== -1
  ) {
    return value;
  }


  if (value._isAMomentObject && isFunction(value.clone)) {
    return value.clone();
  }

  if (value instanceof AbstractControl) {
    return null;
  }

  if (value instanceof Date) {
    return new Date(value.getTime());
  }

  if (Array.isArray(value)) {
    return value.slice(0).map(v => clone(v));
  }

  // best way to clone a js object maybe
  // https://stackoverflow.com/questions/41474986/how-to-clone-a-javascript-es6-class-instance
  const proto = Object.getPrototypeOf(value);
  let c = Object.create(proto);
  c = Object.setPrototypeOf(c, proto);
  return Object.keys(value).reduce((newVal, prop) => {
    const propDesc = Object.getOwnPropertyDescriptor(value, prop);
    if (propDesc.get) {
      if( typeof value[prop] === 'object')
        newVal[prop] = clone(value[prop]);
      else
        Object.defineProperty(newVal, prop, propDesc);
    } else {
      newVal[prop] = clone(value[prop]);
    }

    return newVal;
  }, c);
}

/**
 * Executes `defineHiddenProp` to handle define hidden prop.
 * @zh 执行 `defineHiddenProp`，用于定义隐藏属性。
 * @param field - field parameter (`any`) / 字段参数（`any`）
 * @param prop - prop parameter (`string`) / 属性参数（`string`）
 * @param defaultValue - default value parameter (`any`) / 默认值参数（`any`）
 */
export function defineHiddenProp(field, prop: string, defaultValue) {
  Object.defineProperty(field, prop, { enumerable: false, writable: true, configurable: true });
  field[prop] = defaultValue;
}


/**
 * Type alias `IObserveFn` representing i observe fn (`(change: { currentValue: T; previousValue?: T; firstChange: boolean })...`).
 * @zh 类型别名 `IObserveFn`，表示IObserve函数（`(change: { currentValue: T; previousValue?: T; firstChange: boolean })...`）。
 */
type IObserveFn<T> = (change: { currentValue: T; previousValue?: T; firstChange: boolean }) => void;
/**
 * Interface `IObserver` defining the contract and properties for i observer.
 * @zh 接口 `IObserver`，定义I观察者的数据结构契约与属性规范。
 */
export interface IObserver<T> {
  /**
   * Property `setValue` (`(value: T) => void`) storing set value.
   * @zh 属性 `setValue`（类型：`(value: T) => void`），用于存储或配置集合值。
   */
  setValue: (value: T) => void;
  /**
   * Property `unsubscribe` (`Function`) storing unsubscribe.
   * @zh 属性 `unsubscribe`（类型：`Function`），用于存储或配置取消订阅。
   */
  unsubscribe: Function;
}
/**
 * Interface `IObserveTarget` defining the contract and properties for i observe target.
 * @zh 接口 `IObserveTarget`，定义IObserve目标的数据结构契约与属性规范。
 */
interface IObserveTarget<T> {
  [prop: string]: unknown;
  /**
   * Property `_observers` (`{ [prop: string]: { value: T; onChange: IObserveFn<T>[]; }; }`) storing observers.
   * @zh 属性 `_observers`（类型：`{ [prop: string]: { value: T; onChange: IObserveFn<T>[]; }; }`），用于存储或配置观察者。
   */
  _observers?: {
    [prop: string]: {
      value: T;
      onChange: IObserveFn<T>[];
    };
  };
}

/**
 * Executes `observeDeep` to handle observe deep.
 * @zh 执行 `observeDeep`，用于observeDeep。
 * @param { source, paths, target, setFn... - { source, paths, target, set fn parameter (`any`) / {source,paths,target,集合函数参数（`any`）
 */
export function observeDeep({ source, paths, target, setFn }) {
  const observers = [];
  if (paths.length === 0) {
    target = source;
  }

  Object.keys(target).forEach((path) => {
    let unsubscribe = () => {};
    const observer = observe(source, [...paths, path], ({ firstChange, currentValue }) => {
      !firstChange && setFn();

      unsubscribe();
      const i = observers.indexOf(unsubscribe);
      if (i > -1) {
        observers.splice(i, 1);
      }

      if (isObject(currentValue) && currentValue.constructor.name === 'Object') {
        unsubscribe = observeDeep({ source, setFn, paths: [...paths, path], target: currentValue });
        observers.push(unsubscribe);
      }
    });

    observers.push(() => observer.unsubscribe());
  });

  return () => {
    observers.forEach((observer) => observer());
  };
}

/**
 * Executes `observe` to handle observe.
 * @zh 执行 `observe`，用于观察。
 * @param o - o parameter (`any`) / o参数（`any`）
 * @param paths - paths parameter (`string[]`) / 路径参数（`string[]`）
 * @param setFn - set fn parameter (`IObserveFn<T>`) / 集合函数参数（`IObserveFn<T>`）
 * @returns Result of type `IObserver<T>` / 类型为 `IObserver<T>` 的返回值
 */
export function observe<T = Parameters<{ (x) }>[0]>(o, paths: string[], setFn: IObserveFn<T>): IObserver<T> {
  if (!o._observers) {
    defineHiddenProp(o, '_observers', {});
  }

  let target = o;
  for (let i = 0; i < paths.length - 1; i++) {
    if (!target[paths[i]] || !isObject(target[paths[i]])) {
      target[paths[i]] = /^\d+$/.test(paths[i + 1]) ? [] : {};
    }
    target = target[paths[i]];
  }

  const key = paths[paths.length - 1];
  const prop = paths.join('.');
  if (!o._observers[prop]) {
    o._observers[prop] = { value: target[key], onChange: [] };
  }

  const state = o._observers[prop];
  if (state.onChange.indexOf(setFn) === -1) {
    state.onChange.push(setFn);
    setFn({ currentValue: state.value, firstChange: true });
    if (state.onChange.length === 1) {
      const { enumerable } = Object.getOwnPropertyDescriptor(target, key) || { enumerable: true };
      Object.defineProperty(target, key, {
        enumerable,
        configurable: true,
        get: () => state.value,
        set: (currentValue) => {
          if (currentValue !== state.value) {
            const previousValue = state.value;
            state.value = currentValue;
            state.onChange.forEach((changeFn) => changeFn({ previousValue, currentValue, firstChange: false }));
          }
        },
      });
    }
  }

  return {
    setValue(value: T) {
      state.value = value;
    },
    unsubscribe() {
      state.onChange = state.onChange.filter((changeFn) => changeFn !== setFn);
    },
  };
}

/**
 * Executes `reduceFormUpdateValidityCalls` to handle reduce form update validity calls.
 * @zh 执行 `reduceFormUpdateValidityCalls`，用于归约表单更新Validity调用。
 * @param form - form parameter (`any`) / 表单参数（`any`）
 * @param action - action parameter (`Function`) / 动作参数（`Function`）
 */
export function reduceFormUpdateValidityCalls(form, action: Function) {
  const updateValidity = form._updateTreeValidity.bind(form);

  let updateValidityArgs = { called: false, emitEvent: false };
  form._updateTreeValidity = ({ emitEvent } = { emitEvent: true }) =>
    (updateValidityArgs = { called: true, emitEvent: emitEvent || updateValidityArgs.emitEvent });
  action();

  updateValidityArgs.called && updateValidity({ emitEvent: updateValidityArgs.emitEvent });
  form._updateTreeValidity = updateValidity;
}
