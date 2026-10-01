import { Theme } from '../interfaces/theme';
import { matColor } from '../mat-color';

export function duiScrollbarTheme(theme: Theme): Object {
    return {
        ".ng-scrollbar-button-icon svg": {
            "fill": matColor(theme.foreground, 'icons') +" !important"
        },
        ".ng-scrollbar-button-icon &:hover": {
            "background": 'transparent' +" !important"
        },
        ".ng-scrollbar-button-icon &:hover svg": {
            "fill": matColor(theme.foreground, 'secondary-text') +" !important"
        },
        ".ng-scrollbar-button-icon &:active": {
            "background": 'transparent' +" !important"
        },
        ".ng-scrollbar-button-icon &:active svg": {
            "fill": matColor(theme.foreground, 'secondary-text') +" !important"
        },
        ".ng-scrollbar-hover &:hover, &:active ": {
            "background-color": matColor(theme.foreground, 'slider-off') +" !important"
        },
        ".ng-scrollbar-thumb": {
            "background-color": matColor(theme.foreground, 'slider-off') +" !important"
        }
    }
}
