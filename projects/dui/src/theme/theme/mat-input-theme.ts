import { Theme } from '../interfaces/theme';
import { matColor } from '../mat-color';
import { matControlPlaceholderColor } from './mat-control-placeholder-color';
import {
    matLineHeight,
    roundRule
} from '../utils/index';

export function matInputTheme(theme: Theme): Object {
    const lineHeight: number = matLineHeight(theme.typography, 'input') as number;
    const lineSpacing: number = -(lineHeight - 1) / 2;

    return {
        '.mat-mdc-input-element:disabled': {
            "color": matColor(theme.foreground, 'disabled-text')
        },
        'input.mat-mdc-input-element':{
          "color": matColor(theme.foreground, 'text'),
          'margin-top': `${roundRule(lineSpacing)}em ` + ' !important',
        },
        '.mat-mdc-input-element': {
            'caret-color': matColor(theme.primary),
            ...inputPlaceholder(theme)
        },
        '.mat-accent .mat-mdc-input-element': {
            'caret-color': matColor(theme.accent)
        },
        '.mat-warn .mat-mdc-input-element, .mat-mdc-form-field-invalid .mat-mdc-input-element': {
            'caret-color': matColor(theme.warn)
        }
    };
}

function inputPlaceholder(theme: Theme): Object {
    const content: Object = {
        color: matControlPlaceholderColor(theme)
    };

    return {
        '&::placeholder': content,
        '&::-webkit-input-placeholder': content
    };
}
