/**
 * @fileoverview Module `src/theme/tokens/mat/_icon.ts` providing icon definitions and implementation.
 * @zh 模块文件 `src/theme/tokens/mat/_icon.ts`，提供图标相关的定义与实现。
 */

import * as inspection from '../../mdc/inspection';

/**
 * Constant/variable `$prefix` defining prefix in `src/theme/tokens/mat`.
 * @zh 常量/变量 `$prefix`，定义 `src/theme/tokens/mat` 中的前缀。
 */
export const $prefix=["mat", "icon"];

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
  return {
    'color': inspection.get_theme_color($theme, 'foreground',  'icons')
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

/**
 * Executes `private_get_icon_color_tokens` to handle private get icon color tokens.
 * @zh 执行 `private_get_icon_color_tokens`，用于private获取图标颜色设计令牌。
 * @param $color - color parameter (`any`) / 颜色参数（`any`）
 */
export function private_get_icon_color_tokens($color) {
  return {
    color: $color,
  };
}