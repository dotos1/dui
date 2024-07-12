import { Theme } from '../interfaces/theme';
import { matColor } from '../mat-color';

export function duiIconTheme(theme: Theme): Object {
  return {
    ".dui-icon .disable": {
      "color": matColor(theme.foreground, 'disabled')
    },
    ".dui-font-icon .disable": {
      "color": matColor(theme.foreground, 'disabled')
    },
  }
}
