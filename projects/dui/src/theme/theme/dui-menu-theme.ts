import { Theme } from '../interfaces/theme';
import { matColor } from '../mat-color';

export function duiMenuTheme(theme: Theme): Object {
  return {
    ".menu-bar-item-menu-item--command": {
      "color": matColor(theme.foreground, 'icons')
    },
  }
}
