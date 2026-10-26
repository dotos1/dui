/**
 * @fileoverview Module `src/theme/theme/tree-theme.ts` providing tree theme definitions and implementation.
 * @zh 模块文件 `src/theme/theme/tree-theme.ts`，提供树形控件主题相关的定义与实现。
 */

import { Theme } from '../interfaces/theme';
import { matColor } from '../mat-color';

/**
 * Executes `treeTheme` to handle tree theme.
 * @zh 执行 `treeTheme`，用于树形控件主题。
 * @param theme - theme parameter (`Theme`) / 主题参数（`Theme`）
 * @returns Result of type `Object` / 类型为 `Object` 的返回值
 */
export function treeTheme(theme: Theme): Object {

    return {
        '.node-wrapper': {
            '-webkit-tap-highlight-color': matColor(theme.foreground, 'secondary-text'),
            'color': matColor(theme.foreground, 'secondary-text')
        },

        '.tree-node': {
            '-webkit-tap-highlight-color': matColor(theme.foreground, 'secondary-text'),
            'color': matColor(theme.foreground, 'secondary-text')
        },

        '.node-wrapper-active,.node-wrapper.node-wrapper-active:hover,.node-wrapper-node-wrapper-focused': {
            '-webkit-tap-highlight-color': matColor(theme.primary, 500),
            'color': matColor(theme.primary, 500),
            'background': matColor(theme.foreground, 'dividers')
        },
        '.node-wrapper-focused': {
            '-webkit-tap-highlight-color': matColor(theme.primary, 500),
            'color': matColor(theme.primary, 500),
            'background': matColor(theme.foreground, 'dividers')
        },
        '.node-drop-slot.is-dragging-over': {
            'background': matColor(theme.foreground, 'dividers')
        }
    };
}
