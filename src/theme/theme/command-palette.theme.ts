import { Theme } from '../interfaces';
import { matColor } from '../mat-color';

export function CommandPaletteTheme(theme: Theme): Object {
  const overlayBgColor =  matColor(theme.background,"selected-button");
  const groupBorderColor = matColor(theme.foreground,"divider");
  const iconColor = matColor(theme.foreground,"icon");
  const bodyBgColor = matColor(theme.background,"card");
  const contentItemGroupHeaderColor =  matColor(theme.foreground,"icon");
  const contentItemHoverBgColor = matColor(theme.background,"app-bar");
  const contentItemTextColor =  matColor(theme.foreground,"text");

  return {
    '.command-palette__overlay': {
      background: overlayBgColor,
    },
    '.command-palette__body': {
      background: bodyBgColor,
    },
    '.command-palette__header': {
      'border-bottom': ' 1px solid ' + groupBorderColor,
    },
    '.command-palette__header-icon': {
      color: iconColor,
    },
    '.command-palette__header-clear-btn': {
      color: iconColor,
    },
    '.command-palette__content-item-group-header': {
      color: contentItemGroupHeaderColor,
    },
    '.command-palette__content-item--selected': {
      background: contentItemHoverBgColor,
    },
    '.command-palette__content-item-text': {
      color: contentItemTextColor,
    },
    '.command-palette__content-item-no-results': {
      color: contentItemTextColor,
    },
  };
}
