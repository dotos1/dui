/**
 * @fileoverview Module `src/theme/theme/mat-select-theme.ts` providing mat select theme definitions and implementation.
 * @zh 模块文件 `src/theme/theme/mat-select-theme.ts`，提供Material下拉选择主题相关的定义与实现。
 */

import { Theme } from '../interfaces/theme';
import { TypographyConfig } from '../interfaces';
import { create_token_values } from '../mdc/token-utils';
import * as  select from '../tokens/mat/_select';

/**
 * Executes `base` to handle base.
 * @zh 执行 `base`，用于基础。
 * @param theme - theme parameter (`Theme`) / 主题参数（`Theme`）
 * @returns Result of type `Object` / 类型为 `Object` 的返回值
 */
function base(theme: Theme): Object {
    let $mat_tokens= select.get_unthemable_tokens();

    return {
        ...create_token_values(select.$prefix, $mat_tokens)
    }
}
/**
 * Executes `color` to handle color.
 * @zh 执行 `color`，用于颜色。
 * @param theme - theme parameter (`Theme`) / 主题参数（`Theme`）
 * @returns Result of type `Object` / 类型为 `Object` 的返回值
 */
function color(theme: Theme): Object {
    return {
        ...create_token_values(select.$prefix,select.get_color_tokens(theme)),
        ".mat-mdc-form-field.mat-accent":{
            ...create_token_values(select.$prefix, select.get_color_tokens(theme, "accent"))
          },
          ".mat-mdc-form-field.mat-warn":{
            ...create_token_values(select.$prefix,select.get_color_tokens(theme, "warn"))
          }
    }
}
  
/**
 * Executes `density` to handle density.
 * @zh 执行 `density`，用于密度。
 * @param theme - theme parameter (`any`) / 主题参数（`any`）
 */
function density(theme) {
    return {
        ...create_token_values(select.$prefix, select.get_density_tokens(theme))
    }
  }
  /**
   * Executes `typography` to handle typography.
   * @zh 执行 `typography`，用于排版。
   * @param theme - theme parameter (`TypographyConfig`) / 主题参数（`TypographyConfig`）
   */
  function typography(theme:TypographyConfig) {
    return{
        ...create_token_values(select.$prefix, select.get_typography_tokens(theme))
    }
}
/**
 * Executes `matSelectTheme` to handle mat select theme.
 * @zh 执行 `matSelectTheme`，用于Material下拉选择主题。
 * @param theme - theme parameter (`Theme`) / 主题参数（`Theme`）
 * @returns Result of type `Object` / 类型为 `Object` 的返回值
 */
export function matSelectTheme(theme: Theme): Object {
    return {
        '.mat-mdc-select,.mat-mdc-select-panel' : {
            ...base(theme),
            ...color(theme),
            ...density(theme),
            ...typography(theme.typography)
        }
    };
}

