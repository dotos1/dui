/**
 * @fileoverview Module `src/theme/theme/dui-link-preview.theme.ts` providing dui link preview theme definitions and implementation.
 * @zh 模块文件 `src/theme/theme/dui-link-preview.theme.ts`，提供DUI链接预览主题相关的定义与实现。
 */

import { Theme } from '../interfaces';
import { matColor } from '../mat-color';

/**
 * Executes `duiLinkPreviewTheme` to handle dui link preview theme.
 * @zh 执行 `duiLinkPreviewTheme`，用于DUI链接预览主题。
 * @param theme - theme parameter (`Theme`) / 主题参数（`Theme`）
 * @returns Result of type `Object` / 类型为 `Object` 的返回值
 */
export function duiLinkPreviewTheme(theme: Theme): Object {
  return {
    ".link-preview-container .og-link-preview": {
      "background-color":matColor(theme.background,'background')
    },
    ".link-preview-container .og-link-preview:hover": {
      "background-color":matColor(theme.background,'app-bar')
    }
  };
}
