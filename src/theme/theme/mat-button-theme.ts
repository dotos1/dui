/**
 * @fileoverview Module `src/theme/theme/mat-button-theme.ts` providing mat button theme definitions and implementation.
 * @zh 模块文件 `src/theme/theme/mat-button-theme.ts`，提供Material按钮主题相关的定义与实现。
 */

import { Theme } from '../interfaces/theme';
import { TypographyConfig } from '../interfaces';
import { create_token_values } from '../mdc/token-utils';
import * as keys from '../mdc/keys';
import { button_theme } from '../mdc/theme-utils';
import * as  mdc_filled from '../tokens/mdc/_filled-button';
import * as  mat_filled from '../tokens/mat/_filled-button';
import * as  mdc_outlined from '../tokens/mdc/_outlined-button';
import * as  mat_outlined from '../tokens/mat/_outlined-button';
import * as  mdc_protected from '../tokens/mdc/_protected-button';
import * as  mat_protected from '../tokens/mat/_protected-button';
import * as  mdc_text from '../tokens/mdc/_text-button';
import * as  mat_text from '../tokens/mat/_text-button';

/**
 * Executes `base` to handle base.
 * @zh 执行 `base`，用于基础。
 * @param theme - theme parameter (`Theme`) / 主题参数（`Theme`）
 * @returns Result of type `Object` / 类型为 `Object` 的返回值
 */
function base(theme: Theme): Object {

  return{
        ...keys.declare_custom_properties(button_theme(mdc_text.get_unthemable_tokens()),mdc_text.$custom_property_prefix),
        ...keys.declare_custom_properties(button_theme(mdc_filled.get_unthemable_tokens()),mdc_filled.$custom_property_prefix),
        ...keys.declare_custom_properties(button_theme(mdc_protected.get_unthemable_tokens()),mdc_protected.$custom_property_prefix),
        ...keys.declare_custom_properties(button_theme(mdc_outlined.get_unthemable_tokens()),mdc_outlined.$custom_property_prefix),

        ...create_token_values(mat_text.$prefix,mat_text.get_unthemable_tokens()),
        ...create_token_values(mat_filled.$prefix,mat_filled.get_unthemable_tokens()),
        ...create_token_values(mat_protected.$prefix,mat_protected.get_unthemable_tokens()),
        ...create_token_values(mat_outlined.$prefix,mat_outlined.get_unthemable_tokens()),
  }
}
/**
 * Executes `_text_button_variant` to handle text button variant.
 * @zh 执行 `_text_button_variant`，用于文本按钮variant。
 * @param $theme - theme parameter (`any`) / 主题参数（`any`）
 * @param $palette - palette parameter (`any`) / 调色板参数（`any`）
 */
function _text_button_variant($theme, $palette) {
  let $mdc_tokens= ($palette ?mdc_text.private_get_color_palette_color_tokens($theme, $palette):mdc_text.get_color_tokens($theme));
  let $mat_tokens= ($palette?mat_text.private_get_color_palette_color_tokens($theme, $palette): mat_text.get_color_tokens($theme));

  return{
        ...keys.declare_custom_properties(button_theme($mdc_tokens),mdc_text.$custom_property_prefix),
        ...create_token_values(mat_text.$prefix,$mat_tokens),
  }
}
/**
 * Executes `_filled_button_variant` to handle filled button variant.
 * @zh 执行 `_filled_button_variant`，用于已填充按钮variant。
 * @param $theme - theme parameter (`any`) / 主题参数（`any`）
 * @param $palette - palette parameter (`any`) / 调色板参数（`any`）
 */
function _filled_button_variant($theme, $palette) {
  let $mdc_tokens= ($palette ?mdc_filled.private_get_color_palette_color_tokens($theme, $palette):mdc_filled.get_color_tokens($theme));
  let $mat_tokens= ($palette?mat_filled.private_get_color_palette_color_tokens($theme, $palette): mat_filled.get_color_tokens($theme));
  return{
        ...keys.declare_custom_properties(button_theme($mdc_tokens),mdc_filled.$custom_property_prefix),
        ...create_token_values(mat_filled.$prefix,$mat_tokens),
  }
}
/**
 * Executes `_protected_button_variant` to handle protected button variant.
 * @zh 执行 `_protected_button_variant`，用于protected按钮variant。
 * @param $theme - theme parameter (`any`) / 主题参数（`any`）
 * @param $palette - palette parameter (`any`) / 调色板参数（`any`）
 */
function _protected_button_variant($theme, $palette) {
  let $mdc_tokens= ($palette ?mdc_protected.private_get_color_palette_color_tokens($theme, $palette):mdc_protected.get_color_tokens($theme));
  let $mat_tokens= ($palette?mat_protected.private_get_color_palette_color_tokens($theme, $palette): mat_protected.get_color_tokens($theme));
  return{
        ...keys.declare_custom_properties(button_theme($mdc_tokens),mdc_protected.$custom_property_prefix),
        ...create_token_values(mat_protected.$prefix,$mat_tokens),
  }
}
/**
 * Executes `_outlined_button_variant` to handle outlined button variant.
 * @zh 执行 `_outlined_button_variant`，用于outlined按钮variant。
 * @param $theme - theme parameter (`any`) / 主题参数（`any`）
 * @param $palette - palette parameter (`any`) / 调色板参数（`any`）
 */
