/**
 * @fileoverview Module `src/common/search-box/search-box.theme.ts` providing search box theme definitions and implementation.
 * @zh 模块文件 `src/common/search-box/search-box.theme.ts`，提供搜索盒子容器主题相关的定义与实现。
 */


import { Theme } from '@dotos1/dui/theme';

/**
 * Executes `dotosSearchBoxTheme` to handle dotos search box theme.
 * @zh 执行 `dotosSearchBoxTheme`，用于DotOS搜索盒子容器主题。
 * @param theme - theme parameter (`Theme`) / 主题参数（`Theme`）
 * @returns Result of type `Object` / 类型为 `Object` 的返回值
 */
export function dotosSearchBoxTheme(theme: Theme): Object {
  const typography=theme. typography;
  const type: string = typography['type'];
  let px16: string = type === 'loose' ? '16px' : type === 'normal' ? '14px' : '12px';

  return {
    " .mat-mdc-form-field": {
      "--mat-form-field-container-vertical-padding": px16 +" !important"
    }
  };
}

