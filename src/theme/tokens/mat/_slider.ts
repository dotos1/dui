/**
 * @fileoverview Module `src/theme/tokens/mat/_slider.ts` providing slider definitions and implementation.
 * @zh 模块文件 `src/theme/tokens/mat/_slider.ts`，提供滑块相关的定义与实现。
 */

import * as inspection from '../../mdc/inspection';

/**
 * Constant/variable `$prefix` defining prefix in `src/theme/tokens/mat`.
 * @zh 常量/变量 `$prefix`，定义 `src/theme/tokens/mat` 中的前缀。
 */
export const $prefix=["mat", "slider"];

/**
 * Executes `get_unthemable_tokens` to handle get unthemable tokens.
 * @zh 执行 `get_unthemable_tokens`，用于获取不可主题化设计令牌。
 */
export function get_unthemable_tokens() {
  return {
    "value-indicator-width": "auto",
    "value-indicator-height": "32px",
    "value-indicator-caret-display": "block",
    "value-indicator-border-radius": "4px",
    "value-indicator-padding": "0 12px",
    "value-indicator-text-transform": "none",
    "value-indicator-container-transform": "translateX(-50%)"
  };
}

/**
 * Executes `get_color_tokens` to handle get color tokens.
 * @zh 执行 `get_color_tokens`，用于获取颜色设计令牌。
 * @param $theme - theme parameter (`any`) / 主题参数（`any`）
 */
export function get_color_tokens($theme) {
  let $theme_color_tokens= private_get_color_palette_color_tokens($theme, "primary");
  let $is_dark= inspection.get_theme_type($theme) == "dark";
  return {
    ...$theme_color_tokens,
      "value-indicator-opacity": $is_dark?0.9: 0.6
  };
}

/**
 * Executes `private_get_color_palette_color_tokens` to handle private get color palette color tokens.
 * @zh 执行 `private_get_color_palette_color_tokens`，用于private获取颜色调色板颜色设计令牌。
 * @param $theme - theme parameter (`any`) / 主题参数（`any`）
 * @param $palette_name - palette name parameter (`any`) / 调色板名称参数（`any`）
 */
export function private_get_color_palette_color_tokens($theme, $palette_name) {
  let $ripple_color= inspection.get_theme_color($theme, $palette_name);
  let $hover_ripple_color= ($ripple_color == null? null: `rgba(${$ripple_color}, 0.05)`);
  let $focus_ripple_color= ($ripple_color == null? null: `rgba(${$ripple_color}, 0.2)`);
  return {
    "ripple-color": $ripple_color,
    "hover-state-layer-color": $hover_ripple_color,
    "focus-state-layer-color": $focus_ripple_color
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
