

import { Theme } from '../interfaces';
import { matColor, rgba } from '../mat-color';
import { matThemeElevation } from '../utils/elevation';

export function duiDragselectTheme(theme: Theme): Object {
  const primary = matColor(theme.primary);
  let selectBoxColor = primary;
  let selectBoxBorderSize = " 2px";
  let selectBoxRemovingColor = primary ;
  let selectedItemBorderColor = matColor(theme.foreground, 'disabled-button');
  let selectedItemBorderSize = " 1px";
  let rangeStartBorderColor = matColor(theme.foreground, 'disabled-button');

  return {
    ".dts-no-select": {
      "user-select": "none"
    },
    ".dts-select-box": {
      "background": rgba(selectBoxColor, 0.3),
      "border": selectBoxBorderSize + " solid " + selectBoxColor,
      "color": selectBoxColor,
    },
    ".dts-select-box .dts-removing": {
      "background": rgba(selectBoxRemovingColor, 0.3),
      "border": selectBoxBorderSize + " solid " + selectBoxRemovingColor
    },
    ".dts-select-container:not(.dts-custom) .dts-select-item.selected": {
      "border": selectedItemBorderSize + " solid " + selectedItemBorderColor,
      ...matThemeElevation(4, theme, 1)
    },
    ".dts-select-container:not(.dts-custom) .dts-select-item.dts-range-start": {
      "border": "1px solid " + rangeStartBorderColor
    }
  }
}