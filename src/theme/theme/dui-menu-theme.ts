/**
 * @fileoverview Module `src/theme/theme/dui-menu-theme.ts` providing dui menu theme definitions and implementation.
 * @zh 模块文件 `src/theme/theme/dui-menu-theme.ts`，提供DUI菜单主题相关的定义与实现。
 */

import { Theme } from '../interfaces/theme';
import { matColor } from '../mat-color';

/**
 * Executes `duiMenuTheme` to handle dui menu theme.
 * @zh 执行 `duiMenuTheme`，用于DUI菜单主题。
 * @param theme - theme parameter (`Theme`) / 主题参数（`Theme`）
 * @returns Result of type `Object` / 类型为 `Object` 的返回值
 */
export function duiMenuTheme(theme: Theme): Object {
  return {
    ".menu-bar-item-menu-item--command": {
      "color": matColor(theme.foreground, 'icons')
    },
  }
}
