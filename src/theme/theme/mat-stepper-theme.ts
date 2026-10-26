/**
 * @fileoverview Module `src/theme/theme/mat-stepper-theme.ts` providing mat stepper theme definitions and implementation.
 * @zh 模块文件 `src/theme/theme/mat-stepper-theme.ts`，提供Material步骤条主题相关的定义与实现。
 */

import { Theme } from '../interfaces/theme';
import { create_token_values } from '../mdc/token-utils';
import * as  mat_stepper from '../tokens/mat/_stepper';
import { TypographyConfig } from '../interfaces';
/**
 * Executes `base` to handle base.
 * @zh 执行 `base`，用于基础。
 * @param theme - theme parameter (`Theme`) / 主题参数（`Theme`）
 * @returns Result of type `Object` / 类型为 `Object` 的返回值
 */
function base(theme: Theme): Object {
  return{ }
}

/**
 * Executes `color` to handle color.
 * @zh 执行 `color`，用于颜色。
 * @param theme - theme parameter (`Theme`) / 主题参数（`Theme`）
 * @returns Result of type `Object` / 类型为 `Object` 的返回值
 */
function color(theme: Theme): Object {
  return{
        ...create_token_values(mat_stepper.$prefix,mat_stepper.get_color_tokens(theme)),
        ".mat-step-header.mat-accent": {
            ...create_token_values(mat_stepper.$prefix,mat_stepper.private_get_color_palette_color_tokens(theme, "accent")),
        },
        ".mat-step-header.mat-warn": {
            ...create_token_values(mat_stepper.$prefix,mat_stepper.private_get_color_palette_color_tokens(theme, "warn")),
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
    ...create_token_values(mat_stepper.$prefix,mat_stepper.get_density_tokens(theme)),
  }
}
/**
 * Executes `typography` to handle typography.
 * @zh 执行 `typography`，用于排版。
 * @param theme - theme parameter (`TypographyConfig`) / 主题参数（`TypographyConfig`）
 */
function typography(theme: TypographyConfig) {
  return{
    ...create_token_values(mat_stepper.$prefix, mat_stepper.get_typography_tokens(theme))
  }
}
/**
 * Executes `matStepperTheme` to handle mat stepper theme.
 * @zh 执行 `matStepperTheme`，用于Material步骤条主题。
 * @param theme - theme parameter (`Theme`) / 主题参数（`Theme`）
 * @returns Result of type `Object` / 类型为 `Object` 的返回值
 */
export function matStepperTheme(theme: Theme): Object {
    return {
        'mat-stepper': {
            ...base(theme),
            ...color(theme),
            ...density(theme),
            ...typography(theme.typography)
        }
    };
}
