/**
 * @fileoverview Module `src/theme/theme/dui-message-theme.ts` providing dui message theme definitions and implementation.
 * @zh 模块文件 `src/theme/theme/dui-message-theme.ts`，提供DUI消息主题相关的定义与实现。
 */

import { Theme } from '../interfaces/theme';
import { matColor} from '../mat-color';
import { matFontSize } from '../utils';
import { matFontFamily } from '../utils/mat-font-family';

/**
 * Executes `duiMessageTheme` to handle dui message theme.
 * @zh 执行 `duiMessageTheme`，用于DUI消息主题。
 * @param theme - theme parameter (`Theme`) / 主题参数（`Theme`）
 * @returns Result of type `Object` / 类型为 `Object` 的返回值
 */
export function duiMessageTheme(theme: Theme): Object {
  const primaryColor: string = matColor(theme.primary);
  const warnColor: string = matColor(theme.warn);
  const accentColor: string = matColor(theme.accent, 'default');

  let config= theme.typography;
  const type: string = config['type'];
  let px8: string = type === 'loose' ? '8px' : type === 'normal' ? '7px' : '6px';
  let px16: string = type === 'loose' ? '16px' : type === 'normal' ? '14px' : '12px';
  let px52: string = type === 'loose' ? '52px' : type === 'normal' ? '46px' : '40px';


  return {
    ".dui-message .mat-warn": {
        "background-color": matColor(theme.warn, 0.15),
        "color": warnColor
    },
    ".dui-message .mat-primary": {
        "background-color": matColor(theme.primary, 0.15),
        "color": primaryColor
    },
    ".dui-message .mat-accent": {
        "background-color": matColor(theme.accent, 0.15),
        "color": accentColor
    },
    ".dui-message-label font": {
      "family": matFontFamily(config),
      "size": matFontSize(config, 'body-2'),
      "weight": "600",
    },
    ".dui-message-label": {
     "line-height": matFontSize(config, 'body-2')
    },
    ".dui-message-sublabel font": {
      "family":matFontFamily(config),
      "size": matFontSize(config, 'body-1') 
    },
    '.dui-message-wrapper': {
      'padding': px8 + " " + px16 + " !important",
      'min-height': px52 + " !important"
    },
    '.dui-message-icon': {
      'margin-right': px16 + " !important",
    }
  }
}
