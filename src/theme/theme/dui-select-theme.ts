import { Theme } from '../interfaces/theme';
import { matColor } from '../mat-color';

export function duiSelectTheme(theme: Theme): Object {
  const foregroundDivider: string = matColor(theme.foreground, 'divider');
  const backgroundColor: string = matColor(theme.background, 'card');

  return {
   ".mat-select-search-inner": {
     " background-color": backgroundColor
  },
  ".mat-select-search-input": {
    "color": matColor(theme.foreground, 'secondary-text'),
    "border":"1px solid "+foregroundDivider +' !important',
    "background-color": backgroundColor
  },
  ".mat-select-search-input::placeholder": {
    color: matColor(theme.foreground, 'secondary-text'),
  }
  }
}
