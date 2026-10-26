/**
 * @fileoverview Module `src/theme/theme/mat-expansion-panel-theme.ts` providing mat expansion panel theme definitions and implementation.
 * @zh 模块文件 `src/theme/theme/mat-expansion-panel-theme.ts`，提供Material展开面板面板主题相关的定义与实现。
 */

import { Theme } from '../interfaces/theme';
import { TypographyConfig } from '../interfaces';
import { create_token_values } from '../mdc/token-utils';
import * as  mat_expansion from '../tokens/mat/_expansion';


/**
 * Executes `base` to handle base.
 * @zh 执行 `base`，用于基础。
 * @param theme - theme parameter (`Theme`) / 主题参数（`Theme`）
 * @returns Result of type `Object` / 类型为 `Object` 的返回值
 */
function base(theme: Theme): Object {
    return{
          ...create_token_values(mat_expansion.$prefix,mat_expansion.get_unthemable_tokens()),
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
          ...create_token_values(mat_expansion.$prefix,mat_expansion.get_color_tokens(theme)),
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
        ...create_token_values(mat_expansion.$prefix,mat_expansion.get_density_tokens(theme)),
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
            ...create_token_values(mat_expansion.$prefix, mat_expansion.get_typography_tokens(theme))
    }
  }
/**
 * Executes `matExpansionPanelTheme` to handle mat expansion panel theme.
 * @zh 执行 `matExpansionPanelTheme`，用于Material展开面板面板主题。
 * @param theme - theme parameter (`Theme`) / 主题参数（`Theme`）
 * @returns Result of type `Object` / 类型为 `Object` 的返回值
 */
export function matExpansionPanelTheme(theme: Theme): Object {
    return {
        '.mat-expansion-panel': {
            ...base(theme),
            ...color(theme),
            ...density(theme),
            ...typography(theme.typography)
        },
    }; 
}
