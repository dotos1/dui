/**
 * @fileoverview Module `src/theme/theme/mat-sort-theme.ts` providing mat sort theme definitions and implementation.
 * @zh 模块文件 `src/theme/theme/mat-sort-theme.ts`，提供Material排序主题相关的定义与实现。
 */

import { Theme } from '../interfaces/theme';
import { create_token_values } from '../mdc/token-utils';
import * as  mat_sort from '../tokens/mat/_sort';

/**
 * Executes `base` to handle base.
 * @zh 执行 `base`，用于基础。
 * @param theme - theme parameter (`Theme`) / 主题参数（`Theme`）
 * @returns Result of type `Object` / 类型为 `Object` 的返回值
 */
function base(theme: Theme): Object {
  return{
  
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
        ...create_token_values(mat_sort.$prefix,mat_sort.get_color_tokens(theme)),
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
 * Executes `matSortTheme` to handle mat sort theme.
 * @zh 执行 `matSortTheme`，用于Material排序主题。
 * @param theme - theme parameter (`Theme`) / 主题参数（`Theme`）
 * @returns Result of type `Object` / 类型为 `Object` 的返回值
 */
export function matSortTheme(theme: Theme): Object {
    return {
        '.mat-mdc-snack-bar': {
            ...base(theme),
            ...color(theme),
            ...density(theme)
        }
    };
}
