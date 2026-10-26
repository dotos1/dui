/**
 * @fileoverview Module `src/theme/tokens/mdc/_radio.ts` providing radio definitions and implementation.
 * @zh 模块文件 `src/theme/tokens/mdc/_radio.ts`，提供单选框相关的定义与实现。
 */

import * as inspection from '../../mdc/inspection';
import * as theming from '../../mdc/theming';
import * as palette from '../../mdc/_palette';
/**
 * Constant/variable `$prefix` defining prefix in `src/theme/tokens/mdc`.
 * @zh 常量/变量 `$prefix`，定义 `src/theme/tokens/mdc` 中的前缀。
 */
export const $prefix=["mdc", "radio"];
/**
 * Constant/variable `$custom_property_prefix` defining custom property prefix in `src/theme/tokens/mdc`.
 * @zh 常量/变量 `$custom_property_prefix`，定义 `src/theme/tokens/mdc` 中的自定义属性前缀。
 */
export const $custom_property_prefix= 'radio';

/**
 * Executes `get_unthemable_tokens` to handle get unthemable tokens.
 * @zh 执行 `get_unthemable_tokens`，用于获取不可主题化设计令牌。
 */
export function get_unthemable_tokens() {
  return {
    'disabled-selected-icon-opacity': 0.38,
    'disabled-unselected-icon-opacity': 0.38,
    'state-layer-size': '40px',
  };
}

/**
 * Executes `get_color_tokens` to handle get color tokens.
 * @zh 执行 `get_color_tokens`，用于获取颜色设计令牌。
 * @param $theme - theme parameter (`any`) / 主题参数（`any`）
 * @param $palette_name - palette name parameter (`any`) / 调色板名称参数（`any`）
 */
export function get_color_tokens($theme, $palette_name= 'accent') {
  let $is_dark= inspection.get_theme_type($theme) == 'dark';
  let $palette_color= inspection.get_theme_color($theme, $palette_name, 'default');
  let $icon_color= palette.get_palette("grey")[($is_dark? 200: 900)];

  return {
    'disabled-selected-icon-color': inspection.get_theme_color($theme, 'foreground',  'icon', 1),
    'disabled-unselected-icon-color': inspection.get_theme_color($theme, 'foreground',  'icon', 1),
    'unselected-hover-icon-color': $icon_color,
    'unselected-icon-color': inspection.get_theme_color($theme, 'foreground',  'icon', 0.54),
    'unselected-pressed-icon-color': inspection.get_theme_color($theme, 'foreground',  'icon', 0.54),
    'selected-focus-icon-color': $palette_color,
    'selected-hover-icon-color': $palette_color,
    'selected-icon-color': $palette_color,
    'selected-pressed-icon-color': $palette_color,
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
    'state-layer-size': {
      '0': '40px',
      '-1': '36px',
      '-2': '32px',
      '-3': '28px',
    }[$scale]
  };
}


