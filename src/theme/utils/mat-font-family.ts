/**
 * @fileoverview Module `src/theme/utils/mat-font-family.ts` providing mat font family definitions and implementation.
 * @zh 模块文件 `src/theme/utils/mat-font-family.ts`，提供Material字体family相关的定义与实现。
 */

import { TypographyConfig } from '../interfaces/typography-config';

/**
 * Executes `matFontFamily` to handle mat font family.
 * @zh 执行 `matFontFamily`，用于Material字体Family。
 * @param config - config parameter (`TypographyConfig`) / 配置参数（`TypographyConfig`）
 * @param level - level parameter (`string`) / 层级参数（`string`）
 * @returns Result of type `string` / 类型为 `string` 的返回值
 */
export function matFontFamily(config: TypographyConfig, level: string = null): string {
    let fontFamily: string = config['font-family'];
    if (level !== null) {
        fontFamily = config[level]['font-family'];
    }
    return fontFamily;
}
