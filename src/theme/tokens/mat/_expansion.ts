/**
 * @fileoverview Module `src/theme/tokens/mat/_expansion.ts` providing expansion definitions and implementation.
 * @zh 模块文件 `src/theme/tokens/mat/_expansion.ts`，提供展开面板相关的定义与实现。
 */

import * as inspection from '../../mdc/inspection';
import * as theming from '../../mdc/theming';
/**
 * Constant/variable `$prefix` defining prefix in `src/theme/tokens/mat`.
 * @zh 常量/变量 `$prefix`，定义 `src/theme/tokens/mat` 中的前缀。
 */
export const $prefix=["mat", "expansion"];

/**
 * Executes `get_unthemable_tokens` to handle get unthemable tokens.
 * @zh 执行 `get_unthemable_tokens`，用于获取不可主题化设计令牌。
 */
export function get_unthemable_tokens() {
  return {
    "container-shape": "4px",
    "legacy-header-indicator-display": "inline-block",
    "header-indicator-display": "none",
  };
}

/**
 * Executes `get_color_tokens` to handle get color tokens.
 * @zh 执行 `get_color_tokens`，用于获取颜色设计令牌。
 * @param $theme - theme parameter (`any`) / 主题参数（`any`）
 */
export function get_color_tokens($theme) {
  return {
    "container-background-color": inspection.get_theme_color($theme, "background", "card"),
    "container-text-color": inspection.get_theme_color($theme, "foreground", "text"),
    "actions-divider-color": inspection.get_theme_color($theme, "foreground", "divider"),
    "header-hover-state-layer-color": inspection.get_theme_color($theme, "background", "hover"),
    "header-focus-state-layer-color": inspection.get_theme_color($theme, "background", "hover"),
    "header-disabled-state-text-color": inspection.get_theme_color(
        $theme, "foreground", "disabled-button"),
    "header-text-color": inspection.get_theme_color($theme, "foreground", "text"),
    "header-description-color": inspection.get_theme_color($theme, "foreground", "secondary-text"),
    "header-indicator-color": inspection.get_theme_color($theme, "foreground", "secondary-text"),
    };
}

/**
 * Executes `get_typography_tokens` to handle get typography tokens.
 * @zh 执行 `get_typography_tokens`，用于获取排版设计令牌。
 * @param $theme - theme parameter (`any`) / 主题参数（`any`）
 */
export function get_typography_tokens($theme) {
  return {
    "header-text-font": inspection.get_theme_typography($theme, "subtitle-2", "font-family"),
    "header-text-size": inspection.get_theme_typography($theme, "subtitle-2", "font-size"),
    "header-text-weight": inspection.get_theme_typography($theme, "subtitle-2", "font-weight"),
    "header-text-line-height": "inherit",
    "header-text-tracking": "inherit",
    "container-text-font": inspection.get_theme_typography($theme, "body-2", "font-family"),
    "container-text-line-height": inspection.get_theme_typography($theme, "body-2", "line-height"),
    "container-text-size": inspection.get_theme_typography($theme, "body-2", "font-size"),
    "container-text-tracking": inspection.get_theme_typography($theme, "body-2", "letter-spacing"),
    "container-text-weight": inspection.get_theme_typography($theme, "body-2", "font-weight"),
  };
}

/**
 * Executes `get_density_tokens` to handle get density tokens.
 * @zh 执行 `get_density_tokens`，用于获取密度设计令牌。
 * @param $theme - theme parameter (`any`) / 主题参数（`any`）
 */
export function get_density_tokens($theme) {
  let $scale= theming.clamp_density(inspection.get_theme_density($theme), -3);
  let $collapsed_scale= {
    "0": "48px",
    "-1": "44px",
    "-2": "40px",
    "-3": "36px",
  };
  let $expanded_scale= {
    "0": "64px",
    "-1": "60px",
    "-2": "56px",
    "-3": "48px",
  };
  return {
    "header-collapsed-state-height": $collapsed_scale[$scale],
    "header-expanded-state-height": $expanded_scale[$scale]
  };
}

