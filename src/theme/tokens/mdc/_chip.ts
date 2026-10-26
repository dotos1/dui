/**
 * @fileoverview Module `src/theme/tokens/mdc/_chip.ts` providing chip definitions and implementation.
 * @zh 模块文件 `src/theme/tokens/mdc/_chip.ts`，提供纸片标签相关的定义与实现。
 */

import * as inspection from '../../mdc/inspection';
import * as theming from '../../mdc/theming';
import * as palette from '../../mdc/_palette';

/**
 * Constant/variable `$prefix` defining prefix in `src/theme/tokens/mdc`.
 * @zh 常量/变量 `$prefix`，定义 `src/theme/tokens/mdc` 中的前缀。
 */
export const $prefix=["mdc", "chip"];
/**
 * Constant/variable `$custom_property_prefix` defining custom property prefix in `src/theme/tokens/mdc`.
 * @zh 常量/变量 `$custom_property_prefix`，定义 `src/theme/tokens/mdc` 中的自定义属性前缀。
 */
export const $custom_property_prefix= 'chip';

/**
 * Executes `get_unthemable_tokens` to handle get unthemable tokens.
 * @zh 执行 `get_unthemable_tokens`，用于获取不可主题化设计令牌。
 */
export function get_unthemable_tokens() {
  return {
    'container-shape':{
        'family': 'rounded',
        'radius': '16px 16px 16px 16px',
      },
    'with-avatar-avatar-shape':
      {
        'family': 'rounded',
        'radius': '14px 14px 14px 14px'
      },
    'with-avatar-avatar-size': '28px',
    'with-icon-icon-size': '18px',
    'outline-width': 0,
    'outline-color': 'transparent',
    'disabled-outline-color': 'transparent',
    'focus-outline-color': 'transparent',
    'hover-state-layer-opacity': 0.04,
    'with-avatar-disabled-avatar-opacity': 1,
    'flat-selected-outline-width': 0,
    'selected-hover-state-layer-opacity': 0.04,
    'with-trailing-icon-disabled-trailing-icon-opacity': 1,
    'with-icon-disabled-icon-opacity': 1,
    };
}

/**
 * Executes `get_color_tokens` to handle get color tokens.
 * @zh 执行 `get_color_tokens`，用于获取颜色设计令牌。
 * @param $theme - theme parameter (`any`) / 主题参数（`any`）
 * @param $palette_name - palette name parameter (`any`) / 调色板名称参数（`any`）
 */
export function get_color_tokens($theme, $palette_name= null) {
  let $foreground= null;
  let $background= null;
  let $state_layer_color= inspection.get_theme_color($theme, 'foreground', 'base');
  let $state_layer_opacity= 0.12; 

  if($palette_name == null) {
    // let $is_dark= inspection.get_theme_type($theme) == 'dark';
    // let $grey50= palette.get_palette("grey")[50];
    // let $grey900= palette.get_palette("grey")[900];
    $foreground= $state_layer_color ;
    let $surface= inspection.get_theme_color($theme, 'background', 'unselected-chip');
    $background= $surface;
  }
  else {
    $background= inspection.get_theme_color($theme, $palette_name);
    $foreground= inspection.get_theme_color($theme, $palette_name, 'default-contrast');
  }

  return {
    'disabled-label-text-color': $foreground,
    'elevated-container-color': $background,
    'elevated-selected-container-color': $background,
    'elevated-disabled-container-color': $background,
    'flat-disabled-selected-container-color': $background,
    'focus-state-layer-color': $state_layer_color,
    'hover-state-layer-color': $state_layer_color,
    'selected-hover-state-layer-color': $state_layer_color,
    'focus-state-layer-opacity': $state_layer_opacity,
    'selected-focus-state-layer-color': $state_layer_color,
    'selected-focus-state-layer-opacity': $state_layer_opacity,
    'label-text-color': $foreground,
    'selected-label-text-color': $foreground,
    'with-icon-icon-color': $foreground,
    'with-icon-disabled-icon-color': $foreground,
    'with-icon-selected-icon-color': $foreground,
    'with-trailing-icon-disabled-trailing-icon-color': $foreground,
    'with-trailing-icon-trailing-icon-color': $foreground
  };
}

/**
 * Executes `get_typography_tokens` to handle get typography tokens.
 * @zh 执行 `get_typography_tokens`，用于获取排版设计令牌。
 * @param $theme - theme parameter (`any`) / 主题参数（`any`）
 */
export function get_typography_tokens($theme) {
  return {
    'label-text-font': inspection.get_theme_typography($theme, 'body-2', 'font-family'),
    'label-text-line-height': inspection.get_theme_typography($theme, 'body-2', 'line-height'),
    'label-text-size': inspection.get_theme_typography($theme, 'body-2', 'font-size'),
    'label-text-tracking': inspection.get_theme_typography($theme, 'body-2', 'letter-spacing'),
    'label-text-weight': inspection.get_theme_typography($theme, 'body-2', 'font-weight')
  };
}

/**
 * Executes `get_density_tokens` to handle get density tokens.
 * @zh 执行 `get_density_tokens`，用于获取密度设计令牌。
 * @param $theme - theme parameter (`any`) / 主题参数（`any`）
 */
export function get_density_tokens($theme) {
  let $scale= theming.clamp_density(inspection.get_theme_density($theme), -2);
  return {
    'container-height':{
          '0': '32px',
          '-1': '30px',
          '-2': '28px',
      }[$scale] 
  };
}

