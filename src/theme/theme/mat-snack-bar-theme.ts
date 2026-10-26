/**
 * @fileoverview Module `src/theme/theme/mat-snack-bar-theme.ts` providing mat snack bar theme definitions and implementation.
 * @zh 模块文件 `src/theme/theme/mat-snack-bar-theme.ts`，提供Materialsnack条主题相关的定义与实现。
 */

import { Theme } from '../interfaces/theme';
import { create_token_values } from '../mdc/token-utils';
import * as keys from '../mdc/keys';
import * as  mdc_snack from '../tokens/mdc/_snack-bar';
import * as  mat_snack from '../tokens/mat/_snack-bar';
import { TypographyConfig } from '../interfaces';
/**
 * Executes `base` to handle base.
 * @zh 执行 `base`，用于基础。
 * @param theme - theme parameter (`Theme`) / 主题参数（`Theme`）
 * @returns Result of type `Object` / 类型为 `Object` 的返回值
 */
function base(theme: Theme): Object {
  return{
        ...keys.declare_custom_properties(mdc_snack.get_unthemable_tokens(),mdc_snack.$custom_property_prefix),
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
        ...keys.declare_custom_properties(mdc_snack.get_color_tokens(theme),mdc_snack.$custom_property_prefix),
        ...create_token_values(mat_snack.$prefix,mat_snack.get_color_tokens(theme)),
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
 * Executes `typography` to handle typography.
 * @zh 执行 `typography`，用于排版。
 * @param theme - theme parameter (`TypographyConfig`) / 主题参数（`TypographyConfig`）
 */
function typography(theme: TypographyConfig) {
  return{
      ...keys.declare_custom_properties(mdc_snack.get_typography_tokens(theme),mdc_snack.$custom_property_prefix),
  }
}
/**
 * Executes `matSnackBarTheme` to handle mat snack bar theme.
 * @zh 执行 `matSnackBarTheme`，用于MaterialSnack条主题。
 * @param theme - theme parameter (`Theme`) / 主题参数（`Theme`）
 * @returns Result of type `Object` / 类型为 `Object` 的返回值
 */
export function matSnackBarTheme(theme: Theme): Object {
    return {
        '.mat-mdc-snack-bar': {
            ...base(theme),
            ...color(theme),
            ...density(theme),
            ...typography(theme.typography)
        }
    };
}
