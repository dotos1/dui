/**
 * @fileoverview Module `src/theme/theme/dui-trigger-theme.ts` providing dui trigger theme definitions and implementation.
 * @zh 模块文件 `src/theme/theme/dui-trigger-theme.ts`，提供DUI触发主题相关的定义与实现。
 */


import { Theme } from '../interfaces';
import { matColor } from '../mat-color';

/**
 * Executes `duiTriggerTheme` to handle dui trigger theme.
 * @zh 执行 `duiTriggerTheme`，用于DUI触发主题。
 * @param theme - theme parameter (`Theme`) / 主题参数（`Theme`）
 * @returns Result of type `Object` / 类型为 `Object` 的返回值
 */
export function duiTriggerTheme(theme: Theme): Object {
  return {
    ".trigger-field-button": {
      "color": matColor(theme.foreground, 'icon')
    },
    ".trigger-field-button :focus": {
        "background-color":  matColor(theme.background, 'focused-button') 
    },
    ".trigger-field-button .trigger-field-disabled": {
        "color": matColor(theme.foreground, 'disabled-text') 
    }
  };
}

