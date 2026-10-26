/**
 * @fileoverview Module `src/theme/theme/mat-divider-theme.ts` providing mat divider theme definitions and implementation.
 * @zh 模块文件 `src/theme/theme/mat-divider-theme.ts`，提供Materialdivider主题相关的定义与实现。
 */

import { Theme } from '../interfaces/theme';

import { create_token_values } from '../mdc/token-utils';
import * as  mat_divider from '../tokens/mat/_divider';

/**
 * Executes `base` to handle base.
 * @zh 执行 `base`，用于基础。
 * @param theme - theme parameter (`Theme`) / 主题参数（`Theme`）
 * @returns Result of type `Object` / 类型为 `Object` 的返回值
 */
function base(theme: Theme): Object {
    return{
          ...create_token_values(mat_divider.$prefix,mat_divider.get_unthemable_tokens()),
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
          ...create_token_values(mat_divider.$prefix,mat_divider.get_color_tokens(theme)),
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
 * Executes `matDividerTheme` to handle mat divider theme.
 * @zh 执行 `matDividerTheme`，用于MaterialDivider主题。
 * @param theme - theme parameter (`Theme`) / 主题参数（`Theme`）
 * @returns Result of type `Object` / 类型为 `Object` 的返回值
 */
export function matDividerTheme(theme: Theme): Object {
    return {
        '.mat-divider': {
            ...base(theme),
            ...color(theme),
            ...density(theme),
        },
    };
}
