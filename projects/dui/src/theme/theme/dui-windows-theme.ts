import { Theme } from '../interfaces/theme';
import { matColor } from '../mat-color';

export function duiWindowsTheme(theme: Theme): Object {
  const primaryDefaultContrast: string = matColor(theme.primary, 'default-contrast');
  return {
    '.window': {
      'color': matColor(theme.foreground, 'text') + "!important",
      'border': "5px solid " + matColor(theme.primary, 800, 0.9) + "!important",
      'background': matColor(theme.background, 'dialog') + "!important",
    },
    '.window-header': {
      'background-color': matColor(theme.primary, 800, 0.9) + "!important",
      'border-bottom': matColor(theme.foreground, 'divider') + "!important",
      'color': primaryDefaultContrast + "!important",
    },
    '.window-titletext': {
      'color': primaryDefaultContrast + "!important",
    },
    '.ui-btn': {
      'color': primaryDefaultContrast + "!important",
    },
    '.window .window-sidebar': {
      'background': matColor(theme.background, 'dialog') + "!important",
    },
    '.window .window-view-pane .window-content': {
      'background': matColor(theme.background, 'dialog') + "!important",
      'color': primaryDefaultContrast + "!important"
    }
  }
}
