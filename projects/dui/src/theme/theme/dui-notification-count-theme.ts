import { Theme } from '../interfaces/theme';
import { matColor } from '../mat-color';
import {
  matFontFamily,
  addRule
} from '../utils/index';

export function duiNotificationTheme(theme: Theme): Object {
  const primaryColor: string = matColor(theme.primary);
  const warnColor: string = matColor(theme.warn);
  const accent: string = matColor(theme.accent, 'default');
  const primaryDefaultContrast: string = matColor(theme.primary, 'default-contrast');
  const warnDefaultContrast: string = matColor(theme.warn, 'default-contrast');
  const accentDefaultContrast: string = matColor(theme.accent, 'default-contrast');

  let config= theme.typography;
  const type: string = config['type'];
  let px8: string = type === 'loose' ? '8px' : type === 'normal' ? '7px' : '6px';
  let px10: string = type === 'loose' ? '10px' : type === 'normal' ? '9px' : '8px';
  let px20: string = type === 'loose' ? '20px !default' : type === 'normal' ? '18px !default' : '15px !default';
  let px40: string = type === 'loose' ? '40px !default' : type === 'normal' ? '35px !default' : '30px !default';


  return {
    ".dui-notification-count .mat-warn": {
        "background-color": warnColor,
        "color": warnDefaultContrast
    },
    ".dui-notification-count .mat-primary": {
        "background-color": primaryColor,
        "color": primaryDefaultContrast
    },
    ".dui-notification-count .mat-accent": {
        "background-color": accent,
        "color": accentDefaultContrast
    },
    'dui-notification-count': {
      "min-width": px40 + " !important",
      "height": px40 + " !important"
    },
    '.dui-notification-count': {
      'line-height': addRule(px20, 1),
      'width': px20 + " !important",
      'height': px20 + " !important",
      'font-size': px10 + " !important",
      'font-weight': 600,
      'font-family': matFontFamily(config),
      '&.dui-notification-no-count': {
        'width': px8 + " !important",
        'height': px8 + " !important",
        '&.dui-notification-top': {
          'top': px8 + " !important",
        },
        ' &.dui-notification-bottom': {
          'bottom': px8 + " !important"
        },
        '&.dui-notification-before': {
          left: px8 + " !important",
        },
        '&.dui-notification-after': {
          right: px8 + " !important"
        }
      }
    },
    '.dui-notification-content &': {
        'line-height': px40 + " !important"
    }
  }
}
