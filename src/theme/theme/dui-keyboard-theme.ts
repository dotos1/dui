import { Theme } from '../interfaces';
import { matColor } from '../mat-color';
import { matThemeElevation } from '../utils/elevation';

export function duiKeyBoardTheme(theme: Theme): Object {
  return {
    ".key": {
      "border": "1px solid "+matColor(theme.foreground,'divider'),
      "background-color": matColor(theme.background,'background')
    },
    ".help-modal .title":{
      "color": matColor(theme.foreground,'text')
    },
    ".help-modal .help-modal__body":{
      "color": matColor(theme.foreground,'secondary-text')
    },
    ".item": {
      "background-color": matColor(theme.background,'background')
    },
    ".description": {
      "color": matColor(theme.foreground,'secondary-text')
    },
    ".item--odd": {
      "background-color": matColor(theme.background,'card')
    },
    ".help-modal": {
      ...matThemeElevation(6, theme, 1),
      "background": matColor(theme.background,'card')
    },
    ".help-modal__backdrop": {
      "background": matColor(theme.foreground,'disabled-button') 
    }
  };
}