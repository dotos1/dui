/**
 * @fileoverview Module `src/theme/theme/command-palette.theme.ts` providing command palette theme definitions and implementation.
 * @zh 模块文件 `src/theme/theme/command-palette.theme.ts`，提供命令调色板主题相关的定义与实现。
 */

import { Theme } from '../interfaces';
import { matColor } from '../mat-color';

/**
 * Executes `CommandPaletteTheme` to handle command palette theme.
 * @zh 执行 `CommandPaletteTheme`，用于命令调色板主题。
 * @param theme - theme parameter (`Theme`) / 主题参数（`Theme`）
 * @returns Result of type `Object` / 类型为 `Object` 的返回值
 */
export function CommandPaletteTheme(theme: Theme): Object {
  const overlayBgColor =  matColor(theme.background,"selected-button");
  const groupBorderColor = matColor(theme.foreground,"divider");
  const iconColor = matColor(theme.foreground,"icon");
  const bodyBgColor = matColor(theme.background,"card");
  const contentItemGroupHeaderColor =  matColor(theme.foreground,"icon");
  const contentItemHoverBgColor = matColor(theme.background,"app-bar");
  const contentItemTextColor =  matColor(theme.foreground,"text");

  return {
    '.command-palette__overlay': {
      background: overlayBgColor,
    },
    '.command-palette__body': {
      background: bodyBgColor,
    },
    '.command-palette__header': {
      'border-bottom': ' 1px solid ' + groupBorderColor,
    },
    '.command-palette__header-icon': {
      color: iconColor,
    },
    '.command-palette__header-clear-btn': {
      color: iconColor,
    },
    '.command-palette__content-item-group-header': {
      color: contentItemGroupHeaderColor,
    },
    '.command-palette__content-item--selected': {
      background: contentItemHoverBgColor,
    },
    '.command-palette__content-item-text': {
      color: contentItemTextColor,
    },
    '.command-palette__content-item-no-results': {
      color: contentItemTextColor,
    },
  };
}
