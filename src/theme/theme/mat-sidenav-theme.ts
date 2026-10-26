/**
 * @fileoverview Module `src/theme/theme/mat-sidenav-theme.ts` providing mat sidenav theme definitions and implementation.
 * @zh 模块文件 `src/theme/theme/mat-sidenav-theme.ts`，提供Material侧边导航主题相关的定义与实现。
 */

import { TypographyConfig } from '../interfaces';
import { Theme } from '../interfaces/theme';
import { create_token_values } from '../mdc/token-utils';
import * as mat_sidenav from '../tokens/mat/_sidenav';

/**
 * Executes `base` to handle base.
 * @zh 执行 `base`，用于基础。
 * @param theme - theme parameter (`Theme`) / 主题参数（`Theme`）
 * @returns Result of type `Object` / 类型为 `Object` 的返回值
 */
function base(theme: Theme): Object {
    return{ 
        ...create_token_values(mat_sidenav.$prefix, mat_sidenav.get_unthemable_tokens()),
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
        ...create_token_values(mat_sidenav.$prefix, mat_sidenav.get_color_tokens(theme)),
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
 function typography(config: TypographyConfig): Object {
    return {};
}
/**
 * Executes `matSidenavTheme` to handle mat sidenav theme.
 * @zh 执行 `matSidenavTheme`，用于Material侧边导航主题。
 * @param theme - theme parameter (`Theme`) / 主题参数（`Theme`）
 * @returns Result of type `Object` / 类型为 `Object` 的返回值
 */
export function matSidenavTheme(theme: Theme): Object {
    return {
        '.mat-drawer-container': {
            ...base(theme),
            ...color(theme),
            ...density(theme),
            ...typography(theme.typography)
        },
    };
}
