import { Theme } from '../interfaces/theme';
import { matColor } from '../mat-color';
import { matThemeElevation } from '../utils/elevation';

export function duiInfoDrawerTheme(theme: Theme): Object {
  return {
    ".dui-info-drawer-layout": {
      "background-color": matColor(theme.background, 'card'),
      ...matThemeElevation(1, theme, 1)
    },
    ".dui-info-drawer-layout .mat-mdc-tab-label ": {
      "color": matColor(theme.foreground, 'secondary-text'),
    },
    ".dui-info-drawer-layout .mat-mdc-tab-label-active": {
      "color": matColor(theme.primary, 'default'),
    },
    ".dui-info-drawer-layout-header-title ": {
      color: matColor(theme.foreground, "text", 0.54)
    }
  }
}
