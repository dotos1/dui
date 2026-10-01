import { Theme } from '../interfaces/theme';
import { matColor } from '../mat-color';
import { matFontSize } from '../utils/index';

export function duiClipboardTheme(theme: Theme): Object {
    return {
        ".dui-copy-tooltip": {
            "background":  matColor(theme.primary),
            "color":  matColor(theme.primary,'default-contrast')+ ' !important',
            "font-size": matFontSize(theme.typography, "caption")
          }
      }
}