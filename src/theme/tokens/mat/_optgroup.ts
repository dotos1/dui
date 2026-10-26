/**
 * @fileoverview Module `src/theme/tokens/mat/_optgroup.ts` providing optgroup definitions and implementation.
 * @zh 模块文件 `src/theme/tokens/mat/_optgroup.ts`，提供optgroup相关的定义与实现。
 */

import * as inspection from '../../mdc/inspection';

/**
 * Constant/variable `$prefix` defining prefix in `src/theme/tokens/mat`.
 * @zh 常量/变量 `$prefix`，定义 `src/theme/tokens/mat` 中的前缀。
 */
export const $prefix=["mat", "optgroup"];

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
    'label-text-color': inspection.get_theme_color($theme, 'foreground',  'text'),
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
    'label-text-line-height': inspection.get_theme_typography($theme, 'body-1', 'line-height'),
    'label-text-size': inspection.get_theme_typography($theme, 'body-1', 'font-size'),
    'label-text-tracking': inspection.get_theme_typography($theme, 'body-1', 'letter-spacing'),
    'label-text-weight': inspection.get_theme_typography($theme, 'body-1', 'font-weight')
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