/**
 * @fileoverview Module `src/theme/theme/dui-form-wrapper-theme.ts` providing dui form wrapper theme definitions and implementation.
 * @zh 模块文件 `src/theme/theme/dui-form-wrapper-theme.ts`，提供DUI表单包装器主题相关的定义与实现。
 */

import { Theme } from '../interfaces/theme';
import { matColor } from '../mat-color';
import { matThemeElevation } from '../utils/elevation';

/**
 * Executes `duiFormWrapperTheme` to handle dui form wrapper theme.
 * @zh 执行 `duiFormWrapperTheme`，用于DUI表单包装器主题。
 * @param theme - theme parameter (`Theme`) / 主题参数（`Theme`）
 * @returns Result of type `Object` / 类型为 `Object` 的返回值
 */
export function duiFormWrapperTheme(theme: Theme): Object {
  return {
    ".error-container": {
      "background": matColor(theme.background, 'background'),
      "color":matColor(theme.foreground, 'text'),
      ...matThemeElevation(1, theme, 1)
    },
    ".add-button .mat-icon": {
        "background": matColor(theme.foreground, 'text')
    },
    ".delete-button .mat-icon": {
      "background": matColor(theme.foreground, 'secondary-text')
  }
  }
}
