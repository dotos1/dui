/**
 * @fileoverview Module `src/theme/mat-light-theme.ts` providing mat light theme definitions and implementation.
 * @zh 模块文件 `src/theme/mat-light-theme.ts`，提供Material浅色主题相关的定义与实现。
 */

import {
    Palette,
    Theme,
    Foreground,
    Background,
    TypographyConfig
} from './interfaces';

import { matPalette } from './mat-palette';

import {
    matRed,
    matGrey
} from './palettes';

import {
    darkDividers,
    darkDisabledText,
    darkSecondaryText,
    darkFocused
} from './constants';

// Foreground palette for light themes.
/**
 * Constant/variable `matLightThemeForeground` defining mat light theme foreground in `src/theme`.
 * @zh 常量/变量 `matLightThemeForeground`，定义 `src/theme` 中的Material浅色主题前景。
 */
const matLightThemeForeground: Foreground = {
    base: 'black',
    divider: darkDividers,
    dividers: darkDividers,
    disabled: darkDisabledText,
    'disabled-button': 'rgba(black, 0.26)',
    'disabled-text': darkDisabledText,
    'hint-text': darkDisabledText,
    'secondary-text': darkSecondaryText,
    icon: 'rgba(black, 0.54)',
    icons: 'rgba(black, 0.54)',
    text: 'rgba(black, 0.87)',
    'elevation':'black',
    'slider-min': 'rgba(black, 0.87)',
    'slider-off': 'rgba(black, 0.26)',
    'slider-off-active': 'rgba(black, 0.38)'
};

// Background palette for dark themes.
/**
 * Constant/variable `matLightThemeBackground` defining mat light theme background in `src/theme`.
 * @zh 常量/变量 `matLightThemeBackground`，定义 `src/theme` 中的Material浅色主题背景。
 */
const matLightThemeBackground: Background = {
    'status-bar': matGrey[300],
    'app-bar': matGrey[100],
    background: matGrey[50],
    hover: 'rgba(black, 0.04)',
    card: 'white',
    dialog: 'white',
    'disabled-button': 'rgba(black, 0.12)',
    'raised-button': 'white',
    'focused-button': darkFocused,
    'selected-button': matGrey[300],
    'selected-disabled-button': matGrey[400],
    'disabled-button-toggle': matGrey[200],
    'unselected-chip': matGrey[300],
    'disabled-list-option': matGrey[200],
    'tooltip': matGrey[700],
};


/**
 * Executes `matLightTheme` to handle mat light theme.
 * @zh 执行 `matLightTheme`，用于Material浅色主题。
 * @param primary - primary parameter (`Palette`) / 主色参数（`Palette`）
 * @param accent - accent parameter (`Palette`) / 强调色参数（`Palette`）
 * @param warn - warn parameter (`Palette`) / 警告色参数（`Palette`）
 * @param density - density parameter (`number`) / 密度参数（`number`）
 * @param typography - typography parameter (`TypographyConfig`) / 排版参数（`TypographyConfig`）
 * @returns Result of type `Theme` / 类型为 `Theme` 的返回值
 */
export function matLightTheme(primary: Palette, accent: Palette, warn: Palette = matPalette(matRed), density:number=-1,typography:TypographyConfig): Theme {
    return {
        primary,
        accent,
        warn,
        type: 'light',
        foreground: matLightThemeForeground,
        background: matLightThemeBackground,
        density,
        typography
    };
}

