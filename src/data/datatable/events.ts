/**
 * @fileoverview Module `src/data/datatable/events.ts` providing events definitions and implementation.
 * @zh 模块文件 `src/data/datatable/events.ts`，提供事件集合相关的定义与实现。
 */

/**
 * Constant/variable `global` defining global in `src/data/datatable`.
 * @zh 常量/变量 `global`，定义 `src/data/datatable` 中的全局。
 */
declare let global;

/* tslint:disable */
/**
 * Constant/variable `MouseEvent` defining mouse event in `src/data/datatable`.
 * @zh 常量/变量 `MouseEvent`，定义 `src/data/datatable` 中的鼠标事件。
 */
export const MouseEvent = (((typeof window !== 'undefined' && window) as unknown) || (global as unknown))
  .MouseEvent as MouseEvent;
/**
 * Constant/variable `KeyboardEvent` defining keyboard event in `src/data/datatable`.
 * @zh 常量/变量 `KeyboardEvent`，定义 `src/data/datatable` 中的键盘事件。
 */
export const KeyboardEvent = (((typeof window !== 'undefined' && window) as unknown) || (global as unknown))
  .KeyboardEvent as KeyboardEvent;
/**
 * Constant/variable `Event` defining event in `src/data/datatable`.
 * @zh 常量/变量 `Event`，定义 `src/data/datatable` 中的事件。
 */
export const Event = (((typeof window !== 'undefined' && window) as unknown) || (global as unknown)).Event as Event;
