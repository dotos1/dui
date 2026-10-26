/**
 * @fileoverview Module `src/theme/theme/dui-keyboard-theme.ts` providing dui keyboard theme definitions and implementation.
 * @zh 模块文件 `src/theme/theme/dui-keyboard-theme.ts`，提供DUI键盘主题相关的定义与实现。
 */

import { Theme } from '../interfaces';
import { matColor } from '../mat-color';
import { matThemeElevation } from '../utils/elevation';

/**
 * Executes `duiKeyBoardTheme` to handle dui key board theme.
 * @zh 执行 `duiKeyBoardTheme`，用于DUI键Board主题。
 * @param theme - theme parameter (`Theme`) / 主题参数（`Theme`）
 * @returns Result of type `Object` / 类型为 `Object` 的返回值
 */
export function duiKeyBoardTheme(theme: Theme): Object {
  return {
    ".key": {
      "border": "1px solid "+matColor(theme.foreground,'divider'),
      "background-color": matColor(theme.background,'background')
    },
    ".help-modal .title":{
      "color": matColor(theme.foreground,'text')
    },
    ".help-modal .help-modal__body":{
      "color": matColor(theme.foreground,'secondary-text')
    },
    ".item": {
      "background-color": matColor(theme.background,'background')
    },
    ".description": {
      "color": matColor(theme.foreground,'secondary-text')
    },
    ".item--odd": {
      "background-color": matColor(theme.background,'card')
    },
    ".help-modal": {
      ...matThemeElevation(6, theme, 1),
      "background": matColor(theme.background,'card')
    },
    ".help-modal__backdrop": {
      "background": matColor(theme.foreground,'disabled-button') 
    }
  };
}