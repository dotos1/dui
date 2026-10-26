/**
 * @fileoverview Module `src/theme/theme/mat-toolbar-theme.ts` providing mat toolbar theme definitions and implementation.
 * @zh 模块文件 `src/theme/theme/mat-toolbar-theme.ts`，提供Material工具栏主题相关的定义与实现。
 */

import * as inspection from '../mdc/inspection';
import {
    Theme,
    Palette
} from '../interfaces/index';
import { TypographyConfig } from '../interfaces';
import { create_token_values } from '../mdc/token-utils';
import * as  toolbar from '../tokens/mat/_toolbar';


/**
 * Executes `_palette_styles` to handle palette styles.
 * @zh 执行 `_palette_styles`，用于调色板样式集合。
 * @param $theme - theme parameter (`any`) / 主题参数（`any`）
 * @param $palette_name - palette name parameter (`any`) / 调色板名称参数（`any`）
 */
function _palette_styles($theme, $palette_name) {
    return {
        ...create_token_values(
            toolbar.$prefix,
            toolbar.private_get_color_palette_color_tokens(
                inspection.get_theme_color($theme, $palette_name),
                inspection.get_theme_color($theme, $palette_name, "default-contrast")
            )
      )
    }
  }
/**
 * Executes `base` to handle base.
 * @zh 执行 `base`，用于基础。
 * @param theme - theme parameter (`Theme`) / 主题参数（`Theme`）
 * @returns Result of type `Object` / 类型为 `Object` 的返回值
 */
function base(theme: Theme): Object {
    return{
    }
}
  
/**
 * Executes `color` to handle color.
 * @zh 执行 `color`，用于颜色。
 * @param theme - theme parameter (`Theme`) / 主题参数（`Theme`）
 * @returns Result of type `Object` / 类型为 `Object` 的返回值
 */
function color(theme: Theme): Object {
    return{
        ...create_token_values(toolbar.$prefix,toolbar.get_color_tokens(theme)),
        "&.mat-primary": {
            ..._palette_styles(theme, 'primary')
        },
        "&.mat-accent": {
            ..._palette_styles(theme, 'accent')
        },
        "&.mat-warn": {
            ..._palette_styles(theme, 'warn')
        }
    }
}
/**
 * Executes `density` to handle density.
 * @zh 执行 `density`，用于密度。
 * @param theme - theme parameter (`Theme`) / 主题参数（`Theme`）
 * @returns Result of type `Object` / 类型为 `Object` 的返回值
 */
function density(theme: Theme): Object {
    return{
        ...create_token_values(toolbar.$prefix, toolbar.get_density_tokens(theme))
    }
}
/**
 * Executes `typography` to handle typography.
 * @zh 执行 `typography`，用于排版。
 * @param theme - theme parameter (`TypographyConfig`) / 主题参数（`TypographyConfig`）
 * @returns Result of type `Object` / 类型为 `Object` 的返回值
 */
function typography(theme: TypographyConfig): Object {
    return{
        ...create_token_values(toolbar.$prefix,toolbar.get_typography_tokens(theme))
    }
}
/**
 * Executes `matToolbarTheme` to handle mat toolbar theme.
 * @zh 执行 `matToolbarTheme`，用于Material工具栏主题。
 * @param theme - theme parameter (`Theme`) / 主题参数（`Theme`）
 * @returns Result of type `Object` / 类型为 `Object` 的返回值
 */
export function matToolbarTheme(theme: Theme): Object {
    return {
        '.mat-toolbar': {
            ...base(theme),
            ...color(theme),
            ...density(theme),
            ...typography(theme.typography)
        }
    };
}

