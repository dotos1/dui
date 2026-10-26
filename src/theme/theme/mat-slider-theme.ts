/**
 * @fileoverview Module `src/theme/theme/mat-slider-theme.ts` providing mat slider theme definitions and implementation.
 * @zh 模块文件 `src/theme/theme/mat-slider-theme.ts`，提供Material滑块主题相关的定义与实现。
 */

import {
    Theme
} from '../interfaces/index';
import { resolve_elevation,create_token_values } from '../mdc/token-utils';
import * as keys from '../mdc/keys';
import { TypographyConfig } from '../interfaces';
import * as  mdc_slider from '../tokens/mdc/_slider';
import * as  mat_slider from '../tokens/mat/_slider';


/**
 * Executes `base` to handle base.
 * @zh 执行 `base`，用于基础。
 * @param theme - theme parameter (`Theme`) / 主题参数（`Theme`）
 * @returns Result of type `Object` / 类型为 `Object` 的返回值
 */
function base(theme: Theme): Object {
  return{
        ...keys.declare_custom_properties(mdc_slider.get_unthemable_tokens(),mdc_slider.$custom_property_prefix),
        ...create_token_values(mat_slider.$prefix,mat_slider.get_unthemable_tokens()),
  }
}

/**
 * Executes `color` to handle color.
 * @zh 执行 `color`，用于颜色。
 * @param theme - theme parameter (`Theme`) / 主题参数（`Theme`）
 * @returns Result of type `Object` / 类型为 `Object` 的返回值
 */
function color(theme: Theme): Object {
    let $mdc_color_tokens= resolve_elevation(mdc_slider.get_color_tokens(theme), "handle-elevation",  "handle-shadow-color");
    let $mat_slider_color_tokens= mat_slider.get_color_tokens(theme);
  return{
        ...keys.declare_custom_properties($mdc_color_tokens,mdc_slider.$custom_property_prefix),
        ...create_token_values(mat_slider.$prefix,$mat_slider_color_tokens),
        
        ".mat-accent": {
            ...create_token_values(mat_slider.$prefix,mat_slider.private_get_color_palette_color_tokens(theme,'accent')),
            ...keys.declare_custom_properties(mdc_slider.private_get_color_palette_color_tokens(theme,'accent'),mdc_slider.$custom_property_prefix),
        },

        ".mat-warn": {
            ...create_token_values(mat_slider.$prefix,mat_slider.private_get_color_palette_color_tokens(theme,'warn')),
            ...keys.declare_custom_properties(mdc_slider.private_get_color_palette_color_tokens(theme,'warn'),mdc_slider.$custom_property_prefix),
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
    ...keys.declare_custom_properties(mdc_slider.get_density_tokens(theme),mdc_slider.$custom_property_prefix),
  }
}
/**
 * Executes `typography` to handle typography.
 * @zh 执行 `typography`，用于排版。
 * @param theme - theme parameter (`TypographyConfig`) / 主题参数（`TypographyConfig`）
 */
function typography(theme: TypographyConfig) {
    return{
        ...keys.declare_custom_properties(mdc_slider.get_typography_tokens(theme),mdc_slider.$custom_property_prefix),
    }
  }
/**
 * Executes `matSliderTheme` to handle mat slider theme.
 * @zh 执行 `matSliderTheme`，用于Material滑块主题。
 * @param theme - theme parameter (`Theme`) / 主题参数（`Theme`）
 * @returns Result of type `Object` / 类型为 `Object` 的返回值
 */
export function matSliderTheme(theme: Theme): Object {
    return {
        '.mat-mdc-slider': {
            ...base(theme),
            ...color(theme),
            ...density(theme),
            ...typography(theme.typography)
        },
    };
}


