import { Theme } from '../interfaces/theme';
import { matColor} from '../mat-color';
import { matFontSize } from '../utils';
import { matFontFamily } from '../utils/mat-font-family';

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
