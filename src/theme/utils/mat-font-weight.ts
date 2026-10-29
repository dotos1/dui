/**
 * @fileoverview Module `src/theme/utils/mat-font-weight.ts` providing mat font weight definitions and implementation.
 * @zh 模块文件 `src/theme/utils/mat-font-weight.ts`，提供Material字体权重/字重相关的定义与实现。
 */

import { TypographyConfig } from '../interfaces/typography-config';

/**
 * Executes `matFontWeight` to handle mat font weight.
 * @zh 执行 `matFontWeight`，用于Material字体权重/字重。
 * @param config - config parameter (`TypographyConfig`) / 配置参数（`TypographyConfig`）
 * @param level - level parameter (`string`) / 层级参数（`string`）
 * @returns Result of type `string | number` / 类型为 `string | number` 的返回值
 */
export function matFontWeight(config: TypographyConfig, level: string): number | string {
    return config[level]['font-weight'];
}
