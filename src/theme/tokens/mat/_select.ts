/**
 * @fileoverview Module `src/theme/tokens/mat/_select.ts` providing select definitions and implementation.
 * @zh 模块文件 `src/theme/tokens/mat/_select.ts`，提供下拉选择相关的定义与实现。
 */

import * as inspection from '../../mdc/inspection';
import * as token_utils from '../../mdc/token-utils';
import * as elevation from '../../mdc/elevation-theme';
import * as theming from '../../mdc/theming';
import * as sass from '../../mdc/_sass-utils';
/**
 * Constant/variable `$prefix` defining prefix in `src/theme/tokens/mat`.
 * @zh 常量/变量 `$prefix`，定义 `src/theme/tokens/mat` 中的前缀。
 */
export const $prefix=["mat", "select"];

/**
 * Executes `get_unthemable_tokens` to handle get unthemable tokens.
 * @zh 执行 `get_unthemable_tokens`，用于获取不可主题化设计令牌。
 */
export function get_unthemable_tokens() {
    return {
      "container-elevation-shadow": elevation.elevation_box_shadow(8),
    };
}
/**
 * Executes `get_color_tokens` to handle get color tokens.
 * @zh 执行 `get_color_tokens`，用于获取颜色设计令牌。
 * @param $theme - theme parameter (`any`) / 主题参数（`any`）
 * @param $palette_name - palette name parameter (`any`) / 调色板名称参数（`any`）
 */
export function get_color_tokens($theme, $palette_name= "primary") {
    let $is_dark= inspection.get_theme_type($theme) == "dark";
    let $on_surface= $is_dark? "#fff": "#000";
    let $text_color_base= token_utils.$private_is_internal_build? $on_surface: inspection.get_theme_color($theme, "foreground", "text", 1);
    let  $disabled_text_color_base= token_utils.$private_is_internal_build? $on_surface:inspection.get_theme_color($theme, "foreground", "disabled-text", 1);
    let $icon_color_base= token_utils.$private_is_internal_build? $on_surface: inspection.get_theme_color($theme, "foreground", "divider", 1);
  
    return {
      "panel-background-color": inspection.get_theme_color($theme, "background", "card"),
      "enabled-trigger-text-color": sass.safe_color_change($text_color_base, 0.87),
      "disabled-trigger-text-color":sass.safe_color_change($disabled_text_color_base,0.38),
      "placeholder-text-color": sass.safe_color_change($text_color_base,0.6),
      "enabled-arrow-color": sass.safe_color_change($icon_color_base, 0.54),
      "disabled-arrow-color": sass.safe_color_change($text_color_base,0.38),
      "focused-arrow-color": sass.safe_color_change(inspection.get_theme_color($theme, $palette_name, "default"),0.87),
      "invalid-arrow-color":sass.safe_color_change(inspection.get_theme_color($theme, "warn", "default"),0.87)
      };
  }
/**
 * Executes `get_typography_tokens` to handle get typography tokens.
 * @zh 执行 `get_typography_tokens`，用于获取排版设计令牌。
 * @param $theme - theme parameter (`any`) / 主题参数（`any`）
 */
export function get_typography_tokens($theme) {
    return {
      "trigger-text-font": inspection.get_theme_typography($theme, "body-1", "font-family"),
      "trigger-text-line-height": inspection.get_theme_typography($theme, "body-1", "line-height"),
      "trigger-text-size": inspection.get_theme_typography($theme, "body-1", "font-size"),
      "trigger-text-tracking": inspection.get_theme_typography($theme, "body-1", "letter-spacing"),
      "trigger-text-weight": inspection.get_theme_typography($theme, "body-1", "font-weight")
    };
  }
/**
 * Executes `get_density_tokens` to handle get density tokens.
 * @zh 执行 `get_density_tokens`，用于获取密度设计令牌。
 * @param $theme - theme parameter (`any`) / 主题参数（`any`）
 */
export function get_density_tokens($theme) {
    let $density_scale= theming.clamp_density(inspection.get_theme_density($theme), -2);
    let mm={
        "0": "translateY(-8px)",
        "-1": "translateY(-8px)",
        "-2": "none",
    };
    return {
      "arrow-transform": mm[$density_scale],
    };
}