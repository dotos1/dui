import { Theme } from '../interfaces/theme';
import { matColor } from '../mat-color';

export function duiTopbarTheme(theme: Theme): Object {
  return {
    ".dui-topbar .mat-toolbar": {
      "border": "1px solid "+ matColor(theme.foreground, 'text', 0.07),
      "color": matColor(theme.foreground, 'text', 0.54)
    }
  }
}
