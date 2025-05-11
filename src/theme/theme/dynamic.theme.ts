import { Theme } from '../interfaces/theme';
import { matColor } from '../mat-color';

export function duiDynamicComponentTheme(theme: Theme): Object {
  const secondaryText: string = matColor(theme.foreground, 'secondary-text');

  return {
    '.foreground-base': {
      color: matColor(theme.foreground, 'base'),
    },
    '.foreground-divider': {
      color: matColor(theme.foreground, 'divider'),
    },
    '.foreground-dividers': {
      color: matColor(theme.foreground, 'dividers'),
    },
    '.foreground-disabled': {
      color: matColor(theme.foreground, 'disabled'),
    },
    '.foreground-disabled-button': {
      color: matColor(theme.foreground, 'disabled-button'),
    },
    '.foreground-disabled-text': {
      color: matColor(theme.foreground, 'disabled-text'),
    },
    '.foreground-hint-text': {
      color: matColor(theme.foreground, 'hint-text'),
    },
    '.foreground-secondary-text': {
      color: matColor(theme.foreground, 'secondary-text'),
    },
    '.foreground-elevation': {
      color: matColor(theme.foreground, 'secondary-text'),
    },
    '.foreground-icon': {
      color: matColor(theme.foreground, 'icon'),
    },
    '.foreground-icons': {
      color: matColor(theme.foreground, 'icons'),
    },
    '.foreground-text': {
      color: matColor(theme.foreground, 'text'),
    },
    '.foreground-slider-min': {
      color: matColor(theme.foreground, 'slider-min'),
    },
    '.foreground-slider-off': {
      color: matColor(theme.foreground, 'slider-off'),
    },
    '.foreground-slider-off-active': {
      color: matColor(theme.foreground, 'slider-off-active'),
    },
    '.background-status-bar': {
      'background-color': matColor(theme.background, 'status-bar'),
    },
    '.background-app-bar': {
      'background-color': matColor(theme.background, 'app-bar'),
    },
    '.background-background': {
      'background-color': matColor(theme.background, 'background'),
    },
    '.background-hover': {
      'background-color': matColor(theme.background, 'hover'),
    },
    '.background-card': {
      'background-color': matColor(theme.background, 'card'),
    },
    '.background-dialog': {
      'background-color': matColor(theme.background, 'dialog'),
    },
    '.background-disabled-button': {
      'background-color': matColor(theme.background, 'disabled-button'),
    },
    '.background-raised-button': {
      'background-color': matColor(theme.background, 'raised-button'),
    },
    '.background-focused-button': {
      'background-color': matColor(theme.background, 'focused-button'),
    },
    '.background-selected-button': {
      'background-color': matColor(theme.background, 'selected-button'),
    },
    '.background-selected-disabled-button': {
      'background-color': matColor(
        theme.background,
        'selected-disabled-button'
      ),
    },
    '.background-disabled-button-toggle': {
      'background-color': matColor(theme.background, 'disabled-button-toggle'),
    },
    '.background-unselected-chip': {
      'background-color': matColor(theme.background, 'unselected-chip'),
    },
    '.background-disabled-list-option': {
      'background-color': matColor(theme.background, 'disabled-list-option'),
    },
    '.background-tooltip': {
      'background-color': matColor(theme.background, 'tooltip'),
    },
    '.background-primary': {
      'background-color': matColor(theme.primary, 500),
    },
    '.background-accent': {
      'background-color': matColor(theme.accent, 500),
    },
    '.background-warn': {
      'background-color': matColor(theme.warn, 500),
    },
    '.foreground-primary': {
      color: matColor(theme.primary, 500),
    },
    '.foreground-accent': {
      color: matColor(theme.accent, 500),
    },
    '.foreground-warn': {
      color: matColor(theme.warn, 500),
    },
  };
}
