/**
 * @fileoverview Module `src/theme/theme/mat-menu-theme.ts` providing mat menu theme definitions and implementation.
 * @zh 模块文件 `src/theme/theme/mat-menu-theme.ts`，提供Material菜单主题相关的定义与实现。
 */

import { Theme } from '../interfaces/theme';
import { TypographyConfig } from '../interfaces';
import { create_token_values } from '../mdc/token-utils';
import * as  mat_menu from '../tokens/mat/_menu';
/**
 * Executes `base` to handle base.
 * @zh 执行 `base`，用于基础。
 * @param theme - theme parameter (`Theme`) / 主题参数（`Theme`）
 * @returns Result of type `Object` / 类型为 `Object` 的返回值
 */
function base(theme: Theme): Object {
    return{
        ...create_token_values(mat_menu.$prefix,mat_menu.get_unthemable_tokens()),
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
        ...create_token_values(mat_menu.$prefix,mat_menu.get_color_tokens(theme)),
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
      ".mat-mdc-menu-item" : {
        ...create_token_values(mat_menu.$prefix,mat_menu.get_density_tokens(theme)),
        "min-height": "var(--mat-menu-menu-height) !important",
      }
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
            ...create_token_values(mat_menu.$prefix, mat_menu.get_typography_tokens(theme)),
    }
}
/**
 * Executes `matMenuTheme` to handle mat menu theme.
 * @zh 执行 `matMenuTheme`，用于Material菜单主题。
 * @param theme - theme parameter (`Theme`) / 主题参数（`Theme`）
 * @returns Result of type `Object` / 类型为 `Object` 的返回值
 */
export function matMenuTheme(theme: Theme): Object {

    return {
        '.mat-mdc-menu-content': {
            ...typography(theme.typography),
        },
        '.mat-mdc-menu-panel': {
            ...base(theme),
            ...color(theme),
        },
        '.mat-mdc-menu-item .mat-icon-no-color':{
            "color": "var(--mat-icon-color) !important",
        },
        ...density(theme),
    };
}
