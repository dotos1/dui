/**
 * @fileoverview Module `src/theme/tokens/mdc/_filled-text-field.ts` providing filled text field definitions and implementation.
 * @zh 模块文件 `src/theme/tokens/mdc/_filled-text-field.ts`，提供已填充文本字段相关的定义与实现。
 */

import {mix} from '../../mat-color';
import * as inspection from '../../mdc/inspection';
import * as sass from '../../mdc/_sass-utils';

/**
 * Constant/variable `$prefix` defining prefix in `src/theme/tokens/mdc`.
 * @zh 常量/变量 `$prefix`，定义 `src/theme/tokens/mdc` 中的前缀。
 */
export const $prefix=["mdc", "filled-text-field"];
/**
 * Constant/variable `$custom_property_prefix` defining custom property prefix in `src/theme/tokens/mdc`.
 * @zh 常量/变量 `$custom_property_prefix`，定义 `src/theme/tokens/mdc` 中的自定义属性前缀。
 */
export const $custom_property_prefix= 'filled-text-field';

/**
 * Executes `get_unthemable_tokens` to handle get unthemable tokens.
 * @zh 执行 `get_unthemable_tokens`，用于获取不可主题化设计令牌。
 */
export function get_unthemable_tokens() {
  return {
    'active-indicator-height': '1px',
    'focus-active-indicator-height': '2px',
    'container-shape': '4px',
  };
}
/**
 * Executes `get_color_tokens` to handle get color tokens.
 * @zh 执行 `get_color_tokens`，用于获取颜色设计令牌。
 * @param $theme - theme parameter (`any`) / 主题参数（`any`）
 */
export function get_color_tokens($theme) {
  let $is_dark= inspection.get_theme_type($theme) == 'dark';
  let $surface= inspection.get_theme_color($theme, 'background', 'card');
  let $warn_color= inspection.get_theme_color($theme, 'warn');
  let $color_tokens= private_get_color_palette_color_tokens($theme, 'primary');
  let $on_surface= ($is_dark? '#fff': '#000');

  let $text_color_base= inspection.get_theme_color($theme, 'foreground',  'text', 1);
  let $disabled_text_color_base=inspection.get_theme_color($theme, 'foreground',  'disabled-text', 1);
  let $divider_base= inspection.get_theme_color($theme, 'foreground',  'divider', 1);

  return {
    ...$color_tokens, 
    'container-color':sass.safe_color_change($surface, 0),
    'disabled-container-color': _variable_safe_mix($on_surface, $surface, 0.02),

    'label-text-color': sass.safe_color_change($text_color_base, 0.6),
    'hover-label-text-color': sass.safe_color_change($text_color_base, 0.6),
    'disabled-label-text-color':  sass.safe_color_change($disabled_text_color_base, 0.38),

    'input-text-color': sass.safe_color_change($text_color_base, 0.87),
    'disabled-input-text-color': sass.safe_color_change($disabled_text_color_base, 0.38),
    'input-text-placeholder-color': sass.safe_color_change($text_color_base,0.6),

    'error-hover-label-text-color': $warn_color,
    'error-focus-label-text-color': $warn_color,
    'error-label-text-color': $warn_color,
    'error-caret-color': $warn_color,

    'active-indicator-color': sass.safe_color_change($divider_base,0.42),
    'disabled-active-indicator-color': sass.safe_color_change($divider_base,0.06),
    'hover-active-indicator-color': sass.safe_color_change($divider_base,0.87),
    'error-active-indicator-color': $warn_color,
    'error-focus-active-indicator-color': $warn_color,
    'error-hover-active-indicator-color': $warn_color,
  };
}

/**
 * Executes `_variable_safe_mix` to handle variable safe mix.
 * @zh 执行 `_variable_safe_mix`，用于variable安全mix。
 * @param $first_color - first color parameter (`any`) / 首个颜色参数（`any`）
 * @param $second_color - second color parameter (`any`) / 秒颜色参数（`any`）
 * @param $amount - amount parameter (`any`) / amount参数（`any`）
 */
function _variable_safe_mix($first_color, $second_color, $amount) {
  // if (meta.type-of($first-color) == color and meta.type-of($second-color) == color) {
  //   @return color.mix($first-color, $second-color, $amount);c
  // }
  // let $mixcolor= $first_color;
  let $mixcolor= mix($first_color, $second_color, $amount);
  return $mixcolor;
}

/**
 * Executes `private_get_color_palette_color_tokens` to handle private get color palette color tokens.
 * @zh 执行 `private_get_color_palette_color_tokens`，用于内部获取颜色调色板颜色设计令牌。
 * @param $theme - theme parameter (`any`) / 主题参数（`any`）
 * @param $palette_name - palette name parameter (`any`) / 调色板名称参数（`any`）
 */
export function private_get_color_palette_color_tokens($theme, $palette_name) {
  let $palette= $theme[$palette_name];
  let $palette_color= inspection.get_theme_color($theme, $palette_name);
  return {
    'caret-color': $palette_color,
    'focus-active-indicator-color': $palette_color,
    'focus-label-text-color': sass.safe_color_change($palette_color,0.87),
  };
}

/**
 * Executes `get_typography_tokens` to handle get typography tokens.
 * @zh 执行 `get_typography_tokens`，用于获取排版设计令牌。
 * @param $theme - theme parameter (`any`) / 主题参数（`any`）
 */
export function get_typography_tokens($theme) {
  return {
    'label-text-font': inspection.get_theme_typography($theme, 'body-1', 'font-family'),
    'label-text-size': inspection.get_theme_typography($theme, 'body-1', 'font-size'),
    'label-text-tracking': inspection.get_theme_typography($theme, 'body-1', 'letter-spacing'),
    'label-text-weight': inspection.get_theme_typography($theme, 'body-1', 'font-weight'),
  };
}
/**
 * Executes `get_density_tokens` to handle get density tokens.
 * @zh 执行 `get_density_tokens`，用于获取密度设计令牌。
 * @param $theme - theme parameter (`any`) / 主题参数（`any`）
 */
export function get_density_tokens($theme) {
  return {

  };
}
