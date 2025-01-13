import { Theme } from '../interfaces';
import { matColor } from '../mat-color';

export function duiLinkPreviewTheme(theme: Theme): Object {
  return {
    ".link-preview-container .og-link-preview": {
      "background-color":matColor(theme.background,'background')
    },
    ".link-preview-container .og-link-preview &:hover": {
      "background-color":matColor(theme.background,'app-bar')
    }
  };
}
