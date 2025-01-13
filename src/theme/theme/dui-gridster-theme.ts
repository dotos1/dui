import { Theme } from '../interfaces/theme';
import { matColor } from '../mat-color';
import { matGrey } from '../palettes/mat-grey';
import { matThemeElevation } from '../utils/elevation';

export function duiGridsterTheme(theme: Theme): Object {

  return {
    "gridster": {
      "background": matColor(theme.background, 'background')
    },
    "gridster .gridster-column": {
      "border-left":" 1px solid "+matColor(theme.background, 'card'),
      "border-right": "1px solid "+matColor(theme.background, 'card')
    },
   "gridster .gridster-row": {
     " border-top":" 1px solid "+matColor(theme.background, 'card'),
      "border-bottom":" 1px solid "+matColor(theme.background, 'card')
    },
    "gridster-item": {
      "background": matColor(theme.background, 'card')
    },
    "gridster-item.gridster-item-resizing, gridster-item.gridster-item-moving":{
      ...matThemeElevation(8, theme, 1)
    },
    "gridster-item:hover .gridster-item-resizable-handler.handle-se":{
      "border-color":" transparent transparent "+matColor(matGrey, 700, 0.9)
    },
    "gridster-preview": {
      "background": matColor(theme.foreground, 'divider')
    }
  }
}
