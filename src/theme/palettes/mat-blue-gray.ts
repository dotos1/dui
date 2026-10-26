/**
 * @fileoverview Module `src/theme/palettes/mat-blue-gray.ts` providing mat blue gray definitions and implementation.
 * @zh 模块文件 `src/theme/palettes/mat-blue-gray.ts`，提供Materialbluegray相关的定义与实现。
 */

import { Palette } from '../interfaces/palette';

import {
    darkPrimaryText,
    lightPrimaryText
} from '../constants';

/**
 * Constant/variable `matBlueGray` defining mat blue gray in `src/theme/palettes`.
 * @zh 常量/变量 `matBlueGray`，定义 `src/theme/palettes` 中的MaterialBlueGray。
 */
export const matBlueGray: Palette = {
    50: "#eceff1",
    100: "#cfd8dc",
    200: "#b0bec5",
    300: "#90a4ae",
    400: "#78909c",
    500: "#607d8b",
    600: "#546e7a",
    700: "#455a64",
    800: "#37474f",
    900: "#263238",
    A100: "#cfd8dc",
    A200: "#b0bec5",
    A400: "#78909c",
    A700: "#455a64",
    contrast: {
        50: darkPrimaryText,
        100: darkPrimaryText,
        200: darkPrimaryText,
        300: darkPrimaryText,
        400: darkPrimaryText,
        500: darkPrimaryText,
        600: lightPrimaryText,
        700: lightPrimaryText,
        800: lightPrimaryText,
        900: lightPrimaryText,
        A100: darkPrimaryText,
        A200: darkPrimaryText,
        A400: darkPrimaryText,
        A700: lightPrimaryText
    }
};
