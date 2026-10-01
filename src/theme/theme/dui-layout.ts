import { Theme } from '../interfaces/theme';
import { matColor } from '../mat-color';

export function duiLayoutTheme(theme: Theme): Object {
  const foregroundDivider: string = matColor(theme.foreground, 'divider');
  const backgroundColor: string = matColor(theme.background, 'card');

  return {
    ".dui-split-gutter":{
        "background-color":foregroundDivider
    },
    ".dui-split-area":{
      "background-color":backgroundColor
    },
    ".dui-horizontal > .dui-split-gutter":{
      "border-left": "4px solid "+backgroundColor,
      "border-right": "4px solid "+backgroundColor
    },
    ".dui-horizontal > .dui-split-gutter:hover":{
      "background-color":matColor(theme.foreground, 'secondary-text'),
      "border-left": "4px solid "+matColor(theme.foreground, 'disabled'),
      "border-right": "4px solid "+matColor(theme.foreground, 'disabled')
    },
    ".dui-vertical > .dui-split-gutter":{
      "border-top": "4px solid "+backgroundColor,
      "border-bottom": "4px solid "+backgroundColor
    },
    ".dui-vertical > .dui-split-gutter:hover":{
      "background-color":matColor(theme.foreground, 'secondary-text'),
      "border-top": "4px solid "+matColor(theme.foreground, 'disabled'),
      "border-bottom": "4px solid "+matColor(theme.foreground, 'disabled')
    }
  }
}
