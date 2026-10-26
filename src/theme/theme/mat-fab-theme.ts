/**
 * @fileoverview Module `src/theme/theme/mat-fab-theme.ts` providing mat fab theme definitions and implementation.
 * @zh 模块文件 `src/theme/theme/mat-fab-theme.ts`，提供Materialfab主题相关的定义与实现。
 */

import { TypographyConfig } from '../interfaces';
import { Theme } from '../interfaces/theme';
import * as keys from '../mdc/keys';
import { fab_theme } from '../mdc/theme-utils';
import { create_token_values } from '../mdc/token-utils';
import * as mat_fab from '../tokens/mat/_fab';
import * as mat_fabsmall from '../tokens/mat/_fab-small';
import * as mdc_extendedfab from '../tokens/mdc/_extended-fab';
import * as mdc_fab from '../tokens/mdc/_fab';
import * as mdc_fabsmall from '../tokens/mdc/_fab-small';

/**
 * Executes `base` to handle base.
 * @zh 执行 `base`，用于基础。
 * @param theme - theme parameter (`Theme`) / 主题参数（`Theme`）
 * @returns Result of type `Object` / 类型为 `Object` 的返回值
 */
function base(theme: Theme): Object {
  return{
        ...keys.declare_custom_properties(fab_theme(mdc_fab.get_unthemable_tokens()),mdc_fab.$custom_property_prefix),
        ...keys.declare_custom_properties(fab_theme(mdc_extendedfab.get_unthemable_tokens()),mdc_extendedfab.$custom_property_prefix),
  }
}
/**
 * Executes `minbase` to handle minbase.
 * @zh 执行 `minbase`，用于minbase。
 * @param theme - theme parameter (`Theme`) / 主题参数（`Theme`）
 * @returns Result of type `Object` / 类型为 `Object` 的返回值
 */
function minbase(theme: Theme): Object {
  return{
    ...keys.declare_custom_properties(fab_theme(mdc_fabsmall.get_unthemable_tokens()),mdc_fabsmall.$custom_property_prefix),
  }
}
/**
 * Executes `_fab_variant` to handle fab variant.
 * @zh 执行 `_fab_variant`，用于fabvariant。
 * @param $theme - theme parameter (`any`) / 主题参数（`any`）
 * @param $palette - palette parameter (`any`) / 调色板参数（`any`）
 */
function _fab_variant($theme, $palette) {
  let $mdc_tokens= ($palette ?mdc_fab.private_get_color_palette_color_tokens($theme, $palette):mdc_fab.get_color_tokens($theme));
  let $mat_tokens= ($palette?mat_fab.private_get_color_palette_color_tokens($theme, $palette): mat_fab.get_color_tokens($theme));
  return{
        ...keys.declare_custom_properties(fab_theme($mdc_tokens),mdc_fab.$custom_property_prefix),
        ...create_token_values(mat_fab.$prefix,$mat_tokens),
  }
}

/**
 * Executes `_fab_small_variant` to handle fab small variant.
 * @zh 执行 `_fab_small_variant`，用于fabsmallvariant。
 * @param $theme - theme parameter (`any`) / 主题参数（`any`）
 * @param $palette - palette parameter (`any`) / 调色板参数（`any`）
 */
function _fab_small_variant($theme, $palette) {
  let $mdc_tokens= ($palette ?mdc_fabsmall.private_get_color_palette_color_tokens($theme, $palette):mdc_fabsmall.get_color_tokens($theme));
  let $mat_tokens= ($palette?mat_fabsmall.private_get_color_palette_color_tokens($theme, $palette): mat_fabsmall.get_color_tokens($theme));
  return{
        ...keys.declare_custom_properties(fab_theme($mdc_tokens),mdc_fabsmall.$custom_property_prefix),
        ...create_token_values(mat_fabsmall.$prefix,$mat_tokens),
  }
}

/**
 * Executes `color` to handle color.
 * @zh 执行 `color`，用于颜色。
 * @param theme - theme parameter (`Theme`) / 主题参数（`Theme`）
 * @returns Result of type `Object` / 类型为 `Object` 的返回值
 */
function color(theme: Theme): Object {
  return{
      ..._fab_variant(theme, null),
      "&.mat-primary": {
        ..._fab_variant(theme, "primary")
      },

      "&.mat-accent": {
        ..._fab_variant(theme, "accent")
      },

      "&.mat-warn": {
        ..._fab_variant(theme, "warn")
      }

  }
}
/**
 * Executes `mincolor` to handle mincolor.
 * @zh 执行 `mincolor`，用于mincolor。
 * @param theme - theme parameter (`Theme`) / 主题参数（`Theme`）
 * @returns Result of type `Object` / 类型为 `Object` 的返回值
 */
