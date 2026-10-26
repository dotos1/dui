/**
 * @fileoverview Module `src/theme/theme/dui-menubar-theme.ts` providing dui menubar theme definitions and implementation.
 * @zh 模块文件 `src/theme/theme/dui-menubar-theme.ts`，提供DUI菜单栏主题相关的定义与实现。
 */

import { Theme } from '../interfaces/theme';
import { matColor } from '../mat-color';

/**
 * Executes `duiMenubarTheme` to handle dui menubar theme.
 * @zh 执行 `duiMenubarTheme`，用于DUI菜单栏主题。
 * @param theme - theme parameter (`Theme`) / 主题参数（`Theme`）
 * @returns Result of type `Object` / 类型为 `Object` 的返回值
 */
export function duiMenubarTheme(theme: Theme): Object {
  return {
    ".dui-menubar": {
      "background": matColor(theme.background, 'card'),
      "color":  matColor(theme.foreground, 'text')
    },
  }
}
