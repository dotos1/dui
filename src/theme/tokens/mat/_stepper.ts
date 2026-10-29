/**
 * @fileoverview Module `src/theme/tokens/mat/_stepper.ts` providing stepper definitions and implementation.
 * @zh 模块文件 `src/theme/tokens/mat/_stepper.ts`，提供步骤条相关的定义与实现。
 */


import * as inspection from '../../mdc/inspection';
import * as theming from '../../mdc/theming';

/**
 * Constant/variable `$prefix` defining prefix in `src/theme/tokens/mat`.
 * @zh 常量/变量 `$prefix`，定义 `src/theme/tokens/mat` 中的前缀。
 */
export const $prefix=["mat", "stepper"];

/**
 * Executes `get_unthemable_tokens` to handle get unthemable tokens.
 * @zh 执行 `get_unthemable_tokens`，用于获取不可主题化设计令牌。
 */
export function get_unthemable_tokens() {
  return {
    "header-focus-state-layer-shape": 0,
    "header-hover-state-layer-shape": 0,
  };
}

/**
 * Executes `get_color_tokens` to handle get color tokens.
 * @zh 执行 `get_color_tokens`，用于获取颜色设计令牌。
 * @param $theme - theme parameter (`any`) / 主题参数（`any`）
 */
export function get_color_tokens($theme) {
  return {
    ...private_get_color_palette_color_tokens($theme, 'primary'),
    'container-color': inspection.get_theme_color($theme, 'background', 'card'),
    'line-color': inspection.get_theme_color($theme, 'foreground', 'divider'),
    'header-hover-state-layer-color': inspection.get_theme_color($theme, 'background', 'hover'),
    'header-focus-state-layer-color': inspection.get_theme_color($theme, 'background', 'hover'),
    'header-label-text-color': inspection.get_theme_color($theme, 'foreground', 'secondary-text'),
    'header-optional-label-text-color': inspection.get_theme_color($theme, 'foreground', 'secondary-text'),
    'header-selected-state-label-text-color': inspection.get_theme_color($theme, 'foreground', 'text'),
    'header-error-state-label-text-color': inspection.get_theme_color($theme, 'warn', 'text'),
    'header-icon-background-color': inspection.get_theme_color($theme, 'foreground', 'secondary-text'),
    'header-error-state-icon-foreground-color': inspection.get_theme_color($theme, 'warn', 'text'),
    'header-error-state-icon-background-color': 'transparent',
    };
}

/**
 * Executes `get_typography_tokens` to handle get typography tokens.
 * @zh 执行 `get_typography_tokens`，用于获取排版设计令牌。
 * @param $theme - theme parameter (`any`) / 主题参数（`any`）
 */
export function get_typography_tokens($theme) {
  return {
    'container-text-font': inspection.get_theme_typography($theme, 'body-2', 'font-family'),
    'header-label-text-font': inspection.get_theme_typography($theme, 'body-2', 'font-family'),
    'header-label-text-size': inspection.get_theme_typography($theme, 'body-2', 'font-size'),
    'header-label-text-weight': inspection.get_theme_typography($theme, 'body-2', 'font-weight'),
    'header-error-state-label-text-size': inspection.get_theme_typography($theme, 'body-1', 'font-size'),
    'header-selected-state-label-text-size': inspection.get_theme_typography($theme, 'body-1', 'font-size'),
    'header-selected-state-label-text-weight': inspection.get_theme_typography($theme, 'body-1', 'font-weight'),
    };
}

/**
 * Executes `get_density_tokens` to handle get density tokens.
 * @zh 执行 `get_density_tokens`，用于获取密度设计令牌。
 * @param $theme - theme parameter (`any`) / 主题参数（`any`）
 */
export function get_density_tokens($theme) {
  let $scale= theming.clamp_density(inspection.get_theme_density($theme), -4);
  let $height_config ={
    '0': '72px',
    '-1': '68px',
    '-2': '64px',
    '-3': '60px',
    '-4': '42px',
  };

  return {
    "header-height": $height_config[$scale],
  };
}

/**
 * Executes `private_get_color_palette_color_tokens` to handle private get color palette color tokens.
 * @zh 执行 `private_get_color_palette_color_tokens`，用于内部获取颜色调色板颜色设计令牌。
 * @param $theme - theme parameter (`any`) / 主题参数（`any`）
 * @param $palette_name - palette name parameter (`any`) / 调色板名称参数（`any`）
 */
export function private_get_color_palette_color_tokens($theme, $palette_name) {
  let $active_state_foreground= inspection.get_theme_color($theme, $palette_name, 'default-contrast');
  let $active_state_background= inspection.get_theme_color($theme, $palette_name);
  return {
    'header-icon-foreground-color': $active_state_foreground,
    'header-selected-state-icon-background-color': $active_state_background,
    'header-selected-state-icon-foreground-color': $active_state_foreground,
    'header-done-state-icon-background-color': $active_state_background,
    'header-done-state-icon-foreground-color': $active_state_foreground,
    'header-edit-state-icon-background-color': $active_state_background,
    'header-edit-state-icon-foreground-color': $active_state_foreground,
  };
}
