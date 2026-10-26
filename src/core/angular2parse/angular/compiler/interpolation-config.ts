/**
 * @fileoverview Module `src/core/angular2parse/angular/compiler/interpolation-config.ts` providing interpolation config definitions and implementation.
 * @zh 模块文件 `src/core/angular2parse/angular/compiler/interpolation-config.ts`，提供interpolation配置相关的定义与实现。
 */


import {assertInterpolationSymbols} from './assertions';

/**
 * Class `InterpolationConfig` encapsulating interpolation config data structures and logic in `src/core/angular2parse/angular/compiler`.
 * @zh 类 `InterpolationConfig`，封装 `src/core/angular2parse/angular/compiler` 中的Interpolation配置数据结构与处理逻辑。
 */
export class InterpolationConfig {
    /**
     * Executes `fromArray` to handle from array.
     * @zh 执行 `fromArray`，用于从数组。
     * @param markers - markers parameter (`[string, string]`) / 标记点参数（`[string, string]`）
     * @returns Result of type `InterpolationConfig` / 类型为 `InterpolationConfig` 的返回值
     */
    static fromArray(markers: [string, string]): InterpolationConfig {
        if (!markers) {
            return DEFAULT_INTERPOLATION_CONFIG;
        }

        assertInterpolationSymbols('interpolation', markers);
        return new InterpolationConfig(markers[0], markers[1]);
    }

    /**
     * Creates an instance of `InterpolationConfig` and initializes its dependencies and internal state.
     * @zh 创建 `InterpolationConfig` 实例，并初始化其依赖项与内部状态。
     * @param start - Injected or initial start (`string`) / 注入或传入的开始（`string`）
     * @param end - Injected or initial end (`string`) / 注入或传入的结束（`string`）
     */
    constructor(public start: string, public end: string){};
}

/**
 * Constant/variable `DEFAULT_INTERPOLATION_CONFIG` defining default interpolation config in `src/core/angular2parse/angular/compiler`.
 * @zh 常量/变量 `DEFAULT_INTERPOLATION_CONFIG`，定义 `src/core/angular2parse/angular/compiler` 中的默认INTERPOLATION配置。
 */
export const DEFAULT_INTERPOLATION_CONFIG: InterpolationConfig =
    new InterpolationConfig('{{', '}}');