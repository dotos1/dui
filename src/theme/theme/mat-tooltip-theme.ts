/**
 * @fileoverview Module `src/theme/theme/mat-tooltip-theme.ts` providing mat tooltip theme definitions and implementation.
 * @zh 模块文件 `src/theme/theme/mat-tooltip-theme.ts`，提供Material悬浮提示主题相关的定义与实现。
 */

import { Theme } from '../interfaces/theme';
import * as keys from '../mdc/keys';
import * as  tooltip from '../tokens/mdc/_plain-tooltip';
import { TypographyConfig } from '../interfaces';

/**
 * Executes `base` to handle base.
 * @zh 执行 `base`，用于基础。
 * @param theme - theme parameter (`Theme`) / 主题参数（`Theme`）
 * @returns Result of type `Object` / 类型为 `Object` 的返回值
 */
function base(theme: Theme): Object {
    return{
        ...keys.declare_custom_properties(tooltip.get_unthemable_tokens(),tooltip.$custom_property_prefix),
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
        ...keys.declare_custom_properties(tooltip.get_color_tokens(theme),tooltip.$custom_property_prefix),
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
        ...keys.declare_custom_properties(tooltip.get_density_tokens(theme),tooltip.$custom_property_prefix),
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
        ...keys.declare_custom_properties(tooltip.get_typography_tokens(theme),tooltip.$custom_property_prefix),
    }
}
/**
 * Executes `matTooltipTheme` to handle mat tooltip theme.
 * @zh 执行 `matTooltipTheme`，用于Material悬浮提示主题。
 * @param theme - theme parameter (`Theme`) / 主题参数（`Theme`）
 * @returns Result of type `Object` / 类型为 `Object` 的返回值
 */
export function matTooltipTheme(theme: Theme): Object {
    return {
        '.mdc-tooltip': {
            ...base(theme),
            ...color(theme),
            ...density(theme),
            ...typography(theme.typography)
        }
    };
}
