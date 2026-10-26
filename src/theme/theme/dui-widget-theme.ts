/**
 * @fileoverview Module `src/theme/theme/dui-widget-theme.ts` providing dui widget theme definitions and implementation.
 * @zh 模块文件 `src/theme/theme/dui-widget-theme.ts`，提供DUI小部件主题相关的定义与实现。
 */

import { Theme } from '../interfaces/theme';

/**
 * Executes `duiWidgetTheme` to handle dui widget theme.
 * @zh 执行 `duiWidgetTheme`，用于DUI小部件主题。
 * @param theme - theme parameter (`Theme`) / 主题参数（`Theme`）
 * @returns Result of type `Object` / 类型为 `Object` 的返回值
 */
export function duiWidgetTheme(theme: Theme): Object {
  return {
    ' > .dui-widget-front, > .dui-widget-back': {
      // 'background': map-get(background, card)
    }
  }
}
