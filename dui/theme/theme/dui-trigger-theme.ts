
import { Theme } from '../interfaces';
import { matColor } from '../mat-color';

export function duiTriggerTheme(theme: Theme): Object {
  return {
    ".trigger-field-button": {
      "color": matColor(theme.foreground, 'icon')
    },
    ".trigger-field-button :focus": {
        "background-color":  matColor(theme.background, 'focused-button') 
    },
    ".trigger-field-button .trigger-field-disabled": {
        "color": matColor(theme.foreground, 'disabled-text') 
    }
  };
}

