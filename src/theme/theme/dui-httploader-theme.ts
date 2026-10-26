/**
 * @fileoverview Module `src/theme/theme/dui-httploader-theme.ts` providing dui httploader theme definitions and implementation.
 * @zh 模块文件 `src/theme/theme/dui-httploader-theme.ts`，提供DUIhttploader主题相关的定义与实现。
 */

import { Theme } from '../interfaces';
import { matColor } from '../mat-color';

/**
 * Executes `duiHttpLoaderTheme` to handle dui http loader theme.
 * @zh 执行 `duiHttpLoaderTheme`，用于DUIHTTP加载器主题。
 * @param theme - theme parameter (`Theme`) / 主题参数（`Theme`）
 * @returns Result of type `Object` / 类型为 `Object` 的返回值
 */
export function duiHttpLoaderTheme(theme: Theme): Object {
  return {
    "#spinner .backdrop":{
      "background-color": matColor(theme.background,"card")
    },
    " .colored-parent,  .colored > div": {
      "background-color": matColor(theme.foreground,"secondary-text")
    }
  };
}
