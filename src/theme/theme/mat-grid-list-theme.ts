/**
 * @fileoverview Module `src/theme/theme/mat-grid-list-theme.ts` providing mat grid list theme definitions and implementation.
 * @zh 模块文件 `src/theme/theme/mat-grid-list-theme.ts`，提供Material网格表格列表主题相关的定义与实现。
 */

import { Theme } from '../interfaces/theme';
import { TypographyConfig } from '../interfaces/typography-config';
import * as  mat_grid from '../tokens/mat/_grid-list';
import { create_token_values } from '../mdc/token-utils';

/**
 * Executes `typography` to handle typography.
 * @zh 执行 `typography`，用于排版。
 * @param theme - theme parameter (`TypographyConfig`) / 主题参数（`TypographyConfig`）
 * @returns Result of type `Object` / 类型为 `Object` 的返回值
 */
function typography(theme: TypographyConfig): Object {
    return{
      ...create_token_values(mat_grid.$prefix,mat_grid.get_typography_tokens(theme)),
    }
  }
/**
 * Executes `matGridListTheme` to handle mat grid list theme.
 * @zh 执行 `matGridListTheme`，用于Material网格表格列表主题。
 * @param theme - theme parameter (`Theme`) / 主题参数（`Theme`）
 * @returns Result of type `Object` / 类型为 `Object` 的返回值
 */
export function matGridListTheme(theme: Theme): Object {
    return {
        '.mat-grid-list': {
            ...typography(theme.typography)
        }
}
}
