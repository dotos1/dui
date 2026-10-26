/**
 * @fileoverview Module `src/theme/theme/mat-progress-bar-theme.ts` providing mat progress bar theme definitions and implementation.
 * @zh 模块文件 `src/theme/theme/mat-progress-bar-theme.ts`，提供Material进度条条主题相关的定义与实现。
 */

import { Theme } from '../interfaces/theme';
import { TypographyConfig } from '../interfaces';
import * as keys from '../mdc/keys';

import * as  mdc_progress from '../tokens/mdc/_linear-progress';

/**
 * Executes `base` to handle base.
 * @zh 执行 `base`，用于基础。
 * @param theme - theme parameter (`Theme`) / 主题参数（`Theme`）
 * @returns Result of type `Object` / 类型为 `Object` 的返回值
 */
function base(theme: Theme): Object {
    return{ 
        ...keys.declare_custom_properties(mdc_progress.get_unthemable_tokens(),mdc_progress.$custom_property_prefix),
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
            ...keys.declare_custom_properties(mdc_progress.get_color_tokens(theme,"primary"),mdc_progress.$custom_property_prefix),
           " &.mat-accent": {
                ...keys.declare_custom_properties(mdc_progress.get_color_tokens(theme,"accent"),mdc_progress.$custom_property_prefix),
            },
            "&.mat-warn": {
                ...keys.declare_custom_properties(mdc_progress.get_color_tokens(theme,"warn"),mdc_progress.$custom_property_prefix),
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
    }
}
/**
 * Executes `typography` to handle typography.
 * @zh 执行 `typography`，用于排版。
 * @param config - config parameter (`TypographyConfig`) / 配置参数（`TypographyConfig`）
 * @returns Result of type `Object` / 类型为 `Object` 的返回值
 */
export function typography(config: TypographyConfig): Object {
    return {};
}
/**
 * Executes `matProgressBarTheme` to handle mat progress bar theme.
 * @zh 执行 `matProgressBarTheme`，用于Material进度条条主题。
 * @param theme - theme parameter (`Theme`) / 主题参数（`Theme`）
 * @returns Result of type `Object` / 类型为 `Object` 的返回值
 */
export function matProgressBarTheme(theme: Theme): Object {
    return {
        '.mat-mdc-progress-bar': {
            ...base(theme),
            ...color(theme),
            ...density(theme),
            ...typography(theme.typography)
        }
    };
}
