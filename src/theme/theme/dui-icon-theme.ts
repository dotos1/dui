/**
 * @fileoverview Module `src/theme/theme/dui-icon-theme.ts` providing dui icon theme definitions and implementation.
 * @zh 模块文件 `src/theme/theme/dui-icon-theme.ts`，提供DUI图标主题相关的定义与实现。
 */

import { Theme } from '../interfaces/theme';
import { matColor } from '../mat-color';

/**
 * Executes `duiIconTheme` to handle dui icon theme.
 * @zh 执行 `duiIconTheme`，用于DUI图标主题。
 * @param theme - theme parameter (`Theme`) / 主题参数（`Theme`）
 * @returns Result of type `Object` / 类型为 `Object` 的返回值
 */
export function duiIconTheme(theme: Theme): Object {
  return {
    ".dui-icon .disable": {
      "color": matColor(theme.foreground, 'disabled')
    },
    ".dui-font-icon .disable": {
      "color": matColor(theme.foreground, 'disabled')
    },
  }
}
