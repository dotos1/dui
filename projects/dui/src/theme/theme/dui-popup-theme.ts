import { Theme } from '../interfaces/theme';
import { matColor } from '../mat-color';

export function duiPopupTheme(theme: Theme): Object {
  return {
    ".resize-icons": {
      "color": matColor(theme.foreground, 'text'),
    },
  }
}
