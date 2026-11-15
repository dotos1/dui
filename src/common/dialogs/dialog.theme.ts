/**
 * @fileoverview Module `src/common/dialogs/dialog.theme.ts` providing dialog theme definitions and implementation.
 * @zh 模块文件 `src/common/dialogs/dialog.theme.ts`，提供对话框主题相关的定义与实现。
 */


import { matColor, Theme } from '@dotos1/dui/theme';

/**
 * Executes `duiDialogTheme` to handle dui dialog theme.
 * @zh 执行 `duiDialogTheme`，用于DUI对话框主题。
 * @param theme - theme parameter (`Theme`) / 主题参数（`Theme`）
 * @returns Result of type `Object` / 类型为 `Object` 的返回值
 */
export function duiDialogTheme(theme: Theme): Object {
  return {
    " .resize-icons": {
           "color": matColor(theme.foreground, 'icon')
    }
  };
}

