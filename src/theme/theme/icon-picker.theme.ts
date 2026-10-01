
import { Theme } from '../interfaces';
import { matColor } from '../mat-color';
import { matThemeElevation } from '../utils/elevation';

export function duiIconPickerTheme(theme: Theme): Object {

  const backgroundCardColor: string = matColor(theme.background, 'card');
  const foregroundText: string = matColor(theme.foreground, 'secondary-text');
  const primaryColor: string = matColor(theme.primary,500);

  return {
    ".icon-picker": {
      "background-color": backgroundCardColor,
      ...matThemeElevation(8, theme, 1)
    },
    ".icon-picker div.icon-grid div button": {
      "border": "1px solid " + backgroundCardColor,
      "background-color": backgroundCardColor
    },
    ".btn-default": {
      "color":foregroundText
    },
    " #icon-button:hover": {
      "color": "1px solid "  +primaryColor
    },
  };
}
