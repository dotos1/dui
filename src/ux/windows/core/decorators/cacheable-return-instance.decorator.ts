/**
 * @fileoverview Module `src/ux/windows/core/decorators/cacheable-return-instance.decorator.ts` providing cacheable return instance decorator definitions and implementation.
 * @zh 模块文件 `src/ux/windows/core/decorators/cacheable-return-instance.decorator.ts`，提供cacheablereturn实例decorator相关的定义与实现。
 */

import { ɵOsBaseViewComponent } from '../classes';
import { ɵIsObjectsWithSameData } from '../helpers';


/**
 * Executes `ɵCacheableReturnInstance` to handle ɵcacheable return instance.
 * @zh 执行 `ɵCacheableReturnInstance`，用于ɵCacheableReturn实例。
 * @param baseView - base view parameter (`ɵOsBaseViewComponent`) / 基础视图参数（`ɵOsBaseViewComponent`）
 * @param methodName - method name parameter (`string`) / 方法名称参数（`string`）
 * @param options - { get, enumerable, value } parameter (`TypedPropertyDescriptor<T>`) / {get,enumerable,值}参数（`TypedPropertyDescriptor<T>`）
 * @returns Result of type `any` / 类型为 `any` 的返回值
 */
export function ɵCacheableReturnInstance<T>(
    baseView: ɵOsBaseViewComponent,
    methodName: string,
    { get, enumerable, value }: TypedPropertyDescriptor<T>
): TypedPropertyDescriptor<T> {
    if (get) {
        return patchMethod<T>(enumerable, methodName, get);
    }
    if (typeof(value) !== 'function') {
        throw new Error('CacheableReturnInstance can only be used with functions or getters');
    }
    return patchMethod<T>(enumerable, methodName, value);
}
/**
 * Executes `patchMethod` to handle patch method.
 * @zh 执行 `patchMethod`，用于局部更新方法。
 * @param enumerable - enumerable parameter (`boolean`) / enumerable参数（`boolean`）
 * @param methodName - method name parameter (`string`) / 方法名称参数（`string`）
 * @param originalMethod - original method parameter (`Function`) / 原始方法参数（`Function`）
 * @returns Result of type `any` / 类型为 `any` 的返回值
 */
function patchMethod<T>(enumerable: boolean, methodName: string, originalMethod: Function): TypedPropertyDescriptor<T> {
    return {
        enumerable,
        get(): T {
            const previousInstance = this[`ɵ${methodName}`];
            const newInstance = originalMethod.call(this);
            if (!previousInstance || !ɵIsObjectsWithSameData(previousInstance, newInstance)) {
                this[`ɵ${methodName}`] = newInstance;

                return newInstance;
            }
            return previousInstance;
        }
    };
}
