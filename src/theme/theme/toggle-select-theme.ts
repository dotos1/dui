
import { Theme } from '../interfaces';
import { matColor } from '../mat-color';

export function duiToggleSelectTheme(theme: Theme): Object {
  return {
    ".mat-button-toggle-group.mat-button-toggle-group-appearance-standard.toggle-header": {
      "background": matColor(theme.background, 'hover')
    },
    
    ".mat-button-toggle-group.mat-button-toggle-group-appearance-standard.toggle-header.mat-button-toggle.mat-button-toggle-appearance-standard": {
      "background": 'transparent',
      "color": matColor(theme.foreground, 'slider-off-active') 
    },
    ".mat-button-toggle-group.mat-button-toggle-group-appearance-standard.toggle-header.mat-button-toggle.mat-button-toggle-appearance-standard .mat-button-toggle-checked .mat-button-toggle-button": {
        "background": matColor(theme.background, 'background'),
        "color":  matColor(theme.primary, 500),
        "border":" 1px solid "+matColor(theme.primary, 500)
    },
    ".mat-button-toggle-group.mat-button-toggle-group-appearance-standard.toggle-header .mat-button-toggle.mat-button-toggle-appearance-standard.mat-button-toggle-checked .mat-button-toggle-button":{
        background:  matColor(theme.primary, 500),
        color:matColor(theme.background, 'card')
    },
    ".mat-button-toggle-group.mat-button-toggle-group-appearance-standard.tb-toggle-header.tb-fill .mat-button-toggle.mat-button-toggle-appearance-standard.mat-button-toggle-checked .mat-button-toggle-button":{
        background:matColor(theme.primary, 500),
        color:matColor(theme.background, 'card')
    },

    ".mat-button-toggle-group.mat-button-toggle-group-appearance-standard.toggle-header.invert.mat-button-toggle.mat-button-toggle-appearance-standard ":{
      color: matColor(theme.foreground, 'secondary-text') 
    },
   ".mat-button-toggle-group.mat-button-toggle-group-appearance-standard.toggle-header.invert.mat-button-toggle.mat-button-toggle-appearance-standard .mat-button-toggle-checked .mat-button-toggle-button ":{
        background:matColor(theme.background, 'card'),
        color: matColor(theme.primary, 500),
    },

    ".mat-button-toggle-group.mat-button-toggle-group-appearance-standard.toggle-header&.disabled": {
      "background": matColor(theme.background, 'hover')
    },
    ".mat-button-toggle-group.mat-button-toggle-group-appearance-standard.toggle-header&.disabled.mat-button-toggle.mat-button-toggle-appearance-standard": {
      "color": matColor(theme.foreground, 'slider-off')
    },
    ".mat-button-toggle-group.mat-button-toggle-group-appearance-standard.toggle-header&.disabled.mat-button-toggle.mat-button-toggle-appearance-standard &.mat-button-toggle-checked .mat-button-toggle-button": {
        "background": "transparent",
        "color": matColor(theme.foreground, 'slider-off-active'),
        "border-color": matColor(theme.foreground, 'slider-off-active')
    },

    ".mat-button-toggle-group.mat-button-toggle-group-appearance-standard.toggle-header.disabled.fill.mat-button-toggle.mat-button-toggle-appearance-standard &.mat-button-toggle-checked .mat-button-toggle-button": {
         "background": matColor(theme.foreground, 'divider'),
        "color": matColor(theme.foreground, 'slider-off-active'),
        "border": "transparent"
    },
    ".toggle-header-select.mat-mdc-select-arrow &:after": {
         "color": matColor(theme.foreground, 'slider-off-active') 
    }
  };
}



