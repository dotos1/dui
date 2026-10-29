/**
 * @fileoverview Module `src/theme/tokens/mat/_radio.ts` providing radio definitions and implementation.
 * @zh 模块文件 `src/theme/tokens/mat/_radio.ts`，提供单选框相关的定义与实现。
 */

import * as inspection from '../../mdc/inspection';
import * as theming from '../../mdc/theming';

/**
 * Constant/variable `$prefix` defining prefix in `src/theme/tokens/mat`.
 * @zh 常量/变量 `$prefix`，定义 `src/theme/tokens/mat` 中的前缀。
 */
export const $prefix=["mat", "radio"];

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
 * @param $palette_name - palette name parameter (`string`) / 调色板名称参数（`string`）
 */
export function get_color_tokens($theme, $palette_name= "accent") {
  return {
    "ripple-color": inspection.get_theme_color($theme, "foreground", "base"),
    "checked-ripple-color": inspection.get_theme_color($theme, $palette_name, "default"),
    "disabled-label-color": inspection.get_theme_color($theme, "foreground", "disabled-text"),
    "label-text-color": inspection.get_theme_color($theme, "foreground", "text")
  };
}

/**
 * Executes `get_typography_tokens` to handle get typography tokens.
 * @zh 执行 `get_typography_tokens`，用于获取排版设计令牌。
 * @param $theme - theme parameter (`any`) / 主题参数（`any`）
 */
export function get_typography_tokens($theme) {
  return {
    "label-text-font": inspection.get_theme_typography($theme, "body-2", "font-family"),
    "label-text-line-height": inspection.get_theme_typography($theme, "body-2", "line-height"),
    "label-text-size": inspection.get_theme_typography($theme, "body-2", "font-size"),
    "label-text-tracking": inspection.get_theme_typography($theme, "body-2", "letter-spacing"),
    "label-text-weight": inspection.get_theme_typography($theme, "body-2", "font-weight")
   };
}

/**
 * Executes `get_density_tokens` to handle get density tokens.
 * @zh 执行 `get_density_tokens`，用于获取密度设计令牌。
 * @param $theme - theme parameter (`any`) / 主题参数（`any`）
 */
export function get_density_tokens($theme) {
  let $density_scale= theming.clamp_density(inspection.get_theme_density($theme), -3);

  return {
    "touch-target-display": ($density_scale < -1? "none": "block"),
  };
}

