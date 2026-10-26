/**
 * @fileoverview Module `src/theme/tokens/mdc/_checkbox.ts` providing checkbox definitions and implementation.
 * @zh 模块文件 `src/theme/tokens/mdc/_checkbox.ts`，提供复选框相关的定义与实现。
 */

import * as inspection from '../../mdc/inspection';
import * as theming from '../../mdc/theming';
import * as palette from '../../mdc/_palette';

/**
 * Constant/variable `$prefix` defining prefix in `src/theme/tokens/mdc`.
 * @zh 常量/变量 `$prefix`，定义 `src/theme/tokens/mdc` 中的前缀。
 */
export const $prefix=["mdc", "checkbox"];
/**
 * Constant/variable `$custom_property_prefix` defining custom property prefix in `src/theme/tokens/mdc`.
 * @zh 常量/变量 `$custom_property_prefix`，定义 `src/theme/tokens/mdc` 中的自定义属性前缀。
 */
export const $custom_property_prefix= 'checkbox';

/**
 * Executes `get_unthemable_tokens` to handle get unthemable tokens.
 * @zh 执行 `get_unthemable_tokens`，用于获取不可主题化设计令牌。
 */
export function get_unthemable_tokens() {
  return {
    'disabled-selected-checkmark-color': '#fff',
    'selected-focus-state-layer-opacity': 0.16,
    'selected-hover-state-layer-opacity': 0.04,
    'selected-pressed-state-layer-opacity': 0.16,
    'unselected-focus-state-layer-opacity': 0.16,
    'unselected-hover-state-layer-opacity': 0.04,
    'unselected-pressed-state-layer-opacity': 0.16,
  };
}

/**
 * Executes `get_color_tokens` to handle get color tokens.
 * @zh 执行 `get_color_tokens`，用于获取颜色设计令牌。
 * @param $theme - theme parameter (`any`) / 主题参数（`any`）
 * @param $palette_name - palette name parameter (`any`) / 调色板名称参数（`any`）
 */
export function get_color_tokens($theme, $palette_name= "accent") {
  let $is_dark= inspection.get_theme_type($theme) == 'dark';
  let $foreground_base= inspection.get_theme_color($theme, 'foreground', 'base');
  let $palette_default= inspection.get_theme_color($theme, $palette_name, 'default');
  let $disabled_color= inspection.get_theme_color($theme, 'foreground', 'base',0.38);
  let $palette_selected= inspection.get_theme_color($theme, $palette_name);
  let $border_color=  inspection.get_theme_color($theme, 'foreground', 'base',0.54);
  let $active_border_color=palette.get_palette("grey")[ ($is_dark? 200: 900)];
  let $selected_checkmark_color= inspection.get_theme_color($theme, $palette_name, 'default-contrast', 1);
  return {
    'disabled-selected-icon-color': $disabled_color,
    'disabled-unselected-icon-color': $disabled_color,
    'selected-checkmark-color': $selected_checkmark_color,
    'selected-focus-icon-color': $palette_selected,
    'selected-hover-icon-color': $palette_selected,
    'selected-icon-color': $palette_selected,
    'selected-pressed-icon-color': $palette_selected,
    'unselected-focus-icon-color': $active_border_color,
    'unselected-hover-icon-color': $active_border_color,
    'unselected-icon-color': $border_color,
    'unselected-pressed-icon-color': $border_color,
    'selected-focus-state-layer-color': $palette_default,
    'selected-hover-state-layer-color': $palette_default,
    'selected-pressed-state-layer-color': $palette_default,
    'unselected-focus-state-layer-color': $foreground_base,
    'unselected-hover-state-layer-color': $foreground_base,
   ' unselected-pressed-state-layer-color': $foreground_base,
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
  let $scale= theming.clamp_density(inspection.get_theme_density($theme), -3);

  return {
    "state-layer-size":{
      '0': '40px',
      '-1': '36px',
      '-2': '32px',
      '-3': '28px',
    }[$scale]
  };
}

