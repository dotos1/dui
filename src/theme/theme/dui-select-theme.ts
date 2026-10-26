/**
 * @fileoverview Module `src/theme/theme/dui-select-theme.ts` providing dui select theme definitions and implementation.
 * @zh 模块文件 `src/theme/theme/dui-select-theme.ts`，提供DUI下拉选择主题相关的定义与实现。
 */

import { Theme } from '../interfaces/theme';
import { matColor } from '../mat-color';

/**
 * Executes `duiSelectTheme` to handle dui select theme.
 * @zh 执行 `duiSelectTheme`，用于DUI下拉选择主题。
 * @param theme - theme parameter (`Theme`) / 主题参数（`Theme`）
 * @returns Result of type `Object` / 类型为 `Object` 的返回值
 */
export function duiSelectTheme(theme: Theme): Object {
  const foregroundDivider: string = matColor(theme.foreground, 'divider');
  const backgroundColor: string = matColor(theme.background, 'card');

  return {
   ".mat-select-search-inner": {
     " background-color": backgroundColor
  },
  ".mat-select-search-input": {
    "color": matColor(theme.foreground, 'secondary-text'),
    "border":"1px solid "+foregroundDivider +' !important',
    "background-color": backgroundColor
  },
  ".mat-select-search-input::placeholder": {
    color: matColor(theme.foreground, 'secondary-text'),
  }
  }
}
