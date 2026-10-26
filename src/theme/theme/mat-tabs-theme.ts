/**
 * @fileoverview Module `src/theme/theme/mat-tabs-theme.ts` providing mat tabs theme definitions and implementation.
 * @zh 模块文件 `src/theme/theme/mat-tabs-theme.ts`，提供Material选项卡组主题相关的定义与实现。
 */

import { TypographyConfig } from '../interfaces';
import {
  Theme
} from '../interfaces/index';
import * as keys from '../mdc/keys';
import { create_token_values } from '../mdc/token-utils';
import * as mat_tab_header from '../tokens/mat/_tab-header';
import * as mat_tab_header_bg from '../tokens/mat/_tab-header-with-background';
import * as mdc_tab from '../tokens/mdc/_tab';
import * as mdc_tab_indicator from '../tokens/mdc/_tab-indicator';


/**
 * Executes `base` to handle base.
 * @zh 执行 `base`，用于基础。
 * @param theme - theme parameter (`Theme`) / 主题参数（`Theme`）
 * @returns Result of type `Object` / 类型为 `Object` 的返回值
 */
function base(theme: Theme): Object {
    return{
          ...keys.declare_custom_properties(mdc_tab_indicator.get_unthemable_tokens(),mdc_tab_indicator.$custom_property_prefix),
          ...keys.declare_custom_properties(mdc_tab.get_unthemable_tokens(),mdc_tab.$custom_property_prefix_secondary),
          ...create_token_values(mat_tab_header.$prefix,mat_tab_header.get_unthemable_tokens()),
          // ...create_token_values(mat_tab_header_bg.$prefix,mat_tab_header_bg.get_unthemable_tokens()),
    }
  }

  /**
   * Executes `_palette_styles` to handle palette styles.
   * @zh 执行 `_palette_styles`，用于调色板样式集合。
   * @param $theme - theme parameter (`any`) / 主题参数（`any`）
   * @param $palette_name - palette name parameter (`any`) / 调色板名称参数（`any`）
   */
  function _palette_styles($theme, $palette_name) {
    return{
          // ...keys.declare_custom_properties(mdc_tab.get_color_tokens($theme, $palette_name),mdc_tab.$custom_property_prefix_secondary),
          ...keys.declare_custom_properties(mdc_tab_indicator.get_color_tokens($theme, $palette_name),mdc_tab_indicator.$custom_property_prefix),
          ...create_token_values(mat_tab_header.$prefix,mat_tab_header.get_color_tokens($theme, $palette_name)),
    }
  }

  /**
   * Executes `_background_styles` to handle background styles.
   * @zh 执行 `_background_styles`，用于背景样式集合。
   * @param $theme - theme parameter (`any`) / 主题参数（`any`）
   * @param $palette_name - palette name parameter (`any`) / 调色板名称参数（`any`）
   */
  function _background_styles($theme, $palette_name) {
    return{
          ...create_token_values(mat_tab_header_bg.$prefix,mat_tab_header_bg.get_color_tokens($theme, $palette_name)),
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
            ..._palette_styles(theme, "primary"),
            "&.mat-accent": {
                ..._palette_styles(theme, "accent"),
            },
            "&.mat-warn": {
                ..._palette_styles(theme, "warn"),
            },
            "&.mat-background-primary": {
                ..._background_styles(theme, "primary"),
            },
            "&.mat-background-accent": {
              ..._background_styles(theme, "accent"),
            },
            "&.mat-background-warn": {
              ..._background_styles(theme, "warn"),
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
        // ".mat-mdc-tab-header":{
            ...keys.declare_custom_properties(mdc_tab.get_density_tokens(theme),mdc_tab.$custom_property_prefix_secondary),
            // ...keys.declare_custom_properties(mdc_tab_indicator.get_density_tokens(theme),mdc_tab_indicator.$custom_property_prefix),
            // ...create_token_values(mat_tab_header.$prefix,mat_tab_header.get_density_tokens(theme)),
            // ...create_token_values(mat_tab_header_bg.$prefix,mat_tab_header_bg.get_density_tokens(theme)),
        // }
    }
  }
  /**
   * Executes `typography` to handle typography.
   * @zh 执行 `typography`，用于排版。
   * @param theme - theme parameter (`TypographyConfig`) / 主题参数（`TypographyConfig`）
   */
  function typography(theme: TypographyConfig) {
    return{
          // ...keys.declare_custom_properties(mdc_tab.get_typography_tokens(theme),mdc_tab.$custom_property_prefix_secondary),
          // ...keys.declare_custom_properties(mdc_tab_indicator.get_typography_tokens(theme),mdc_tab_indicator.$custom_property_prefix),
          ...create_token_values(mat_tab_header.$prefix, mat_tab_header.get_typography_tokens(theme)),
          // ...create_token_values(mat_tab_header_bg.$prefix, mat_tab_header_bg.get_typography_tokens(theme))
    }
  }
/**
 * Executes `matTabsTheme` to handle mat tabs theme.
 * @zh 执行 `matTabsTheme`，用于Material选项卡组主题。
 * @param theme - theme parameter (`Theme`) / 主题参数（`Theme`）
 * @returns Result of type `Object` / 类型为 `Object` 的返回值
 */
export function matTabsTheme(theme: Theme): Object {
    return {
      '.mat-mdc-tab-group': {
            ...base(theme),
            ...color(theme),
            ...density(theme)
      },
      '.mat-mdc-tab-header': {
        ...typography(theme.typography)
    }
    };
}


