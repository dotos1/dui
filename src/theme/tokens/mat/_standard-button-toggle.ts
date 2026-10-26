/**
 * @fileoverview Module `src/theme/tokens/mat/_standard-button-toggle.ts` providing standard button toggle definitions and implementation.
 * @zh 模块文件 `src/theme/tokens/mat/_standard-button-toggle.ts`，提供standard按钮开关相关的定义与实现。
 */

import * as theming from '../../mdc/theming';
import * as inspection from '../../mdc/inspection';
import * as sass from '../../mdc/_sass-utils';

/**
 * Constant/variable `$prefix` defining prefix in `src/theme/tokens/mat`.
 * @zh 常量/变量 `$prefix`，定义 `src/theme/tokens/mat` 中的前缀。
 */
export const $prefix=["mat", "standard-button-toggle"];

/**
 * Executes `get_unthemable_tokens` to handle get unthemable tokens.
 * @zh 执行 `get_unthemable_tokens`，用于获取不可主题化设计令牌。
 */
export function get_unthemable_tokens() {
  return {
    'shape': '4px',
    'hover-state-layer-opacity': 0.04,
    'focus-state-layer-opacity': 0.12,
  };
}

/**
 * Executes `get_color_tokens` to handle get color tokens.
 * @zh 执行 `get_color_tokens`，用于获取颜色设计令牌。
 * @param $theme - theme parameter (`any`) / 主题参数（`any`）
 */
export function get_color_tokens($theme) {
  let $theme_divider_color= inspection.get_theme_color($theme, 'foreground',  'divider');

  // let $divider_color= if(
  //     meta.type-of($theme-divider-color) == 'color',
  //     theming.private-rgba-to-hex(
  //         $theme_divider_color, inspection.get_theme_color($theme, 'background', 'card')),
  //     $theme_divider_color);
  let $divider_color= $theme_divider_color;

  return {
    'text-color': inspection.get_theme_color($theme, 'foreground',  'text'),
    'background-color': inspection.get_theme_color($theme, 'background', 'card'),
    'state-layer-color': sass.safe_color_change(
        inspection.get_theme_color($theme, 'background', 'focused-button'), 1),
    'selected-state-background-color': inspection.get_theme_color(
        $theme, 'background', 'selected-button'),
    'selected-state-text-color': inspection.get_theme_color($theme, 'foreground',  'text'),
    'disabled-state-text-color': inspection.get_theme_color($theme, 'foreground',  'disabled-button'),
    'disabled-state-background-color': inspection.get_theme_color($theme, 'background', 'card'),
    'disabled-selected-state-text-color': inspection.get_theme_color($theme, 'foreground',  'text'),
    'disabled-selected-state-background-color':
      inspection.get_theme_color($theme, 'background', 'selected-disabled-button'),
    'divider-color': $divider_color,
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
  let $density_scale= theming.clamp_density(inspection.get_theme_density($theme), -4);
  let $size_scale={
    "0": "48px",
    "-1": "44px",
    "-2": "40px",
    "-3": "36px",
    "-4": "24px",
  };
  return {
    height: $size_scale[$density_scale]
  };
}
