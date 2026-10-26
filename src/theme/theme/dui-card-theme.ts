/**
 * @fileoverview Module `src/theme/theme/dui-card-theme.ts` providing dui card theme definitions and implementation.
 * @zh 模块文件 `src/theme/theme/dui-card-theme.ts`，提供DUI卡片主题相关的定义与实现。
 */


import { Theme } from '../interfaces';


/**
 * Executes `duiCardTheme` to handle dui card theme.
 * @zh 执行 `duiCardTheme`，用于DUI卡片主题。
 * @param theme - theme parameter (`Theme`) / 主题参数（`Theme`）
 * @returns Result of type `Object` / 类型为 `Object` 的返回值
 */
export function duiCardTheme(theme: Theme): Object {
  const type: string = theme.typography['type'];
  let px80: string = type === 'loose' ? '140px' : type === 'normal' ? '130px' : '120px';
  let px100: string = type === 'loose' ? '140px' : type === 'normal' ? '130px' : '120px';
  let px120: string = type === 'loose' ? '150px' : type === 'normal' ? '150px' : '150px';

  return {
    '.rightbottom': {
      "position":"absolute",
      bottom: px120 + " !important",
      right: px80 + " !important",
    },
    '.righttop': {
      "position":"absolute",
      top: px100 + " !important",
      right: px80 + " !important",
    }
  };
}
