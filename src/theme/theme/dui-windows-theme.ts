/**
 * @fileoverview Module `src/theme/theme/dui-windows-theme.ts` providing dui windows theme definitions and implementation.
 * @zh 模块文件 `src/theme/theme/dui-windows-theme.ts`，提供DUI多窗口主题相关的定义与实现。
 */

import { Theme } from '../interfaces/theme';
import { matColor } from '../mat-color';

/**
 * Executes `duiWindowsTheme` to handle dui windows theme.
 * @zh 执行 `duiWindowsTheme`，用于DUI多窗口主题。
 * @param theme - theme parameter (`Theme`) / 主题参数（`Theme`）
 * @returns Result of type `Object` / 类型为 `Object` 的返回值
 */
export function duiWindowsTheme(theme: Theme): Object {
  const primaryDefaultContrast: string = matColor(theme.primary, 'default-contrast');
  return {
    '.window': {
      'color': matColor(theme.foreground, 'text') + "!important",
      'border': "5px solid " + matColor(theme.primary, 800, 0.9) + "!important",
      'background': matColor(theme.background, 'dialog') + "!important",
    },
    '.window-header': {
      'background-color': matColor(theme.primary, 800, 0.9) + "!important",
      'border-bottom': matColor(theme.foreground, 'divider') + "!important",
      'color': primaryDefaultContrast + "!important",
    },
    '.window-titletext': {
      'color': primaryDefaultContrast + "!important",
    },
    '.ui-btn': {
      'color': primaryDefaultContrast + "!important",
    },
    '.window .window-sidebar': {
      'background': matColor(theme.background, 'dialog') + "!important",
    },
    '.window .window-view-pane .window-content': {
      'background': matColor(theme.background, 'dialog') + "!important",
      'color': primaryDefaultContrast + "!important"
    }
  }
}
