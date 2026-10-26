/**
 * @fileoverview Module `src/theme/tokens/mat/_full-pseudo-checkbox.ts` providing full pseudo checkbox definitions and implementation.
 * @zh 模块文件 `src/theme/tokens/mat/_full-pseudo-checkbox.ts`，提供完整pseudo复选框相关的定义与实现。
 */

import * as inspection from '../../mdc/inspection';

/**
 * Constant/variable `$prefix` defining prefix in `src/theme/tokens/mat`.
 * @zh 常量/变量 `$prefix`，定义 `src/theme/tokens/mat` 中的前缀。
 */
export const $prefix=["mat", "full-pseudo-checkbox"];

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
 * @param $palette_name - palette name parameter (`any`) / 调色板名称参数（`any`）
 */
export function get_color_tokens($theme, $palette_name= 'accent') {
  let $is_dark= inspection.get_theme_type($theme) == 'dark';
  let $disabled_color= ($is_dark? '#686868': '#b0b0b0');
  let $checkmark_color= inspection.get_theme_color($theme, 'background', 'background');

  return {
    'selected-icon-color': inspection.get_theme_color($theme, $palette_name),
    'selected-checkmark-color': $checkmark_color,
    'unselected-icon-color': inspection.get_theme_color($theme, 'foreground',  'secondary-text'),
    'disabled-selected-checkmark-color': $checkmark_color,
    'disabled-unselected-icon-color': $disabled_color,
    'disabled-selected-icon-color': $disabled_color,
  };
}

/**
 * Executes `get_typography_tokens` to handle get typography tokens.
 * @zh 执行 `get_typography_tokens`，用于获取排版设计令牌。
 * @param $theme - theme parameter (`any`) / 主题参数（`any`）
 */
export function get_typography_tokens($theme) {
  return {};
}

/**
 * Executes `get_density_tokens` to handle get density tokens.
 * @zh 执行 `get_density_tokens`，用于获取密度设计令牌。
 * @param $theme - theme parameter (`any`) / 主题参数（`any`）
 */
export function get_density_tokens($theme) {
  return {};
}


