
import { matColor, Theme } from '@dotos/dui/theme';

export function duiDialogTheme(theme: Theme): Object {
  return {
    " .resize-icons": {
           "color": matColor(theme.foreground, 'icon')
    }
  };
}

