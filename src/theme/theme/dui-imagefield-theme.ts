/**
 * @fileoverview Module `src/theme/theme/dui-imagefield-theme.ts` providing dui imagefield theme definitions and implementation.
 * @zh 模块文件 `src/theme/theme/dui-imagefield-theme.ts`，提供DUIimagefield主题相关的定义与实现。
 */


import { matFontSize, matFontWeight, matFontFamily } from '../utils/index';

import { Theme } from '../interfaces';


/**
 * Executes `duiImageFieldTheme` to handle dui image field theme.
 * @zh 执行 `duiImageFieldTheme`，用于DUI图像字段主题。
 * @param theme - theme parameter (`Theme`) / 主题参数（`Theme`）
 * @returns Result of type `Object` / 类型为 `Object` 的返回值
 */
export function duiImageFieldTheme(theme: Theme): Object {

let config=theme.typography;
  const type: string = theme.typography['type'];
  let px10: string = type === 'loose' ? '10px' : type === 'normal' ? '9px' : '8px';
  let px12: string = type === 'loose' ? '12px' : type === 'normal' ? '11px' : '9px';
  let px24: string = type === 'loose' ? 'px24' : type === 'normal' ? '21px' : '18px';

  return {
    '.dui-image-input': {
      'margin-left': px10
    },
    '.drop-zone': {
      'font-family': matFontFamily(config, 'body-2'),
      'font-size': matFontSize(config, 'body-2'),
      'font-weight': matFontWeight(config, 'body-2')
    },
    '.file-upload-cancel': {
      'height': px24 + " !important",
      'width': px24 + " !important",
      'left': "-" + px12 + " !important",
      " [dir='rtl'] &": {
        'left': -px12 + " !important"
      }
    },
    '.file-upload-cancel  mat-icon': {
      'border-radius': px12 + " !important"
    }
  };
}



