/**
 * @fileoverview Module `src/theme/theme/toggle-select-theme.ts` providing toggle select theme definitions and implementation.
 * @zh 模块文件 `src/theme/theme/toggle-select-theme.ts`，提供开关下拉选择主题相关的定义与实现。
 */


import { Theme } from '../interfaces';
import { matColor } from '../mat-color';

/**
 * Executes `duiToggleSelectTheme` to handle dui toggle select theme.
 * @zh 执行 `duiToggleSelectTheme`，用于DUI开关下拉选择主题。
 * @param theme - theme parameter (`Theme`) / 主题参数（`Theme`）
 * @returns Result of type `Object` / 类型为 `Object` 的返回值
 */
export function duiToggleSelectTheme(theme: Theme): Object {
  return {
    ".mat-button-toggle-group.mat-button-toggle-group-appearance-standard.toggle-header": {
      "background": matColor(theme.background, 'hover')
    },
    
    ".mat-button-toggle-group.mat-button-toggle-group-appearance-standard.toggle-header.mat-button-toggle.mat-button-toggle-appearance-standard": {
      "background": 'transparent',
      "color": matColor(theme.foreground, 'slider-off-active') 
    },
    ".mat-button-toggle-group.mat-button-toggle-group-appearance-standard.toggle-header.mat-button-toggle.mat-button-toggle-appearance-standard .mat-button-toggle-checked .mat-button-toggle-button": {
        "background": matColor(theme.background, 'background'),
        "color":  matColor(theme.primary, 500),
        "border":" 1px solid "+matColor(theme.primary, 500)
    },
    ".mat-button-toggle-group.mat-button-toggle-group-appearance-standard.toggle-header .mat-button-toggle.mat-button-toggle-appearance-standard.mat-button-toggle-checked .mat-button-toggle-button":{
        background:  matColor(theme.primary, 500),
        color:matColor(theme.background, 'card')
    },
    ".mat-button-toggle-group.mat-button-toggle-group-appearance-standard.tb-toggle-header.tb-fill .mat-button-toggle.mat-button-toggle-appearance-standard.mat-button-toggle-checked .mat-button-toggle-button":{
        background:matColor(theme.primary, 500),
        color:matColor(theme.background, 'card')
    },

    ".mat-button-toggle-group.mat-button-toggle-group-appearance-standard.toggle-header.invert.mat-button-toggle.mat-button-toggle-appearance-standard ":{
      color: matColor(theme.foreground, 'secondary-text') 
    },
   ".mat-button-toggle-group.mat-button-toggle-group-appearance-standard.toggle-header.invert.mat-button-toggle.mat-button-toggle-appearance-standard .mat-button-toggle-checked .mat-button-toggle-button ":{
        background:matColor(theme.background, 'card'),
        color: matColor(theme.primary, 500),
    },

    ".mat-button-toggle-group.mat-button-toggle-group-appearance-standard.toggle-header&.disabled": {
      "background": matColor(theme.background, 'hover')
    },
    ".mat-button-toggle-group.mat-button-toggle-group-appearance-standard.toggle-header&.disabled.mat-button-toggle.mat-button-toggle-appearance-standard": {
      "color": matColor(theme.foreground, 'slider-off')
    },
    ".mat-button-toggle-group.mat-button-toggle-group-appearance-standard.toggle-header&.disabled.mat-button-toggle.mat-button-toggle-appearance-standard &.mat-button-toggle-checked .mat-button-toggle-button": {
        "background": "transparent",
        "color": matColor(theme.foreground, 'slider-off-active'),
        "border-color": matColor(theme.foreground, 'slider-off-active')
    },

    ".mat-button-toggle-group.mat-button-toggle-group-appearance-standard.toggle-header.disabled.fill.mat-button-toggle.mat-button-toggle-appearance-standard &.mat-button-toggle-checked .mat-button-toggle-button": {
         "background": matColor(theme.foreground, 'divider'),
        "color": matColor(theme.foreground, 'slider-off-active'),
        "border": "transparent"
    },
    ".toggle-header-select.mat-mdc-select-arrow &:after": {
         "color": matColor(theme.foreground, 'slider-off-active') 
    }
  };
}



