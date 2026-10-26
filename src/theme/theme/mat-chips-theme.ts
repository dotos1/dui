/**
 * @fileoverview Module `src/theme/theme/mat-chips-theme.ts` providing mat chips theme definitions and implementation.
 * @zh 模块文件 `src/theme/theme/mat-chips-theme.ts`，提供Material纸片标签主题相关的定义与实现。
 */

import {Theme} from '../interfaces/theme';
import { TypographyConfig } from '../interfaces';
import { create_token_values } from '../mdc/token-utils';
import * as keys from '../mdc/keys';
import * as  mdc_chip from '../tokens/mdc/_chip';
import * as  mat_chip from '../tokens/mat/_chip';


/**
 * Executes `base` to handle base.
 * @zh 执行 `base`，用于基础。
 * @param theme - theme parameter (`Theme`) / 主题参数（`Theme`）
 * @returns Result of type `Object` / 类型为 `Object` 的返回值
 */
function base(theme: Theme): Object {
  return{
        ...keys.declare_custom_properties(mdc_chip.get_unthemable_tokens(),mdc_chip.$custom_property_prefix),
        ...create_token_values(mat_chip.$prefix,mat_chip.get_unthemable_tokens()),
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
        ...keys.declare_custom_properties(mdc_chip.get_color_tokens(theme),mdc_chip.$custom_property_prefix),
        ...create_token_values(mat_chip.$prefix,mat_chip.get_color_tokens(theme)),
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

        ...keys.declare_custom_properties(mdc_chip.get_density_tokens(theme),mdc_chip.$custom_property_prefix),
        ...create_token_values(mat_chip.$prefix,mat_chip.get_density_tokens(theme))

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
          ...keys.declare_custom_properties(mdc_chip.get_typography_tokens(theme),mdc_chip.$custom_property_prefix),
          ...create_token_values(mat_chip.$prefix, mat_chip.get_typography_tokens(theme))
  }
}
/**
 * Executes `matChipsTheme` to handle mat chips theme.
 * @zh 执行 `matChipsTheme`，用于Material纸片标签主题。
 * @param theme - theme parameter (`Theme`) / 主题参数（`Theme`）
 * @returns Result of type `Object` / 类型为 `Object` 的返回值
 */
export function matChipsTheme(theme: Theme): Object {
    return {
      ".mat-mdc-standard-chip &.mat-mdc-chip-selected, &.mat-mdc-chip-highlighted": {
          "&.mat-primary": {
            ...keys.declare_custom_properties(mdc_chip.get_color_tokens(theme,'primary'),mdc_chip.$custom_property_prefix),
            ...create_token_values(mat_chip.$prefix,mat_chip.get_color_tokens(theme,'primary')),
          },
          "&.mat-accent": {
            ...keys.declare_custom_properties(mdc_chip.get_color_tokens(theme,'accent'),mdc_chip.$custom_property_prefix),
            ...create_token_values(mat_chip.$prefix,mat_chip.get_color_tokens(theme,'accent')),
          },
          "&.mat-warn": {
            ...keys.declare_custom_properties(mdc_chip.get_color_tokens(theme,'warn'),mdc_chip.$custom_property_prefix),
            ...create_token_values(mat_chip.$prefix,mat_chip.get_color_tokens(theme,'warn')),
          }
        },
        '.mat-mdc-standard-chip': {
            ...base(theme),
            ...color(theme),
            ...density(theme),
            ...typography(theme.typography)
        }
    };
}
