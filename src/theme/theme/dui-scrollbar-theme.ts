/**
 * @fileoverview Module `src/theme/theme/dui-scrollbar-theme.ts` providing dui scrollbar theme definitions and implementation.
 * @zh 模块文件 `src/theme/theme/dui-scrollbar-theme.ts`，提供DUI滚动条主题相关的定义与实现。
 */

import { Theme } from '../interfaces/theme';
import { matColor } from '../mat-color';

/**
 * Executes `duiScrollbarTheme` to handle dui scrollbar theme.
 * @zh 执行 `duiScrollbarTheme`，用于DUI滚动条主题。
 * @param theme - theme parameter (`Theme`) / 主题参数（`Theme`）
 * @returns Result of type `Object` / 类型为 `Object` 的返回值
 */
export function duiScrollbarTheme(theme: Theme): Object {
    return {
        ".ng-scrollbar-button-icon svg": {
            "fill": matColor(theme.foreground, 'icons') +" !important"
        },
        ".ng-scrollbar-button-icon &:hover": {
            "background": 'transparent' +" !important"
        },
        ".ng-scrollbar-button-icon &:hover svg": {
            "fill": matColor(theme.foreground, 'secondary-text') +" !important"
        },
        ".ng-scrollbar-button-icon &:active": {
            "background": 'transparent' +" !important"
        },
        ".ng-scrollbar-button-icon &:active svg": {
            "fill": matColor(theme.foreground, 'secondary-text') +" !important"
        },
        ".ng-scrollbar-hover &:hover, &:active ": {
            "background-color": matColor(theme.foreground, 'slider-off') +" !important"
        },
        ".ng-scrollbar-thumb": {
            "background-color": matColor(theme.foreground, 'slider-off') +" !important"
        }
    }
}
