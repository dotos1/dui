/**
 * @fileoverview Module `src/core/meta/util.ts` providing util definitions and implementation.
 * @zh 模块文件 `src/core/meta/util.ts`，提供工具相关的定义与实现。
 */


import { Observable } from 'rxjs';

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
 * Executes `isObservable` to handle is observable.
 * @zh 执行 `isObservable`，用于是否为可观察流。
 * @param obj - obj parameter (`any`) / 对象参数（`any`）
 * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
 */
export function isObservable(obj) {

  return !!obj && typeof obj.subscribe === 'function';
}
