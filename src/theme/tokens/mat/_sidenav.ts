/**
 * @fileoverview Module `src/theme/tokens/mat/_sidenav.ts` providing sidenav definitions and implementation.
 * @zh 模块文件 `src/theme/tokens/mat/_sidenav.ts`，提供侧边导航相关的定义与实现。
 */

import * as inspection from '../../mdc/inspection';
import * as elevation from '../../mdc/elevation-theme';
import {invert,rgba} from '../../mat-color';
/**
 * Constant/variable `$prefix` defining prefix in `src/theme/tokens/mat`.
 * @zh 常量/变量 `$prefix`，定义 `src/theme/tokens/mat` 中的前缀。
 */
export const $prefix=["mat", "sidenav"];

/**
 * Executes `get_unthemable_tokens` to handle get unthemable tokens.
 * @zh 执行 `get_unthemable_tokens`，用于获取不可主题化设计令牌。
 */
export function get_unthemable_tokens() {
  return {
    'container-shape': 0,
    'container-elevation-shadow': elevation.elevation_box_shadow(16),
    'container-width': 'auto',
  };
}

// Tokens that can be configured through Angular Material's color theming API.
/**
 * Executes `get_color_tokens` to handle get color tokens.
 * @zh 执行 `get_color_tokens`，用于获取颜色设计令牌。
 * @param $theme - theme parameter (`any`) / 主题参数（`any`）
 */
export function get_color_tokens($theme) {
  let $is_dark= inspection.get_theme_type($theme) ==  'dark';
  let $scrim_opacity = 0.6;
  let $scrim_color= inspection.get_theme_color($theme, 'background', 'card');
  let $fallback_scrim_color= ($is_dark ? rgba('#fff', $scrim_opacity): rgba('#000', $scrim_opacity));

  return {
    'container-divider-color': inspection.get_theme_color($theme, 'foreground', 'divider'),
    'container-background-color': inspection.get_theme_color($theme, 'background', 'dialog'),
    'container-text-color': inspection.get_theme_color($theme, 'foreground', 'text'),
    'content-background-color': inspection.get_theme_color($theme, 'background', 'background'),
    'content-text-color': inspection.get_theme_color($theme, 'foreground', 'text'),
    'scrim-color': invert($scrim_color)
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

// Tokens that can be configured through Angular Material's density theming API.
/**
 * Executes `get_density_tokens` to handle get density tokens.
 * @zh 执行 `get_density_tokens`，用于获取密度设计令牌。
 * @param $theme - theme parameter (`any`) / 主题参数（`any`）
 */
export function get_density_tokens($theme) {
  return {};
}

