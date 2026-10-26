/**
 * @fileoverview Module `src/theme/mat-darkblue-theme.ts` providing mat darkblue theme definitions and implementation.
 * @zh 模块文件 `src/theme/mat-darkblue-theme.ts`，提供Materialdarkblue主题相关的定义与实现。
 */

import { Palette, Theme, Foreground, Background, TypographyConfig } from './interfaces';
import { matPalette } from './mat-palette';
import { matRed, matBlueGray} from './palettes';
import { lightDividers, lightDisabledText, lightSecondaryText, lightFocused } from './constants';

/**
 * Constant/variable `matDarkBlueThemeForeground` defining mat dark blue theme foreground in `src/theme`.
 * @zh 常量/变量 `matDarkBlueThemeForeground`，定义 `src/theme` 中的Material深色Blue主题前景。
 */
const matDarkBlueThemeForeground: Foreground = {
    base: 'white',
    divider: lightDividers,
    dividers: lightDividers,
    disabled: lightDisabledText,
    'disabled-button': 'rgba(white, 0.3)',
    'disabled-text': lightDisabledText,
    'hint-text': lightDisabledText,
    'secondary-text': lightSecondaryText,
    'elevation':'black',
    icon: 'rgba(white, 0.54)',
    icons: 'rgba(white, 0.70)',
    text: 'rgba(white, 0.87)',
    'slider-min': 'white',
    'slider-off': 'rgba(white, 0.3)',
    'slider-off-active': 'rgba(white, 0.3)'
};


/**
 * Constant/variable `matDarkBlueThemeBackground` defining mat dark blue theme background in `src/theme`.
 * @zh 常量/变量 `matDarkBlueThemeBackground`，定义 `src/theme` 中的Material深色Blue主题背景。
 */
const matDarkBlueThemeBackground: Background = {
  'status-bar': 'black',
  'app-bar': matBlueGray[900],
  background: matBlueGray[900],
  hover: 'rgba(white, 0.04)',
  card: matBlueGray[800],
  dialog: matBlueGray[800],
  'disabled-button': matBlueGray[400],
  'raised-button': matBlueGray[800],
  'focused-button': lightFocused,
  'selected-button': matBlueGray[900],
  'selected-disabled-button': matBlueGray[800],
  'disabled-button-toggle': matBlueGray[700],
  'unselected-chip': matBlueGray[700],
  'disabled-list-option': matBlueGray[700],
  'tooltip': matBlueGray[700],
};


/**
 * Executes `matDarkBlueTheme` to handle mat dark blue theme.
 * @zh 执行 `matDarkBlueTheme`，用于Material深色Blue主题。
 * @param primary - primary parameter (`Palette`) / 主色参数（`Palette`）
 * @param accent - accent parameter (`Palette`) / 强调色参数（`Palette`）
 * @param warn - warn parameter (`Palette`) / 警告色参数（`Palette`）
 * @param density - density parameter (`number`) / 密度参数（`number`）
 * @param typography - typography parameter (`TypographyConfig`) / 排版参数（`TypographyConfig`）
 * @returns Result of type `Theme` / 类型为 `Theme` 的返回值
 */
export function matDarkBlueTheme(primary: Palette, accent: Palette, warn: Palette = matPalette(matRed), density:number=-1,typography:TypographyConfig): Theme {
    return {
        primary,
        accent,
        warn,
        type: 'darkblue',
        foreground: matDarkBlueThemeForeground,
        background: matDarkBlueThemeBackground,
        density,
        typography
    };
}



