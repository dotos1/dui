import { Theme } from '../interfaces/theme';
import { matColor } from '../mat-color';
import { matFontSize } from '../utils/index';

export function duiPagingTheme(theme: Theme): Object {
  const foregroundText: string = matColor(theme.foreground, 'secondary-text');

  let config= theme.typography;
  const type: string = config['type'];
  let px10: string = type === 'loose' ? '10px' : type === 'normal' ? '9px' : '8px';
  let px44: string = type === 'loose' ? '44px' : type === 'normal' ? '39px' : '33px';
  let px48: string = type === 'loose' ? '48px !important' : type === 'normal' ? '42px !important' : '42px  !important';

  return {
    'dui-paging-bar': {
      "height": px48,
      "-webkit-tap-highlight-color": foregroundText,
      'color': foregroundText
    },
    "dui-paging-bar mat-select .mat-mdc-select-value": {
      'color': foregroundText
    },
    ".dui-paging-bar [mat-icon-button]": {
      "font-size": matFontSize(config, 'caption')
    },
    ".dui-paging-bar mat-select": {
      "&.mat-mdc-select-trigger": {
        " min-width": px44 + " !important",
        "font-size": matFontSize(config, 'caption')
      }
    }
  }
}
