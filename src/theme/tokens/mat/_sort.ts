/**
 * @fileoverview Module `src/theme/tokens/mat/_sort.ts` providing sort definitions and implementation.
 * @zh 模块文件 `src/theme/tokens/mat/_sort.ts`，提供排序相关的定义与实现。
 */

import * as inspection from '../../mdc/inspection';

/**
 * Constant/variable `$prefix` defining prefix in `src/theme/tokens/mat`.
 * @zh 常量/变量 `$prefix`，定义 `src/theme/tokens/mat` 中的前缀。
 */
export const $prefix=["mat", "sort"];

/**
 * Executes `get_unthemable_tokens` to handle get unthemable tokens.
 * @zh 执行 `get_unthemable_tokens`，用于获取不可主题化设计令牌。
 */
export function get_unthemable_tokens() {
  return {};
}

/**
 * Executes `get_color_tokens` to handle get color tokens.
 * @zh 执行 `get_color_tokens`，用于获取颜色设计令牌。
 * @param $theme - theme parameter (`any`) / 主题参数（`any`）
 */
export function get_color_tokens($theme) {
  let $table_background= inspection.get_theme_color($theme, 'background', 'card');
  let $text_color= inspection.get_theme_color($theme, 'foreground',  'secondary-text');
  let $arrow_color= null;


  // @if (meta.type-of($table-background) == color and meta.type-of($text-color) == color) {
  //   $text-opacity: opacity($text-color);
  //   $arrow-color: color.mix($table-background, rgba($text-color, 1), (1 - $text-opacity) * 100%);
  // }
  // @else {
    $arrow_color=$text_color;
  // }

  return {
    'arrow-color': $arrow_color,
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
