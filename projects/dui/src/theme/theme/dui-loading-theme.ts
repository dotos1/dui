import { Theme } from '../interfaces';
import { matColor,rgba } from '../mat-color';

export function duiLoadingTheme(theme: Theme): Object {
  return {
    ".dui-loading-wrapper .dui-overlay .dui-loading": {
      "background":rgba(matColor(theme.background,'dialog'),0.8) 
    }
  };
}