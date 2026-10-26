/**
 * @fileoverview Module `src/theme/theme/dui-gridster-theme.ts` providing dui gridster theme definitions and implementation.
 * @zh 模块文件 `src/theme/theme/dui-gridster-theme.ts`，提供DUI网格拖拽布局主题相关的定义与实现。
 */

import { Theme } from '../interfaces/theme';
import { matColor } from '../mat-color';
import { matGrey } from '../palettes/mat-grey';
import { matThemeElevation } from '../utils/elevation';

/**
 * Executes `duiGridsterTheme` to handle dui gridster theme.
 * @zh 执行 `duiGridsterTheme`，用于DUI网格拖拽布局主题。
 * @param theme - theme parameter (`Theme`) / 主题参数（`Theme`）
 * @returns Result of type `Object` / 类型为 `Object` 的返回值
 */
export function duiGridsterTheme(theme: Theme): Object {

  return {
    "gridster": {
      "background": matColor(theme.background, 'background')
    },
    "gridster .gridster-column": {
      "border-left":" 1px solid "+matColor(theme.background, 'card'),
      "border-right": "1px solid "+matColor(theme.background, 'card')
    },
   "gridster .gridster-row": {
     " border-top":" 1px solid "+matColor(theme.background, 'card'),
      "border-bottom":" 1px solid "+matColor(theme.background, 'card')
    },
    "gridster-item": {
      "background": matColor(theme.background, 'card')
    },
    "gridster-item.gridster-item-resizing, gridster-item.gridster-item-moving":{
      ...matThemeElevation(8, theme, 1)
    },
    "gridster-item:hover .gridster-item-resizable-handler.handle-se":{
      "border-color":" transparent transparent "+matColor(matGrey, 700, 0.9)
    },
    "gridster-preview": {
      "background": matColor(theme.foreground, 'divider')
    }
  }
}
