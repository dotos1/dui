import { Palette, Theme, Foreground, Background, TypographyConfig } from './interfaces';
import { matPalette } from './mat-palette';
import { matRed, matGrey } from './palettes';
import { lightDividers, lightDisabledText, lightSecondaryText, lightFocused } from './constants';

const matDarkThemeForeground: Foreground = {
    base: 'white',
    divider: lightDividers,
    dividers: lightDividers,
    disabled: lightDisabledText,
    'disabled-button': 'rgba(white, 0.3)',
    'disabled-text': lightDisabledText,
    'hint-text': lightDisabledText,
    'secondary-text': lightSecondaryText,
    'elevation':'black',
    icon: 'rgba(white, 0.70)',
    icons: 'rgba(white, 0.70)',
    text: 'rgba(white, 0.87)',
    'slider-min': 'white',
    'slider-off': 'rgba(white, 0.3)',
    'slider-off-active': 'rgba(white, 0.3)'
};

const matDarkThemeBackground: Background = {
    'status-bar': 'black',
    'app-bar': matGrey[900],
    background: matGrey[900],
    hover: 'rgba(white, 0.04)',
    card: matGrey[800],
    dialog: matGrey[800],
    'disabled-button': matGrey[700],
    'raised-button': matGrey[800],
    'focused-button': lightFocused,
    'selected-button': matGrey[900],
    'selected-disabled-button': matGrey[800],
    'disabled-button-toggle': matGrey[700],
    'unselected-chip': matGrey[700],
    'disabled-list-option': matGrey[700],
    'tooltip': matGrey[700],
};

export function matDarkTheme(primary: Palette, accent: Palette, warn: Palette = matPalette(matRed), density:number=-1, typography:TypographyConfig): Theme {
    return {
        primary,
        accent,
        warn,
        type: 'dark',
        foreground: matDarkThemeForeground,
        background: matDarkThemeBackground,
        density,
        typography
    };
}



