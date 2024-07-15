import {
    Palette,
    Theme,
    Foreground,
    Background,
    TypographyConfig
} from './interfaces';

import { matPalette } from './mat-palette';

import {
    matRed,
    matGrey
} from './palettes';

import {
    darkDividers,
    darkDisabledText,
    darkSecondaryText,
    darkFocused
} from './constants';

// Foreground palette for light themes.
const matLightThemeForeground: Foreground = {
    base: 'black',
    divider: darkDividers,
    dividers: darkDividers,
    disabled: darkDisabledText,
    'disabled-button': 'rgba(black, 0.26)',
    'disabled-text': darkDisabledText,
    'hint-text': darkDisabledText,
    'secondary-text': darkSecondaryText,
    icon: 'rgba(black, 0.54)',
    icons: 'rgba(black, 0.54)',
    text: 'rgba(black, 0.87)',
    'elevation':'black',
    'slider-min': 'rgba(black, 0.87)',
    'slider-off': 'rgba(black, 0.26)',
    'slider-off-active': 'rgba(black, 0.38)'
};

// Background palette for dark themes.
const matLightThemeBackground: Background = {
    'status-bar': matGrey[300],
    'app-bar': matGrey[100],
    background: matGrey[50],
    hover: 'rgba(black, 0.04)',
    card: 'white',
    dialog: 'white',
    'disabled-button': 'rgba(black, 0.12)',
    'raised-button': 'white',
    'focused-button': darkFocused,
    'selected-button': matGrey[300],
    'selected-disabled-button': matGrey[400],
    'disabled-button-toggle': matGrey[200],
    'unselected-chip': matGrey[300],
    'disabled-list-option': matGrey[200],
    'tooltip': matGrey[700],
};


export function matLightTheme(primary: Palette, accent: Palette, warn: Palette = matPalette(matRed), density:number=-1,typography:TypographyConfig): Theme {
    return {
        primary,
        accent,
        warn,
        type: 'light',
        foreground: matLightThemeForeground,
        background: matLightThemeBackground,
        density,
        typography
    };
}

