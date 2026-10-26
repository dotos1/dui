/**
 * @fileoverview Module `src/theme/theme/dock-layout-host-theme.ts` providing dock layout host theme definitions and implementation.
 * @zh 模块文件 `src/theme/theme/dock-layout-host-theme.ts`，提供停靠面板布局宿主主题相关的定义与实现。
 */

import { Theme } from '../interfaces';
import { matColor } from '../mat-color';
import { matThemeElevation } from '../utils/elevation';

/**
 * Executes `dockLayoutTheme` to handle dock layout theme.
 * @zh 执行 `dockLayoutTheme`，用于停靠面板布局主题。
 * @param theme - theme parameter (`Theme`) / 主题参数（`Theme`）
 * @returns Result of type `Object` / 类型为 `Object` 的返回值
 */
export function dockLayoutTheme(theme: Theme): Object {
  return {
    '.lm_docklayout': {
      background: matColor(theme.background, 'card'),
    },
    '.lm_content': {
      background: matColor(theme.background, 'card'),
    },
    ".lm_header":{
      'border-bottom': '1px solid ' + matColor(theme.foreground, 'divider'),
    },
    '.lm_dragProxy .lm_content': {
      ...matThemeElevation(4, theme, 1),
    },
    '.lm_dropTargetIndicator': {
      'box-shadow': ' inset 0 0 30px ' + matColor(theme.background, 'card'),
      outline: '1px dashed ' + matColor(theme.primary, 300),
    },
    '.lm_dropTargetIndicator .lm_inner': {
      background: matColor(theme.background, 'card'),
    },
    '.lm_splitter': {
      background: matColor(theme.foreground, 'divider'),
    },
    '.lm_splitter :hover .lm_dragging': {
      background: matColor(theme.foreground, 'divider'),
    },
    '.lm_header .lm_controls': {
      background: matColor(theme.background, 'card'),
    },
    '.lm_header .lm_tab': {
      color: matColor(theme.foreground, 'text'),
      background: matColor(theme.background, 'card'),
    },
    '.lm_header .lm_tab.lm_active': {
       "border-bottom":" 2px solid "+matColor(theme.primary, 500),
    },
    '.lm_header .lm_tab.lm_focused': {
      "border-bottom":" 2px solid "+matColor(theme.accent, 500),
     },
    '.lm_dragProxy.lm_bottom,.lm_stack.lm_bottom .lm_header .lm_tab': {
      ...matThemeElevation(5, theme, 1),
    },
    '.lm_dragProxy.lm_bottom,.lm_stack.lm_bottom .lm_header .lm_tab .lm_active':
      {
        'box-shadow': '0 2px 2px ' + matColor(theme.background, 'card'),
      },
    '.lm_selected .lm_header': {
      'background-color': matColor(theme.accent, 500),
    },
    '.lm_tab :hover .lm_active': {
      background: matColor(theme.background, 'card', 0.3),
      color: matColor(theme.primary, 500),
    },
    '.lm_header .lm_controls .lm_tabdropdown:before': {
      color: matColor(theme.foreground, 'text'),
    },
    '.lm_maximised .lm_header': {
      'background-color': matColor(theme.background, 'card'),
    },
    '.lm_transition_indicator': {
      'background-color': matColor(theme.background, 'card'),
      border: '1px dashed ' + matColor(theme.foreground, 'divider'),
    },
    '.lm_popin .lm_bg': {
      background: matColor(theme.foreground, 'text'),
    },
    '.lm_popin .lm_icon': {
      'border-left': '1px solid ' + matColor(theme.foreground, 'divider'),
      'border-top': '1px solid ' + matColor(theme.foreground, 'divider'),
    },
  };
}
