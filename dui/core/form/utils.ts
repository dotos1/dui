import { FieldConfig } from './models/field.config';
import { isObservable } from 'rxjs';
import { AbstractControl } from '@angular/forms';
import { FieldConfigCache } from './models';


export function getFieldId(formId: string, field: FieldConfig, index: string|number) {
  if (field.id) {
    return field.id;
  }
  let type = field.type;
  if (!type && field.template) {
    type = 'template';
  }
  return [formId, type, field['key'], index].join('_');
}

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
    defineHiddenProp(field, '_keyPath', { key: field['key'], path });
  }

  return field._keyPath.path.slice(0);
}

export const FORM_VALIDATORS = ['required', 'pattern', 'minLength', 'maxLength', 'min', 'max'];

export function assignFieldValue(field: FieldConfigCache, value: any) {
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
    const m = paths.reduce((model, path) => model[path] || {}, root.model);
    delete m[k];
    return;
  }
  assignModelValue(root.model, paths, value);
}

export function assignModelValue(model: any, paths: string[], value: any) {
  for (let i = 0; i < (paths.length - 1); i++) {
    const path = paths[i];
    if (!model[path] || !isObject(model[path])) {
      model[path] = /^\d+$/.test(paths[i + 1]) ? [] : {};
    }

    model = model[path];
  }
  model[paths[paths.length - 1]] = clone(value);
}
///move from dui.ts ----- start
export function getKeyPath2(field: { name?:  string  | string[], fieldGroup?: any, fieldArray?: any }): (string | number)[] {
  /* We store the keyPath in the field for performance reasons. This function will be called frequently. */
  if (!(<any>field)['_formlyKeyPath'] || (<any>field)['_formlyKeyPath'].name !== field.name) {
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
    (<any>field)['_formlyKeyPath'] = {
      name: field.name,
      path: keyPath,
    };
  }
  return (<any>field)['_formlyKeyPath'].path.slice(0);
}
export function assignModelValue2(model: any, path: string | (string | number)[], value: any) {
  if (typeof path === 'string') {
    path = getKeyPath2({ name: path });
  }
  if (path.length > 1) {
    const e = path.shift();
    if (!model[e] || !isObject(model[e])) {
      model[e] = typeof path[0] === 'string' ? {} : [];
    }
    assignModelValue2(model[e], path, value);
  } else {
    model[path[0]] = value;
  }
}

export function getValueForKey2(formValue: any, path: string | (string | number)[]): any {
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

export function getFieldValue(field: FieldConfig): any {
  let model = field.parent ? field.parent.model : field.model;
  for (const path of getKeyPath(field)) {
    if (!model) {
      return model;
    }
    model = model[path];
  }
  return model;
}

export function reverseDeepMerge(dest: any, ...args: any[]) {
  args.forEach((src) => {
    for (const srcArg in src) {
      if (isNil(dest[srcArg]) || isBlankString(dest[srcArg])) {
        dest[srcArg] = clone(src[srcArg]);
      } else if (objAndSameType(dest[srcArg], src[srcArg])) {
        reverseDeepMerge(dest[srcArg], src[srcArg]);
      }
    }
  });
  return dest;
}

export function isNil(value: any) {
  return value == null;
}

export function isUndefined(value: any) {
  return value === undefined;
}

export function isBlankString(value: any) {
  return value === '';
}

export function isFunction(value: any) {
  return typeof(value) === 'function';
}

export function objAndSameType(obj1: any, obj2: any) {
  return (
    isObject(obj1) &&
    isObject(obj2) &&
    Object.getPrototypeOf(obj1) === Object.getPrototypeOf(obj2) &&
    !(Array.isArray(obj1) || Array.isArray(obj2))
  );
}

export function isObject(x: any) {
  return x != null && typeof x === 'object';
}

export function isPromise(obj: any): obj is Promise<any> {
  return !!obj && typeof obj.then === 'function';
}

export function clone(value: any): any {
  if (
    !isObject(value)
    || isObservable(value)
    ||  value.changingThisBreaksApplicationSecurity
    || ['RegExp', 'FileList', 'File', 'Blob'].indexOf(value.constructor.name) !== -1
  ) {
    return value;
  }

  // https://github.com/moment/moment/blob/master/moment.js#L252
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

export function defineHiddenProp(field: any, prop: string, defaultValue: any) {
  Object.defineProperty(field, prop, { enumerable: false, writable: true, configurable: true });
  field[prop] = defaultValue;
}


type IObserveFn<T> = (change: { currentValue: T; previousValue?: T; firstChange: boolean }) => void;
export interface IObserver<T> {
  setValue: (value: T) => void;
  unsubscribe: Function;
}
interface IObserveTarget<T> {
  [prop: string]: any;
  _observers?: {
    [prop: string]: {
      value: T;
      onChange: IObserveFn<T>[];
    };
  };
}

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

export function observe<T = any>(o: IObserveTarget<T>, paths: string[], setFn: IObserveFn<T>): IObserver<T> {
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

export function reduceFormUpdateValidityCalls(form: any, action: Function) {
  const updateValidity = form._updateTreeValidity.bind(form);

  let updateValidityArgs = { called: false, emitEvent: false };
  form._updateTreeValidity = ({ emitEvent } = { emitEvent: true }) =>
    (updateValidityArgs = { called: true, emitEvent: emitEvent || updateValidityArgs.emitEvent });
  action();

  updateValidityArgs.called && updateValidity({ emitEvent: updateValidityArgs.emitEvent });
  form._updateTreeValidity = updateValidity;
}
