/**
 * @fileoverview Module `src/theme/theme/xterm-theme.ts` providing xterm theme definitions and implementation.
 * @zh 模块文件 `src/theme/theme/xterm-theme.ts`，提供xterm主题相关的定义与实现。
 */

import { Theme } from '../interfaces/theme';
import { matColor } from '../mat-color';

/**
 * Executes `xTermTheme` to handle x term theme.
 * @zh 执行 `xTermTheme`，用于X坐标Term主题。
 * @param theme - theme parameter (`Theme`) / 主题参数（`Theme`）
 * @returns Result of type `Object` / 类型为 `Object` 的返回值
 */
export function xTermTheme(theme: Theme): Object {
    return {
        ".xterm .composition-view": {
            "background": matColor(theme.background,'background') +" !important",
            "color": matColor(theme.foreground,'text')
        },
        ".xterm .xterm-viewport": {
            "background-color":  matColor(theme.background,'background')+" !important",
        },
        "div > .handle-active":{
            "background-color":  matColor(theme.foreground,'icon')+" !important"
        },
        ".resize-handle":{
            "background-color": matColor(theme.background,'background')+" !important"
        }
    };
}