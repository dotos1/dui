/**
 * @fileoverview Module `src/theme/theme/mat-checkbox-theme.ts` providing mat checkbox theme definitions and implementation.
 * @zh 模块文件 `src/theme/theme/mat-checkbox-theme.ts`，提供Material复选框主题相关的定义与实现。
 */

import { Theme } from '../interfaces/theme';
import { TypographyConfig } from '../interfaces';
import { create_token_values } from '../mdc/token-utils';
import * as keys from '../mdc/keys';
import * as  mdc_checkbox from '../tokens/mdc/_checkbox';
import * as  mdc_form from '../tokens/mdc/_form-field';
import * as  mat_checkbox from '../tokens/mat/_checkbox';
/**
 * Executes `base` to handle base.
 * @zh 执行 `base`，用于基础。
 * @param theme - theme parameter (`Theme`) / 主题参数（`Theme`）
 * @returns Result of type `Object` / 类型为 `Object` 的返回值
 */
function base(theme: Theme): Object {
  return{
        ...keys.declare_custom_properties(mdc_checkbox.get_unthemable_tokens(),mdc_checkbox.$custom_property_prefix),
        ...create_token_values(mat_checkbox.$prefix,mat_checkbox.get_unthemable_tokens()),
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
        ...keys.declare_custom_properties(mdc_checkbox.get_color_tokens(theme),mdc_checkbox.$custom_property_prefix),
        ...keys.declare_custom_properties(mdc_form.get_color_tokens(theme),mdc_form.$custom_property_prefix),
        ...create_token_values(mat_checkbox.$prefix,mat_checkbox.get_color_tokens(theme)),

      "&.mat-primary": {
        ...keys.declare_custom_properties(mdc_checkbox.get_color_tokens(theme,'primary'),mdc_checkbox.$custom_property_prefix),
      },

      "&.mat-warn": {
        ...keys.declare_custom_properties(mdc_checkbox.get_color_tokens(theme,'warn'),mdc_checkbox.$custom_property_prefix),
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
    ...keys.declare_custom_properties(mdc_checkbox.get_density_tokens(theme),mdc_checkbox.$custom_property_prefix),
    ...create_token_values(mat_checkbox.$prefix,mat_checkbox.get_density_tokens(theme)),
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
          ...keys.declare_custom_properties(mdc_checkbox.get_typography_tokens(theme),mdc_checkbox.$custom_property_prefix),
          ...keys.declare_custom_properties(mdc_form.get_typography_tokens(theme),mdc_form.$custom_property_prefix),
          ...create_token_values(mat_checkbox.$prefix, mat_checkbox.get_typography_tokens(theme))
  }
}
/**
 * Executes `matCheckboxTheme` to handle mat checkbox theme.
 * @zh 执行 `matCheckboxTheme`，用于Material复选框主题。
 * @param theme - theme parameter (`Theme`) / 主题参数（`Theme`）
 * @returns Result of type `Object` / 类型为 `Object` 的返回值
 */
export function matCheckboxTheme(theme: Theme): Object {
    return {
        ".mat-mdc-checkbox": {
        ...base(theme),
        ...color(theme),
        ...density(theme),
        ...typography(theme.typography)
        },
        ".mdc-checkbox": {
          ...base(theme),
          ...color(theme),
          ...density(theme),
          ...typography(theme.typography)
          }
      };
}
