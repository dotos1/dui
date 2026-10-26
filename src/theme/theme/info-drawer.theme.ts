/**
 * @fileoverview Module `src/theme/theme/info-drawer.theme.ts` providing info drawer theme definitions and implementation.
 * @zh 模块文件 `src/theme/theme/info-drawer.theme.ts`，提供信息抽屉面板主题相关的定义与实现。
 */

import { Theme } from '../interfaces/theme';
import { matColor } from '../mat-color';
import { matThemeElevation } from '../utils/elevation';

/**
 * Executes `duiInfoDrawerTheme` to handle dui info drawer theme.
 * @zh 执行 `duiInfoDrawerTheme`，用于DUI信息抽屉面板主题。
 * @param theme - theme parameter (`Theme`) / 主题参数（`Theme`）
 * @returns Result of type `Object` / 类型为 `Object` 的返回值
 */
export function duiInfoDrawerTheme(theme: Theme): Object {
  return {
    ".dui-info-drawer-layout": {
      "background-color": matColor(theme.background, 'card'),
      ...matThemeElevation(1, theme, 1)
    },
    ".dui-info-drawer-layout .mat-mdc-tab-label ": {
      "color": matColor(theme.foreground, 'secondary-text'),
    },
    ".dui-info-drawer-layout .mat-mdc-tab-label-active": {
      "color": matColor(theme.primary, 'default'),
    },
    ".dui-info-drawer-layout-header-title ": {
      color: matColor(theme.foreground, "text", 0.54)
    }
  }
}
