/**
 * @fileoverview Module `src/theme/mat-core.ts` providing mat core definitions and implementation.
 * @zh 模块文件 `src/theme/mat-core.ts`，提供Material核心相关的定义与实现。
 */

import {
    matRipple,
    cdkA11y,
    cdkOverlay,
    cdkTextfieldAutosize,
    cdkTextfieldAutoFill,
    matFocus,mdcFocus
} from './core';

import { TypographyConfig } from './interfaces';

/**
 * Executes `matCore` to handle mat core.
 * @zh 执行 `matCore`，用于Material核心。
 * @param typographyConfig - typography config parameter (`TypographyConfig`) / 排版配置参数（`TypographyConfig`）
 * @returns Result of type `Object` / 类型为 `Object` 的返回值
 */
export function matCore(typographyConfig: TypographyConfig = null): Object {
    return {
        ...matRipple(),
        ...cdkA11y(),
        ...cdkOverlay(),
        ...cdkTextfieldAutosize(),
        ...cdkTextfieldAutoFill(),
        ...matFocus(),
        ...mdcFocus()
    };
}

