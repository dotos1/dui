/**
 * @fileoverview Module `src/theme/theme/dui-layout.ts` providing dui layout definitions and implementation.
 * @zh 模块文件 `src/theme/theme/dui-layout.ts`，提供DUI布局相关的定义与实现。
 */

import { Theme } from '../interfaces/theme';
import { matColor, mix } from '../mat-color';

/**
 * Executes `duiLayoutTheme` to handle dui layout theme.
 * @zh 执行 `duiLayoutTheme`，用于DUI布局主题。
 * @param theme - theme parameter (`Theme`) / 主题参数（`Theme`）
 * @returns Result of type `Object` / 类型为 `Object` 的返回值
 */
export function duiLayoutTheme(theme: Theme): Object {
  const foregroundDivider: string = mix(theme.foreground.base, theme.background.card, 0.12);
  const backgroundColor: string = matColor(theme.background, 'card');

  return {
    ".dui-split-gutter":{
        "background-color":foregroundDivider
    },
    ".dui-split-gutter-icon":{
        "background-color":foregroundDivider
    },
    ".dui-split-area":{
      "background-color":backgroundColor
    },
    ".dui-horizontal > .dui-split-gutter":{
      "border-left": "4px solid "+backgroundColor,
      "border-right": "4px solid "+backgroundColor
    },
    ".dui-horizontal > .dui-split-gutter:hover":{
      "background-color":matColor(theme.foreground, 'secondary-text'),
      "border-left": "4px solid "+matColor(theme.foreground, 'disabled'),
      "border-right": "4px solid "+matColor(theme.foreground, 'disabled')
    },
    ".dui-vertical > .dui-split-gutter":{
      "border-top": "4px solid "+backgroundColor,
      "border-bottom": "4px solid "+backgroundColor
    },
    ".dui-vertical > .dui-split-gutter:hover":{
      "background-color":matColor(theme.foreground, 'secondary-text'),
      "border-top": "4px solid "+matColor(theme.foreground, 'disabled'),
      "border-bottom": "4px solid "+matColor(theme.foreground, 'disabled')
    }
  }
}
