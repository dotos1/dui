/**
 * @fileoverview Module `src/theme/theme/icon-picker.theme.ts` providing icon picker theme definitions and implementation.
 * @zh 模块文件 `src/theme/theme/icon-picker.theme.ts`，提供图标选择器主题相关的定义与实现。
 */


import { Theme } from '../interfaces';
import { matColor } from '../mat-color';
import { matThemeElevation } from '../utils/elevation';

/**
 * Executes `duiIconPickerTheme` to handle dui icon picker theme.
 * @zh 执行 `duiIconPickerTheme`，用于DUI图标选择器主题。
 * @param theme - theme parameter (`Theme`) / 主题参数（`Theme`）
 * @returns Result of type `Object` / 类型为 `Object` 的返回值
 */
export function duiIconPickerTheme(theme: Theme): Object {

  const backgroundCardColor: string = matColor(theme.background, 'card');
  const foregroundText: string = matColor(theme.foreground, 'secondary-text');
  const primaryColor: string = matColor(theme.primary,500);

  return {
    ".icon-picker": {
      "background-color": backgroundCardColor,
      ...matThemeElevation(8, theme, 1)
    },
    ".icon-picker div.icon-grid div button": {
      "border": "1px solid " + backgroundCardColor,
      "background-color": backgroundCardColor
    },
    ".btn-default": {
      "color":foregroundText
    },
    " #icon-button:hover": {
      "color": "1px solid "  +primaryColor
    },
  };
}
