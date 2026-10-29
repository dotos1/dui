/**
 * @fileoverview Module `src/theme/tokens/mat/_toolbar.ts` providing toolbar definitions and implementation.
 * @zh 模块文件 `src/theme/tokens/mat/_toolbar.ts`，提供工具栏相关的定义与实现。
 */


import * as inspection from '../../mdc/inspection';
import * as theming from '../../mdc/theming';
/**
 * Constant/variable `$prefix` defining prefix in `src/theme/tokens/mat`.
 * @zh 常量/变量 `$prefix`，定义 `src/theme/tokens/mat` 中的前缀。
 */
export const $prefix=["mat", "toolbar"];

/**
 * Executes `get_unthemable_tokens` to handle get unthemable tokens.
 * @zh 执行 `get_unthemable_tokens`，用于获取不可主题化设计令牌。
 */
export function get_unthemable_tokens() {
  return {};
}

// Tokens that can be configured through Angular Material's color theming API.
/**
 * Executes `get_color_tokens` to handle get color tokens.
 * @zh 执行 `get_color_tokens`，用于获取颜色设计令牌。
 * @param $theme - theme parameter (`any`) / 主题参数（`any`）
 */
export function get_color_tokens($theme) {
  return private_get_color_palette_color_tokens(
    inspection.get_theme_color($theme, 'background', 'app-bar'),
   inspection.get_theme_color($theme, 'foreground', 'text'),
  );
}

// Tokens that can be configured through Angular Material's typography theming API.
/**
 * Executes `get_typography_tokens` to handle get typography tokens.
 * @zh 执行 `get_typography_tokens`，用于获取排版设计令牌。
 * @param $theme - theme parameter (`any`) / 主题参数（`any`）
 */
export function get_typography_tokens($theme) {
  return {
    'title-text-font': inspection.get_theme_typography($theme, 'headline-6', 'font-family'),
    'title-text-line-height': inspection.get_theme_typography($theme, 'headline-6', 'line-height'),
    'title-text-size': inspection.get_theme_typography($theme, 'headline-6', 'font-size'),
    'title-text-tracking': inspection.get_theme_typography($theme, 'headline-6', 'letter-spacing'),
    'title-text-weight': inspection.get_theme_typography($theme, 'headline-6', 'font-weight'),
  };
}

// Tokens that can be configured through Angular Material's density theming API.
/**
 * Executes `get_density_tokens` to handle get density tokens.
 * @zh 执行 `get_density_tokens`，用于获取密度设计令牌。
 * @param $theme - theme parameter (`any`) / 主题参数（`any`）
 */
export function get_density_tokens($theme) {
  let $density_scale= theming.clamp_density(inspection.get_theme_density($theme), -3);
  let $standard_scale= {
    "0": "64px",
    "-1": "60px",
    "-2": "56px",
    "-3": "52px",
  };

  let $mobile_scale= {
    "0": "56px",
    "-1": "52px",
    "-2": "48px",
    "-3": "44px",
  };

  return {
    "standard-height": $standard_scale[$density_scale],
    "mobile-height": $mobile_scale[$density_scale],
  };
}

/**
 * Executes `private_get_color_palette_color_tokens` to handle private get color palette color tokens.
 * @zh 执行 `private_get_color_palette_color_tokens`，用于内部获取颜色调色板颜色设计令牌。
 * @param $background_color - background color parameter (`any`) / 背景颜色参数（`any`）
 * @param $text_color - text color parameter (`any`) / 文本颜色参数（`any`）
 */
export function private_get_color_palette_color_tokens($background_color, $text_color) {
  return {
    'container-background-color': $background_color,
    'container-text-color': $text_color,
  };
}
