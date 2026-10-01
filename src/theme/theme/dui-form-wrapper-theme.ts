import { Theme } from '../interfaces/theme';
import { matColor } from '../mat-color';
import { matThemeElevation } from '../utils/elevation';

export function duiFormWrapperTheme(theme: Theme): Object {
  return {
    ".error-container": {
      "background": matColor(theme.background, 'background'),
      "color":matColor(theme.foreground, 'text'),
      ...matThemeElevation(1, theme, 1)
    },
    ".add-button .mat-icon": {
        "background": matColor(theme.foreground, 'text')
    },
    ".delete-button .mat-icon": {
      "background": matColor(theme.foreground, 'secondary-text')
  }
  }
}
