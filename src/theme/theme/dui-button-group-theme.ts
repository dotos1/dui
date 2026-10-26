/**
 * @fileoverview Module `src/theme/theme/dui-button-group-theme.ts` providing dui button group theme definitions and implementation.
 * @zh 模块文件 `src/theme/theme/dui-button-group-theme.ts`，提供DUI按钮分组主题相关的定义与实现。
 */

import { Theme } from '../interfaces/theme';
import { matColor } from '../mat-color';

/**
 * Executes `duiButtonGroupTheme` to handle dui button group theme.
 * @zh 执行 `duiButtonGroupTheme`，用于DUI按钮分组主题。
 * @param theme - theme parameter (`Theme`) / 主题参数（`Theme`）
 * @returns Result of type `Object` / 类型为 `Object` 的返回值
 */
export function duiButtonGroupTheme(theme: Theme): Object {
  const primary: string = matColor(theme.primary);
  const accent: string = matColor(theme.accent);
  const warn: string = matColor(theme.warn);
  const background: string = matColor(theme.background);
  const foreground: string = matColor(theme.foreground);

  return {

  }
}
