/**
 * @fileoverview Module `src/theme/palettes/mat-cyan.ts` providing mat cyan definitions and implementation.
 * @zh 模块文件 `src/theme/palettes/mat-cyan.ts`，提供Materialcyan相关的定义与实现。
 */

import { Palette } from '../interfaces/palette';

import {
    darkPrimaryText,
    lightPrimaryText
} from '../constants';

/**
 * Constant/variable `matCyan` defining mat cyan in `src/theme/palettes`.
 * @zh 常量/变量 `matCyan`，定义 `src/theme/palettes` 中的MaterialCyan。
 */
export const matCyan: Palette = {
    50: '#e0f7fa',
    100: '#b2ebf2',
    200: '#80deea',
    300: '#4dd0e1',
    400: '#26c6da',
    500: '#00bcd4',
    600: '#00acc1',
    700: '#0097a7',
    800: '#00838f',
    900: '#006064',
    A100: '#84ffff',
    A200: '#18ffff',
    A400: '#00e5ff',
    A700: '#00b8d4',
    contrast: {
        50: darkPrimaryText,
        100: darkPrimaryText,
        200: darkPrimaryText,
        300: darkPrimaryText,
        400: darkPrimaryText,
        500: lightPrimaryText,
        600: lightPrimaryText,
        700: lightPrimaryText,
        800: lightPrimaryText,
        900: lightPrimaryText,
        A100: darkPrimaryText,
        A200: darkPrimaryText,
        A400: darkPrimaryText,
        A700: darkPrimaryText
    }
};