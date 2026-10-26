/**
 * @fileoverview Module `src/theme/theme/mat-control-placeholder-color.ts` providing mat control placeholder color definitions and implementation.
 * @zh 模块文件 `src/theme/theme/mat-control-placeholder-color.ts`，提供Material表单控件占位提示颜色相关的定义与实现。
 */

import { Theme } from '../interfaces/theme';
import { matColor } from '../mat-color';

/**
 * Executes `matControlPlaceholderColor` to handle mat control placeholder color.
 * @zh 执行 `matControlPlaceholderColor`，用于Material表单控件占位提示颜色。
 * @param theme - theme parameter (`Theme`) / 主题参数（`Theme`）
 * @returns Result of type `string` / 类型为 `string` 的返回值
 */
export function matControlPlaceholderColor(theme: Theme): string {
    return matColor(theme.foreground, 'secondary-text');
}
