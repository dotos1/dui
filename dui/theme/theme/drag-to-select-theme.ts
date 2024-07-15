

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
      "contain": "layout",
      "transform": "translateZ(0)",
      "box-sizing": "border-box",
      "color": selectBoxColor,
      "position": "absolute",
      "left": 0,
      "top": 0,
      "width": 0,
      "height": 0,
      "pointer-events": "none",
      "opacity": 0,
      "z-index": 1
    },
    ".dts-select-box &.dts-removing": {
      background: rgba(selectBoxRemovingColor, 0.3),
      border: selectBoxBorderSize + " solid " + selectBoxRemovingColor
    },

    ".dts-select-container:not(.dts-custom) .dts-select-item.selected": {
      "border": selectedItemBorderSize + " solid " + selectedItemBorderColor,
      ...matThemeElevation(8, theme, 1)
    },
    ".dts-select-container:not(.dts-custom) .dts-select-item.dts-range-start": {
      "border": "1px solid " + rangeStartBorderColor
    }
  }
}
