/**
 * @fileoverview Module `src/ux/monaco-editor/editor.theme.ts` providing editor theme definitions and implementation.
 * @zh 模块文件 `src/ux/monaco-editor/editor.theme.ts`，提供编辑器主题相关的定义与实现。
 */

import { Theme } from '@dotos/dui/theme';
import { matColor } from '@dotos/dui/theme';

/**
 * Executes `EditorTheme` to handle editor theme.
 * @zh 执行 `EditorTheme`，用于编辑器主题。
 * @param theme - theme parameter (`Theme`) / 主题参数（`Theme`）
 * @returns Result of type `Object` / 类型为 `Object` 的返回值
 */
export function EditorTheme(theme: Theme): Object {
  return {
    ".mtk1":{
      "color":matColor(theme.foreground, 'secondary-text') +"!important"
    },
    ".monaco-editor .cursors-layer .cursor" :{
          "background-color": matColor(theme.foreground, 'text') +"!important",
          "border-color": matColor(theme.foreground, 'dividers') +"!important",
          "color": matColor(theme.foreground, 'text') +"!important"
    }
  };
}
