/**
 * @fileoverview Module `src/core/mobx/mobx-angular.ts` providing mobx angular definitions and implementation.
 * @zh 模块文件 `src/core/mobx/mobx-angular.ts`，提供mobxangular相关的定义与实现。
 */


import {action as mobxAction} from 'mobx';
import {computed as mobxComputed} from 'mobx';
import {observable as mobxObservable} from 'mobx';

/**
 * Executes `actionInternal` to handle action internal.
 * @zh 执行 `actionInternal`，用于动作内部。
 * @param args - args parameter (`any`) / 参数列表参数（`any`）
 */
export function actionInternal(...args) {
  return (mobxAction as Function)(...args);
}
/**
 * Constant/variable `action` defining action in `src/core/mobx`.
 * @zh 常量/变量 `action`，定义 `src/core/mobx` 中的动作。
 */
export const action: typeof mobxAction = Object.assign(
  actionInternal,
  mobxAction
) as never;

/**
 * Executes `computedInternal` to handle computed internal.
 * @zh 执行 `computedInternal`，用于计算属性内部。
 * @param args - args parameter (`any`) / 参数列表参数（`any`）
 */
function computedInternal(...args) {
  return (mobxComputed as Function)(...args);
}
/**
 * Constant/variable `computed` defining computed in `src/core/mobx`.
 * @zh 常量/变量 `computed`，定义 `src/core/mobx` 中的计算属性。
 */
export const computed: typeof mobxComputed = Object.assign(
  computedInternal,
  mobxComputed
) as never;

/**
 * Executes `observableInternal` to handle observable internal.
 * @zh 执行 `observableInternal`，用于可观察流内部。
 * @param args - args parameter (`any`) / 参数列表参数（`any`）
 */
function observableInternal(...args) {
  return (mobxObservable as Function)(...args);
}

/**
 * Constant/variable `observable` defining observable in `src/core/mobx`.
 * @zh 常量/变量 `observable`，定义 `src/core/mobx` 中的可观察流。
 */
export const observable: typeof mobxObservable = Object.assign(
  observableInternal,
  mobxObservable
) as never;
