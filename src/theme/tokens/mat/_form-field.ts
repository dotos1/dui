/**
 * @fileoverview Module `src/theme/tokens/mat/_form-field.ts` providing form field definitions and implementation.
 * @zh 模块文件 `src/theme/tokens/mat/_form-field.ts`，提供表单字段相关的定义与实现。
 */

import * as inspection from '../../mdc/inspection';
import * as theming from '../../mdc/theming';
import * as palette from '../../mdc/_palette';


/**
 * Constant/variable `$prefix` defining prefix in `src/theme/tokens/mat`.
 * @zh 常量/变量 `$prefix`，定义 `src/theme/tokens/mat` 中的前缀。
 */
export const $prefix=["mat", "form-field"];
/**
 * Constant/variable `$custom_property_prefix` defining custom property prefix in `src/theme/tokens/mat`.
 * @zh 常量/变量 `$custom_property_prefix`，定义 `src/theme/tokens/mat` 中的自定义属性前缀。
 */
export const $custom_property_prefix= 'form-field';

/**
 * Executes `get_unthemable_tokens` to handle get unthemable tokens.
 * @zh 执行 `get_unthemable_tokens`，用于获取不可主题化设计令牌。
 */
export function get_unthemable_tokens() {
  return {};
}

/**
 * Executes `get_color_tokens` to handle get color tokens.
 * @zh 执行 `get_color_tokens`，用于获取颜色设计令牌。
 * @param $theme - theme parameter (`any`) / 主题参数（`any`）
 */
export function get_color_tokens($theme) {
  let $is_dark= inspection.get_theme_type($theme) == 'dark';
  let $color_tokens= private_get_color_palette_color_tokens($theme, 'primary');
  return {
    ...$color_tokens, 
    'disabled-input-text-placeholder-color':
      inspection.get_theme_color($theme, 'foreground', 'icon', 0.38),
    'state-layer-color': inspection.get_theme_color($theme, 'foreground', 'base', 0.87),
    'error-text-color': inspection.get_theme_color($theme, 'warn'),
    'select-option-text-color': ($is_dark? palette.$dark_primary_text: 'inherit'),
    'select-disabled-option-text-color': ($is_dark? palette.$dark_disabled_text: 'GrayText'),
    'leading-icon-color': 'unset',
    'disabled-leading-icon-color': 'unset',
    'trailing-icon-color': 'unset',
    'disabled-trailing-icon-color': 'unset',
    'error-focus-trailing-icon-color': 'unset',
    'error-hover-trailing-icon-color': 'unset',
    'error-trailing-icon-color': 'unset',
    'enabled-select-arrow-color': inspection.get_theme_color($theme, 'foreground', 'icon', 0.54),
    'disabled-select-arrow-color': inspection.get_theme_color($theme, 'foreground', 'icon', 0.38),
    'hover-state-layer-opacity': ($is_dark? 0.08: 0.04),
    'focus-state-layer-opacity': ($is_dark? 0.24: 0.08),
  };
}

/**
 * Executes `private_get_color_palette_color_tokens` to handle private get color palette color tokens.
 * @zh 执行 `private_get_color_palette_color_tokens`，用于内部获取颜色调色板颜色设计令牌。
 * @param $theme - theme parameter (`any`) / 主题参数（`any`）
 * @param $palette_name - palette name parameter (`any`) / 调色板名称参数（`any`）
 */
export function private_get_color_palette_color_tokens($theme, $palette_name) {
  let $palette_color= inspection.get_theme_color($theme, $palette_name);
  return {
    'focus-select-arrow-color': $palette_color
  };
}

/**
 * Executes `get_typography_tokens` to handle get typography tokens.
 * @zh 执行 `get_typography_tokens`，用于获取排版设计令牌。
 * @param $theme - theme parameter (`any`) / 主题参数（`any`）
 */
export function get_typography_tokens($theme) {
  return {
    'container-text-font': inspection.get_theme_typography($theme, 'body-1', 'font-family'),
    'container-text-line-height': inspection.get_theme_typography($theme, 'body-1', 'line-height'),
    'container-text-size': inspection.get_theme_typography($theme, 'body-1', 'font-size'),
    'container-text-tracking': inspection.get_theme_typography($theme, 'body-1', 'letter-spacing'),
    'container-text-weight': inspection.get_theme_typography($theme, 'body-1', 'font-weight'),
    'outlined-label-text-populated-size': inspection.get_theme_typography($theme, 'body-1', 'font-size'),
    'subscript-text-font': inspection.get_theme_typography($theme, 'caption', 'font-family'),
    'subscript-text-line-height': inspection.get_theme_typography($theme, 'caption', 'line-height'),
    'subscript-text-size': inspection.get_theme_typography($theme, 'caption', 'font-size'),
    'subscript-text-tracking': inspection.get_theme_typography($theme, 'caption', 'letter-spacing'),
    'subscript-text-weight': inspection.get_theme_typography($theme, 'caption', 'font-weight'),
  };
}

// Tokens that can be configured through Angular Material's density theming API.
/**
 * Executes `get_density_tokens` to handle get density tokens.
 * @zh 执行 `get_density_tokens`，用于获取密度设计令牌。
 * @param $theme - theme parameter (`any`) / 主题参数（`any`）
 */
export function get_density_tokens($theme) {
  let $density_scale= theming.clamp_density(inspection.get_theme_density($theme), -4);
  let $density_config ={
      "-1": 48,
      "0": 56,
      "-2": 40,
  }
  let $height= $density_config[$density_scale+""] ? $density_config[$density_scale+""] :$density_config['-1'] ;
  let $hide_label= $height < 40;
  let $vertical_deduction= (40 - $height)/2;

  let $filled_with_label_padding_top= 24 - $vertical_deduction;
  let $filled_with_label_padding_bottom= 8 - $vertical_deduction;
  let $vertical_padding= 16 - $vertical_deduction;

  return {
    'container-height': $height+'px',
    'filled-label-display': ($hide_label? 'none': 'block'),
    'container-vertical-padding': $vertical_padding +'px',
    'filled-with-label-container-padding-top':
      ($hide_label? $vertical_padding: $filled_with_label_padding_top)+'px',
    'filled-with-label-container-padding-bottom':
      ($hide_label? $vertical_padding: $filled_with_label_padding_bottom)+'px',
  };
}

