/**
 * @fileoverview Module `src/ux/windows/window/helpers/configs-merger.helper.ts` providing configs merger helper definitions and implementation.
 * @zh 模块文件 `src/ux/windows/window/helpers/configs-merger.helper.ts`，提供配置merger辅助工具相关的定义与实现。
 */

import { DynamicWindowConfig } from '../interfaces';

/**
 * Executes `ɵMergeConfigs` to handle ɵmerge configs.
 * @internal
 * @zh 执行 `ɵMergeConfigs`，用于ɵMerge配置。
 */
export function ɵMergeConfigs(
    updated: DynamicWindowConfig,
    shared: DynamicWindowConfig
): DynamicWindowConfig {
    const result: DynamicWindowConfig = {};

    for (const [key, value] of Object.entries({ ...updated, ...shared })) {
        if (Array.isArray(value)) {
            result[key] = (updated[key] ?? shared[key]);
        } else if (value === Object(value)) {
            result[key] = { ...shared?.[key], ...updated?.[key] };
        } else {
            result[key] = updated[key] ?? shared[key];
        }
    }

    return result;
}
