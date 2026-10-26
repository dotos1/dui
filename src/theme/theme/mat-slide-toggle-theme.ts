/**
 * @fileoverview Module `src/theme/theme/mat-slide-toggle-theme.ts` providing mat slide toggle theme definitions and implementation.
 * @zh 模块文件 `src/theme/theme/mat-slide-toggle-theme.ts`，提供Materialslide开关主题相关的定义与实现。
 */

import { Theme } from '../interfaces/index';
import { TypographyConfig } from '../interfaces';
import * as inspection from '../mdc/inspection';
import { create_token_values } from '../mdc/token-utils';
import * as keys from '../mdc/keys';
import * as  mdc_form from '../tokens/mdc/_form-field';
import * as  mdc_switch from '../tokens/mdc/_switch';
import * as  mat_switch from '../tokens/mat/_switch';

/**
 * Executes `base` to handle base.
 * @zh 执行 `base`，用于基础。
 * @param theme - theme parameter (`Theme`) / 主题参数（`Theme`）
 * @returns Result of type `Object` / 类型为 `Object` 的返回值
 */
function base(theme: Theme): Object {
  return{
        ...keys.declare_custom_properties(mdc_switch.get_unthemable_tokens(),mdc_switch.$custom_property_prefix),
        ...create_token_values(mat_switch.$prefix,mat_switch.get_unthemable_tokens()),
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
        ...keys.declare_custom_properties(mdc_switch.get_color_tokens(theme),mdc_switch.$custom_property_prefix),
        ...keys.declare_custom_properties(mdc_form.get_color_tokens(theme),mdc_form.$custom_property_prefix),
        ...create_token_values(mat_switch.$prefix,mat_switch.get_color_tokens(theme)),
        "--mdc-switch-disabled-label-text-color": inspection.get_theme_color(theme,'foreground','disabled-text'),
        
        "&.mat-accent": {
            ...keys.declare_custom_properties(mdc_switch.private_get_color_palette_color_tokens(theme,'accent'),mdc_switch.$custom_property_prefix),
        },

        "&.mat-warn": {
            ...keys.declare_custom_properties(mdc_switch.private_get_color_palette_color_tokens(theme,'warn'),mdc_switch.$custom_property_prefix),
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
    ...keys.declare_custom_properties(mdc_switch.get_density_tokens(theme),mdc_switch.$custom_property_prefix),
  }
}
/**
 * Executes `typography` to handle typography.
 * @zh 执行 `typography`，用于排版。
 * @param theme - theme parameter (`TypographyConfig`) / 主题参数（`TypographyConfig`）
 */
function typography(theme: TypographyConfig) {
  return{
      ...keys.declare_custom_properties(mdc_switch.get_typography_tokens(theme),mdc_switch.$custom_property_prefix),
      ...keys.declare_custom_properties(mdc_form.get_typography_tokens(theme),mdc_form.$custom_property_prefix),
      ...create_token_values(mat_switch.$prefix, mat_switch.get_typography_tokens(theme))
  }
}
/**
 * Executes `matSlideToggleTheme` to handle mat slide toggle theme.
 * @zh 执行 `matSlideToggleTheme`，用于MaterialSlide开关主题。
 * @param theme - theme parameter (`Theme`) / 主题参数（`Theme`）
 * @returns Result of type `Object` / 类型为 `Object` 的返回值
 */
export function matSlideToggleTheme(theme: Theme): Object {
    return {
        ".mat-mdc-slide-toggle": {
            ...base(theme),
            ...color(theme),
            ...density(theme),
            ...typography(theme.typography)
        }
    };
}
