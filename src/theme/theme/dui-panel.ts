/**
 * @fileoverview Module `src/theme/theme/dui-panel.ts` providing dui panel definitions and implementation.
 * @zh 模块文件 `src/theme/theme/dui-panel.ts`，提供DUI面板相关的定义与实现。
 */

import { Theme } from '../interfaces/theme';
import { matColor } from '../mat-color';

/**
 * Executes `duiPanelTheme` to handle dui panel theme.
 * @zh 执行 `duiPanelTheme`，用于DUI面板主题。
 * @param theme - theme parameter (`Theme`) / 主题参数（`Theme`）
 * @returns Result of type `Object` / 类型为 `Object` 的返回值
 */
export function duiPanelTheme(theme: Theme): Object {
  const foregroundDivider: string = matColor(theme.foreground, 'divider');
  const backgroundColor: string = matColor(theme.background, 'card');
  const foregroundIcon: string = matColor(theme.foreground, 'icon');
  const background: string = matColor(theme.background, 'status-bar');

  return {
    ".split-gutter":{
        "background-color":foregroundDivider
    },
    ".Resizer": {
        "background": backgroundColor
    },
    ".Resizer .horizontal": {
        "border-top": "5px solid "+backgroundColor,
        "border-bottom":" 5px solid "+backgroundColor
    },
    ".Resizer .horizontal:hover": {
        "border-top": "5px solid "+foregroundIcon,
        "border-bottom":" 5px solid "+foregroundIcon
    },
    ".Resizer .vertical": {
        "border-left":" 5px solid "+backgroundColor,
        "border-right": "5px solid "+backgroundColor
    },
    ".Resizer .vertical:hover": {
        "border-left": "5px solid "+foregroundIcon,
        "border-right": "5px solid "+foregroundIcon
    },
    ".vertical header": {
        "background": background,
    },
    ".vertical footer": {
        "background": background
    },
    ".horizontal header": {
        background: background
    },
    ".horizontal footer": {
        background: background
    }
  }
}
