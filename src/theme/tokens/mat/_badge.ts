/**
 * @fileoverview Module `src/theme/tokens/mat/_badge.ts` providing badge definitions and implementation.
 * @zh 模块文件 `src/theme/tokens/mat/_badge.ts`，提供徽标相关的定义与实现。
 */


import * as inspection from '../../mdc/inspection';


/**
 * Constant/variable `$prefix` defining prefix in `src/theme/tokens/mat`.
 * @zh 常量/变量 `$prefix`，定义 `src/theme/tokens/mat` 中的前缀。
 */
export const $prefix=["mat", "badge"];

/**
 * Executes `get_unthemable_tokens` to handle get unthemable tokens.
 * @zh 执行 `get_unthemable_tokens`，用于获取不可主题化设计令牌。
 */
export function get_unthemable_tokens() {
    let $default_size= 22;
    let $small_size= $default_size-6;
    let $large_size= $default_size+6;
  
    return {
      "container-shape": "50%",
      "container-size": "unset",
      "small-size-container-size": "unset",
      "large-size-container-size": "unset",
  
      "legacy-container-size": $default_size+"px",
      "legacy-small-size-container-size": $small_size+"px",
      "legacy-large-size-container-size": $large_size+"px",
  
      "container-offset": ($default_size/-2)+"px 0",
      "small-size-container-offset": ($small_size/-2)+"px 0",
      "large-size-container-offset": ($large_size/-2)+"px 0",
  
      "container-overlap-offset": ($default_size/-2)+"px",
      "small-size-container-overlap-offset": ($small_size/-2)+"px",
      "large-size-container-overlap-offset": ($large_size/-2)+"px",
  
      "container-padding": "0px",
      "small-size-container-padding": "0px",
      "large-size-container-padding": "0px",
    };
}
/**
 * Executes `private_get_color_palette_color_tokens` to handle private get color palette color tokens.
 * @zh 执行 `private_get_color_palette_color_tokens`，用于private获取颜色调色板颜色设计令牌。
 * @param $theme - theme parameter (`any`) / 主题参数（`any`）
 * @param $palette_name - palette name parameter (`any`) / 调色板名称参数（`any`）
 */
export function private_get_color_palette_color_tokens($theme, $palette_name= "primary") {
  return {
    "background-color": inspection.get_theme_color($theme, $palette_name),
    "text-color": inspection.get_theme_color($theme, $palette_name, "default-contrast"),
  };
}

/**
 * Executes `get_color_tokens` to handle get color tokens.
 * @zh 执行 `get_color_tokens`，用于获取颜色设计令牌。
 * @param $theme - theme parameter (`any`) / 主题参数（`any`）
 */
export function get_color_tokens($theme) {

  let $disabled_background= inspection.get_theme_color($theme, "foreground", "disabled-button");
  return {
  
    "disabled-state-background-color": $disabled_background,
    "disabled-state-text-color": inspection.get_theme_color($theme, "foreground", "disabled-text"),
  };
}


/**
 * Executes `get_typography_tokens` to handle get typography tokens.
 * @zh 执行 `get_typography_tokens`，用于获取排版设计令牌。
 * @param $theme - theme parameter (`any`) / 主题参数（`any`）
 */
export function get_typography_tokens($theme) {
    let $base_size= 12;

    return {
      "text-font": inspection.get_theme_typography($theme, "body-2", "font-family"),
      "text-size": $base_size+"px",
      "text-weight": 600,
      "small-size-text-size": $base_size * 0.75+"px",
      "large-size-text-size": $base_size * 2+"px",
    };
}

/**
 * Executes `get_density_tokens` to handle get density tokens.
 * @zh 执行 `get_density_tokens`，用于获取密度设计令牌。
 * @param $theme - theme parameter (`any`) / 主题参数（`any`）
 */
export function get_density_tokens($theme) {
  return {};
}