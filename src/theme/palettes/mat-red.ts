/**
 * @fileoverview Module `src/theme/palettes/mat-red.ts` providing mat red definitions and implementation.
 * @zh 模块文件 `src/theme/palettes/mat-red.ts`，提供Materialred相关的定义与实现。
 */

import { Palette } from '../interfaces/palette';

import {
    darkPrimaryText,
    lightPrimaryText
} from '../constants';

/**
 * Constant/variable `matRed` defining mat red in `src/theme/palettes`.
 * @zh 常量/变量 `matRed`，定义 `src/theme/palettes` 中的MaterialRed。
 */
export const matRed: Palette = {
    50: '#ffebee',
    100: '#ffcdd2',
    200: '#ef9a9a',
    300: '#e57373',
    400: '#ef5350',
    500: '#f44336',
    600: '#e53935',
    700: '#d32f2f',
    800: '#c62828',
    900: '#b71c1c',
    A100: '#ff8a80',
    A200: '#ff5252',
    A400: '#ff1744',
    A700: '#d50000',
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
        A200: lightPrimaryText,
        A400: lightPrimaryText,
        A700: lightPrimaryText
    }
};
