import { Theme } from '../interfaces/theme';
import { matColor } from '../mat-color';

export function duiPanelTheme(theme: Theme): Object {
  const foregroundDivider: string = matColor(theme.foreground, 'divider');
  const backgroundColor: string = matColor(theme.background, 'card');
  const foregroundIcon: string = matColor(theme.foreground, 'icon');
  const background: string = matColor(theme.background, 'status-bar');

  return {
    ".split-gutter":{
        "background-color":foregroundDivider
    },
    ".Resizer": {
        "background": backgroundColor
    },
    ".Resizer .horizontal": {
        "border-top": "5px solid "+backgroundColor,
        "border-bottom":" 5px solid "+backgroundColor
    },
    ".Resizer .horizontal:hover": {
        "border-top": "5px solid "+foregroundIcon,
        "border-bottom":" 5px solid "+foregroundIcon
    },
    ".Resizer .vertical": {
        "border-left":" 5px solid "+backgroundColor,
        "border-right": "5px solid "+backgroundColor
    },
    ".Resizer .vertical:hover": {
        "border-left": "5px solid "+foregroundIcon,
        "border-right": "5px solid "+foregroundIcon
    },
    ".vertical header": {
        "background": background,
    },
    ".vertical footer": {
        "background": background
    },
    ".horizontal header": {
        background: background
    },
    ".horizontal footer": {
        background: background
    }
  }
}
