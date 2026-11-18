/**
 * @fileoverview Module `src/tree/mobx-angular/mobx-proxy.ts` providing mobx proxy definitions and implementation.
 * @zh 模块文件 `src/tree/mobx-angular/mobx-proxy.ts`，提供 MobX 6 装饰器与操作符代理导出。
 */

import { action as mobxAction, computed as mobxComputed, observable as mobxObservable } from 'mobx';

/**
 * Constant `actionInternal` re-exporting MobX `action` operator.
 * @zh 常量 `actionInternal`，导出 MobX `action` 操作符。
 */
export const actionInternal: typeof mobxAction = mobxAction;

/**
 * Constant `action` re-exporting MobX `action` operator.
 * @zh 常量 `action`，导出 MobX `action` 操作符。
 */
export const action: typeof mobxAction = mobxAction;

/**
 * Constant `computed` re-exporting MobX `computed` operator.
 * @zh 常量 `computed`，导出 MobX `computed` 操作符。
 */
export const computed: typeof mobxComputed = mobxComputed;

/**
 * Constant `observable` re-exporting MobX `observable` operator.
 * @zh 常量 `observable`，导出 MobX `observable` 操作符。
 */
export const observable: typeof mobxObservable = mobxObservable;
