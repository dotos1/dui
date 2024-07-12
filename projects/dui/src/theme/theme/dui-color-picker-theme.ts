import { Theme } from '../interfaces/theme';
import { matColor } from '../mat-color';
import { matThemeElevation } from '../utils/elevation';

export function duiColorPickerTheme(theme: Theme): Object {
  return {
    ".color-picker":{
      'background-color':  matColor(theme.background, 'card'),
    },
    ".color-picker-menu  .views":{
      "background": matColor(theme.foreground, 'secondary-text'),
    },
    ".color-picker-menu .mat-mdc-menu-content .views":{
      "background": matColor(theme.background, 'card'),
    },
    ".alpha-slider": {
      ...matThemeElevation(2, theme, 1),
      "background":  matColor(theme.background, 'card'),
    },
    ".shade-slider": {
      ...matThemeElevation(2, theme, 1),
      "background":  matColor(theme.background, 'card')
    },
    ".mat-picker-popup":{
      ...matThemeElevation(8, theme, 1),
      "background":  matColor(theme.background, 'card')
    },
    ".color-input-label":{
      "color": matColor(theme.foreground, 'text')
    },
    ".chrome-picker": {
      ...matThemeElevation(4, theme, 1),
    },
    ".chrome-active": {
      ...matThemeElevation(1, theme, 1),
    },
    ".docs-gm .goog-menu": {
       ...matThemeElevation(3, theme, 1),
    },
    ".goog-menu": {
      ...matThemeElevation(4, theme, 1),
      "background": matColor(theme.background, 'card'),
      "border":" 1px solid "+ matColor(theme.foreground, 'divider')
    },
    ".docs-gm .docs-colormenuitems .docs-colormenuitems-scheme-header,.docs-gm .docs-colormenuitems .docs-colormenuitems-custom-header": {
      "color": matColor(theme.foreground, 'icon'),
    },
    ".color-picker-content": {
      "background-color": matColor(theme.background, 'card')
    },
    ".docs-gm .goog-menuitem-highlight": {
      "background-color":  matColor(theme.background, 'card')
    },
    ".docs-gm .goog-menuitem": {
      "color": matColor(theme.foreground, 'secondary-text')
    },
    ".goog-menuitem-highlight,.goog-menuitem-hover": {
      "background-color": matColor(theme.background, 'selected-button'),
      "border-color": matColor(theme.background, 'selected-button'),
    },
    ".goog-menuitem,.goog-tristatemenuitem,.goog-filterobsmenuitem": {
      "color": matColor(theme.foreground, 'secondary-text')
    },
    ".goog-menuitem-highlight .goog-menuitem-content,.goog-menuitem-hover .goog-menuitem-content": {
      "color": matColor(theme.foreground, 'secondary-text')
    },
    ".docs-material-colorpalette-colorswatch.docs-material-colorpalette-colorswatch-border,.docs-material-colorpalette-colorswatch-translucent-wrapper.docs-material-colorpalette-colorswatch-border .docs-material-colorpalette-colorswatch-overlay": {
      "border": "1px solid "+matColor(theme.foreground, 'divider')
    },
    ".docs-gm .goog-menuseparator": {
      "border-top":" 1px solid "+matColor(theme.foreground, 'divider')
    },
    ".goog-menuseparator": {
     "border-top":" 1px solid "+matColor(theme.foreground, 'divider')
    }, 
    ".goog-menuitem.colormenuitems-no-color": {
      "border":" 1px solid "+matColor(theme.foreground, 'divider')
    }
  }
}
