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

function base(theme: Theme): Object {
  return{
        ...keys.declare_custom_properties(fab_theme(mdc_fab.get_unthemable_tokens()),mdc_fab.$custom_property_prefix),
        ...keys.declare_custom_properties(fab_theme(mdc_extendedfab.get_unthemable_tokens()),mdc_extendedfab.$custom_property_prefix),
  }
}
function minbase(theme: Theme): Object {
  return{
    ...keys.declare_custom_properties(fab_theme(mdc_fabsmall.get_unthemable_tokens()),mdc_fabsmall.$custom_property_prefix),
  }
}
function _fab_variant($theme, $palette) {
  let $mdc_tokens= ($palette ?mdc_fab.private_get_color_palette_color_tokens($theme, $palette):mdc_fab.get_color_tokens($theme));
  let $mat_tokens= ($palette?mat_fab.private_get_color_palette_color_tokens($theme, $palette): mat_fab.get_color_tokens($theme));
  return{
        ...keys.declare_custom_properties(fab_theme($mdc_tokens),mdc_fab.$custom_property_prefix),
        ...create_token_values(mat_fab.$prefix,$mat_tokens),
  }
}

function _fab_small_variant($theme, $palette) {
  let $mdc_tokens= ($palette ?mdc_fabsmall.private_get_color_palette_color_tokens($theme, $palette):mdc_fabsmall.get_color_tokens($theme));
  let $mat_tokens= ($palette?mat_fabsmall.private_get_color_palette_color_tokens($theme, $palette): mat_fabsmall.get_color_tokens($theme));
  return{
        ...keys.declare_custom_properties(fab_theme($mdc_tokens),mdc_fabsmall.$custom_property_prefix),
        ...create_token_values(mat_fabsmall.$prefix,$mat_tokens),
  }
}

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
function mindensity(theme: Theme): Object {
  return{
    ...create_token_values(mat_fabsmall.$prefix,mat_fabsmall.get_density_tokens(theme)),
  }
}
function typography(theme: TypographyConfig): Object {
   
  return{
    ...keys.declare_custom_properties(fab_theme(mdc_extendedfab.get_typography_tokens(theme)),mdc_extendedfab.$custom_property_prefix),
    ...create_token_values(mat_fab.$prefix,mat_fab.get_typography_tokens(theme)),
  }
}
function minTypography(theme: TypographyConfig): Object {
   
  return{
    ...keys.declare_custom_properties(fab_theme(mdc_extendedfab.get_typography_tokens(theme)),mdc_extendedfab.$custom_property_prefix),
    ...create_token_values(mat_fabsmall.$prefix,mat_fabsmall.get_typography_tokens(theme)),
  }
}
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

