/**
 * @fileoverview Module `src/theme/theme/dui-toolbar-theme.ts` providing dui toolbar theme definitions and implementation.
 * @zh 模块文件 `src/theme/theme/dui-toolbar-theme.ts`，提供DUI工具栏主题相关的定义与实现。
 */

import { Theme } from '../interfaces/theme';
import { matColor } from '../mat-color';
import { matThemeElevation } from '../utils/elevation';

/**
 * Executes `duiToolbarTheme` to handle dui toolbar theme.
 * @zh 执行 `duiToolbarTheme`，用于DUI工具栏主题。
 * @param theme - theme parameter (`Theme`) / 主题参数（`Theme`）
 * @returns Result of type `Object` / 类型为 `Object` 的返回值
 */
export function duiToolbarTheme(theme: Theme): Object {
  return {
    ".toolbar": {
      "background-color":  matColor(theme.background, 'card'),
      "color": matColor(theme.foreground, 'icons')
    },
    ".toolbar-horizontal": {
      ...matThemeElevation(1, theme, 1)
    },
    ".dui-separator": {
      "border-left": "1px solid "+ matColor(theme.foreground, 'divider'),
      "border-left-color": matColor(theme.foreground, 'divider'),
    },
    "divider": {
      " border-left":" 1px solid "+matColor(theme.foreground, 'divider'),
      " border-left-color":matColor(theme.foreground, 'divider'),
    }
  }
}
