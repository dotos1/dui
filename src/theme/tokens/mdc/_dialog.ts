/**
 * @fileoverview Module `src/theme/tokens/mdc/_dialog.ts` providing dialog definitions and implementation.
 * @zh 模块文件 `src/theme/tokens/mdc/_dialog.ts`，提供对话框相关的定义与实现。
 */

import * as inspection from '../../mdc/inspection';

/**
 * Constant/variable `$prefix` defining prefix in `src/theme/tokens/mdc`.
 * @zh 常量/变量 `$prefix`，定义 `src/theme/tokens/mdc` 中的前缀。
 */
export const $prefix=["mdc", "dialog"];
/**
 * Constant/variable `$custom_property_prefix` defining custom property prefix in `src/theme/tokens/mdc`.
 * @zh 常量/变量 `$custom_property_prefix`，定义 `src/theme/tokens/mdc` 中的自定义属性前缀。
 */
export const $custom_property_prefix= 'dialog';

/**
 * Executes `get_unthemable_tokens` to handle get unthemable tokens.
 * @zh 执行 `get_unthemable_tokens`，用于获取不可主题化设计令牌。
 */
export function get_unthemable_tokens() {
  return {
    'container-elevation': 24,
    'container-shadow-color': '#000',
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
  let $text_base= inspection.get_theme_color($theme, 'foreground', 'text', 1);
  return {
    'container-color': inspection.get_theme_color($theme, 'background', 'dialog'),
    'subhead-color': $text_base,
    'supporting-text-color': $text_base,
  };
}

/**
 * Executes `get_typography_tokens` to handle get typography tokens.
 * @zh 执行 `get_typography_tokens`，用于获取排版设计令牌。
 * @param $theme - theme parameter (`any`) / 主题参数（`any`）
 */
export function get_typography_tokens($theme) {
  return {
    'subhead-font': inspection.get_theme_typography($theme, 'headline-6', 'font-family'),
    'subhead-line-height': inspection.get_theme_typography($theme, 'headline-6', 'line-height'),
    'subhead-size': inspection.get_theme_typography($theme, 'headline-6', 'font-size'),
    'subhead-weight': inspection.get_theme_typography($theme, 'headline-6', 'font-weight'),
    'subhead-tracking': inspection.get_theme_typography($theme, 'headline-6', 'letter-spacing'),
    'supporting-text-font': inspection.get_theme_typography($theme, 'body-1', 'font-family'),
    'supporting-text-line-height': inspection.get_theme_typography($theme, 'body-1', 'line-height'),
    'supporting-text-size': inspection.get_theme_typography($theme, 'body-1', 'font-size'),
    'supporting-text-weight': inspection.get_theme_typography($theme, 'body-1', 'font-weight'),
    'supporting-text-tracking': inspection.get_theme_typography($theme, 'body-1', 'letter-spacing'),
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
