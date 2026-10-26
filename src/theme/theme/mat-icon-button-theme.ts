/**
 * @fileoverview Module `src/theme/theme/mat-icon-button-theme.ts` providing mat icon button theme definitions and implementation.
 * @zh 模块文件 `src/theme/theme/mat-icon-button-theme.ts`，提供Material图标按钮主题相关的定义与实现。
 */

import { Theme } from '../interfaces/theme';
import { TypographyConfig } from '../interfaces';
import { create_token_values } from '../mdc/token-utils';
import * as keys from '../mdc/keys';
import * as inspection from '../mdc/inspection';
import * as  mdc_icon from '../tokens/mdc/_icon-button';
import * as  mat_icon from '../tokens/mat/_icon-button';

/**
 * Executes `base` to handle base.
 * @zh 执行 `base`，用于基础。
 * @param theme - theme parameter (`Theme`) / 主题参数（`Theme`）
 * @returns Result of type `Object` / 类型为 `Object` 的返回值
 */
function base(theme: Theme): Object {
  return{
        ...keys.declare_custom_properties(mdc_icon.get_unthemable_tokens(),mdc_icon.$custom_property_prefix),
  }
}
/**
 * Executes `_icon_button_variant` to handle icon button variant.
 * @zh 执行 `_icon_button_variant`，用于图标按钮variant。
 * @param $theme - theme parameter (`any`) / 主题参数（`any`）
 * @param $palette - palette parameter (`any`) / 调色板参数（`any`）
 */
function _icon_button_variant($theme, $palette) {
  let $mdc_tokens= ($palette ?mdc_icon.private_get_color_palette_color_tokens($theme, $palette):mdc_icon.get_color_tokens($theme));
  let $mat_tokens= ($palette?mat_icon.private_get_color_palette_color_tokens($theme, $palette): mat_icon.get_color_tokens($theme));
  return{
        ...keys.declare_custom_properties($mdc_tokens,mdc_icon.$custom_property_prefix),
        ...create_token_values(mat_icon.$prefix,$mat_tokens),
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
      ..._icon_button_variant(theme, null),
      "&.mat-primary": {
        ..._icon_button_variant(theme, "primary")
      },

      "&.mat-accent": {
        ..._icon_button_variant(theme, "accent")
      },

      "&.mat-warn": {
        ..._icon_button_variant(theme, "warn")
      }
  }
}

/**
 * Executes `density` to handle density.
 * @zh 执行 `density`，用于密度。
 * @param theme - theme parameter (`Theme`) / 主题参数（`Theme`）
 * @returns Result of type `Object` / 类型为 `Object` 的返回值
 */
export function density(theme: Theme): Object {
  let $icon_size= 24;
  let $density_scale= inspection.get_theme_density(theme);
  let $density_config={
    default: 48,
    maximum: 48,
    minimum: 28,
  }

  let $calculated_size= $density_config[$density_scale] ? $density_config[$density_scale] :$density_config['default'] ;
  return{
    ...create_token_values(mat_icon.$prefix,mat_icon.get_density_tokens(theme)),
    ...create_token_values(mdc_icon.$prefix,mdc_icon.get_density_tokens(theme)),
    ".mat-mdc-icon-button.mat-mdc-button-base" : {
      ...keys.declare_custom_properties({"state-layer-size": $calculated_size},mdc_icon.$custom_property_prefix),
      width: "var(--mdc-icon-button-state-layer-size)",
      height: "var(--mdc-icon-button-state-layer-size)",
      padding: ($calculated_size - $icon_size)/ 2 +"px"
    },

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
    ...create_token_values(mat_icon.$prefix,mat_icon.get_typography_tokens(theme)),
  }
}
/**
 * Executes `matIconButtonTheme` to handle mat icon button theme.
 * @zh 执行 `matIconButtonTheme`，用于Material图标按钮主题。
 * @param theme - theme parameter (`Theme`) / 主题参数（`Theme`）
 * @returns Result of type `Object` / 类型为 `Object` 的返回值
 */
export function matIconButtonTheme(theme: Theme): Object {
  return {
    ".mat-mdc-icon-button": {
      ...base(theme),
      ...color(theme),
      ...density(theme),
      ...typography(theme.typography)
    },
    ".mat-mdc-icon-button.mat-mdc-button-disabled .mat-icon": {
      "color": "var(--mdc-icon-button-disabled-icon-color) !important"
    }
  };
}

