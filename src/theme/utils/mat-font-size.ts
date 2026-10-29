/**
 * @fileoverview Module `src/theme/utils/mat-font-size.ts` providing mat font size definitions and implementation.
 * @zh 模块文件 `src/theme/utils/mat-font-size.ts`，提供Material字体尺寸相关的定义与实现。
 */

import { TypographyConfig } from '../interfaces/typography-config';

/**
 * Executes `matFontSize` to handle mat font size.
 * @zh 执行 `matFontSize`，用于Material字体尺寸。
 * @param config - config parameter (`TypographyConfig`) / 配置参数（`TypographyConfig`）
 * @param level - level parameter (`string`) / 层级参数（`string`）
 * @returns Result of type `string | number` / 类型为 `string | number` 的返回值
 */
export function matFontSize(config: TypographyConfig, level: string): number | string {
    return config[level]['font-size'];
}
