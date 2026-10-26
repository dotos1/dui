/**
 * @fileoverview Module `src/theme/theme/mat-paginator-theme.ts` providing mat paginator theme definitions and implementation.
 * @zh 模块文件 `src/theme/theme/mat-paginator-theme.ts`，提供Material分页器主题相关的定义与实现。
 */

import { Theme } from '../interfaces/theme';
import { TypographyConfig } from '../interfaces';
import { create_token_values } from '../mdc/token-utils';
import * as  mat_paginator from '../tokens/mat/_paginator';
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
        ...create_token_values(mat_paginator.$prefix,mat_paginator.get_color_tokens(theme)),
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
        ...create_token_values(mat_paginator.$prefix,mat_paginator.get_density_tokens(theme)),
    }
}
/**
 * Executes `typography` to handle typography.
 * @zh 执行 `typography`，用于排版。
 * @param theme - theme parameter (`TypographyConfig`) / 主题参数（`TypographyConfig`）
 */
function typography(theme: TypographyConfig) {
    return{
        ...create_token_values(mat_paginator.$prefix, mat_paginator.get_typography_tokens(theme))
    }
}
/**
 * Executes `matPaginatorTheme` to handle mat paginator theme.
 * @zh 执行 `matPaginatorTheme`，用于Material分页器主题。
 * @param theme - theme parameter (`Theme`) / 主题参数（`Theme`）
 * @returns Result of type `Object` / 类型为 `Object` 的返回值
 */
export function matPaginatorTheme(theme: Theme): Object {
    return {
        '.mat-mdc-paginator': {
            ...base(theme),
            ...color(theme),
            ...density(theme),
            ...typography(theme.typography)
        }
    };
}
