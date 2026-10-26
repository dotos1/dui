/**
 * @fileoverview Module `src/theme/tokens/mat/_legacy-button-toggle.ts` providing legacy button toggle definitions and implementation.
 * @zh 模块文件 `src/theme/tokens/mat/_legacy-button-toggle.ts`，提供legacy按钮开关相关的定义与实现。
 */

import * as inspection from '../../mdc/inspection';

/**
 * Constant/variable `$prefix` defining prefix in `src/theme/tokens/mat`.
 * @zh 常量/变量 `$prefix`，定义 `src/theme/tokens/mat` 中的前缀。
 */
export const $prefix=["mat", "legacy-button-toggle"];

/**
 * Executes `get_unthemable_tokens` to handle get unthemable tokens.
 * @zh 执行 `get_unthemable_tokens`，用于获取不可主题化设计令牌。
 */
export function get_unthemable_tokens() {
  return {
    'height': '36px',
    'shape': '2px',
    'focus-state-layer-opacity': 1,
  };
}

/**
 * Executes `get_color_tokens` to handle get color tokens.
 * @zh 执行 `get_color_tokens`，用于获取颜色设计令牌。
 * @param $theme - theme parameter (`any`) / 主题参数（`any`）
 */
export function get_color_tokens($theme) {
  return {
    'text-color': inspection.get_theme_color($theme, 'foreground',  'hint-text'),
    'state-layer-color': inspection.get_theme_color($theme, 'background', 'focused-button'),
    'selected-state-text-color': inspection.get_theme_color($theme, 'foreground',  'secondary-text'),
    'selected-state-background-color': inspection.get_theme_color(  $theme, 'background', 'selected-button'),
    'disabled-state-text-color': inspection.get_theme_color($theme, 'foreground',  'disabled-button'),
    'disabled-state-background-color': inspection.get_theme_color( $theme, 'background', 'disabled-button-toggle'),
    'disabled-selected-state-background-color': inspection.get_theme_color(
        $theme, 'background', 'selected-disabled-button')
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
    'label-text-weight': inspection.get_theme_typography($theme, 'body-1', 'font-weight'),
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

