
import { Theme } from '../interfaces';
import { matColor,rgba } from '../mat-color';

export function duiLineStyleTheme(theme: Theme): Object {
  return {
    "mat-option:nth-child(even)": {
     " background-color": matColor(theme.background,"card")
    },
    "mat-option:nth-child(odd)": {
     " background-color":rgba(matColor(theme.background,"card"), 0.08)
    },
    ".line-size-row": {
      "border": "1px solid "+matColor(theme.foreground,"icon")
    },
    ".SOLID":{
      "border": "1px solid "+matColor(theme.foreground,"icon")
    },
    ".DOT":{
      "border": "1px solid "+matColor(theme.foreground,"icon")
    },
    ".DASH":{
      "border": "1px solid "+matColor(theme.foreground,"icon")
    },
    ".DASH_DOT":{
      "border": "1px solid "+matColor(theme.foreground,"icon")
    },
    ".DASH_DOT_DOT":{
      "border": "1px solid "+matColor(theme.foreground,"icon")
    }
  };
}