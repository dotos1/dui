import { Theme } from '../interfaces/theme';
import { matColor } from '../mat-color';

export function duiMenubarTheme(theme: Theme): Object {
  return {
    ".dui-menubar": {
      "background": matColor(theme.background, 'card'),
      "color":  matColor(theme.foreground, 'text')
    },
  }
}
