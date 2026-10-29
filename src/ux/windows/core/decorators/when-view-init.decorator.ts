/**
 * @fileoverview Module `src/ux/windows/core/decorators/when-view-init.decorator.ts` providing when view init decorator definitions and implementation.
 * @zh 模块文件 `src/ux/windows/core/decorators/when-view-init.decorator.ts`，提供when视图初始化decorator相关的定义与实现。
 */

import { ɵOsBaseViewComponent } from '../classes';

/**
 * Executes `ɵWhenViewInit` to handle ɵwhen view init.
 * @zh 执行 `ɵWhenViewInit`，用于ɵWhen视图初始化。
 * @param defaultValue - default value parameter (`any`) / 默认值参数（`any`）
 * @returns Result of type `(baseView: ɵOsBaseViewComponent, methodName: string, {…}: TypedPropertyDescriptor<T>) => TypedPropertyDescriptor<T>` / 类型为 `(baseView: ɵOsBaseViewComponent, methodName: string, {…}: TypedPropertyDescriptor<T>) => TypedPropertyDescriptor<T>` 的返回值
 */
export function ɵWhenViewInit<T>(defaultValue = null) {
    return function(
        baseView: ɵOsBaseViewComponent,
        methodName: string,
        { get, enumerable, value }: TypedPropertyDescriptor<T>
    ): TypedPropertyDescriptor<T> {
        if (get) {
            return patchMethod(enumerable, defaultValue, get);
        }
        if (typeof value !== 'function') {
            throw new Error('WhenViewInit can only be used with functions or getters');
        }
        return patchMethod(enumerable, defaultValue, value);
    };
}

/**
 * Executes `patchMethod` to handle patch method.
 * @zh 执行 `patchMethod`，用于局部更新方法。
 * @param enumerable - enumerable parameter (`boolean`) / enumerable参数（`boolean`）
 * @param defaultValue - default value parameter (`any`) / 默认值参数（`any`）
 * @param originalMethod - original method parameter (`Function`) / 原始方法参数（`Function`）
 * @returns Result of type `{ enumerable: boolean; get(): T; }` / 类型为 `{ enumerable: boolean; get(): T; }` 的返回值
 */
function patchMethod<T>(enumerable: boolean, defaultValue, originalMethod: Function) {
    return {
        enumerable,
        get(): T {
            if ((this as ɵOsBaseViewComponent).isViewInit) {
                return originalMethod.call(this);
            }

            return defaultValue;
        }
    };
}
