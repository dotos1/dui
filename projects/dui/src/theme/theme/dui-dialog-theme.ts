
import { Theme } from '../interfaces';

export function duiDialogTheme(theme: Theme): Object {
  const type: string = theme.typography['type'];

  let px8: string = type === 'loose' ? '8px' : type === 'normal' ? '7px' : '6px';
  let px16: string = type === 'loose' ? '16px' : type === 'normal' ? '14px' : '12px';
  let px20: string = type === 'loose' ? '20px' : type === 'normal' ? '18px' : '15px';
  let px64: string = type === 'loose' ? '64px' : type === 'normal' ? '56px' : '48px';

  return {
    '.dui-dialog-title': {
      'margin-bottom': px20 + " !important",
    },
    '.dui-dialog-content': {
      'margin-bottom': px16 + " !important"
    },
    '.dui-dialog-actions': {
      'top': px16 + " !important",
      'left': px16 + " !important",
      " [dir='rtl'] &": {
        'right': px16 + " !important"
      },
      ' button': {
        'margin-left': px8 + " !important",
        "[dir='rtl'] &": {
          'margin-right': px8 + " !important",
        },
        'padding-left': px8 + " !important",
        'padding-right': px8 + " !important",
        'min-width': px64 + " !important"
      }
    },
  };
}





