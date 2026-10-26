/**
 * @fileoverview Module `src/theme/tokens/mat/_switch.ts` providing switch definitions and implementation.
 * @zh 模块文件 `src/theme/tokens/mat/_switch.ts`，提供切换开关相关的定义与实现。
 */

import * as inspection from '../../mdc/inspection';
import * as theming from '../../mdc/theming';
/**
 * Constant/variable `$prefix` defining prefix in `src/theme/tokens/mat`.
 * @zh 常量/变量 `$prefix`，定义 `src/theme/tokens/mat` 中的前缀。
 */
export const $prefix=["mat", "switch"];

/**
 * Executes `get_unthemable_tokens` to handle get unthemable tokens.
 * @zh 执行 `get_unthemable_tokens`，用于获取不可主题化设计令牌。
 */
export function get_unthemable_tokens() {
  return {
    'disabled-selected-handle-opacity': 0.38,
    'disabled-unselected-handle-opacity': 0.38,
    'unselected-handle-size': '20px',
    'selected-handle-size': '20px',
    'pressed-handle-size': '20px',
    'with-icon-handle-size': '20px',
    
    'selected-handle-horizontal-margin': 0,
    'selected-with-icon-handle-horizontal-margin': 0,
    'selected-pressed-handle-horizontal-margin': 0,
    'unselected-handle-horizontal-margin': 0,
    'unselected-with-icon-handle-horizontal-margin': 0,
    'unselected-pressed-handle-horizontal-margin': 0,
    'visible-track-opacity': 1,
    'hidden-track-opacity': 1,
    'visible-track-transition': 'transform 75ms 0ms cubic-bezier(0, 0, 0.2, 1)',
    'hidden-track-transition': 'transform 75ms 0ms cubic-bezier(0.4, 0, 0.6, 1)',

    'track-outline-width': '1px',
    'track-outline-color': 'transparent',
    'selected-track-outline-width': '1px',
    'disabled-unselected-track-outline-width': '1px',
    'disabled-unselected-track-outline-color': 'transparent',
  };
}

/**
 * Executes `get_color_tokens` to handle get color tokens.
 * @zh 执行 `get_color_tokens`，用于获取颜色设计令牌。
 * @param $theme - theme parameter (`any`) / 主题参数（`any`）
 */
export function get_color_tokens($theme) {
  return {
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
  return {};
}