/**
 * @fileoverview Module `src/theme/tokens/mat/_chip.ts` providing chip definitions and implementation.
 * @zh 模块文件 `src/theme/tokens/mat/_chip.ts`，提供纸片标签相关的定义与实现。
 */

import * as inspection from '../../mdc/inspection';
import * as palette from '../../mdc/_palette';
/**
 * Constant/variable `$prefix` defining prefix in `src/theme/tokens/mat`.
 * @zh 常量/变量 `$prefix`，定义 `src/theme/tokens/mat` 中的前缀。
 */
export const $prefix=["mat", "chip"];

/**
 * Executes `get_unthemable_tokens` to handle get unthemable tokens.
 * @zh 执行 `get_unthemable_tokens`，用于获取不可主题化设计令牌。
 */
export function get_unthemable_tokens() {
  return {
    "disabled-container-opacity": 0.4,
    "trailing-action-opacity": 0.54,
    "trailing-action-focus-opacity": 1,
    "trailing-action-state-layer-color": "transparent",
    "selected-trailing-action-state-layer-color": "transparent",
    "trailing-action-hover-state-layer-opacity": 0,
    "trailing-action-focus-state-layer-opacity": 0,
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
  if($palette_name == null) {
    // let $isdark= inspection.get_theme_type($theme) == "dark";
    // let $palette =palette.get_palette("grey");
    // let $grey50= $palette["50"];
    // let $grey900= $palette["900"];
    // $foreground= $isdark? $grey50: $grey900;
    $foreground= inspection.get_theme_color($theme, 'foreground', 'base');
  }
  else {
    $foreground= inspection.get_theme_color($theme, $palette_name, "default-contrast");
  }
  return {
    "selected-disabled-trailing-icon-color": $foreground,
    "selected-trailing-icon-color": $foreground
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
  return {};
}
