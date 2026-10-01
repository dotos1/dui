import { Theme } from '../interfaces';
import { matColor } from '../mat-color';

export function duiHttpLoaderTheme(theme: Theme): Object {
  return {
    "#spinner .backdrop":{
      "background-color": matColor(theme.background,"card")
    },
    " .colored-parent,  .colored > div": {
      "background-color": matColor(theme.foreground,"secondary-text")
    }
  };
}