function _outlined_button_variant($theme, $palette) {
  let $mdc_tokens= ($palette ?mdc_outlined.private_get_color_palette_color_tokens($theme, $palette):mdc_outlined.get_color_tokens($theme));
  let $mat_tokens= ($palette?mat_outlined.private_get_color_palette_color_tokens($theme, $palette): mat_outlined.get_color_tokens($theme));
  return{
        ...keys.declare_custom_properties(button_theme($mdc_tokens),mdc_outlined.$custom_property_prefix),
        ...create_token_values(mat_outlined.$prefix,$mat_tokens),
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
    ..._text_button_variant(theme, null),
    ..._filled_button_variant(theme, null),
    ..._protected_button_variant(theme, null),
    ..._outlined_button_variant(theme, null)
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
    ...keys.declare_custom_properties(button_theme(mdc_text.get_density_tokens(theme)),mdc_text.$custom_property_prefix),
    ...keys.declare_custom_properties(button_theme(mdc_filled.get_density_tokens(theme)),mdc_filled.$custom_property_prefix),
    ...keys.declare_custom_properties(button_theme(mdc_protected.get_density_tokens(theme)),mdc_protected.$custom_property_prefix),
    ...keys.declare_custom_properties(button_theme(mdc_outlined.get_density_tokens(theme)),mdc_outlined.$custom_property_prefix),

    ...create_token_values(mat_text.$prefix,mat_text.get_density_tokens(theme)),
    ...create_token_values(mat_filled.$prefix,mat_filled.get_density_tokens(theme)),
    ...create_token_values(mat_protected.$prefix,mat_protected.get_density_tokens(theme)),
    ...create_token_values(mat_outlined.$prefix,mat_outlined.get_density_tokens(theme)),
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
    ...keys.declare_custom_properties(button_theme(mdc_text.get_typography_tokens(theme)),mdc_text.$custom_property_prefix),
    ...keys.declare_custom_properties(button_theme(mdc_filled.get_typography_tokens(theme)),mdc_filled.$custom_property_prefix),
    ...keys.declare_custom_properties(button_theme(mdc_protected.get_typography_tokens(theme)),mdc_protected.$custom_property_prefix),
    ...keys.declare_custom_properties(button_theme(mdc_outlined.get_typography_tokens(theme)),mdc_outlined.$custom_property_prefix),

    ...create_token_values(mat_text.$prefix,mat_text.get_typography_tokens(theme)),
    ...create_token_values(mat_filled.$prefix,mat_filled.get_typography_tokens(theme)),
    ...create_token_values(mat_protected.$prefix,mat_protected.get_typography_tokens(theme)),
    ...create_token_values(mat_outlined.$prefix,mat_outlined.get_typography_tokens(theme)),
  }
}
/**
 * Executes `matButtonTheme` to handle mat button theme.
 * @zh 执行 `matButtonTheme`，用于Material按钮主题。
 * @param theme - theme parameter (`Theme`) / 主题参数（`Theme`）
 * @returns Result of type `Object` / 类型为 `Object` 的返回值
 */
export function matButtonTheme(theme: Theme): Object {

  return {
    ".mat-mdc-button": {
      "min-height":"var(--mdc-text-button-container-height)",
      "&.mat-primary": {
        ..._text_button_variant(theme, "primary")
      },
      "&.mat-accent": {
        ..._text_button_variant(theme, "accent")
      },
      "&.mat-warn": {
        ..._text_button_variant(theme, "warn")
      }
    },
    ".mat-mdc-unelevated-button": {
      "min-height":"var(--mdc-filled-button-container-height)",
      "&.mat-primary": {
        ..._filled_button_variant(theme, "primary")
      },
      "&.mat-accent": {
        ..._filled_button_variant(theme, "accent")
      },
      "&.mat-warn": {
        ..._filled_button_variant(theme, "warn")
      }
    },
    ".mat-mdc-raised-button": {
      "min-height":"var( --mdc-protected-button-container-height: 32px)",
      "&.mat-primary": {
        ..._protected_button_variant(theme, "primary")
      },
      "&.mat-accent": {
        ..._protected_button_variant(theme, "accent")
      },
      "&.mat-warn": {
        ..._protected_button_variant(theme, "warn")
      }
    },
    ".mat-mdc-outlined-button": {
      "min-height":"var(--mdc-outlined-button-container-height)",
      "&.mat-primary": {
        ..._outlined_button_variant(theme, "primary")
      },
      "&.mat-accent": {
        ..._outlined_button_variant(theme, "accent")
      },
      "&.mat-warn": {
        ..._outlined_button_variant(theme, "warn")
      }
    },
    ".mdc-button": {
      ...base(theme),
      ...color(theme),
      ...density(theme),
      ...typography(theme.typography),     
    }
  };
}

