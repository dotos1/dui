/**
 * @fileoverview Module `src/theme/theme/mat-ripple-theme.ts` providing mat ripple theme definitions and implementation.
 * @zh 模块文件 `src/theme/theme/mat-ripple-theme.ts`，提供Materialripple主题相关的定义与实现。
 */

import { Theme } from '../interfaces/theme';
import { rgba } from '../mat-color';
import { matRippleColorOpacity } from '../constants';


/**
 * Executes `matRippleTheme` to handle mat ripple theme.
 * @zh 执行 `matRippleTheme`，用于MaterialRipple主题。
 * @param theme - theme parameter (`Theme`) / 主题参数（`Theme`）
 * @returns Result of type `Object` / 类型为 `Object` 的返回值
 */
export function matRippleTheme(theme: Theme): Object {
    return {
        '.mat-ripple-element': {
            'background-color': rgba(theme.foreground.base, matRippleColorOpacity)
        }
    };
}
