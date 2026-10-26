/**
 * @fileoverview Module `src/theme/theme/mat-table-theme.ts` providing mat table theme definitions and implementation.
 * @zh 模块文件 `src/theme/theme/mat-table-theme.ts`，提供Material表格主题相关的定义与实现。
 */

import { Theme } from '../interfaces/theme';
import { TypographyConfig } from '../interfaces';
import { create_token_values } from '../mdc/token-utils';
import * as  mdc_table from '../tokens/mat/_table';


/**
 * Executes `base` to handle base.
 * @zh 执行 `base`，用于基础。
 * @param theme - theme parameter (`Theme`) / 主题参数（`Theme`）
 * @returns Result of type `Object` / 类型为 `Object` 的返回值
 */
function base(theme: Theme): Object {
    return{ 
        ...create_token_values(mdc_table.$prefix,mdc_table.get_unthemable_tokens()),
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
          ...create_token_values(mdc_table.$prefix,mdc_table.get_color_tokens(theme)),
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
      ...create_token_values(mdc_table.$prefix,mdc_table.get_density_tokens(theme)),
    }
  }
  /**
   * Executes `typography` to handle typography.
   * @zh 执行 `typography`，用于排版。
   * @param theme - theme parameter (`TypographyConfig`) / 主题参数（`TypographyConfig`）
   */
  function typography(theme: TypographyConfig) {
    return{
      ...create_token_values(mdc_table.$prefix, mdc_table.get_typography_tokens(theme))
    }
  }
/**
 * Executes `matTableTheme` to handle mat table theme.
 * @zh 执行 `matTableTheme`，用于Material表格主题。
 * @param theme - theme parameter (`Theme`) / 主题参数（`Theme`）
 * @returns Result of type `Object` / 类型为 `Object` 的返回值
 */
export function matTableTheme(theme: Theme): Object {
    return {
        '.mat-mdc-table': {
            ...base(theme),
            ...color(theme),
            ...density(theme),
            ...typography(theme.typography)
        }
    };
}
