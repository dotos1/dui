/**
 * @fileoverview Module `src/ux/windows/window/classes/dynamic-window-injector.ts` providing dynamic window injector definitions and implementation.
 * @zh 模块文件 `src/ux/windows/window/classes/dynamic-window-injector.ts`，提供动态窗口注入器相关的定义与实现。
 */

import { InjectOptions, InjectionToken, Injector, Type } from '@angular/core';
import { DYNAMIC_WINDOW_REF, IS_DYNAMIC_WINDOW_CONTEXT } from '../data';
import { ɵDynamicWindowDiParams } from '../interfaces';
import { ɵDynamicWindowRefModel } from './dynamic-window-ref';


/**
 * Class `ɵDynamicWindowInjector` encapsulating ɵdynamic window injector data structures and logic in `src/ux/windows/window/classes`.
 * @zh 类 `ɵDynamicWindowInjector`，封装 `src/ux/windows/window/classes` 中的ɵDynamic窗口注入器数据结构与处理逻辑。
 */
export class ɵDynamicWindowInjector implements Injector {
    /**
     * Property `parentInjector` (`Injector`) storing parent injector.
     * @zh 属性 `parentInjector`（类型：`Injector`），用于存储或配置父级注入器。
     */
    private readonly parentInjector: Injector;
    /**
     * Property `windowRef` (`ɵDynamicWindowRefModel`) storing window ref.
     * @zh 属性 `windowRef`（类型：`ɵDynamicWindowRefModel`），用于存储或配置窗口引用。
     */
    private readonly windowRef: ɵDynamicWindowRefModel;
    /**
     * Property `additionalTokens` (`WeakMap<object, unknown>`) storing additional tokens.
     * @zh 属性 `additionalTokens`（类型：`WeakMap<object, unknown>`），用于存储或配置additional设计令牌。
     */
    private additionalTokens: WeakMap<object, unknown>;

    /**
     * Creates an instance of `ɵDynamicWindowInjector` and initializes its dependencies and internal state.
     * @zh 创建 `ɵDynamicWindowInjector` 实例，并初始化其依赖项与内部状态。
     * @param { injector, windowRef } - Injected or initial { injector, window ref } (`ɵDynamicWindowDiParams`) / 注入或传入的{injector,窗口引用}（`ɵDynamicWindowDiParams`）
     */
    constructor(
        { injector, windowRef }: ɵDynamicWindowDiParams
    ) {
        this.parentInjector = injector;
        this.windowRef = windowRef;

        this.initAdditionalTokens();
    }

    /**
     * Executes `get` to handle get.
     * @zh 执行 `get`，用于获取。
     * @param token - token parameter (`Type<T> | InjectionToken<T>`) / 令牌参数（`Type<T> | InjectionToken<T>`）
     * @param notFoundValue - not found value parameter (`T`) / notFound值参数（`T`）
     * @param flags - flags parameter (`InjectOptions`) / flags参数（`InjectOptions`）
     * @returns Result of type `T` / 类型为 `T` 的返回值
     */
    public get<T>(
        token: Type<T> | InjectionToken<T>,
        notFoundValue?: T,
        flags?: InjectOptions
    ): T;
    // eslint-disable-next-line no-dupe-class-members
    /**
     * Executes `get` to handle get.
     * @zh 执行 `get`，用于获取。
     * @param token - token parameter (`any`) / 令牌参数（`any`）
     * @param notFoundValue - not found value parameter (`any`) / notFound值参数（`any`）
     * @returns Result of type `any` / 类型为 `any` 的返回值
     */
    public get(token, notFoundValue?) {
        const value = this.additionalTokens.get(token);

        if (value) {
            return value;
        }

        return this.parentInjector.get(token, notFoundValue);
    }

    /**
     * Executes `initAdditionalTokens` to handle init additional tokens.
     * @zh 执行 `initAdditionalTokens`，用于初始化Additional设计令牌。
     */
    private initAdditionalTokens(): void {
        this.additionalTokens = new WeakMap();

        this.additionalTokens.set(DYNAMIC_WINDOW_REF, this.windowRef);
        this.additionalTokens.set(IS_DYNAMIC_WINDOW_CONTEXT, true);
    }
}
