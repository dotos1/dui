/**
 * @fileoverview Module `src/theme/theme/dui-clipboard-theme.ts` providing dui clipboard theme definitions and implementation.
 * @zh 模块文件 `src/theme/theme/dui-clipboard-theme.ts`，提供DUIclipboard主题相关的定义与实现。
 */

import { Theme } from '../interfaces/theme';
import { matColor } from '../mat-color';
import { matFontSize } from '../utils/index';

/**
 * Executes `duiClipboardTheme` to handle dui clipboard theme.
 * @zh 执行 `duiClipboardTheme`，用于DUIClipboard主题。
 * @param theme - theme parameter (`Theme`) / 主题参数（`Theme`）
 * @returns Result of type `Object` / 类型为 `Object` 的返回值
 */
export function duiClipboardTheme(theme: Theme): Object {
    return {
        ".dui-copy-tooltip": {
            "background":  matColor(theme.primary),
            "color":  matColor(theme.primary,'default-contrast')+ ' !important',
            "font-size": matFontSize(theme.typography, "caption")
          }
      }
}