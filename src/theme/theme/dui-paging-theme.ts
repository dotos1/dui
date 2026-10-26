/**
 * @fileoverview Module `src/theme/theme/dui-paging-theme.ts` providing dui paging theme definitions and implementation.
 * @zh 模块文件 `src/theme/theme/dui-paging-theme.ts`，提供DUI页面主题相关的定义与实现。
 */

import { Theme } from '../interfaces/theme';
import { matColor } from '../mat-color';
import { matFontSize } from '../utils/index';

/**
 * Executes `duiPagingTheme` to handle dui paging theme.
 * @zh 执行 `duiPagingTheme`，用于DUI页面主题。
 * @param theme - theme parameter (`Theme`) / 主题参数（`Theme`）
 * @returns Result of type `Object` / 类型为 `Object` 的返回值
 */
export function duiPagingTheme(theme: Theme): Object {
  const foregroundText: string = matColor(theme.foreground, 'secondary-text');

  let config= theme.typography;
  const type: string = config['type'];
  let px10: string = type === 'loose' ? '10px' : type === 'normal' ? '9px' : '8px';
  let px44: string = type === 'loose' ? '44px' : type === 'normal' ? '39px' : '33px';
  let px48: string = type === 'loose' ? '48px !important' : type === 'normal' ? '42px !important' : '42px  !important';

  return {
    'dui-paging-bar': {
      "height": px48,
      "-webkit-tap-highlight-color": foregroundText,
      'color': foregroundText
    },
    "dui-paging-bar mat-select .mat-mdc-select-value": {
      'color': foregroundText
    },
    ".dui-paging-bar [mat-icon-button]": {
      "font-size": matFontSize(config, 'caption')
    },
    ".dui-paging-bar mat-select": {
      "&.mat-mdc-select-trigger": {
        " min-width": px44 + " !important",
        "font-size": matFontSize(config, 'caption')
      }
    }
  }
}
