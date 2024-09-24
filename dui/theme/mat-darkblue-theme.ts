import { Palette, Theme, Foreground, Background, TypographyConfig } from './interfaces';
import { matPalette } from './mat-palette';
import { matRed, matBlueGray} from './palettes';
import { lightDividers, lightDisabledText, lightSecondaryText, lightFocused } from './constants';

const matDarkBlueThemeForeground: Foreground = {
    base: 'white',
    divider: lightDividers,
    dividers: lightDividers,
    disabled: lightDisabledText,
    'disabled-button': 'rgba(white, 0.3)',
    'disabled-text': lightDisabledText,
    'hint-text': lightDisabledText,
    'secondary-text': lightSecondaryText,
    'elevation':'black',
    icon: 'rgba(white, 0.54)',
    icons: 'rgba(white, 0.70)',
    text: 'rgba(white, 0.87)',
    'slider-min': 'white',
    'slider-off': 'rgba(white, 0.3)',
    'slider-off-active': 'rgba(white, 0.3)'
};


const matDarkBlueThemeBackground: Background = {
  'status-bar': 'black',
  'app-bar': matBlueGray[900],
  background: matBlueGray[900],
  hover: 'rgba(white, 0.04)',
  card: matBlueGray[800],
  dialog: matBlueGray[800],
  'disabled-button': matBlueGray[400],
  'raised-button': matBlueGray[800],
  'focused-button': lightFocused,
  'selected-button': matBlueGray[900],
  'selected-disabled-button': matBlueGray[800],
  'disabled-button-toggle': matBlueGray[700],
  'unselected-chip': matBlueGray[700],
  'disabled-list-option': matBlueGray[700],
  'tooltip': matBlueGray[700],
};


export function matDarkBlueTheme(primary: Palette, accent: Palette, warn: Palette = matPalette(matRed), density:number=-1,typography:TypographyConfig): Theme {
    return {
        primary,
        accent,
        warn,
        type: 'darkblue',
        foreground: matDarkBlueThemeForeground,
        background: matDarkBlueThemeBackground,
        density,
        typography
    };
}



