/**
 * @fileoverview Module `src/theme/theme/dui-linestyle-theme.ts` providing dui linestyle theme definitions and implementation.
 * @zh 模块文件 `src/theme/theme/dui-linestyle-theme.ts`，提供DUIlinestyle主题相关的定义与实现。
 */


import { Theme } from '../interfaces';
import { matColor,rgba } from '../mat-color';

/**
 * Executes `duiLineStyleTheme` to handle dui line style theme.
 * @zh 执行 `duiLineStyleTheme`，用于DUI线段样式主题。
 * @param theme - theme parameter (`Theme`) / 主题参数（`Theme`）
 * @returns Result of type `Object` / 类型为 `Object` 的返回值
 */
export function duiLineStyleTheme(theme: Theme): Object {
  return {
    "mat-option:nth-child(even)": {
     " background-color": matColor(theme.background,"card")
    },
    "mat-option:nth-child(odd)": {
     " background-color":rgba(matColor(theme.background,"card"), 0.08)
    },
    ".line-size-row": {
      "border": "1px solid "+matColor(theme.foreground,"icon")
    },
    ".SOLID":{
      "border": "1px solid "+matColor(theme.foreground,"icon")
    },
    ".DOT":{
      "border": "1px solid "+matColor(theme.foreground,"icon")
    },
    ".DASH":{
      "border": "1px solid "+matColor(theme.foreground,"icon")
    },
    ".DASH_DOT":{
      "border": "1px solid "+matColor(theme.foreground,"icon")
    },
    ".DASH_DOT_DOT":{
      "border": "1px solid "+matColor(theme.foreground,"icon")
    }
  };
}