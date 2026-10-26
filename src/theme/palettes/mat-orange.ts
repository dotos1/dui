/**
 * @fileoverview Module `src/theme/palettes/mat-orange.ts` providing mat orange definitions and implementation.
 * @zh 模块文件 `src/theme/palettes/mat-orange.ts`，提供Materialorange相关的定义与实现。
 */

import { Palette } from '../interfaces/palette';

import {
    darkPrimaryText,
    lightPrimaryText
} from '../constants';

/**
 * Constant/variable `matOrange` defining mat orange in `src/theme/palettes`.
 * @zh 常量/变量 `matOrange`，定义 `src/theme/palettes` 中的MaterialOrange。
 */
export const matOrange: Palette = {
    50: '#fff3e0',
    100: '#ffe0b2',
    200: '#ffcc80',
    300: '#ffb74d',
    400: '#ffa726',
    500: '#ff9800',
    600: '#fb8c00',
    700: '#f57c00',
    800: '#ef6c00',
    900: '#e65100',
    A100: '#ffd180',
    A200: '#ffab40',
    A400: '#ff9100',
    A700: '#ff6d00',
    contrast: {
        50: darkPrimaryText,
        100: darkPrimaryText,
        200: darkPrimaryText,
        300: darkPrimaryText,
        400: darkPrimaryText,
        500: darkPrimaryText,
        600: darkPrimaryText,
        700: darkPrimaryText,
        800: lightPrimaryText,
        900: lightPrimaryText,
        A100: darkPrimaryText,
        A200: darkPrimaryText,
        A400: darkPrimaryText,
        A700: darkPrimaryText
    }
};

