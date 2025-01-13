

import { Theme } from '../interfaces';

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
