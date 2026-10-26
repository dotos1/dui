/**
 * @fileoverview Module `src/theme/theme/bottom-sheet-theme.ts` providing bottom sheet theme definitions and implementation.
 * @zh 模块文件 `src/theme/theme/bottom-sheet-theme.ts`，提供底部位置sheet主题相关的定义与实现。
 */

import { Theme } from '../interfaces/theme';
import { matColor } from '../mat-color';

/**
 * Executes `matBottomSheetTheme` to handle mat bottom sheet theme.
 * @zh 执行 `matBottomSheetTheme`，用于Material底部位置Sheet主题。
 * @param theme - theme parameter (`Theme`) / 主题参数（`Theme`）
 * @returns Result of type `Object` / 类型为 `Object` 的返回值
 */
export function matBottomSheetTheme(theme: Theme): Object {
  const background: string = matColor(theme.background, 'dialog');
  const foregroundText: string = matColor(theme.foreground, 'text');
  return {
    ' .mat-bottom-sheet-container': {
      "background": background,
      "color": foregroundText
    }
  };
}
