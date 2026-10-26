/**
 * @fileoverview Module `src/theme/theme/dui-topbar-theme.ts` providing dui topbar theme definitions and implementation.
 * @zh 模块文件 `src/theme/theme/dui-topbar-theme.ts`，提供DUI顶栏主题相关的定义与实现。
 */

import { Theme } from '../interfaces/theme';
import { matColor } from '../mat-color';

/**
 * Executes `duiTopbarTheme` to handle dui topbar theme.
 * @zh 执行 `duiTopbarTheme`，用于DUI顶栏主题。
 * @param theme - theme parameter (`Theme`) / 主题参数（`Theme`）
 * @returns Result of type `Object` / 类型为 `Object` 的返回值
 */
export function duiTopbarTheme(theme: Theme): Object {
  return {
    ".dui-topbar .mat-toolbar": {
      "border": "1px solid "+ matColor(theme.foreground, 'text', 0.07),
      "color": matColor(theme.foreground, 'text', 0.54)
    }
  }
}
