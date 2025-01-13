import { Theme } from '../interfaces/theme';
import { matColor } from '../mat-color';
import { matThemeElevation } from '../utils/elevation';

export function duiToolbarTheme(theme: Theme): Object {
  return {
    ".toolbar": {
      "background-color":  matColor(theme.background, 'card'),
      "color": matColor(theme.foreground, 'icons')
    },
    ".toolbar-horizontal": {
      ...matThemeElevation(1, theme, 1)
    },
    ".dui-separator": {
      "border-left": "1px solid "+ matColor(theme.foreground, 'divider'),
      "border-left-color": matColor(theme.foreground, 'divider'),
    },
    "divider": {
      " border-left":" 1px solid "+matColor(theme.foreground, 'divider'),
      " border-left-color":matColor(theme.foreground, 'divider'),
    }
  }
}
