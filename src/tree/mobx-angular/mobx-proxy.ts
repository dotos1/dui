/**
 * @fileoverview Module `src/tree/mobx-angular/mobx-proxy.ts` providing mobx proxy definitions and implementation.
 * @zh 模块文件 `src/tree/mobx-angular/mobx-proxy.ts`，提供mobxproxy相关的定义与实现。
 */

import { action as mobxAction } from 'mobx';
import { computed as mobxComputed } from 'mobx';
import { observable as mobxObservable } from 'mobx';

// Re-export mobx operators to be able to use inside components with AOT:
/**
 * Executes `actionInternal` to handle action internal.
 * @zh 执行 `actionInternal`，用于动作内部。
 * @param args - args parameter (`any`) / 参数列表参数（`any`）
 */
export function actionInternal(...args) {
  return (mobxAction as unknown)(...args);
}
/**
 * Constant/variable `action` defining action in `src/tree/mobx-angular`.
 * @zh 常量/变量 `action`，定义 `src/tree/mobx-angular` 中的动作。
 */
export const action: typeof mobxAction = Object.assign(
  actionInternal,
  mobxAction
) as unknown;

/**
 * Executes `computedInternal` to handle computed internal.
 * @zh 执行 `computedInternal`，用于计算属性内部。
 * @param args - args parameter (`any`) / 参数列表参数（`any`）
 */
function computedInternal(...args) {
  return (mobxComputed as unknown)(...args);
}
/**
 * Constant/variable `computed` defining computed in `src/tree/mobx-angular`.
 * @zh 常量/变量 `computed`，定义 `src/tree/mobx-angular` 中的计算属性。
 */
export const computed: typeof mobxComputed = Object.assign(
  computedInternal,
  mobxComputed
) as unknown;

/**
 * Executes `observableInternal` to handle observable internal.
 * @zh 执行 `observableInternal`，用于可观察流内部。
 * @param args - args parameter (`any`) / 参数列表参数（`any`）
 */
function observableInternal(...args) {
  return (mobxObservable as unknown)(...args);
}

/**
 * Constant/variable `observable` defining observable in `src/tree/mobx-angular`.
 * @zh 常量/变量 `observable`，定义 `src/tree/mobx-angular` 中的可观察流。
 */
export const observable: typeof mobxObservable = Object.assign(
  observableInternal,
  mobxObservable
) as unknown;
