/**
 * @fileoverview Module `src/theme/theme/dui-popup-theme.ts` providing dui popup theme definitions and implementation.
 * @zh 模块文件 `src/theme/theme/dui-popup-theme.ts`，提供DUI弹窗主题相关的定义与实现。
 */

import { Theme } from '../interfaces/theme';
import { matColor } from '../mat-color';

/**
 * Executes `duiPopupTheme` to handle dui popup theme.
 * @zh 执行 `duiPopupTheme`，用于DUI弹窗主题。
 * @param theme - theme parameter (`Theme`) / 主题参数（`Theme`）
 * @returns Result of type `Object` / 类型为 `Object` 的返回值
 */
export function duiPopupTheme(theme: Theme): Object {
  return {
    ".resize-icons": {
      "color": matColor(theme.foreground, 'text'),
    },
  }
}
