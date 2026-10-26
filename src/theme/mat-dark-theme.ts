/**
 * @fileoverview Module `src/theme/mat-dark-theme.ts` providing mat dark theme definitions and implementation.
 * @zh 模块文件 `src/theme/mat-dark-theme.ts`，提供Material深色主题相关的定义与实现。
 */

import { Palette, Theme, Foreground, Background, TypographyConfig } from './interfaces';
import { matPalette } from './mat-palette';
import { matRed, matGrey } from './palettes';
import { lightDividers, lightDisabledText, lightSecondaryText, lightFocused } from './constants';

/**
 * Constant/variable `matDarkThemeForeground` defining mat dark theme foreground in `src/theme`.
 * @zh 常量/变量 `matDarkThemeForeground`，定义 `src/theme` 中的Material深色主题前景。
 */
const matDarkThemeForeground: Foreground = {
    base: 'white',
    divider: lightDividers,
    dividers: lightDividers,
    disabled: lightDisabledText,
    'disabled-button': 'rgba(white, 0.3)',
    'disabled-text': lightDisabledText,
    'hint-text': lightDisabledText,
    'secondary-text': lightSecondaryText,
    'elevation':'black',
    icon: 'rgba(white, 0.70)',
    icons: 'rgba(white, 0.70)',
    text: 'rgba(white, 0.87)',
    'slider-min': 'white',
    'slider-off': 'rgba(white, 0.3)',
    'slider-off-active': 'rgba(white, 0.3)'
};

/**
 * Constant/variable `matDarkThemeBackground` defining mat dark theme background in `src/theme`.
 * @zh 常量/变量 `matDarkThemeBackground`，定义 `src/theme` 中的Material深色主题背景。
 */
const matDarkThemeBackground: Background = {
    'status-bar': 'black',
    'app-bar': matGrey[900],
    background: matGrey[900],
    hover: 'rgba(white, 0.04)',
    card: matGrey[800],
    dialog: matGrey[800],
    'disabled-button': matGrey[700],
    'raised-button': matGrey[800],
    'focused-button': lightFocused,
    'selected-button': matGrey[900],
    'selected-disabled-button': matGrey[800],
    'disabled-button-toggle': matGrey[700],
    'unselected-chip': matGrey[700],
    'disabled-list-option': matGrey[700],
    'tooltip': matGrey[700],
};

/**
 * Executes `matDarkTheme` to handle mat dark theme.
 * @zh 执行 `matDarkTheme`，用于Material深色主题。
 * @param primary - primary parameter (`Palette`) / 主色参数（`Palette`）
 * @param accent - accent parameter (`Palette`) / 强调色参数（`Palette`）
 * @param warn - warn parameter (`Palette`) / 警告色参数（`Palette`）
 * @param density - density parameter (`number`) / 密度参数（`number`）
 * @param typography - typography parameter (`TypographyConfig`) / 排版参数（`TypographyConfig`）
 * @returns Result of type `Theme` / 类型为 `Theme` 的返回值
 */
export function matDarkTheme(primary: Palette, accent: Palette, warn: Palette = matPalette(matRed), density:number=-1, typography:TypographyConfig): Theme {
    return {
        primary,
        accent,
        warn,
        type: 'dark',
        foreground: matDarkThemeForeground,
        background: matDarkThemeBackground,
        density,
        typography
    };
}



