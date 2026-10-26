/**
 * @fileoverview Module `src/theme/theme/dui-loading-theme.ts` providing dui loading theme definitions and implementation.
 * @zh 模块文件 `src/theme/theme/dui-loading-theme.ts`，提供DUI加载中主题相关的定义与实现。
 */

import { Theme } from '../interfaces';
import { matColor,rgba } from '../mat-color';

/**
 * Executes `duiLoadingTheme` to handle dui loading theme.
 * @zh 执行 `duiLoadingTheme`，用于DUI加载中主题。
 * @param theme - theme parameter (`Theme`) / 主题参数（`Theme`）
 * @returns Result of type `Object` / 类型为 `Object` 的返回值
 */
export function duiLoadingTheme(theme: Theme): Object {
  return {
    ".dui-loading-wrapper .dui-overlay .dui-loading": {
      "background":rgba(matColor(theme.background,'dialog'),0.8) 
    }
  };
}