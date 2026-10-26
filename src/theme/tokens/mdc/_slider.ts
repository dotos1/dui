/**
 * @fileoverview Module `src/theme/tokens/mdc/_slider.ts` providing slider definitions and implementation.
 * @zh 模块文件 `src/theme/tokens/mdc/_slider.ts`，提供滑块相关的定义与实现。
 */

import * as inspection from '../../mdc/inspection';
import * as elevation from '../../mdc/elevation-theme';

/**
 * Constant/variable `$prefix` defining prefix in `src/theme/tokens/mdc`.
 * @zh 常量/变量 `$prefix`，定义 `src/theme/tokens/mdc` 中的前缀。
 */
export const $prefix=["mdc", "slider"];
/**
 * Constant/variable `$custom_property_prefix` defining custom property prefix in `src/theme/tokens/mdc`.
 * @zh 常量/变量 `$custom_property_prefix`，定义 `src/theme/tokens/mdc` 中的自定义属性前缀。
 */
export const $custom_property_prefix= 'slider';

/**
 * Executes `get_unthemable_tokens` to handle get unthemable tokens.
 * @zh 执行 `get_unthemable_tokens`，用于获取不可主题化设计令牌。
 */
export function get_unthemable_tokens() {
  return {
    'active-track-height': '6px',
    'active-track-shape': '9999px',
    'handle-height': '20px',
    'handle-shape': '50%',
    'handle-width': '20px',
    'inactive-track-height': '4px',
    'inactive-track-shape': '9999px',
    'with-overlap-handle-outline-width': '1px',
    'with-tick-marks-active-container-opacity': 0.6,
    'with-tick-marks-container-shape': '50%',
    'with-tick-marks-container-size': '2px',
    'with-tick-marks-inactive-container-opacity': 0.6,
  };
}

/**
 * Executes `get_color_tokens` to handle get color tokens.
 * @zh 执行 `get_color_tokens`，用于获取颜色设计令牌。
 * @param $theme - theme parameter (`any`) / 主题参数（`any`）
 */
export function get_color_tokens($theme) {
  let $elevation= inspection.get_theme_color($theme, 'foreground',  'elevation');
  let $is_dark= inspection.get_theme_type($theme) == 'dark';
  let $on_surface= ($is_dark ?'#fff': '#000');
  let $theme_color_tokens= private_get_color_palette_color_tokens($theme, 'primary');

  return {
    ...$theme_color_tokens,
      'disabled-active-track-color': $on_surface,
      'disabled-handle-color': $on_surface,
      'disabled-inactive-track-color': $on_surface,
      'label-container-color': $on_surface,
      'label-label-text-color': ($is_dark? '#000': '#fff'),
      'with-overlap-handle-outline-color':' #fff',
      'with-tick-marks-disabled-container-color': $on_surface,
      'handle-elevation': 1,
      'handle-shadow-color': ($elevation != null? $elevation: elevation.$color),
  };
}

/**
 * Executes `private_get_color_palette_color_tokens` to handle private get color palette color tokens.
 * @zh 执行 `private_get_color_palette_color_tokens`，用于private获取颜色调色板颜色设计令牌。
 * @param $theme - theme parameter (`any`) / 主题参数（`any`）
 * @param $palette_name - palette name parameter (`any`) / 调色板名称参数（`any`）
 */
export function private_get_color_palette_color_tokens($theme, $palette_name) {
  let $color= inspection.get_theme_color($theme, $palette_name);
  let $on_color= inspection.get_theme_color($theme, $palette_name, 'default-contrast');

  return {
    'handle-color': $color,
    'focus-handle-color': $color,
    'hover-handle-color': $color,
    'active-track-color': $color,
    'inactive-track-color': $color,
    'with-tick-marks-inactive-container-color': $color,
    'with-tick-marks-active-container-color': $on_color,
  };
}

/**
 * Executes `get_typography_tokens` to handle get typography tokens.
 * @zh 执行 `get_typography_tokens`，用于获取排版设计令牌。
 * @param $theme - theme parameter (`any`) / 主题参数（`any`）
 */
export function get_typography_tokens($theme) {
  return {
    'label-label-text-font': inspection.get_theme_typography($theme, 'subtitle-2', 'font-family'),
    'label-label-text-size': inspection.get_theme_typography($theme, 'subtitle-2', 'font-size'),
    'label-label-text-line-height': inspection.get_theme_typography($theme, 'subtitle-2', 'line-height'),
    'label-label-text-tracking': inspection.get_theme_typography($theme, 'subtitle-2', 'letter-spacing'),
    'label-label-text-weight': inspection.get_theme_typography($theme, 'subtitle-2', 'font-weight'),
  };
}

/**
 * Executes `get_density_tokens` to handle get density tokens.
 * @zh 执行 `get_density_tokens`，用于获取密度设计令牌。
 * @param $theme - theme parameter (`any`) / 主题参数（`any`）
 */
export function get_density_tokens($theme) {
  return {};
}
