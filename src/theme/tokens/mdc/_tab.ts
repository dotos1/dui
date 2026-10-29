/**
 * @fileoverview Module `src/theme/tokens/mdc/_tab.ts` providing tab definitions and implementation.
 * @zh 模块文件 `src/theme/tokens/mdc/_tab.ts`，提供选项卡相关的定义与实现。
 */

import * as theming from '../../mdc/theming';
import * as inspection from '../../mdc/inspection';

/**
 * Constant/variable `$prefix` defining prefix in `src/theme/tokens/mdc`.
 * @zh 常量/变量 `$prefix`，定义 `src/theme/tokens/mdc` 中的前缀。
 */
export const $prefix=["mdc", "tab"];
/**
 * Constant/variable `$custom_property_prefix` defining custom property prefix in `src/theme/tokens/mdc`.
 * @zh 常量/变量 `$custom_property_prefix`，定义 `src/theme/tokens/mdc` 中的自定义属性前缀。
 */
export const $custom_property_prefix= 'tab';
/**
 * Constant/variable `$custom_property_prefix_primary` defining custom property prefix primary in `src/theme/tokens/mdc`.
 * @zh 常量/变量 `$custom_property_prefix_primary`，定义 `src/theme/tokens/mdc` 中的自定义属性前缀主色。
 */
export const $custom_property_prefix_primary= 'primary-navigation-tab';
/**
 * Constant/variable `$custom_property_prefix_secondary` defining custom property prefix secondary in `src/theme/tokens/mdc`.
 * @zh 常量/变量 `$custom_property_prefix_secondary`，定义 `src/theme/tokens/mdc` 中的自定义属性前缀secondary。
 */
export const $custom_property_prefix_secondary= 'secondary-navigation-tab';

/**
 * Executes `get_unthemable_tokens` to handle get unthemable tokens.
 * @zh 执行 `get_unthemable_tokens`，用于获取不可主题化设计令牌。
 */
export function get_unthemable_tokens() {
  return {
    'container-height': '48px',
  };
}

/**
 * Executes `get_color_tokens` to handle get color tokens.
 * @zh 执行 `get_color_tokens`，用于获取颜色设计令牌。
 * @param $theme - theme parameter (`any`) / 主题参数（`any`）
 * @param $palette_name - palette name parameter (`string`) / 调色板名称参数（`string`）
 */
export function get_color_tokens($theme, $palette_name= 'primary') {
  return {};
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
  let $scale= theming.clamp_density(inspection.get_theme_density($theme), -4);

  return {
    'container-height': {
      '0': '48px',
      '-1': '44px',
      '-2': '40px',
      '-3': '36px',
      '-4': '32px',
    }[$scale]
  };
}
