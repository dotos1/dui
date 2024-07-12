import { Theme } from '../interfaces/theme';
import { matColor } from '../mat-color';
import { matThemeElevation } from '../utils/elevation';

export function duiEditorTheme(theme: Theme): Object {
  return {
    '.Editor__ImageWrapper .Editor__Resizer--Active': {
      border: ' 1px solid ' + matColor(theme.primary),
    },
    '.Editor__ImageWrapper .Editor__ResizeHandle .Editor__ResizeHandle--TL,.Editor__ResizeHandle--BL,.Editor__ResizeHandle--TR,.Editor__ResizeHandle--BR':
      {
        'background-color': matColor(theme.primary),
        border: '1px solid ' + matColor(theme.background, 'card'),
      },
    'ux-bubble': {
      'background-color': matColor(theme.foreground, 'text'),
      color: matColor(theme.background, 'card'),
    },
    '.BubbleMenu__Icon': {
      color: matColor(theme.background, 'card'),
    },
    '.BubbleMenu__Icon :hover': {
      'background-color': matColor(theme.foreground, 'icon'),
    },
    '.BubbleMenu__Icon .BubbleMenu__Icon--Active': {
      'background-color': matColor(theme.background, 'card'),
      color: matColor(theme.foreground, 'text'),
    },
    '.BubbleMenu__Seperator': {
      'border-left': '1px solid ' + matColor(theme.background, 'card'),
    },
    '.Editor': {
      background: 'white',
      color: 'black',
      border: ' 1px solid ' + matColor(theme.foreground, 'divider'),
    },
    '.Editor__Placeholder ::before': {
      color: matColor(theme.foreground, 'secondary-text'),
    },
    '.Editor__Wrapper': {
      border: ' 1px solid ' + matColor(theme.foreground, 'divider'),
    },
    '.Editor__Wrapper .Editor__MenuBar': {
      'border-bottom': '1px solid ' + matColor(theme.foreground, 'divider'),
    },
    '.Editor__MenuBar': {
      'background-color': matColor(theme.background, 'card'),
    },
    '.Editor__MenuItem :hover': {
      'background-color': matColor(theme.background, 'selected-button'),
    },
    '.Editor__MenuItem :hover .Editor__MenuItem--Active,.Editor__MenuItem--Active':
      {
        'background-color': matColor(theme.background, 'selected-button'),
        color: matColor(theme.foreground, 'secondary-text'),
      },
    '.Editor__Dropdown  :hover': {
      'background-color': matColor(theme.background, 'selected-button'),
    },
    '.Editor__Dropdown  .Editor__Dropdown--DropdownMenu': {
      ...matThemeElevation(4, theme, 1),
      'background-color': matColor(theme.background, 'card'),
    },
    '.Editor__Dropdown  .Editor__Dropdown--Item :hover': {
      'background-color': matColor(theme.background, 'selected-button'),
    },
    '.Editor__Dropdown  .Editor__Dropdown--Selected,.Editor__Dropdown--Open': {
      color: matColor(theme.foreground, 'secondary-text'),
      'background-color': matColor(theme.background, 'selected-button'),
    },
    '.Editor__Dropdown  .Editor__Dropdown--Active': {
      'background-color': matColor(theme.background, 'selected-button'),
    },
    '.Editor__Dropdown  .Editor__Dropdown--Active :hover': {
      'background-color': matColor(theme.background, 'selected-button'),
    },
    '.Editor__Popup': {
      ...matThemeElevation(4, theme, 1),
      'background-color': matColor(theme.background, 'card'),
    },
    '.Editor__Seperator': {
      'border-left': ' 1px solid ' + matColor(theme.foreground, 'divider'),
    },
    ' .Editor__HelpText .Editor__HelpText--Error': {
      color: matColor(theme.warn),
    },
  };
}
