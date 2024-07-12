import { Theme } from '../interfaces/theme';
import { matColor } from '../mat-color';

export function duiExpansionPanelTheme(theme: Theme): Object {
  const foregroundText: string = matColor(theme.foreground, 'text');
  let config= theme.typography;
  const type: string = config['type'];
  let px8: string = type === 'loose' ? '8px' : type === 'normal' ? '7px' : '6px';
  let px16: string = type === 'loose' ? '16px' : type === 'normal' ? '14px' : '12px';
  let px24: string = type === 'loose' ? '24px' : type === 'normal' ? '21px' : '18px';

  return {
    '.expansion-panel': {
      background: matColor(theme.background, 'card'),
      color: foregroundText
    },
    '.mat-action-row': {
      'border-top-color': matColor(theme.foreground, 'divider')
    },
    // '.expansion-panel:not(.mat-expanded) .expansion-panel-header:not([aria-disabled=\'true\']) .cdk-keyboard-focused, .cdk-program-focused, :hover ': {
    //   background: matColor(theme.background, 'hover')
    // },
    '.expansion-panel-header-title': {
      color: foregroundText
    },
    '.expansion-panel-header-description, .dui-expansion-indicator::after': {
      color: matColor(theme.foreground, 'secondary-text')
    },
    '.expansion-panel-header[aria-disabled=\'true\']': {
      color: matColor(theme.foreground, 'disabled-button'),
    },
    '.expansion-panel-header[aria-disabled=\'true\'] .expansion-panel-header-title, .expansion-panel-header-description': {
      color: 'inherit'
    },
    '.expansion-panel-header': {
      "padding": " 0 " + px24 + " !important"
    },
    ".expansion-panel-header-title,.expansion-panel-header-description": {
      "margin-right": px16 + " !important",
      "[dir='rtl'] &": {
        " margin-left": px16 + " !important",
      }
    },
    ".expansion-panel-body": {
      "padding": " 0 " + px24 + " " + px16 + " !important"
    },
    ".expansion-panel-spacing": {
      "margin": px16 + " 0" + " !important"
    },
    ".dui-action-row": {
      "padding": px16 + " " + px8 + " " + px16 + " " + px24 + " !important",
      "button.dui-button": {
        "margin-left": px8 + " !important",
        "[dir='rtl'] &": {
          "margin-right": px8 + " !important"
        }
      }
    },
    ".dui-action-row  button.dui-button": {
      "margin-left": px8 + " !important",
      "[dir='rtl'] &": {
        "margin-right": px8 + " !important"
      }
    }
  };
}
