import * as inspection from '../mdc/inspection';
import {
    Theme,
    Palette
} from '../interfaces/index';
import { TypographyConfig } from '../interfaces';
import { create_token_values } from '../mdc/token-utils';
import * as  toolbar from '../tokens/mat/_toolbar';


function _palette_styles($theme, $palette_name) {
    return {
        ...create_token_values(
            toolbar.$prefix,
            toolbar.private_get_color_palette_color_tokens(
                inspection.get_theme_color($theme, $palette_name),
                inspection.get_theme_color($theme, $palette_name, "default-contrast")
            )
      )
    }
  }
function base(theme: Theme): Object {
    return{
    }
}
  
function color(theme: Theme): Object {
    return{
        ...create_token_values(toolbar.$prefix,toolbar.get_color_tokens(theme)),
        "&.mat-primary": {
            ..._palette_styles(theme, 'primary')
        },
        "&.mat-accent": {
            ..._palette_styles(theme, 'accent')
        },
        "&.mat-warn": {
            ..._palette_styles(theme, 'warn')
        }
    }
}
function density(theme: Theme): Object {
    return{
        ...create_token_values(toolbar.$prefix, toolbar.get_density_tokens(theme))
    }
}
function typography(theme: TypographyConfig): Object {
    return{
        ...create_token_values(toolbar.$prefix,toolbar.get_typography_tokens(theme))
    }
}
export function matToolbarTheme(theme: Theme): Object {
    return {
        '.mat-toolbar': {
            ...base(theme),
            ...color(theme),
            ...density(theme),
            ...typography(theme.typography)
        }
    };
}

