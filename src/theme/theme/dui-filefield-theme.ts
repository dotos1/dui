/**
 * @fileoverview Module `src/theme/theme/dui-filefield-theme.ts` providing dui filefield theme definitions and implementation.
 * @zh 模块文件 `src/theme/theme/dui-filefield-theme.ts`，提供DUIfilefield主题相关的定义与实现。
 */



import { Theme } from '../interfaces';

/**
 * Executes `duiFileFieldTheme` to handle dui file field theme.
 * @zh 执行 `duiFileFieldTheme`，用于DUI文件字段主题。
 * @param theme - theme parameter (`Theme`) / 主题参数（`Theme`）
 * @returns Result of type `Object` / 类型为 `Object` 的返回值
 */
export function duiFileFieldTheme(theme: Theme): Object {

  const type: string = theme.typography['type'];
  let px8: string = type === 'loose' ? '8px' : type === 'normal' ? '7px' : '6px';
  let px10: string = type === 'loose' ? '10px' : type === 'normal' ? '9px' : '8px';
  let px12: string = type === 'loose' ? '12px' : type === 'normal' ? '11px' : '9px';
  let px24: string = type === 'loose' ? 'px24' : type === 'normal' ? '21px' : '18px';

  return {
    '.dui-file-input': {
      'margin-left': px10 + " !important",
      'padding-left': px8 + " !important",
      'padding-right': px8 + " !important",
    },
    '.dui-file-upload': {
      'padding-left': px8 + " !important",
      'padding-right': px8 + " !important",
    },
    '.dui-file-upload-cancel': {
      'height': px24 + " !important",
      "width": px24 + " !important",
      "top": px24 + " !important",
      "left": "-" + px12 + " !important",
      " [dir='rtl'] &": {
        "right": "-" + px12 + " !important"
      },
      "mat-icon": {
        "border-radius": px12 + " !important"
      }
    }
  };
}
