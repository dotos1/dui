/**
 * @fileoverview Module `src/theme/typography/mat-typography-level-to-styles.ts` providing mat typography level to styles definitions and implementation.
 * @zh 模块文件 `src/theme/typography/mat-typography-level-to-styles.ts`，提供Material排版层级转换为样式集合相关的定义与实现。
 */

import {
    matFontSize,
    matFontWeight,
    matLineHeight,
    matFontFamily
} from '../utils/index';

import { matTypographyFontShorthand } from './mat-typography-font-shorthand';

import { TypographyConfig } from '../interfaces/typography-config';

/**
 * Executes `matTypographyLevelToStyles` to handle mat typography level to styles.
 * @zh 执行 `matTypographyLevelToStyles`，用于Material排版层级转换为样式集合。
 * @param config - config parameter (`TypographyConfig`) / 配置参数（`TypographyConfig`）
 * @param level - level parameter (`string`) / 层级参数（`string`）
 * @returns Result of type `Object` / 类型为 `Object` 的返回值
 */
export function matTypographyLevelToStyles(config: TypographyConfig, level: string): Object {
    const fontSize: number | string = matFontSize(config, level);
    const fontWeight: number | string = matFontWeight(config, level);
    const lineHeight: number | string = matLineHeight(config, level);
    const fontFamily: string = matFontFamily(config, level);
    return matTypographyFontShorthand(fontSize, fontWeight, lineHeight, fontFamily);
}