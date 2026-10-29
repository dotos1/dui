/**
 * @fileoverview Module `src/theme/tokens/mat/_text-button.ts` providing text button definitions and implementation.
 * @zh 模块文件 `src/theme/tokens/mat/_text-button.ts`，提供文本按钮相关的定义与实现。
 */

import {rgba} from '../../mat-color';
import * as theming from '../../mdc/theming';
import * as ripple from '../../mdc/_ripple-theme';
import * as inspection from '../../mdc/inspection';

/**
 * Constant/variable `$prefix` defining prefix in `src/theme/tokens/mat`.
 * @zh 常量/变量 `$prefix`，定义 `src/theme/tokens/mat` 中的前缀。
 */
export const $prefix=["mat", "text-button"];

/**
 * Executes `get_unthemable_tokens` to handle get unthemable tokens.
 * @zh 执行 `get_unthemable_tokens`，用于获取不可主题化设计令牌。
 */
export function get_unthemable_tokens() {
  return {
    'horizontal-padding': '8px',
    'with-icon-horizontal-padding': '8px',
    'icon-spacing': '8px',
    'icon-offset': 0,
  };
}

/**
 * Executes `get_color_tokens` to handle get color tokens.
 * @zh 执行 `get_color_tokens`，用于获取颜色设计令牌。
 * @param $theme - theme parameter (`any`) / 主题参数（`any`）
 */
export function get_color_tokens($theme) {
  let $is_dark= inspection.get_theme_type($theme) == 'dark';
  let $ripple_opacities= ($is_dark? ripple.$light_ink_opacities:ripple.$dark_ink_opacities);
  return {
    'state-layer-color': inspection.get_theme_color($theme, 'foreground', 'base'),
    'disabled-state-layer-color': inspection.get_theme_color($theme, 'foreground', 'base'),
    'ripple-color': inspection.get_theme_color($theme, 'foreground',  'base', 0.1),
    'hover-state-layer-opacity': $ripple_opacities.hover,
    'focus-state-layer-opacity': $ripple_opacities.focus,
    'pressed-state-layer-opacity': $ripple_opacities.press,
  };
}

/**
 * Executes `private_get_color_palette_color_tokens` to handle private get color palette color tokens.
 * @zh 执行 `private_get_color_palette_color_tokens`，用于内部获取颜色调色板颜色设计令牌。
 * @param $theme - theme parameter (`any`) / 主题参数（`any`）
 * @param $palette_name - palette name parameter (`any`) / 调色板名称参数（`any`）
 */
export function private_get_color_palette_color_tokens($theme, $palette_name) {
  let $color= inspection.get_theme_color($theme, $palette_name);
  let $ripple_opacity: 0.1;
  return {
    'state-layer-color': $color,
    'ripple-color': rgba($color, $ripple_opacity)
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
  let $density_scale= theming.clamp_density(inspection.get_theme_density($theme), -3);
  return {
    'touch-target-display': ($density_scale < -1? 'none': 'block'),
  };
}
