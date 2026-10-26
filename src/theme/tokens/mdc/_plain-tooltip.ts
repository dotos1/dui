/**
 * @fileoverview Module `src/theme/tokens/mdc/_plain-tooltip.ts` providing plain tooltip definitions and implementation.
 * @zh 模块文件 `src/theme/tokens/mdc/_plain-tooltip.ts`，提供plain悬浮提示相关的定义与实现。
 */

import * as inspection from '../../mdc/inspection';

/**
 * Constant/variable `$prefix` defining prefix in `src/theme/tokens/mdc`.
 * @zh 常量/变量 `$prefix`，定义 `src/theme/tokens/mdc` 中的前缀。
 */
export const $prefix=["mdc", "plain-tooltip"];
/**
 * Constant/variable `$custom_property_prefix` defining custom property prefix in `src/theme/tokens/mdc`.
 * @zh 常量/变量 `$custom_property_prefix`，定义 `src/theme/tokens/mdc` 中的自定义属性前缀。
 */
export const $custom_property_prefix= 'plain-tooltip';

/**
 * Executes `get_unthemable_tokens` to handle get unthemable tokens.
 * @zh 执行 `get_unthemable_tokens`，用于获取不可主题化设计令牌。
 */
export function get_unthemable_tokens() {
  return {
    'container-shape': '4px',
    'supporting-text-line-height': '16px',
    'supporting-text-type': null,
  };
}

/**
 * Executes `get_color_tokens` to handle get color tokens.
 * @zh 执行 `get_color_tokens`，用于获取颜色设计令牌。
 * @param $theme - theme parameter (`any`) / 主题参数（`any`）
 */
export function get_color_tokens($theme) {
  return {
    'container-color': inspection.get_theme_color($theme, 'background', 'tooltip'),
    'supporting-text-color': '#fff',
  };
}

/**
 * Executes `get_typography_tokens` to handle get typography tokens.
 * @zh 执行 `get_typography_tokens`，用于获取排版设计令牌。
 * @param $theme - theme parameter (`any`) / 主题参数（`any`）
 */
export function get_typography_tokens($theme) {
  return {
    'supporting-text-font': inspection.get_theme_typography($theme, 'caption', 'font-family'),
    'supporting-text-size': inspection.get_theme_typography($theme, 'caption', 'font-size'),
    'supporting-text-weight': inspection.get_theme_typography($theme, 'caption', 'font-weight'),
    'supporting-text-tracking': inspection.get_theme_typography($theme, 'caption', 'letter-spacing'),
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

