/**
 * @fileoverview Module `src/data/datatable/utils/column-prop-getters.ts` providing column prop getters definitions and implementation.
 * @zh 模块文件 `src/data/datatable/utils/column-prop-getters.ts`，提供列属性getters相关的定义与实现。
 */

import { TableColumnProp } from '../types/table-column.type';

// maybe rename this file to prop-getters.ts

/**
 * Type alias `ValueGetter` representing value getter (`(obj: any, prop: TableColumnProp) => any`).
 * @zh 类型别名 `ValueGetter`，表示值Getter（`(obj: any, prop: TableColumnProp) => any`）。
 */
export type ValueGetter = { (obj, prop: TableColumnProp) };

/**
 * Always returns the empty string ''

 * @zh 执行 `emptyStringGetter`，用于空字符串Getter。
 */
export function emptyStringGetter(): string {
  return '';
}

/**
 * Returns the appropriate getter function for this kind of prop.
 * If prop == null, returns the emptyStringGetter.

 * @zh 执行 `getterForProp`，用于getter用于属性。
 */
export function getterForProp(prop: TableColumnProp): ValueGetter {
  if (prop == null) {
    return emptyStringGetter;
  }

  if (typeof prop === 'number') {
    return numericIndexGetter;
  } else {
    // deep or simple
    if (prop.indexOf('.') !== -1) {
      return deepValueGetter;
    } else {
      return shallowValueGetter;
    }
  }
}

/**
 * Returns the value at this numeric index.
 * @param row array of values
 * @param index numeric index
 * @returns any or '' if invalid index

 * @zh 执行 `numericIndexGetter`，用于numeric索引Getter。
 */
export function numericIndexGetter(row, index: number) {
  if (row == null) {
    return '';
  }
  // mimic behavior of deepValueGetter
  if (!row || index == null) {
    return row;
  }

  const value = row[index];
  if (value == null) {
    return '';
  }
  return value;
}

/**
 * Returns the value of a field.
 * (more efficient than deepValueGetter)
 * @param obj object containing the field
 * @param fieldName field name string

 * @zh 执行 `shallowValueGetter`，用于shallow值Getter。
 */
export function shallowValueGetter(obj, fieldName: string) {
  if (obj == null) {
    return '';
  }
  if (!obj || !fieldName) {
    return obj;
  }

  const value = obj[fieldName];
  if (value == null) {
    return '';
  }
  return value;
}

/**
 * Returns a deep object given a string. zoo['animal.type']

 * @zh 执行 `deepValueGetter`，用于deep值Getter。
 */
export function deepValueGetter(obj, path: string) {
  if (obj == null) {
    return '';
  }
  if (!obj || !path) {
    return obj;
  }

  // check if path matches a root-level field
  // { "a.b.c": 123 }
  let current = obj[path];
  if (current !== undefined) {
    return current;
  }

  current = obj;
  const split = path.split('.');

  if (split.length) {
    for (let i = 0; i < split.length; i++) {
      current = current[split[i]];

      // if found undefined, return empty string
      if (current === undefined || current === null) {
        return '';
      }
    }
  }

  return current;
}