function mincolor(theme: Theme): Object {
  return{
      ..._fab_small_variant(theme, null),
      "&.mat-primary": {
        ..._fab_small_variant(theme, "primary")
      },

      "&.mat-accent": {
        ..._fab_small_variant(theme, "accent")
      },

      "&.mat-warn": {
        ..._fab_small_variant(theme, "warn")
      }
  }
}

/**
 * Executes `density` to handle density.
 * @zh 执行 `density`，用于密度。
 * @param theme - theme parameter (`Theme`) / 主题参数（`Theme`）
 * @returns Result of type `Object` / 类型为 `Object` 的返回值
 */
function density(theme: Theme): Object {
  return{
    ...create_token_values(mat_fab.$prefix,mat_fab.get_density_tokens(theme)),
    // ".mat-mdc-icon-button.mat-mdc-button-base" : {
    //   ...keys.declare_custom_properties({"state-layer-size": $calculated_size},mdc_icon.$custom_property_prefix),
    //   width: "var(--mdc-icon-button-state-layer-size)",
    //   height: "var(--mdc-icon-button-state-layer-size)",
    //   padding: ($calculated_size - $icon_size)/ 2 +"px"
    // }
  }
}
/**
 * Executes `mindensity` to handle mindensity.
 * @zh 执行 `mindensity`，用于mindensity。
 * @param theme - theme parameter (`Theme`) / 主题参数（`Theme`）
 * @returns Result of type `Object` / 类型为 `Object` 的返回值
 */
function mindensity(theme: Theme): Object {
  return{
    ...create_token_values(mat_fabsmall.$prefix,mat_fabsmall.get_density_tokens(theme)),
  }
}
/**
 * Executes `typography` to handle typography.
 * @zh 执行 `typography`，用于排版。
 * @param theme - theme parameter (`TypographyConfig`) / 主题参数（`TypographyConfig`）
 * @returns Result of type `Object` / 类型为 `Object` 的返回值
 */
function typography(theme: TypographyConfig): Object {
   
  return{
    ...keys.declare_custom_properties(fab_theme(mdc_extendedfab.get_typography_tokens(theme)),mdc_extendedfab.$custom_property_prefix),
    ...create_token_values(mat_fab.$prefix,mat_fab.get_typography_tokens(theme)),
  }
}
/**
 * Executes `minTypography` to handle min typography.
 * @zh 执行 `minTypography`，用于最小值排版。
 * @param theme - theme parameter (`TypographyConfig`) / 主题参数（`TypographyConfig`）
 * @returns Result of type `Object` / 类型为 `Object` 的返回值
 */
function minTypography(theme: TypographyConfig): Object {
   
  return{
    ...keys.declare_custom_properties(fab_theme(mdc_extendedfab.get_typography_tokens(theme)),mdc_extendedfab.$custom_property_prefix),
    ...create_token_values(mat_fabsmall.$prefix,mat_fabsmall.get_typography_tokens(theme)),
  }
}
/**
 * Executes `matFabTheme` to handle mat fab theme.
 * @zh 执行 `matFabTheme`，用于MaterialFab主题。
 * @param theme - theme parameter (`Theme`) / 主题参数（`Theme`）
 * @returns Result of type `Object` / 类型为 `Object` 的返回值
 */
export function matFabTheme(theme: Theme): Object {

  return  {
    ".mat-mdc-fab": {
      "width":"var(--mdc-extended-fab-container-height) !important",
      "height":"var(--mdc-extended-fab-container-height) !important",
      ...base(theme),
      ...color(theme),
      ...density(theme),
      ...minTypography(theme.typography)
    },
    /*
     * 必须带 .mat-mdc-fab / .mat-mdc-mini-fab 前缀。
     *
     * 原来这里是裸的 ".mat-mdc-button-disabled"，与 ".mat-mdc-fab" 平级 ——
     * 但这个对象的键是**直接当选择器**用的，没有嵌套关系，于是这条带
     * !important 的 FAB 悬浮阴影落到了全局**每一个**禁用态 Material 按钮上。
     * 表现：工具栏里凡是置灰的图标按钮都凭空浮起来一块带投影的白方块
     * （写作器工具栏的 redo 就是这么被发现的）。
     */
    ".mat-mdc-fab.mat-mdc-button-disabled,.mat-mdc-mini-fab.mat-mdc-button-disabled":{
      "box-shadow":"var(--mdc-fab-container-elevation-shadow) !important",
    },
    ".mat-mdc-mini-fab": {
      ...minbase(theme),
      ...mincolor(theme),
      ...mindensity(theme),
      ...typography(theme.typography)
    }
  };
}

