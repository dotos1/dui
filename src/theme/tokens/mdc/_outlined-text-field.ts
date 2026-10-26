/**
 * @fileoverview Module `src/theme/tokens/mdc/_outlined-text-field.ts` providing outlined text field definitions and implementation.
 * @zh 模块文件 `src/theme/tokens/mdc/_outlined-text-field.ts`，提供outlined文本字段相关的定义与实现。
 */

import * as inspection from '../../mdc/inspection';
import * as sass from '../../mdc/_sass-utils';

/**
 * Constant/variable `$prefix` defining prefix in `src/theme/tokens/mdc`.
 * @zh 常量/变量 `$prefix`，定义 `src/theme/tokens/mdc` 中的前缀。
 */
export const $prefix=["mdc", "outlined-text-field"];
/**
 * Constant/variable `$custom_property_prefix` defining custom property prefix in `src/theme/tokens/mdc`.
 * @zh 常量/变量 `$custom_property_prefix`，定义 `src/theme/tokens/mdc` 中的自定义属性前缀。
 */
export const $custom_property_prefix= 'outlined-text-field';

/**
 * Executes `get_unthemable_tokens` to handle get unthemable tokens.
 * @zh 执行 `get_unthemable_tokens`，用于获取不可主题化设计令牌。
 */
export function get_unthemable_tokens() {
  return {
    'outline-width': '1px',
    'focus-outline-width': '2px',
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
  let $warn_color= inspection.get_theme_color($theme, 'warn');
  let $color_tokens= private_get_color_palette_color_tokens($theme, 'primary');

  let $on_surface= ($is_dark? '#fff': '#000');
  let $text_color_base= inspection.get_theme_color($theme, 'foreground',  'text', 1);
  let $disabled_text_color_base= inspection.get_theme_color($theme, 'foreground',  'disabled-text', 1);
  let $divider_base= inspection.get_theme_color($theme, 'foreground',  'divider', 1);

  return {
    ...$color_tokens, 
    'label-text-color': sass.safe_color_change($text_color_base,  0.6),
    'hover-label-text-color': sass.safe_color_change($text_color_base, 0.6),
    'disabled-label-text-color':
      sass.safe_color_change($disabled_text_color_base, 0.38),

    'input-text-color': sass.safe_color_change($text_color_base,0.87),
    'disabled-input-text-color':
      sass.safe_color_change($disabled_text_color_base, 0.38),
    'input-text-placeholder-color': sass.safe_color_change($text_color_base,  0.6),

    'error-caret-color': $warn_color,
    'error-focus-label-text-color': $warn_color,
    'error-label-text-color': $warn_color,
    'error-hover-label-text-color': $warn_color,

    // Outline tokens
    'outline-color': sass.safe_color_change($divider_base, 0.38),
    'disabled-outline-color': sass.safe_color_change($divider_base, 0.06),
    'hover-outline-color': sass.safe_color_change($divider_base, 0.87),
    'error-focus-outline-color': $warn_color,
    'error-hover-outline-color': $warn_color,
    'error-outline-color': $warn_color,
  };
}

/**
 * Executes `private_get_color_palette_color_tokens` to handle private get color palette color tokens.
 * @zh 执行 `private_get_color_palette_color_tokens`，用于private获取颜色调色板颜色设计令牌。
 * @param $theme - theme parameter (`any`) / 主题参数（`any`）
 * @param $palette_name - palette name parameter (`any`) / 调色板名称参数（`any`）
 */
export function private_get_color_palette_color_tokens($theme, $palette_name) {
  let $palette_color= inspection.get_theme_color($theme, $palette_name);

  return {
    'caret-color': $palette_color,
    'focus-outline-color': $palette_color,
    'focus-label-text-color': sass.safe_color_change($palette_color, 0.87),
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
  return {    'label-offset-x':'-8px'};
}
