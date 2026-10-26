/**
 * @fileoverview Module `src/theme/theme/mat-icon-theme.ts` providing mat icon theme definitions and implementation.
 * @zh 模块文件 `src/theme/theme/mat-icon-theme.ts`，提供Material图标主题相关的定义与实现。
 */

import { Theme } from '../interfaces/theme';
import * as inspection from '../mdc/inspection';

import { create_token_values } from '../mdc/token-utils';
import * as  mat_icon from '../tokens/mat/_icon';
/**
 * Executes `_palette_colors` to handle palette colors.
 * @zh 执行 `_palette_colors`，用于调色板颜色列表。
 * @param $theme - theme parameter (`any`) / 主题参数（`any`）
 * @param $palette_name - palette name parameter (`any`) / 调色板名称参数（`any`）
 */
function _palette_colors($theme, $palette_name) {
    let $color= inspection.get_theme_color($theme, $palette_name, 'text');
    let $tokens= mat_icon.private_get_icon_color_tokens($color);
    return create_token_values(mat_icon.$prefix,$tokens);
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
          ...create_token_values(mat_icon.$prefix,mat_icon.get_color_tokens(theme)),
        "&.mat-primary": {
          ..._palette_colors(theme,'primary')
        },
        "&.mat-accent": {
            ..._palette_colors(theme,'accent')
        },
        "&.mat-warn": {
          ..._palette_colors(theme,'warn')
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
    }
  }
/**
 * Executes `matIconTheme` to handle mat icon theme.
 * @zh 执行 `matIconTheme`，用于Material图标主题。
 * @param theme - theme parameter (`Theme`) / 主题参数（`Theme`）
 * @returns Result of type `Object` / 类型为 `Object` 的返回值
 */
export function matIconTheme(theme: Theme): Object {
    return {
      ".mat-icon": {
          ...base(theme),
          ...color(theme),
          ...density(theme),
          "color":"var(--mat-icon-color)",
          "svg":{
            "stroke": "var(--mat-icon-color) !important"
  
          }
        },
        ".mat-icon svg": {
            "stroke": "var(--mat-icon-color) !important"

        }
      };
}
