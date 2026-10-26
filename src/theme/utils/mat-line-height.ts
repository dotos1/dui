/**
 * @fileoverview Module `src/theme/utils/mat-line-height.ts` providing mat line height definitions and implementation.
 * @zh 模块文件 `src/theme/utils/mat-line-height.ts`，提供Material线段高度相关的定义与实现。
 */

import { TypographyConfig } from '../interfaces/typography-config';

/**
 * Executes `matLineHeight` to handle mat line height.
 * @zh 执行 `matLineHeight`，用于Material线段高度。
 * @param config - config parameter (`TypographyConfig`) / 配置参数（`TypographyConfig`）
 * @param level - level parameter (`string`) / 层级参数（`string`）
 * @returns Result of type `number | string` / 类型为 `number | string` 的返回值
 */
export function matLineHeight(config: TypographyConfig, level: string): number | string {
    return config[level]['line-height'];
}
