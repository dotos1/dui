import { Theme } from '../interfaces/theme';
import { rgba } from '../mat-color';
import { matRippleColorOpacity } from '../constants';


export function matRippleTheme(theme: Theme): Object {
    return {
        '.mat-ripple-element': {
            'background-color': rgba(theme.foreground.base, matRippleColorOpacity)
        }
    };
}
