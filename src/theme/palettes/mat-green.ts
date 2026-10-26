/**
 * @fileoverview Module `src/theme/palettes/mat-green.ts` providing mat green definitions and implementation.
 * @zh 模块文件 `src/theme/palettes/mat-green.ts`，提供Materialgreen相关的定义与实现。
 */

import { Palette } from '../interfaces/palette';

import {
    darkPrimaryText,
    lightPrimaryText
} from '../constants';

/**
 * Constant/variable `matGreen` defining mat green in `src/theme/palettes`.
 * @zh 常量/变量 `matGreen`，定义 `src/theme/palettes` 中的MaterialGreen。
 */
export const matGreen: Palette = {
    50: '#e8f5e9',
    100: '#c8e6c9',
    200: '#a5d6a7',
    300: '#81c784',
    400: '#66bb6a',
    500: '#4caf50',
    600: '#43a047',
    700: '#388e3c',
    800: '#2e7d32',
    900: '#1b5e20',
    A100: '#b9f6ca',
    A200: '#69f0ae',
    A400: '#00e676',
    A700: '#00c853',
    contrast: {
        50: darkPrimaryText,
        100: darkPrimaryText,
        200: darkPrimaryText,
        300: darkPrimaryText,
        400: darkPrimaryText,
        500: darkPrimaryText,
        600:lightPrimaryText,
        700:lightPrimaryText,
        800: lightPrimaryText,
        900: lightPrimaryText,
        A100: darkPrimaryText,
        A200: darkPrimaryText,
        A400: darkPrimaryText,
        A700: darkPrimaryText
    }
};
