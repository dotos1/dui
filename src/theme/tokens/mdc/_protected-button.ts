/**
 * @fileoverview Module `src/theme/tokens/mdc/_protected-button.ts` providing protected button definitions and implementation.
 * @zh 模块文件 `src/theme/tokens/mdc/_protected-button.ts`，提供protected按钮相关的定义与实现。
 */

import * as inspection from '../../mdc/inspection';
import * as theming from '../../mdc/theming';

/**
 * Constant/variable `$prefix` defining prefix in `src/theme/tokens/mdc`.
 * @zh 常量/变量 `$prefix`，定义 `src/theme/tokens/mdc` 中的前缀。
 */
export const $prefix=["mdc", "protected-button"];
/**
 * Constant/variable `$custom_property_prefix` defining custom property prefix in `src/theme/tokens/mdc`.
 * @zh 常量/变量 `$custom_property_prefix`，定义 `src/theme/tokens/mdc` 中的自定义属性前缀。
 */
export const $custom_property_prefix= 'protected-button';

/**
 * Executes `get_unthemable_tokens` to handle get unthemable tokens.
 * @zh 执行 `get_unthemable_tokens`，用于获取不可主题化设计令牌。
 */
export function get_unthemable_tokens() {
  return {
    'container-shape': '4px',
    'keep-touch-target': 'false',
  };
}

/**
 * Executes `get_color_tokens` to handle get color tokens.
 * @zh 执行 `get_color_tokens`，用于获取颜色设计令牌。
 * @param $theme - theme parameter (`any`) / 主题参数（`any`）
 */
export function get_color_tokens($theme) {
  let $is_dark= inspection.get_theme_type($theme) == 'dark';

  return {
    'container-color': inspection.get_theme_color($theme, 'background', 'card'),
    'label-text-color': inspection.get_theme_color($theme, 'foreground',  'text', 1),
    'disabled-container-color': inspection.get_theme_color($theme, 'foreground',  'disabled-button',
      0.12),
    'disabled-label-text-color': inspection.get_theme_color($theme, 'foreground',  'disabled-button',
      ($is_dark? 0.5: 0.38)),
    'container-elevation': 2,
    'disabled-container-elevation': 0,
    'focus-container-elevation': 4,
    'hover-container-elevation': 4,
    'pressed-container-elevation': 8,
    'container-shadow-color': '#000',
  };
}
/**
 * Executes `private_get_color_palette_color_tokens` to handle private get color palette color tokens.
 * @zh 执行 `private_get_color_palette_color_tokens`，用于内部获取颜色调色板颜色设计令牌。
 * @param $theme - theme parameter (`any`) / 主题参数（`any`）
 * @param $palette_name - palette name parameter (`any`) / 调色板名称参数（`any`）
 */
export function private_get_color_palette_color_tokens($theme, $palette_name) {
  let $container_color= inspection.get_theme_color($theme, $palette_name, 'default');
  let $label_text_color= inspection.get_theme_color($theme, $palette_name, 'default-contrast', 1);

  return {
    'container-color': $container_color,
    'label-text-color': $label_text_color,
  };
}
/**
 * Executes `get_typography_tokens` to handle get typography tokens.
 * @zh 执行 `get_typography_tokens`，用于获取排版设计令牌。
 * @param $theme - theme parameter (`any`) / 主题参数（`any`）
 */
export function get_typography_tokens($theme) {
  return {
    'label-text-font': inspection.get_theme_typography($theme, 'button', 'font-family'),
    'label-text-size': inspection.get_theme_typography($theme, 'button', 'font-size'),
    'label-text-tracking': inspection.get_theme_typography($theme, 'button', 'letter-spacing'),
    'label-text-weight': inspection.get_theme_typography($theme, 'button', 'font-weight'),
    'label-text-transform': 'none',
  };
}

/**
 * Executes `get_density_tokens` to handle get density tokens.
 * @zh 执行 `get_density_tokens`，用于获取密度设计令牌。
 * @param $theme - theme parameter (`any`) / 主题参数（`any`）
 */
export function get_density_tokens($theme) {
  let  $scale= theming.clamp_density(inspection.get_theme_density($theme), -3);
  return {
    'container-height':{
          '0': '36px',
          '-1': '34px',
          '-2': '32px',
          '-3': '30px',
      }[$scale]
    };
}

